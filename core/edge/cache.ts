/**
 * FlexiReact Universal Cache System
 * 
 * Smart caching that works on:
 * - Cloudflare Workers (Cache API + KV)
 * - Vercel Edge (Edge Config + KV)
 * - Deno (Deno KV)
 * - Node.js/Bun (In-memory + File cache)
 */

import { detectRuntime } from './runtime.js';

// Cache entry
export interface CacheEntry<T = any> {
  value: T;
  expires: number; // timestamp
  stale?: number; // stale-while-revalidate timestamp
  tags?: string[];
  etag?: string;
}

// Cache options
export interface CacheOptions {
  ttl?: number; // seconds
  staleWhileRevalidate?: number; // seconds
  tags?: string[];
  key?: string;
  revalidate?: number | false; // ISR-style revalidation
}

// Cache storage interface
export interface CacheStorage {
  get<T>(key: string): Promise<CacheEntry<T> | null>;
  set<T>(key: string, entry: CacheEntry<T>): Promise<void>;
  delete(key: string): Promise<void>;
  deleteByTag(tag: string): Promise<void>;
  clear(): Promise<void>;
}

// In-memory cache (fallback)
class MemoryCache implements CacheStorage {
  private store = new Map<string, CacheEntry>();
  private tagIndex = new Map<string, Set<string>>();
  
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (entry.expires && entry.expires < Date.now()) {
      // Check stale-while-revalidate
      if (entry.stale && entry.stale > Date.now()) {
        return { ...entry, value: entry.value as T };
      }
      this.store.delete(key);
      return null;
    }
    
    return { ...entry, value: entry.value as T };
  }
  
  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    this.store.set(key, entry);
    
    // Index by tags
    if (entry.tags) {
      entry.tags.forEach(tag => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      });
    }
  }
  
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
  
  async deleteByTag(tag: string): Promise<void> {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      keys.forEach(key => this.store.delete(key));
      this.tagIndex.delete(tag);
    }
  }
  
  async clear(): Promise<void> {
    this.store.clear();
    this.tagIndex.clear();
  }
}

// Cloudflare KV cache
class CloudflareCache implements CacheStorage {
  private kv: any;
  
  constructor(kv: any) {
    this.kv = kv;
  }
  
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const data = await this.kv.get(key, 'json');
      if (!data) return null;
      
      const entry = data as CacheEntry<T>;
      if (entry.expires && entry.expires < Date.now()) {
        if (entry.stale && entry.stale > Date.now()) {
          return entry;
        }
        await this.kv.delete(key);
        return null;
      }
      
      return entry;
    } catch {
      return null;
    }
  }
  
  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    const ttl = entry.expires ? Math.ceil((entry.expires - Date.now()) / 1000) : undefined;
    await this.kv.put(key, JSON.stringify(entry), { expirationTtl: ttl });
  }
  
  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
  
  async deleteByTag(tag: string): Promise<void> {
    // KV doesn't support tag-based deletion natively
    // Would need to maintain a tag index
    console.warn('Tag-based deletion not fully supported in Cloudflare KV');
  }
  
  async clear(): Promise<void> {
    // KV doesn't support clear
    console.warn('Clear not supported in Cloudflare KV');
  }
}

// Deno KV cache
class DenoKVCache implements CacheStorage {
  private kv: any;
  
  constructor() {
    // @ts-ignore - Deno global
    this.kv = Deno.openKv();
  }
  
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const kv = await this.kv;
      const result = await kv.get(['cache', key]);
      if (!result.value) return null;
      
      const entry = result.value as CacheEntry<T>;
      if (entry.expires && entry.expires < Date.now()) {
        if (entry.stale && entry.stale > Date.now()) {
          return entry;
        }
        await kv.delete(['cache', key]);
        return null;
      }
      
