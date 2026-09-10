"use client";
import { usePathname } from "next/navigation";
import { isLocale } from "../lib/site-config";
// Root params exclude child segments. This hook also receives the path at SSR.
export function HtmlDocument({ children, className }: { children: React.ReactNode; className: string }) {
  const segment = usePathname()?.split("/")[1];
  return <html lang={isLocale(segment) ? segment : "ro"}><body className={className}>{children}</body></html>;
}
