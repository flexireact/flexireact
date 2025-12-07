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

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25': variant === 'default',
          'border border-border bg-transparent hover:bg-secondary hover:text-foreground': variant === 'outline',
          'hover:bg-secondary hover:text-foreground': variant === 'ghost',
        },
        {
          'h-10 px-4 py-2 text-sm': size === 'default',
          'h-9 px-3 text-sm': size === 'sm',
          'h-12 px-8 text-base': size === 'lg',
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

  'components/ui/card.tsx': () => `import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        className
      )}
      {...props}
    >
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
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
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
import { Button } from './ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-400">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold">FlexiReact</span>
        </a>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/flexireact/flexireact">Docs</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/flexireact/flexireact" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
`,

  'components/Hero.tsx': () => `import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 via-emerald-500/10 to-cyan-500/20 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge className="mb-6 animate-fade-in">
            <span className="mr-1">⚡</span> The Modern React Framework
          </Badge>

          {/* Title */}
          <h1 className="mb-6 max-w-4xl animate-fade-up text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build{' '}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              blazing fast
            </span>{' '}
            web apps
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl animate-fade-up text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: '0.1s' }}>
            A modern React framework with TypeScript, Tailwind CSS, SSR, SSG, 
            Islands architecture, and file-based routing. Ship faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="gap-2">
              Start Building
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/flexireact/flexireact" className="gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </Button>
          </div>

          {/* Code Preview */}
          <div className="mt-16 w-full max-w-2xl animate-fade-up rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-muted-foreground">terminal</span>
            </div>
            <pre className="mt-4 overflow-x-auto text-left text-sm">
              <code className="text-muted-foreground">
                <span className="text-muted-foreground/60">$</span>{' '}
                <span className="text-primary">npx</span> create-flexireact@latest my-app{'\n'}
                <span className="text-muted-foreground/60">$</span>{' '}
                <span className="text-primary">cd</span> my-app{'\n'}
                <span className="text-muted-foreground/60">$</span>{' '}
                <span className="text-primary">npm</span> run dev{'\n'}
                {'\n'}
                <span className="text-emerald-400">✓</span> Ready in <span className="text-primary">38ms</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
`,

  'components/Features.tsx': () => `import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Powered by esbuild for instant builds and sub-second hot module replacement.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'File-based Routing',
    description: 'Create a file in pages/, get a route automatically. Simple and intuitive.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Islands Architecture',
    description: 'Partial hydration for minimal JavaScript. Only hydrate what needs interactivity.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    title: 'SSR & SSG',
    description: 'Server-side rendering and static generation out of the box. SEO friendly.',
  },
];

export function Features() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-24">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A complete toolkit for building modern web applications with React.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="group cursor-default">
            <CardHeader>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
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
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-500">❤️</span>
            <span>using</span>
            <a href="https://github.com/flexireact/flexireact" className="font-medium text-foreground hover:text-primary transition-colors">
              FlexiReact
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/flexireact/flexireact" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="https://github.com/flexireact/flexireact" className="hover:text-foreground transition-colors">
              Documentation
            </a>
          </div>
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
    <div className="relative min-h-screen bg-background text-foreground antialiased">
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

  'app/styles/globals.css': () => `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 144.9 80.4% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 142.1 76.2% 36.3%;
    --radius: 0.75rem;
  }

  * {
    border-color: hsl(var(--border));
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
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
    const dirs = templateKey === 'minimal' 
      ? ['pages', 'public']
      : ['pages', 'public', 'components', 'components/ui', 'layouts', 'app/styles', 'lib'];
    
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
    const files = templateKey === 'minimal' ? MINIMAL_FILES : TEMPLATE_FILES;
    
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
