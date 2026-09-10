import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cabinet personal — MONO/DEV" };

export default function CabinetLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
