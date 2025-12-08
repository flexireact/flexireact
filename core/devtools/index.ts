/**
 * FlexiReact DevTools
 * Advanced development tools for debugging and performance monitoring
 */

import React from 'react';

// ============================================================================
// DevTools State
// ============================================================================

interface DevToolsState {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  expanded: boolean;
  activeTab: 'routes' | 'components' | 'network' | 'performance' | 'state' | 'console';
  theme: 'dark' | 'light';
}

interface RouteInfo {
  path: string;
  component: string;
  params: Record<string, string>;
  query: Record<string, string>;
  loadTime: number;
}

interface ComponentInfo {
  name: string;
  renderCount: number;
  lastRenderTime: number;
  props: Record<string, any>;
  isIsland: boolean;
}

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  duration: number;
  size: number;
  timestamp: number;
  type: 'fetch' | 'xhr' | 'ssr' | 'action';
}

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Global DevTools state
const devToolsState: {
  routes: RouteInfo[];
  components: Map<string, ComponentInfo>;
  network: NetworkRequest[];
  performance: PerformanceMetric[];
  logs: Array<{ level: string; message: string; timestamp: number }>;
  listeners: Set<() => void>;
} = {
  routes: [],
  components: new Map(),
  network: [],
  performance: [],
  logs: [],
  listeners: new Set(),
};

// ============================================================================
// DevTools API
// ============================================================================

export const devtools = {
  // Track route navigation
  trackRoute(info: RouteInfo): void {
    devToolsState.routes.unshift(info);
    if (devToolsState.routes.length > 50) {
      devToolsState.routes.pop();
    }
    this.notify();
  },

  // Track component render
  trackComponent(name: string, info: Partial<ComponentInfo>): void {
    const existing = devToolsState.components.get(name) || {
      name,
      renderCount: 0,
      lastRenderTime: 0,
      props: {},
      isIsland: false,
    };
    
    devToolsState.components.set(name, {
      ...existing,
      ...info,
      renderCount: existing.renderCount + 1,
      lastRenderTime: Date.now(),
    });
    this.notify();
  },

  // Track network request
  trackRequest(request: NetworkRequest): void {
    devToolsState.network.unshift(request);
    if (devToolsState.network.length > 100) {
      devToolsState.network.pop();
    }
    this.notify();
  },

  // Track performance metric
  trackMetric(metric: PerformanceMetric): void {
    const existing = devToolsState.performance.findIndex(m => m.name === metric.name);
    if (existing >= 0) {
      devToolsState.performance[existing] = metric;
    } else {
      devToolsState.performance.push(metric);
    }
    this.notify();
  },

  // Log message
  log(level: 'info' | 'warn' | 'error' | 'debug', message: string): void {
    devToolsState.logs.unshift({
      level,
      message,
      timestamp: Date.now(),
    });
    if (devToolsState.logs.length > 200) {
      devToolsState.logs.pop();
    }
    this.notify();
  },

  // Get current state
  getState() {
    return {
      routes: devToolsState.routes,
      components: Array.from(devToolsState.components.values()),
      network: devToolsState.network,
      performance: devToolsState.performance,
      logs: devToolsState.logs,
    };
  },

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    devToolsState.listeners.add(listener);
    return () => devToolsState.listeners.delete(listener);
  },

  // Notify listeners
  notify(): void {
    devToolsState.listeners.forEach(listener => listener());
  },

  // Clear all data
  clear(): void {
    devToolsState.routes = [];
    devToolsState.components.clear();
    devToolsState.network = [];
    devToolsState.performance = [];
    devToolsState.logs = [];
    this.notify();
  },
};

// ============================================================================
// Performance Monitoring
// ============================================================================

export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  try {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      devtools.trackMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
      });
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        devtools.trackMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                  entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor',
        });
      });
    }).observe({ type: 'first-input', buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      devtools.trackMetric({
        name: 'CLS',
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
      });
    }).observe({ type: 'layout-shift', buffered: true });

    // TTFB (Time to First Byte)
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      devtools.trackMetric({
        name: 'TTFB',
        value: navEntry.responseStart - navEntry.requestStart,
        rating: navEntry.responseStart - navEntry.requestStart < 200 ? 'good' : 
                navEntry.responseStart - navEntry.requestStart < 500 ? 'needs-improvement' : 'poor',
      });
    }
  } catch (e) {
    // Performance API not fully supported
  }
}

// ============================================================================
// Network Interceptor
// ============================================================================

export function initNetworkInterceptor(): void {
  if (typeof window === 'undefined') return;

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const startTime = Date.now();
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
    const method = typeof args[0] === 'string' ? (args[1]?.method || 'GET') : (args[0] as Request).method;
    
    try {
      const response = await originalFetch.apply(this, args);
      const clone = response.clone();
      const size = (await clone.blob()).size;
      
      devtools.trackRequest({
        id: Math.random().toString(36).slice(2),
        url,
        method,
        status: response.status,
        duration: Date.now() - startTime,
        size,
        timestamp: startTime,
        type: url.includes('/_flexi/action') ? 'action' : 'fetch',
      });
      
      return response;
    } catch (error) {
      devtools.trackRequest({
        id: Math.random().toString(36).slice(2),
        url,
        method,
        status: 0,
        duration: Date.now() - startTime,
        size: 0,
        timestamp: startTime,
        type: 'fetch',
      });
      throw error;
    }
  };
}

