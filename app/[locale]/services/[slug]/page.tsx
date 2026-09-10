import { notFound } from "next/navigation";
import { JsonLd, faqSchema } from "../../../components/json-ld";
import { SeoShell } from "../../../components/seo-shell";
import { absoluteUrl, isLocale, localePath, locales, pageMetadata } from "../../../lib/site-config";
import { getService, serviceLabels, services } from "../../../lib/services";
import { getProject, projectHref, projectSlugs, publicProjects } from "../../../lib/project-catalog";

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
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) notFound();
  const copy = service.content[locale];
  const labels = serviceLabels[locale];
  const examples = publicProjects.filter((project) => service.categories.includes(project.type)).slice(0, 3)
    .map((project) => getProject(locale, projectSlugs[project.id])).filter((project) => project !== undefined);
  const related = services.filter((other) => other.slug !== slug && (other.categories.some((category) => service.categories.includes(category)) || ["website-customization", "website-maintenance"].includes(other.slug))).slice(0, 3);
  return <SeoShell locale={locale} path={`services/${slug}`} title={copy.title} description={copy.description}>
    <section className="seo-section"><p>{copy.intro}</p><h2>{labels.problem}</h2><p>{copy.problem}</p></section>
    <section className="seo-section"><h2>{labels.included}</h2><ul>{copy.included.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="seo-section"><h2>{labels.process}</h2><ol>{copy.process.map((item) => <li key={item}>{item}</li>)}</ol></section>
    <section className="seo-section"><h2>{labels.quote}</h2><p>{copy.quote}</p></section>
    <section className="seo-section"><h2>{labels.examples}</h2><p>{labels.examplesNote}</p><div className="seo-grid">{examples.map((project) => <article className="seo-card" key={project.id}>
      <h3><a href={projectHref(locale, project.id)}>{project.title}</a></h3><p>{project.description}</p><a href={projectHref(locale, project.id)}>{labels.detail} →</a>
    </article>)}</div></section>
    <section className="seo-section"><h2>{labels.faq}</h2>{copy.faq.map(({ q, a }) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}</section>
    <section className="seo-section"><h2>{labels.related}</h2><ul>{related.map((other) => <li key={other.slug}><a href={localePath(locale, `services/${other.slug}`)}>{other.content[locale].title}</a></li>)}</ul></section>
    <section className="seo-section seo-cta"><h2>{labels.cta}</h2><a href={localePath(locale, "contact")}>{labels.cta} →</a><p><a href={localePath(locale, "services")}>{labels.all}</a></p></section>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${absoluteUrl(localePath(locale, `services/${slug}`))}#service`, name: copy.title, description: copy.description, url: absoluteUrl(localePath(locale, `services/${slug}`)), serviceType: copy.title, provider: { "@id": absoluteUrl("/#organization") }, areaServed: locale === "en" ? "Worldwide" : "Moldova" }} />
    <JsonLd data={faqSchema(copy.faq)} />
  </SeoShell>;
}
