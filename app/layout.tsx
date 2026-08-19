import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("https://mono-dev.ro"),
  title: "MONO/DEV — Proiecte digitale gata de lansare",
  description: "Site-uri și produse digitale premium, construite pentru a deveni următoarea ta afacere.",
  openGraph: { title: "MONO/DEV — Idei mari. Deja construite.", description: "Proiecte digitale premium, gata de lansare.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "MONO/DEV — Idei mari. Deja construite.", description: "Proiecte digitale premium, gata de lansare.", images: ["/og.png"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ro"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>; }
