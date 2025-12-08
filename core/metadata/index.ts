/**
 * FlexiReact Metadata API
 * 
 * Complete metadata management like Next.js:
 * - Static and dynamic metadata
 * - Open Graph / Twitter Cards
 * - Robots / Sitemap
 * - JSON-LD structured data
 * - Viewport configuration
 * - Icons and manifest
 */

import React from 'react';

// Base metadata types
export interface Metadata {
  // Basic
  title?: string | { default: string; template?: string; absolute?: string };
  description?: string;
  keywords?: string | string[];
  authors?: Author | Author[];
  creator?: string;
  publisher?: string;
  
  // Robots
  robots?: Robots | string;
  
  // Icons
  icons?: Icons;
  
  // Manifest
  manifest?: string;
  
  // Open Graph
  openGraph?: OpenGraph;
  
  // Twitter
  twitter?: Twitter;
  
  // Verification
  verification?: Verification;
  
  // Alternates
  alternates?: Alternates;
  
  // App Links
  appLinks?: AppLinks;
  
  // Archives
  archives?: string | string[];
  
  // Assets
  assets?: string | string[];
  
  // Bookmarks
  bookmarks?: string | string[];
  
  // Category
  category?: string;
  
  // Classification
  classification?: string;
  
  // Other
  other?: Record<string, string | string[]>;
  
  // Viewport
  viewport?: Viewport | string;
  
  // Theme Color
  themeColor?: ThemeColor | ThemeColor[];
  
  // Color Scheme
  colorScheme?: 'normal' | 'light' | 'dark' | 'light dark' | 'dark light';
  
  // Format Detection
  formatDetection?: FormatDetection;
  
  // Base URL
  metadataBase?: URL | string;
  
  // Generator
  generator?: string;
  
  // Application Name
  applicationName?: string;
  
  // Referrer
  referrer?: 'no-referrer' | 'origin' | 'no-referrer-when-downgrade' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}

export interface Author {
  name?: string;
  url?: string;
}

export interface Robots {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
  googleBot?: Robots | string;
}

export interface Icons {
  icon?: IconDescriptor | IconDescriptor[];
  shortcut?: IconDescriptor | IconDescriptor[];
  apple?: IconDescriptor | IconDescriptor[];
  other?: IconDescriptor[];
}

export interface IconDescriptor {
  url: string;
  type?: string;
  sizes?: string;
  color?: string;
  rel?: string;
  media?: string;
}

export interface OpenGraph {
  type?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  url?: string;
  title?: string;
  description?: string;
  siteName?: string;
  locale?: string;
  images?: OGImage | OGImage[];
  videos?: OGVideo | OGVideo[];
  audio?: OGAudio | OGAudio[];
  determiner?: 'a' | 'an' | 'the' | 'auto' | '';
  
  // Article specific
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string | string[];
  section?: string;
  tags?: string[];
}

