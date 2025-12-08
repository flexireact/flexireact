/**
 * FlexiReact v2 - Main Entry Point
 * A modern React framework with RSC, SSG, Islands, and more
 */

// Core exports
export { loadConfig, defaultConfig, resolvePaths } from './config.js';
export { createRequestContext, useRequest, useParams, useQuery, usePathname } from './context.js';
export * from './utils.js';

// Router
export { buildRouteTree, matchRoute, findRouteLayouts, RouteType } from './router/index.js';

// Render
export { renderPage, renderError, renderLoading } from './render/index.js';

// Server
import { createServer } from './server/index.js';
export { createServer };

// Build
export { build, buildDev, BuildMode } from './build/index.js';

// SSG
export { generateStaticSite, SSGResult, ISRManager } from './ssg/index.js';

// RSC
export { 
  processServerComponent, 
  createClientReference, 
  serializeRSCPayload,
  createServerAction,
  handleServerAction,
  ServerBoundary,
  ClientBoundary,
  RSC_CONTENT_TYPE 
} from './rsc/index.js';

// Islands
export { 
  Island, 
  createIsland, 
  createLazyIsland,
  getRegisteredIslands,
  generateHydrationScript,
  generateAdvancedHydrationScript,
  LoadStrategy 
} from './islands/index.js';

// Middleware
export { 
  MiddlewareRequest, 
  MiddlewareResponse, 
  loadMiddleware, 
  runMiddleware,
  composeMiddleware,
  middlewares 
} from './middleware/index.js';

// Plugins
export { 
  PluginManager, 
  PluginHooks, 
  pluginManager, 
  loadPlugins, 
  definePlugin,
  builtinPlugins 
} from './plugins/index.js';

// Version
export const VERSION = '2.0.0';

// Default export
export default {
  VERSION,
  createServer
};
