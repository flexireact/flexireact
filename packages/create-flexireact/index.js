#!/usr/bin/env node

/**
 * create-flexireact
 * Create FlexiReact apps with one command
 * 
 * Usage: npx create-flexireact@latest my-app
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Colors & Styling
// ============================================================================

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgCyan: '\x1b[46m',
};

// ============================================================================
// ASCII Art & Branding
// ============================================================================

const BANNER = `
${c.green}   ╭─────────────────────────────────────────────────╮${c.reset}
${c.green}   │${c.reset}                                                 ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.green}⚡${c.reset} ${c.bold}${c.white}C R E A T E - F L E X I R E A C T${c.reset}         ${c.green}│${c.reset}
${c.green}   │${c.reset}                                                 ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.dim}The Modern React Framework${c.reset}                  ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.dim}TypeScript • Tailwind • SSR • Islands${c.reset}       ${c.green}│${c.reset}
${c.green}   │${c.reset}                                                 ${c.green}│${c.reset}
${c.green}   ╰─────────────────────────────────────────────────╯${c.reset}
`;

const SUCCESS_BANNER = (projectName) => `
${c.green}   ╭─────────────────────────────────────────────────╮${c.reset}
${c.green}   │${c.reset}                                                 ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.green}✓${c.reset} ${c.bold}Project created successfully!${c.reset}              ${c.green}│${c.reset}
${c.green}   │${c.reset}                                                 ${c.green}│${c.reset}
${c.green}   ╰─────────────────────────────────────────────────╯${c.reset}

   ${c.dim}Next steps:${c.reset}

   ${c.cyan}cd${c.reset} ${projectName}
   ${c.cyan}npm${c.reset} install
   ${c.cyan}npm${c.reset} run dev

   ${c.dim}Then open${c.reset} ${c.cyan}http://localhost:3000${c.reset}

   ${c.dim}Documentation:${c.reset} ${c.cyan}https://github.com/flexireact/flexireact${c.reset}
`;

// ============================================================================
// Templates
// ============================================================================

const TEMPLATES = {
  default: {
    name: 'Default',
    description: 'Premium template with modern UI, animations & dark mode',
  },
  'flexi-ui': {
    name: 'Flexi UI',
    description: 'Showcase template with @flexireact/flexi-ui components',
  },
  minimal: {
    name: 'Minimal',
    description: 'Bare minimum FlexiReact setup',
  },
};

// ============================================================================
// Utilities
// ============================================================================

function log(msg) {
  console.log(`   ${msg}`);
}

function success(msg) {
  console.log(`   ${c.green}✓${c.reset} ${msg}`);
}

function error(msg) {
  console.log(`   ${c.red}✗${c.reset} ${c.red}${msg}${c.reset}`);
}

function info(msg) {
  console.log(`   ${c.cyan}ℹ${c.reset} ${msg}`);
}

// Spinner
class Spinner {
  constructor(message) {
    this.message = message;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.current = 0;
    this.interval = null;
  }

  start() {
    process.stdout.write(`   ${this.frames[0]} ${this.message}`);
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.frames.length;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`   ${c.cyan}${this.frames[this.current]}${c.reset} ${this.message}`);
    }, 80);
  }

  stop(success = true) {
    clearInterval(this.interval);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    const icon = success ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    console.log(`   ${icon} ${this.message}`);
  }
}

// Prompt
async function prompt(question, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const defaultStr = defaultValue ? ` ${c.dim}(${defaultValue})${c.reset}` : '';
    rl.question(`   ${c.cyan}?${c.reset} ${question}${defaultStr}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// Select
async function select(question, options) {
  console.log(`   ${c.cyan}?${c.reset} ${question}`);
  console.log('');
  
  options.forEach((opt, i) => {
    console.log(`      ${c.cyan}${i + 1}.${c.reset} ${c.bold}${opt.name}${c.reset}`);
    console.log(`         ${c.dim}${opt.description}${c.reset}`);
  });
  
  console.log('');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`   ${c.dim}Enter number (1-${options.length}):${c.reset} `, (answer) => {
      rl.close();
      const index = parseInt(answer) - 1;
      if (index >= 0 && index < options.length) {
        resolve(options[index]);
      } else {
        resolve(options[0]);
      }
    });
  });
}

// Check if directory is empty
function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

// ============================================================================
// Template Files
// ============================================================================

const TEMPLATE_FILES = {
  'package.json': (name, template) => JSON.stringify({
    name: name,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "npm run css && flexireact dev",
      build: "npm run css && flexireact build",
      start: "flexireact start",
      css: "npx tailwindcss -i ./app/styles/globals.css -o ./public/styles.css --minify"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@flexireact/core": "^1.0.0",
      "framer-motion": "^11.0.0",
      "lucide-react": "^0.400.0",
      "clsx": "^2.1.0",
      "tailwind-merge": "^2.2.0"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "typescript": "^5.3.0",
      "tailwindcss": "^3.4.0",
      "postcss": "^8.4.32",
      "autoprefixer": "^10.4.16"
    }
  }, null, 2),

  'tsconfig.json': () => JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      lib: ["DOM", "DOM.Iterable", "ES2020"],
      module: "ESNext",
      moduleResolution: "bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules", ".flexi"]
  }, null, 2),

  'tailwind.config.js': () => `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(240 3.7% 15.9%)',
        input: 'hsl(240 3.7% 15.9%)',
        ring: 'hsl(142.1 76.2% 36.3%)',
        background: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        primary: {
          DEFAULT: 'hsl(142.1 76.2% 36.3%)',
          foreground: 'hsl(144.9 80.4% 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(240 3.7% 15.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(240 3.7% 15.9%)',
          foreground: 'hsl(240 5% 64.9%)',
        },
        accent: {
          DEFAULT: 'hsl(240 3.7% 15.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
        card: {
          DEFAULT: 'hsl(240 10% 3.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
`,

  'postcss.config.js': () => `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  'flexireact.config.js': () => `/** @type {import('@flexireact/core').Config} */
