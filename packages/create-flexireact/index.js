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
    description: 'Basic FlexiReact app with TypeScript and Tailwind',
  },
  'flexi-ui': {
    name: 'FlexiUI',
    description: 'FlexiReact with FlexiUI component library',
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

function step(num, total, msg) {
  console.log(`   ${c.dim}[${num}/${total}]${c.reset} ${msg}`);
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

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Check if directory is empty
function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

// ============================================================================
// Template Files (Inline for npm package)
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
      css: "npx tailwindcss -i ./app/styles/input.css -o ./public/styles.css --minify"
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "@flexireact/core": "^1.0.0",
      ...(template === 'flexi-ui' && { "@flexireact/flexi-ui": "^1.0.0" })
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      typescript: "^5.3.0",
      tailwindcss: "^3.4.0",
      postcss: "^8.4.32",
      autoprefixer: "^10.4.16"
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

  'tailwind.config.js': (name, template) => `/** @type {import('tailwindcss').Config} */
${template === 'flexi-ui' ? "const { flexiUIPlugin } = require('@flexireact/flexi-ui/tailwind');\n" : ''}
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    ${template === 'flexi-ui' ? "'./node_modules/@flexireact/flexi-ui/dist/**/*.js'," : ''}
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [${template === 'flexi-ui' ? 'flexiUIPlugin' : ''}],
};
`,

  'postcss.config.js': () => `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  'flexireact.config.js': (name, template) => `/** @type {import('@flexireact/core').Config} */
export default {
  // Styles to include
  styles: [
    '/styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  ],
  
  // Favicon
  favicon: '/favicon.svg',
  
  // Server options
  server: {
    port: 3000
  },
  
  // Islands (partial hydration)
  islands: {
    enabled: true
  }
};
`,

  'pages/index.tsx': (name, template) => template === 'flexi-ui' ? `import React from 'react';

export default function HomePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center">
        <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full mb-6" style={{ backgroundColor: 'rgba(0,255,156,0.1)', color: '#00FF9C', border: '1px solid rgba(0,255,156,0.3)' }}>
          ✨ Welcome to FlexiReact
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Build amazing apps with{' '}
          <span style={{ color: '#00FF9C' }}>FlexiReact</span>
        </h1>
        
        <p className="text-lg opacity-70 mb-8 max-w-2xl mx-auto">
          The modern React framework with TypeScript, Tailwind CSS, SSR, and Islands architecture.
        </p>

        <div className="flex gap-4 justify-center">
          <a href="/docs" className="px-6 py-3 font-medium rounded-xl text-black" style={{ backgroundColor: '#00FF9C' }}>
            Get Started →
          </a>
          <a href="https://github.com/flexireact/flexireact" className="px-6 py-3 font-medium rounded-xl border border-[var(--flexi-border)] hover:bg-[var(--flexi-bg-muted)] transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
` : `import React from 'react';

export default function HomePage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <span className="inline-block px-4 py-2 text-sm font-medium rounded-full mb-8 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          ⚡ The Modern React Framework
        </span>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white">
          Build amazing apps with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            FlexiReact
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A blazing-fast React framework with TypeScript, Tailwind CSS, SSR, SSG, 
          Islands architecture, and file-based routing.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a 
            href="https://github.com/flexireact/flexireact" 
            className="px-8 py-4 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
          >
            Get Started →
          </a>
          <a 
            href="https://github.com/flexireact/flexireact" 
            className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
          >
            GitHub
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-slate-400 text-sm">Powered by esbuild for instant builds and sub-second HMR.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">🏝️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Islands Architecture</h3>
            <p className="text-slate-400 text-sm">Partial hydration for minimal JavaScript and maximum performance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-lg font-semibold text-white mb-2">File-based Routing</h3>
            <p className="text-slate-400 text-sm">Create a file in pages/, get a route automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'layouts/root.tsx': (name, template) => template === 'flexi-ui' ? `import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--flexi-bg)', color: 'var(--flexi-fg)' }}>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--flexi-border)] backdrop-blur-sm" style={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}>
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00FF9C, #00CC7D)' }}>
              <span className="text-black font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl">FlexiReact</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm opacity-70 hover:opacity-100">Home</a>
            <a href="/about" className="text-sm opacity-70 hover:opacity-100">About</a>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-[var(--flexi-border)] py-8 text-center text-sm opacity-70">
        Built with FlexiReact
      </footer>
    </div>
  );
}
` : `import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-emerald-400">⚡</span> FlexiReact
          </a>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm text-slate-400 hover:text-white">Home</a>
            <a href="/about" className="text-sm text-slate-400 hover:text-white">About</a>
            <a href="https://github.com/flexireact/flexireact" className="text-sm px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400">
              GitHub
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-700 py-8 text-center text-sm text-slate-500">
        Built with ❤️ using FlexiReact
      </footer>
    </div>
  );
}
`,

  'app/styles/input.css': () => `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --flexi-bg: #0f172a;
    --flexi-fg: #f8fafc;
    --flexi-bg-subtle: #1e293b;
    --flexi-bg-muted: #334155;
    --flexi-border: #475569;
    --flexi-fg-muted: #94a3b8;
    --flexi-primary: #10b981;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background-color: #0f172a;
    color: #f8fafc;
    min-height: 100vh;
  }
}
`,

  'public/.gitkeep': () => '',
  
  'public/favicon.svg': () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <path d="M25 70V30h30v10H37v8h15v10H37v12H25z" fill="url(#grad)"/>
  <circle cx="65" cy="65" r="8" fill="url(#grad)"/>
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
    error(`Directory "${projectName}" already exists and is not empty`);
    process.exit(1);
  }

  console.log('');

  // Select template
  const templateOptions = Object.entries(TEMPLATES).map(([key, value]) => ({
    key,
    ...value,
  }));
  
  const selectedTemplate = await select('Select a template:', templateOptions);
  const template = selectedTemplate.key;

  console.log('');
  console.log(`   ${c.dim}Creating project in${c.reset} ${c.cyan}${projectPath}${c.reset}`);
  console.log('');

  // Create project directory
  const spinner1 = new Spinner('Creating project structure...');
  spinner1.start();

  try {
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'pages'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'layouts'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'app', 'styles'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'components'), { recursive: true });
    
    spinner1.stop(true);
  } catch (err) {
    spinner1.stop(false);
    error(`Failed to create directory: ${err.message}`);
    process.exit(1);
  }

  // Write template files
  const spinner2 = new Spinner('Writing template files...');
  spinner2.start();

  try {
    for (const [filePath, generator] of Object.entries(TEMPLATE_FILES)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const content = generator(projectName, template);
      fs.writeFileSync(fullPath, content);
    }
    
    spinner2.stop(true);
  } catch (err) {
    spinner2.stop(false);
    error(`Failed to write files: ${err.message}`);
    process.exit(1);
  }

  // Create .gitignore
  const spinner3 = new Spinner('Creating configuration files...');
  spinner3.start();

  try {
    fs.writeFileSync(path.join(projectPath, '.gitignore'), `# Dependencies
node_modules/

# Build
.flexi/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
`);

    fs.writeFileSync(path.join(projectPath, 'README.md'), `# ${projectName}

A FlexiReact application.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

- [FlexiReact Documentation](https://github.com/flexireact/flexireact)
- [FlexiUI Components](https://github.com/flexireact/flexi-ui)
`);

    spinner3.stop(true);
  } catch (err) {
    spinner3.stop(false);
    error(`Failed to create config files: ${err.message}`);
    process.exit(1);
  }

  // Done!
  console.log(SUCCESS_BANNER(projectName));
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
