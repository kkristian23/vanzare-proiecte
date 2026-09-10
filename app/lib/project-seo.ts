import type { getProject } from "./project-catalog";
import { absoluteUrl, localePath, pageMetadata, siteConfig, type Locale } from "./site-config";

type LocalizedProject = NonNullable<ReturnType<typeof getProject>>;

/** Opt-in only. Missing flags and truthy non-booleans must never enable indexing. */
export function isProjectSeoEnabled(project: { seoEnabled?: unknown }) {
  return project.seoEnabled === true;
}

export function projectTitle(project: LocalizedProject, locale: Locale) {
  const kind = { ro: "Proiect web", ru: "Веб-проект", en: "Web project" }[locale];
  return `${kind}: ${project.description.replace(/[.!?]+$/, "")} — ${project.title}`;
}

export function projectMetadata(locale: Locale, project: LocalizedProject) {
  const description = project.detail.summary.toLocaleLowerCase(locale).startsWith(project.title.toLocaleLowerCase(locale))
    ? project.detail.summary : `${project.title}: ${project.detail.summary}`;
  const metadata = pageMetadata(locale, `projects/${project.slug}`, projectTitle(project, locale), description.length > 195 ? `${description.slice(0, 192).replace(/\s+\S*$/, "")}…` : description, project.image?.src);
  const enabled = isProjectSeoEnabled(project);
  return {
    ...metadata,
    robots: { index: enabled, follow: true },
    alternates: { canonical: metadata.alternates?.canonical, ...(enabled ? { languages: metadata.alternates?.languages } : {}) },
    openGraph: { ...metadata.openGraph, alternateLocale: enabled ? metadata.openGraph?.alternateLocale : undefined },
  };
}

export function projectStructuredData(locale: Locale, project: LocalizedProject) {
  if (!isProjectSeoEnabled(project)) return null;
  const url = absoluteUrl(localePath(locale, `projects/${project.slug}`));
  return { "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, name: projectTitle(project, locale), description: project.detail.summary, sku: `MONODEV-${project.id}`, category: project.category, url, ...(project.image ? { image: absoluteUrl(project.image.src) } : {}), brand: { "@type": "Brand", name: siteConfig.name }, offers: { "@type": "Offer", url, price: project.price, priceCurrency: project.currency, availability: "https://schema.org/InStock", seller: { "@id": `${siteConfig.url}/#organization` } } };
}
