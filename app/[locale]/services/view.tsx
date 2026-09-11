"use client";
import { cmsText } from "../../lib/cms-store";
import { useCms } from "../../components/cms-live";

import { SeoShell } from "../../components/seo-shell";
import { type Locale, localePath } from "../../lib/site-config";
import { serviceLabels, services } from "../../lib/services";

export default function ServicesView({ locale }: { locale: Locale }) {
  useCms();
  
  const copy = serviceLabels[locale];
  return <SeoShell locale={locale} path="services" title={copy.title} description={copy.description}>
    <div className="seo-grid">{services.map((service) => <article className="seo-card" key={service.slug}>
      <h2><a href={localePath(locale, `services/${service.slug}`)}>{service.content[locale].title}</a></h2>
      <p>{service.content[locale].description}</p>
    </article>)}</div>
    <section className="seo-section seo-cta"><h2>{copy.cta}</h2><a href={localePath(locale, "contact")}>{copy.cta} {cmsText("view-services", "literal-1273c66ca1ec0211", " →")}</a></section>
  </SeoShell>;
}
