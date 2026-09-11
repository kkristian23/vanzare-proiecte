import type { Metadata } from "next";
import Admin from "./admin-client";
export const metadata: Metadata = {
  title: "Administrare catalog | MONO/DEV",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://monodev.md/admin" },
};
export default function AdminPage() {
  return <Admin />;
}
