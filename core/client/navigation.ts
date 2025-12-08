/**
 * FlexiReact Client Navigation
 * Client-side navigation with prefetching
 */

import React from 'react';

// Navigation state
const navigationState: {
  listeners: Set<(url: string) => void>;
  prefetched: Set<string>;
} = {
  listeners: new Set(),
  prefetched: new Set()
};

/**
 * Navigates to a new URL
 */
interface NavigateOptions {
  replace?: boolean;
  scroll?: boolean;
}

export function navigate(url: string, options: NavigateOptions = {}) {
  const { replace = false, scroll = true } = options;

  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }

  // Dispatch navigation event
  window.dispatchEvent(new CustomEvent('flexi:navigate', {
    detail: { url, replace, scroll }
  }));

  // Scroll to top if needed
  if (scroll) {
    window.scrollTo(0, 0);
  }

  // Notify listeners
  navigationState.listeners.forEach(listener => listener(url));

  // Fetch and render new page
  return fetchAndRender(url);
}

/**
 * Prefetches a URL for faster navigation
 */
export function prefetch(url) {
  if (navigationState.prefetched.has(url)) {
    return Promise.resolve();
  }

  navigationState.prefetched.add(url);

  // Create a link element for prefetching
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);

  return Promise.resolve();
}

/**
 * Fetches and renders a new page
 */
async function fetchAndRender(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Flexi-Navigation': 'true'
      }
    });

    if (!response.ok) {
      throw new Error(`Navigation failed: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Update the page content
    const newRoot = doc.getElementById('root');
    const currentRoot = document.getElementById('root');

    if (newRoot && currentRoot) {
      currentRoot.innerHTML = newRoot.innerHTML;
    }

    // Update the title
    document.title = doc.title;

    // Update meta tags
    updateMetaTags(doc);

    // Re-hydrate islands
    window.dispatchEvent(new CustomEvent('flexi:pageload'));

  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to full page navigation
    window.location.href = url;
  }
}

/**
 * Updates meta tags from new document
 */
function updateMetaTags(doc) {
  // Remove old meta tags
  document.querySelectorAll('meta[data-flexi]').forEach(el => el.remove());

  // Add new meta tags
  doc.querySelectorAll('meta').forEach(meta => {
    if (meta.name || meta.property) {
      const newMeta = meta.cloneNode(true);
      newMeta.setAttribute('data-flexi', 'true');
      document.head.appendChild(newMeta);
    }
  });
}

/**
 * Link component for client-side navigation
 */
export function Link({ href, children, prefetch: shouldPrefetch = true, replace = false, className, ...props }) {
  const handleClick = (e) => {
    // Allow normal navigation for external links or modified clicks
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.button !== 0 ||
      href.startsWith('http') ||
      href.startsWith('//')
    ) {
      return;
    }

    e.preventDefault();
    navigate(href, { replace });
  };

  const handleMouseEnter = () => {
    if (shouldPrefetch) {
      prefetch(href);
    }
  };

  return React.createElement('a', {
    href,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    className,
    ...props
  }, children);
}

/**
 * Hook to listen for navigation events
 */
export function useNavigation() {
  const [pathname, setPathname] = React.useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  React.useEffect(() => {
    const handleNavigation = (url) => {
      setPathname(new URL(url, window.location.origin).pathname);
    };

    navigationState.listeners.add(handleNavigation);

    const handlePopState = () => {
      setPathname(window.location.pathname);
      navigationState.listeners.forEach(listener => listener(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      navigationState.listeners.delete(handleNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return { pathname, navigate, prefetch };
}

// Setup popstate listener
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    const url = window.location.pathname + window.location.search;
    navigationState.listeners.forEach(listener => listener(url));
  });
}

export default {
  navigate,
  prefetch,
  Link,
  useNavigation
};