export default {
  styles: [
    '/styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
  ],
  favicon: '/favicon.svg',
  server: {
    port: 3000
  },
  islands: {
    enabled: true
  }
};
`,

  // ============================================================================
  // Components
  // ============================================================================

  'components/ui/button.tsx': () => `import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const baseStyles = 'inline-flex items-center justify-center rounded-lg ' +
  'font-medium transition-all duration-200 focus-visible:outline-none ' +
  'focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  default: 'bg-primary text-black hover:bg-primary/90',
  outline: 'border border-border bg-transparent hover:bg-secondary',
  ghost: 'hover:bg-secondary hover:text-foreground',
};

const sizes = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-12 px-8 text-base',
};

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
`,

  'components/ui/card.tsx': () => `import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const cardStyles = 'rounded-xl border border-border bg-card ' +
  'text-card-foreground shadow-sm transition-all duration-300 ' +
  'hover:border-primary/50';

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardStyles, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
`,

  'components/ui/badge.tsx': () => `import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        {
          'bg-primary/10 text-primary border border-primary/20': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
`,

  'components/Navbar.tsx': () => `import React from 'react';

export function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <a href="/" className="logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">FlexiReact</span>
        </a>
        <div className="nav-links">
          <a href="https://github.com/flexireact/flexireact">Docs</a>
          <a href="https://github.com/flexireact/flexireact">GitHub</a>
        </div>
      </nav>
    </header>
  );
}
`,

  'components/Hero.tsx': () => `import React from 'react';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-content">
        <span className="hero-badge">⚡ The Modern React Framework</span>
        <h1 className="hero-title">
          Build <span className="gradient-text">blazing fast</span> web apps
        </h1>
        <p className="hero-subtitle">
          A modern React framework with TypeScript, Tailwind CSS, 
          SSR, SSG, Islands architecture, and file-based routing.
        </p>
        <div className="hero-buttons">
          <a href="https://github.com/flexireact/flexireact" className="btn-primary">
            Get Started →
          </a>
          <a href="https://github.com/flexireact/flexireact" className="btn-outline">
            GitHub
          </a>
        </div>
        <div className="terminal">
          <div className="terminal-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <pre className="terminal-body">
<span className="dim">$</span> <span className="green">npx</span> create-flexireact my-app
<span className="dim">$</span> <span className="green">cd</span> my-app
<span className="dim">$</span> <span className="green">npm</span> run dev

<span className="green">✓</span> Ready in 38ms
          </pre>
        </div>
      </div>
    </section>
  );
}
`,

  'components/Features.tsx': () => `import React from 'react';

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by esbuild for instant builds.' },
  { icon: '📁', title: 'File Routing', desc: 'Create a file, get a route automatically.' },
  { icon: '🏝️', title: 'Islands', desc: 'Partial hydration for minimal JavaScript.' },
  { icon: '🚀', title: 'SSR & SSG', desc: 'Server rendering out of the box.' },
];

