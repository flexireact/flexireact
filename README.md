<p align="center">
  <img src="./assets/flexireact.webp" alt="FlexiReact Logo" width="400" />
</p>

<h1 align="center">⚡ FlexiReact v3</h1>

<p align="center">
  <strong>The Future of React Development</strong>
</p>

<p align="center">
  A blazing-fast React framework with TypeScript, Tailwind CSS, SSR, SSG, Islands, Edge Runtime, and 50+ UI components.<br/>
  <b>Better than Next.js.</b> Simpler. Faster. More powerful.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flexireact/core"><img src="https://img.shields.io/npm/v/@flexireact/core.svg?color=00FF9C" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@flexireact/core"><img src="https://img.shields.io/npm/dm/@flexireact/core.svg?color=00FF9C" alt="npm downloads" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-00FF9C.svg" alt="License: MIT" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Native-blue.svg" alt="TypeScript Native" /></a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-cli-commands">CLI</a> •
  <a href="#-flexi-ui">FlexiUI</a> •
  <a href="#-devtools">DevTools</a>
</p>

---

## 🚀 Quick Start

```bash
# Create a new project
npx create-flexireact my-app

# Or with a specific template
npx create-flexireact my-app --template app-router

# Start development
cd my-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🆕 What's New in v3.0

### v3.0.0 — The Future of React
- **🌐 Universal Edge Runtime** — Deploy anywhere: Node.js, Bun, Deno, Cloudflare Workers, Vercel Edge
- **⚡ Smart Caching** — TTL, stale-while-revalidate, tag-based invalidation
- **🎯 Partial Prerendering (PPR)** — Static shell + streaming dynamic content
- **🛠️ CLI Scaffolding** — Generate pages, components, hooks, APIs with `flexi g`
- **🔧 Advanced DevTools** — Routes, Components, Network, Performance monitoring
- **🎨 FlexiUI Integration** — 50+ beautiful, accessible React components
- **📱 Sexy Templates** — Modern, responsive landing pages out of the box

## ✨ Features

### 🏗️ Core Framework

| Feature | Description |
|---------|-------------|
| 📘 **TypeScript First** | Full TypeScript support with strict type checking and excellent DX |
| ⚡ **Lightning Fast** | Powered by esbuild for instant builds and sub-second HMR |
| 📁 **File-based Routing** | Create a file in `pages/`, get a route automatically |
| 🏝️ **Islands Architecture** | Partial hydration for minimal JavaScript and maximum performance |
| 🖥️ **SSR / SSG / ISR** | Server-side rendering, static generation, and incremental regeneration |
| 🔌 **API Routes** | Build your REST/GraphQL API alongside your frontend |

### 🧩 Layouts & Components

| Feature | Description |
|---------|-------------|
| 📐 **Nested Layouts** | Shared layouts with `_layout.tsx` that persist across navigation |
| 🎭 **Server Components** | `'use server'` directive for server-only components (zero JS) |
| 💻 **Client Components** | `'use client'` directive for interactive client-side components |
| 🎨 **Tailwind CSS** | Pre-configured with beautiful defaults, dark mode, and CSS variables |
| 🧱 **UI Components** | Button, Card, Modal, Tooltip, Drawer, Table, Input, Skeleton... |
| ✨ **shadcn/ui Ready** | Compatible component system with CVA variants |

### 📊 Data Fetching & State

| Feature | Description |
|---------|-------------|
| 🔄 **getServerSideProps** | Fetch data on every request (SSR) |
| 📦 **getStaticProps** | Fetch data at build time (SSG) |
| 🚀 **Prefetch** | Automatic link prefetching for instant navigation |
| 🔍 **TanStack Query** | Built-in support for useQuery, useMutation, and caching |
| 🐻 **Zustand / Jotai** | Lightweight state management integration |
| ⚡ **Optimistic Updates** | Instant UI feedback with automatic rollback |
| ⏳ **Suspense Ready** | React Suspense for loading states and streaming |

### 🛡️ Middleware & Security

| Feature | Description |
|---------|-------------|
| � **Middleware System** | Run code before every request (auth, logging, redirects) |
| 🔐 **Authentication** | Email/password + OAuth (Google, GitHub, Discord) |
| 👥 **RBAC** | Role-based access control with permissions |
| 🛡️ **Security** | Built-in CSRF, XSS, CORS protection |
| ⏱️ **Rate Limiting** | Protect your API from abuse |
| 📝 **Request Logging** | Structured logging with levels and formatting |

### 🚀 Performance & Build

| Feature | Description |
|---------|-------------|
| 📦 **Code Splitting** | Automatic route-based code splitting |
| 🦥 **Lazy Loading** | Dynamic imports with `React.lazy()` support |
| 🌳 **Tree Shaking** | Dead code elimination for minimal bundles |
| 📊 **Bundle Analysis** | Visualize your bundle size with built-in analyzer |
| �️ **Compression** | Gzip/Brotli compression out of the box |
| 🖼️ **Image Optimization** | Automatic image resizing, WebP conversion, lazy loading |

### 🔧 Developer Experience

| Feature | Description |
|---------|-------------|
| 🔥 **Hot Reloading** | Instant updates without losing state |
| 🐛 **Error Overlay** | Beautiful error messages with stack traces |
| � **ESLint + Prettier** | Pre-configured linting and formatting |
| 🎨 **Tailwind IntelliSense** | Full autocomplete for Tailwind classes |
| 📋 **Multiple Templates** | Starter templates: minimal, blog, dashboard, e-commerce |
| 🩺 **Doctor Command** | `flexi doctor` to diagnose project issues |

### 🔍 SEO & Analytics

| Feature | Description |
|---------|-------------|
| 🏷️ **Auto Meta Tags** | Automatic title, description, and canonical URLs |
| 📱 **Open Graph** | Social media preview cards (Twitter, Facebook, LinkedIn) |
| 🗺️ **Sitemap** | Auto-generated sitemap.xml for search engines |
| 📈 **Performance Monitoring** | Core Web Vitals tracking built-in |
| � **robots.txt** | Configurable robots.txt generation |
| 📊 **Analytics Ready** | Easy integration with Google Analytics, Plausible, etc. |

### 🔌 Extensibility

| Feature | Description |
|---------|-------------|
| 🧩 **Plugin System** | Extend FlexiReact with community plugins |
| 🎣 **Lifecycle Hooks** | `beforeRender`, `afterRender`, `onError` hooks |
| 📦 **Custom Templates** | Create and share your own project templates |
| 🔄 **Migration Tools** | Automatic migration from Next.js, CRA, Vite |
| ⚙️ **Config API** | Fully customizable `flexireact.config.ts` |

---

## 🆚 Why FlexiReact?

| | FlexiReact v3 | Next.js 15 | Remix | Astro |
|---|:---:|:---:|:---:|:---:|
| **Zero Config** | ✅ | ⚠️ | ⚠️ | ✅ |
| **Edge Runtime** | ✅ | ✅ | ⚠️ | ⚠️ |
| **Islands Architecture** | ✅ | ❌ | ❌ | ✅ |
| **UI Components** | ✅ 50+ | ❌ | ❌ | ❌ |
| **CLI Scaffolding** | ✅ | ❌ | ❌ | ❌ |
| **DevTools** | ✅ | ⚠️ | ⚠️ | ⚠️ |
| **PPR** | ✅ | ✅ | ❌ | ❌ |
| **Bundle Size** | 🟢 ~90kb | � ~250kb | 🟡 ~150kb | 🟢 ~50kb |
| **Build Speed** | 🟢 <1s | 🟡 ~5s | 🟡 ~3s | 🟢 <2s |

---

## 🖥️ CLI Commands

```bash
# Project
flexi create <name>       # Create new project
flexi dev                 # Start dev server (HMR)
flexi build               # Build for production
flexi build --analyze     # Build with bundle analysis
flexi start               # Start production server
flexi doctor              # Check project health

