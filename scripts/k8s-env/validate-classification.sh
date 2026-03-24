#!/usr/bin/env bash
# Ensure every KEY= in .env.example files referenced by classification.yaml is classified.
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
require 'yaml'

root = ENV.fetch('BOILERPLATE_ROOT')
class_path = File.join(root, 'infra/k8s/env/classification.yaml')
classification = YAML.safe_load(File.read(class_path), permitted_classes: [Symbol, Time])
workloads = classification['workloads'] || {}

def keys_from_env_example(path)
  return [] unless File.file?(path)
  keys = []
  File.foreach(path, encoding: 'UTF-8') do |line|
    line = line.strip.sub(/\r$/, '')
    next if line.empty? || line.start_with?('#')
    next unless line =~ /\A([A-Za-z_][A-Za-z0-9_]*)=/
    keys << $1
  end
  keys.uniq
end

errors = []

workloads.each do |name, wl|
  next unless wl.is_a?(Hash)

  sources = wl['source_files'] || []
  literals = (wl['literals'] || []).to_h { |k| [k, true] }
  lit_only = (wl['literals_only_in_source'] || []).to_h { |k| [k, true] }
  keys_meta = wl['keys'] || {}

  if wl['no_env_from']
    sources.each do |rel|
      path = File.join(root, rel)
      keys_from_env_example(path).each do |k|
        next if literals[k] || lit_only[k]

        errors << "Workload #{name}: key #{k} from #{rel} has no_env_from but is not in literals/literals_only_in_source"
      end
    end
    next
  end

  sources.each do |rel|
    path = File.join(root, rel)
    keys_from_env_example(path).each do |k|
      next if literals[k] || lit_only[k]
      next if keys_meta.key?(k)

      errors << "Workload #{name}: key #{k} from #{rel} is missing from classification keys (or literals/literals_only_in_source)"
    end
  end

  keys_meta.each do |k, tier|
    unless %w[config secret].include?(tier.to_s)
      errors << "Workload #{name}: key #{k} has invalid tier #{tier.inspect}"
    end
  end
end

if errors.empty?
  puts 'validate-classification: OK'
  exit 0
else
  warn errors.join("\n")
  exit 1
end
RUBY
