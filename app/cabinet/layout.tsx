import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cabinet personal", description: "Zona personală MONO/DEV.", robots: { index: false, follow: false }, alternates: { canonical: "https://monodev.md/cabinet" } };

export default function CabinetLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
