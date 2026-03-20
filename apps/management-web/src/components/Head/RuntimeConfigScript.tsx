import type { ManagementWebRuntimeConfig } from '../../config/runtime-config';

const serialize = (config: ManagementWebRuntimeConfig): string =>
  JSON.stringify(config).replace(/</g, '\\u003c');

const buildScript = (config: ManagementWebRuntimeConfig): string =>
  `globalThis.__BOILERPLATE_MANAGEMENT_RUNTIME_CONFIG__ = ${serialize(config)};`;

export default function RuntimeConfigScript({
  runtimeConfig,
}: {
  runtimeConfig: ManagementWebRuntimeConfig;
}) {
  const script = buildScript(runtimeConfig);
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
