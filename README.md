<p align="center">
  <img src="./assets/logo.png" alt="FlexiReact Logo" width="400" />
</p>

<h1 align="center">FlexiReact</h1>

<p align="center">
  <strong>The Modern React Framework</strong>
</p>

<p align="center">
  A blazing-fast React framework with TypeScript, Tailwind CSS, SSR, SSG, Islands architecture, and file-based routing.<br/>
  Inspired by Next.js, Remix, Astro, and TanStack Start — but simpler and lighter.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/flexireact"><img src="https://img.shields.io/npm/v/flexireact.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript Ready" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg" alt="Tailwind CSS" /></a>
</p>

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
npx flexireact create myapp
cd myapp

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open http://localhost:3000

## 📁 Project Structure

```
myapp/
├── app/                       # App directory
│   ├── components/            # Reusable components
│   │   ├── Button.tsx         # Button component
│   │   ├── Card.tsx           # Card component
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── index.ts           # Component exports
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   └── layout.tsx             # Root layout
├── pages/                     # Routes (file-based)
│   ├── index.tsx              # → /
│   ├── about.tsx              # → /about
│   ├── blog/
│   │   ├── index.tsx          # → /blog
│   │   └── [slug].tsx         # → /blog/:slug
│   └── api/
│       └── hello.ts           # → /api/hello
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── flexireact.config.ts       # FlexiReact configuration
└── package.json
```

## 🛣️ Routing

### Page Routes

| File | Route |
|------|-------|
| `pages/index.jsx` | `/` |
| `pages/about.jsx` | `/about` |
| `pages/blog/[slug].jsx` | `/blog/:slug` |
| `pages/[...path].jsx` | Catch-all route |

### Dynamic Routes

```jsx
// pages/users/[id].jsx
export default function User({ params }) {
  return <h1>User: {params.id}</h1>;
}
```

### Route Groups

Use parentheses to group routes without affecting the URL:

```
pages/
  (marketing)/
    about.jsx      # → /about
    contact.jsx    # → /contact
  (app)/
    dashboard.jsx  # → /dashboard
```

## 📐 Layouts

Create persistent layouts in `layouts/`:

```jsx
// layouts/root.jsx
export default function RootLayout({ children }) {
  return (
    <div>
      <header>My App</header>
      <main>{children}</main>
      <footer>© 2024</footer>
    </div>
  );
}
```

## ⏳ Loading & Error States

```jsx
// pages/loading.jsx
export default function Loading() {
  return <div>Loading...</div>;
}

// pages/error.jsx
export default function Error({ error }) {
  return <div>Error: {error.message}</div>;
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

## 🎨 FlexiUI - Official UI Library

FlexiReact comes with an official UI component library: **@flexireact/flexi-ui**

```bash
npm install @flexireact/flexi-ui
```

### Features
- 🌙 **Dark-first design** with neon emerald accents
- ♿ **Fully accessible** (ARIA-compliant, Radix UI primitives)
- 🎯 **TypeScript native** with full type safety
- 🌳 **Tree-shakeable** — import only what you need
- ⚡ **SSR ready** — works with FlexiReact SSR

### Quick Setup

```js
// tailwind.config.js
const { flexiUIPlugin } = require('@flexireact/flexi-ui/tailwind');

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './node_modules/@flexireact/flexi-ui/dist/**/*.js',
  ],
  plugins: [flexiUIPlugin],
};
```

### Usage

```jsx
import { Button, Card, Badge, Input } from '@flexireact/flexi-ui';

export default function MyPage() {
  return (
    <Card>
      <Badge variant="success">New</Badge>
      <h2>Welcome!</h2>
      <Input placeholder="Enter your email" />
      <Button>Get Started</Button>
    </Card>
  );
}
```

### Available Components
- **Core**: Button, Input, Textarea, Checkbox, Switch, Select
- **Display**: Card, Badge, Avatar, Tooltip
- **Feedback**: Alert, Toast, Spinner, Skeleton, Progress
- **Overlay**: Modal, Drawer, Dropdown
- **Layout**: Separator, Tabs

📖 [FlexiUI Documentation](https://github.com/flexireact/flexi-ui)

---

## 📋 Requirements

- Node.js 18+
- React 18+

## 📄 License

MIT

