import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pathbuilder to Tableplop',
        short_name: 'PB2TP',
        description: 'A tool for converting Pathbuilder JSON to a Tableplop sheet.',
        theme_color: '#222',
        background_color: '#181818',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/pf2e-pathbuilder-tableplop/', // keep this as your deployment expects
});