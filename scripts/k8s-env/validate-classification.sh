#!/usr/bin/env bash
# Validate infra/env/classification/base.yaml and overlays (per-key kind + defaults).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

if ! command -v ruby >/dev/null 2>&1; then
  echo "Error: ruby is required." >&2
  exit 1
fi

export BOILERPLATE_ROOT="$REPO_ROOT"

ruby <<'RUBY'
require 'set'
require 'yaml'

root = ENV.fetch('BOILERPLATE_ROOT')
base_path = File.join(root, 'infra/env/classification/base.yaml')
classification = YAML.safe_load(
  File.read(base_path),
  permitted_classes: [Symbol, Time],
  aliases: true
)
workloads = classification['workloads'] || {}
errors = []

ALLOWED_KINDS = %w[literal config secret source_only].freeze

# Optional per-var metadata (merge/render ignore; documents home override topology). See ENV-REFERENCE.md.
PERMITTED_VAR_SPEC_KEYS = %w[kind default override_role override_file derived_from local_generator].freeze
OVERRIDE_ROLES = %w[derived none].freeze
OVERRIDE_FILES = %w[info mailer auth locale user_agent db_management_superuser].freeze
SPLIT_BUCKETS = {
  'http' => %w[api web-sidecar web management-api management-web-sidecar management-web].freeze,
  'valkey' => %w[valkey-source-only valkey].freeze
}.freeze
HTTP_FILE_SPLIT_VALUES = SPLIT_BUCKETS['http']
VALKEY_FILE_SPLIT_VALUES = SPLIT_BUCKETS['valkey']
LOCAL_GENERATORS = %w[hex_32].freeze
PERMITTED_WORKLOAD_KEYS = %w[vars inherits no_env_from keys].freeze
INHERIT_ENTRY_KEYS = %w[from file_splits map].freeze

def array_to_set(arr)
  (arr || []).to_h { |k| [k, true] }
end

def intersection(a, b)
  a.keys & b.keys
end

def inherits_cycle?(workloads)
  graph = {}
  workloads.each do |name, wl|
    next unless wl.is_a?(Hash)

    edges = []
    Array(wl['inherits']).each do |e|
      next unless e.is_a?(Hash) && e['from']

      edges << e['from'].to_s
    end
    graph[name.to_s] = edges
  end

  visiting = {}
  visited = {}

  dfs = lambda do |node|
    return true if visiting[node]
    return false if visited[node]

    visiting[node] = true
    (graph[node] || []).each do |n|
      return true if dfs.call(n)
    end
    visiting[node] = false
    visited[node] = true
    false
  end

  graph.keys.any? { |n| dfs.call(n) }
end

# Vars visible for an inherit entry after file_splits filtering (matches merge-env inherit_entry_source_raw).
def flatten_inherit_filtered_source_vars(workloads, from, entry)
  wl = workloads[from]
  return {} unless wl.is_a?(Hash)

  if entry.key?('file_splits')
    fs = entry['file_splits']
    unless fs.is_a?(Array)
      return {}
    end

    allowed = fs.empty? ? Set.new : fs.map(&:to_s).to_set
  else
    allowed = nil
  end

  if SPLIT_BUCKETS.key?(from.to_s)
    out = {}
    SPLIT_BUCKETS[from.to_s].each do |split|
      next if allowed && !allowed.include?(split)

      (((wl[split] || {})['vars']) || {}).each { |k, v| out[k.to_s] = v }
    end
    out
  else
    (wl['vars'] || {}).transform_keys(&:to_s)
  end
end

