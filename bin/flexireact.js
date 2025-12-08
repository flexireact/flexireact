#!/usr/bin/env node

/**
 * FlexiReact CLI Entry Point
 * Uses tsx to run TypeScript CLI directly
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cliPath = join(__dirname, '..', 'cli', 'index.ts');

// Run the CLI with tsx
const result = spawnSync('npx', ['tsx', cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 0);
