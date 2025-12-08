/**
 * FlexiReact Edge Runtime
 * 
 * Universal edge runtime that works everywhere:
 * - Node.js
 * - Bun
 * - Deno
 * - Cloudflare Workers
 * - Vercel Edge
 * - Netlify Edge
 */

// Runtime detection and capabilities
export {
  detectRuntime,
  getRuntimeCapabilities,
  runtime as edgeRuntimeInfo,
  type RuntimeEnvironment,
  type RuntimeCapabilities
} from './runtime.js';

// Fetch polyfill with helpers
export {
  FlexiRequest,
  FlexiResponse,
  FlexiHeaders,
  Request,
  Response,
  Headers,
  NativeRequest,
  NativeResponse,
  NativeHeaders
} from './fetch-polyfill.js';

// Universal handler
export {
  createEdgeApp,
  type EdgeContext,
  type EdgeHandler,
  type EdgeMiddleware,
  type EdgeAppConfig
} from './handler.js';

// Smart caching
export {
  cache as smartCache,
  initCache,
  cacheFunction,
  unstable_cache,
  revalidateTag,
  revalidatePath,
  getRequestCache,
  reactCache,
  type CacheEntry,
  type CacheOptions,
  type CacheStorage
} from './cache.js';

// Partial Prerendering
export {
  dynamic,
  staticComponent,
  PPRBoundary,
  PPRShell,
  prerenderWithPPR,
  streamPPR,
  pprFetch,
  PPRLoading,
  getPPRStyles,
  experimental_ppr,
  type PPRConfig,
  type PPRRenderResult,
  type PPRPageConfig,
  type GenerateStaticParams
} from './ppr.js';

// Default export
export { default as edgeRuntime } from './runtime.js';
export { default as edgeCache } from './cache.js';
export { default as edgePPR } from './ppr.js';
export { default as createApp } from './handler.js';
