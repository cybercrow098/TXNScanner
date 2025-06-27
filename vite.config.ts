import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['ccxt', 'events', 'stream-browserify', 'crypto-browserify', 'util', 'net']
  },
  build: {
    commonjsOptions: {
      include: [/ccxt/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [
        'node:http',
        'node:https',
        'node:url',
        'node:crypto',
        'node:stream',
        'node:buffer',
        'node:util',
        'node:tls',
        'node:assert',
        'node:dns',
        'node:zlib',
        'node:os',
        'node:path',
        'node:fs',
        'node:process'
      ],
      output: {
        // Use content hashing for cache busting and security
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      'node:http': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/http'),
      'node:https': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/http'),
      'node:url': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/url'),
      'node:crypto': path.resolve('./node_modules/crypto-browserify'),
      'node:stream': path.resolve('./node_modules/stream-browserify'),
      'node:buffer': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/buffer-es6'),
      'node:util': path.resolve('./node_modules/util'),
      'node:tls': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/tls'),
      'node:assert': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/assert'),
      'node:dns': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/dns'),
      'node:zlib': path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/zlib'),
      'events': path.resolve('./node_modules/events/events.js')
    }
  }
});