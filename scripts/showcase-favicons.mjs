import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

// The catalog intentionally hides Forge, leaving the 63 customer-facing projects.
export const hiddenShowcaseSlugs = new Set(["forge"]);

const generatedFavicons = {
  drivolt: ["DV", "#061c22", "#19a6b8"],
  "flow-crm": ["FC", "#20201f", "#8b78eb"],
  academia: ["A", "#101010", "#c8ff31"],
  staynest: ["SN", "#1d2622", "#e9e0d3"],
  tableo: ["T", "#1b1713", "#c7432f"],
  "medora-clinic": ["M+", "#183a45", "#63b5ae"],
  "imobilia-one": ["I1", "#17261f", "#c6a66b"],
  "studio-velora": ["SV", "#171713", "#b19870"],
  "studio-forma": ["SF", "#471821", "#f2b8c6"],
  noma: ["N", "#1f211d", "#e6a79c"],
  pophaus: ["PH", "#171714", "#ffd22e"],
  "nord-and-oak": ["NO", "#263d32", "#c8b090"],
  archicontract: ["AC", "#171713", "#c8a979"],
  "atelier-noire": ["AN", "#171612", "#a79479"],
  rentech: ["RT", "#26352d", "#e4a925"],
  elan: ["É", "#6f1d32", "#f1c4ce"],
  fixora: ["FX", "#172134", "#4c83f1"],
  micora: ["M", "#382a28", "#d8bbb2"],
  "audio-rental-md": ["NR", "#101707", "#c8ff31"],
  "neo-booking": ["NB", "#1b100a", "#d99a45"],
  "01-eventora": ["E", "#171711", "#fb4b25"],
  "02-scena-city": ["SC", "#27291e", "#b7c66d"],
  "03-pulse-tickets": ["PT", "#222438", "#8d74ee"],
  "04-clinica-nova": ["+", "#163b3b", "#4fb3a8"],
  "05-laboris": ["L", "#32303f", "#d35b8b"],
  "06-doctor-aproape": ["DA", "#244957", "#6ec4b1"],
  "07-med-slot": ["MS", "#333222", "#f7edab"],
  "08-lead-pilot": ["LP", "#244334", "#75c38f"],
  "09-growth-desk": ["GD", "#293d4e", "#db6743"],
  "10-closeflow": ["CF", "#232328", "#6677ee"],
  "11-partmatch": ["PM", "#162b3b", "#f17727"],
  "12-garage-box": ["GB", "#292c27", "#d7a02d"],
  "13-motor-supply": ["MS", "#233241", "#5c91b8"],
  "14-auto-grid": ["AG", "#212323", "#d73732"],
  "15-park-suites-demo": ["LS", "#3b4135", "#c8b994"],
  "16-urban-haven": ["UH", "#171d1d", "#c5a373"],
  "17-nest-collection": ["NC", "#3b3a34", "#b2a886"],
  "18-moldova-escape": ["ME", "#214237", "#61a882"],
  "19-bazar-local": ["BL", "#28313c", "#4f91eb"],
  "20-pret-bun": ["PB", "#23372e", "#39a98c"],
  "21-local-craft": ["LC", "#4d342c", "#d28a68"],
  "22-skillup": ["SU", "#25294a", "#7779e1"],
  "23-civic-learn": ["CL", "#23384d", "#6d9fc5"],
  "24-mentor-cloud": ["MC", "#2c344b", "#8d96d1"],
  "25-casa-check": ["CC", "#2e4137", "#70a680"],
  "26-direct-home": ["DH", "#343b42", "#dd8b52"],
  "27-area-insight": ["AI", "#28454a", "#65a9a2"],
  "28-table-flow": ["TF", "#384037", "#8da075"],
  "29-food-route": ["FR", "#343b24", "#7ca758"],
  "30-menu-studio": ["MS", "#413c2c", "#a0a56d"],
  "31-my-utility": ["MU", "#293c53", "#5591d3"],
  "32-block-admin": ["BA", "#394136", "#8da168"],
};

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

function faviconSvg(glyph, background, accent) {
  const fontSize = glyph.length > 1 ? 27 : 38;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(glyph)}">
  <rect width="64" height="64" rx="15" fill="${background}"/>
  <path d="M8 50 50 8h6v12L20 56H8Z" fill="${accent}" opacity=".22"/>
  <circle cx="51" cy="13" r="5" fill="${accent}"/>
  <text x="32" y="41" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="800" text-anchor="middle" letter-spacing="-2">${escapeXml(glyph)}</text>
</svg>
`;
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function findFavicon(directory, slug) {
  const generated = generatedFavicons[slug];
  if (generated) {
    await writeFile(path.join(directory, "favicon.svg"), faviconSvg(...generated), "utf8");
    return `/${slug}/favicon.svg`;
  }

  for (const fileName of ["favicon.svg", "icon.svg", "favicon.ico", "favicon.png"]) {
    if (await exists(path.join(directory, fileName))) return `/${slug}/${fileName}`;
  }
  return null;
}

function withFavicon(html, href) {
  const withoutFavicon = html.replace(/<link\b[^>]*>/gi, (link) => {
    const rel = link.match(/\brel\s*=\s*(["'])(.*?)\1/i)?.[2]?.toLowerCase().split(/\s+/) ?? [];
    return rel.includes("icon") ? "" : link;
  });
  const link = `<link rel="icon" href="${href}" type="${href.endsWith(".svg") ? "image/svg+xml" : href.endsWith(".png") ? "image/png" : "image/x-icon"}">`;
  if (/<head(?:\s[^>]*)?>/i.test(withoutFavicon)) {
    return withoutFavicon.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}${link}`);
  }
  // A few printable resources are valid HTML documents with an omitted <head>.
  // Add one explicitly so their browser tabs get the same project identity.
  if (/<html(?:\s[^>]*)?>/i.test(withoutFavicon)) {
    return withoutFavicon.replace(/<html(?:\s[^>]*)?>/i, (htmlTag) => `${htmlTag}<head>${link}</head>`);
  }
  return withoutFavicon;
}

async function updateHtmlTree(directory, href) {
  let updated = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      updated += await updateHtmlTree(entryPath, href);
    } else if (entry.name.toLowerCase().endsWith(".html")) {
      const original = await readFile(entryPath, "utf8");
      const next = withFavicon(original, href);
      if (next !== original) {
        await writeFile(entryPath, next, "utf8");
        updated += 1;
      }
    }
  }
  return updated;
}

export async function ensureShowcaseFavicon(directory, project) {
  if (project.disabled || hiddenShowcaseSlugs.has(project.slug)) return { skipped: true, updated: 0 };
  const href = await findFavicon(directory, project.slug);
  if (!href) throw new Error(`Lipsește configurația favicon pentru ${project.slug}`);
  return { href, updated: await updateHtmlTree(directory, href) };
}
