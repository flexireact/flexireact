/**
 * FlexiReact Logger
 * Premium console output inspired by Next.js, Vite, and Bun
 */

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  
  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

const c = colors;

// Get current time formatted
function getTime() {
  const now = new Date();
  return `${c.dim}${now.toLocaleTimeString('en-US', { hour12: false })}${c.reset}`;
}

// Status code colors
function getStatusColor(status) {
  if (status >= 500) return c.red;
  if (status >= 400) return c.yellow;
  if (status >= 300) return c.cyan;
  if (status >= 200) return c.green;
  return c.white;
}

// Method colors
function getMethodColor(method) {
  const methodColors = {
    GET: c.brightGreen,
    POST: c.brightBlue,
    PUT: c.brightYellow,
    PATCH: c.brightMagenta,
    DELETE: c.brightRed,
    OPTIONS: c.gray,
    HEAD: c.gray,
  };
  return methodColors[method] || c.white;
}

// Format time
function formatTime(ms) {
  if (ms < 1) return `${c.gray}<1ms${c.reset}`;
  if (ms < 100) return `${c.green}${ms}ms${c.reset}`;
  if (ms < 500) return `${c.yellow}${ms}ms${c.reset}`;
  return `${c.red}${ms}ms${c.reset}`;
}

// FlexiReact ASCII Logo - Premium Design
const LOGO = `
${c.green}   ╭─────────────────────────────────────────────╮${c.reset}
${c.green}   │${c.reset}                                             ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.brightGreen}⚡${c.reset} ${c.bold}${c.white}F L E X I R E A C T${c.reset}   ${c.dim}v1.0.0${c.reset}       ${c.green}│${c.reset}
${c.green}   │${c.reset}                                             ${c.green}│${c.reset}
${c.green}   │${c.reset}   ${c.dim}The Modern React Framework${c.reset}              ${c.green}│${c.reset}
${c.green}   │${c.reset}                                             ${c.green}│${c.reset}
${c.green}   ╰─────────────────────────────────────────────╯${c.reset}
`;

const MINI_LOGO = `${c.brightGreen}⚡${c.reset} ${c.bold}FlexiReact${c.reset}`;

// Compact ready message like Next.js
const READY_MSG = `   ${c.green}▲${c.reset} ${c.bold}Ready${c.reset} in`;

