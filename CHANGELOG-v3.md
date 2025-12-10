# FlexiReact v3.0 - Changelog

## 🎉 Nouveautés v3.0

### ✅ Corrections Templates

#### Problème Tailwind CSS Résolu
- **Avant**: `@import "tailwindcss" source("..")` causait une erreur `Can't resolve 'tailwindcss'`
- **Après**: `@import "tailwindcss"` fonctionne correctement
- **Script CSS**: Changé de `npx @tailwindcss/cli` vers `tailwindcss` pour une meilleure compatibilité

#### Fichiers Modifiés
- `packages/create-flexireact/src/templates/default.ts`
- `packages/create-flexireact/src/templates/app-router.ts`

### 📝 Mise à Jour des Templates

Tous les templates ont été mis à jour pour refléter FlexiReact v3:
- ✅ Références v2 → v3 dans les commentaires
- ✅ Métadonnées mises à jour (titres, descriptions)
- ✅ Footer mis à jour avec "FlexiReact v3"
- ✅ Description enrichie avec "Edge Runtime" et "50+ UI components"

### 📚 Documentation Interactive Complétée

Nouvelles pages de documentation ajoutées dans `/docs`:

#### 1. **routing.html** - File-Based Routing
- App Router (recommandé)
- Routes Directory (alternative)
- Dynamic Routes avec `[slug]`
- Route Groups avec `(folder)`
- API Routes
- Navigation (Link, useRouter)
- Catch-all routes

#### 2. **layouts.html** - Layouts & Templates
- Root Layout (obligatoire)
- Nested Layouts
- Templates vs Layouts
- Metadata (statique et dynamique)
- Loading States avec `loading.tsx`
- Error Handling avec `error.tsx`
- Not Found pages avec `not-found.tsx`

#### 3. **data-fetching.html** - Data Fetching
- Server Components (par défaut)
- Caching & Revalidation (ISR)
- Parallel & Sequential Fetching
- Client Components avec hooks
- SWR & React Query
- Streaming avec Suspense
- Best Practices

#### 4. **server-actions.html** - Server Actions
- Introduction aux Server Actions
- Usage avec Forms
- Client Components (useFormState, useFormStatus)
- Validation avec Zod
- Cache Revalidation (revalidatePath, revalidateTag)
- Redirects
- Error Handling
- Authentication
- Best Practices

### 🔗 Navigation Améliorée

La page principale `index.html` a été mise à jour avec des liens vers toutes les nouvelles pages de documentation dans la sidebar.

## 🚀 Comment Utiliser

### Créer une Nouvelle App
```bash
npx create-flexireact my-app
cd my-app
npm install
npm run dev
```

### Templates Disponibles
```bash
# App Router (recommandé) - Landing page moderne
npx create-flexireact my-app --template app-router

# Default - Setup complet avec routes directory
npx create-flexireact my-app --template default

# Minimal - Setup minimal
npx create-flexireact my-app --template minimal
```

## 📖 Documentation

Ouvrez `docs/index.html` dans votre navigateur pour accéder à la documentation interactive complète.

### Pages Disponibles
- **index.html** - Page principale avec overview
- **routing.html** - Guide complet du routing
- **layouts.html** - Layouts, templates, et error handling
- **data-fetching.html** - Patterns de data fetching
- **server-actions.html** - Server Actions et mutations

## 🐛 Bugs Corrigés

### Erreur Tailwind CSS
**Problème**: Lors de la création d'une app et du démarrage du serveur, l'erreur suivante apparaissait:
```
≈ tailwindcss v4.1.17 Error: Can't resolve 'tailwindcss' in 'C:\Users\hp\Documents\projet-flexi-react\my-app\app\styles'
```

**Cause**: La directive `@import "tailwindcss" source("..")` n'était pas compatible avec le CLI Tailwind v4.

**Solution**: 
1. Suppression du paramètre `source("..")`
2. Mise à jour du script CSS pour utiliser `tailwindcss` directement au lieu de `npx @tailwindcss/cli`

## 🎨 Améliorations CSS

Les warnings CSS concernant `background-clip` dans les fichiers de documentation ont été notés. Ces warnings sont mineurs et n'affectent pas la fonctionnalité (le préfixe `-webkit-background-clip` est déjà présent pour la compatibilité).

## 📦 Build

Les templates ont été recompilés avec succès:
```bash
cd packages/create-flexireact
npm run build
```

## ✨ Prochaines Étapes

Pour utiliser les nouveaux templates:
1. Les templates sont maintenant corrigés et compilés
2. La documentation est complète avec 4 nouvelles pages détaillées
3. Tous les exemples utilisent les bonnes pratiques FlexiReact v3

---

**Version**: 3.0.1  
**Date**: Décembre 2024  
**Status**: ✅ Production Ready