# Scaffolding (NEW in v3!)
flexi g page dashboard    # Generate a page
flexi g component Button  # Generate a component
flexi g hook useAuth      # Generate a custom hook
flexi g api users         # Generate an API route
flexi g action submit     # Generate a server action
flexi g context theme     # Generate a React context
flexi g middleware auth   # Generate middleware
flexi g loading           # Generate loading.tsx
flexi g error             # Generate error.tsx
```

---

## 🎨 FlexiUI — 50+ Components

FlexiReact includes [@flexireact/flexi-ui](https://www.npmjs.com/package/@flexireact/flexi-ui), a complete UI library:

```bash
npm install @flexireact/flexi-ui
```

```tsx
import { Button, Card, Input, Modal, Toast } from '@flexireact/flexi-ui';
```

### Available Components

| Category | Components |
|----------|------------|
| **Form** | Button, Input, Textarea, Checkbox, Switch, Select, Slider, Radio, Toggle, Rating, DatePicker, FileUpload |
| **Layout** | Stack, Separator, AspectRatio, ScrollArea, Resizable |
| **Navigation** | Tabs, Breadcrumb, Pagination, Menubar, Navbar, Sidebar, Stepper |
| **Data** | Card, Badge, Avatar, Table, Accordion, Calendar, Timeline, Stat, Code, Carousel |
| **Feedback** | Alert, Toast, Spinner, Skeleton, Progress, Empty |
| **Overlay** | Modal, Dialog, Drawer, Sheet, Dropdown, Popover, HoverCard, ContextMenu, Command, Collapsible |

---

## 🔧 DevTools

Built-in development tools (press `Ctrl+Shift+D`):

```tsx
import { DevToolsOverlay } from '@flexireact/core';

