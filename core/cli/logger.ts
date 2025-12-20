/**
 * FlexiReact CLI Logger - Premium Console Output
 * Beautiful, modern, and professional CLI aesthetics
 */

import pc from 'picocolors';

// ============================================================================
// Color Palette
// ============================================================================

const colors = {
  primary: (text) => pc.green(text),        // Neon emerald
  secondary: (text) => pc.cyan(text),       // Cyan
  accent: (text) => pc.magenta(text),       // Magenta accent
  success: (text) => pc.green(text),        // Success green
  error: (text) => pc.red(text),            // Error red
  warning: (text) => pc.yellow(text),       // Warning yellow
  info: (text) => pc.blue(text),            // Info blue
  muted: (text) => pc.dim(text),            // Muted/dim
  bold: (text) => pc.bold(text),            // Bold
  white: (text) => pc.white(text),          // White
};

// ============================================================================
// Icons & Symbols
// ============================================================================

const icons = {
  success: pc.green('✓'),
  error: pc.red('✗'),
  warning: pc.yellow('⚠'),
  info: pc.blue('ℹ'),
  arrow: pc.dim('→'),
  dot: pc.dim('•'),
  star: pc.yellow('★'),
  rocket: '🚀',
  lightning: '⚡',
  puzzle: '🧩',
  island: '🏝️',
  plug: '🔌',
  package: '📦',
  folder: '📁',
  file: '📄',
  globe: '🌐',
  check: pc.green('✔'),
  cross: pc.red('✘'),
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
};

// ============================================================================
// Box Drawing
// ============================================================================

const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  horizontalDown: '┬',
  horizontalUp: '┴',
  verticalRight: '├',
  verticalLeft: '┤',
};

interface BoxOptions {
  padding?: number;
  borderColor?: (s: string) => string;
  width?: number;
}

function createBox(content: string, options: BoxOptions = {}) {
  const {
    padding = 1,
    borderColor = colors.primary,
    width = 50
  } = options;

  const lines = content.split('\n');
  const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), width - 4);
  const innerWidth = maxLen + (padding * 2);

  const top = borderColor(box.topLeft + box.horizontal.repeat(innerWidth) + box.topRight);
  const bottom = borderColor(box.bottomLeft + box.horizontal.repeat(innerWidth) + box.bottomRight);
  const empty = borderColor(box.vertical) + ' '.repeat(innerWidth) + borderColor(box.vertical);

  const contentLines = lines.map(line => {
    const stripped = stripAnsi(line);
    const pad = innerWidth - stripped.length - padding;
    return borderColor(box.vertical) + ' '.repeat(padding) + line + ' '.repeat(Math.max(0, pad)) + borderColor(box.vertical);
  });

  const paddingLines = padding > 0 ? [empty] : [];

  return [top, ...paddingLines, ...contentLines, ...paddingLines, bottom].join('\n');
}

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

// ============================================================================
// ASCII Art Banners
// ============================================================================

const banners = {
  // Main banner - Gradient style
  main: `
${pc.cyan('   ╭─────────────────────────────────────────╮')}
${pc.cyan('   │')}                                           ${pc.cyan('│')}
${pc.cyan('   │')}   ${pc.bold(pc.green('⚡'))} ${pc.bold(pc.white('F L E X I R E A C T'))}              ${pc.cyan('│')}
${pc.cyan('   │')}                                           ${pc.cyan('│')}
${pc.cyan('   │')}   ${pc.dim('The Modern React Framework')}            ${pc.cyan('│')}
${pc.cyan('   │')}                                           ${pc.cyan('│')}
${pc.cyan('   ╰─────────────────────────────────────────╯')}
`,

  // Compact banner
  compact: `
  ${pc.green('⚡')} ${pc.bold('FlexiReact')} ${pc.dim('v3.0.3')}
`,

  // Build banner
  build: `
${pc.cyan('   ╭─────────────────────────────────────────╮')}
${pc.cyan('   │')}   ${pc.bold(pc.green('⚡'))} ${pc.bold('FlexiReact Build')}                    ${pc.cyan('│')}
${pc.cyan('   ╰─────────────────────────────────────────╯')}
`,
};

