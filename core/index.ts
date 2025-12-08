/**
 * FlexiReact v2 - Main Entry Point
 * A modern React framework with RSC, SSG, Islands, and more
 */

// Types
export type { FlexiConfig, Route, RouteType as RouteTypeEnum, PageProps, LayoutProps } from './types.js';

// Core exports
export { loadConfig, defaultConfig, resolvePaths } from './config.js';
export { createRequestContext, useRequest, useParams, useQuery, usePathname } from './context.js';
export * from './utils.js';

// Router
export { buildRouteTree, matchRoute, findRouteLayouts, RouteType } from './router/index.js';

// Render
export { renderPage, renderPageStream, streamToResponse, renderError, renderLoading } from './render/index.js';

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

// Font Optimization
export {
  createFont,
  googleFont,
  localFont,
  generateFontCSS,
  generateFontPreloadTags,
  handleFontRequest,
  fonts,
  googleFonts
} from './font/index.js';
export type { FontConfig, FontResult } from './font/index.js';

// Metadata API
export {
  generateMetadataTags,
  mergeMetadata,
  generateJsonLd,
  jsonLd
} from './metadata/index.js';
export type { 
  Metadata, 
  OpenGraph, 
  Twitter, 
  Icons, 
  Robots, 
  Viewport,
  Author
} from './metadata/index.js';

// Image Optimization
export {
  Image,
  createImageComponent,
  handleImageOptimization,
  generateBlurPlaceholder,
  getImageDimensions,
  generateSrcSet,
  imageLoaders,
  defaultImageConfig
} from './image/index.js';
export type { ImageProps, ImageConfig, ImageLoader } from './image/index.js';

// Server Actions
export {
  serverAction,
  registerAction,
  getAction,
  executeAction,
  callServerAction,
  formAction,
  createFormState,
  bindArgs,
  useActionContext
} from './actions/index.js';
export type { ActionContext, ActionResult, ServerActionFunction } from './actions/index.js';

// Server Helpers
export {
  // Response helpers
  redirect,
  notFound,
  json,
  html,
  text,
  // Error classes
  RedirectError,
  NotFoundError,
  // Cookies API
  cookies,
  // Headers API
  headers,
  // Request helpers
  parseJson,
  parseFormData,
  parseSearchParams,
  getMethod,
  getPathname,
  isMethod
} from './helpers.js';
export type { CookieOptions } from './helpers.js';

// Version
export const VERSION = '2.3.0';

// Default export
export default {
  VERSION,
  createServer
};
