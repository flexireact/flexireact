/**
 * Fetch API Polyfill for Universal Compatibility
 * 
 * Ensures Request, Response, Headers work everywhere
 */

// Use native Web APIs if available, otherwise polyfill
const globalFetch = globalThis.fetch;
const GlobalRequest = globalThis.Request;
const GlobalResponse = globalThis.Response;
const GlobalHeaders = globalThis.Headers;

// Extended Request with FlexiReact helpers
export class FlexiRequest extends GlobalRequest {
  private _parsedUrl?: URL;
  private _cookies?: Map<string, string>;
  
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
  }
  
  get pathname(): string {
    if (!this._parsedUrl) {
      this._parsedUrl = new URL(this.url);
    }
    return this._parsedUrl.pathname;
  }
  
  get searchParams(): URLSearchParams {
    if (!this._parsedUrl) {
      this._parsedUrl = new URL(this.url);
    }
    return this._parsedUrl.searchParams;
  }
  
  get cookies(): Map<string, string> {
    if (!this._cookies) {
      this._cookies = new Map();
      const cookieHeader = this.headers.get('cookie');
      if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
          const [name, ...rest] = cookie.trim().split('=');
          if (name) {
            this._cookies!.set(name, rest.join('='));
          }
        });
      }
    }
    return this._cookies;
  }
  
  cookie(name: string): string | undefined {
    return this.cookies.get(name);
  }
  
  // Parse JSON body
  async jsonBody<T = any>(): Promise<T> {
    return this.json();
  }
  
  // Parse form data
  async formBody(): Promise<FormData> {
    return this.formData();
  }
  
  // Get query param
  query(name: string): string | null {
    return this.searchParams.get(name);
  }
  
  // Get all query params
  queryAll(name: string): string[] {
    return this.searchParams.getAll(name);
  }
}

// Extended Response with FlexiReact helpers
export class FlexiResponse extends GlobalResponse {
  // Static helpers for common responses
  
  static json(data: any, init?: ResponseInit): FlexiResponse {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    
    return new FlexiResponse(JSON.stringify(data), {
      ...init,
      headers
    });
  }
  
  static html(html: string, init?: ResponseInit): FlexiResponse {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    
    return new FlexiResponse(html, {
      ...init,
      headers
    });
  }
  
  static text(text: string, init?: ResponseInit): FlexiResponse {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    
    return new FlexiResponse(text, {
      ...init,
      headers
    });
  }
  
  static redirect(url: string, status: 301 | 302 | 303 | 307 | 308 = 307): FlexiResponse {
    return new FlexiResponse(null, {
      status,
      headers: { Location: url }
    });
  }
  
  static notFound(message: string = 'Not Found'): FlexiResponse {
    return new FlexiResponse(message, {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  static error(message: string = 'Internal Server Error', status: number = 500): FlexiResponse {
    return new FlexiResponse(message, {
      status,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Stream response
  static stream(
    stream: ReadableStream,
    init?: ResponseInit
  ): FlexiResponse {
    return new FlexiResponse(stream, init);
  }
  
  // Set cookie helper
  withCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      expires?: Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): FlexiResponse {
    const parts = [`${name}=${encodeURIComponent(value)}`];
    
    if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
    if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
    if (options.path) parts.push(`Path=${options.path}`);
    if (options.domain) parts.push(`Domain=${options.domain}`);
    if (options.secure) parts.push('Secure');
    if (options.httpOnly) parts.push('HttpOnly');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    
    const headers = new Headers(this.headers);
    headers.append('Set-Cookie', parts.join('; '));
    
    return new FlexiResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers
    });
  }
  
  // Add headers helper
  withHeaders(newHeaders: Record<string, string>): FlexiResponse {
    const headers = new Headers(this.headers);
    Object.entries(newHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    return new FlexiResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers
    });
  }
}

// Extended Headers
export class FlexiHeaders extends GlobalHeaders {
  // Get bearer token
  getBearerToken(): string | null {
    const auth = this.get('Authorization');
    if (auth?.startsWith('Bearer ')) {
      return auth.slice(7);
    }
    return null;
  }
  
  // Get basic auth credentials
  getBasicAuth(): { username: string; password: string } | null {
    const auth = this.get('Authorization');
    if (auth?.startsWith('Basic ')) {
      try {
        const decoded = atob(auth.slice(6));
        const [username, password] = decoded.split(':');
        return { username, password };
      } catch {
        return null;
      }
    }
    return null;
  }
  
  // Check content type
  isJson(): boolean {
    return this.get('Content-Type')?.includes('application/json') ?? false;
  }
  
  isFormData(): boolean {
    const ct = this.get('Content-Type') ?? '';
    return ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded');
  }
  
  isHtml(): boolean {
    return this.get('Accept')?.includes('text/html') ?? false;
  }
}

// Export both native and extended versions
export { 
  FlexiRequest as Request,
  FlexiResponse as Response,
  FlexiHeaders as Headers
};

// Also export native versions for compatibility
export const NativeRequest = GlobalRequest;
export const NativeResponse = GlobalResponse;
export const NativeHeaders = GlobalHeaders;

export default {
  Request: FlexiRequest,
  Response: FlexiResponse,
  Headers: FlexiHeaders,
  fetch: globalFetch
};
