#!/usr/bin/env node

/**
 * @flexi/react-ui CLI
 * Add components to your project
 */

import fs from 'fs';
import path from 'path';

const COMPONENTS_URL = 'https://raw.githubusercontent.com/flexireact/react-ui/main/src/components';

const AVAILABLE_COMPONENTS = [
  'button',
  'input',
  'textarea',
  'checkbox',
  'switch',
  'card',
  'badge',
  'avatar',
  'modal',
  'alert',
  'spinner',
  'skeleton',
  'progress',
  'separator',
  'stack',
];

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function error(msg: string) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`);
}

function info(msg: string) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`);
}

function showHelp() {
  log(`
${colors.cyan}@flexi/react-ui CLI${colors.reset}

${colors.dim}Usage:${colors.reset}
  npx flexi-ui <command> [options]

${colors.dim}Commands:${colors.reset}
  add <component>    Add a component to your project
  list               List all available components
  init               Initialize flexi-ui in your project

${colors.dim}Examples:${colors.reset}
  npx flexi-ui add button
  npx flexi-ui add card modal
  npx flexi-ui list
  npx flexi-ui init

${colors.dim}Available Components:${colors.reset}
  ${AVAILABLE_COMPONENTS.join(', ')}
`);
}

function listComponents() {
  log(`
${colors.cyan}Available Components${colors.reset}

${colors.dim}Core:${colors.reset}
  • button      - Versatile button with variants
  • input       - Text input with validation
  • textarea    - Multi-line text input
  • checkbox    - Checkbox with label
  • switch      - Toggle switch

${colors.dim}Display:${colors.reset}
  • card        - Content container
  • badge       - Status indicator
  • avatar      - User avatar with fallback

${colors.dim}Feedback:${colors.reset}
  • alert       - Alert messages
  • spinner     - Loading indicators
  • skeleton    - Loading placeholders
  • progress    - Progress bar

${colors.dim}Layout:${colors.reset}
  • stack       - Flex layout helpers
  • separator   - Visual divider

${colors.dim}Overlay:${colors.reset}
  • modal       - Dialog/modal window
`);
}

async function initProject() {
  const cwd = process.cwd();
  
  // Check if package.json exists
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    error('No package.json found. Run this command in a project directory.');
    process.exit(1);
  }

  info('Initializing @flexi/react-ui...');

  // Create components directory
  const componentsDir = path.join(cwd, 'components', 'ui');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
    success('Created components/ui directory');
  }

  // Create utils/cn.ts
  const utilsDir = path.join(cwd, 'lib');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  const cnContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  fs.writeFileSync(path.join(utilsDir, 'utils.ts'), cnContent);
  success('Created lib/utils.ts');

  // Update tailwind.config
  info('Add the following to your tailwind.config.js:');
  log(`
${colors.dim}// tailwind.config.js${colors.reset}
const { flexiUIPlugin } = require('@flexi/react-ui/tailwind');

module.exports = {
  darkMode: 'class',
  content: [
    // ... your content paths
    './node_modules/@flexi/react-ui/dist/**/*.js',
  ],
  plugins: [flexiUIPlugin],
};
`);

  success('Initialization complete!');
  info('Run: npm install @flexi/react-ui clsx tailwind-merge');
}

async function addComponent(componentNames: string[]) {
  const cwd = process.cwd();
  const componentsDir = path.join(cwd, 'components', 'ui');

  // Ensure directory exists
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  for (const name of componentNames) {
    const lowerName = name.toLowerCase();
    
    if (!AVAILABLE_COMPONENTS.includes(lowerName)) {
      error(`Unknown component: ${name}`);
      info(`Available: ${AVAILABLE_COMPONENTS.join(', ')}`);
      continue;
    }

    const targetPath = path.join(componentsDir, `${lowerName}.tsx`);
    
    if (fs.existsSync(targetPath)) {
      info(`${name} already exists, skipping...`);
      continue;
    }

    // For now, create a placeholder that imports from the package
    const content = `// ${name} component
// This file re-exports from @flexi/react-ui for customization
// You can copy the full source from the package if you need to modify it

export { ${name.charAt(0).toUpperCase() + name.slice(1)} } from '@flexi/react-ui';
`;

    fs.writeFileSync(targetPath, content);
    success(`Added ${name} to components/ui/`);
  }
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

switch (command) {
  case 'list':
    listComponents();
    break;
  case 'init':
    initProject();
    break;
  case 'add':
    const components = args.slice(1);
    if (components.length === 0) {
      error('Please specify component(s) to add');
      info('Example: npx flexi-ui add button card');
      process.exit(1);
    }
    addComponent(components);
    break;
  default:
    error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
