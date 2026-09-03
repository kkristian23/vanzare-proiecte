import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./why-section.css";
import "./launch-visuals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mono-dev.ro"),
  title: "MONO/DEV — Proiecte digitale gata de lansare",
  description:
    "Site-uri și produse digitale premium, construite pentru a deveni următoarea ta afacere.",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "MONO/DEV — Idei mari. Deja construite.",
    description: "Proiecte digitale premium, gata de lansare.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONO/DEV — Idei mari. Deja construite.",
    description: "Proiecte digitale premium, gata de lansare.",
    images: ["/og.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body className={`${geist.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
