/**
 * FlexiReact Render System v2
 * SSR with layouts, loading states, error boundaries, and islands
 */

import React from 'react';
import { renderToString, renderToPipeableStream } from 'react-dom/server';
import { escapeHtml } from '../utils.js';

/**
 * Renders a page with all its layouts and wrappers
 */
export async function renderPage(options) {
  const {
    Component,
    props = {},
    layouts = [],
    loading = null,
    error = null,
    islands = [],
    title = 'FlexiReact App',
    meta = {},
    scripts = [],
    styles = [],
    favicon = null,
    isSSG = false,
    route = '/',
    needsHydration = false
  } = options;

  const renderStart = Date.now();

  try {
    // Build the component tree - start with the page component
    let element = React.createElement(Component, props);
    
    // Wrap with layouts (innermost to outermost)
    // Each layout receives children as a prop
    for (const layout of [...layouts].reverse()) {
      if (layout.Component) {
        const LayoutComponent = layout.Component;
        element = React.createElement(LayoutComponent, {
          ...layout.props
        }, element);
      }
    }

    // Render to string
    const content = renderToString(element);
    
    // Calculate render time
    const renderTime = Date.now() - renderStart;
    
    // Generate island hydration scripts
    const islandScripts = generateIslandScripts(islands);
    
    // Build full HTML document
    return buildHtmlDocument({
      content,
      title,
      meta,
      scripts: [...scripts, ...islandScripts],
      styles,
      favicon,
      props,
      isSSG,
      renderTime,
      route,
      isClientComponent: needsHydration
    });

  } catch (err) {
    console.error('Render Error:', err);
    throw err;
  }
}

/**
 * Error Boundary Wrapper for SSR
 */
class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return React.createElement(FallbackComponent, { error: this.state.error });
    }
    return this.props.children;
  }
}

/**
 * Generates hydration scripts for islands
 */
function generateIslandScripts(islands) {
  if (!islands.length) return [];
  
  const scripts = [];
  
  for (const island of islands) {
    scripts.push({
      type: 'module',
      content: `
        import { hydrateIsland } from '/_flexi/client.js';
        import ${island.name} from '${island.clientPath}';
        hydrateIsland('${island.id}', ${island.name}, ${JSON.stringify(island.props)});
      `
    });
  }
  
  return scripts;
}

/**
 * Generates the Dev Toolbar HTML (Premium Next.js/Vercel style)
 */