def validate_var_spec_leaf(errors, label, key, spec, literals, literals_only, config, secrets)
  key = key.to_s
  unless spec.is_a?(Hash)
    errors << "#{label}: var #{key} must be a mapping with kind and default"
    return
  end

  # Kind/default come from inherited map; workload.vars may supply only override_file (anchor).
  if spec.keys.map(&:to_s) == ['override_file']
    ofile = spec['override_file']
    if ofile.nil? || ofile.to_s.strip.empty?
      errors << "#{label}: var #{key} missing non-empty override_file"
      return
    end
    unless OVERRIDE_FILES.include?(ofile.to_s)
      errors << "#{label}: var #{key} has invalid override_file #{ofile.inspect} (use logical name: #{OVERRIDE_FILES.join(', ')})"
    end
    return
  end

  kind = spec['kind']
  if kind.nil? || kind.empty?
    errors << "#{label}: var #{key} missing kind"
    return
  end

  unless ALLOWED_KINDS.include?(kind)
    errors << "#{label}: var #{key} has invalid kind #{kind.inspect}"
    return
  end

  unless spec.key?('default')
    errors << "#{label}: var #{key} missing default"
    return
  end

  spec.each_key do |meta_key|
    next if PERMITTED_VAR_SPEC_KEYS.include?(meta_key)

    errors << "#{label}: var #{key} has unknown key #{meta_key.inspect} (permitted: #{PERMITTED_VAR_SPEC_KEYS.join(', ')})"
  end

  if spec.key?('file_split') && !spec['file_split'].to_s.empty?
    errors << "#{label}: var #{key} must not use file_split (http and valkey split workloads use split bucket keys; other workloads omit it)"
  end

  orole = spec['override_role']
  unless orole.nil? || orole.to_s.empty?
    os = orole.to_s
    if os == 'anchor'
      errors << "#{label}: var #{key} override_role anchor is redundant; use override_file only (omit override_role)"
    elsif !OVERRIDE_ROLES.include?(os)
      errors << "#{label}: var #{key} has invalid override_role #{orole.inspect}"
    end
  end

  ofile = spec['override_file']
  unless ofile.nil? || ofile.to_s.empty?
    unless OVERRIDE_FILES.include?(ofile.to_s)
      errors << "#{label}: var #{key} has invalid override_file #{ofile.inspect} (use logical name: #{OVERRIDE_FILES.join(', ')})"
    end
  end

  dfrom = spec['derived_from']
  case orole.to_s
  when 'derived'
    if dfrom.nil? || dfrom.to_s.strip.empty?
      errors << "#{label}: var #{key} override_role derived requires non-empty derived_from"
    end
  when 'none'
    errors << "#{label}: var #{key} has derived_from but override_role is none" if dfrom && !dfrom.to_s.strip.empty?
    errors << "#{label}: var #{key} has override_file but override_role is none" if ofile && !ofile.to_s.empty?
  end

  if dfrom && !dfrom.to_s.strip.empty?
    unless orole.to_s == 'derived'
      errors << "#{label}: var #{key} has derived_from; set override_role to derived"
    end
  end
  if ofile && !ofile.to_s.empty? && orole.to_s == 'derived'
    errors << "#{label}: var #{key} has override_file; derived keys must not use override_file"
  end

  lgen = spec['local_generator']
  unless lgen.nil? || lgen.to_s.empty?
    unless LOCAL_GENERATORS.include?(lgen.to_s)
      errors << "#{label}: var #{key} has invalid local_generator #{lgen.inspect} (use: #{LOCAL_GENERATORS.join(', ')})"
    end
    unless kind == 'secret'
      errors << "#{label}: var #{key} has local_generator but kind is #{kind.inspect} (must be secret)"
    end
  end

  case kind
  when 'literal'
    literals[key] = true
  when 'source_only'
    literals_only[key] = true
  when 'config'
    config[key] = true
  when 'secret'
    secrets[key] = true
  end
end

