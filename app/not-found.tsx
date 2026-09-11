"use client";
import { cmsText } from "./lib/cms-store";
import { useCms } from "./components/cms-live";
import Link from "next/link";
export default function NotFound() {
  useCms(); return <main style={{ minHeight: "75vh", padding: "12vh 8%" }}><p>{cmsText("not-found", "literal-6b3c238ebcf1f3c0", "404")}</p><h1>{cmsText("not-found", "literal-788c5f59d64bdbd6", "Pagina nu a fost găsită / Page not found")}</h1><p>{cmsText("not-found", "literal-73b61bbe8775b54c", "Adresa nu corespunde unei pagini disponibile.")}</p><nav aria-label={cmsText("not-found", "literal-a4fe65264ef7dbb3", "Language")}><Link href="/ro">{cmsText("not-found", "literal-fb145909493c40a0", "Catalog RO")}</Link> {cmsText("not-found", "literal-588da410532073f8", " · ")}<Link href="/ru">{cmsText("not-found", "literal-dfe067eb93350ad4", "Каталог RU")}</Link> {cmsText("not-found", "literal-588da410532073f8", " · ")}<Link href="/en">{cmsText("not-found", "literal-823ee6e88878005d", "Catalog EN")}</Link></nav></main>; }