function generateDevToolbar(options = {}) {
  const { 
    renderTime = 0, 
    pageType = 'SSR', 
    route = '/',
    hasError = false,
    isHydrated = false
  } = options;

  return `
<!-- FlexiReact Dev Toolbar -->
<div id="flexi-dev-toolbar">
  <style>
    #flexi-dev-toolbar {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 99999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
    }
    .flexi-dev-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
      backdrop-filter: blur(12px);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1);
    }
    .flexi-dev-btn:hover {
      border-color: rgba(16, 185, 129, 0.6);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2);
    }
    .flexi-dev-logo {
      width: 22px;
      height: 22px;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 12px;
      color: #000;
    }
    .flexi-dev-panel {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin-bottom: 12px;
      min-width: 320px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
      backdrop-filter: blur(16px);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 16px;
      padding: 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(16, 185, 129, 0.1);
      overflow: hidden;
    }
    .flexi-dev-btn:hover + .flexi-dev-panel,
    .flexi-dev-panel:hover {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .flexi-dev-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1));
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .flexi-dev-header-logo {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: #000;
    }
    .flexi-dev-header-text {
      font-weight: 700;
      font-size: 15px;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .flexi-dev-header-version {
      margin-left: auto;
      font-size: 11px;
      color: #64748b;
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 8px;
      border-radius: 6px;
    }
    .flexi-dev-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    .flexi-dev-row:last-child {
      border-bottom: none;
    }
    .flexi-dev-label {
      color: #64748b;
      font-size: 12px;
    }
    .flexi-dev-value {
      font-weight: 600;
      color: #f1f5f9;
    }
    .flexi-dev-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .flexi-dev-badge.ssr {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1));
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .flexi-dev-badge.ssg {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1));
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .flexi-dev-badge.isr {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1));
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .flexi-dev-badge.csr {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 165, 233, 0.1));
      color: #06b6d4;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    .flexi-dev-badge.api {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1));
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .flexi-dev-time {
      font-weight: 700;
      color: ${renderTime < 100 ? '#10b981' : renderTime < 500 ? '#fbbf24' : '#ef4444'};
    }
    .flexi-dev-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .flexi-dev-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      animation: pulse 2s infinite;
    }
    .flexi-dev-dot.error {
      background: linear-gradient(135deg, #ef4444, #f87171);
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.9); }
    }
    .flexi-dev-links {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      background: rgba(0, 0, 0, 0.2);
    }
    .flexi-dev-link {
      flex: 1;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      transition: all 0.2s;
    }
    .flexi-dev-link:hover {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
      color: #10b981;
    }
  </style>
  
  <button class="flexi-dev-btn" title="FlexiReact Dev Tools">
    <div class="flexi-dev-logo">⚡</div>
    <span class="flexi-dev-badge ${pageType.toLowerCase()}">${pageType}</span>
  </button>
  
  <div class="flexi-dev-panel">
    <div class="flexi-dev-header">
      <div class="flexi-dev-header-logo">⚡</div>
      <span class="flexi-dev-header-text">FlexiReact</span>
      <span class="flexi-dev-header-version">v1.0.0</span>
    </div>
    
    <div class="flexi-dev-row">
      <span class="flexi-dev-label">Status</span>
      <div class="flexi-dev-status">
        <div class="flexi-dev-dot ${hasError ? 'error' : ''}"></div>
        <span class="flexi-dev-value">${hasError ? 'Error' : 'Ready'}</span>
      </div>
    </div>
    
    <div class="flexi-dev-row">
      <span class="flexi-dev-label">Route</span>
      <span class="flexi-dev-value">${route}</span>
    </div>
    
    <div class="flexi-dev-row">
      <span class="flexi-dev-label">Page Type</span>
      <span class="flexi-dev-badge ${pageType.toLowerCase()}">${pageType}</span>
    </div>
    
    <div class="flexi-dev-row">
      <span class="flexi-dev-label">Render Time</span>
      <span class="flexi-dev-value flexi-dev-time">${renderTime}ms</span>
    </div>
    
    <div class="flexi-dev-row">
      <span class="flexi-dev-label">Hydration</span>
      <span class="flexi-dev-value">${isHydrated ? '✓ Client' : '○ Server'}</span>
    </div>
    
    <div class="flexi-dev-links">
      <a href="/_flexi/routes" class="flexi-dev-link">Routes</a>
      <a href="/api" class="flexi-dev-link">API</a>
      <a href="https://github.com/nicholasmusic/flexireact" target="_blank" class="flexi-dev-link">Docs ↗</a>
    </div>
  </div>
</div>

<script>
  // Track hydration
  window.__FLEXI_DEV__ = {
    renderTime: ${renderTime},
    pageType: '${pageType}',
    route: '${route}',
    hydrated: false
  };
  
  // Update hydration status when React hydrates
  const observer = new MutationObserver(() => {
    if (document.getElementById('root')?.children.length > 0) {
      window.__FLEXI_DEV__.hydrated = true;
      const hydrationEl = document.querySelector('.flexi-dev-row:nth-child(5) .flexi-dev-value');
      if (hydrationEl) hydrationEl.textContent = '✓ Client';
    }
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  
  // Log to console
  console.log('%c⚛ FlexiReact Dev', 'color: #61DAFB; font-weight: bold; font-size: 14px;');
  console.log('%cPage: ' + '${route}' + ' [${pageType}] - ${renderTime}ms', 'color: #94a3b8;');
</script>
`;
}

/**
 * Builds complete HTML document
 */
