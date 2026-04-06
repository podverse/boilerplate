#!/usr/bin/env ruby
# frozen_string_literal: true

# Renders a Kustomize bundle (configMapGenerator files: + kustomization.yaml) and/or Secret YAML from
# classification + merged env file.

require 'fileutils'

require_relative '../env-classification/lib/boilerplate_env_merge'

# Strategic-merge patch target: classification env group name => [Deployment metadata.name, container name]
DEPLOYMENT_PATCH_TARGETS = {
  'api' => %w[api api],
  'db' => %w[postgres postgres],
  'management-api' => %w[management-api management-api],
  'management-web-sidecar' => %w[management-web-sidecar management-web-sidecar],
  'valkey' => %w[valkey valkey],
  'web-sidecar' => %w[web-sidecar web-sidecar]
}.freeze

def usage(msg = nil)
  warn("Error: #{msg}") if msg
  warn <<~USAGE
    Usage: render_k8s_env.rb --group NAME --merged-env PATH --namespace NS --environment ENV \\
      --resource-suffix SUFFIX [--classification-overlay PATH] --emit MODE \\
      [--bundle-dir PATH]

    --emit: config-bundle | secret | secret-env-patch (required)
    --bundle-dir: directory to write (required for --emit config-bundle); one file per config key plus kustomization.yaml.
    Optional --classification-overlay: same GitOps YAML passed to boilerplate-env.rb merge-env for this render.
  USAGE
  exit 1
end

def yaml_escape_double_quoted(str)
  str.to_s.gsub('\\', '\\\\').gsub('"', '\\"').gsub("\n", '\\n')
end

# Writes bundle_dir/kustomization.yaml and bundle_dir/<KEY> per entry (raw UTF-8 values; Kustomize files:).
def write_config_bundle(bundle_dir, cm_name, namespace, config_data)
  FileUtils.rm_rf(bundle_dir)
  FileUtils.mkdir_p(bundle_dir)
  sorted_keys = config_data.keys.sort
  sorted_keys.each do |k|
    File.write(File.join(bundle_dir, k), config_data[k].to_s, encoding: 'UTF-8')
  end
  lines = []
  lines << 'apiVersion: kustomize.config.k8s.io/v1beta1'
  lines << 'kind: Kustomization'
  lines << "namespace: #{namespace}"
  lines << 'generatorOptions:'
  lines << '  disableNameSuffixHash: true'
  lines << 'configMapGenerator:'
  lines << "  - name: #{cm_name}"
  lines << '    files:'
  sorted_keys.each do |k|
    lines << "      - #{k}"
  end
  File.write(File.join(bundle_dir, 'kustomization.yaml'), "#{lines.join("\n")}\n", encoding: 'UTF-8')
end

def secret_yaml(name, namespace, labels, string_data)
  lines = []
  lines << 'apiVersion: v1'
  lines << 'kind: Secret'
  lines << 'metadata:'
  lines << "  name: #{name}"
  lines << "  namespace: #{namespace}"
  lines << '  labels:'
  labels.each { |lk, v| lines << "    #{lk}: \"#{v}\"" }
  lines << 'type: Opaque'
  lines << 'stringData:'
  string_data.each do |k, v|
    lines << "  #{k}: \"#{yaml_escape_double_quoted(v)}\""
  end
  lines.join("\n") + "\n"
end

# Kubernetes strategic-merge patch: merge env entries by name into the named container.
def secret_env_strategic_merge_patch_yaml(deployment_name, container_name, secret_name, env_keys_sorted)
  lines = []
  lines << 'apiVersion: apps/v1'
  lines << 'kind: Deployment'
  lines << 'metadata:'
  lines << "  name: #{deployment_name}"
  lines << 'spec:'
  lines << '  template:'
  lines << '    spec:'
  lines << '      containers:'
  lines << "        - name: #{container_name}"
  lines << '          env:'
  env_keys_sorted.each do |key|
    lines << "            - name: #{key}"
    lines << '              valueFrom:'
    lines << '                secretKeyRef:'
    lines << "                  name: #{secret_name}"
    lines << "                  key: #{key}"
  end
  lines.join("\n") + "\n"
end

def parse_env_file(path)
  return {} unless File.file?(path)

  out = {}
  File.foreach(path, encoding: 'UTF-8') do |line|
    line = line.strip.sub(/\r$/, '')
    next if line.empty? || line.start_with?('#')
    next unless line =~ /\A[A-Za-z_][A-Za-z0-9_]*=/

    key, val = line.split('=', 2)
    out[key] = val.nil? ? '' : unquote(val)
  end
  out
