/**
 * FlexiReact Router v2
 * Advanced file-based routing with nested routes, loading, and error boundaries
 */

import fs from 'fs';
import path from 'path';
import { isServerComponent, isClientComponent, isIsland } from '../utils.js';

/**
 * Route types
 */
export const RouteType = {
  PAGE: 'page',
  API: 'api',
  LAYOUT: 'layout',
  LOADING: 'loading',
  ERROR: 'error',
  NOT_FOUND: 'not-found'
};

/**
 * Builds the complete route tree from pages directory
 */
export function buildRouteTree(pagesDir, layoutsDir) {
  const routes = {
    pages: [],
    api: [],
    layouts: new Map(),
    tree: {}
  };

  if (!fs.existsSync(pagesDir)) {
    return routes;
  }

  // Scan pages directory
  scanDirectory(pagesDir, pagesDir, routes);
  
  // Scan layouts directory
  if (fs.existsSync(layoutsDir)) {
    scanLayouts(layoutsDir, routes.layouts);
  }

  // Build route tree for nested routes
  routes.tree = buildTree(routes.pages);

  return routes;
}

/**
 * Scans directory recursively for route files
 */
function scanDirectory(baseDir, currentDir, routes, parentSegments = []) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  
  // First, find special files in current directory
  const specialFiles = {
    layout: null,
    loading: null,
    error: null,
    notFound: null
  };

  for (const entry of entries) {
    if (entry.isFile()) {
      const name = entry.name.replace(/\.(jsx|js|tsx|ts)$/, '');
      const fullPath = path.join(currentDir, entry.name);
      
      if (name === 'layout') specialFiles.layout = fullPath;
      if (name === 'loading') specialFiles.loading = fullPath;
      if (name === 'error') specialFiles.error = fullPath;
      if (name === 'not-found' || name === '404') specialFiles.notFound = fullPath;
    }
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // Handle route groups (parentheses)
      const isGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
      const newSegments = isGroup ? parentSegments : [...parentSegments, entry.name];
      
      scanDirectory(baseDir, fullPath, routes, newSegments);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      
      // Skip special files (already processed)
      if (['layout', 'loading', 'error', 'not-found', '404'].includes(baseName)) {
        continue;
      }
      
      if (['.jsx', '.js', '.tsx', '.ts'].includes(ext)) {
        const isApi = relativePath.startsWith('api' + path.sep) || relativePath.startsWith('api/');
        
        if (isApi && ['.js', '.ts'].includes(ext)) {
          routes.api.push(createRoute(fullPath, baseDir, specialFiles, RouteType.API));
        } else if (!isApi && ['.jsx', '.tsx'].includes(ext)) {
          routes.pages.push(createRoute(fullPath, baseDir, specialFiles, RouteType.PAGE));
        }
      }
    }
  }
}

/**
 * Creates a route object from file path
 */
function createRoute(filePath, baseDir, specialFiles, type) {
  const relativePath = path.relative(baseDir, filePath);
  const routePath = filePathToRoute(relativePath);
  
  return {
    type,
    path: routePath,
    filePath,
    pattern: createRoutePattern(routePath),
    segments: routePath.split('/').filter(Boolean),
    layout: specialFiles.layout,
    loading: specialFiles.loading,
    error: specialFiles.error,
    notFound: specialFiles.notFound,
    isServerComponent: isServerComponent(filePath),
    isClientComponent: isClientComponent(filePath),
    isIsland: isIsland(filePath)
  };
}

/**
 * Scans layouts directory
 */
function scanLayouts(layoutsDir, layoutsMap) {
  const entries = fs.readdirSync(layoutsDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile() && /\.(jsx|tsx)$/.test(entry.name)) {
      const name = entry.name.replace(/\.(jsx|tsx)$/, '');
      layoutsMap.set(name, path.join(layoutsDir, entry.name));
    }
  }
}

/**
 * Converts file path to route path
 */
function filePathToRoute(filePath) {
  let route = filePath.replace(/\\/g, '/');
  
  // Remove extension
  route = route.replace(/\.(jsx|js|tsx|ts)$/, '');
  
  // Convert [param] to :param
  route = route.replace(/\[\.\.\.([^\]]+)\]/g, '*$1'); // Catch-all [...slug]
  route = route.replace(/\[([^\]]+)\]/g, ':$1');
  
  // Handle index files
  if (route.endsWith('/index')) {
    route = route.slice(0, -6) || '/';
  } else if (route === 'index') {
    route = '/';
  }
  
  // Handle route groups - remove (groupName) from path
  route = route.replace(/\/?\([^)]+\)\/?/g, '/');
  
  // Ensure leading slash and clean up
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  route = route.replace(/\/+/g, '/');
  
  return route;
}

/**
 * Creates regex pattern for route matching
 */
function createRoutePattern(routePath) {
  let pattern = routePath
    .replace(/\*[^/]*/g, '(.*)') // Catch-all
    .replace(/:[^/]+/g, '([^/]+)') // Dynamic segments
    .replace(/\//g, '\\/');
  
  return new RegExp(`^${pattern}$`);
}

/**
 * Builds a tree structure for nested routes
 */
function buildTree(routes) {
  const tree = { children: {}, routes: [] };
  
  for (const route of routes) {
    let current = tree;
    
    for (const segment of route.segments) {
      if (!current.children[segment]) {
        current.children[segment] = { children: {}, routes: [] };
      }
      current = current.children[segment];
    }
    
    current.routes.push(route);
  }
  
  return tree;
}

/**
 * Matches URL path against routes
 */
export function matchRoute(urlPath, routes) {
  const normalizedPath = urlPath === '' ? '/' : urlPath.split('?')[0];
  
  for (const route of routes) {
    const match = normalizedPath.match(route.pattern);
    
    if (match) {
      const params = extractParams(route.path, match);
      return { ...route, params };
    }
  }
  
  return null;
}

/**
 * Extracts parameters from route match
 */
function extractParams(routePath, match) {
  const params = {};
  const paramNames = [];
  
  // Extract param names from route path
  const paramRegex = /:([^/]+)|\*([^/]*)/g;
  let paramMatch;
  
  while ((paramMatch = paramRegex.exec(routePath)) !== null) {
    paramNames.push(paramMatch[1] || paramMatch[2] || 'splat');
  }
  
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });
  
  return params;
}

/**
 * Finds all layouts that apply to a route
 */
export function findRouteLayouts(route, layoutsMap) {
  const layouts = [];
  
  // Check for segment-based layouts
  let currentPath = '';
  for (const segment of route.segments) {
    currentPath += '/' + segment;
    const layoutName = segment;
    
    if (layoutsMap.has(layoutName)) {
      layouts.push({
        name: layoutName,
        filePath: layoutsMap.get(layoutName)
      });
    }
  }
  
  // Check for route-specific layout
  if (route.layout) {
    layouts.push({
      name: 'route',
      filePath: route.layout
    });
  }
  
  // Check for root layout
  if (layoutsMap.has('root')) {
    layouts.unshift({
      name: 'root',
      filePath: layoutsMap.get('root')
    });
  }
  
  return layouts;
}

export default {
  buildRouteTree,
  matchRoute,
  findRouteLayouts,
  RouteType
};
