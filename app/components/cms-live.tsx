"use client";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { firebaseConfigured, firebaseServices } from "../lib/firebase-client";
import {
  getCmsSnapshot,
  CMS_SITE_SCOPE,
  publishCms,
  subscribeCms,
  type CmsSnapshot,
} from "../lib/cms-store";
import { defaultCopy, isLocale } from "../lib/site-config";
import { getProject } from "../lib/project-catalog";
import { projectTitle } from "../lib/project-seo";
import { serviceLabels, getService } from "../lib/services";
import { trustContent, type TrustPath } from "../lib/trust-content";
import { faqUi } from "../lib/faq-ui";
import { contactMeta } from "../lib/contact-meta";
import { JsonLd, organizationSchema } from "./json-ld";
const empty: CmsSnapshot = {};
export function useCms() {
  return useSyncExternalStore(subscribeCms, getCmsSnapshot, () => empty);
}
export function CmsLive() {
  const content = useCms();
  const path = usePathname() ?? "/";
  useEffect(() => {
    if (!firebaseConfigured) return;
    const { db } = firebaseServices();
    return onSnapshot(
      collection(db, "cms"),
      (result) => {
        publishCms(
          Object.fromEntries(
            result.docs
              .filter((doc) => doc.data().site === CMS_SITE_SCOPE)
              .map((doc) => [doc.id, doc.data()]),
          ) as CmsSnapshot,
        );
      },
      () => {
        /* Keep the last confirmed content; initial values remain readable offline. */
      },
    );
  }, []);
  useEffect(() => {
    if (
      !Object.keys(content).length ||
      path.startsWith("/admin") ||
      path.startsWith("/cabinet")
    )
      return;
    const parts = path.split("/").filter(Boolean),
      locale = isLocale(parts[0])
        ? (parts.shift() as "ro" | "ru" | "en")
        : "ro";
    let title: string = defaultCopy[locale].title,
      description: string = defaultCopy[locale].description;
    const project =
      parts[0] === "projects" ? getProject(locale, parts[1]) : undefined;
    const service =
      parts[0] === "services" && parts[1] ? getService(parts[1]) : undefined;
    const trust = trustContent[locale][parts[0] as TrustPath];
    if (project) {
      title = projectTitle(project, locale);
      description = project.detail.summary;
    } else if (service) {
      title =
        service.content[locale].seo?.title ?? service.content[locale].title;
      description =
        service.content[locale].seo?.description ??
        service.content[locale].description;
    } else if (parts[0] === "services") {
      title = serviceLabels[locale].title;
      description = serviceLabels[locale].description;
    } else if (trust) {
      title = trust.title;
      description = trust.description;
    } else if (parts[0] === "contact") {
      title = contactMeta[locale].title;
      description = contactMeta[locale].description;
    } else if (parts[0] === "intrebari") {
      title = faqUi[locale].title;
      description = faqUi[locale].lead;
    }
    if (!title.endsWith("MONO/DEV")) title += " | MONO/DEV";
    document.title = title;
    for (const [selector, value] of [
      ["meta[name='description']", description],
      ["meta[property='og:title']", title],
      ["meta[property='og:description']", description],
      ["meta[name='twitter:title']", title],
      ["meta[name='twitter:description']", description],
    ])
      document.querySelector(selector)?.setAttribute("content", value);
  }, [content, path]);
  return null;
}
export function CmsOrganization() {
  useCms();
  return <JsonLd data={organizationSchema()} />;
}
