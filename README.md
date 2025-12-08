<p align="center">
  <img src="./assets/flexireact.webp" alt="FlexiReact Logo" width="400" />
</p>

<h1 align="center">FlexiReact v2</h1>

<p align="center">
  <strong>The Modern React Framework</strong>
</p>

<p align="center">
  A blazing-fast React framework with TypeScript, Tailwind CSS v4, SSR, SSG, Islands architecture, and file-based routing.<br/>
  Inspired by Next.js, Remix, Astro, and TanStack Start — but simpler and lighter.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flexireact/core"><img src="https://img.shields.io/npm/v/@flexireact/core.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Native-blue.svg" alt="TypeScript Native" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind-v4-38B2AC.svg" alt="Tailwind CSS v4" /></a>
</p>

## 🆕 What's New in v2

- **TypeScript Native** — Core rewritten in TypeScript for better DX
- **Tailwind CSS v4** — New `@import "tailwindcss"` and `@theme` syntax
- **Routes Directory** — New `routes/` directory with route groups, dynamic segments
- **Modern 404 Page** — Beautiful, interactive error pages
- **Enhanced DevTools** — Precise error messages with color-coded render times
- **Improved CLI** — TypeScript-based CLI with better templates

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

| | FlexiReact | Next.js | Remix | Astro |
|---|:---:|:---:|:---:|:---:|
| **Zero Config** | ✅ | ⚠️ | ⚠️ | ✅ |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ |
| **Islands Architecture** | ✅ | ❌ | ❌ | ✅ |
| **File Routing** | ✅ | ✅ | ✅ | ✅ |
| **API Routes** | ✅ | ✅ | ✅ | ⚠️ |
| **Server Components** | ✅ | ✅ | ❌ | ✅ |
| **Bundle Size** | 🟢 Tiny | 🟡 Medium | 🟡 Medium | 🟢 Tiny |
| **Build Speed** | 🟢 <1s | 🟡 ~5s | 🟡 ~3s | 🟢 <2s |
| **Learning Curve** | 🟢 Easy | 🟡 Medium | 🟡 Medium | 🟢 Easy |
| **Plugin System** | ✅ | ⚠️ | ❌ | ✅ |

### 💡 Perfect For

- **Startups** — Ship fast with zero configuration
- **Enterprises** — Scale with TypeScript, security, and performance
- **Developers** — Enjoy excellent DX with hot reload and error overlays
- **Agencies** — Reuse templates and plugins across projects

---

## 🚀 Quick Start

```bash
# Create a new project
npx create-flexireact@latest my-app
cd my-app
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open http://localhost:3000

## 📁 Project Structure (v2)

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

## 🛡️ Middleware

Create `middleware.js` in your project root:

```js
export default function middleware(request) {
  // Protect routes
  if (request.pathname.startsWith('/admin')) {
    if (!request.cookie('token')) {
      return MiddlewareResponse.redirect('/login');
    }
  }
  
  // Continue
  return MiddlewareResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
};
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
flexi create <name>   # Create new project
flexi dev             # Start dev server
flexi build           # Build for production
flexi start           # Start production server
flexi doctor          # Check project health
flexi --version       # Show version
flexi help            # Show help
```

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

## 🔗 Links

- [GitHub Repository](https://github.com/flexireact/flexireact)
- [npm Package](https://www.npmjs.com/package/@flexireact/core)
- [Issues](https://github.com/flexireact/flexireact/issues)

## 📄 License

MIT © [FlexiReact Team](https://github.com/flexireact)