export interface OGImage {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface OGVideo {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
}

export interface OGAudio {
  url: string;
  secureUrl?: string;
  type?: string;
}

export interface Twitter {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  siteId?: string;
  creator?: string;
  creatorId?: string;
  title?: string;
  description?: string;
  images?: string | TwitterImage | (string | TwitterImage)[];
  app?: TwitterApp;
  player?: TwitterPlayer;
}

export interface TwitterImage {
  url: string;
  alt?: string;
}

export interface TwitterApp {
  id?: { iphone?: string; ipad?: string; googleplay?: string };
  name?: string;
  url?: { iphone?: string; ipad?: string; googleplay?: string };
}

export interface TwitterPlayer {
  url: string;
  width?: number;
  height?: number;
  stream?: string;
}

export interface Verification {
  google?: string | string[];
  yahoo?: string | string[];
  yandex?: string | string[];
  me?: string | string[];
  other?: Record<string, string | string[]>;
}

export interface Alternates {
  canonical?: string;
  languages?: Record<string, string>;
  media?: Record<string, string>;
  types?: Record<string, string>;
}

export interface AppLinks {
  ios?: AppLink | AppLink[];
  iphone?: AppLink | AppLink[];
  ipad?: AppLink | AppLink[];
  android?: AppLink | AppLink[];
  windows_phone?: AppLink | AppLink[];
  windows?: AppLink | AppLink[];
  windows_universal?: AppLink | AppLink[];
  web?: AppLink | AppLink[];
}

export interface AppLink {
  url: string;
  app_store_id?: string;
  app_name?: string;
}

export interface Viewport {
  width?: number | 'device-width';
  height?: number | 'device-height';
  initialScale?: number;
  minimumScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
  viewportFit?: 'auto' | 'cover' | 'contain';
  interactiveWidget?: 'resizes-visual' | 'resizes-content' | 'overlays-content';
}

export interface ThemeColor {
  color: string;
  media?: string;
}

export interface FormatDetection {
  telephone?: boolean;
  date?: boolean;
  address?: boolean;
  email?: boolean;
  url?: boolean;
}

// Generate HTML head tags from metadata
export function generateMetadataTags(metadata: Metadata, baseUrl?: string): string {
  const tags: string[] = [];
  const base = baseUrl || metadata.metadataBase?.toString() || '';

  // Title
  if (metadata.title) {
    const title = typeof metadata.title === 'string' 
      ? metadata.title 
      : metadata.title.absolute || (metadata.title.template 
        ? metadata.title.template.replace('%s', metadata.title.default)
        : metadata.title.default);
    tags.push(`<title>${escapeHtml(title)}</title>`);
  }

  // Description
  if (metadata.description) {
    tags.push(`<meta name="description" content="${escapeHtml(metadata.description)}">`);
  }

  // Keywords
  if (metadata.keywords) {
    const keywords = Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords;
    tags.push(`<meta name="keywords" content="${escapeHtml(keywords)}">`);
  }

  // Authors
  if (metadata.authors) {
    const authors = Array.isArray(metadata.authors) ? metadata.authors : [metadata.authors];
    authors.forEach(author => {
      if (author.name) tags.push(`<meta name="author" content="${escapeHtml(author.name)}">`);
      if (author.url) tags.push(`<link rel="author" href="${author.url}">`);
    });
  }

  // Generator
  if (metadata.generator) {
    tags.push(`<meta name="generator" content="${escapeHtml(metadata.generator)}">`);
  }

  // Application Name
  if (metadata.applicationName) {
    tags.push(`<meta name="application-name" content="${escapeHtml(metadata.applicationName)}">`);
  }

  // Referrer
  if (metadata.referrer) {
    tags.push(`<meta name="referrer" content="${metadata.referrer}">`);
  }

  // Robots
  if (metadata.robots) {
    if (typeof metadata.robots === 'string') {
      tags.push(`<meta name="robots" content="${metadata.robots}">`);
    } else {
      const robotsContent = generateRobotsContent(metadata.robots);
      tags.push(`<meta name="robots" content="${robotsContent}">`);
      if (metadata.robots.googleBot) {
        const googleBotContent = typeof metadata.robots.googleBot === 'string'
          ? metadata.robots.googleBot
          : generateRobotsContent(metadata.robots.googleBot);
        tags.push(`<meta name="googlebot" content="${googleBotContent}">`);
      }
    }
  }

  // Viewport
  if (metadata.viewport) {
    const viewportContent = typeof metadata.viewport === 'string'
      ? metadata.viewport
      : generateViewportContent(metadata.viewport);
    tags.push(`<meta name="viewport" content="${viewportContent}">`);
  }

  // Theme Color
  if (metadata.themeColor) {
    const themeColors = Array.isArray(metadata.themeColor) ? metadata.themeColor : [metadata.themeColor];
    themeColors.forEach(tc => {
      if (typeof tc === 'string') {
        tags.push(`<meta name="theme-color" content="${tc}">`);
      } else {
        const mediaAttr = tc.media ? ` media="${tc.media}"` : '';
        tags.push(`<meta name="theme-color" content="${tc.color}"${mediaAttr}>`);
      }
    });
  }

  // Color Scheme
  if (metadata.colorScheme) {
    tags.push(`<meta name="color-scheme" content="${metadata.colorScheme}">`);
  }

  // Format Detection
  if (metadata.formatDetection) {
    const fd = metadata.formatDetection;
    const parts: string[] = [];
    if (fd.telephone === false) parts.push('telephone=no');
    if (fd.date === false) parts.push('date=no');
    if (fd.address === false) parts.push('address=no');
    if (fd.email === false) parts.push('email=no');
    if (parts.length > 0) {
      tags.push(`<meta name="format-detection" content="${parts.join(', ')}">`);
    }
  }

  // Icons
  if (metadata.icons) {
    const addIcon = (icon: IconDescriptor, defaultRel: string) => {
      const rel = icon.rel || defaultRel;
      const type = icon.type ? ` type="${icon.type}"` : '';
      const sizes = icon.sizes ? ` sizes="${icon.sizes}"` : '';
      const color = icon.color ? ` color="${icon.color}"` : '';
      const media = icon.media ? ` media="${icon.media}"` : '';
      tags.push(`<link rel="${rel}" href="${resolveUrl(icon.url, base)}"${type}${sizes}${color}${media}>`);
    };

    if (metadata.icons.icon) {
      const icons = Array.isArray(metadata.icons.icon) ? metadata.icons.icon : [metadata.icons.icon];
      icons.forEach(icon => addIcon(icon, 'icon'));
    }
    if (metadata.icons.shortcut) {
      const icons = Array.isArray(metadata.icons.shortcut) ? metadata.icons.shortcut : [metadata.icons.shortcut];
      icons.forEach(icon => addIcon(icon, 'shortcut icon'));
    }
    if (metadata.icons.apple) {
      const icons = Array.isArray(metadata.icons.apple) ? metadata.icons.apple : [metadata.icons.apple];
      icons.forEach(icon => addIcon(icon, 'apple-touch-icon'));
    }
  }

  // Manifest
  if (metadata.manifest) {
    tags.push(`<link rel="manifest" href="${resolveUrl(metadata.manifest, base)}">`);
  }

  // Open Graph
  if (metadata.openGraph) {
    const og = metadata.openGraph;
    if (og.type) tags.push(`<meta property="og:type" content="${og.type}">`);
    if (og.title) tags.push(`<meta property="og:title" content="${escapeHtml(og.title)}">`);
    if (og.description) tags.push(`<meta property="og:description" content="${escapeHtml(og.description)}">`);
    if (og.url) tags.push(`<meta property="og:url" content="${resolveUrl(og.url, base)}">`);
    if (og.siteName) tags.push(`<meta property="og:site_name" content="${escapeHtml(og.siteName)}">`);
    if (og.locale) tags.push(`<meta property="og:locale" content="${og.locale}">`);
    if (og.determiner) tags.push(`<meta property="og:determiner" content="${og.determiner}">`);

    // Images
    if (og.images) {
      const images = Array.isArray(og.images) ? og.images : [og.images];
      images.forEach(img => {
        tags.push(`<meta property="og:image" content="${resolveUrl(img.url, base)}">`);
        if (img.secureUrl) tags.push(`<meta property="og:image:secure_url" content="${img.secureUrl}">`);
        if (img.type) tags.push(`<meta property="og:image:type" content="${img.type}">`);
        if (img.width) tags.push(`<meta property="og:image:width" content="${img.width}">`);
        if (img.height) tags.push(`<meta property="og:image:height" content="${img.height}">`);
        if (img.alt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(img.alt)}">`);
      });
    }

    // Article specific
    if (og.type === 'article') {
      if (og.publishedTime) tags.push(`<meta property="article:published_time" content="${og.publishedTime}">`);
      if (og.modifiedTime) tags.push(`<meta property="article:modified_time" content="${og.modifiedTime}">`);
      if (og.expirationTime) tags.push(`<meta property="article:expiration_time" content="${og.expirationTime}">`);
      if (og.section) tags.push(`<meta property="article:section" content="${escapeHtml(og.section)}">`);
      if (og.tags) {
        og.tags.forEach(tag => tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}">`));
      }
      if (og.authors) {
        const authors = Array.isArray(og.authors) ? og.authors : [og.authors];
        authors.forEach(author => tags.push(`<meta property="article:author" content="${escapeHtml(author)}">`));
      }
    }
  }

  // Twitter
  if (metadata.twitter) {
    const tw = metadata.twitter;
    if (tw.card) tags.push(`<meta name="twitter:card" content="${tw.card}">`);
    if (tw.site) tags.push(`<meta name="twitter:site" content="${tw.site}">`);
    if (tw.siteId) tags.push(`<meta name="twitter:site:id" content="${tw.siteId}">`);
    if (tw.creator) tags.push(`<meta name="twitter:creator" content="${tw.creator}">`);
    if (tw.creatorId) tags.push(`<meta name="twitter:creator:id" content="${tw.creatorId}">`);
    if (tw.title) tags.push(`<meta name="twitter:title" content="${escapeHtml(tw.title)}">`);
    if (tw.description) tags.push(`<meta name="twitter:description" content="${escapeHtml(tw.description)}">`);

    if (tw.images) {
      const images = Array.isArray(tw.images) ? tw.images : [tw.images];
      images.forEach(img => {
        const url = typeof img === 'string' ? img : img.url;
        tags.push(`<meta name="twitter:image" content="${resolveUrl(url, base)}">`);
        if (typeof img !== 'string' && img.alt) {
          tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(img.alt)}">`);
        }
      });
    }
  }

