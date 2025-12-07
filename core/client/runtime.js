/**
 * FlexiReact Client Runtime
 * Main entry point for client-side JavaScript
 */

import { hydrateAllIslands, setupProgressiveHydration } from './hydration.js';
import { navigate, prefetch } from './navigation.js';

// Expose to global scope
window.FlexiReact = {
  navigate,
  prefetch,
  hydrateAllIslands,
  setupProgressiveHydration
};

// Auto-setup on page load
document.addEventListener('DOMContentLoaded', () => {
  // Setup progressive hydration for islands
  if (window.__FLEXI_DATA__?.islands) {
    setupProgressiveHydration(window.__FLEXI_DATA__.islands);
  }

  // Dispatch ready event
  window.dispatchEvent(new CustomEvent('flexi:ready'));
});

// Handle page transitions
window.addEventListener('flexi:pageload', () => {
  // Re-setup hydration after navigation
  if (window.__FLEXI_DATA__?.islands) {
    setupProgressiveHydration(window.__FLEXI_DATA__.islands);
  }
});

console.log('⚡ FlexiReact v2 client runtime loaded');
