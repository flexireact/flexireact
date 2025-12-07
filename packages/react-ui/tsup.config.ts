import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    treeshake: true,
  },
  // Tailwind plugin
  {
    entry: ['src/tailwind.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    external: ['tailwindcss'],
  },
  // CLI
  {
    entry: ['src/cli/index.ts'],
    format: ['cjs'],
    dts: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
