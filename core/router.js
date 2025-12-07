import fs from 'fs';
import path from 'path';

/**
 * Scans the pages directory and builds a route map
 * @param {string} pagesDir - Path to the pages directory
 * @returns {Object} Route map with paths and file locations
 */
export function buildRoutes(pagesDir) {
  const routes = {
    pages: [],
    api: []
  };

  if (!fs.existsSync(pagesDir)) {
    return routes;
  }

  scanDirectory(pagesDir, pagesDir, routes);
  return routes;
}

/**
 * Recursively scans a directory for route files
 */
function scanDirectory(baseDir, currentDir, routes) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      scanDirectory(baseDir, fullPath, routes);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      
      if (ext === '.jsx' || ext === '.js') {
        const routePath = filePathToRoute(relativePath);
        const isApi = relativePath.startsWith('api' + path.sep) || relativePath.startsWith('api/');

        if (isApi && ext === '.js') {
          routes.api.push({
            path: routePath,
            filePath: fullPath,
            pattern: createRoutePattern(routePath)
          });
        } else if (!isApi && ext === '.jsx') {
          routes.pages.push({
            path: routePath,
            filePath: fullPath,
            pattern: createRoutePattern(routePath)
          });
        }
      }
    }
  }
}

/**
 * Converts a file path to a route path
 * pages/index.jsx -> /
 * pages/about.jsx -> /about
 * pages/blog/[id].jsx -> /blog/:id
 * pages/api/hello.js -> /api/hello
 */
function filePathToRoute(filePath) {
  // Normalize path separators
  let route = filePath.replace(/\\/g, '/');
  
  // Remove extension
  route = route.replace(/\.(jsx|js)$/, '');
  
  // Convert [param] to :param
  route = route.replace(/\[([^\]]+)\]/g, ':$1');
  
  // Handle index files
  if (route.endsWith('/index')) {
    route = route.slice(0, -6) || '/';
  } else if (route === 'index') {
    route = '/';
  }
  
  // Ensure leading slash
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  
  return route;
}

/**
 * Creates a regex pattern for route matching
 */
function createRoutePattern(routePath) {
  const pattern = routePath
    .replace(/:[^/]+/g, '([^/]+)')
    .replace(/\//g, '\\/');
  
  return new RegExp(`^${pattern}$`);
}

/**
 * Matches a URL path against the route map
 * @param {string} urlPath - The URL path to match
 * @param {Array} routes - Array of route objects
 * @returns {Object|null} Matched route with params or null
 */
export function matchRoute(urlPath, routes) {
  // Normalize the URL path
  const normalizedPath = urlPath === '' ? '/' : urlPath;
  
  for (const route of routes) {
    const match = normalizedPath.match(route.pattern);
    
    if (match) {
      // Extract params from the match
      const params = {};
      const paramNames = (route.path.match(/:[^/]+/g) || []).map(p => p.slice(1));
      
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      
      return {
        ...route,
        params
      };
    }
  }
  
  return null;
}

/**
 * Invalidates the module cache for hot reload
 */
export function invalidateCache(filePath) {
  // For ESM, we use query string cache busting
  return `${filePath}?t=${Date.now()}`;
}