  // Verification
  if (metadata.verification) {
    const v = metadata.verification;
    if (v.google) {
      const values = Array.isArray(v.google) ? v.google : [v.google];
      values.forEach(val => tags.push(`<meta name="google-site-verification" content="${val}">`));
    }
    if (v.yandex) {
      const values = Array.isArray(v.yandex) ? v.yandex : [v.yandex];
      values.forEach(val => tags.push(`<meta name="yandex-verification" content="${val}">`));
    }
  }

  // Alternates
  if (metadata.alternates) {
    const alt = metadata.alternates;
    if (alt.canonical) {
      tags.push(`<link rel="canonical" href="${resolveUrl(alt.canonical, base)}">`);
    }
    if (alt.languages) {
      Object.entries(alt.languages).forEach(([lang, url]) => {
        tags.push(`<link rel="alternate" hreflang="${lang}" href="${resolveUrl(url, base)}">`);
      });
    }
  }

  return tags.join('\n    ');
}

// Helper functions
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resolveUrl(url: string, base: string): string {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return base ? `${base.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` : url;
}

function generateRobotsContent(robots: Robots): string {
  const parts: string[] = [];
  if (robots.index !== undefined) parts.push(robots.index ? 'index' : 'noindex');
  if (robots.follow !== undefined) parts.push(robots.follow ? 'follow' : 'nofollow');
  if (robots.noarchive) parts.push('noarchive');
  if (robots.nosnippet) parts.push('nosnippet');
  if (robots.noimageindex) parts.push('noimageindex');
  if (robots.nocache) parts.push('nocache');
  return parts.join(', ') || 'index, follow';
}

