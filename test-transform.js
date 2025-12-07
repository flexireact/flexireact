import { transformSync } from 'esbuild';
import fs from 'fs';

const source = fs.readFileSync('./myapp2/pages/index.jsx', 'utf-8');

const result = transformSync(source, {
  loader: 'jsx',
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'react',
  target: 'node18'
});

console.log('Transformed code:');
console.log(result.code.slice(0, 500));