// In your layout
{process.env.NODE_ENV === 'development' && <DevToolsOverlay />}
```

Features:
- 🗺️ **Routes** — Navigation history and params
- 🧩 **Components** — Render counts, props, Islands detection
- 🌐 **Network** — Fetch/XHR/Actions monitoring
- 📊 **Performance** — Core Web Vitals (LCP, FID, CLS, TTFB)
- 📝 **Console** — Centralized logs

---

## 🌐 Edge Runtime

Deploy anywhere with universal edge support:

```tsx
import { createEdgeHandler, detectRuntime } from '@flexireact/core';

// Automatic runtime detection
const runtime = detectRuntime();
// → 'node' | 'bun' | 'deno' | 'cloudflare' | 'vercel-edge' | 'netlify-edge'

// Universal handler
const handler = createEdgeHandler({
  routes: [...],
  middleware: [...],
});

export default handler;
```

---

## ⚡ Smart Caching

```tsx
import { smartCache } from '@flexireact/core';

const cache = smartCache({
  backend: 'auto', // auto-detect: memory, KV, Redis
  defaultTTL: 60,
  staleWhileRevalidate: true,
});

// Cache with tags
await cache.set('user:123', userData, { 
  ttl: 300, 
  tags: ['users'] 
});

// Invalidate by tag
await cache.invalidateTag('users');
```

---

## 🎯 Partial Prerendering (PPR)

Static shell + streaming dynamic content:

```tsx
import { withPPR, DynamicBoundary } from '@flexireact/core';

export default withPPR(function Page() {
  return (
    <div>
      {/* Static - rendered at build time */}
      <Header />
      <Sidebar />
      
      {/* Dynamic - streamed at request time */}
      <DynamicBoundary fallback={<Skeleton />}>
        <UserDashboard />
      </DynamicBoundary>
    </div>
  );
});
```

---

## 📁 Project Structure

FlexiReact v2 introduces a new `routes/` directory with enhanced routing capabilities:

```
myapp/
├── app/                        # App directory (layout, components, styles)
│   ├── components/
│   │   ├── ui/                 # UI components (Button, Card, etc.)
│   │   └── layout/             # Layout components (Navbar, Footer)
│   ├── styles/
│   │   └── globals.css         # Global styles + Tailwind v4
│   ├── providers/              # React context providers
│   └── layout.tsx              # Root layout
├── routes/                     # FlexiReact v2 file-based routing
│   ├── (public)/               # Route groups (don't affect URL)
│   │   ├── home.tsx            # → /
│   │   └── about.tsx           # → /about
│   ├── blog/
│   │   ├── index.tsx           # → /blog
│   │   └── [slug].tsx          # → /blog/:slug
│   └── api/
│       └── hello.ts            # → /api/hello
├── lib/                        # Utilities
│   └── utils.ts
├── public/                     # Static assets
├── tsconfig.json               # TypeScript configuration
├── flexireact.config.ts        # FlexiReact configuration
└── package.json
```

## 🛣️ Routing (v2)

FlexiReact v2 supports three routing conventions (in priority order):

### 1. Routes Directory (Recommended)

| File | Route |
|------|-------|
| `routes/(public)/home.tsx` | `/` |
| `routes/(public)/about.tsx` | `/about` |
| `routes/blog/index.tsx` | `/blog` |
| `routes/blog/[slug].tsx` | `/blog/:slug` |
| `routes/[...path].tsx` | Catch-all route |
| `routes/api/hello.ts` | `/api/hello` |

### 2. App Directory (Next.js style)

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/[slug]/page.tsx` | `/blog/:slug` |

### 3. Pages Directory (Legacy)

| File | Route |
|------|-------|
| `pages/index.tsx` | `/` |
| `pages/about.tsx` | `/about` |

### Dynamic Routes

```tsx
// routes/blog/[slug].tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

### Route Groups

Use parentheses to group routes without affecting the URL:

```
routes/
  (public)/
    home.tsx       # → /
    about.tsx      # → /about
  (dashboard)/
    settings.tsx   # → /settings
