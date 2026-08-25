import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — MONO/DEV",
  description: "Pornește un proiect digital cu MONO/DEV. Trimite brief-ul și primești un răspuns în maximum 48 de ore.",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
