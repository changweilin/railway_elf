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
});
