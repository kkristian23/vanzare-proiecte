import { publicProjects } from "./project-catalog";
import { isProjectSeoEnabled } from "./project-seo";
import { services } from "./services";
import { locales, localePath } from "./site-config";

/** Canonical indexable routes only; availability of a project is independent. */
export function indexablePaths(projects = publicProjects, serviceList = services) {
  return ["", "contact", "intrebari", "services", "about", "process", "privacy", "terms", "cookies",
    ...projects.filter(isProjectSeoEnabled).map(project => `projects/${project.slug}`),
    ...serviceList.map(service => `services/${service.slug}`)];
}

export function noindexProjectPaths(projects = publicProjects) {
  return projects.filter(project => !isProjectSeoEnabled(project)).flatMap(project =>
    locales.flatMap(locale => {
      const pathname = localePath(locale, `projects/${project.slug}`);
      return [pathname, `${pathname}/`, `${pathname}.html`, `${pathname}/index`, `${pathname}/index/`, `${pathname}/index.html`];
    }));
}