// ============================================================================
// Server Status Panel
// ============================================================================

function serverPanel(config) {
  const {
    mode = 'development',
    port = 3000,
    host = 'localhost',
    pagesDir = './pages',
    islands = true,
    rsc = true,
  } = config;

  const modeColor = mode === 'development' ? colors.warning : colors.success;
  const url = `http://${host}:${port}`;

  console.log('');
  console.log(pc.dim('   ─────────────────────────────────────────'));
  console.log(`   ${icons.arrow} ${pc.dim('Mode:')}    ${modeColor(mode)}`);
  console.log(`   ${icons.arrow} ${pc.dim('Local:')}   ${pc.cyan(pc.underline(url))}`);
  console.log(`   ${icons.arrow} ${pc.dim('Pages:')}   ${pc.white(pagesDir)}`);
  console.log(`   ${icons.arrow} ${pc.dim('Islands:')} ${islands ? pc.green('enabled') : pc.dim('disabled')}`);
  console.log(`   ${icons.arrow} ${pc.dim('RSC:')}     ${rsc ? pc.green('enabled') : pc.dim('disabled')}`);
  console.log(pc.dim('   ─────────────────────────────────────────'));
  console.log('');
  console.log(`   ${icons.success} ${pc.green('Ready for requests...')}`);
  console.log('');
}

// ============================================================================
// Plugin Loader
// ============================================================================

function pluginLoader(plugins = []) {
  console.log('');
  console.log(`${icons.package} ${pc.bold('Loading plugins...')}`);
  console.log('');

  if (plugins.length === 0) {
    console.log(`   ${pc.dim('No plugins configured')}`);
  } else {
    plugins.forEach((plugin, i) => {
      console.log(`   ${icons.check} ${pc.white(plugin.name)} ${pc.dim(`v${plugin.version || '1.0.0'}`)}`);
    });
  }

  console.log('');
  console.log(`   ${pc.dim('Total plugins:')} ${pc.white(plugins.length)}`);
  console.log('');
}

// ============================================================================
// HTTP Request Logger
// ============================================================================

function request(method: string, path: string, statusCode: number, duration: number, options: { type?: string } = {}) {
  const { type = 'dynamic' } = options;

  // Method colors
  const methodColors = {
    GET: pc.green,
    POST: pc.blue,
    PUT: pc.yellow,
    DELETE: pc.red,
    PATCH: pc.magenta,
  };

  // Type badges
  const typeBadges = {
    ssr: `${pc.yellow('[SSR]')}`,
    ssg: `${pc.green('[SSG]')}`,
    rsc: `${pc.magenta('[RSC]')}`,
    island: `${pc.cyan('[ISL]')}`,
    api: `${pc.blue('[API]')}`,
    asset: `${pc.dim('[AST]')}`,
    dynamic: `${pc.yellow('[SSR]')}`,
  };

  // Status colors
  const statusColor = statusCode >= 500 ? pc.red :
    statusCode >= 400 ? pc.yellow :
      statusCode >= 300 ? pc.cyan :
        pc.green;

  const methodColor = methodColors[method] || pc.white;
  const badge = typeBadges[type] || typeBadges.dynamic;
  const durationStr = duration < 100 ? pc.green(`${duration}ms`) :
    duration < 500 ? pc.yellow(`${duration}ms`) :
      pc.red(`${duration}ms`);

  console.log(`   ${methodColor(method.padEnd(6))} ${pc.white(path)}`);
  console.log(`   ${pc.dim('└─')} ${badge} ${statusColor(statusCode)} ${pc.dim('(')}${durationStr}${pc.dim(')')}`);
}

