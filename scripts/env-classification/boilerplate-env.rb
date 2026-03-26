#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'lib/boilerplate_env_merge'

def usage(msg = nil)
  warn("Error: #{msg}") if msg
  warn <<~USAGE
    Usage:
      boilerplate-env.rb merge-env --profile PROFILE --workload NAME [--extra-env PATH]... [--output PATH]
      boilerplate-env.rb write-valkey-split --profile PROFILE --valkey-source-only-out P --valkey-out P
    merge-env: prints KEY=value lines (classification var order) to stdout unless --output is set.
  USAGE
  exit 1
end

args = ARGV.dup
cmd = args.shift
usage('missing command') if cmd.nil? || cmd.empty?

case cmd
when 'merge-env', 'print-env'
  profile = nil
  workload = nil
  extra = []
  output_path = nil

  until args.empty?
    case args.shift
    when '--profile'
      profile = args.shift
    when '--workload'
      workload = args.shift
    when '--extra-env'
      extra << args.shift
    when '--output'
      output_path = args.shift
    when '-h', '--help'
      usage
    else
      usage('unknown arg')
    end
  end

  usage('missing --profile') if profile.nil? || profile.empty?
  usage('missing --workload') if workload.nil? || workload.empty?

  classification = BoilerplateEnvMerge.merged_classification(profile)
  flat = BoilerplateEnvMerge.flatten_workload_env(classification, workload)
  merged = BoilerplateEnvMerge.apply_env_file_overlays(flat, extra)
  merged = BoilerplateEnvMerge.apply_locale_next_public_sync(merged, workload)
  merged = BoilerplateEnvMerge.apply_auth_mode_next_public_sync(merged, workload)
  merged = BoilerplateEnvMerge.apply_info_next_public_sync(merged, workload)
  merged = BoilerplateEnvMerge.reorder_env_map_to_workload_vars(merged, classification, workload)

  if output_path
    BoilerplateEnvMerge.write_env_file(output_path, merged)
  else
    merged.each_key do |k|
      puts BoilerplateEnvMerge.format_env_line(k, merged[k])
    end
  end
when 'write-valkey-split'
  profile = nil
  valkey_source_only_out = nil
  valkey_out = nil

  until args.empty?
    case args.shift
    when '--profile'
      profile = args.shift
    when '--valkey-source-only-out'
      valkey_source_only_out = args.shift
    when '--valkey-out'
      valkey_out = args.shift
    when '-h', '--help'
      usage
    else
      usage('unknown arg')
    end
  end

  usage('missing --profile') if profile.nil? || profile.empty?
  usage('missing --valkey-source-only-out') if valkey_source_only_out.nil? || valkey_source_only_out.empty?
  usage('missing --valkey-out') if valkey_out.nil? || valkey_out.empty?

  classification = BoilerplateEnvMerge.merged_classification(profile)
  flat = BoilerplateEnvMerge.flatten_workload_env(classification, 'valkey')
  vk_so_map, vk_map = BoilerplateEnvMerge.split_valkey_env(flat, classification)
  BoilerplateEnvMerge.write_env_file(valkey_source_only_out, vk_so_map)
  BoilerplateEnvMerge.write_env_file(valkey_out, vk_map)
else
  usage("unknown command: #{cmd}")
end
