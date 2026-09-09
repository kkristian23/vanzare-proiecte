import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = 'true'] = arg.replace(/^--/, '').split('=');
  return [key, value];
}));
const base = (args.get('base') ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const output = resolve(args.get('output') ?? 'reports/network-audit/localhost-3000');
const settleMs = Number(args.get('settle-ms') ?? 750);
const concurrency = Number(args.get('concurrency') ?? 16);
const registry = JSON.parse(await readFile('showcase-projects/registry.json', 'utf8'))
  .filter((project) => project.id !== 24);

function bytes(value) {
  if (!Number.isFinite(value)) return 'n/a';
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 ** 2).toFixed(2)} MB`;
}

function kind(request, contentType = '') {
  const type = request.resourceType();
  if (type === 'image' || contentType.startsWith('image/')) return 'image';
  if (type === 'script' || /javascript|ecmascript/.test(contentType)) return 'script';
  if (type === 'stylesheet' || contentType.startsWith('text/css')) return 'style';
  if (type === 'font' || /font|woff/.test(contentType)) return 'font';
  if (type === 'document') return 'document';
  return 'other';
}

function recommendation(item) {
  const url = item.url.toLowerCase();
  if (item.category === 'image' && /\.png(?:[?#]|$)/.test(url) && item.bodyBytes >= 100 * 1024) {
    return 'PNG: poate fi optimizat strict lossless (pixeli identici) cu OxiPNG.';
  }
  if (item.category === 'image' && /\.(jpe?g|webp|avif)(?:[?#]|$)/.test(url) && item.bodyBytes >= 100 * 1024) {
    return 'Imagine cu compresie: fără pierdere nu se poate reduce mult; folosește dimensiuni responsive sau re-encodare perceptuală.';
  }
  if (item.category === 'script' && /(node_modules\/\.vite\/|@react-refresh|entry-browser|\/client(?:\?|$)|virtual:|\.tsx(?:\?|$))/.test(url)) {
    return 'Doar dezvoltare (Vite/HMR); nu se livrează astfel în buildul de producție.';
  }
  if (item.category === 'script' && item.bodyBytes >= 100 * 1024) {
    return 'JS de producție: Brotli/Gzip la livrare și code-splitting; encoderul lossless nu micșorează codul sursă relevant.';
  }
  return null;
}

async function measure(url) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const rows = [];
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfinished', async (request) => {
    try {
      const response = await request.response();
      if (!response || !response.url().startsWith(base)) return;
      const headers = await response.allHeaders();
      const sizes = await request.sizes();
      const item = {
        url: response.url(),
        path: response.url().slice(base.length) || '/',
        status: response.status(),
        category: kind(request, headers['content-type'] ?? ''),
        mime: headers['content-type'] ?? '',
        encoding: headers['content-encoding'] ?? 'identity',
        bodyBytes: sizes.responseBodySize,
      };
      item.recommendation = recommendation(item);
      rows.push(item);
    } catch { /* A cancelled dev-server request is not a completed transfer. */ }
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForTimeout(settleMs);
  } catch (error) {
    errors.push(`Navigation: ${error.message}`);
  }
  await page.waitForTimeout(100);
  await context.close();
  const unique = [...new Map(rows.map((item) => [item.url, item])).values()];
  const categories = Object.fromEntries(['document', 'script', 'style', 'image', 'font', 'other']
    .map((category) => [category, unique.filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.bodyBytes, 0)]));
  return {
    url,
    requestCount: unique.length,
    transferredBytes: unique.reduce((sum, item) => sum + item.bodyBytes, 0),
    categories,
    largest: [...unique].sort((a, b) => b.bodyBytes - a.bodyBytes).slice(0, 10),
    candidates: unique.filter((item) => item.recommendation),
    errors: [...new Set(errors)],
    resources: unique,
  };
}

const browser = await chromium.launch({ headless: true });
try {
  const catalog = await measure(`${base}/`);
  const projects = [];
  for (let start = 0; start < registry.length; start += concurrency) {
    const batch = registry.slice(start, start + concurrency);
    process.stdout.write(`Auditez ${start + 1}-${start + batch.length}/${registry.length}\n`);
    const results = await Promise.all(batch.map(async (project) => ({
      slug: project.slug,
      id: project.id,
      ...await measure(`${base}/${project.slug}/`),
    })));
    projects.push(...results);
  }
  const all = [catalog, ...projects];
  const totals = {
    pages: all.length,
    transferredBytes: all.reduce((sum, page) => sum + page.transferredBytes, 0),
    images: all.reduce((sum, page) => sum + page.categories.image, 0),
    scripts: all.reduce((sum, page) => sum + page.categories.script, 0),
    styles: all.reduce((sum, page) => sum + page.categories.style, 0),
  };
  const report = { generatedAt: new Date().toISOString(), base, mode: 'development cold-load', totals, catalog, projects };
  const lines = [
    '# Audit Network – localhost:3000', '',
    '> Măsurare cold-load în serverul de dezvoltare Vite. Modulele HMR/React Refresh nu reprezintă livrarea de producție.', '',
    `- Pagini analizate: ${totals.pages} (catalog + ${projects.length} proiecte)`,
    `- Transfer cumulat: ${bytes(totals.transferredBytes)}`,
    `- Imagini: ${bytes(totals.images)}; scripturi: ${bytes(totals.scripts)}; CSS: ${bytes(totals.styles)}`, '',
    '## Catalog', '', `- Transfer: ${bytes(catalog.transferredBytes)}; cereri: ${catalog.requestCount}`,
    ...catalog.largest.slice(0, 5).map((item) => `- ${bytes(item.bodyBytes)} — \`${item.path}\` (${item.category})`), '',
    '## Toate proiectele', '', '| Proiect | Transfer | Cereri | Cea mai mare resursă |', '| --- | ---: | ---: | --- |',
    ...projects.map((page) => `| ${page.slug} | ${bytes(page.transferredBytes)} | ${page.requestCount} | ${page.largest[0] ? `${bytes(page.largest[0].bodyBytes)} — ${page.largest[0].path}` : 'n/a'} |`), '',
    '## Candidați de optimizare', '',
    ...all.flatMap((page) => page.candidates.map((item) => `- **${page.url}** — ${bytes(item.bodyBytes)}, \`${item.path}\`: ${item.recommendation}`)),
  ];
  await mkdir(dirname(output), { recursive: true });
  await writeFile(`${output}.json`, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(`${output}.md`, `${lines.join('\n')}\n`);
  console.log(`Raport: ${output}.json și ${output}.md`);
} finally {
  await browser.close();
}
