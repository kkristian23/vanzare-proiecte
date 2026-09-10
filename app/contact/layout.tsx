import { pageMetadata } from "../lib/site-config";

export const metadata = pageMetadata("ro", "contact", "Contact pentru proiectul tău web", "Discută un site, un magazin online sau personalizarea unui proiect MONO/DEV. Contact direct prin email și telefon, în Moldova și internațional.");

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
