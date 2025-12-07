#!/usr/bin/env node

import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildRoutes, matchRoute } from './router.js';
import { render, renderError } from './render.js';
import { handleApiRoute } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Determine the project root (where the user's app is)
const PROJECT_ROOT = process.cwd();
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

/**
 * Creates and starts the FlexiReact dev server
 */
export function createServer(options = {}) {
  const {
    port = PORT,
    host = HOST,
    pagesDir = PAGES_DIR
  } = options;

  const server = http.createServer(async (req, res) => {
    const startTime = Date.now();
    
    try {
      // Parse URL
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;

      // Log request
      console.log(`${req.method} ${pathname}`);

      // Try to serve static files from public directory
      const publicPath = path.join(PROJECT_ROOT, 'public', pathname);
      if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
        return serveStaticFile(res, publicPath);
      }

      // Build routes (rebuild on each request for hot reload)
      const routes = buildRoutes(pagesDir);

      // Check for API routes first
      const apiRoute = matchRoute(pathname, routes.api);
      if (apiRoute) {
        return await handleApiRoute(req, res, apiRoute);
      }

      // Check for page routes
      const pageRoute = matchRoute(pathname, routes.pages);
      if (pageRoute) {
        return await handlePageRoute(req, res, pageRoute);
      }

      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(renderError(404, 'Page not found'));

    } catch (error) {
      console.error('Server Error:', error);
      
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(renderError(500, process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal Server Error'));
      }
    } finally {
      const duration = Date.now() - startTime;
      console.log(`  └─ ${res.statusCode} (${duration}ms)`);
    }
  });

  server.listen(port, host, () => {
    console.log('');
    console.log('  ⚡ FlexiReact Dev Server');
    console.log('  ─────────────────────────');
    console.log(`  → Local:   http://${host}:${port}`);
    console.log(`  → Pages:   ${pagesDir}`);
    console.log('');
    console.log('  Ready for requests...');
    console.log('');
  });

  return server;
}

/**
 * Handles page route requests with SSR
 */
async function handlePageRoute(req, res, route) {
  try {
    // Import the page component with cache busting for hot reload
    const modulePath = `file://${route.filePath.replace(/\\/g, '/')}?t=${Date.now()}`;
    const pageModule = await import(modulePath);
    
    // Get the component (default export)
    const Component = pageModule.default;
    
    if (!Component) {
      throw new Error(`No default export found in ${route.filePath}`);
    }

    // Get page props if getServerSideProps exists
    let props = { params: route.params };
    
    if (pageModule.getServerSideProps) {
      const context = {
        params: route.params,
        req,
        res,
        query: Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams)
      };
      
      const result = await pageModule.getServerSideProps(context);
      
      if (result.redirect) {
        res.writeHead(result.redirect.statusCode || 302, {
          Location: result.redirect.destination
        });
        res.end();
        return;
      }
      
      if (result.notFound) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(renderError(404, 'Page not found'));
        return;
      }
      
      props = { ...props, ...result.props };
    }

    // Get page title if defined
    const title = pageModule.title || 'FlexiReact App';

    // Render the page
    const html = render(Component, props, { title });
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

  } catch (error) {
    console.error('Page Render Error:', error);
    throw error;
  }
}

/**
 * Serves static files
 */
function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

// Auto-start server when run directly
const scriptPath = process.argv[1];

// Check if running directly (handles symlinks on Windows)
const isDirectRun = scriptPath && scriptPath.endsWith('server.js');

if (isDirectRun) {
  createServer();
}

export default createServer;
