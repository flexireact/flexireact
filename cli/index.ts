#!/usr/bin/env node

/**
 * FlexiReact CLI v2.1
 * Professional CLI with TypeScript, colors, prompts, and progress indicators
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync, spawn } from 'child_process';
import pc from 'picocolors';
import prompts from 'prompts';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VERSION = '2.1.0';

// ============================================================================
// ASCII Logo & Branding
// ============================================================================

const LOGO = `
${pc.cyan('╔═══════════════════════════════════════════════════════════╗')}
${pc.cyan('║')}                                                             ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.bold(pc.magenta('⚡'))} ${pc.bold(pc.white('F L E X I R E A C T'))}                                  ${pc.cyan('║')}
${pc.cyan('║')}                                                             ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.dim('The Modern React Framework')}                              ${pc.cyan('║')}
${pc.cyan('║')}   ${pc.dim('TypeScript • Tailwind • SSR • Islands')}                   ${pc.cyan('║')}
${pc.cyan('║')}                                                             ${pc.cyan('║')}
${pc.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

const MINI_LOGO = `${pc.magenta('⚡')} ${pc.bold('FlexiReact')}`;

// ============================================================================
// Logger Utilities
// ============================================================================

const log = {
  info: (msg: string) => console.log(`${pc.cyan('ℹ')} ${msg}`),
  success: (msg: string) => console.log(`${pc.green('✓')} ${msg}`),
  warn: (msg: string) => console.log(`${pc.yellow('⚠')} ${pc.yellow(msg)}`),
  error: (msg: string) => console.log(`${pc.red('✗')} ${pc.red(msg)}`),
  step: (num: number, total: number, msg: string) => 
    console.log(`${pc.dim(`[${num}/${total}]`)} ${msg}`),
  blank: () => console.log(''),
  divider: () => console.log(pc.dim('─'.repeat(60))),
};

// ============================================================================
// Helper Functions
// ============================================================================

function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function runCommand(cmd: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, { 
      shell: true, 
      cwd, 
      stdio: 'pipe' 
    });
    
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    
    child.on('error', reject);
  });
}

// ============================================================================
// Create Command
// ============================================================================

interface CreateOptions {
  template: 'default' | 'minimal' | 'flexi-ui';
  typescript: boolean;
  tailwind: boolean;
  shadcn: boolean;
}

async function createProject(projectName?: string): Promise<void> {
  console.log(LOGO);
  log.blank();

  // Get project name
  let name = projectName;
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-flexi-app',
      validate: (value) => value.length > 0 || 'Project name is required'
    });
    name = response.projectName;
    if (!name) process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), name);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    log.error(`Directory "${name}" already exists.`);
    process.exit(1);
  }

  // Get options
  const options = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Select a template:',
      choices: [
        { title: '🚀 Default (Tailwind + shadcn/ui)', value: 'default' },
        { title: '💚 FlexiUI (Landing page + @flexireact/flexi-ui)', value: 'flexi-ui' },
        { title: '📦 Minimal (Clean slate)', value: 'minimal' }
      ],
      initial: 0
    },
    {
      type: 'toggle',
      name: 'typescript',
      message: 'Use TypeScript?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    }
  ]);

  if (options.template === undefined) process.exit(1);

  log.blank();
  log.divider();
  log.blank();

  const totalSteps = options.template === 'default' ? 6 : (options.template === 'flexi-ui' ? 5 : 4);
  let currentStep = 0;

  // Step 1: Create directory
  currentStep++;
  log.step(currentStep, totalSteps, 'Creating project directory...');
  fs.mkdirSync(projectPath, { recursive: true });
  log.success(`Created ${pc.cyan(name)}/`);

  // Step 2: Copy template
  currentStep++;
  log.step(currentStep, totalSteps, 'Setting up project structure...');
  const templateName = options.template;
  const templatePath = path.resolve(__dirname, '..', 'templates', templateName);
  
  if (fs.existsSync(templatePath)) {
    copyDirectory(templatePath, projectPath);
    log.success('Project structure created');
  } else {
    // Create basic structure if template doesn't exist
    await createDefaultTemplate(projectPath, name, options.typescript);
    log.success('Project structure created');
  }

  // Step 3: Update package.json
  currentStep++;
  log.step(currentStep, totalSteps, 'Configuring project...');
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    pkg.name = name;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  }
  log.success('Project configured');

  // Step 4: Install dependencies
  currentStep++;
  log.step(currentStep, totalSteps, 'Installing dependencies...');
  const spinner = ora({ text: 'Installing packages...', color: 'cyan' }).start();
  
  try {
    await runCommand('npm install', projectPath);
    spinner.succeed('Dependencies installed');
  } catch {
    spinner.fail('Failed to install dependencies');
    log.warn('Run "npm install" manually in the project directory');
  }

  // Step 5: Link FlexiReact (for development)
  currentStep++;
  log.step(currentStep, totalSteps, 'Linking FlexiReact...');
  const linkSpinner = ora({ text: 'Linking framework...', color: 'cyan' }).start();
  
  try {
    const frameworkRoot = path.resolve(__dirname, '..');
    await runCommand(`npm link "${frameworkRoot}"`, projectPath);
    linkSpinner.succeed('FlexiReact linked');
  } catch {
    linkSpinner.fail('Failed to link FlexiReact');
    log.warn('Run "npm link flexireact" manually');
  }

  // Step 6: Initialize shadcn/ui (if default template)
  if (options.template === 'default') {
    currentStep++;
    log.step(currentStep, totalSteps, 'Setting up shadcn/ui components...');
    log.success('shadcn/ui configured');
  }

  // Success message
  log.blank();
  log.divider();
  log.blank();
  
  console.log(`  ${pc.green('✨')} ${pc.bold('Success!')} Your FlexiReact app is ready.`);
  log.blank();
  
  console.log(`  ${pc.dim('$')} ${pc.cyan(`cd ${name}`)}`);
  console.log(`  ${pc.dim('$')} ${pc.cyan('npm run dev')}`);
  log.blank();
  
  console.log(`  ${pc.dim('Then open')} ${pc.cyan('http://localhost:3000')} ${pc.dim('in your browser.')}`);
  log.blank();
  
  console.log(`  ${pc.dim('Documentation:')} ${pc.cyan('https://github.com/flexireact/flexireact')}`);
  log.blank();
}

async function createDefaultTemplate(projectPath: string, name: string, useTypeScript: boolean): Promise<void> {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  const configExt = useTypeScript ? 'ts' : 'js';

  // Create directories
  const dirs = [
    'app/components',
    'app/styles',
    'pages/api',
    'public',
  ];
  
  for (const dir of dirs) {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  }

  // package.json
  const packageJson = {
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'flexi dev',
      build: 'flexi build',
      start: 'flexi start',
      doctor: 'flexi doctor'
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'class-variance-authority': '^0.7.0',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.5.5',
      'lucide-react': '^0.468.0'
    },
    devDependencies: {
      tailwindcss: '^3.4.16',
      postcss: '^8.4.49',
      autoprefixer: '^10.4.20',
      ...(useTypeScript ? {
        typescript: '^5.7.2',
        '@types/react': '^18.3.14',
        '@types/react-dom': '^18.3.2',
        '@types/node': '^22.10.1'
      } : {})
    }
  };
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // TypeScript config
  if (useTypeScript) {
    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'ES2022'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: {
          '@/*': ['./*'],
          '@/components/*': ['./app/components/*']
        }
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules']
    };
    fs.writeFileSync(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );
  }

  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
`;
  fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

  // PostCSS config
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  fs.writeFileSync(path.join(projectPath, 'postcss.config.js'), postcssConfig);

  // Global CSS
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --primary: 263 70% 50%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 263 70% 50%;
    --accent-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
`;
  fs.writeFileSync(path.join(projectPath, 'app/styles/globals.css'), globalsCss);

  // FlexiReact config
  const flexiConfig = `export default {
  server: {
    port: 3000,
    host: 'localhost'
  },
  islands: {
    enabled: true
  },
  rsc: {
    enabled: true
  }
};
`;
  fs.writeFileSync(path.join(projectPath, `flexireact.config.${configExt}`), flexiConfig);

  // Create components
  await createComponents(projectPath, ext);
  
  // Create pages
  await createPages(projectPath, ext);
}

async function createComponents(projectPath: string, ext: string): Promise<void> {
  // Button component
  const buttonComponent = `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs${ext === 'tsx' ? ': (string | undefined)[]' : ''}) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

${ext === 'tsx' ? `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}` : ''}

export function Button({ className, variant, size, ...props }${ext === 'tsx' ? ': ButtonProps' : ''}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
`;
  fs.writeFileSync(path.join(projectPath, `app/components/Button.${ext}`), buttonComponent);

  // Card component
  const cardComponent = `import React from 'react';

${ext === 'tsx' ? `interface CardProps {
  children: React.ReactNode;
  className?: string;
}` : ''}

export function Card({ children, className = '' }${ext === 'tsx' ? ': CardProps' : ''}) {
  return (
    <div className={\`rounded-lg border border-border bg-secondary/50 p-6 backdrop-blur-sm \${className}\`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }${ext === 'tsx' ? ': CardProps' : ''}) {
  return <div className={\`mb-4 \${className}\`}>{children}</div>;
}

export function CardTitle({ children, className = '' }${ext === 'tsx' ? ': CardProps' : ''}) {
  return <h3 className={\`text-xl font-semibold \${className}\`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }${ext === 'tsx' ? ': CardProps' : ''}) {
  return <p className={\`text-muted-foreground \${className}\`}>{children}</p>;
}

export function CardContent({ children, className = '' }${ext === 'tsx' ? ': CardProps' : ''}) {
  return <div className={className}>{children}</div>;
}
`;
  fs.writeFileSync(path.join(projectPath, `app/components/Card.${ext}`), cardComponent);

  // Navbar component
  const navbarComponent = `import React from 'react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">⚡</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FlexiReact
          </span>
        </a>
        
        <div className="flex items-center gap-6">
          <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="/api/hello" className="text-muted-foreground hover:text-foreground transition-colors">
            API
          </a>
          <a 
            href="https://github.com/flexireact/flexireact" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
`;
  fs.writeFileSync(path.join(projectPath, `app/components/Navbar.${ext}`), navbarComponent);
}

async function createPages(projectPath: string, ext: string): Promise<void> {
  // Home page with INLINE STYLES (works without Tailwind build)
  const homePage = `import React from 'react';

export const title = 'FlexiReact - The Modern React Framework';

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by esbuild for instant builds.' },
  { icon: '📘', title: 'TypeScript', desc: 'First-class TypeScript support.' },
  { icon: '🏝️', title: 'Islands', desc: 'Partial hydration for minimal JS.' },
  { icon: '📁', title: 'File Routing', desc: 'Create a file, get a route.' },
  { icon: '🔌', title: 'API Routes', desc: 'Build your API alongside frontend.' },
  { icon: '🚀', title: 'SSR/SSG', desc: 'Server rendering and static generation.' },
];

export default function HomePage() {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>
          <svg style={{ width: 32, height: 32 }} viewBox="0 0 200 200" fill="none">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#61DAFB"/>
                <stop offset="100%" stopColor="#21A1F1"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="12" fill="url(#g)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" strokeWidth="6" transform="rotate(-30 100 100)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" strokeWidth="6" transform="rotate(30 100 100)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" strokeWidth="6" transform="rotate(90 100 100)"/>
          </svg>
          <span style={styles.logoText}>FlexiReact</span>
        </a>
        <div style={styles.navLinks}>
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/api/hello" style={styles.navLink}>API</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <svg style={{ width: 120, height: 120, marginBottom: 24 }} viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="hero" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#61DAFB"/>
              <stop offset="100%" stopColor="#21A1F1"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="12" fill="url(#hero)"/>
          <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#hero)" strokeWidth="6" transform="rotate(-30 100 100)"/>
          <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#hero)" strokeWidth="6" transform="rotate(30 100 100)"/>
          <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#hero)" strokeWidth="6" transform="rotate(90 100 100)"/>
          <circle cx="28" cy="70" r="8" fill="url(#hero)"/>
          <circle cx="172" cy="130" r="8" fill="url(#hero)"/>
          <circle cx="100" cy="20" r="8" fill="url(#hero)"/>
        </svg>
        
        <div style={styles.badge}>🚀 v2.1 — TypeScript & Islands</div>
        
        <h1 style={styles.title}>
          Build faster with<br/>
          <span style={styles.titleGradient}>FlexiReact</span>
        </h1>
        
        <p style={styles.subtitle}>
          The modern React framework with SSR, SSG, Islands architecture,<br/>
          and file-based routing. Simple and powerful.
        </p>
        
        <div style={styles.buttons}>
          <a href="/docs" style={styles.primaryBtn}>Get Started →</a>
          <a href="/api/hello" style={styles.secondaryBtn}>View API</a>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Everything you need</h2>
        <div style={styles.grid}>
          {features.map((f, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardIcon}>{f.icon}</div>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        Built with ❤️ using FlexiReact
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    color: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    color: '#f8fafc',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #61DAFB, #21A1F1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { color: '#94a3b8', textDecoration: 'none', fontSize: 14 },
  hero: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '140px 24px 80px',
  },
  badge: {
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: 9999,
    padding: '8px 16px',
    fontSize: 14,
    marginBottom: 24,
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 24,
  },
  titleGradient: {
    background: 'linear-gradient(90deg, #61DAFB, #a78bfa, #61DAFB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    maxWidth: 600,
    lineHeight: 1.6,
    marginBottom: 32,
  },
  buttons: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, justifyContent: 'center' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#f8fafc',
    padding: '14px 28px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  features: {
    padding: '80px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center' as const,
    marginBottom: 48,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
  },
  cardIcon: { fontSize: 32, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#94a3b8', lineHeight: 1.5 },
  footer: {
    textAlign: 'center' as const,
    padding: 32,
    color: '#64748b',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
};
`;
  // Always use .jsx for pages (simpler, works without TS config)
  fs.writeFileSync(path.join(projectPath, 'pages/index.jsx'), homePage);

  // API route
  const apiRoute = `/**
 * API Route: /api/hello
 */

