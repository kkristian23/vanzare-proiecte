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
  const classes = ["brand-logo", inverse && "brand-logo--inverse", className]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={classes} href={href} aria-label={ariaLabel}>
      <span className="logo-mono" aria-hidden="true">mono</span>
      <span className="logo-dev" aria-hidden="true">/dev</span>
    </a>
  );
}
