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
        '@flexireact/core': '^2.4.0',
        '@flexireact/flexi-ui': '^2.0.1',
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
import { Button, Card, Badge, Stat, StatGroup } from '@flexireact/flexi-ui';

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by esbuild for instant builds' },
  { icon: '🎨', title: 'FlexiUI', desc: '50+ beautiful components included' },
  { icon: '📘', title: 'TypeScript', desc: 'Full type safety out of the box' },
  { icon: '🏝️', title: 'Islands', desc: 'Partial hydration for max performance' },
  { icon: '🌐', title: 'Edge Ready', desc: 'Deploy anywhere: Node, Bun, Deno, CF' },
  { icon: '🚀', title: 'SSR + PPR', desc: 'Streaming SSR & Partial Prerendering' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF9C]/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-6">v2.4 — Edge Runtime + FlexiUI</Badge>
          
          <h1 className="text-6xl font-bold mb-6">
            Build faster with{' '}
            <span className="text-[#00FF9C]">FlexiReact</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The modern React framework with TypeScript, Tailwind, SSR, Islands, 
            Edge Runtime, and 50+ UI components. Better than Next.js.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Get Started →
            </Button>
            <Button variant="outline" size="lg">
              Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <StatGroup columns={4}>
            <Stat label="Components" value="50+" />
            <Stat label="Bundle Size" value="~90kb" />
            <Stat label="Build Time" value="<1s" />
            <Stat label="Lighthouse" value="100" />
          </StatGroup>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="p-6 bg-gray-900/50 border-gray-800 hover:border-[#00FF9C]/50 transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-12 bg-gradient-to-b from-gray-900 to-gray-900/50 border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
            <p className="text-gray-400 mb-8">Create your app in seconds</p>
            <code className="block bg-black/50 rounded-lg p-4 mb-8 text-[#00FF9C]">
              npx create-flexireact my-app
            </code>
            <Button size="lg">Start Building →</Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 text-center text-gray-500">
        Built with ❤️ by FlexiReact Team
      </footer>
    </main>
  );
}
`,

    'app/loading.tsx': `import React from 'react';
import { Spinner } from '@flexireact/flexi-ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
`,

    'app/error.tsx': `'use client';

import React from 'react';
import { Button, Alert } from '@flexireact/flexi-ui';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Alert variant="error" className="max-w-md mb-8">
        <h2 className="font-bold text-lg mb-2">Something went wrong</h2>
        <p>{error.message}</p>
      </Alert>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
`,

    'app/not-found.tsx': `import React from 'react';
import { Button } from '@flexireact/flexi-ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-8xl font-bold text-[#00FF9C] mb-4">404</h1>
      <p className="text-gray-400 text-xl mb-8">Page not found</p>
      <Button asChild>
        <a href="/">← Back Home</a>
      </Button>
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