validate_inherits_for_workload = lambda do |wl_name, inherits|
  return if inherits.nil?

  unless inherits.is_a?(Array)
    errors << "Workload #{wl_name}: inherits must be an array of mappings"
    return
  end

  inherits.each_with_index do |entry, idx|
    unless entry.is_a?(Hash)
      errors << "Workload #{wl_name}: inherits[#{idx}] must be a mapping with from:"
      next
    end

    entry.each_key do |ek|
      next if INHERIT_ENTRY_KEYS.include?(ek)

      errors << "Workload #{wl_name}: inherits[#{idx}] has unknown key #{ek.inspect} (permitted: #{INHERIT_ENTRY_KEYS.join(', ')})"
    end

    from = entry['from']
    if from.nil? || from.to_s.strip.empty?
      errors << "Workload #{wl_name}: inherits[#{idx}] requires non-empty from:"
      next
    end

    from = from.to_s
    unless workloads.key?(from)
      errors << "Workload #{wl_name}: inherits[#{idx}] from=#{from.inspect} is not a defined workload"
    end

    if entry.key?('file_splits')
      unless %w[valkey http].include?(from)
        errors << "Workload #{wl_name}: inherits[#{idx}] file_splits is only allowed when from is valkey or http"
      end
      fs = entry['file_splits']
      unless fs.is_a?(Array)
        errors << "Workload #{wl_name}: inherits[#{idx}] file_splits must be an array"
      else
        allowed_splits =
          case from
          when 'http' then HTTP_FILE_SPLIT_VALUES
          when 'valkey' then VALKEY_FILE_SPLIT_VALUES
          else
            []
          end
        fs.each do |s|
          s = s.to_s
          unless allowed_splits.include?(s)
            errors << "Workload #{wl_name}: inherits[#{idx}] file_splits has invalid value #{s.inspect} (for #{from}: #{allowed_splits.join(', ')})"
          end
        end
      end
    end

    next unless from && workloads.key?(from)

    if entry.key?('remap')
      errors << "Workload #{wl_name}: inherits[#{idx}] uses removed key remap (use map: SourceName: TargetName)"
    end
    if entry.key?('aliases')
      errors << "Workload #{wl_name}: inherits[#{idx}] uses removed key aliases (list every import under map)"
    end

    unless entry.key?('map')
      errors << "Workload #{wl_name}: inherits[#{idx}] requires map (non-empty source var name => target var name)"
      next
    end

    mmap = entry['map']
    unless mmap.is_a?(Hash) && !mmap.empty?
      errors << "Workload #{wl_name}: inherits[#{idx}] map must be a non-empty mapping"
      next
    end

    src_vars = flatten_inherit_filtered_source_vars(workloads, from, entry)
    map_sources = []
    map_targets = []
    mmap.each do |src_key, tgt_key|
      sk = src_key.to_s
      tk = tgt_key.to_s
      if sk.strip.empty? || tk.strip.empty?
        errors << "Workload #{wl_name}: inherits[#{idx}] map entries must use non-empty source and target strings"
        next
      end
      map_sources << sk
      map_targets << tk
      unless src_vars.key?(sk)
        errors << "Workload #{wl_name}: inherits[#{idx}] map source #{sk.inspect} is not in filtered vars from workload #{from.inspect} (check file_splits)"
      end
    end
    if map_sources.uniq.length != map_sources.length
      errors << "Workload #{wl_name}: inherits[#{idx}] map has duplicate source var names"
    end
    if map_targets.uniq.length != map_targets.length
      errors << "Workload #{wl_name}: inherits[#{idx}] map has duplicate target var names"
    end
  end
end

unless classification['version']
  errors << 'Missing top-level version'
end

if inherits_cycle?(workloads)
  errors << 'inherits: cycle detected in workload inheritance graph'
end