export const logger = {
  // Show startup logo
  logo() {
    console.log(LOGO);
  },

  // Server started - Next.js style
  serverStart(config, startTime = Date.now()) {
    const { port, host, mode, pagesDir, islands, rsc } = config;
    const elapsed = Date.now() - startTime;
    
    console.log('');
    console.log(`   ${c.green}▲${c.reset} ${c.bold}Ready${c.reset} in ${c.cyan}${elapsed}ms${c.reset}`);
    console.log('');
    console.log(`   ${c.dim}┌${c.reset} ${c.bold}Local:${c.reset}        ${c.cyan}http://${host}:${port}${c.reset}`);
    console.log(`   ${c.dim}├${c.reset} ${c.bold}Environment:${c.reset}  ${mode === 'development' ? `${c.yellow}development${c.reset}` : `${c.green}production${c.reset}`}`);
    if (islands) {
      console.log(`   ${c.dim}├${c.reset} ${c.bold}Islands:${c.reset}      ${c.green}enabled${c.reset}`);
    }
    if (rsc) {
      console.log(`   ${c.dim}├${c.reset} ${c.bold}RSC:${c.reset}          ${c.green}enabled${c.reset}`);
    }
    console.log(`   ${c.dim}└${c.reset} ${c.bold}Pages:${c.reset}        ${c.dim}${pagesDir}${c.reset}`);
    console.log('');
  },

  // HTTP request log - Compact single line like Next.js
  request(method, path, status, time, extra = {}) {
    const methodColor = getMethodColor(method);
    const statusColor = getStatusColor(status);
    const timeStr = formatTime(time);
    
    // Route type badge
    let badge = '';
    if (extra.type === 'static' || extra.type === 'ssg') {
      badge = `${c.dim}○${c.reset}`;  // Static
    } else if (extra.type === 'dynamic' || extra.type === 'ssr') {
      badge = `${c.magenta}ƒ${c.reset}`;  // Function/SSR
    } else if (extra.type === 'api') {
      badge = `${c.blue}λ${c.reset}`;  // API
    } else if (extra.type === 'asset') {
      badge = `${c.dim}◦${c.reset}`;  // Asset
    } else {
      badge = `${c.magenta}ƒ${c.reset}`;
    }
    
    const statusStr = `${statusColor}${status}${c.reset}`;
    const methodStr = `${methodColor}${method}${c.reset}`;
    
    // Single line format like Next.js
    console.log(`   ${badge} ${methodStr} ${path} ${statusStr} ${c.dim}in${c.reset} ${timeStr}`);
  },

  // Info message
  info(msg) {
    console.log(`   ${c.cyan}ℹ${c.reset} ${msg}`);
  },

  // Success message
  success(msg) {
    console.log(`   ${c.green}✓${c.reset} ${msg}`);
  },

  // Warning message
  warn(msg) {
    console.log(`   ${c.yellow}⚠${c.reset} ${c.yellow}${msg}${c.reset}`);
  },

  // Error message
  error(msg, err = null) {
    console.log(`   ${c.red}✗${c.reset} ${c.red}${msg}${c.reset}`);
    if (err && err.stack) {
      const stack = err.stack.split('\n').slice(1, 4).join('\n');
      console.log(`${c.dim}${stack}${c.reset}`);
    }
  },

  // Compilation message
  compile(file, time) {
    console.log(`   ${c.magenta}◉${c.reset} Compiled ${c.cyan}${file}${c.reset} ${c.dim}(${time}ms)${c.reset}`);
  },

  // Hot reload
  hmr(file) {
    console.log(`   ${c.yellow}↻${c.reset} HMR update: ${c.cyan}${file}${c.reset}`);
  },

  // Plugin loaded
  plugin(name) {
    console.log(`   ${c.blue}⬡${c.reset} Plugin: ${c.cyan}${name}${c.reset}`);
  },

  // Route info
  route(path, type) {
    const typeColors = {
      static: c.green,
      dynamic: c.yellow,
      api: c.blue,
    };
    const color = typeColors[type] || c.white;
    console.log(`   ${c.dim}├─${c.reset} ${path} ${color}[${type}]${c.reset}`);
  },

  // Divider
  divider() {
    console.log(`${c.dim}   ─────────────────────────────────────────${c.reset}`);
  },

  // Blank line
  blank() {
    console.log('');
  },

  // Port in use error with solution
  portInUse(port) {
    console.log(`
${c.red}   ✗ Port ${port} is already in use${c.reset}

   ${c.dim}Try one of these solutions:${c.reset}
   
   ${c.yellow}1.${c.reset} Kill the process using the port:
      ${c.cyan}npx kill-port ${port}${c.reset}
   
   ${c.yellow}2.${c.reset} Use a different port in ${c.cyan}flexireact.config.js${c.reset}:
      ${c.dim}server: { port: 3001 }${c.reset}
   
   ${c.yellow}3.${c.reset} Set PORT environment variable:
      ${c.cyan}PORT=3001 npm run dev${c.reset}
`);
  },

  // Build info
  build(stats) {
    console.log(`
   ${c.green}✓${c.reset} Build complete!
   
   ${c.dim}├─${c.reset} Pages:    ${c.cyan}${stats.pages}${c.reset}
   ${c.dim}├─${c.reset} API:      ${c.cyan}${stats.api}${c.reset}
   ${c.dim}├─${c.reset} Assets:   ${c.cyan}${stats.assets}${c.reset}
   ${c.dim}└─${c.reset} Time:     ${c.green}${stats.time}ms${c.reset}
`);
  },
};

export default logger;
