#!/usr/bin/env ruby
# frozen_string_literal: true

# Renders Kubernetes ConfigMap and/or Secret YAML from classification + merged env file.

require 'yaml'

def usage(msg = nil)
  warn("Error: #{msg}") if msg
  warn <<~USAGE
    Usage: render_k8s_env.rb --workload NAME --merged-env PATH --namespace NS --environment ENV \\
      --resource-suffix SUFFIX [--dry-run]
  USAGE
  exit 1
end

def yaml_escape_double_quoted(str)
  str.to_s.gsub('\\', '\\\\').gsub('"', '\\"').gsub("\n", '\\n')
end

def config_map_yaml(name, namespace, labels, data)
  lines = []
  lines << 'apiVersion: v1'
  lines << 'kind: ConfigMap'
  lines << 'metadata:'
  lines << "  name: #{name}"
  lines << "  namespace: #{namespace}"
  lines << '  labels:'
  labels.each { |k, v| lines << "    #{k}: \"#{v}\"" }
  lines << 'data:'
  data.each do |k, v|
    lines << "  #{k}: \"#{yaml_escape_double_quoted(v)}\""
  end
  lines.join("\n") + "\n"
end

def secret_yaml(name, namespace, labels, string_data)
  lines = []
  lines << 'apiVersion: v1'
  lines << 'kind: Secret'
  lines << 'metadata:'
  lines << "  name: #{name}"
  lines << "  namespace: #{namespace}"
  lines << '  labels:'
  labels.each { |k, v| lines << "    #{k}: \"#{v}\"" }
  lines << 'type: Opaque'
  lines << 'stringData:'
  string_data.each do |k, v|
    lines << "  #{k}: \"#{yaml_escape_double_quoted(v)}\""
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
workload = nil
merged_env = nil
namespace = 'boilerplate-alpha'
environment = 'alpha'
resource_suffix = nil
emit = 'both' # both | configmap | secret

until args.empty?
  case args.shift
  when '--workload'
    workload = args.shift
  when '--merged-env'
    merged_env = args.shift
  when '--namespace'
    namespace = args.shift
  when '--environment'
    environment = args.shift
  when '--resource-suffix'
    resource_suffix = args.shift
  when '--emit'
    emit = args.shift
  when '-h', '--help'
    usage
  else
    usage('unknown arg')
  end
end

usage('missing --workload') if workload.nil? || workload.empty?
usage('missing --merged-env') if merged_env.nil?
usage('missing --resource-suffix') if resource_suffix.nil? || resource_suffix.empty?

root = File.expand_path('../..', __dir__)
class_path = File.join(root, 'infra/k8s/env/classification.yaml')
classification = YAML.safe_load(File.read(class_path), permitted_classes: [Symbol, Time])
wl = classification['workloads'][workload]
usage("unknown workload: #{workload}") unless wl

if wl['no_env_from']
  warn("SKIP no_env_from workload=#{workload}")
  exit 3
end

literals = (wl['literals'] || []).to_h { |k| [k, true] }
literals_only = (wl['literals_only_in_source'] || []).to_h { |k| [k, true] }
keys_meta = wl['keys'] || {}

env_map = parse_env_file(merged_env)

config_data = {}
secret_data = {}

keys_meta.each do |key, tier|
  next unless env_map.key?(key)

  next if literals[key] || literals_only[key]

  case tier
  when 'config'
    config_data[key] = env_map[key]
  when 'secret'
    secret_data[key] = env_map[key]
  else
    warn("Unknown tier for #{key}: #{tier}")
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
when 'both'
  if config_data.empty? && secret_data.empty?
    warn("No config or secret keys for workload #{workload} (after filters).")
    exit 1
  end
  parts = []
  parts << config_map_yaml(cm_name, namespace, labels, config_data) unless config_data.empty?
  parts << secret_yaml(sec_name, namespace, labels, secret_data) unless secret_data.empty?
  print parts.join("---\n")
when 'configmap'
  if config_data.empty?
    warn("SKIP no config keys workload=#{workload}")
    exit 4
  end
  print config_map_yaml(cm_name, namespace, labels, config_data)
when 'secret'
  if secret_data.empty?
    warn("SKIP no secret keys workload=#{workload}")
    exit 4
  end
  print secret_yaml(sec_name, namespace, labels, secret_data)
else
  usage('--emit must be both|configmap|secret')
end
exit 0