function generateViewportContent(viewport: Viewport): string {
  const parts: string[] = [];
  if (viewport.width) parts.push(`width=${viewport.width}`);
  if (viewport.height) parts.push(`height=${viewport.height}`);
  if (viewport.initialScale !== undefined) parts.push(`initial-scale=${viewport.initialScale}`);
  if (viewport.minimumScale !== undefined) parts.push(`minimum-scale=${viewport.minimumScale}`);
  if (viewport.maximumScale !== undefined) parts.push(`maximum-scale=${viewport.maximumScale}`);
  if (viewport.userScalable !== undefined) parts.push(`user-scalable=${viewport.userScalable ? 'yes' : 'no'}`);
  if (viewport.viewportFit) parts.push(`viewport-fit=${viewport.viewportFit}`);
  return parts.join(', ') || 'width=device-width, initial-scale=1';
}

// Merge metadata (child overrides parent)
export function mergeMetadata(parent: Metadata, child: Metadata): Metadata {
  return {
    ...parent,
    ...child,
    // Deep merge for nested objects
    openGraph: child.openGraph ? { ...parent.openGraph, ...child.openGraph } : parent.openGraph,
    twitter: child.twitter ? { ...parent.twitter, ...child.twitter } : parent.twitter,
    icons: child.icons ? { ...parent.icons, ...child.icons } : parent.icons,
    verification: child.verification ? { ...parent.verification, ...child.verification } : parent.verification,
    alternates: child.alternates ? { ...parent.alternates, ...child.alternates } : parent.alternates
  };
}

// Generate JSON-LD structured data
export function generateJsonLd(data: Record<string, any>): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// Common JSON-LD schemas
export const jsonLd = {
  website: (config: { name: string; url: string; description?: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    description: config.description
  }),
  
  article: (config: {
    headline: string;
    description?: string;
    image?: string | string[];
    datePublished: string;
    dateModified?: string;
    author: { name: string; url?: string } | { name: string; url?: string }[];
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: Array.isArray(config.author)
      ? config.author.map(a => ({ '@type': 'Person', ...a }))
      : { '@type': 'Person', ...config.author }
  }),
  
  organization: (config: {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: config.logo,
    sameAs: config.sameAs
  }),
  
  product: (config: {
    name: string;
    description?: string;
    image?: string | string[];
    brand?: string;
    offers?: { price: number; priceCurrency: string; availability?: string };
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.name,
    description: config.description,
    image: config.image,
    brand: config.brand ? { '@type': 'Brand', name: config.brand } : undefined,
    offers: config.offers ? {
      '@type': 'Offer',
      price: config.offers.price,
      priceCurrency: config.offers.priceCurrency,
      availability: config.offers.availability || 'https://schema.org/InStock'
    } : undefined
  }),
  
  breadcrumb: (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  })
};

export default {
  generateMetadataTags,
  mergeMetadata,
  generateJsonLd,
  jsonLd
};
