import TrustView from "./trust-view";
import { notFound } from "next/navigation";
import { isLocale, pageMetadata } from "../lib/site-config";
import { trustContent, type TrustPath } from "../lib/trust-content";


export type TrustPageProps = { params: Promise<{ locale: string }> };
export async function trustMetadata({ params }: TrustPageProps, path: TrustPath) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = trustContent[locale][path];
  return pageMetadata(locale, path, copy.title, copy.description);
}
export async function TrustPage({ params, path }: TrustPageProps & { path: TrustPath }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <TrustView locale={locale} path={path} />; }