end

def unquote(s)
  s = s.strip
  if (s.start_with?('"') && s.end_with?('"')) || (s.start_with?("'") && s.end_with?("'"))
    s[1..-2]
  else
    s
  end
end

args = ARGV.dup
group = nil
merged_env = nil
classification_overlay = nil
namespace = 'boilerplate-alpha'
environment = 'alpha'
resource_suffix = nil
emit = nil
bundle_dir = nil

until args.empty?
  case args.shift
  when '--group'
    group = args.shift
  when '--merged-env'
    merged_env = args.shift
  when '--classification-overlay'
    classification_overlay = args.shift
  when '--namespace'
    namespace = args.shift
  when '--environment'
    environment = args.shift
  when '--resource-suffix'
    resource_suffix = args.shift
  when '--emit'
    emit = args.shift
  when '--bundle-dir'
    bundle_dir = args.shift
  when '-h', '--help'
    usage
  else
    usage('unknown arg')
  end
end

usage('missing --group') if group.nil? || group.empty?
usage('missing --merged-env') if merged_env.nil?
usage('missing --resource-suffix') if resource_suffix.nil? || resource_suffix.empty?
usage('missing --emit') if emit.nil? || emit.empty?

profile = ENV['BOILERPLATE_ENV_PROFILE'] || 'remote_k8s'
classification = BoilerplateEnvMerge.merged_classification(
  profile,
  extra_overlay_path: classification_overlay
)
wl = classification.dig(BoilerplateEnvMerge::CLASSIFICATION_ENV_GROUPS_KEY, group)
usage("unknown env group: #{group}") unless wl

if wl['no_env_from']
  warn("SKIP no_env_from group=#{group}")
  exit 3
end

if wl.key?('keys')
  warn("Error: env group #{group} uses legacy 'keys:'; migrate to infra/env/classification/base.yaml vars")
  exit 1
end

effective_specs = BoilerplateEnvMerge.effective_env_group_var_specs(classification, group)
if effective_specs.empty?
  warn("Error: env group #{group} has no effective vars in classification (empty vars and inherits)")
  exit 1
end

literals, literals_only, config_keys, secret_keys =
  BoilerplateEnvMerge.derive_render_buckets(group, classification)

env_map = parse_env_file(merged_env)

config_data = {}
secret_data = {}

effective_specs.each do |key, spec|
  next unless spec.is_a?(Hash)
  next unless env_map.key?(key)
  # source_only: split/template keys (e.g. *_SOURCE_ONLY) — not injected into pods
  next if literals_only[key]

  if secret_keys[key]
    secret_data[key] = env_map[key]
  elsif config_keys[key] || literals[key]
    # kind: literal is non-secret; local .env generation may treat it separately, but K8s pods need
    # these values in ConfigMap (AUTH_MODE, user agents, cookie names, public URLs, etc.).
    config_data[key] = env_map[key]
  end
end

labels = {
  'app' => "boilerplate-#{resource_suffix}",
  'environment' => environment,
  'boilerplate.env/component' => resource_suffix
}

cm_name = "boilerplate-#{resource_suffix}-config"
sec_name = "boilerplate-#{resource_suffix}-secrets"

case emit
when 'config-bundle'
  usage('missing --bundle-dir for config-bundle') if bundle_dir.nil? || bundle_dir.empty?
  if config_data.empty?
    warn("SKIP no config keys group=#{group}")
    exit 4
  end
  write_config_bundle(bundle_dir, cm_name, namespace, config_data)
when 'secret'
  if secret_data.empty?
    warn("SKIP no secret keys group=#{group}")
    exit 4
  end
  print secret_yaml(sec_name, namespace, labels, secret_data)
when 'secret-env-patch'
  if secret_data.empty?
    warn("SKIP no secret keys group=#{group}")
    exit 4
  end
  targets = DEPLOYMENT_PATCH_TARGETS[group]
  if targets.nil?
    warn("Error: env group #{group} has no Deployment patch target (add to DEPLOYMENT_PATCH_TARGETS)")
    exit 1
  end
  deployment_name, container_name = targets
  print secret_env_strategic_merge_patch_yaml(deployment_name, container_name, sec_name, secret_data.keys.sort)
else
  usage('--emit must be config-bundle|secret|secret-env-patch')
end
exit 0
