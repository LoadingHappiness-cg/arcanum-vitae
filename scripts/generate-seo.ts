import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALBUMS } from '../constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const BASE_URL = (process.env.SITE_BASE_URL || 'https://arcanumvitae.art').replace(/\/$/, '');

const viewRoutes = [
  '/',
  '/music',
  '/words',
  '/visuals',
  '/archive',
  '/about',
  '/legal'
];

const musicRoutes: string[] = [];
for (const album of ALBUMS) {
  musicRoutes.push(`/music/${album.id}`);
  album.tracks.forEach((_t, idx) => {
    musicRoutes.push(`/music/${album.id}/${idx + 1}`); // 1-based for humans
  });
}

const routes = Array.from(new Set([...viewRoutes, ...musicRoutes]));

// 1) Write routes used by prerender
const routesOutPath = path.join(projectRoot, 'data', 'prerender-routes.json');
fs.mkdirSync(path.dirname(routesOutPath), { recursive: true });
fs.writeFileSync(routesOutPath, JSON.stringify({ routes }, null, 2));

// 2) Write sitemap.xml
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
const urls = routes
  .filter((r) => !r.includes(':'))
  .map((r) => `${BASE_URL}${r === '/' ? '/' : r}`);

const now = new Date().toISOString();
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync(sitemapPath, xml);

console.log(`SEO: wrote ${routes.length} routes -> ${routesOutPath}`);
console.log(`SEO: wrote sitemap -> ${sitemapPath}`);