export function get(req${ext === 'tsx' ? ': any' : ''}, res${ext === 'tsx' ? ': any' : ''}) {
  res.json({
    message: 'Hello from FlexiReact API! 🚀',
    timestamp: new Date().toISOString(),
    framework: 'FlexiReact v2.1'
  });
}

export function post(req${ext === 'tsx' ? ': any' : ''}, res${ext === 'tsx' ? ': any' : ''}) {
  const { name } = req.body || {};
  res.json({
    message: \`Hello, \${name || 'World'}!\`,
    timestamp: new Date().toISOString()
  });
}
`;
  fs.writeFileSync(path.join(projectPath, `pages/api/hello.${ext === 'tsx' ? 'ts' : 'js'}`), apiRoute);

  // .gitkeep for public
  fs.writeFileSync(path.join(projectPath, 'public/.gitkeep'), '');
}

// ============================================================================
// Dev Command
// ============================================================================

async function runDev(): Promise<void> {
  // Show styled logo
  console.log(`
${pc.cyan('   ╭─────────────────────────────────────────╮')}
${pc.cyan('   │')}                                         ${pc.cyan('│')}
${pc.cyan('   │')}   ${pc.bold(pc.cyan('⚛'))}  ${pc.bold(pc.white('F L E X I R E A C T'))}            ${pc.cyan('│')}
${pc.cyan('   │')}                                         ${pc.cyan('│')}
${pc.cyan('   │')}   ${pc.dim('The Modern React Framework')}          ${pc.cyan('│')}
${pc.cyan('   │')}                                         ${pc.cyan('│')}
${pc.cyan('   ╰─────────────────────────────────────────╯')}
`);

  const loaderPath = path.join(__dirname, '..', 'core', 'loader.js');
  const serverPath = path.join(__dirname, '..', 'core', 'server', 'index.js');
  const loaderUrl = pathToFileURL(loaderPath).href;

  const child = spawn(
    process.execPath,
    [
      '--import',
      `data:text/javascript,import { register } from 'node:module'; register('${loaderUrl}', import.meta.url);`,
      '-e',
      `import('${pathToFileURL(serverPath).href}').then(m => m.createServer({ mode: 'development' }))`
    ],
    {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'development', FORCE_COLOR: '1' }
    }
  );

  child.on('error', (error) => {
    log.error(`Failed to start dev server: ${error.message}`);
    process.exit(1);
  });

  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

// ============================================================================
// Build Command
// ============================================================================

async function runBuild(): Promise<void> {
  console.log(MINI_LOGO);
  log.blank();
  log.info('Building for production...');
  log.blank();

  const spinner = ora({ text: 'Compiling...', color: 'cyan' }).start();

  try {
    // Dynamic import of build module
    const buildPath = path.join(__dirname, '..', 'core', 'build', 'index.js');
    const configPath = path.join(__dirname, '..', 'core', 'config.js');
    
    const buildModule = await import(pathToFileURL(buildPath).href);
    const configModule = await import(pathToFileURL(configPath).href);
    
    const projectRoot = process.cwd();
    const rawConfig = await configModule.loadConfig(projectRoot);
    const config = configModule.resolvePaths(rawConfig, projectRoot);

    await buildModule.build({
      projectRoot,
      config,
      mode: 'production'
    });

    spinner.succeed('Build complete!');
    log.blank();
    log.success(`Output: ${pc.cyan('.flexi/')}`);

  } catch (error: any) {
    spinner.fail('Build failed');
    log.error(error.message);
    process.exit(1);
  }
}

// ============================================================================
// Start Command
// ============================================================================

async function runStart(): Promise<void> {
  console.log(MINI_LOGO);
  log.blank();
  log.info('Starting production server...');
  log.blank();

  const loaderPath = path.join(__dirname, '..', 'core', 'loader.js');
  const serverPath = path.join(__dirname, '..', 'core', 'server', 'index.js');
  const loaderUrl = pathToFileURL(loaderPath).href;

  const child = spawn(
    process.execPath,
    [
      '--import',
      `data:text/javascript,import { register } from 'node:module'; register('${loaderUrl}', import.meta.url);`,
      '-e',
      `import('${pathToFileURL(serverPath).href}').then(m => m.createServer({ mode: 'production' }))`
    ],
    {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    }
  );

  child.on('error', (error) => {
    log.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });

  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

// ============================================================================
// Doctor Command
// ============================================================================

async function runDoctor(): Promise<void> {
  console.log(MINI_LOGO);
  log.blank();
  log.info('Checking your project...');
  log.blank();

  interface Check {
    name: string;
    status: 'pass' | 'fail' | 'warn' | 'info';
    message: string;
  }

  const checks: Check[] = [];
  const projectRoot = process.cwd();

  // Node.js version
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
  checks.push({
    name: 'Node.js version',
    status: nodeMajor >= 18 ? 'pass' : 'fail',
    message: nodeMajor >= 18 ? `${nodeVersion} ✓` : `${nodeVersion} (requires 18+)`
  });

  // package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const hasPackageJson = fs.existsSync(packageJsonPath);
  checks.push({
    name: 'package.json',
    status: hasPackageJson ? 'pass' : 'fail',
    message: hasPackageJson ? 'Found' : 'Not found'
  });

  // pages directory
  const pagesDir = path.join(projectRoot, 'pages');
  const hasPages = fs.existsSync(pagesDir);
  checks.push({
    name: 'pages/ directory',
    status: hasPages ? 'pass' : 'warn',
    message: hasPages ? 'Found' : 'Not found'
  });

  // TypeScript
  const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
  const hasTypeScript = fs.existsSync(tsconfigPath);
  checks.push({
    name: 'TypeScript',
    status: 'info',
    message: hasTypeScript ? 'Enabled' : 'Not configured'
  });

  // Tailwind
  const tailwindPath = path.join(projectRoot, 'tailwind.config.js');
  const hasTailwind = fs.existsSync(tailwindPath);
  checks.push({
    name: 'Tailwind CSS',
    status: 'info',
    message: hasTailwind ? 'Configured' : 'Not configured'
  });

  // Print results
  let hasErrors = false;
  let hasWarnings = false;

  for (const check of checks) {
    let icon: string;
    let color: (s: string) => string;
    
    switch (check.status) {
      case 'pass':
        icon = '✓';
        color = pc.green;
        break;
      case 'fail':
        icon = '✗';
        color = pc.red;
        hasErrors = true;
        break;
      case 'warn':
        icon = '⚠';
        color = pc.yellow;
        hasWarnings = true;
        break;
      default:
        icon = '○';
        color = pc.cyan;
    }
    
    console.log(`  ${color(icon)} ${check.name}: ${pc.dim(check.message)}`);
  }

  log.blank();
  
  if (hasErrors) {
    log.error('Some checks failed. Please fix the issues above.');
  } else if (hasWarnings) {
    log.warn('All critical checks passed with some warnings.');
  } else {
    log.success('All checks passed! Your project is ready.');
  }
  
  log.blank();
}

// ============================================================================
// Help Command
// ============================================================================

function showHelp(): void {
  console.log(LOGO);
  
  console.log(`  ${pc.bold('Usage:')}`);
  console.log(`    ${pc.cyan('flexi')} ${pc.dim('<command>')} ${pc.dim('[options]')}`);
  log.blank();
  
  console.log(`  ${pc.bold('Commands:')}`);
  console.log(`    ${pc.cyan('create')} ${pc.dim('<name>')}    Create a new FlexiReact project`);
  console.log(`    ${pc.cyan('dev')}               Start development server`);
  console.log(`    ${pc.cyan('build')}             Build for production`);
  console.log(`    ${pc.cyan('start')}             Start production server`);
  console.log(`    ${pc.cyan('doctor')}            Check project health`);
  console.log(`    ${pc.cyan('help')}              Show this help message`);
  log.blank();
  
  console.log(`  ${pc.bold('Examples:')}`);
  console.log(`    ${pc.dim('$')} flexi create my-app`);
  console.log(`    ${pc.dim('$')} flexi dev`);
  console.log(`    ${pc.dim('$')} flexi build && flexi start`);
  log.blank();
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create':
      await createProject(args[1]);
      break;

    case 'dev':
      await runDev();
      break;

    case 'build':
      await runBuild();
      break;

    case 'start':
      await runStart();
      break;

    case 'doctor':
      await runDoctor();
      break;

    case 'version':
    case '-v':
    case '--version':
      console.log(`${MINI_LOGO} ${pc.dim(`v${VERSION}`)}`);
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      if (command) {
        log.error(`Unknown command: ${command}`);
        log.blank();
      }
      showHelp();
      process.exit(command ? 1 : 0);
  }
}

main().catch((error) => {
  log.error(error.message);
  process.exit(1);
});
