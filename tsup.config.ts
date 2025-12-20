import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'cli/index': 'cli/index.ts',
    'core/index': 'core/index.ts',
    'core/server/index': 'core/server/index.ts',
    'core/client/index': 'core/client/index.ts',
    'core/start-dev': 'core/start-dev.ts',
    'core/start-prod': 'core/start-prod.ts',
    'core/config': 'core/config.ts',
    'core/build/index': 'core/build/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node18',
  platform: 'node',
  splitting: false,
  shims: true,
});
