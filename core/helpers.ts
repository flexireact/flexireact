/**
 * FlexiReact Server Helpers
 * Utility functions for server-side operations
 */

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Custom error classes for control flow
 */
export class RedirectError extends Error {
  public readonly url: string;
  public readonly statusCode: number;
  public readonly type = 'redirect' as const;

  constructor(url: string, statusCode: number = 307) {
    super(`Redirect to ${url}`);
    this.name = 'RedirectError';
    this.url = url;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends Error {
  public readonly type = 'notFound' as const;

  constructor(message: string = 'Page not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Redirect to a different URL
 * @param url - The URL to redirect to
 * @param type - 'replace' (307) or 'push' (308) for permanent
 * 
 * @example
 * ```tsx
 * import { redirect } from '@flexireact/core';
 * 
 * export default function ProtectedPage() {
 *   const user = getUser();
 *   if (!user) {
 *     redirect('/login');
 *   }
 *   return <Dashboard user={user} />;
 * }
 * ```
 */
export function redirect(url: string, type: 'replace' | 'permanent' = 'replace'): never {
  const statusCode = type === 'permanent' ? 308 : 307;
  throw new RedirectError(url, statusCode);
}

/**
 * Trigger a 404 Not Found response
 * 
 * @example
 * ```tsx
 * import { notFound } from '@flexireact/core';
 * 
 * export default function ProductPage({ params }) {
 *   const product = getProduct(params.id);
 *   if (!product) {
 *     notFound();
 *   }
 *   return <Product data={product} />;
 * }
 * ```
 */
export function notFound(message?: string): never {
  throw new NotFoundError(message);
}

/**
 * Create a JSON response
 * 
 * @example
 * ```ts
 * // In API route
 * export function GET() {
 *   return json({ message: 'Hello' });
 * }
 * 
 * export function POST() {
 *   return json({ error: 'Bad request' }, { status: 400 });
 * }
 * ```
 */
export function json<T>(
  data: T,
  options: {
    status?: number;
    headers?: Record<string, string>;
  } = {}
): Response {
  const { status = 200, headers = {} } = options;
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

/**
 * Create an HTML response
 */
export function html(
  content: string,
  options: {
    status?: number;
    headers?: Record<string, string>;
  } = {}
): Response {
  const { status = 200, headers = {} } = options;
  
  return new Response(content, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...headers
    }
  });
}

/**
 * Create a text response
 */
export function text(
  content: string,
  options: {
    status?: number;
    headers?: Record<string, string>;
  } = {}
): Response {
  const { status = 200, headers = {} } = options;
  
  return new Response(content, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...headers
    }
  });
}

// ============================================================================
// Cookies API
// ============================================================================

export interface CookieOptions {
  /** Max age in seconds */
  maxAge?: number;
  /** Expiration date */
  expires?: Date;
  /** Cookie path */
  path?: string;
  /** Cookie domain */
  domain?: string;
  /** Secure flag (HTTPS only) */
  secure?: boolean;
  /** HttpOnly flag */
  httpOnly?: boolean;
  /** SameSite policy */
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Cookie utilities for server-side operations
 */
export const cookies = {
  /**
   * Parse cookies from a cookie header string
   */
  parse(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      if (name) {
        const value = rest.join('=');
        cookies[name.trim()] = decodeURIComponent(value.trim());
      }
    });

    return cookies;
  },

  /**
   * Get a cookie value from request headers
   */
  get(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.get('cookie') || '';
    const parsed = this.parse(cookieHeader);
    return parsed[name];
  },

  /**
   * Get all cookies from request
   */
  getAll(request: Request): Record<string, string> {
    const cookieHeader = request.headers.get('cookie') || '';
    return this.parse(cookieHeader);
  },

  /**
   * Serialize a cookie for Set-Cookie header
   */
  serialize(name: string, value: string, options: CookieOptions = {}): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.maxAge !== undefined) {
      cookie += `; Max-Age=${options.maxAge}`;
    }
    if (options.expires) {
      cookie += `; Expires=${options.expires.toUTCString()}`;
    }
    if (options.path) {
      cookie += `; Path=${options.path}`;
    }
    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }
    if (options.secure) {
      cookie += '; Secure';
    }
    if (options.httpOnly) {
      cookie += '; HttpOnly';
    }
    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
    }

    return cookie;
  },

  /**
   * Create a Set-Cookie header value
   */
  set(name: string, value: string, options: CookieOptions = {}): string {
    return this.serialize(name, value, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...options
    });
  },

  /**
   * Create a cookie deletion header
   */
  delete(name: string, options: Omit<CookieOptions, 'maxAge' | 'expires'> = {}): string {
    return this.serialize(name, '', {
      ...options,
      path: '/',
      maxAge: 0
    });
  }
};