export function Features() {
  return (
    <section className="features">
      <h2 className="features-title">Everything you need</h2>
      <p className="features-subtitle">
        A complete toolkit for building modern web apps.
      </p>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`,

  'components/Footer.tsx': () => `import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>Built with ❤️ using FlexiReact</span>
        <div className="footer-links">
          <a href="https://github.com/flexireact/flexireact">GitHub</a>
          <a href="https://github.com/flexireact/flexireact">Docs</a>
        </div>
      </div>
    </footer>
  );
}
`,

  'components/index.ts': () => `export { Navbar } from './Navbar';
export { Hero } from './Hero';
export { Features } from './Features';
export { Footer } from './Footer';
export { Button } from './ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
export { Badge } from './ui/badge';
`,

  // ============================================================================
  // Lib
  // ============================================================================

  'lib/utils.ts': () => `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,

  // ============================================================================
  // Pages & Layouts
  // ============================================================================

  'layouts/root.tsx': () => `import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
`,

  'pages/index.tsx': () => `import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
`,

  // ============================================================================
  // Styles
  // ============================================================================

  'app/styles/globals.css': () => `/* FlexiReact Default Template Styles */

:root {
  --bg: #0a0a0a;
  --fg: #fafafa;
  --primary: #10b981;
  --primary-light: #34d399;
  --accent: #06b6d4;
  --muted: #71717a;
  --border: #27272a;
  --card: #18181b;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}

a { color: inherit; text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--primary); }

/* Layout */
.app { min-height: 100vh; }

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(12px);
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo { display: flex; align-items: center; gap: 0.5rem; }
.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.logo-text { font-weight: 700; font-size: 1.125rem; }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: var(--muted); font-size: 0.9375rem; font-weight: 500; }
.nav-links a:hover { color: var(--fg); }

/* Hero */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4rem 1.5rem;
}
.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%);
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 2rem;
}
.hero-title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.125rem;
  color: var(--muted);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}
.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #000;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s;
}
.btn-primary:hover { 
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16,185,129,0.3);
  color: #000; 
}
.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline:hover { 
  border-color: var(--primary); 
  background: rgba(16,185,129,0.1);
  color: var(--fg); 
}

/* Terminal */
.terminal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  text-align: left;
}
.terminal-header {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 0.5rem;
  background: rgba(255,255,255,0.02);
}
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #eab308; }
.dot.green { background: #22c55e; }
.terminal-body {
  padding: 1.25rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.8;
}
.dim { color: var(--muted); }
.green { color: var(--primary); }

/* Features */
.features {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.features-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.75rem;
}
.features-subtitle {
  text-align: center;
  color: var(--muted);
  margin-bottom: 3rem;
  font-size: 1.0625rem;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
.feature-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s;
}
.feature-card:hover { 
  border-color: var(--primary);
  transform: translateY(-4px);
}
.feature-icon { 
  font-size: 2rem; 
  margin-bottom: 1rem; 
  display: block;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16,185,129,0.1);
  border-radius: 12px;
}
.feature-title { font-weight: 600; font-size: 1.0625rem; margin-bottom: 0.5rem; }
.feature-desc { color: var(--muted); font-size: 0.9375rem; line-height: 1.6; }

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1.5rem;
  margin-top: 2rem;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--muted);
}
.footer-links { display: flex; gap: 1.5rem; }
.footer-links a:hover { color: var(--primary); }

/* Responsive */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero { min-height: auto; padding: 6rem 1.5rem 4rem; }
  .hero-buttons { flex-direction: column; align-items: center; }
  .btn-primary, .btn-outline { width: 100%; justify-content: center; }
  .footer-inner { flex-direction: column; text-align: center; }
}
`,

  // ============================================================================
  // Public Assets
  // ============================================================================

  'public/.gitkeep': () => '',
  
  'public/favicon.svg': () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#0a0a0a"/>
  <path d="M50 20L30 55h15v25l20-35H50V20z" fill="url(#grad)"/>
