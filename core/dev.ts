#!/usr/bin/env node

/**
 * FlexiReact Dev Server Launcher
 * This script starts the server with the JSX loader enabled
 */

import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server.js');
const loaderPath = path.join(__dirname, 'loader.js');

// Convert to file:// URLs for Windows compatibility
const loaderUrl = pathToFileURL(loaderPath).href;

// Start Node.js with the custom loader
const child = spawn(
  process.execPath,
  [
    '--import',
    `data:text/javascript,import { register } from 'node:module'; register('${loaderUrl.replace(/\\/g, '/')}', import.meta.url);`,
    serverPath
  ],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env
  }
);

child.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

// Forward signals to child process
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