// ============================================================================
// Headers API
// ============================================================================

/**
 * Headers utilities for server-side operations
 */
export const headers = {
  /**
   * Create a new Headers object with common defaults
   */
  create(init?: HeadersInit): Headers {
    return new Headers(init);
  },

  /**
   * Get a header value from request
   */
  get(request: Request, name: string): string | null {
    return request.headers.get(name);
  },

  /**
   * Get all headers as an object
   */
  getAll(request: Request): Record<string, string> {
    const result: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  /**
   * Check if request has a specific header
   */
  has(request: Request, name: string): boolean {
    return request.headers.has(name);
  },

  /**
   * Get content type from request
   */
  contentType(request: Request): string | null {
    return request.headers.get('content-type');
  },

  /**
   * Check if request accepts JSON
   */
  acceptsJson(request: Request): boolean {
    const accept = request.headers.get('accept') || '';
    return accept.includes('application/json') || accept.includes('*/*');
  },

  /**
   * Check if request is AJAX/fetch
   */
  isAjax(request: Request): boolean {
    return request.headers.get('x-requested-with') === 'XMLHttpRequest' ||
           this.acceptsJson(request);
  },

  /**
   * Get authorization header
   */
  authorization(request: Request): { type: string; credentials: string } | null {
    const auth = request.headers.get('authorization');
    if (!auth) return null;

    const [type, ...rest] = auth.split(' ');
    return {
      type: type.toLowerCase(),
      credentials: rest.join(' ')
    };
  },

  /**
   * Get bearer token from authorization header
   */
  bearerToken(request: Request): string | null {
    const auth = this.authorization(request);
    if (auth?.type === 'bearer') {
      return auth.credentials;
    }
    return null;
  },

  /**
   * Common security headers
   */
  security(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
  },

  /**
   * CORS headers
   */
  cors(options: {
    origin?: string;
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}): Record<string, string> {
    const {
      origin = '*',
      methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      headers: allowHeaders = ['Content-Type', 'Authorization'],
      credentials = false,
      maxAge = 86400
    } = options;

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': methods.join(', '),
      'Access-Control-Allow-Headers': allowHeaders.join(', '),
      'Access-Control-Max-Age': String(maxAge)
    };

    if (credentials) {
      corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    return corsHeaders;
  },

  /**
   * Cache control headers
   */
  cache(options: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
    private?: boolean;
    noStore?: boolean;
  } = {}): Record<string, string> {
    if (options.noStore) {
      return { 'Cache-Control': 'no-store, no-cache, must-revalidate' };
    }

    const directives: string[] = [];
    
    if (options.private) {
      directives.push('private');
    } else {
      directives.push('public');
    }

    if (options.maxAge !== undefined) {
      directives.push(`max-age=${options.maxAge}`);
    }

    if (options.sMaxAge !== undefined) {
      directives.push(`s-maxage=${options.sMaxAge}`);
    }

    if (options.staleWhileRevalidate !== undefined) {
      directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }

    return { 'Cache-Control': directives.join(', ') };
  }
};

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Parse JSON body from request
 */
export async function parseJson<T = unknown>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON body');
  }
}

/**
 * Parse form data from request
 */
export async function parseFormData(request: Request): Promise<FormData> {
  return await request.formData();
}

/**
 * Parse URL search params
 */
export function parseSearchParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

/**
 * Get request method
 */
export function getMethod(request: Request): string {
  return request.method.toUpperCase();
}

/**
 * Get request pathname
 */
export function getPathname(request: Request): string {
  const url = new URL(request.url);
  return url.pathname;
}

/**
 * Check if request method matches
 */
export function isMethod(request: Request, method: string | string[]): boolean {
  const reqMethod = getMethod(request);
  if (Array.isArray(method)) {
    return method.map(m => m.toUpperCase()).includes(reqMethod);
  }
  return reqMethod === method.toUpperCase();
}
