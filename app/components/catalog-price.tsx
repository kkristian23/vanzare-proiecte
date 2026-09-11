"use client";
import { projectPrice } from "../lib/cms-store";
import { useCms } from "./cms-live";
export function CatalogPrice({
  id,
  fallback,
  hideOriginal = false,
}: {
  id: number;
  fallback: number;
  hideOriginal?: boolean;
}) {
  useCms();
  const price = projectPrice(id, fallback);
  return (
    <span className="catalog-price">
      {price.enabled && !hideOriginal && <del>€{price.standard}</del>}
      <span className={price.enabled ? "catalog-price-reduced" : undefined}>
        €{price.enabled ? price.discounted : price.standard}
      </span>
    </span>
  );
}
