import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

const readPrerenderRoutes = () => {
  try {
    const p = path.resolve(__dirname, 'data', 'prerender-routes.json');
    const raw = fs.readFileSync(p, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.routes)) return parsed.routes;
  } catch {
    // ignore
  }
  return ['/'];
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const prerenderRoutes = readPrerenderRoutes();

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': 'http://localhost:3001',
        '/media': 'http://localhost:3001'
      }
    },
    plugins: [
      react(),
      ...vitePrerenderPlugin({
        renderTarget: '#root',
        prerenderScript: path.resolve(__dirname, 'prerender.tsx'),
        additionalPrerenderRoutes: prerenderRoutes,
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
