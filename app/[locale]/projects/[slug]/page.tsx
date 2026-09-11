import ProjectView from "./view";
import { notFound } from "next/navigation";


import { isLocale, locales } from "../../../lib/site-config";
import { getProject, publicProjects } from "../../../lib/project-catalog";
import { projectMetadata } from "../../../lib/project-seo";
import "../../../project-pages.css";

type Params = { locale: string; slug: string };
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap(locale => publicProjects.map(project => ({ locale, slug: project.slug })));
}

function resolveProject(params: Params) {
  if (!isLocale(params.locale)) notFound();
  const project = getProject(params.locale, params.slug);
  if (!project) notFound();
  return { locale: params.locale, project };
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale, project } = resolveProject(await params);
  return projectMetadata(locale, project);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, project } = resolveProject(await params);
  return <ProjectView locale={locale} slug={project.slug} />;
}