      return entry;
    } catch {
      return null;
    }
  }
  
  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    const kv = await this.kv;
    await kv.set(['cache', key], entry);
  }
  
  async delete(key: string): Promise<void> {
    const kv = await this.kv;
    await kv.delete(['cache', key]);
  }
  
  async deleteByTag(tag: string): Promise<void> {
    // Would need tag index
    console.warn('Tag-based deletion requires tag index in Deno KV');
  }
  
  async clear(): Promise<void> {
    // Would need to iterate all keys
    console.warn('Clear requires iteration in Deno KV');
  }
}

// Create cache based on runtime
function createCacheStorage(options?: { kv?: any }): CacheStorage {
  const runtime = detectRuntime();
  
  switch (runtime) {
    case 'cloudflare':
      if (options?.kv) {
        return new CloudflareCache(options.kv);
      }
      return new MemoryCache();
    
    case 'deno':
      return new DenoKVCache();
    
    case 'node':
    case 'bun':
    default:
      return new MemoryCache();
  }
}

// Main cache instance
let cacheStorage: CacheStorage = new MemoryCache();

// Initialize cache with platform-specific storage
export function initCache(options?: { kv?: any }): void {
  cacheStorage = createCacheStorage(options);
}

// Cache function wrapper (like React cache)
export function cacheFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheOptions = {}
): T {
  const { ttl = 60, staleWhileRevalidate = 0, tags = [] } = options;
  
  return (async (...args: any[]) => {
    const key = options.key || `fn:${fn.name}:${JSON.stringify(args)}`;
    
    // Try cache first
    const cached = await cacheStorage.get(key);
    if (cached) {
      // Check if stale and needs revalidation
      if (cached.expires < Date.now() && cached.stale && cached.stale > Date.now()) {
        // Return stale data, revalidate in background
        queueMicrotask(async () => {
          try {
            const fresh = await fn(...args);
            await cacheStorage.set(key, {
              value: fresh,
              expires: Date.now() + ttl * 1000,
              stale: Date.now() + (ttl + staleWhileRevalidate) * 1000,
              tags
            });
          } catch (e) {
            console.error('Background revalidation failed:', e);
          }
        });
      }
      return cached.value;
    }
    
    // Execute function
    const result = await fn(...args);
    
    // Cache result
    await cacheStorage.set(key, {
      value: result,
      expires: Date.now() + ttl * 1000,
      stale: staleWhileRevalidate ? Date.now() + (ttl + staleWhileRevalidate) * 1000 : undefined,
      tags
    });
    
    return result;
  }) as T;
}

// Unstable cache (Next.js compatible API)
export function unstable_cache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts?: string[],
  options?: { revalidate?: number | false; tags?: string[] }
): T {
  return cacheFunction(fn, {
    key: keyParts?.join(':'),
    ttl: typeof options?.revalidate === 'number' ? options.revalidate : 3600,
    tags: options?.tags
  });
}

// Revalidate by tag
export async function revalidateTag(tag: string): Promise<void> {
  await cacheStorage.deleteByTag(tag);
}

// Revalidate by path
export async function revalidatePath(path: string): Promise<void> {
  await cacheStorage.delete(`page:${path}`);
}

// Cache object for direct access
export const cache = {
  get: <T>(key: string) => cacheStorage.get<T>(key),
  set: <T>(key: string, value: T, options: CacheOptions = {}) => {
    const { ttl = 60, staleWhileRevalidate = 0, tags = [] } = options;
    return cacheStorage.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
      stale: staleWhileRevalidate ? Date.now() + (ttl + staleWhileRevalidate) * 1000 : undefined,
      tags
    });
  },
  delete: (key: string) => cacheStorage.delete(key),
  deleteByTag: (tag: string) => cacheStorage.deleteByTag(tag),
  clear: () => cacheStorage.clear(),
  
  // Wrap function with caching
  wrap: cacheFunction,
  
  // Next.js compatible
  unstable_cache,
  revalidateTag,
  revalidatePath
};

// Request-level cache (per-request deduplication)
const requestCache = new WeakMap<Request, Map<string, any>>();

export function getRequestCache(request: Request): Map<string, any> {
  if (!requestCache.has(request)) {
    requestCache.set(request, new Map());
  }
  return requestCache.get(request)!;
}

// React-style cache for request deduplication
export function reactCache<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export default cache;