workloads.each do |name, wl|
  next unless wl.is_a?(Hash)

  if SPLIT_BUCKETS.key?(name.to_s)
    allowed_split_top = SPLIT_BUCKETS[name.to_s]

    wl.each_key do |wk|
      unless allowed_split_top.include?(wk.to_s)
        errors << "Workload #{name}: unknown top-level key #{wk.inspect} (expected: #{allowed_split_top.join(', ')})"
      end
    end

    inh = wl['inherits']
    if inh.is_a?(Array) && !inh.empty?
      errors << "Workload #{name}: split-catalogued workload must not use inherits"
    elsif !inh.nil? && !inh.is_a?(Array)
      errors << "Workload #{name}: split-catalogued workload must not use inherits (omit or use [])"
    end
    errors << "Workload #{name}: split-catalogued workload must not set no_env_from" if wl['no_env_from']
    errors << "Workload #{name}: split-catalogued workload must not set keys" if wl.key?('keys')

    literals = {}
    literals_only = {}
    config = {}
    secrets = {}
    seen = {}

    SPLIT_BUCKETS[name.to_s].each do |split|
      unless wl.key?(split)
        errors << "Workload #{name}: missing split bucket #{split.inspect}"
        next
      end
      node = wl[split]
      unless node.is_a?(Hash)
        errors << "Workload #{name}: split #{split} must be a mapping"
        next
      end
      node.each_key do |nk|
        unless nk.to_s == 'vars'
          errors << "Workload #{name}: split #{split} unknown key #{nk.inspect} (only vars permitted)"
        end
      end
      vars = node['vars']
      unless vars.is_a?(Hash) && !vars.empty?
        errors << "Workload #{name} split #{split}: vars must be a non-empty mapping"
        next
      end
      vars.each do |var_key, spec|
        vk = var_key.to_s
        if seen.key?(vk)
          errors << "Workload #{name}: var #{vk.inspect} appears in multiple splits (#{seen[vk]} and #{split})"
        else
          seen[vk] = split
        end
        validate_var_spec_leaf(errors, "Workload #{name} split #{split}", vk, spec, literals, literals_only, config, secrets)
      end
    end

    lit_set = literals
    lo_set = literals_only
    cfg_set = config
    sec_set = secrets
    intersection(lit_set, cfg_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both literal and config"
    end
    intersection(lit_set, sec_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both literal and secret"
    end
    intersection(cfg_set, sec_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both config and secret"
    end
    intersection(lo_set, cfg_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both source_only and config"
    end
    intersection(lo_set, sec_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both source_only and secret"
    end
    intersection(lo_set, lit_set).each do |k|
      errors << "Workload #{name}: key #{k} appears as both source_only and literal"
    end

    next
  end

  wl.each_key do |wk|
    next if PERMITTED_WORKLOAD_KEYS.include?(wk)

    errors << "Workload #{name}: unknown top-level key #{wk.inspect} (permitted: #{PERMITTED_WORKLOAD_KEYS.join(', ')})"
  end

  inherits = wl['inherits']
  validate_inherits_for_workload.call(name, inherits)

  vars = wl['vars'] || {}

  inherits_nonempty = inherits.is_a?(Array) && !inherits.empty?
  if vars.empty? && !wl['no_env_from'] && !inherits_nonempty
    errors << "Workload #{name}: missing vars (or set no_env_from, or add non-empty inherits)"
    next
  end

  literals = {}
  literals_only = {}
  config = {}
  secrets = {}

  vars.each do |key, spec|
    validate_var_spec_leaf(errors, "Workload #{name}", key.to_s, spec, literals, literals_only, config, secrets)
  end

  lit_set = literals
  lo_set = literals_only
  cfg_set = config
  sec_set = secrets

  intersection(lit_set, cfg_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both literal and config"
  end
  intersection(lit_set, sec_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both literal and secret"
  end
  intersection(cfg_set, sec_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both config and secret"
  end
  intersection(lo_set, cfg_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both source_only and config"
  end
  intersection(lo_set, sec_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both source_only and secret"
  end
  intersection(lo_set, lit_set).each do |k|
    errors << "Workload #{name}: key #{k} appears as both source_only and literal"
  end

  if wl['no_env_from']
    unless config.empty? && secrets.empty?
      errors << "Workload #{name}: no_env_from workloads must only use literal or source_only kinds"
    end
  end
end

if errors.empty?
  puts 'validate-classification: OK'
  exit 0
end

warn errors.join("\n")
exit 1
RUBY
