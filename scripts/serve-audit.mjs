import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Serve the built catalog and current showcase exports without HMR/build restarts.
const roots = ['public', 'dist/client'].map(dir => path.resolve(dir));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain', '.pdf': 'application/pdf', '.rsc': 'text/x-component' };
const port = Number(process.env.AUDIT_PORT ?? 4010);
createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const auditRequest = url.pathname === '/__audit' || url.pathname.startsWith('/__audit/');
    const relative = decodeURIComponent(auditRequest ? url.pathname.slice(8) : url.pathname).replace(/^\/+/, '') || 'index.html';
    for (const root of auditRequest ? [path.resolve('reports/showcase-audit')] : roots) {
      for (const suffix of ['', '.html', '/index.html']) {
        const file = path.resolve(root, relative + suffix);
        if (!file.startsWith(root + path.sep)) continue;
        if (!(await stat(file).catch(() => null))?.isFile()) continue;
        res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
        const hashedAsset = /\/_next\/static\//.test(url.pathname) || /\/assets\/[^/]+-[\w-]{6,}\.(?:js|css)$/.test(url.pathname);
        res.setHeader('Cache-Control', !auditRequest && hashedAsset ? 'public, max-age=31536000, immutable' : 'no-store');
        res.writeHead(200);
        res.end(req.method === 'HEAD' ? undefined : await readFile(file));
        return;
      }
    }
    res.writeHead(404, {'Content-Type': 'text/plain'}); res.end('Not found');
  } catch { res.writeHead(500); res.end('Server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Audit server: http://127.0.0.1:${port}`));
