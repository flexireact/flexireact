# FlexiReact Roadmap

> **Version actuelle:** 1.0.0  
> **Dernière mise à jour:** Décembre 2025

---

## Fonctionnalités Actuelles

### Core Framework

| Fonctionnalité | Status | Description |
|----------------|--------|-------------|
| **SSR (Server-Side Rendering)** | ✅ Stable | Rendu côté serveur pour un SEO optimal et un premier affichage rapide |
| **SSG (Static Site Generation)** | ✅ Stable | Génération de pages statiques au build |
| **File-based Routing** | ✅ Stable | Routage automatique basé sur le système de fichiers (`pages/`) |
| **API Routes** | ✅ Stable | Endpoints REST dans `pages/api/` avec support GET, POST, PUT, DELETE |
| **Dynamic Routes** | ✅ Stable | Routes dynamiques avec `[param].tsx` et `[...slug].tsx` |
| **Layouts** | ✅ Stable | Système de layouts imbriqués dans `layouts/` |
| **TypeScript** | ✅ Stable | Support natif TypeScript sans configuration |
| **Hot Reload** | ✅ Stable | Rechargement automatique en développement |
| **Islands Architecture** | ✅ Stable | Hydratation partielle pour de meilleures performances |
| **React Server Components** | ⚡ Beta | Support RSC pour réduire le JavaScript client |

### CLI & Tooling

| Fonctionnalité | Status | Description |
|----------------|--------|-------------|
| **create-flexireact** | ✅ Stable | CLI pour créer des projets avec templates |
| **flexireact dev** | ✅ Stable | Serveur de développement avec HMR |
| **flexireact build** | ✅ Stable | Build de production optimisé |
| **flexireact start** | ✅ Stable | Serveur de production |
| **Plugin System** | ✅ Stable | Architecture extensible via plugins |

### Templates

| Template | Description |
|----------|-------------|
| **Default** | Template premium avec UI moderne, animations et dark mode |
| **Flexi UI** | Showcase avec composants @flexireact/flexi-ui |
| **Minimal** | Setup minimal pour démarrer de zéro |

### Flexi UI (Bibliothèque de composants)

| Composant | Status |
|-----------|--------|
| Button | ✅ |
| Card | ✅ |
| Badge | ✅ |
| Input | ✅ |
| ThemeProvider | ✅ |

---

## Roadmap v1.1 - Performance & DX

### Priorité Haute

#### 1. Hydratation Client Améliorée
```
Status: 🔴 À faire
Priority: P0
```
- [ ] Support complet des hooks React côté client (useState, useEffect, etc.)
- [ ] Hydratation sélective par composant
- [ ] Mode "use client" directive comme Next.js
- [ ] Réduire le TTFB (Time To First Byte)

#### 2. Build System Optimisé
```
Status: 🔴 À faire
Priority: P0
```
- [ ] Migration vers esbuild/swc pour des builds 10x plus rapides
- [ ] Tree-shaking agressif
- [ ] Code splitting automatique
- [ ] Bundle analysis intégré
- [ ] Minification avancée (terser → esbuild)

#### 3. Caching Intelligent
```
Status: 🔴 À faire
Priority: P1
```
- [ ] Cache des modules compilés
- [ ] Incremental builds
- [ ] Cache HTTP headers automatiques
- [ ] ISR (Incremental Static Regeneration)

---

## Roadmap v1.2 - Compatibilité Déploiement

### Adaptateurs de Déploiement

#### Vercel
```
Status: 🔴 À faire
Priority: P0
```
- [ ] `@flexireact/adapter-vercel`
- [ ] Support Vercel Functions
- [ ] Edge Functions support
- [ ] Automatic `vercel.json` generation
- [ ] Preview deployments
- [ ] Analytics integration

**Configuration cible:**
```js
// flexireact.config.js
export default {
  adapter: 'vercel',
  edge: true, // Use Edge Runtime
  regions: ['iad1', 'cdg1']
}
```

#### Netlify
```
Status: 🔴 À faire
Priority: P1
```
- [ ] `@flexireact/adapter-netlify`
- [ ] Netlify Functions support
- [ ] Edge Functions support
- [ ] Automatic `netlify.toml` generation
- [ ] Forms integration

#### Cloudflare Pages/Workers
```
Status: 🔴 À faire
Priority: P1
```
- [ ] `@flexireact/adapter-cloudflare`
- [ ] Workers support
- [ ] D1 Database integration
- [ ] KV Storage integration
- [ ] R2 Storage integration

#### AWS
```
Status: 🔴 À faire
Priority: P2
```
- [ ] `@flexireact/adapter-aws`
- [ ] Lambda support
- [ ] Lambda@Edge support
- [ ] S3 + CloudFront deployment
- [ ] DynamoDB integration

#### Docker / Self-hosted
```
Status: 🟡 Partiel
Priority: P1
```
- [ ] Dockerfile optimisé
- [ ] Multi-stage builds
- [ ] Alpine image support
- [ ] docker-compose template
- [ ] Health check endpoints

---

## Roadmap v1.3 - Deno Support

### Deno Runtime
```
Status: 🔴 À faire
Priority: P1
```

#### Phase 1: Compatibilité de base
- [ ] Remplacer les imports Node.js par des imports universels
- [ ] Support `deno.json` / `import_map.json`
- [ ] Polyfills pour APIs Node.js manquantes
- [ ] Tests sur Deno Deploy

#### Phase 2: Deno-first features
- [ ] Support natif TypeScript (sans transpilation)
- [ ] Fresh-like islands architecture
- [ ] Deno KV integration
- [ ] Deno Deploy adapter

