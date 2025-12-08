'use client';

/**
 * FlexiReact Link Component
 * Enhanced link with prefetching, client-side navigation, and loading states
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** The URL to navigate to */
  href: string;
  /** Prefetch the page on hover/visibility */
  prefetch?: boolean | 'hover' | 'viewport';
  /** Replace the current history entry instead of pushing */
  replace?: boolean;
  /** Scroll to top after navigation */
  scroll?: boolean;
  /** Show loading indicator while navigating */
  showLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Callback when navigation starts */
  onNavigationStart?: () => void;
  /** Callback when navigation ends */
  onNavigationEnd?: () => void;
  /** Children */
  children: React.ReactNode;
}

// Prefetch cache to avoid duplicate requests
const prefetchCache = new Set<string>();

// Prefetch a URL
async function prefetchUrl(url: string): Promise<void> {
  if (prefetchCache.has(url)) return;
  
  try {
    // Mark as prefetched immediately to prevent duplicate requests
    prefetchCache.add(url);
    
    // Use link preload for better browser optimization
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
    
    // Also fetch the page to warm the cache
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      signal: controller.signal,
      headers: {
        'X-Flexi-Prefetch': '1',
        'Accept': 'text/html'
      }
    });
    
    clearTimeout(timeoutId);
  } catch (error) {
    // Remove from cache on error so it can be retried
    prefetchCache.delete(url);
  }
}

// Check if URL is internal
function isInternalUrl(url: string): boolean {
  if (url.startsWith('/')) return true;
  if (url.startsWith('#')) return true;
  
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

// Navigate to a URL
function navigate(url: string, options: { replace?: boolean; scroll?: boolean } = {}): void {
  const { replace = false, scroll = true } = options;
  
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
  
  // Dispatch popstate event to trigger any listeners
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  
  // Scroll to top if requested
  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Link component with prefetching and client-side navigation
 * 
 * @example
 * ```tsx
 * import { Link } from '@flexireact/core/client';
 * 
 * // Basic usage
 * <Link href="/about">About</Link>
 * 
 * // With prefetch on hover
 * <Link href="/products" prefetch="hover">Products</Link>
 * 
 * // With prefetch on viewport visibility
 * <Link href="/contact" prefetch="viewport">Contact</Link>
 * 
 * // Replace history instead of push
 * <Link href="/login" replace>Login</Link>
 * 
 * // Disable scroll to top
 * <Link href="/section#anchor" scroll={false}>Go to section</Link>
 * ```
 */
export function Link({
  href,
  prefetch = true,
  replace = false,
  scroll = true,
  showLoading = false,
  loadingComponent,
  onNavigationStart,
  onNavigationEnd,
  children,
  className,
  onClick,
  onMouseEnter,
  onFocus,
  ...props
}: LinkProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const hasPrefetched = useRef(false);

  // Prefetch on viewport visibility
  useEffect(() => {
    if (prefetch !== 'viewport' && prefetch !== true) return;
    if (!isInternalUrl(href)) return;
    if (hasPrefetched.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchUrl(href);
            hasPrefetched.current = true;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (linkRef.current) {
      observer.observe(linkRef.current);
    }

    return () => observer.disconnect();
  }, [href, prefetch]);

  // Handle hover prefetch
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(e);
      
      if ((prefetch === 'hover' || prefetch === true) && isInternalUrl(href)) {
        prefetchUrl(href);
      }
    },
    [href, prefetch, onMouseEnter]
  );

  // Handle focus prefetch (for keyboard navigation)
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLAnchorElement>) => {
      onFocus?.(e);
      
      if ((prefetch === 'hover' || prefetch === true) && isInternalUrl(href)) {
        prefetchUrl(href);
      }
    },
    [href, prefetch, onFocus]
  );

  // Handle click for client-side navigation
  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      
      // Don't handle if default was prevented
      if (e.defaultPrevented) return;
      
      // Don't handle if modifier keys are pressed (open in new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      
      // Don't handle external URLs
      if (!isInternalUrl(href)) return;
      
      // Don't handle if target is set
      if (props.target && props.target !== '_self') return;
      
      // Prevent default navigation
      e.preventDefault();
      
      // Start navigation
      setIsNavigating(true);
      onNavigationStart?.();
      
      try {
        // Fetch the new page
        const response = await fetch(href, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'X-Flexi-Navigation': '1',
            'Accept': 'text/html'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Parse and update the page
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Update title
          const newTitle = doc.querySelector('title')?.textContent;
          if (newTitle) {
            document.title = newTitle;
          }
          
          // Update body content (or specific container)
          const newContent = doc.querySelector('#root') || doc.body;
          const currentContent = document.querySelector('#root') || document.body;
          
          if (newContent && currentContent) {
            currentContent.innerHTML = newContent.innerHTML;
          }
          
          // Update URL
          navigate(href, { replace, scroll });
        } else {
          // Fallback to regular navigation on error
          window.location.href = href;
        }
      } catch (error) {
        // Fallback to regular navigation on error
        window.location.href = href;
      } finally {
        setIsNavigating(false);
        onNavigationEnd?.();
      }
    },
    [href, replace, scroll, onClick, onNavigationStart, onNavigationEnd, props.target]
  );

  return (
    <a
      ref={linkRef}
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      data-prefetch={prefetch}
      data-navigating={isNavigating || undefined}
      {...props}
    >
      {showLoading && isNavigating ? (
        loadingComponent || (
          <span className="flexi-link-loading">
            <span className="flexi-link-spinner" />
            {children}
          </span>
        )
      ) : (
        children
      )}
    </a>
  );
}

/**
 * Programmatic navigation function
 * 
 * @example
 * ```tsx
 * import { useRouter } from '@flexireact/core/client';
 * 
 * function MyComponent() {
 *   const router = useRouter();
 *   
 *   const handleClick = () => {
 *     router.push('/dashboard');
 *   };
 *   
 *   return <button onClick={handleClick}>Go to Dashboard</button>;
 * }
 * ```
 */
export function useRouter() {
  return {
    push(url: string, options?: { scroll?: boolean }) {
      navigate(url, { replace: false, scroll: options?.scroll ?? true });
      // Trigger page reload for now (full SPA navigation requires more work)
      window.location.href = url;
    },
    
    replace(url: string, options?: { scroll?: boolean }) {
      navigate(url, { replace: true, scroll: options?.scroll ?? true });
      window.location.href = url;
    },
    
    back() {
      window.history.back();
    },
    
    forward() {
      window.history.forward();
    },
    
    prefetch(url: string) {
      if (isInternalUrl(url)) {
        prefetchUrl(url);
      }
    },
    
    refresh() {
      window.location.reload();
    }
  };
}

export default Link;
