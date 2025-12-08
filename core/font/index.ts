/**
 * FlexiReact Font Optimization
 * 
 * Optimized font loading with:
 * - Automatic font subsetting
 * - Preload hints generation
 * - Font-display: swap by default
 * - Self-hosted Google Fonts
 * - Variable font support
 * - CSS variable generation
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Font configuration
export interface FontConfig {
  family: string;
  weight?: string | number | (string | number)[];
  style?: 'normal' | 'italic' | 'oblique';
  subsets?: string[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  fallback?: string[];
  variable?: string;
  adjustFontFallback?: boolean;
}

export interface FontResult {
  className: string;
  style: {
    fontFamily: string;
    fontWeight?: number | string;
    fontStyle?: string;
  };
  variable?: string;
}

// Google Fonts API
const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2';

// Popular Google Fonts with their weights
export const googleFonts = {
  Inter: {
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: true,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese']
  },
  Roboto: {
    weights: [100, 300, 400, 500, 700, 900],
    variable: false,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese']
  },
  'Open Sans': {
    weights: [300, 400, 500, 600, 700, 800],
    variable: true,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese']
  },
  Poppins: {
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: false,
    subsets: ['latin', 'latin-ext']
  },
  Montserrat: {
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: true,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese']
  },
  'Fira Code': {
    weights: [300, 400, 500, 600, 700],
    variable: true,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek']
  },
  'JetBrains Mono': {
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    variable: true,
    subsets: ['latin', 'latin-ext', 'cyrillic', 'greek']
  },
  Geist: {
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: true,
    subsets: ['latin', 'latin-ext']
  },
  'Geist Mono': {
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: true,
    subsets: ['latin', 'latin-ext']
  }
};

// Generate font CSS
export function generateFontCSS(config: FontConfig): string {
  const {
    family,
    weight = 400,
    style = 'normal',
    display = 'swap',
    fallback = ['system-ui', 'sans-serif'],
    variable
  } = config;

  const weights = Array.isArray(weight) ? weight : [weight];
  const fallbackStr = fallback.map(f => f.includes(' ') ? `"${f}"` : f).join(', ');

  let css = '';

  // Generate @font-face for each weight
  for (const w of weights) {
    css += `
@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${w};
  font-display: ${display};
  src: local('${family}'),
       url('/_flexi/font/${encodeURIComponent(family)}?weight=${w}&style=${style}') format('woff2');
}
`;
  }

  // Generate CSS variable if specified
  if (variable) {
    css += `
:root {
  ${variable}: '${family}', ${fallbackStr};
}
`;
  }

  return css;
}

// Generate preload link tags
export function generateFontPreloadTags(fonts: FontConfig[]): string {
  return fonts
    .filter(f => f.preload !== false)
    .map(f => {
      const weights = Array.isArray(f.weight) ? f.weight : [f.weight || 400];
      return weights.map(w => 
        `<link rel="preload" href="/_flexi/font/${encodeURIComponent(f.family)}?weight=${w}&style=${f.style || 'normal'}" as="font" type="font/woff2" crossorigin>`
      ).join('\n');
    })
    .join('\n');
}

// Create a font loader function (like next/font)
export function createFont(config: FontConfig): FontResult {
  const {
    family,
    weight = 400,
    style = 'normal',
    fallback = ['system-ui', 'sans-serif'],
    variable
  } = config;

  // Generate unique class name
  const hash = crypto
    .createHash('md5')
    .update(`${family}-${weight}-${style}`)
    .digest('hex')
    .slice(0, 8);

  const className = `__font_${hash}`;
  const fallbackStr = fallback.map(f => f.includes(' ') ? `"${f}"` : f).join(', ');

  return {
    className,
    style: {
      fontFamily: `'${family}', ${fallbackStr}`,
      fontWeight: Array.isArray(weight) ? undefined : weight,
      fontStyle: style
    },
    variable: variable || undefined
  };
}

// Google Font loader
export function googleFont(config: FontConfig): FontResult {
  return createFont({
    ...config,
    // Google Fonts are always preloaded
    preload: true
  });
}

// Local font loader
export function localFont(config: FontConfig & { src: string | { path: string; weight?: string | number; style?: string }[] }): FontResult {
  return createFont(config);
}

// Handle font requests
export async function handleFontRequest(
  req: any,
  res: any
): Promise<void> {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  const fontFamily = decodeURIComponent(pathParts[pathParts.length - 1] || '');
  const weight = url.searchParams.get('weight') || '400';
  const style = url.searchParams.get('style') || 'normal';

  if (!fontFamily) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing font family');
    return;
  }

  try {
    // Check local cache first
    const cacheDir = path.join(process.cwd(), '.flexi', 'font-cache');
    const cacheKey = crypto
      .createHash('md5')
      .update(`${fontFamily}-${weight}-${style}`)
      .digest('hex');
    const cachePath = path.join(cacheDir, `${cacheKey}.woff2`);

    if (fs.existsSync(cachePath)) {
      const fontData = fs.readFileSync(cachePath);
      res.writeHead(200, {
        'Content-Type': 'font/woff2',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Flexi-Font-Cache': 'HIT'
      });
      res.end(fontData);
      return;
    }

    // Fetch from Google Fonts
    const googleUrl = `${GOOGLE_FONTS_API}?family=${encodeURIComponent(fontFamily)}:wght@${weight}&display=swap`;
    
    const cssResponse = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!cssResponse.ok) {
      throw new Error('Failed to fetch font CSS');
    }

    const css = await cssResponse.text();
    
    // Extract woff2 URL from CSS
    const woff2Match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/);
    
    if (!woff2Match) {
      throw new Error('Could not find woff2 URL');
    }

    // Fetch the actual font file
    const fontResponse = await fetch(woff2Match[1]);
    
    if (!fontResponse.ok) {
      throw new Error('Failed to fetch font file');
    }

    const fontBuffer = Buffer.from(await fontResponse.arrayBuffer());

    // Cache the font
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cachePath, fontBuffer);

    // Serve the font
    res.writeHead(200, {
      'Content-Type': 'font/woff2',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Flexi-Font-Cache': 'MISS'
    });
    res.end(fontBuffer);

  } catch (error: any) {
    console.error('Font loading error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Font loading failed');
  }
}

// Pre-built font configurations
export const fonts = {
  // Sans-serif
  inter: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Inter', variable: '--font-inter', ...config }),
  roboto: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Roboto', variable: '--font-roboto', ...config }),
  openSans: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Open Sans', variable: '--font-open-sans', ...config }),
  poppins: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Poppins', variable: '--font-poppins', ...config }),
  montserrat: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Montserrat', variable: '--font-montserrat', ...config }),
  geist: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Geist', variable: '--font-geist', ...config }),
  
  // Monospace
  firaCode: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Fira Code', variable: '--font-fira-code', fallback: ['monospace'], ...config }),
  jetbrainsMono: (config: Partial<FontConfig> = {}) => googleFont({ family: 'JetBrains Mono', variable: '--font-jetbrains', fallback: ['monospace'], ...config }),
  geistMono: (config: Partial<FontConfig> = {}) => googleFont({ family: 'Geist Mono', variable: '--font-geist-mono', fallback: ['monospace'], ...config })
};

export default {
  createFont,
  googleFont,
  localFont,
  generateFontCSS,
  generateFontPreloadTags,
  handleFontRequest,
  fonts,
  googleFonts
};