**Structure cible:**
```
flexireact-app/
├── deno.json
├── import_map.json
├── main.ts          # Entry point Deno
├── pages/
└── components/
```

**Configuration Deno:**
```json
// deno.json
{
  "tasks": {
    "dev": "deno run -A --watch main.ts",
    "build": "deno run -A build.ts",
    "start": "deno run -A dist/server.ts"
  },
  "imports": {
    "@flexireact/core": "https://deno.land/x/flexireact@1.3.0/mod.ts",
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0"
  }
}
```

---

## Roadmap v1.4 - Features Avancées

### Data Fetching
```
Status: 🟡 Partiel
Priority: P1
```
- [ ] `getServerSideProps` amélioré
- [ ] `getStaticProps` avec revalidation
- [ ] `getStaticPaths` pour SSG dynamique
- [ ] React Query / SWR integration
- [ ] Streaming SSR

### Middleware
```
Status: 🔴 À faire
Priority: P1
```
- [ ] Middleware global (`middleware.ts`)
- [ ] Middleware par route
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] CORS configuration

### Internationalization (i18n)
```
Status: 🔴 À faire
Priority: P2
```
- [ ] Routing i18n (`/fr/about`, `/en/about`)
- [ ] Détection automatique de la langue
- [ ] Fichiers de traduction JSON
- [ ] Composant `<Trans>`

### Image Optimization
```
Status: 🔴 À faire
Priority: P2
```
- [ ] Composant `<Image>` optimisé
- [ ] Lazy loading automatique
- [ ] Formats modernes (WebP, AVIF)
- [ ] Responsive images
- [ ] Blur placeholder

### SEO & Meta
```
Status: 🟡 Partiel
Priority: P1
```
- [ ] Composant `<Head>` amélioré
- [ ] Open Graph automatique
- [ ] JSON-LD structured data
- [ ] Sitemap generation
- [ ] robots.txt generation

---

## Roadmap v2.0 - Architecture Majeure

### React 19 Support
```
Status: 🔴 À faire
Priority: P0 (Q2 2025)
```
- [ ] Server Actions
- [ ] Form Actions
- [ ] useOptimistic
- [ ] useFormStatus
- [ ] Asset loading

### Edge-first Architecture
```
Status: 🔴 À faire
Priority: P1
```
- [ ] Edge SSR par défaut
- [ ] Streaming responses
- [ ] Partial prerendering
- [ ] Smart caching strategies

### Developer Experience
```
Status: 🔴 À faire
Priority: P1
```
- [ ] Error overlay amélioré
- [ ] DevTools extension
- [ ] Performance profiler
- [ ] Bundle visualizer intégré
- [ ] AI-powered error suggestions

---

## Benchmarks Cibles

### Build Performance
| Métrique | Actuel | Cible v1.2 | Cible v2.0 |
|----------|--------|------------|------------|
| Cold build (100 pages) | ~30s | <10s | <5s |
| Hot reload | ~500ms | <100ms | <50ms |
| Bundle size (minimal) | ~80KB | <50KB | <30KB |

### Runtime Performance
| Métrique | Actuel | Cible v1.2 | Cible v2.0 |
|----------|--------|------------|------------|
| TTFB | ~200ms | <100ms | <50ms |
| FCP | ~1.5s | <1s | <0.5s |
| LCP | ~2.5s | <1.5s | <1s |
| TTI | ~3s | <2s | <1s |

### Lighthouse Score Cible
| Catégorie | Cible |
|-----------|-------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## Contribution

### Comment contribuer

1. **Fork** le repository
2. **Clone** votre fork
3. **Créez** une branche feature (`git checkout -b feature/amazing-feature`)
4. **Committez** vos changements (`git commit -m 'Add amazing feature'`)
5. **Push** sur la branche (`git push origin feature/amazing-feature`)
6. **Ouvrez** une Pull Request

### Priorités de contribution

| Priorité | Domaine | Difficulté |
|----------|---------|------------|
| 🔴 Haute | Hydratation client | Difficile |
| 🔴 Haute | Adapter Vercel | Moyenne |
| 🟡 Moyenne | Adapter Netlify | Moyenne |
| 🟡 Moyenne | Support Deno | Difficile |
| 🟢 Basse | Documentation | Facile |
| 🟢 Basse | Tests | Moyenne |

### Structure du projet

```
flexireact/
├── core/                 # @flexireact/core - Framework principal
│   ├── server/          # Serveur HTTP et SSR
│   ├── router/          # Système de routage
│   ├── build/           # Build system
│   └── cli/             # Commandes CLI
├── packages/
│   ├── create-flexireact/  # CLI de création de projet
│   └── flexi-ui/           # Bibliothèque de composants
├── examples/            # Exemples d'applications
└── docs/               # Documentation
```

---

## Changelog

### v1.0.0 (Décembre 2025)
- 🎉 Release initiale
- ✅ SSR/SSG support
- ✅ File-based routing
- ✅ API routes
- ✅ TypeScript support
- ✅ Islands architecture
- ✅ Plugin system
- ✅ create-flexireact CLI
- ✅ Flexi UI components

---

## Liens

- **GitHub:** https://github.com/aspect-music/flexireact
- **npm:** https://www.npmjs.com/package/@flexireact/core
- **Documentation:** https://flexireact.dev (à venir)
- **Discord:** (à venir)

---

*Ce document est mis à jour régulièrement. Dernière révision: Décembre 2025*
