export type AnalyticsEvent = "email_click" | "phone_click" | "form_start" | "form_submit" | "project_open" | "demo_open" | "project_request" | "payment_option" | "language_change";
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
export const analyticsConsentKey = "mono-analytics-consent";
export function trackEvent(name: AnalyticsEvent, fields: Record<string, string> = {}) {
  try {
    if (window.location.pathname.replace(/\/+$/, "") === "/cabinet" || localStorage.getItem(analyticsConsentKey) !== "accepted" || !window.gtag) return;
    // Never send form contents, names, email addresses or query parameters.
    window.gtag("event", name, fields);
  } catch { /* Storage may be disabled; analytics remains optional. */ }
}
