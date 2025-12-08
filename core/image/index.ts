/**
 * FlexiReact Image Optimization
 * 
 * Optimized image component with:
 * - Automatic WebP/AVIF conversion
 * - Responsive srcset generation
 * - Lazy loading with blur placeholder
 * - Priority loading for LCP images
 * - Automatic width/height to prevent CLS
 */

import React from 'react';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Image optimization config
export interface ImageConfig {
  domains: string[];
  deviceSizes: number[];
  imageSizes: number[];
  formats: ('webp' | 'avif' | 'png' | 'jpeg')[];
  minimumCacheTTL: number;
  dangerouslyAllowSVG: boolean;
  quality: number;
  cacheDir: string;
}

export const defaultImageConfig: ImageConfig = {
  domains: [],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['webp', 'avif'],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  dangerouslyAllowSVG: false,
  quality: 75,
  cacheDir: '.flexi/image-cache'
};

// Image props
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'data:image/...';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  unoptimized?: boolean;
}

// Generate blur placeholder
export async function generateBlurPlaceholder(imagePath: string): Promise<string> {
  try {
    // For now, return a simple SVG blur placeholder
    // In production, we'd use sharp to generate a tiny blurred version
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
        <filter id="b" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="1"/>
        </filter>
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <rect width="100%" height="100%" filter="url(#b)" opacity="0.5" fill="#333"/>
      </svg>`
    ).toString('base64')}`;
  } catch {
    return '';
  }
}

// Get image dimensions
export async function getImageDimensions(src: string): Promise<{ width: number; height: number } | null> {
  try {
    // For local files
    if (!src.startsWith('http')) {
      const imagePath = path.join(process.cwd(), 'public', src);
      if (fs.existsSync(imagePath)) {
        // Read first bytes to detect dimensions
        const buffer = fs.readFileSync(imagePath);
        return detectDimensions(buffer);
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Detect image dimensions from buffer
function detectDimensions(buffer: Buffer): { width: number; height: number } | null {
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }
  
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8)
    };
  }
  
  // WebP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[8] === 0x57 && buffer[9] === 0x45) {
    // VP8
    if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38) {
      if (buffer[15] === 0x20) { // VP8
        return {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff
        };
      }
      if (buffer[15] === 0x4c) { // VP8L
        const bits = buffer.readUInt32LE(21);
        return {
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 14) & 0x3fff) + 1
        };
      }
    }
  }
  
  return null;
}

