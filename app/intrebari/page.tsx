import QuestionsPage from "./faq-client";
import { pageMetadata } from "../lib/site-config";
import { faqUi } from "../lib/faq-ui";
export const metadata = pageMetadata("ro", "intrebari", faqUi.ro.title, faqUi.ro.lead);
export default function LegacyQuestions() { return <QuestionsPage initialLocale="ro" />; }