function buildHtmlDocument(options) {
  const {
    content,
    title,
    meta = {},
    scripts = [],
    styles = [],
    props = {},
    isSSG = false,
    renderTime = 0,
    route = '/',
    isClientComponent = false,
    favicon = null
  } = options;

  const metaTags = Object.entries(meta)
    .map(([name, content]) => {
      if (name.startsWith('og:')) {
        return `<meta property="${escapeHtml(name)}" content="${escapeHtml(content)}">`;
      }
      return `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}">`;
    })
    .join('\n    ');

  const styleTags = styles
    .map(style => {
      if (typeof style === 'string') {
        return `<link rel="stylesheet" href="${escapeHtml(style)}">`;
      }
      return `<style>${style.content}</style>`;
    })
    .join('\n    ');

  const scriptTags = scripts
    .map(script => {
      if (typeof script === 'string') {
        return `<script src="${escapeHtml(script)}"></script>`;
      }
      const type = script.type ? ` type="${script.type}"` : '';
      if (script.src) {
        return `<script${type} src="${escapeHtml(script.src)}"></script>`;
      }
      return `<script${type}>${script.content}</script>`;
    })
    .join('\n    ');

  // FlexiReact SVG favicon (properly encoded)
  const faviconSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#00FF9C"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#000" font-family="system-ui" font-weight="bold" font-size="16">F</text></svg>`);

  // Generate Dev Toolbar for development mode
  const isDev = process.env.NODE_ENV !== 'production';
  const pageType = isSSG ? 'SSG' : isClientComponent ? 'CSR' : 'SSR';
  const devToolbar = isDev ? generateDevToolbar({ 
    renderTime, 
    pageType, 
    route,
    isHydrated: isClientComponent
  }) : '';

  // Determine favicon link
  const faviconLink = favicon 
    ? `<link rel="icon" href="${escapeHtml(favicon)}">`
    : `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${faviconSvg}">`;

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    ${faviconLink}
    ${metaTags}
    ${styleTags}
    <script>
      (function() {
        var theme = localStorage.getItem('theme');
        if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      })();
    </script>
</head>
<body>
    <div id="root">${content}</div>
    <script>
      window.__FLEXI_DATA__ = ${JSON.stringify({ props, isSSG })};
    </script>
    ${scriptTags}
    ${devToolbar}
</body>
</html>`;
}

/**
 * Renders an error page with beautiful styling
 */
export function renderError(statusCode, message, stack = null) {
  const showStack = process.env.NODE_ENV !== 'production' && stack;
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Different messages for different status codes
  const errorMessages = {
    404: { title: 'Page Not Found', emoji: '🔍', desc: 'The page you\'re looking for doesn\'t exist or has been moved.' },
    500: { title: 'Server Error', emoji: '💥', desc: 'Something went wrong on our end. Please try again later.' },
    403: { title: 'Forbidden', emoji: '🚫', desc: 'You don\'t have permission to access this resource.' },
    401: { title: 'Unauthorized', emoji: '🔐', desc: 'Please log in to access this page.' },
  };
  
  const errorInfo = errorMessages[statusCode] || { title: 'Error', emoji: '⚠️', desc: message };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${statusCode} - ${errorInfo.title} | FlexiReact</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%2361DAFB'/><stop offset='100%25' stop-color='%2321A1F1'/></linearGradient></defs><circle cx='100' cy='100' r='12' fill='url(%23g)'/><ellipse cx='100' cy='100' rx='80' ry='30' fill='none' stroke='url(%23g)' stroke-width='6' transform='rotate(-30 100 100)'/><ellipse cx='100' cy='100' rx='80' ry='30' fill='none' stroke='url(%23g)' stroke-width='6' transform='rotate(30 100 100)'/><ellipse cx='100' cy='100' rx='80' ry='30' fill='none' stroke='url(%23g)' stroke-width='6' transform='rotate(90 100 100)'/></svg>">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
        color: #f8fafc;
        overflow: hidden;
      }
      .bg-grid {
        position: fixed;
        inset: 0;
        background-image: 
          linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
      }
      .bg-glow {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
        pointer-events: none;
      }
      .container {
        position: relative;
        text-align: center;
        padding: 2rem;
        max-width: 600px;
        animation: fadeIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 2rem;
        opacity: 0.8;
      }
      .emoji {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      .error-code {
        font-size: 8rem;
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #6366f1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 80px rgba(99, 102, 241, 0.5);
      }
      .error-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1rem 0 0.5rem;
        color: #e2e8f0;
      }
      .error-desc {
        font-size: 1rem;
        color: #94a3b8;
        margin-bottom: 2rem;
        line-height: 1.6;
      }
      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.75rem;
        border-radius: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
        font-size: 0.95rem;
      }
      .btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
      }
      .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .stack {
        text-align: left;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 1rem;
        border-radius: 12px;
        font-family: 'SF Mono', Monaco, 'Courier New', monospace;
        font-size: 0.8rem;
        overflow-x: auto;
        white-space: pre-wrap;
        margin-top: 2rem;
        color: #fca5a5;
        max-height: 200px;
        overflow-y: auto;
      }
      .dev-badge {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .dev-badge svg {
        width: 16px;
        height: 16px;
      }
    </style>
</head>
<body>
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>
    
    <div class="container">
      <svg class="logo" viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="12" fill="url(#g)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" stroke-width="6" transform="rotate(-30 100 100)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" stroke-width="6" transform="rotate(30 100 100)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#g)" stroke-width="6" transform="rotate(90 100 100)"/>
      </svg>
      
      <div class="error-code">${statusCode}</div>
      <h1 class="error-title">${errorInfo.title}</h1>
      <p class="error-desc">${errorInfo.desc}</p>
      
      <div class="buttons">
        <a href="/" class="btn btn-primary">
          <span>←</span> Back to Home
        </a>
        <a href="javascript:history.back()" class="btn btn-secondary">
          Go Back
        </a>
      </div>
      
      ${showStack ? `<pre class="stack">${escapeHtml(stack)}</pre>` : ''}
    </div>
    
    ${isDev ? `
    <div class="dev-badge">
      <svg viewBox="0 0 200 200" fill="none">
        <defs><linearGradient id="db" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#61DAFB"/><stop offset="100%" stop-color="#21A1F1"/></linearGradient></defs>
        <circle cx="100" cy="100" r="12" fill="url(#db)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#db)" stroke-width="6" transform="rotate(-30 100 100)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#db)" stroke-width="6" transform="rotate(30 100 100)"/>
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#db)" stroke-width="6" transform="rotate(90 100 100)"/>
      </svg>
      FlexiReact Dev
    </div>
    ` : ''}
</body>
</html>`;
}

/**
 * Renders a loading state
 */
export function renderLoading(LoadingComponent) {
  if (!LoadingComponent) {
    return `<div class="flexi-loading">
      <div class="flexi-spinner"></div>
      <style>
        .flexi-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        .flexi-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>`;
  }
  
  return renderToString(React.createElement(LoadingComponent));
}

export default {
  renderPage,
  renderError,
  renderLoading
};
