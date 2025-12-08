/**
 * Minimal Template - Bare minimum FlexiReact setup
 */

import type { TemplateFiles } from './index.js';

export function minimalTemplate(projectName: string): TemplateFiles {
  return {
    'package.json': JSON.stringify({
      name: projectName,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'flexireact dev',
        build: 'flexireact build',
        start: 'flexireact start',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@flexireact/core': '^2.0.0',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.3.0',
      },
    }, null, 2),

    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['DOM', 'DOM.Iterable', 'ES2022'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules', '.flexi'],
    }, null, 2),

    'flexireact.config.js': `export default {
  server: { port: 3000 }
};
`,

    'routes/(public)/home.tsx': `import React from 'react';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to FlexiReact
      </h1>
      <p style={{ color: '#666' }}>
        Edit <code>routes/(public)/home.tsx</code> to get started.
      </p>
    </div>
  );
}
`,

    'public/.gitkeep': '',

    '.gitignore': `node_modules/
.flexi/
dist/
*.log
`,
  };
}
