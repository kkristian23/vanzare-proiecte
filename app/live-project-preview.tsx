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
};

const widths = [480, 800, 1200] as const;

function transformed(source: string, width: number, format: "avif" | "webp") {
  return `/.netlify/images?url=${encodeURIComponent(source)}&w=${width}&fm=${format}&q=72`;
}

/** Lightweight catalog artwork. The interactive export is fetched only on explicit user action. */
export function StaticProjectPreview({ slug, title }: { slug: string; title: string }) {
  const source = gardenPreviewSources[slug] ?? `/project-previews/${slug}.png`;
  const [useNetlifyImages, setUseNetlifyImages] = useState(false);
  useEffect(() => {
    setUseNetlifyImages(
      window.location.hostname.endsWith(".netlify.app") ||
        window.location.hostname.endsWith(".netlify.com"),
    );
  }, []);
  const srcSet = (format: "avif" | "webp") =>
    widths.map((width) => `${transformed(source, width, format)} ${width}w`).join(", ");
  return (
    <picture className="static-project-preview">
      {useNetlifyImages && <source type="image/avif" srcSet={srcSet("avif")} sizes="(max-width: 760px) 92vw, (max-width: 1200px) 46vw, 390px" />}
      {useNetlifyImages && <source type="image/webp" srcSet={srcSet("webp")} sizes="(max-width: 760px) 92vw, (max-width: 1200px) 46vw, 390px" />}
      <img
        src={useNetlifyImages ? transformed(source, 800, "webp") : source}
        alt={`Previzualizare ${title}`}
        loading="lazy"
        decoding="async"
        width="800"
        height="667"
        onError={(event) => {
          if (event.currentTarget.src.endsWith(source)) return;
          event.currentTarget.parentElement
            ?.querySelectorAll("source")
            .forEach((candidate) => candidate.remove());
          event.currentTarget.src = source;
        }}
      />
    </picture>
  );
}
"use client";

import { useEffect, useState } from "react";
