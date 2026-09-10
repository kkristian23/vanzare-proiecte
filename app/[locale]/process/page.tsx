import { TrustPage, trustMetadata, type TrustPageProps } from "../../components/trust-page";
import { locales } from "../../lib/site-config";

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export function generateMetadata(props: TrustPageProps) { return trustMetadata(props, "process"); }
export default function Page(props: TrustPageProps) { return <TrustPage {...props} path="process" />; }