// ============================================================================
// DevTools Overlay Component
// ============================================================================

export function DevToolsOverlay(): React.ReactElement | null {
  const [state, setState] = React.useState<DevToolsState>({
    enabled: true,
    position: 'bottom-right',
    expanded: false,
    activeTab: 'routes',
    theme: 'dark',
  });

  const [data, setData] = React.useState(devtools.getState());

  React.useEffect(() => {
    return devtools.subscribe(() => {
      setData(devtools.getState());
    });
  }, []);

  React.useEffect(() => {
    initPerformanceMonitoring();
    initNetworkInterceptor();
  }, []);

  // Keyboard shortcut (Ctrl+Shift+D)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setState(s => ({ ...s, expanded: !s.expanded }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!state.enabled) return null;

  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
  };

  // Mini button when collapsed
  if (!state.expanded) {
    return React.createElement('button', {
      onClick: () => setState(s => ({ ...s, expanded: true })),
      style: {
        position: 'fixed',
        ...positionStyles[state.position],
        zIndex: 99999,
        width: 48,
        height: 48,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #00FF9C 0%, #00D68F 100%)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0, 255, 156, 0.3)',
        transition: 'transform 0.2s',
      },
      onMouseEnter: (e: any) => e.target.style.transform = 'scale(1.1)',
      onMouseLeave: (e: any) => e.target.style.transform = 'scale(1)',
      title: 'FlexiReact DevTools (Ctrl+Shift+D)',
    }, React.createElement('span', { style: { fontSize: 24 } }, '⚡'));
  }

  // Full panel
  const tabs = [
    { id: 'routes', label: '🗺️ Routes', count: data.routes.length },
    { id: 'components', label: '🧩 Components', count: data.components.length },
    { id: 'network', label: '🌐 Network', count: data.network.length },
    { id: 'performance', label: '📊 Performance', count: data.performance.length },
    { id: 'console', label: '📝 Console', count: data.logs.length },
  ];

  return React.createElement('div', {
    style: {
      position: 'fixed',
      ...positionStyles[state.position],
      zIndex: 99999,
      width: 480,
      maxHeight: '70vh',
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 13,
      color: '#fff',
      overflow: 'hidden',
    },
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #222',
        background: '#111',
      },
    }, [
      React.createElement('div', {
        key: 'title',
        style: { display: 'flex', alignItems: 'center', gap: 8 },
      }, [
        React.createElement('span', { key: 'icon' }, '⚡'),
        React.createElement('span', { key: 'text', style: { fontWeight: 600 } }, 'FlexiReact DevTools'),
      ]),
      React.createElement('button', {
        key: 'close',
        onClick: () => setState(s => ({ ...s, expanded: false })),
        style: {
          background: 'none',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          fontSize: 18,
        },
      }, '×'),
    ]),

    // Tabs
    React.createElement('div', {
      key: 'tabs',
      style: {
        display: 'flex',
        borderBottom: '1px solid #222',
        background: '#0d0d0d',
        overflowX: 'auto',
      },
    }, tabs.map(tab => 
      React.createElement('button', {
        key: tab.id,
        onClick: () => setState(s => ({ ...s, activeTab: tab.id as any })),
        style: {
          padding: '10px 14px',
          background: state.activeTab === tab.id ? '#1a1a1a' : 'transparent',
          border: 'none',
          borderBottom: state.activeTab === tab.id ? '2px solid #00FF9C' : '2px solid transparent',
          color: state.activeTab === tab.id ? '#fff' : '#888',
          cursor: 'pointer',
          fontSize: 12,
          whiteSpace: 'nowrap',
        },
      }, `${tab.label} (${tab.count})`)
    )),

    // Content
    React.createElement('div', {
      key: 'content',
      style: {
        padding: 16,
        maxHeight: 'calc(70vh - 100px)',
        overflowY: 'auto',
      },
    }, renderTabContent(state.activeTab, data)),
  ]);
}

