"use client";
import { useEffect, useRef, useState } from "react";
import previewVersions from "./project-preview-versions.json";

/** Script-free export in an isolated origin, with forms and navigation blocked. */
export function LiveProjectPreview({ slug, title }: { slug: string; title: string }) {
  const version = (previewVersions as Record<string, string>)[slug];
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const update = () => setScale(Math.max(0.1, node.clientWidth / 1440));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="live-project-preview" ref={host} aria-hidden="true">
      <iframe
        src={`/${slug}/preview.html?v=${version}`}
        title={`Previzualizare ${title}`}
        loading="lazy"
        sandbox="allow-scripts"
        tabIndex={-1}
        width="1440"
        height="1200"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}
