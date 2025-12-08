/**
 * FlexiReact Universal Edge Runtime
 * 
 * Works on:
 * - Node.js
 * - Bun
 * - Deno
 * - Cloudflare Workers
 * - Vercel Edge
 * - Any Web-standard runtime
 */

// Detect runtime environment
export type RuntimeEnvironment = 
  | 'node'
  | 'bun'
  | 'deno'
  | 'cloudflare'
  | 'vercel-edge'
  | 'netlify-edge'
  | 'fastly'
  | 'unknown';

export function detectRuntime(): RuntimeEnvironment {
  // Bun
  if (typeof globalThis.Bun !== 'undefined') {
    return 'bun';
  }
  
  // Deno
  if (typeof globalThis.Deno !== 'undefined') {
    return 'deno';
  }
  
  // Cloudflare Workers
  if (typeof globalThis.caches !== 'undefined' && typeof (globalThis as any).WebSocketPair !== 'undefined') {
    return 'cloudflare';
  }
  
  // Vercel Edge
  if (typeof process !== 'undefined' && process.env?.VERCEL_EDGE === '1') {
    return 'vercel-edge';
  }
  
  // Netlify Edge
  if (typeof globalThis.Netlify !== 'undefined') {
    return 'netlify-edge';
  }
  
  // Node.js
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node';
  }
  
  return 'unknown';
}

// Runtime capabilities
export interface RuntimeCapabilities {
  hasFileSystem: boolean;
  hasWebCrypto: boolean;
  hasWebStreams: boolean;
  hasFetch: boolean;
  hasWebSocket: boolean;
  hasKV: boolean;
  hasCache: boolean;
  maxExecutionTime: number; // ms, 0 = unlimited
  maxMemory: number; // bytes, 0 = unlimited
}

export function getRuntimeCapabilities(): RuntimeCapabilities {
  const runtime = detectRuntime();
  
  switch (runtime) {
    case 'cloudflare':
      return {
        hasFileSystem: false,
        hasWebCrypto: true,
        hasWebStreams: true,
        hasFetch: true,
        hasWebSocket: true,
        hasKV: true,
        hasCache: true,
        maxExecutionTime: 30000, // 30s for paid, 10ms for free
        maxMemory: 128 * 1024 * 1024 // 128MB
      };
    
    case 'vercel-edge':
      return {
        hasFileSystem: false,
        hasWebCrypto: true,
        hasWebStreams: true,
        hasFetch: true,
        hasWebSocket: false,
        hasKV: true, // Vercel KV
        hasCache: true,
        maxExecutionTime: 30000,
        maxMemory: 128 * 1024 * 1024
      };
    
    case 'deno':
      return {
        hasFileSystem: true,
        hasWebCrypto: true,
        hasWebStreams: true,
        hasFetch: true,
        hasWebSocket: true,
        hasKV: true, // Deno KV
        hasCache: true,
        maxExecutionTime: 0,
        maxMemory: 0
      };
    
    case 'bun':
      return {
        hasFileSystem: true,
        hasWebCrypto: true,
        hasWebStreams: true,
        hasFetch: true,
        hasWebSocket: true,
        hasKV: false,
        hasCache: false,
        maxExecutionTime: 0,
        maxMemory: 0
      };
    
    case 'node':
    default:
      return {
        hasFileSystem: true,
        hasWebCrypto: true,
        hasWebStreams: true,
        hasFetch: true,
        hasWebSocket: true,
        hasKV: false,
        hasCache: false,
        maxExecutionTime: 0,
        maxMemory: 0
      };
  }
}

// Runtime info
export const runtime = {
  name: detectRuntime(),
  capabilities: getRuntimeCapabilities(),
  
  get isEdge(): boolean {
    return ['cloudflare', 'vercel-edge', 'netlify-edge', 'fastly'].includes(this.name);
  },
  
  get isServer(): boolean {
    return ['node', 'bun', 'deno'].includes(this.name);
  },
  
  get supportsStreaming(): boolean {
    return this.capabilities.hasWebStreams;
  }
};

export default runtime;