function renderTabContent(tab: string, data: ReturnType<typeof devtools.getState>): React.ReactElement {
  switch (tab) {
    case 'routes':
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        data.routes.length === 0 
          ? React.createElement('div', { style: { color: '#666', textAlign: 'center', padding: 20 } }, 'No routes tracked yet')
          : data.routes.map((route, i) => 
              React.createElement('div', {
                key: i,
                style: {
                  padding: 12,
                  background: '#111',
                  borderRadius: 8,
                  border: '1px solid #222',
                },
              }, [
                React.createElement('div', { key: 'path', style: { fontWeight: 600, color: '#00FF9C' } }, route.path),
                React.createElement('div', { key: 'component', style: { fontSize: 11, color: '#888', marginTop: 4 } }, 
                  `Component: ${route.component} • ${route.loadTime}ms`
                ),
              ])
            )
      );

    case 'components':
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        data.components.length === 0
          ? React.createElement('div', { style: { color: '#666', textAlign: 'center', padding: 20 } }, 'No components tracked')
          : data.components.map((comp, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  padding: 12,
                  background: '#111',
                  borderRadius: 8,
                  border: '1px solid #222',
                },
              }, [
                React.createElement('div', { 
                  key: 'name',
                  style: { display: 'flex', alignItems: 'center', gap: 8 } 
                }, [
                  React.createElement('span', { key: 'text', style: { fontWeight: 600 } }, comp.name),
                  comp.isIsland && React.createElement('span', {
                    key: 'island',
                    style: {
                      fontSize: 10,
                      padding: '2px 6px',
                      background: '#00FF9C20',
                      color: '#00FF9C',
                      borderRadius: 4,
                    },
                  }, 'Island'),
                ]),
                React.createElement('div', { key: 'info', style: { fontSize: 11, color: '#888', marginTop: 4 } },
                  `Renders: ${comp.renderCount} • Last: ${new Date(comp.lastRenderTime).toLocaleTimeString()}`
                ),
              ])
            )
      );

    case 'network':
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        data.network.length === 0
          ? React.createElement('div', { style: { color: '#666', textAlign: 'center', padding: 20 } }, 'No requests yet')
          : data.network.map((req, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  padding: 12,
                  background: '#111',
                  borderRadius: 8,
                  border: '1px solid #222',
                },
              }, [
                React.createElement('div', { 
                  key: 'url',
                  style: { display: 'flex', alignItems: 'center', gap: 8 } 
                }, [
                  React.createElement('span', {
                    key: 'method',
                    style: {
                      fontSize: 10,
                      padding: '2px 6px',
                      background: req.method === 'GET' ? '#3B82F620' : '#F59E0B20',
                      color: req.method === 'GET' ? '#3B82F6' : '#F59E0B',
                      borderRadius: 4,
                      fontWeight: 600,
                    },
                  }, req.method),
                  React.createElement('span', {
                    key: 'status',
                    style: {
                      fontSize: 10,
                      padding: '2px 6px',
                      background: req.status >= 200 && req.status < 300 ? '#10B98120' : '#EF444420',
                      color: req.status >= 200 && req.status < 300 ? '#10B981' : '#EF4444',
                      borderRadius: 4,
                    },
                  }, req.status || 'ERR'),
                  React.createElement('span', { 
                    key: 'path',
                    style: { fontSize: 12, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' } 
                  }, new URL(req.url, 'http://localhost').pathname),
                ]),
                React.createElement('div', { key: 'info', style: { fontSize: 11, color: '#888', marginTop: 4 } },
                  `${req.duration}ms • ${formatBytes(req.size)}`
                ),
              ])
            )
      );

    case 'performance':
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        data.performance.length === 0
          ? React.createElement('div', { style: { color: '#666', textAlign: 'center', padding: 20 } }, 'Collecting metrics...')
          : data.performance.map((metric, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  padding: 12,
                  background: '#111',
                  borderRadius: 8,
                  border: '1px solid #222',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              }, [
                React.createElement('span', { key: 'name', style: { fontWeight: 600 } }, metric.name),
                React.createElement('div', { key: 'value', style: { display: 'flex', alignItems: 'center', gap: 8 } }, [
                  React.createElement('span', { key: 'num' }, 
                    metric.name === 'CLS' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`
                  ),
                  React.createElement('span', {
                    key: 'rating',
                    style: {
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: metric.rating === 'good' ? '#10B981' : 
                                  metric.rating === 'needs-improvement' ? '#F59E0B' : '#EF4444',
                    },
                  }),
                ]),
              ])
            )
      );

    case 'console':
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
        data.logs.length === 0
          ? React.createElement('div', { style: { color: '#666', textAlign: 'center', padding: 20 } }, 'No logs yet')
          : data.logs.map((log, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  padding: '8px 12px',
                  background: log.level === 'error' ? '#EF444410' : 
                              log.level === 'warn' ? '#F59E0B10' : '#111',
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  color: log.level === 'error' ? '#EF4444' : 
                         log.level === 'warn' ? '#F59E0B' : '#888',
                },
              }, [
                React.createElement('span', { key: 'time', style: { color: '#444', marginRight: 8 } },
                  new Date(log.timestamp).toLocaleTimeString()
                ),
                log.message,
              ])
            )
      );

    default:
      return React.createElement('div', {}, 'Unknown tab');
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ============================================================================
// Exports
// ============================================================================

export default {
  devtools,
  DevToolsOverlay,
  initPerformanceMonitoring,
  initNetworkInterceptor,
};