// ============================================================================
// Error & Warning Formatters
// ============================================================================

function error(title, message, stack = null, suggestions = []) {
  console.log('');
  console.log(pc.red('   ╭─────────────────────────────────────────────────────────╮'));
  console.log(pc.red('   │') + ` ${pc.red(pc.bold('✗ ERROR'))}                                               ` + pc.red('│'));
  console.log(pc.red('   ├─────────────────────────────────────────────────────────┤'));
  console.log(pc.red('   │') + ` ${pc.white(title.substring(0, 55).padEnd(55))} ` + pc.red('│'));
  console.log(pc.red('   │') + ' '.repeat(57) + pc.red('│'));

  // Message lines
  const msgLines = message.split('\n').slice(0, 3);
  msgLines.forEach(line => {
    console.log(pc.red('   │') + ` ${pc.dim(line.substring(0, 55).padEnd(55))} ` + pc.red('│'));
  });

  if (suggestions.length > 0) {
    console.log(pc.red('   │') + ' '.repeat(57) + pc.red('│'));
    console.log(pc.red('   │') + ` ${pc.cyan('Suggestions:')}                                          ` + pc.red('│'));
    suggestions.slice(0, 2).forEach(s => {
      console.log(pc.red('   │') + ` ${pc.dim('→')} ${pc.white(s.substring(0, 52).padEnd(52))} ` + pc.red('│'));
    });
  }

  console.log(pc.red('   ╰─────────────────────────────────────────────────────────╯'));
  console.log('');
}

function warning(title, message) {
  console.log('');
  console.log(pc.yellow('   ⚠ WARNING: ') + pc.white(title));
  console.log(pc.dim(`     ${message}`));
  console.log('');
}

function info(message) {
  console.log(`   ${icons.info} ${message}`);
}

function success(message) {
  console.log(`   ${icons.success} ${pc.green(message)}`);
}

// ============================================================================
// Build Logger
// ============================================================================

function buildStart() {
  console.log(banners.build);
  console.log(`   ${icons.rocket} ${pc.bold('Starting production build...')}`);
  console.log('');
}

function buildStep(step, total, message) {
  console.log(`   ${pc.dim(`[${step}/${total}]`)} ${message}`);
}

function buildComplete(stats) {
  const { duration, pages, size } = stats;

  console.log('');
  console.log(pc.green('   ╭─────────────────────────────────────────╮'));
  console.log(pc.green('   │') + ` ${pc.green(pc.bold('✓ Build completed successfully!'))}        ` + pc.green('│'));
  console.log(pc.green('   ├─────────────────────────────────────────┤'));
  console.log(pc.green('   │') + ` ${pc.dim('Duration:')}  ${pc.white(duration + 'ms').padEnd(27)} ` + pc.green('│'));
  console.log(pc.green('   │') + ` ${pc.dim('Pages:')}     ${pc.white(pages + ' pages').padEnd(27)} ` + pc.green('│'));
  console.log(pc.green('   │') + ` ${pc.dim('Size:')}      ${pc.white(size).padEnd(27)} ` + pc.green('│'));
  console.log(pc.green('   ╰─────────────────────────────────────────╯'));
  console.log('');
}

// ============================================================================
// Dividers & Spacing
// ============================================================================

function divider() {
  console.log(pc.dim('   ─────────────────────────────────────────'));
}

function blank() {
  console.log('');
}

function clear() {
  console.clear();
}

// ============================================================================
// Export
// ============================================================================

export const logger = {
  // Banners
  banner: () => console.log(banners.main),
  bannerCompact: () => console.log(banners.compact),

  // Panels
  serverPanel,
  pluginLoader,

  // Logging
  request,
  error,
  warning,
  info,
  success,

  // Build
  buildStart,
  buildStep,
  buildComplete,

  // Utilities
  divider,
  blank,
  clear,
  createBox,

  // Colors & Icons
  colors,
  icons,
};

export default logger;
