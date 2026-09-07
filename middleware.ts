import registry from "./showcase-projects/registry.json";

const exportedProjects = new Set(
  registry.filter((project) => !project.disabled).map((project) => project.slug),
);

/** Static hosts differ in how they resolve directory URLs. Use the real entry. */
export function middleware(request: Request) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/|\/$/g, "");
  if (!exportedProjects.has(slug)) return;
  url.pathname = `/${slug}/index.html`;
  return Response.redirect(url, 307);
}

export const config = { matcher: ["/:project", "/:project/"] };
