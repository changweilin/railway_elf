import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 4180,
    strictPort: true,
    open: true,
    allowedHosts: ['.ts.net', 'localhost'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('rail-data.generated')) return 'rail-shapes';
          if (id.includes('node_modules/leaflet')) return 'leaflet';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react/') || id.endsWith('node_modules/react')) return 'react';
        },
      },
    },
  },
});
