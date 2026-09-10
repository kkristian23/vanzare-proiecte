import Link from "next/link";
export default function NotFound() { return <main style={{ minHeight: "75vh", padding: "12vh 8%" }}><p>404</p><h1>Pagina nu a fost găsită / Page not found</h1><p>Adresa nu corespunde unei pagini disponibile.</p><nav aria-label="Language"><Link href="/ro">Catalog RO</Link> · <Link href="/ru">Каталог RU</Link> · <Link href="/en">Catalog EN</Link></nav></main>; }
