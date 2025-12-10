#!/usr/bin/env node

/**
 * create-flexireact CLI v3.0.2
 * Create FlexiReact applications with ease
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import { TEMPLATES, getTemplateFiles } from './templates/index.js';
import { BANNER, SUCCESS_BANNER, colors as c } from './ui.js';

// ============================================================================
// Utilities
// ============================================================================

function log(msg: string): void {
  console.log(`   ${msg}`);
}

function success(msg: string): void {
  console.log(`   ${c.green}✓${c.reset} ${msg}`);
}

function error(msg: string): void {
  console.log(`   ${c.red}✗${c.reset} ${msg}`);
}

function info(msg: string): void {
  console.log(`   ${c.cyan}ℹ${c.reset} ${msg}`);
}

async function prompt(question: string, defaultValue: string = ''): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const defaultText = defaultValue ? ` ${c.dim}(${defaultValue})${c.reset}` : '';
    rl.question(`   ${c.cyan}?${c.reset} ${question}${defaultText}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

interface SelectOption {
  key: string;
  name: string;
  description: string;
  icon: string;
}

async function select(question: string, options: SelectOption[]): Promise<SelectOption> {
  console.log(`   ${c.cyan}?${c.reset} ${question}\n`);
  
  options.forEach((opt, i) => {
    console.log(`      ${c.dim}${i + 1}.${c.reset} ${opt.icon} ${c.bold}${opt.name}${c.reset}`);
    console.log(`         ${c.dim}${opt.description}${c.reset}\n`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`   ${c.cyan}→${c.reset} Enter number (1-${options.length}): `, (answer) => {
      rl.close();
      const index = parseInt(answer.trim()) - 1;
      if (index >= 0 && index < options.length) {
        resolve(options[index]);
      } else {
        resolve(options[0]);
      }
    });
  });
}

class Spinner {
  private message: string;
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private current = 0;
  private interval: NodeJS.Timeout | null = null;
  private startTime = 0;

  constructor(message: string) {
    this.message = message;
  }

  start(): void {
    this.startTime = Date.now();
    process.stdout.write(`   ${this.frames[0]} ${this.message}`);
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.frames.length;
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`   ${c.primary}${this.frames[this.current]}${c.reset} ${this.message} ${c.dim}(${elapsed}s)${c.reset}`);
    }, 80);
  }

  stop(isSuccess = true): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    const icon = isSuccess ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    console.log(`   ${icon} ${this.message} ${c.dim}(${elapsed}s)${c.reset}`);
  }
}

function isDirEmpty(dir: string): boolean {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
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
  const templateOptions: SelectOption[] = Object.entries(TEMPLATES).map(([key, value]) => ({
    key,
    ...value,
  }));
  
  const selectedTemplate = await select('Select a template:', templateOptions);
  const templateKey = selectedTemplate.key;

  console.log('');
  log(`Creating project in ${c.cyan}${projectPath}${c.reset}`);
  console.log('');

  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });

  // Write template files
  const spinner1 = new Spinner('Creating project structure...');
  spinner1.start();

  try {
    const files = getTemplateFiles(templateKey, projectName);
    
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content);
    }
    
    spinner1.stop(true);
  } catch (err) {
    spinner1.stop(false);
    error(`Failed to create project: ${(err as Error).message}`);
    process.exit(1);
  }

  // Initialize git
  const spinner2 = new Spinner('Initializing git repository...');
  spinner2.start();

  try {
    execSync('git init', { cwd: projectPath, stdio: 'ignore' });
    execSync('git add .', { cwd: projectPath, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from create-flexireact"', { cwd: projectPath, stdio: 'ignore' });
    spinner2.stop(true);
  } catch {
    spinner2.stop(false);
    // Git init is not critical, continue
  }

  // Success message
  console.log('');
  console.log(SUCCESS_BANNER(projectName));
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
