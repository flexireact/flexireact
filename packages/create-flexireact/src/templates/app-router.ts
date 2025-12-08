/**
 * App Router Template - Next.js style app/ directory routing
 */

import type { TemplateFiles } from './index.js';

export function appRouterTemplate(projectName: string): TemplateFiles {
  return {
    'package.json': JSON.stringify({
      name: projectName,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'npm run css && flexireact dev',
        build: 'npm run css && flexireact build',
        start: 'flexireact start',
        css: 'npx @tailwindcss/cli -i ./app/globals.css -o ./public/styles.css --minify',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@flexireact/core': '^2.0.0',
        clsx: '^2.1.0',
        'tailwind-merge': '^2.2.0',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        typescript: '^5.3.0',
        tailwindcss: '^4.0.0',
        '@tailwindcss/cli': '^4.0.0',
        '@tailwindcss/postcss': '^4.0.0',
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
        baseUrl: '.',
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules', '.flexi', 'public'],
    }, null, 2),

    'postcss.config.js': `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`,

    'flexireact.config.js': `export default {
  server: { port: 3000 },
  styles: ['/styles.css'],
};
`,

    // App directory
    'app/layout.tsx': `import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.svg" />
        <title>FlexiReact App</title>
      </head>
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
`,

    'app/page.tsx': `import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#00FF9C] rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-black font-bold text-3xl">F</span>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-[#00FF9C]">FlexiReact</span>
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Using App Router with Next.js style routing
        </p>
        
        <div className="flex gap-4 justify-center">
          <a 
            href="https://github.com/nicksdev/flexireact"
            className="px-6 py-3 bg-[#00FF9C] text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Get Started →
          </a>
          <a 
            href="https://github.com/nicksdev/flexireact"
            className="px-6 py-3 border border-gray-700 rounded-lg hover:border-[#00FF9C] transition"
          >
            Documentation
          </a>
        </div>
      </div>
    </main>
  );
}
`,

    'app/loading.tsx': `import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#00FF9C] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
`,

    'app/error.tsx': `'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-8">{error.message}</p>
      <button 
        onClick={reset}
        className="px-6 py-3 bg-[#00FF9C] text-black font-semibold rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
`,

    'app/not-found.tsx': `import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-[#00FF9C] mb-4">404</h1>
      <p className="text-gray-400 text-xl mb-8">Page not found</p>
      <a 
        href="/"
        className="px-6 py-3 bg-[#00FF9C] text-black font-semibold rounded-lg"
      >
        ← Back Home
      </a>
    </div>
  );
}
`,

    'app/globals.css': `@import "tailwindcss" source("..");

@theme {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-primary: #00FF9C;
  --font-sans: "Inter", system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
}
`,

    // Lib
    'lib/utils.ts': `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,

    // Public
    'public/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00FF9C"/>
      <stop offset="100%" style="stop-color:#00D68F"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#0a0a0a"/>
  <text x="50" y="68" font-family="system-ui" font-size="50" font-weight="900" fill="url(#grad)" text-anchor="middle">F</text>
</svg>`,

    'public/.gitkeep': '',

    '.gitignore': `node_modules/
.flexi/
dist/
public/styles.css
*.log
.env
.env.local
`,
  };
}