</svg>`,
};

// Minimal template files
const MINIMAL_FILES = {
  'package.json': (name) => JSON.stringify({
    name: name,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "flexireact dev",
      build: "flexireact build",
      start: "flexireact start"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@flexireact/core": "^1.0.0"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "typescript": "^5.3.0"
    }
  }, null, 2),

  'tsconfig.json': TEMPLATE_FILES['tsconfig.json'],

  'flexireact.config.js': () => `export default {
  server: { port: 3000 }
};
`,

  'pages/index.tsx': () => `import React from 'react';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Welcome to FlexiReact</h1>
      <p>Edit pages/index.tsx to get started.</p>
    </div>
  );
}
`,

  'public/.gitkeep': () => '',
};

// ============================================================================
// Flexi UI Template Files
// ============================================================================

const FLEXI_UI_FILES = {
  'package.json': (name) => JSON.stringify({
    name: name,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "npm run css && flexireact dev",
      build: "npm run css && flexireact build",
      start: "flexireact start",
      css: "npx tailwindcss -i ./app/styles/globals.css -o ./public/styles.css --minify"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@flexireact/core": "^1.0.0",
      "@flexireact/flexi-ui": "^1.0.0",
      "lucide-react": "^0.400.0"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "typescript": "^5.3.0",
      "tailwindcss": "^3.4.0",
      "postcss": "^8.4.32",
      "autoprefixer": "^10.4.16"
    }
  }, null, 2),

  'tsconfig.json': TEMPLATE_FILES['tsconfig.json'],

  'tailwind.config.js': () => `/** @type {import('tailwindcss').Config} */
const { flexiUIPlugin } = require('@flexireact/flexi-ui/tailwind');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './node_modules/@flexireact/flexi-ui/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 156, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 156, 0.3)' },
        },
      },
    },
  },
  plugins: [flexiUIPlugin],
};
`,

  'postcss.config.js': () => `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  'flexireact.config.js': () => `/** @type {import('@flexireact/core').Config} */
export default {
  styles: [
    '/styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
  ],
  favicon: '/favicon.svg',
  server: {
    port: 3000
  },
  islands: {
    enabled: true
  }
};
`,

  // ============================================================================
  // Components - Simple Landing Page
  // ============================================================================

  'components/Hero.tsx': () => `import React from 'react';
import { Button, Badge } from '@flexireact/flexi-ui';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-content">
        <Badge variant="success" className="mb-6">
          ⚡ Flexi UI Components
        </Badge>
        <h1 className="hero-title">
          Build <span className="gradient-text">beautiful</span> apps
        </h1>
        <p className="hero-subtitle">
          A stunning component library with neon emerald accents,
          dark-first design, and seamless React integration.
        </p>
        <div className="hero-buttons">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">GitHub</Button>
        </div>
      </div>
    </section>
  );
}
`,

  'components/Features.tsx': () => `import React from 'react';
import { Card } from '@flexireact/flexi-ui';

const features = [
  { icon: '⚡', title: 'Fast', desc: 'Powered by esbuild.' },
  { icon: '📁', title: 'File Routing', desc: 'Automatic routes.' },
  { icon: '🏝️', title: 'Islands', desc: 'Partial hydration.' },
  { icon: '🎨', title: 'Beautiful', desc: 'Dark mode first.' },
];

export function Features() {
  return (
    <section className="features">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <Card key={i} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
`,

  'components/Footer.tsx': () => `import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <span>Built with Flexi UI</span>
      <a href="https://github.com/flexireact/flexi-ui">GitHub</a>
    </footer>
  );
}
`,

  'components/Navbar.tsx': () => `import React from 'react';
import { Button, Badge } from '@flexireact/flexi-ui';

export function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <a href="/" className="logo">
          <span className="logo-icon">F</span>
          <span className="logo-text">Flexi UI</span>
          <Badge variant="outline" className="ml-2">v1.0</Badge>
        </a>
        <div className="nav-links">
          <Button variant="ghost" size="sm">Docs</Button>
          <Button variant="outline" size="sm">GitHub</Button>
        </div>
      </nav>
    </header>
  );
}
`,

  'components/index.ts': () => `export { Hero } from './Hero';
export { Features } from './Features';
export { Footer } from './Footer';
export { Navbar } from './Navbar';
`,

  // ============================================================================
  // Pages & Layouts
  // ============================================================================

  'layouts/root.tsx': () => `import React from 'react';
import { ThemeProvider } from '@flexireact/flexi-ui';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
`,

  'pages/index.tsx': () => `import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
`,

  // ============================================================================
  // Styles
  // ============================================================================

  'app/styles/globals.css': () => `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0a0a;
  --fg: #fafafa;
  --primary: #00FF9C;
  --muted: #94a3b8;
  --border: #1e293b;
  --card: #0f0f0f;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(12px);
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo { display: flex; align-items: center; gap: 0.5rem; }
.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary), #10b981);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #000;
}
.logo-text { font-weight: 700; }
.nav-links { display: flex; gap: 0.5rem; }

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
}
.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0,255,156,0.15), transparent 70%);
  pointer-events: none;
}
.hero-content {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}
.gradient-text {
  background: linear-gradient(90deg, var(--primary), #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: 1.125rem;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}
.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Features */
.features {
  padding: 6rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.features-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.feature-card {
  padding: 1.5rem;
  text-align: center;
}
.feature-card:hover { border-color: var(--primary); }
.feature-icon { font-size: 2rem; margin-bottom: 1rem; }
.feature-card h3 { font-weight: 600; margin-bottom: 0.5rem; }
.feature-card p { color: var(--muted); font-size: 0.875rem; }

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--muted);
  font-size: 0.875rem;
}
.footer a:hover { color: var(--primary); }
`,

  // ============================================================================
  // Public Assets
  // ============================================================================

  'public/.gitkeep': () => '',
  
  'public/favicon.svg': () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00FF9C"/>
      <stop offset="100%" style="stop-color:#10b981"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#0a0a0a"/>
  <text x="50" y="68" font-family="system-ui" font-size="50" font-weight="900" fill="url(#grad)" text-anchor="middle">F</text>
