/**
 * FlexiReact Build System
 * Uses esbuild for fast bundling of client and server code
 */

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findFiles, ensureDir, cleanDir, generateHash, isClientComponent, isIsland } from '../utils.js';
import { buildRouteTree } from '../router/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build configuration
 */
export const BuildMode = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

/**
 * Main build function
 */
export async function build(options) {
  const {
    projectRoot,
    config,
    mode = BuildMode.PRODUCTION
  } = options;

  const startTime = Date.now();
  const outDir = config.outDir;
  const isDev = mode === BuildMode.DEVELOPMENT;

  console.log('\n⚡ FlexiReact Build\n');
  console.log(`  Mode: ${mode}`);
  console.log(`  Output: ${outDir}\n`);

  // Clean output directory
  cleanDir(outDir);
  ensureDir(path.join(outDir, 'client'));
  ensureDir(path.join(outDir, 'server'));
  ensureDir(path.join(outDir, 'static'));

  // Build routes
  const routes = buildRouteTree(config.pagesDir, config.layoutsDir);
  
  // Find all client components and islands
  const clientEntries = findClientEntries(config.pagesDir, config.layoutsDir);
  
  // Build client bundle
  console.log('📦 Building client bundle...');
  const clientResult = await buildClient({
    entries: clientEntries,
    outDir: path.join(outDir, 'client'),
    config,
    isDev
  });

  // Build server bundle
  console.log('📦 Building server bundle...');
  const serverResult = await buildServer({
    pagesDir: config.pagesDir,
    layoutsDir: config.layoutsDir,
    outDir: path.join(outDir, 'server'),
    config,
    isDev
  });

  // Copy public assets
  console.log('📁 Copying public assets...');
  await copyPublicAssets(config.publicDir, path.join(outDir, 'static'));

  // Generate manifest
  const manifest = generateManifest({
    routes,
    clientResult,
    serverResult,
    config
  });
  
  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  const duration = Date.now() - startTime;
  
  console.log('\n✨ Build complete!\n');
  console.log(`  Duration: ${duration}ms`);
  console.log(`  Client chunks: ${clientResult.outputs.length}`);
  console.log(`  Server modules: ${serverResult.outputs.length}`);
  console.log('');

  return {
    success: true,
    duration,
    manifest,
    clientResult,
    serverResult
  };
}

/**
 * Finds all client component entries
 */
function findClientEntries(pagesDir, layoutsDir) {
  const entries = [];
  const dirs = [pagesDir, layoutsDir].filter(d => fs.existsSync(d));

  for (const dir of dirs) {
    const files = findFiles(dir, /\.(jsx|tsx)$/);
    
    for (const file of files) {
      if (isClientComponent(file) || isIsland(file)) {
        entries.push(file);
      }
    }
  }

  return entries;
}

/**
 * Builds client-side JavaScript
 */
async function buildClient(options) {
  const { entries, outDir, config, isDev } = options;

  if (entries.length === 0) {
    return { outputs: [] };
  }

  // Create entry points map
  const entryPoints = {};
  for (const entry of entries) {
    const name = path.basename(entry, path.extname(entry));
    const hash = generateHash(entry);
    entryPoints[`${name}-${hash}`] = entry;
  }

  // Add runtime entry
  const runtimePath = path.join(__dirname, '..', 'client', 'runtime.js');
  if (fs.existsSync(runtimePath)) {
    entryPoints['runtime'] = runtimePath;
  }

  try {
    const result = await esbuild.build({
      entryPoints,
      bundle: true,
      splitting: true,
      format: 'esm',
      outdir: outDir,
      minify: !isDev && config.build.minify,
      sourcemap: config.build.sourcemap,
      target: config.build.target,
      jsx: 'automatic',
      jsxImportSource: 'react',
      metafile: true,
      external: [],
      define: {
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production')
      },
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    });

    const outputs = Object.keys(result.metafile.outputs).map(file => ({
      file: path.basename(file),
      size: result.metafile.outputs[file].bytes
    }));

    return { outputs, metafile: result.metafile };

  } catch (error) {
    console.error('Client build failed:', error);
    throw error;
  }
}

/**
 * Builds server-side modules
 */
async function buildServer(options) {
  const { pagesDir, layoutsDir, outDir, config, isDev } = options;

  const entries = [];
  
  // Find all page and layout files
  for (const dir of [pagesDir, layoutsDir]) {
    if (fs.existsSync(dir)) {
      entries.push(...findFiles(dir, /\.(jsx|tsx|js|ts)$/));
    }
  }

  if (entries.length === 0) {
    return { outputs: [] };
  }

  // Create entry points
  const entryPoints = {};
  for (const entry of entries) {
    const relativePath = path.relative(pagesDir, entry);
    const name = relativePath.replace(/[\/\\]/g, '_').replace(/\.(jsx|tsx|js|ts)$/, '');
    entryPoints[name] = entry;
  }

  try {
    const result = await esbuild.build({
      entryPoints,
      bundle: true,
      format: 'esm',
      platform: 'node',
      outdir: outDir,
      minify: false, // Keep server code readable
      sourcemap: true,
      target: 'node18',
      jsx: 'automatic',
      jsxImportSource: 'react',
      metafile: true,
      packages: 'external', // Don't bundle node_modules
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    });

    const outputs = Object.keys(result.metafile.outputs).map(file => ({
      file: path.basename(file),
      size: result.metafile.outputs[file].bytes
    }));

    return { outputs, metafile: result.metafile };

  } catch (error) {
    console.error('Server build failed:', error);
    throw error;
  }
}

/**
 * Copies public assets to output directory
 */
async function copyPublicAssets(publicDir, outDir) {
  if (!fs.existsSync(publicDir)) {
    return;
  }

  const copyRecursive = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    ensureDir(dest);
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyRecursive(publicDir, outDir);
}

/**
 * Generates build manifest
 */
function generateManifest(options) {
  const { routes, clientResult, serverResult, config } = options;

  return {
    version: '2.0.0',
    generatedAt: new Date().toISOString(),
    routes: {
      pages: routes.pages.map(r => ({
        path: r.path,
        file: r.filePath,
        hasLayout: !!r.layout,
        hasLoading: !!r.loading,
        hasError: !!r.error
      })),
      api: routes.api.map(r => ({
        path: r.path,
        file: r.filePath
      }))
    },
    client: {
      chunks: clientResult.outputs || []
    },
    server: {
      modules: serverResult.outputs || []
    },
    config: {
      islands: config.islands.enabled,
      rsc: config.rsc.enabled
    }
  };
}

/**
 * Development build with watch mode
 */
export async function buildDev(options) {
  const { projectRoot, config, onChange } = options;

  const outDir = config.outDir;
  ensureDir(outDir);

  // Use esbuild's watch mode
  const ctx = await esbuild.context({
    entryPoints: findFiles(config.pagesDir, /\.(jsx|tsx)$/),
    bundle: true,
    format: 'esm',
    outdir: path.join(outDir, 'dev'),
    sourcemap: true,
    jsx: 'automatic',
    jsxImportSource: 'react',
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx'
    },
    plugins: [{
      name: 'flexi-watch',
      setup(build) {
        build.onEnd(result => {
          if (result.errors.length === 0) {
            onChange?.();
          }
        });
      }
    }]
  });

  await ctx.watch();

  return ctx;
}

export default {
  build,
  buildDev,
  BuildMode
};
