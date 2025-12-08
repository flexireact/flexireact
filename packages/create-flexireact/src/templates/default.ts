/**
 * Default Template - Full-featured FlexiReact v2 setup
 * 
 * Structure:
 * - app/          : Layout, components, styles, providers
 * - routes/       : FlexiReact v2 file-based routing
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
        css: 'npx @tailwindcss/cli -i ./app/styles/globals.css -o ./public/styles.css --minify',
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
            href="https://github.com/nicksdev/flexireact" 
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
        <p>Built with FlexiReact v2 • {new Date().getFullYear()}</p>
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
    'app/styles/globals.css': `@import "tailwindcss" source("../..");

/* FlexiReact v2 Theme */
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
`,

    // ========================================================================
    // Routes Directory - FlexiReact v2 Routing
    // ========================================================================

    'routes/(public)/home.tsx': `import React from 'react';
import { Button } from '@/app/components/ui';

export const metadata = {
  title: 'FlexiReact v2 - The Modern React Framework',
  description: 'Build fast, modern web apps with FlexiReact v2',
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        {/* Logo */}
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,156,0.3)]">
          <span className="text-black font-bold text-3xl">F</span>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to{' '}
          <span className="text-primary">FlexiReact v2</span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
          The modern React framework with SSR, Islands, App Router, and more.
          Build blazing fast web applications with ease.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg">Get Started →</Button>
          <Button variant="outline" size="lg">Documentation</Button>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { icon: '⚡', label: 'SSR/SSG' },
            { icon: '🏝️', label: 'Islands' },
            { icon: '📦', label: 'File Routing' },
            { icon: '🎨', label: 'Tailwind v4' },
          ].map((feature) => (
            <div key={feature.label} className="p-4 rounded-xl bg-white/5 border border-border">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-sm font-medium">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
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
          This page demonstrates dynamic routing in FlexiReact v2. 
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
