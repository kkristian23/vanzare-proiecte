"use client";
import { useState } from "react";
import { slotImages, type CmsImage } from "../lib/cms-store";
import { useCms } from "./cms-live";
import { displayImageUrl } from "../lib/cms-image-url";
export function CmsMedia({
  slot,
  fallback = [],
  className = "",
  children,
}: {
  slot: string;
  fallback?: CmsImage[];
  className?: string;
  children?: React.ReactNode;
}) {
  useCms();
  const images = slotImages(slot);
  if (images === undefined && children) return children;
  return (
    <span className={`cms-media ${className}`}>
      {(images ?? fallback).map((image, index) => (
        <SafeImage key={`${image.src}-${index}`} image={image} />
      ))}
    </span>
  );
}
function SafeImage({ image }: { image: CmsImage }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="cms-image-empty" role="img" aria-label={image.alt} />
  ) : (
    <img
      src={displayImageUrl(image.src)}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