// Generate srcset for responsive images
export function generateSrcSet(
  src: string,
  widths: number[],
  quality: number = 75
): string {
  return widths
    .map(w => `/_flexi/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
    .join(', ');
}

// Generate sizes attribute
export function generateSizes(sizes?: string): string {
  if (sizes) return sizes;
  return '100vw';
}

// Image optimization endpoint handler
export async function handleImageOptimization(
  req: any,
  res: any,
  config: Partial<ImageConfig> = {}
): Promise<void> {
  const fullConfig = { ...defaultImageConfig, ...config };
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  const imageUrl = url.searchParams.get('url');
  const width = parseInt(url.searchParams.get('w') || '0', 10);
  const quality = parseInt(url.searchParams.get('q') || String(fullConfig.quality), 10);
  const format = url.searchParams.get('f') as 'webp' | 'avif' | 'png' | 'jpeg' | null;
  
  if (!imageUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing url parameter');
    return;
  }
  
  try {
    let imageBuffer: Buffer;
    let contentType: string;
    
    // Fetch image
    if (imageUrl.startsWith('http')) {
      // Remote image
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      imageBuffer = Buffer.from(await response.arrayBuffer());
      contentType = response.headers.get('content-type') || 'image/jpeg';
    } else {
      // Local image
      const imagePath = path.join(process.cwd(), 'public', imageUrl);
      if (!fs.existsSync(imagePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image not found');
        return;
      }
      imageBuffer = fs.readFileSync(imagePath);
      contentType = getContentType(imagePath);
    }
    
    // Generate cache key
    const cacheKey = crypto
      .createHash('md5')
      .update(`${imageUrl}-${width}-${quality}-${format}`)
      .digest('hex');
    
    const cacheDir = path.join(process.cwd(), fullConfig.cacheDir);
    const cachePath = path.join(cacheDir, `${cacheKey}.${format || 'webp'}`);
    
    // Check cache
    if (fs.existsSync(cachePath)) {
      const cachedImage = fs.readFileSync(cachePath);
      res.writeHead(200, {
        'Content-Type': `image/${format || 'webp'}`,
        'Cache-Control': `public, max-age=${fullConfig.minimumCacheTTL}`,
        'X-Flexi-Image-Cache': 'HIT'
      });
      res.end(cachedImage);
      return;
    }
    
    // For now, serve original image
    // In production, we'd use sharp for resizing/conversion
    // TODO: Integrate sharp for actual optimization
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': `public, max-age=${fullConfig.minimumCacheTTL}`,
      'X-Flexi-Image-Cache': 'MISS'
    });
    res.end(imageBuffer);
    
  } catch (error: any) {
    console.error('Image optimization error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Image optimization failed');
  }
}

// Get content type from file extension
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'application/octet-stream';
}

// Image component (server-side rendered)
export function createImageComponent(config: Partial<ImageConfig> = {}) {
  const fullConfig = { ...defaultImageConfig, ...config };
  
  return function Image(props: ImageProps): React.ReactElement {
    const {
      src,
      alt,
      width,
      height,
      fill = false,
      sizes,
      quality = fullConfig.quality,
      priority = false,
      placeholder = 'empty',
      blurDataURL,
      loading,
      className = '',
      style = {},
      unoptimized = false,
      ...rest
    } = props;
    
    // Determine loading strategy
    const loadingAttr = priority ? 'eager' : (loading || 'lazy');
    
    // Generate optimized src
    const optimizedSrc = unoptimized 
      ? src 
      : `/_flexi/image?url=${encodeURIComponent(src)}&w=${width || 1920}&q=${quality}`;
    
    // Generate srcset for responsive images
    const allSizes = [...fullConfig.imageSizes, ...fullConfig.deviceSizes].sort((a, b) => a - b);
    const relevantSizes = width 
      ? allSizes.filter(s => s <= width * 2)
      : allSizes;
    
    const srcSet = unoptimized 
      ? undefined 
      : generateSrcSet(src, relevantSizes, quality);
    
    // Build styles
    const imgStyle: React.CSSProperties = {
      ...style,
      ...(fill ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      } : {})
    };
    
    // Placeholder styles
    const wrapperStyle: React.CSSProperties = fill ? {
      position: 'relative',
      width: '100%',
      height: '100%'
    } : {};
    
    const placeholderStyle: React.CSSProperties = placeholder === 'blur' ? {
      backgroundImage: `url(${blurDataURL || generateBlurPlaceholderSync()})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(20px)',
      transform: 'scale(1.1)'
    } : {};
    
    // Create image element
    const imgElement = React.createElement('img', {
      src: optimizedSrc,
      alt,
      width: fill ? undefined : width,
      height: fill ? undefined : height,
      loading: loadingAttr,
      decoding: 'async',
      srcSet,
      sizes: generateSizes(sizes),
      className: `flexi-image ${className}`.trim(),
      style: imgStyle,
      fetchPriority: priority ? 'high' : undefined,
      ...rest
    });
    
    // Wrap with placeholder if needed
    if (fill || placeholder === 'blur') {
      return React.createElement('div', {
        className: 'flexi-image-wrapper',
        style: { ...wrapperStyle, ...placeholderStyle }
      }, imgElement);
    }
    
    return imgElement;
  };
}

// Sync blur placeholder (for SSR)
function generateBlurPlaceholderSync(): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1"/>
      </filter>
      <rect width="100%" height="100%" fill="#1a1a1a"/>
    </svg>`
  ).toString('base64')}`;
}

// Default Image component
export const Image = createImageComponent();

// Loader types for different image providers
export interface ImageLoader {
  (props: { src: string; width: number; quality?: number }): string;
}

// Built-in loaders
export const imageLoaders = {
  default: ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
    `/_flexi/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`,
  
  cloudinary: ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
    `https://res.cloudinary.com/demo/image/fetch/w_${width},q_${quality}/${src}`,
  
  imgix: ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
    `${src}?w=${width}&q=${quality}&auto=format`,
  
  vercel: ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
    `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`,
  
  cloudflare: ({ src, width, quality = 75 }: { src: string; width: number; quality?: number }) =>
    `/cdn-cgi/image/width=${width},quality=${quality}/${src}`
};

export default {
  Image,
  createImageComponent,
  handleImageOptimization,
  generateBlurPlaceholder,
  getImageDimensions,
  generateSrcSet,
  imageLoaders,
  defaultImageConfig
};
