/**
 * FlexiReact Server Actions
 * 
 * Server Actions allow you to define server-side functions that can be called
 * directly from client components. They are automatically serialized and executed
 * on the server.
 * 
 * Usage:
 * ```tsx
 * // In a server file (actions.ts)
 * 'use server';
 * 
 * export async function createUser(formData: FormData) {
 *   const name = formData.get('name');
 *   // Save to database...
 *   return { success: true, id: 123 };
 * }
 * 
 * // In a client component
 * 'use client';
 * import { createUser } from './actions';
 * 
 * function Form() {
 *   return (
 *     <form action={createUser}>
 *       <input name="name" />
 *       <button type="submit">Create</button>
 *     </form>
 *   );
 * }
 * ```
 */

import { cookies, headers, redirect, notFound, RedirectError, NotFoundError } from '../helpers.js';

// Global action registry
declare global {
  var __FLEXI_ACTIONS__: Record<string, ServerActionFunction>;
  var __FLEXI_ACTION_CONTEXT__: ActionContext | null;
}

globalThis.__FLEXI_ACTIONS__ = globalThis.__FLEXI_ACTIONS__ || {};
globalThis.__FLEXI_ACTION_CONTEXT__ = null;

export interface ActionContext {
  request: Request;
  cookies: typeof cookies;
  headers: typeof headers;
  redirect: typeof redirect;
  notFound: typeof notFound;
}

export type ServerActionFunction = (...args: any[]) => Promise<any>;

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  redirect?: string;
}

/**
 * Decorator to mark a function as a server action
 */
export function serverAction<T extends ServerActionFunction>(
  fn: T,
  actionId?: string
): T {
  const id = actionId || `action_${fn.name}_${generateActionId()}`;
  
  // Register the action
  globalThis.__FLEXI_ACTIONS__[id] = fn;
  
  // Create a proxy that will be serialized for the client
  const proxy = (async (...args: any[]) => {
    // If we're on the server, execute directly
    if (typeof window === 'undefined') {
      return await executeAction(id, args);
    }
    
    // If we're on the client, make a fetch request
    return await callServerAction(id, args);
  }) as T;
  
  // Mark as server action
  (proxy as any).$$typeof = Symbol.for('react.server.action');
  (proxy as any).$$id = id;
  (proxy as any).$$bound = null;
  
  return proxy;
}

/**
 * Register a server action
 */
export function registerAction(id: string, fn: ServerActionFunction): void {
  globalThis.__FLEXI_ACTIONS__[id] = fn;
}

/**
 * Get a registered action
 */
export function getAction(id: string): ServerActionFunction | undefined {
  return globalThis.__FLEXI_ACTIONS__[id];
}

/**
 * Execute a server action on the server
 */
export async function executeAction(
  actionId: string,
  args: any[],
  context?: Partial<ActionContext>
): Promise<ActionResult> {
  const action = globalThis.__FLEXI_ACTIONS__[actionId];
  
  if (!action) {
    return {
      success: false,
      error: `Server action not found: ${actionId}`
    };
  }
  
  // Set up action context
  const actionContext: ActionContext = {
    request: context?.request || new Request('http://localhost'),
    cookies,
    headers,
    redirect,
    notFound
  };
  
  globalThis.__FLEXI_ACTION_CONTEXT__ = actionContext;
  
  try {
    const result = await action(...args);
    
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    // Handle redirect
    if (error instanceof RedirectError) {
      return {
        success: true,
        redirect: error.url
      };
    }
    
    // Handle not found
    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: 'Not found'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Action failed'
    };
  } finally {
    globalThis.__FLEXI_ACTION_CONTEXT__ = null;
  }
}

/**
 * Call a server action from the client
 */
export async function callServerAction(
  actionId: string,
  args: any[]
): Promise<ActionResult> {
  try {
    const response = await fetch('/_flexi/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Flexi-Action': actionId
      },
      body: JSON.stringify({
        actionId,
        args: serializeArgs(args)
      }),
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`Action failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Handle redirect
    if (result.redirect) {
      window.location.href = result.redirect;
      return result;
    }
    
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
}

/**
 * Serialize action arguments for transmission
 */
function serializeArgs(args: any[]): any[] {
  return args.map(arg => {
    // Handle FormData
    if (arg instanceof FormData) {
      const obj: Record<string, any> = {};
      arg.forEach((value, key) => {
        if (obj[key]) {
          // Handle multiple values
          if (Array.isArray(obj[key])) {
            obj[key].push(value);
          } else {
            obj[key] = [obj[key], value];
          }
        } else {
          obj[key] = value;
        }
      });
      return { $$type: 'FormData', data: obj };
    }
    
    // Handle File
    if (typeof File !== 'undefined' && arg instanceof File) {
      return { $$type: 'File', name: arg.name, type: arg.type, size: arg.size };
    }
    
    // Handle Date
    if (arg instanceof Date) {
      return { $$type: 'Date', value: arg.toISOString() };
    }
    
    // Handle regular objects
    if (typeof arg === 'object' && arg !== null) {
      return JSON.parse(JSON.stringify(arg));
    }
    
    return arg;
  });
}

/**
 * Deserialize action arguments on the server
 */
export function deserializeArgs(args: any[]): any[] {
  return args.map(arg => {
    if (arg && typeof arg === 'object') {
      // Handle FormData
      if (arg.$$type === 'FormData') {
        const formData = new FormData();
        for (const [key, value] of Object.entries(arg.data)) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v as string));
          } else {
            formData.append(key, value as string);
          }
        }
        return formData;
      }
      
      // Handle Date
      if (arg.$$type === 'Date') {
        return new Date(arg.value);
      }
    }
    
    return arg;
  });
}

/**
 * Generate a unique action ID
 */
function generateActionId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Hook to get the current action context
 */
export function useActionContext(): ActionContext | null {
  return globalThis.__FLEXI_ACTION_CONTEXT__;
}

/**
 * Create a form action handler
 * Wraps a server action for use with HTML forms
 */
export function formAction<T>(
  action: (formData: FormData) => Promise<T>
): (formData: FormData) => Promise<ActionResult<T>> {
  return async (formData: FormData) => {
    try {
      const result = await action(formData);
      return { success: true, data: result };
    } catch (error: any) {
      if (error instanceof RedirectError) {
        return { success: true, redirect: error.url };
      }
      return { success: false, error: error.message };
    }
  };
}

/**
 * useFormState hook for progressive enhancement
 * Works with server actions and provides loading/error states
 */
export function createFormState<T>(
  action: (formData: FormData) => Promise<ActionResult<T>>,
  initialState: T | null = null
) {
  return {
    action,
    initialState,
    // This will be enhanced on the client
    pending: false,
    error: null as string | null,
    data: initialState
  };
}

/**
 * Bind arguments to a server action
 * Creates a new action with pre-filled arguments
 */
export function bindArgs<T extends ServerActionFunction>(
  action: T,
  ...boundArgs: any[]
): T {
  const boundAction = (async (...args: any[]) => {
    return await (action as any)(...boundArgs, ...args);
  }) as T;
  
  // Copy action metadata
  (boundAction as any).$$typeof = (action as any).$$typeof;
  (boundAction as any).$$id = (action as any).$$id;
  (boundAction as any).$$bound = boundArgs;
  
  return boundAction;
}

export default {
  serverAction,
  registerAction,
  getAction,
  executeAction,
  callServerAction,
  deserializeArgs,
  useActionContext,
  formAction,
  createFormState,
  bindArgs
};
