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

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by esbuild for instant builds and HMR' },
  { icon: '🎨', title: 'FlexiUI', desc: '50+ beautiful, accessible components' },
  { icon: '📘', title: 'TypeScript', desc: 'Full type safety out of the box' },
  { icon: '🏝️', title: 'Islands', desc: 'Partial hydration for max performance' },
  { icon: '🌐', title: 'Edge Ready', desc: 'Deploy anywhere: Node, Bun, Deno, CF' },
  { icon: '🚀', title: 'SSR + PPR', desc: 'Streaming SSR & Partial Prerendering' },
];

const stats = [
  { label: 'Components', value: '50+' },
  { label: 'Bundle Size', value: '~90kb' },
  { label: 'Build Time', value: '<1s' },
  { label: 'Lighthouse', value: '100' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 px-4 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FF9C]/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00FF9C]/5 rounded-full blur-[120px]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-[#00FF9C] to-[#00D68F] shadow-lg shadow-[#00FF9C]/20">
            <span className="text-3xl font-black text-black">F</span>
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#00FF9C] animate-pulse" />
            <span className="text-sm text-gray-300">v3.0 — The Future of React</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Build faster with
            <span className="block mt-2 bg-gradient-to-r from-[#00FF9C] via-[#00D68F] to-[#00FF9C] bg-clip-text text-transparent">
              FlexiReact
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern React framework with TypeScript, Tailwind, SSR, Islands, 
            Edge Runtime, and 50+ UI components. <span className="text-white font-medium">Better than Next.js.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/flexireact/flexireact" 
               className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00FF9C] text-black font-semibold rounded-xl hover:bg-[#00D68F] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00FF9C]/25">
              Get Started
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="https://github.com/flexireact/flexireact#readme"
               className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-[#00FF9C]/50 transition-all">
              Documentation
            </a>
          </div>

          {/* Terminal */}
          <div className="mt-16 max-w-lg mx-auto">
            <div className="rounded-xl bg-[#111] border border-gray-800 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0d] border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-500 ml-2">Terminal</span>
              </div>
              <div className="p-4 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#00FF9C]">$</span>
                  <span className="text-gray-300">npx create-flexireact my-app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                <div className="text-3xl sm:text-4xl font-bold text-[#00FF9C] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400">A complete toolkit for building modern React apps</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-[#00FF9C]/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#00FF9C]/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gray-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF9C]/10 rounded-full blur-[100px]" />
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to build?</h2>
              <p className="text-gray-400 mb-8">Create your first FlexiReact app in seconds</p>
              
              <div className="inline-block p-4 rounded-xl bg-black/50 border border-gray-800 font-mono text-sm mb-8">
                <span className="text-[#00FF9C]">$</span>
                <span className="text-gray-300 ml-2">npx create-flexireact my-app</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://github.com/flexireact/flexireact"
                   className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00FF9C] text-black font-semibold rounded-xl hover:bg-[#00D68F] transition-all">
                  Start Building →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FF9C] flex items-center justify-center">
              <span className="text-sm font-bold text-black">F</span>
            </div>
            <span className="font-semibold">FlexiReact</span>
          </div>
          <p className="text-sm text-gray-500">Built with ❤️ by FlexiReact Team</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/flexireact/flexireact" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            <a href="https://discord.gg/rFSZxFtpAA" className="text-gray-400 hover:text-white transition-colors">Discord 💬</a>
            <a href="https://npmjs.com/package/@flexireact/core" className="text-gray-400 hover:text-white transition-colors">npm</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
`,

    'app/loading.tsx': `import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00FF9C]/20 border-t-[#00FF9C] rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    </div>
  );
}
`,

    'app/error.tsx': `'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <div className="max-w-md w-full p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <h2 className="font-bold text-lg text-red-400">Something went wrong</h2>
        </div>
        <p className="text-gray-400 text-sm">{error.message}</p>
      </div>
      <button 
        onClick={reset}
        className="px-6 py-3 bg-[#00FF9C] text-black font-semibold rounded-xl hover:bg-[#00D68F] transition-all"
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <div className="text-center">
        <h1 className="text-[150px] font-bold leading-none bg-gradient-to-b from-[#00FF9C] to-[#00FF9C]/20 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-gray-400 text-xl mb-8 -mt-4">Page not found</p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF9C] text-black font-semibold rounded-xl hover:bg-[#00D68F] transition-all"
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
