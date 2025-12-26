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
        css: 'tailwindcss -i ./app/globals.css -o ./public/styles.css --minify',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@flexireact/core': '^3.0.0',
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

const coreFeatures = [
  { icon: '⚡', title: '2ms Cold Start', desc: 'Edge runtime with instant response times' },
  { icon: '🧩', title: '50+ UI Components', desc: 'FlexiUI ready to use out of the box' },
  { icon: '🛡️', title: 'Middleware Auth', desc: 'FlexiGuard powered authentication' },
  { icon: '🔥', title: 'Zero-config Dev', desc: 'Start coding immediately, no setup' },
  { icon: '💽', title: 'File-based API', desc: 'Intuitive API routes structure' },
  { icon: '🏝️', title: 'Islands Architecture', desc: 'Partial hydration for max performance' },
  { icon: '📘', title: 'TypeScript First', desc: 'Full type safety out of the box' },
  { icon: '🎨', title: 'Tailwind v4', desc: 'Latest CSS framework integrated' },
  { icon: '🚀', title: 'SSR + PPR', desc: 'Streaming SSR & Partial Prerendering' },
];

const timeline = [
  { step: '1', title: 'File Routing', desc: 'Create pages in app/ directory' },
  { step: '2', title: 'Layouts', desc: 'Shared UI across routes' },
  { step: '3', title: 'Islands', desc: 'Interactive components' },
  { step: '4', title: 'SSR/SSG', desc: 'Server or static rendering' },
  { step: '5', title: 'Deploy', desc: 'Ship to Edge in seconds' },
];

const benchmarks = [
  { name: 'FlexiReact', time: 2, color: '#00FF9C' },
  { name: 'Astro', time: 5, color: '#FF5D01' },
  { name: 'Next.js', time: 8, color: '#000000' },
];

const ecosystem = [
  { icon: '⚛️', name: 'FlexiUI', desc: '50+ components', link: 'https://www.npmjs.com/package/@flexireact/flexi-ui' },
  { icon: '🔐', name: 'FlexiGuard', desc: 'Auth & RBAC', link: 'https://www.npmjs.com/package/flexiguard' },
  { icon: '🧰', name: 'FlexiCLI', desc: 'Commands & scaffolding', link: 'https://www.npmjs.com/package/create-flexireact' },
  { icon: '🌐', name: 'FlexiEdge', desc: 'Deploy-ready runtime', link: 'https://github.com/flexireact/flexireact' },
];

const whyFlexiReact = [
  { icon: '🚀', title: 'Ultra-fast dev experience', desc: 'Sub-second builds with esbuild' },
  { icon: '🏝️', title: 'Islands with zero config', desc: 'Automatic partial hydration' },
  { icon: '🧩', title: 'UI components included', desc: 'FlexiUI with 50+ components' },
  { icon: '🔐', title: 'Authentication included', desc: 'FlexiGuard for auth & RBAC' },
];

const backedBy = [
  { name: 'Velcarius', logo: 'V' },
  { name: 'Rayze Sol Energy', logo: 'R' },
  { name: 'FramLink', logo: 'F' },
];

const stats = [
  { label: 'Components', value: '50+' },
  { label: 'Bundle Size', value: '~90kb' },
  { label: 'Build Time', value: '<1s' },
  { label: 'Lighthouse', value: '100' },
];

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9C]"></span>
          </span>
          <span className="text-gray-400">Introducing FlexiReact v4.0</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          The React Framework
          <br />
          <span className="bg-gradient-to-r from-[#00FF9C] via-[#00D68F] to-[#00FF9C] bg-clip-text text-transparent">
            for the Web
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          FlexiReact enables you to create full-stack web applications with TypeScript, Tailwind CSS, and modern tooling.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a 
            href="https://github.com/flexireact/flexireact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started →
          </a>
          <a 
            href="https://github.com/flexireact/flexireact#readme"
            className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Terminal Preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-gray-400">$ npx create-flexireact@latest</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-3xl mx-auto">
          {[
            { icon: '⚡', label: 'Fast Refresh' },
            { icon: '📦', label: 'File Routing' },
            { icon: '🎨', label: 'Tailwind CSS' },
            { icon: '🔒', label: 'TypeScript' },
          ].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,

    'app/loading.tsx': `import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-muted text-sm">Loading...</span>
      </div>
    </div>
  );
}
`,

    'app/error.tsx': `'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <h2 className="font-bold text-lg text-red-400">Something went wrong</h2>
        </div>
        <p className="text-muted text-sm">{error.message}</p>
      </div>
      <button 
        onClick={reset}
        className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all"
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
      <div className="text-center">
        <h1 className="text-[150px] font-bold leading-none bg-gradient-to-b from-primary to-primary/20 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-muted text-xl mb-8 -mt-4">Page not found</p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all"
        >
          ← Back Home
        </a>
      </div>
    </div>
  );
}
`,

    'app/globals.css': `@import "tailwindcss";

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