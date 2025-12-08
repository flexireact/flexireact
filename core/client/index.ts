/**
 * FlexiReact Client Runtime
 * Handles hydration, navigation, and client-side interactivity
 */

export { hydrateIsland, hydrateApp } from './hydration.js';
export { navigate, prefetch, Link } from './navigation.js';
export { useIsland, IslandBoundary } from './islands.js';
