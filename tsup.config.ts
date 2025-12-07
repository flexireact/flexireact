import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'cli/index': 'cli/index.ts',
    'core/index': 'core/index.ts',
    'core/server/index': 'core/server/index.ts',
    'core/client/index': 'core/client/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node18',
  platform: 'node',
  splitting: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
