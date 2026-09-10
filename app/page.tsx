import Home from "./home-client";
import { pageMetadata } from "./lib/site-config";

export const metadata = pageMetadata("ro", "");

export default function LegacyHome() {
  return <Home initialLocale="ro" />;
}
