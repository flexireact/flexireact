/**
 * FlexiReact Universal Edge Handler
 * 
 * Single handler that works on all platforms:
 * - Node.js (http.createServer)
 * - Bun (Bun.serve)
 * - Deno (Deno.serve)
 * - Cloudflare Workers (fetch handler)
 * - Vercel Edge (edge function)
 */

import { FlexiRequest, FlexiResponse } from './fetch-polyfill.js';
import runtime, { detectRuntime } from './runtime.js';
import { cache, CacheOptions } from './cache.js';

// Handler context
export interface EdgeContext {
  runtime: typeof runtime;
  cache: typeof cache;
  env: Record<string, string | undefined>;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException?: () => void;
}

// Route handler type
export type EdgeHandler = (
  request: FlexiRequest,
  context: EdgeContext
) => Promise<FlexiResponse> | FlexiResponse;

// Middleware type
export type EdgeMiddleware = (
  request: FlexiRequest,
  context: EdgeContext,
  next: () => Promise<FlexiResponse>
) => Promise<FlexiResponse> | FlexiResponse;

// App configuration
export interface EdgeAppConfig {
  routes?: Map<string, EdgeHandler>;
  middleware?: EdgeMiddleware[];
  notFound?: EdgeHandler;
  onError?: (error: Error, request: FlexiRequest) => FlexiResponse;
  basePath?: string;
}

// Create universal edge app
export function createEdgeApp(config: EdgeAppConfig = {}) {
  const {
    routes = new Map(),
    middleware = [],
    notFound = () => FlexiResponse.notFound(),
    onError = (error) => FlexiResponse.error(error.message),
    basePath = ''
  } = config;

  // Main fetch handler (Web Standard)
  async function handleRequest(
    request: Request,
    env: Record<string, any> = {},
    executionContext?: { waitUntil: (p: Promise<any>) => void; passThroughOnException?: () => void }
  ): Promise<Response> {
    const flexiRequest = new FlexiRequest(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      // @ts-ignore - duplex is needed for streaming
      duplex: 'half'
    });

    const context: EdgeContext = {
      runtime,
      cache,
      env: env as Record<string, string | undefined>,
      waitUntil: executionContext?.waitUntil || (() => {}),
      passThroughOnException: executionContext?.passThroughOnException
    };

    try {
      // Run middleware chain
      const response = await runMiddleware(flexiRequest, context, middleware, async () => {
        // Match route
        const pathname = flexiRequest.pathname.replace(basePath, '') || '/';
        
        // Try exact match first
        let handler = routes.get(pathname);
        
        // Try pattern matching
        if (!handler) {
          for (const [pattern, h] of routes) {
            if (matchRoute(pathname, pattern)) {
              handler = h;
              break;
            }
          }
        }
        
        if (handler) {
          return await handler(flexiRequest, context);
        }
        
        return await notFound(flexiRequest, context);
      });

      return response;
    } catch (error: any) {
      console.error('Edge handler error:', error);
      return onError(error, flexiRequest);
    }
  }

  // Run middleware chain
  async function runMiddleware(
    request: FlexiRequest,
    context: EdgeContext,
    middlewares: EdgeMiddleware[],
    finalHandler: () => Promise<FlexiResponse>
  ): Promise<FlexiResponse> {
    let index = 0;

    async function next(): Promise<FlexiResponse> {
      if (index >= middlewares.length) {
        return finalHandler();
      }
      const mw = middlewares[index++];
      return mw(request, context, next);
    }

    return next();
  }

  // Simple route matching
  function matchRoute(pathname: string, pattern: string): boolean {
    // Exact match
    if (pathname === pattern) return true;
    
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\[\.\.\.(\w+)\]/g, '(?<$1>.+)') // [...slug] -> catch-all
      .replace(/\[(\w+)\]/g, '(?<$1>[^/]+)'); // [id] -> dynamic segment
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  // Return platform-specific exports
  return {
    // Web Standard fetch handler (Cloudflare, Vercel Edge, Deno)
    fetch: handleRequest,
    
    // Cloudflare Workers
    async scheduled(event: any, env: any, ctx: any) {
      // Handle scheduled events
    },
    
    // Add route
    route(path: string, handler: EdgeHandler) {
      routes.set(path, handler);
      return this;
    },
    
    // Add middleware
    use(mw: EdgeMiddleware) {
      middleware.push(mw);
      return this;
    },
    
    // Node.js adapter
    toNodeHandler() {
      return async (req: any, res: any) => {
        const url = `http://${req.headers.host}${req.url}`;
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
          if (typeof value === 'string') headers.set(key, value);
        });

        const body = ['GET', 'HEAD'].includes(req.method) ? undefined : req;
        
        const request = new Request(url, {
          method: req.method,
          headers,
          body,
          // @ts-ignore
          duplex: 'half'
        });

        const response = await handleRequest(request, process.env);
        
        res.writeHead(response.status, Object.fromEntries(response.headers));
        
        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        }
        res.end();
      };
    },
    
    // Bun adapter
    toBunHandler() {
      return {
        fetch: handleRequest,
        port: parseInt(process.env.PORT || '3000', 10)
      };
    },
    
    // Deno adapter
    toDenoHandler() {
      return handleRequest;
    },
    
    // Start server based on runtime
    async listen(port: number = 3000) {
      const rt = detectRuntime();
      
      switch (rt) {
        case 'bun':
          console.log(`🚀 FlexiReact Edge running on Bun at http://localhost:${port}`);
          // @ts-ignore - Bun global
          return Bun.serve({
            port,
            fetch: handleRequest
          });
        
        case 'deno':
          console.log(`🚀 FlexiReact Edge running on Deno at http://localhost:${port}`);
          // @ts-ignore - Deno global
          return Deno.serve({ port }, handleRequest);
        
        case 'node':
        default:
          const http = await import('http');
          const server = http.createServer(this.toNodeHandler());
          server.listen(port, () => {
            console.log(`🚀 FlexiReact Edge running on Node.js at http://localhost:${port}`);
          });
          return server;
      }
    }
  };
}

// Export default app creator
export default createEdgeApp;
