import type { Locale } from "./site-config";
import { cmsContent } from "./cms-store";

/** Keep payment intent intact when catalogue links prepare an email. */
export function contactOptionLabel(locale: Locale, option: string): string {
  const copy = cmsContent("contact-request-options", {
    ro: { purchase: "achiziție", rental: "chirie", withServices: "chirie cu servicii", withoutServices: "chirie fără servicii", installments: "rate", months: "luni", unspecified: "de discutat" },
    ru: { purchase: "покупка", rental: "аренда", withServices: "аренда с услугами", withoutServices: "аренда без услуг", installments: "рассрочка", months: "месяцев", unspecified: "обсудим условия" },
    en: { purchase: "purchase", rental: "rental", withServices: "rental with services", withoutServices: "rental without services", installments: "instalments", months: "months", unspecified: "to be discussed" },
  })[locale];
  if (option === "purchase") return copy.purchase;
  if (option === "rental" || option === "rent") return copy.rental;
  if (option === "site-rental-with-services") return copy.withServices;
  if (option === "site-rental-without-services") return copy.withoutServices;
  if (option === "installments") return copy.installments;
  const term = /^installments-(\d{1,2})-months$/.exec(option);
  if (term) return `${copy.installments}: ${Number(term[1])} ${copy.months}`;
  return copy.unspecified;
}

export function contactRequestMessage(locale: Locale, project: string, option: string): string {
  const label = contactOptionLabel(locale, option);
  const templates = cmsContent("contact-request-message", {
    ro: "Sunt interesat(ă) de proiectul {proiect}. Opțiune: {optiune}.",
    ru: "Меня интересует проект {proiect}. Вариант: {optiune}.",
    en: "I am interested in {proiect}. Option: {optiune}.",
  });
  return templates[locale].replaceAll("{proiect}", project).replaceAll("{optiune}", label);
}
