import { notFound } from "next/navigation";
import { SeoShell } from "../../components/seo-shell";
import { isLocale, localePath, locales, pageMetadata } from "../../lib/site-config";
import { serviceLabels, services } from "../../lib/services";

type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = serviceLabels[locale];
  return pageMetadata(locale, "services", copy.title, copy.description);
}
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = serviceLabels[locale];
  return <SeoShell locale={locale} path="services" title={copy.title} description={copy.description}>
    <div className="seo-grid">{services.map((service) => <article className="seo-card" key={service.slug}>
      <h2><a href={localePath(locale, `services/${service.slug}`)}>{service.content[locale].title}</a></h2>
      <p>{service.content[locale].description}</p>
    </article>)}</div>
    <section className="seo-section seo-cta"><h2>{copy.cta}</h2><a href={localePath(locale, "contact")}>{copy.cta} →</a></section>
  </SeoShell>;
}
