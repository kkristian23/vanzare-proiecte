import ServiceView from "./view";
import { notFound } from "next/navigation";


import { isLocale, locales, pageMetadata } from "../../../lib/site-config";
import { getService, services } from "../../../lib/services";


type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return locales.flatMap((locale) => services.map(({ slug }) => ({ locale, slug }))); }
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) notFound();
  const copy = service.content[locale];
  return pageMetadata(locale, `services/${slug}`, copy.seo?.title ?? copy.title, copy.seo?.description ?? copy.description);
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !getService(slug)) notFound();
  return <ServiceView locale={locale} slug={slug} />;
}
