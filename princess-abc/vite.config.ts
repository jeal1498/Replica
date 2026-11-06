/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // la actualización se aplica en la pantalla principal, nunca a mitad de un juego
      includeAssets: ['icons/*.png', 'icons/*.svg', 'audio/manifest.json'],
      manifest: {
        name: 'Princess ABC',
        short_name: 'Princess ABC',
        description: 'Learn the English alphabet with a princess!',
        theme_color: '#f9a8d4',
        background_color: '#fff7fb',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        lang: 'en',
        categories: ['education', 'kids'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json,mp3,ogg,wav,webp}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\.(mp3|ogg|wav)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'princess-audio', expiration: { maxEntries: 120 }, rangeRequests: true, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'princess-images', expiration: { maxEntries: 120 } },
          },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
