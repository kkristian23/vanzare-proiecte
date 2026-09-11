"use client";

import { projectCardImages } from "./lib/project-card-images";

const gardenPreviewSources: Record<string, string> = {
  // The original stays available to the full AquaVerde site; this 800px copy
  // is visually lossless at the catalog card's 390px display size.
  aquaverde: "/project-previews/aquaverde.webp",
  // The 1800px JPEG remains in TerraForma for its full-size site hero. The
  // catalog card only needs this high-quality 800px WebP derivative.
  terraforma: "/project-previews/terraforma.webp",
  gazonpro: "/gazonpro/images/hero.webp",
  ecohabitat: "/ecohabitat/images/garden.jpg",
  yardcraft: "/yardcraft/images/hero-1600.webp",
  iclinica: "/project-previews/iclinica.webp",
};

/** Lightweight catalog artwork. The interactive export is fetched only on explicit user action. */
export function StaticProjectPreview({ slug, title, description = title }: { slug: string; title: string; description?: string }) {
  const source = gardenPreviewSources[slug] ?? `/project-previews/${slug}.png`;
  const preview = projectCardImages[slug];
  return (
    <picture className="static-project-preview">
      <img
        src={preview?.fallback ?? source}
        srcSet={preview?.srcSet}
        sizes="(max-width: 600px) calc((100vw - 40px) / 2), (max-width: 800px) calc(100vw - 28px), (max-width: 1288px) calc((100vw - 72px) / 2), 608px"
        alt={`${title} — ${description}`}
        loading="lazy"
        decoding="async"
        width={preview?.width ?? 800}
        height={preview?.height ?? 667}
        onError={(event) => {
          if (event.currentTarget.src.endsWith(source)) return;
          event.currentTarget.removeAttribute("srcset");
          event.currentTarget.src = source;
        }}
      />
    </picture>
  );
}
