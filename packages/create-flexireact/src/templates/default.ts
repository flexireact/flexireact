/**
 * Default Template - Full-featured FlexiReact v3 setup
 * 
 * Structure:
 * - app/          : Layout, components, styles, providers
 * - routes/       : FlexiReact v3 file-based routing
 * - lib/          : Utilities
 * - public/       : Static assets
 */

import type { TemplateFiles } from './index.js';

export function defaultTemplate(projectName: string): TemplateFiles {
  return {
    // ========================================================================
    // Config Files
    // ========================================================================
    
    'package.json': JSON.stringify({
      name: projectName,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'npm run css && flexireact dev',
        build: 'npm run css && flexireact build',
        start: 'flexireact start',
        css: 'tailwindcss -i ./app/styles/globals.css -o ./public/styles.css --minify',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@flexireact/core': '^3.0.0',
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
          '@/components/*': ['./app/components/*'],
          '@/lib/*': ['./lib/*'],
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

    'flexireact.config.js': `/** @type {import('@flexireact/core').FlexiConfig} */
const config = {
  styles: [
    '/styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  ],
  favicon: '/favicon.svg',
  server: {
    port: 3000,
  },
  islands: { enabled: true },
};

export default config;
`,

    // ========================================================================
    // App Directory - Layout, Components, Styles
    // ========================================================================

    'app/layout.tsx': `import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
`,

    // Components - UI
    'app/components/ui/Button.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-black hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-white hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-white/5': variant === 'ghost',
          'border border-border hover:bg-white/5 hover:border-primary': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
`,

    'app/components/ui/Card.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border p-6 transition-all',
        {
          'bg-card': variant === 'default',
          'bg-white/5 backdrop-blur-xl': variant === 'glass',
        },
        'hover:border-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-muted', className)} {...props} />;
}
`,

    'app/components/ui/index.ts': `export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardContent } from './Card';
`,

    // Components - Layout
    'app/components/layout/Navbar.tsx': `import React from 'react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg">FlexiReact</span>
        </a>
        
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-muted hover:text-foreground transition-colors">Home</a>
          <a href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About</a>
          <a href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">Blog</a>
          <a 
            href="https://github.com/flexireact/flexireact" 
            target="_blank"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
`,

    'app/components/layout/Footer.tsx': `import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted max-w-6xl">
        <p>Built with FlexiReact v3 • {new Date().getFullYear()}</p>
        <p className="mt-2">
          <a href="https://discord.gg/rFSZxFtpAA" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Join our Discord Community 💬
          </a>
        </p>
      </div>
    </footer>
  );
}
`,

    'app/components/layout/index.ts': `export { Navbar } from './Navbar';
export { Footer } from './Footer';
`,

    'app/components/index.ts': `export * from './ui';
export * from './layout';
`,

    // Providers
    'app/providers/ThemeProvider.tsx': `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
`,

    // Styles
    'app/styles/globals.css': `@import "tailwindcss";

/* FlexiReact v3 Theme */
@theme {
  /* Colors */
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-primary: #00FF9C;
  --color-secondary: #1a1a1a;
  --color-muted: #71717a;
  --color-border: #27272a;
  --color-card: #18181b;
  
  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-foreground);
  -webkit-font-smoothing: antialiased;
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

    // ========================================================================
    // Routes Directory - FlexiReact v3 Routing
    // ========================================================================

    'routes/(public)/home.tsx': `import React from 'react';

export const metadata = {
  title: 'FlexiReact v3 - The Modern React Framework',
  description: 'Build fast, modern web apps with FlexiReact v3',
};

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
  { step: '1', title: 'File Routing', desc: 'Create pages in routes/ directory' },
  { step: '2', title: 'Layouts', desc: 'Shared UI across routes' },
  { step: '3', title: 'Islands', desc: 'Interactive components' },
  { step: '4', title: 'SSR/SSG', desc: 'Server or static rendering' },
  { step: '5', title: 'Deploy', desc: 'Ship to Edge in seconds' },
];

const benchmarks = [
  { name: 'FlexiReact', time: 2 },
  { name: 'Astro', time: 5 },
  { name: 'Next.js', time: 8 },
];

const ecosystem = [
  { icon: '⚛️', name: 'FlexiUI', desc: '50+ components' },
  { icon: '🔐', name: 'FlexiGuard', desc: 'Auth & RBAC' },
  { icon: '🧰', name: 'FlexiCLI', desc: 'Commands & scaffolding' },
  { icon: '🌐', name: 'FlexiEdge', desc: 'Deploy-ready runtime' },
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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 px-4 overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FF9C]/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00FF9C]/5 rounded-full blur-[120px]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-[#00FF9C] to-[#00D68F] shadow-lg shadow-[#00FF9C]/20">
            <span className="text-3xl font-black text-black">F</span>
          </div>
          
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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

          <div className="max-w-lg mx-auto">
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
            <pre className="p-6 overflow-x-auto"><code className="text-sm text-gray-300">{\`// routes/home.tsx
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
              <div key={i} className="group p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-[#00FF9C]/30 transition-all hover:scale-105">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-1 group-hover:text-[#00FF9C] transition">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
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
          <div className="relative p-12 rounded-3xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gray-800 overflow-hidden">
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
                   className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00FF9C] text-black font-semibold rounded-xl hover:bg-[#00D68F] transition-all hover:scale-105">
                  Start Building →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`,

    'routes/(public)/about.tsx': `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

export const metadata = {
  title: 'About - FlexiReact',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">About FlexiReact</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What is FlexiReact?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            FlexiReact is a modern React framework designed for building fast, 
            scalable web applications. It combines the best features of popular 
            frameworks with a flexible, intuitive API.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>✓ Server-Side Rendering (SSR)</li>
            <li>✓ Static Site Generation (SSG)</li>
            <li>✓ Islands Architecture</li>
            <li>✓ File-based Routing</li>
            <li>✓ TypeScript Support</li>
            <li>✓ Tailwind CSS v4</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
`,

    'routes/blog/index.tsx': `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

export const metadata = {
  title: 'Blog - FlexiReact',
};

const posts = [
  { slug: 'getting-started', title: 'Getting Started', excerpt: 'Learn how to build your first app...' },
  { slug: 'routing', title: 'File-based Routing', excerpt: 'Deep dive into the router...' },
  { slug: 'islands', title: 'Islands Architecture', excerpt: 'Partial hydration for performance...' },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <a key={post.slug} href={\`/blog/\${post.slug}\`}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.excerpt}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
`,

    'routes/blog/[slug].tsx': `import React from 'react';
import { Button } from '@/app/components/ui';

interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <a href="/blog">
        <Button variant="ghost" size="sm" className="mb-8">← Back to Blog</Button>
      </a>
      
      <h1 className="text-4xl font-bold mb-4">Blog Post: {params.slug}</h1>
      
      <p className="text-muted mb-8">
        This is a dynamic route. The slug parameter is: <code className="text-primary">{params.slug}</code>
      </p>
      
      <div className="prose prose-invert">
        <p>
          This page demonstrates dynamic routing in FlexiReact v3. 
          The [slug].tsx file creates a dynamic route that matches any path under /blog/.
        </p>
      </div>
    </div>
  );
}
`,

    // API routes
    'routes/api/hello.ts': `export async function GET() {
  return Response.json({
    message: 'Hello from FlexiReact API!',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({
    received: body,
    message: 'POST request received',
  });
}
`,

    // ========================================================================
    // Lib Directory
    // ========================================================================

    'lib/utils.ts': `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,

    // ========================================================================
    // Public Directory
    // ========================================================================

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

    // ========================================================================
    // Git
    // ========================================================================

    '.gitignore': `# Dependencies
node_modules/
.pnpm-store/

# Build
.flexi/
dist/
public/styles.css

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
`,
  };
}