</svg>`,
};

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.clear();
  console.log(BANNER);

  // Get project name from args or prompt
  let projectName = process.argv[2];
  
  if (!projectName) {
    projectName = await prompt('Project name', 'my-flexireact-app');
  }

  // Validate project name
  if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
    error('Project name can only contain letters, numbers, dashes, and underscores');
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(projectPath) && !isDirEmpty(projectPath)) {
    error(`Directory ${projectName} already exists and is not empty`);
    process.exit(1);
  }

  // Select template
  console.log('');
  const templateOptions = Object.entries(TEMPLATES).map(([key, value]) => ({
    key,
    ...value,
  }));
  
  const selectedTemplate = await select('Select a template:', templateOptions);
  const templateKey = selectedTemplate.key;

  console.log('');
  log(`Creating project in ${c.cyan}${projectPath}${c.reset}`);
  console.log('');

  // Create project directory
  const spinner1 = new Spinner('Creating project structure...');
  spinner1.start();
  
  try {
    fs.mkdirSync(projectPath, { recursive: true });
    
    // Create subdirectories
    let dirs;
    if (templateKey === 'minimal') {
      dirs = ['pages', 'public'];
    } else if (templateKey === 'flexi-ui') {
      dirs = ['pages', 'public', 'components', 'layouts', 'app/styles'];
    } else {
      dirs = ['pages', 'public', 'components', 'components/ui', 'layouts', 'app/styles', 'lib'];
    }
    
    for (const dir of dirs) {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    }
    
    spinner1.stop(true);
  } catch (err) {
    spinner1.stop(false);
    error(`Failed to create project structure: ${err.message}`);
    process.exit(1);
  }

  // Write template files
  const spinner2 = new Spinner('Writing template files...');
  spinner2.start();
  
  try {
    let files;
    if (templateKey === 'minimal') {
      files = MINIMAL_FILES;
    } else if (templateKey === 'flexi-ui') {
      files = FLEXI_UI_FILES;
    } else {
      files = TEMPLATE_FILES;
    }
    
    for (const [filePath, contentFn] of Object.entries(files)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const content = contentFn(projectName, templateKey);
      fs.writeFileSync(fullPath, content);
    }
    
    spinner2.stop(true);
  } catch (err) {
    spinner2.stop(false);
    error(`Failed to write template files: ${err.message}`);
    process.exit(1);
  }

  // Create README
  const spinner3 = new Spinner('Creating configuration files...');
  spinner3.start();
  
  try {
    const readmeContent = `# ${projectName}

A modern web application built with [FlexiReact](https://github.com/flexireact/flexireact).

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

- [FlexiReact Documentation](https://github.com/flexireact/flexireact)
`;

    fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);
    spinner3.stop(true);
  } catch (err) {
    spinner3.stop(false);
    error(`Failed to create config files: ${err.message}`);
    process.exit(1);
  }

  // Success message
  console.log(SUCCESS_BANNER(projectName));
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