```

## 📐 Layouts

Create layouts in `app/layout.tsx` or within route directories:

```tsx
// app/layout.tsx
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="bg-background text-foreground">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## ⏳ Loading & Error States

```tsx
// routes/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// routes/error.tsx
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">Something went wrong</h1>
      <p className="text-gray-400 mt-4">{error.message}</p>
      <button onClick={reset} className="mt-8 px-6 py-3 bg-primary text-black rounded-lg">
        Try again
      </button>
    </div>
  );
}
```

## 🔄 Data Fetching

### Server-Side Rendering (SSR)

```jsx
export async function getServerSideProps({ params, req }) {
  const data = await fetchData(params.id);
  
  if (!data) {
    return { notFound: true };
  }
  
  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.title}</div>;
}
```

### Static Site Generation (SSG)

```jsx
// For dynamic routes
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: 'hello' } },
      { params: { slug: 'world' } }
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return { props: { post } };
}
```

## 🏝️ Islands Architecture

Islands allow partial hydration — only interactive components load JavaScript:

```jsx
'use island';

import { useState } from 'react';

// This component will be hydrated on the client
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

Static content around islands remains as pure HTML with zero JavaScript.

## 🖥️ React Server Components

Mark components to run only on the server:

```jsx
'use server';

// This component never ships to the client
export default async function ServerData() {
  const data = await db.query('SELECT * FROM users');
  return <UserList users={data} />;
}
```

Mark client components explicitly:

```jsx
'use client';

// This component will be hydrated
export default function InteractiveWidget() {
  // Client-side interactivity here
}
```

## 🔌 API Routes

```js
// pages/api/users.js

export function get(req, res) {
  res.json({ users: [] });
}

export function post(req, res) {
  const { name } = req.body;
  res.status(201).json({ id: 1, name });
}
```

## ⚡ Server Actions (v2.2+)

Call server functions directly from client components:

```tsx
// actions.ts
'use server';
import { serverAction, redirect, cookies } from '@flexireact/core';

export const createUser = serverAction(async (formData: FormData) => {
  const name = formData.get('name') as string;
  const user = await db.users.create({ name });
  
  // Set a cookie
  cookies.set('userId', user.id);
  
  // Redirect after action
  redirect('/users');
});

// Form.tsx
'use client';
import { createUser } from './actions';

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

## 🔗 Link with Prefetching (v2.1+)

Enhanced Link component with automatic prefetching:

```tsx
import { Link } from '@flexireact/core/client';

// Prefetch on hover (default)
<Link href="/about">About</Link>

// Prefetch when visible in viewport
<Link href="/products" prefetch="viewport">Products</Link>

// Replace history instead of push
<Link href="/login" replace>Login</Link>

// Programmatic navigation
import { useRouter } from '@flexireact/core/client';

function MyComponent() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  );
}
```

## 🛠️ Server Helpers (v2.1+)

Utility functions for server-side operations:

```tsx
import { redirect, notFound, json, cookies, headers } from '@flexireact/core';

// Redirect
redirect('/dashboard');
redirect('/login', 'permanent'); // 308 redirect

// Not Found
notFound(); // Throws 404

// JSON Response (in API routes)
return json({ data: 'hello' }, { status: 200 });

// Cookies
const token = cookies.get(request, 'token');
const setCookie = cookies.set('session', 'abc123', { 
  httpOnly: true, 
  maxAge: 86400 
});

// Headers
const auth = headers.bearerToken(request);
const corsHeaders = headers.cors({ origin: '*' });
const securityHeaders = headers.security();
```

## 🛡️ Middleware

### Global Middleware

Create `middleware.ts` in your project root:

```ts
import { redirect, cookies } from '@flexireact/core';

export default function middleware(request) {
  // Protect routes
  if (request.pathname.startsWith('/admin')) {
    const token = cookies.get(request, 'token');
    if (!token) {
      redirect('/login');
    }
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
};
```

### Route Middleware (v2.1+)

Create `_middleware.ts` in any route directory:

```
routes/
  admin/
    _middleware.ts   # Runs for all /admin/* routes
    dashboard.tsx
    settings.tsx
```

```ts
// routes/admin/_middleware.ts
export default async function middleware(req, res, { route, params }) {
  const user = await getUser(req);
  
  if (!user?.isAdmin) {
    return { redirect: '/login' };
  }
  
  // Continue to route
  return { user };
}
```

## 🔧 Configuration

Create `flexireact.config.js`:

```js
export default {
  server: {
    port: 3000,
    host: 'localhost'
  },
  
  build: {
    target: 'es2022',
    minify: true,
    sourcemap: true
  },
  
  islands: {
    enabled: true
  },
  
  rsc: {
    enabled: true
  },
  
  ssg: {
    enabled: false,
    paths: []
  },
  
  plugins: []
};
```

