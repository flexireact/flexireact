/**
 * FlexiReact Partial Prerendering (PPR)
 * 
 * Combines static shell with dynamic content:
 * - Static parts are prerendered at build time
 * - Dynamic parts stream in at request time
 * - Best of both SSG and SSR
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { cache } from './cache.js';

// PPR configuration
export interface PPRConfig {
  // Static shell cache duration
  shellCacheTTL?: number;
  // Dynamic content timeout
  dynamicTimeout?: number;
  // Fallback for dynamic parts
  fallback?: React.ReactNode;
}

// Mark component as dynamic (not prerendered)
export function dynamic<T extends React.ComponentType<any>>(
  Component: T,
  options?: { fallback?: React.ReactNode }
): T {
  (Component as any).__flexi_dynamic = true;
  (Component as any).__flexi_fallback = options?.fallback;
  return Component;
}

// Mark component as static (prerendered)
export function staticComponent<T extends React.ComponentType<any>>(Component: T): T {
  (Component as any).__flexi_static = true;
  return Component;
}

// Suspense boundary for PPR
export interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  id?: string;
}

export function PPRBoundary({ children, fallback, id }: SuspenseBoundaryProps): React.ReactElement {
  return React.createElement(
    React.Suspense,
    { 
      fallback: fallback || React.createElement('div', { 
        'data-ppr-placeholder': id || 'loading',
        className: 'ppr-loading'
      }, '⏳')
    },
    children
  );
}

// PPR Shell - static wrapper
export interface PPRShellProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PPRShell({ children, fallback }: PPRShellProps): React.ReactElement {
  return React.createElement(
    'div',
    { 'data-ppr-shell': 'true' },
    React.createElement(
      React.Suspense,
      { fallback: fallback || null },
      children
    )
  );
}

// Prerender a page with PPR
export interface PPRRenderResult {
  staticShell: string;
  dynamicParts: Map<string, () => Promise<string>>;
  fullHtml: string;
}

export async function prerenderWithPPR(
  Component: React.ComponentType<any>,
  props: any,
  config: PPRConfig = {}
): Promise<PPRRenderResult> {
  const { shellCacheTTL = 3600 } = config;
  
  // Track dynamic parts
  const dynamicParts = new Map<string, () => Promise<string>>();
  let dynamicCounter = 0;
  
  // Create element
  const element = React.createElement(Component, props);
  
  // Render static shell (with placeholders for dynamic parts)
  const staticShell = renderToString(element);
  
  // Cache the static shell
  const cacheKey = `ppr:${Component.name || 'page'}:${JSON.stringify(props)}`;
  await cache.set(cacheKey, staticShell, { ttl: shellCacheTTL, tags: ['ppr'] });
  
  return {
    staticShell,
    dynamicParts,
    fullHtml: staticShell
  };
}

// Stream PPR response
export async function streamPPR(
  staticShell: string,
  dynamicParts: Map<string, () => Promise<string>>,
  options?: { onError?: (error: Error) => string }
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      // Send static shell immediately
      controller.enqueue(encoder.encode(staticShell));
      
      // Stream dynamic parts as they resolve
      const promises = Array.from(dynamicParts.entries()).map(async ([id, render]) => {
        try {
          const html = await render();
          // Send script to replace placeholder
          const script = `<script>
            (function() {
              var placeholder = document.querySelector('[data-ppr-placeholder="${id}"]');
              if (placeholder) {
                var temp = document.createElement('div');
                temp.innerHTML = ${JSON.stringify(html)};
                placeholder.replaceWith(...temp.childNodes);
              }
            })();
          </script>`;
          controller.enqueue(encoder.encode(script));
        } catch (error: any) {
          const errorHtml = options?.onError?.(error) || `<div class="ppr-error">Error loading content</div>`;
          const script = `<script>
            (function() {
              var placeholder = document.querySelector('[data-ppr-placeholder="${id}"]');
              if (placeholder) {
                placeholder.innerHTML = ${JSON.stringify(errorHtml)};
              }
            })();
          </script>`;
          controller.enqueue(encoder.encode(script));
        }
      });
      
      await Promise.all(promises);
      controller.close();
    }
  });
}

// PPR-aware fetch wrapper
export function pprFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { 
    cache?: 'force-cache' | 'no-store' | 'no-cache';
    next?: { revalidate?: number; tags?: string[] };
  }
): Promise<Response> {
  const cacheMode = init?.cache || 'force-cache';
  const revalidate = init?.next?.revalidate;
  const tags = init?.next?.tags || [];
  
  // If no-store, always fetch fresh
  if (cacheMode === 'no-store') {
    return fetch(input, init);
  }
  
  // Create cache key
  const url = typeof input === 'string' ? input : input.toString();
  const cacheKey = `fetch:${url}:${JSON.stringify(init?.body || '')}`;
  
  // Try cache first
  return cache.wrap(
    async () => {
      const response = await fetch(input, init);
      return response;
    },
    {
      key: cacheKey,
      ttl: revalidate || 3600,
      tags
    }
  )();
}

// Export directive markers
export const experimental_ppr = true;

// Page config for PPR
export interface PPRPageConfig {
  experimental_ppr?: boolean;
  revalidate?: number | false;
  dynamic?: 'auto' | 'force-dynamic' | 'force-static' | 'error';
  dynamicParams?: boolean;
  fetchCache?: 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';
}

// Generate static params (for SSG with PPR)
export type GenerateStaticParams<T = any> = () => Promise<T[]> | T[];

// Default PPR loading component
export function PPRLoading(): React.ReactElement {
  return React.createElement('div', {
    className: 'ppr-loading animate-pulse',
    style: {
      background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '4px',
      height: '1em',
      width: '100%'
    }
  });
}

// Inject PPR styles
export function getPPRStyles(): string {
  return `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .ppr-loading {
      background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      min-height: 1em;
    }
    
    .ppr-error {
      color: #ef4444;
      padding: 1rem;
      border: 1px solid #ef4444;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.1);
    }
  `;
}

export default {
  dynamic,
  staticComponent,
  PPRBoundary,
  PPRShell,
  prerenderWithPPR,
  streamPPR,
  pprFetch,
  PPRLoading,
  getPPRStyles,
  experimental_ppr
};
