import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    globalSetup: ['src/test/global-setup.mjs'],
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    pool: 'forks',
    fileParallelism: false,
    minWorkers: 1,
    maxWorkers: 3, // cap at 3 to avoid socket hang ups / connection pressure
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  esbuild: {
    target: 'ES2022',
  },
});