## 🧩 Plugins

Create `flexireact.plugin.js`:

```js
export default {
  name: 'my-plugin',
  
  onServerStart(server) {
    console.log('Server started!');
  },
  
  onBeforeRender(page, props) {
    return { ...props, injected: true };
  },
  
  onAfterRender(html) {
    return html.replace('</head>', '<script>...</script></head>');
  }
};
```

### Built-in Plugins

```js
import { builtinPlugins } from 'flexireact';

export default {
  plugins: [
    builtinPlugins.analytics({ trackingId: 'UA-XXX' }),
    builtinPlugins.pwa({ manifest: '/manifest.json' }),
    builtinPlugins.securityHeaders()
  ]
};
```

## 🖥️ CLI Commands

```bash
flexi create <name>      # Create new project
flexi dev                # Start dev server
flexi build              # Build for production
flexi build --analyze    # Build with bundle analysis
flexi start              # Start production server
flexi doctor             # Check project health
flexi --version          # Show version
flexi help               # Show help
```

### Bundle Analysis (v2.1+)

```bash
flexi build --analyze
```

Output:
```
📊 Bundle Analysis:

  ─────────────────────────────────────────────────
  File                                   Size
  ─────────────────────────────────────────────────
  client/main.js                         45.2 KB (13.56 KB gzip)
  client/vendor.js                       120.5 KB (38.2 KB gzip)
  server/pages.js                        12.3 KB
  ─────────────────────────────────────────────────
  Total:                                 178 KB
  Gzipped:                               51.76 KB
```

## 🌊 Streaming SSR (v2.2+)

Progressive HTML rendering with React 18:

```tsx
import { renderPageStream, streamToResponse } from '@flexireact/core';

// In your server handler
const { stream, shellReady } = await renderPageStream({
  Component: MyPage,
  props: { data },
  loading: LoadingSpinner,
  error: ErrorBoundary,
  title: 'My Page',
  styles: ['/styles.css']
});

// Wait for shell (initial HTML) to be ready
await shellReady;

// Stream to response
res.setHeader('Content-Type', 'text/html');
streamToResponse(res, stream);
```

Benefits:
- **Faster Time to First Byte (TTFB)** — Send HTML as it's ready
- **Progressive Loading** — Users see content immediately
- **Suspense Support** — Loading states stream in as data resolves
- **Better UX** — No blank screen while waiting for data

## 📚 Concepts Explained

### React Server Components (RSC)

RSC allows components to execute exclusively on the server:
- **Zero client JavaScript** for server components
- **Direct database/filesystem access** in components
- **Smaller bundles** — server code never ships to client
- **Better security** — sensitive logic stays on server

### Static Site Generation (SSG)

SSG pre-renders pages at build time:
- **Fastest possible loads** — pages are static HTML
- **CDN cacheable** — serve from edge locations
- **SEO friendly** — full HTML for crawlers
- **Incremental regeneration** — update without full rebuild

### Islands Architecture

Islands provide partial hydration:
- **Minimal JavaScript** — only interactive parts hydrate
- **Progressive enhancement** — works without JS
- **Better performance** — less code to parse/execute
- **Selective loading** — hydrate on visibility, interaction, etc.

---

## 📋 Requirements

- Node.js 18+
- React 18+

## 📦 Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@flexireact/core](https://www.npmjs.com/package/@flexireact/core) | ![npm](https://img.shields.io/npm/v/@flexireact/core?color=00FF9C) | Core framework |
| [@flexireact/flexi-ui](https://www.npmjs.com/package/@flexireact/flexi-ui) | ![npm](https://img.shields.io/npm/v/@flexireact/flexi-ui?color=00FF9C) | UI components |
| [create-flexireact](https://www.npmjs.com/package/create-flexireact) | ![npm](https://img.shields.io/npm/v/create-flexireact?color=00FF9C) | Project scaffolding |

## 🔗 Links

- [GitHub Repository](https://github.com/flexireact/flexireact)
- [FlexiUI Repository](https://github.com/flexireact/flexi-ui)
- [npm Package](https://www.npmjs.com/package/@flexireact/core)
- [Issues](https://github.com/flexireact/flexireact/issues)

## 🙏 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT © [FlexiReact Team](https://github.com/flexireact)

---

<p align="center">
  <b>Built with ❤️ by the FlexiReact Team</b>
</p>

<p align="center">
  <a href="https://github.com/flexireact/flexireact">⭐ Star us on GitHub</a>
</p>
