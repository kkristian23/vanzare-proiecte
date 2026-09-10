import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { gzip } from "node:zlib";

// Static build preview with transfer compression for representative lab audits.
// This does not simulate Netlify's redirect or custom-header engine.
const compress = promisify(gzip);
const root = path.resolve("dist/client");
const port = Number(process.env.SEO_PREVIEW_PORT ?? 4012);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".txt": "text/plain", ".rsc": "text/x-component", ".webmanifest": "application/manifest+json" };
createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const stem = path.resolve(root, `.${pathname}`);
    if (stem !== root && !stem.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    let filename;
    for (const candidate of [stem, `${stem}.html`, path.join(stem, "index.html")]) if ((await stat(candidate).catch(() => null))?.isFile()) { filename = candidate; break; }
    const status = filename ? 200 : 404;
    filename ??= path.join(root, "404.html");
    const type = mime[path.extname(filename)] ?? "application/octet-stream";
    let body = await readFile(filename);
    res.setHeader("Content-Type", type);
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Cache-Control", pathname.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache");
    if (/\bgzip\b/.test(req.headers["accept-encoding"] ?? "") && /text|javascript|json|xml/.test(type)) { body = await compress(body); res.setHeader("Content-Encoding", "gzip"); }
    res.setHeader("Content-Length", body.length);
    res.writeHead(status); res.end(req.method === "HEAD" ? undefined : body);
  } catch { res.writeHead(500); res.end("Unable to read the static build"); }
}).listen(port, "127.0.0.1", () => console.log(`Compressed SEO preview: http://127.0.0.1:${port}`));
