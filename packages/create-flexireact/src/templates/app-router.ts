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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Premium Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FF9C] to-[#00D68F] flex items-center justify-center shadow-lg shadow-[#00FF9C]/20">
              <span className="text-black font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg">FlexiReact</span>
            <span className="px-2 py-0.5 text-xs bg-[#00FF9C]/20 text-[#00FF9C] rounded-full">v3.0</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="https://github.com/flexireact/flexireact#readme" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
            <a href="https://github.com/flexireact/flexireact" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
            <a href="https://github.com/flexireact/flexireact/tree/main/examples" className="text-sm text-gray-400 hover:text-white transition-colors">Examples</a>
            <a href="https://discord.gg/rFSZxFtpAA" className="text-sm text-gray-400 hover:text-white transition-colors">Discord</a>
          </div>

          <a 
            href="https://github.com/flexireact/flexireact" 
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF9C]/50 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm font-medium">Star</span>
          </a>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-4 overflow-hidden animate-fade-in-up">
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

      {/* Core Features Premium */}
      <section className="py-24 px-4 animate-fade-in-up animate-delay-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-gray-400">Everything you need to build modern web apps</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreFeatures.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-[#00FF9C]/30 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00FF9C]/10">
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

      {/* How it Works Timeline */}
      <section className="py-24 px-4 bg-white/[0.02] animate-fade-in-up animate-delay-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-gray-400">From idea to production in 5 simple steps</p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF9C]/20 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF9C] to-[#00D68F] text-black font-bold text-xl mb-4 shadow-lg shadow-[#00FF9C]/20">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 px-4 animate-fade-in-up animate-delay-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple & Powerful</h2>
            <p className="text-gray-400">Write clean code that just works</p>
          </div>
          
          <div className="rounded-2xl bg-[#111] border border-gray-800 overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-3 bg-[#0d0d0d] border-b border-gray-800">
              <button className="px-3 py-1.5 text-sm bg-[#00FF9C]/20 text-[#00FF9C] rounded-lg">Pages</button>
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">API Route</button>
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">Component</button>
            </div>
            <pre className="p-6 overflow-x-auto"><code className="text-sm text-gray-300">{\`// app/page.tsx
export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">
        Hello from FlexiReact ⚡
      </h1>
    </div>
  );
}\`}</code></pre>
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="py-24 px-4 bg-white/[0.02] animate-fade-in-up animate-delay-400">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Blazing Fast Performance</h2>
            <p className="text-gray-400">Cold start comparison (lower is better)</p>
          </div>
          
          <div className="space-y-6">
            {benchmarks.map((bench, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{bench.name}</div>
                <div className="flex-1 h-12 bg-white/5 rounded-lg overflow-hidden">
                  <div 
                    className="h-full flex items-center px-4 text-sm font-bold transition-all duration-1000"
                    style={{
                      width: \`\${(bench.time / 10) * 100}%\`,
                      backgroundColor: bench.name === 'FlexiReact' ? '#00FF9C' : 'rgba(255,255,255,0.1)',
                      color: bench.name === 'FlexiReact' ? '#000' : '#fff'
                    }}
                  >
                    {bench.time}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FlexiReact */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why FlexiReact?</h2>
            <p className="text-gray-400">Built for developers who value speed and simplicity</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFlexiReact.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Complete Ecosystem</h2>
            <p className="text-gray-400">Everything you need, batteries included</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((item, i) => (
              <a key={i} href={item.link} target="_blank" className="group p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-[#00FF9C]/30 transition-all hover:scale-105">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-1 group-hover:text-[#00FF9C] transition">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Backed By */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-500">Trusted By</h2>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-12">
            {backedBy.map((company, i) => (
              <div key={i} className="group flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xl group-hover:bg-[#00FF9C]/20 group-hover:text-[#00FF9C] transition">
                  {company.logo}
                </div>
                <span className="font-semibold">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
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

      {/* Premium Footer */}
      <footer className="border-t border-gray-800/50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="https://github.com/flexireact/flexireact#readme" className="text-sm text-gray-400 hover:text-white transition">Docs</a></li>
                <li><a href="https://github.com/flexireact/flexireact/tree/main/examples" className="text-sm text-gray-400 hover:text-white transition">Examples</a></li>
                <li><a href="https://github.com/flexireact/flexireact/blob/main/CHANGELOG-v3.md" className="text-sm text-gray-400 hover:text-white transition">Changelog</a></li>
                <li><a href="https://github.com/flexireact/flexireact/projects" className="text-sm text-gray-400 hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="https://github.com/flexireact/flexireact" className="text-sm text-gray-400 hover:text-white transition">GitHub</a></li>
                <li><a href="https://discord.gg/rFSZxFtpAA" className="text-sm text-gray-400 hover:text-white transition">Discord</a></li>
                <li><a href="https://github.com/flexireact/flexireact/discussions" className="text-sm text-gray-400 hover:text-white transition">Discussions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ecosystem</h3>
              <ul className="space-y-2">
                <li><a href="https://www.npmjs.com/package/@flexireact/flexi-ui" className="text-sm text-gray-400 hover:text-white transition">FlexiUI</a></li>
                <li><a href="https://www.npmjs.com/package/flexiguard" className="text-sm text-gray-400 hover:text-white transition">FlexiGuard</a></li>
                <li><a href="https://www.npmjs.com/package/create-flexireact" className="text-sm text-gray-400 hover:text-white transition">CLI</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="https://github.com/flexireact/flexireact/blob/main/LICENSE" className="text-sm text-gray-400 hover:text-white transition">License</a></li>
                <li><a href="https://github.com/flexireact/flexireact/blob/main/CONTRIBUTING.md" className="text-sm text-gray-400 hover:text-white transition">Contributing</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00FF9C] flex items-center justify-center">
                <span className="text-black font-bold">F</span>
              </div>
              <span className="text-sm text-gray-400">Built with ❤️ by Asuno</span>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} FlexiReact. MIT License.</p>
          </div>
        </div>
      </footer>
      </main>
    </div>
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

/* Fade-in and slide-up animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animate-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animate-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
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
