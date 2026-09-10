import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultCopy, siteConfig } from "./lib/site-config";
import { HtmlDocument } from "./components/html-document";
import { JsonLd, organizationSchema } from "./components/json-ld";
import { AnalyticsConsent } from "./components/analytics-consent";
import "./base.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin", "cyrillic"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultCopy.ro.title, template: "%s | MONO/DEV" },
  description: defaultCopy.ro.description,
  applicationName: siteConfig.name, creator: siteConfig.name, publisher: siteConfig.name,
  keywords: ["MONO/DEV", "creare site Moldova", "web development", "site-uri gata de lansare"],
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "32x32" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }] },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website", siteName: siteConfig.name,
    title: defaultCopy.ro.title,
    description: defaultCopy.ro.description,
    images: [{ url: siteConfig.ogImage, width: siteConfig.ogWidth, height: siteConfig.ogHeight }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultCopy.ro.title,
    description: defaultCopy.ro.description,
    images: [siteConfig.ogImage],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HtmlDocument className={`${geist.variable} ${mono.variable}`}>{children}<JsonLd data={organizationSchema()} /><AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""} /></HtmlDocument>
  );
}
