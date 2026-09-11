"use client";
import { cmsText } from "./lib/cms-store";
import { useCms } from "./components/cms-live";
type BrandLogoProps = {
  href: string;
  className?: string;
  inverse?: boolean;
  ariaLabel?: string;
};

export function BrandLogo({
  href,
  className,
  inverse = false,
  ariaLabel = "mono/dev",
}: BrandLogoProps) {
  useCms();
  const classes = ["brand-logo", inverse && "brand-logo--inverse", className]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={classes} href={href} aria-label={ariaLabel}>
      <span className="logo-mono" aria-hidden="true">{cmsText("brand-logo", "literal-d7de34b17b4691aa", "mono")}</span>
      <span className="logo-dev" aria-hidden="true">{cmsText("brand-logo", "literal-938b99e3330802a9", "/dev")}</span>
    </a>
  );
}
