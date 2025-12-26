/**
 * FlexiReact Hooks - React 19 Native
 * 
 * This module provides React 19 hooks re-exports and FlexiReact-specific
 * hook utilities for enhanced developer experience.
 */

// ============================================================================
// React 19 Core Hooks (re-exported for convenience)
// ============================================================================

// Actions & Forms
export { useActionState, useOptimistic } from 'react';
export { useFormStatus } from 'react-dom';

// Async Data
export { use } from 'react';

// ============================================================================
// FlexiReact Context Hooks
// ============================================================================

export { useParams, useQuery, usePathname, useRequest } from '../context.js';

// ============================================================================
// FlexiReact Client Hooks
// ============================================================================

export { useRouter } from '../client/Link.js';

// ============================================================================
// FlexiReact Enhanced Hooks
// ============================================================================

import { use, useOptimistic as useOptimisticReact } from 'react';

/**
 * Async data fetching hook using React 19's use()
 * 
 * @example
 * ```tsx
 * // In a Server Component or with Suspense boundary
 * function UserProfile({ userId }: { userId: string }) {
 *   const user = useAsyncData(fetchUser(userId));
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function useAsyncData<T>(promise: Promise<T>): T {
    return use(promise);
}

/**
 * Optimistic mutation helper with typed update function
 * 
 * @example
 * ```tsx
 * function TodoList({ todos }: { todos: Todo[] }) {
 *   const [optimisticTodos, addOptimistic] = useOptimisticMutation(
 *     todos,
 *     (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
 *   );
 *   
 *   async function addTodo(todo: Todo) {
 *     addOptimistic(todo);
 *     await saveTodo(todo);
 *   }
 * }
 * ```
 */
export function useOptimisticMutation<T, M>(
    currentState: T,
    updateFn: (state: T, mutation: M) => T
): [T, (mutation: M) => void] {
    return useOptimisticReact(currentState, updateFn);
}

/**
 * Resource preloading for Suspense optimization
 * 
 * @example
 * ```tsx
 * // Preload data before it's needed
 * const userResource = preloadResource(() => fetchUser(userId));
 * 
 * // Later, use it with Suspense
 * function UserCard() {
 *   const user = useAsyncData(userResource);
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function preloadResource<T>(fetcher: () => Promise<T>): Promise<T> {
    // Start fetching immediately, cache the promise
    const promise = fetcher();
    return promise;
}

export default {
    useAsyncData,
    useOptimisticMutation,
    preloadResource
};
