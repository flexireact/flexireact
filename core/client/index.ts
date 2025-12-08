/**
 * FlexiReact Client Runtime
 * Handles hydration, navigation, and client-side interactivity
 */

export { hydrateIsland, hydrateApp } from './hydration.js';
export { navigate, prefetch, Link as NavLink } from './navigation.js';
export { useIsland, IslandBoundary } from './islands.js';

// Enhanced Link component with prefetching
export { Link, useRouter } from './Link.js';
export type { LinkProps } from './Link.js';
