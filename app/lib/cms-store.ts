import published from "./cms-published.json";
/** Shared content view. Static builds start from a public Firestore snapshot, when configured. */
export const CMS_SITE_SCOPE = "monodev-catalog" as const;
export type CmsDocument = {
  site?: typeof CMS_SITE_SCOPE;
  revision: number;
  values?: Record<string, string>;
  standard?: number;
  discounted?: number | null;
  enabled?: boolean;
  images?: CmsImage[];
};
export type CmsImage = { src: string; alt: string; path?: string };
export type CmsSnapshot = Record<string, CmsDocument>;
export type InstallmentPlan = { months: number; surcharge: number };
export type RentalService = { name: string; price: number; included: boolean };
export type RentalBenefit = { name: string; included: boolean };
export type PaymentSettings = {
  installmentPlans: InstallmentPlan[];
  rentalMonths: number;
  rentalServices: RentalService[];
  rentalBenefits: RentalBenefit[];
  installmentServices: RentalBenefit[];
  installmentBenefits: RentalBenefit[];
};
export const defaultPaymentSettings: PaymentSettings = {
  installmentPlans: [
    { months: 3, surcharge: 0 },
    { months: 6, surcharge: 5 },
    { months: 12, surcharge: 8 },
  ],
  rentalMonths: 18,
  rentalServices: [
    { name: "Găzduire web", price: 10, included: true },
    { name: "Mentenanță tehnică", price: 20, included: true },
    { name: "Securitate și backup", price: 10, included: true },
  ],
  rentalBenefits: [
    { name: "Site pregătit pentru utilizare", included: true },
    { name: "Actualizări și îmbunătățiri", included: true },
  ],
  installmentServices: [
    { name: "Găzduire gratuită primele 2 luni", included: true },
    { name: "Mentenanță tehnică lunară gratuită primele 2 luni", included: true },
  ],
  installmentBenefits: [
    { name: "Devii proprietarul siteului", included: true },
    { name: "Plată flexibilă în rate", included: true },
  ],
};
let snapshot: CmsSnapshot = published as CmsSnapshot;
const listeners = new Set<() => void>();
export const getCmsSnapshot = () => snapshot;
export const subscribeCms = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function publishCms(next: CmsSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}
export function cmsText(group: string, key: string, fallback: string): string {
  const value = snapshot[`text-${group}`]?.values?.[key];
  return typeof value === "string" && value.length <= 20000 ? value : fallback;
}
const finiteSetting = (
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
};
function readPaymentItems(values: Record<string, string> | undefined, prefix: string, fallback: RentalBenefit[]): RentalBenefit[] {
  if (values?.[`${prefix}Count`] === "0") return [];
  const pattern = new RegExp(`^${prefix}(\\d+)Name$`);
  const indices = Object.keys(values ?? {}).flatMap((key) => {
    const match = pattern.exec(key);
    return match ? [Number(match[1])] : [];
  }).sort((a, b) => a - b);
  if (!indices.length) return fallback.map((item) => ({ ...item }));
  return indices.map((index) => ({
    name: values?.[`${prefix}${index}Name`]?.trim() ?? "",
    included: values?.[`${prefix}${index}Included`] !== "false",
  }));
}

/** Both individual and queued admin saves use the same independent list keys. */
export function paymentSettingsToValues(settings: PaymentSettings): Record<string, string> {
  const values: Record<string, string> = { rentalMonths: String(settings.rentalMonths) };
  settings.installmentPlans.forEach((plan, index) => {
    values[`plan${index + 1}Months`] = String(plan.months);
    values[`plan${index + 1}Surcharge`] = String(plan.surcharge);
  });
  for (const [prefix, items] of [
    ["rentalService", settings.rentalServices],
    ["rentalBenefit", settings.rentalBenefits],
    ["installmentService", settings.installmentServices],
    ["installmentBenefit", settings.installmentBenefits],
  ] as const) {
    values[`${prefix}Count`] = String(items.length);
    items.forEach((item, index) => {
      values[`${prefix}${index + 1}Name`] = item.name.trim();
      values[`${prefix}${index + 1}Included`] = String(item.included);
      if ("price" in item) values[`${prefix}${index + 1}Price`] = String(item.price);
    });
  }
  return values;
}

export function paymentSettingsFromValues(
  values?: Record<string, string>,
): PaymentSettings {
  const planNumbers = [...new Set(
    Object.keys(values ?? {}).flatMap((key) => {
      const match = /^plan(\d+)Months$/.exec(key);
      return match ? [Number(match[1])] : [];
    }),
  )]
    .filter((index) => Number.isInteger(index) && index >= 1)
    .sort((left, right) => left - right);
  if (!planNumbers.length) return defaultPaymentSettings;
  const installmentPlans = planNumbers
    .flatMap((index) => {
      const months = Number(values?.[`plan${index}Months`]);
      const surcharge = Number(values?.[`plan${index}Surcharge`]);
      return Number.isInteger(months) &&
        months >= 1 &&
        months <= 60 &&
        Number.isFinite(surcharge) &&
        surcharge >= 0 &&
        surcharge <= 100
        ? [{ months, surcharge }]
        : [];
    })
    .sort((left, right) => left.months - right.months);
  if (
    !installmentPlans.length ||
    new Set(installmentPlans.map(({ months }) => months)).size !==
      installmentPlans.length
  )
    return defaultPaymentSettings;
  return {
    installmentPlans,
    rentalMonths: Math.floor(
      finiteSetting(
        values?.rentalMonths,
        defaultPaymentSettings.rentalMonths,
        1,
        60,
      ),
    ),
    rentalServices: (() => {
      if (values?.rentalServiceCount === "0") return [];
      const indices = [...new Set(Object.keys(values ?? {}).flatMap((key) => /^rentalService(\d+)Name$/.exec(key)?.[1] ?? []))].map(Number).sort((a, b) => a - b);
      if (indices.length) return indices.flatMap((index) => {
        const name = values?.[`rentalService${index}Name`]?.trim() ?? "";
        const price = Number(values?.[`rentalService${index}Price`]);
        return name && Number.isFinite(price) && price >= 0 && price <= 100000 ? [{ name, price, included: values?.[`rentalService${index}Included`] !== "false" }] : [];
      });
      return defaultPaymentSettings.rentalServices.map((service, index) => ({
        ...service,
        price: finiteSetting(values?.[["rentalHosting", "rentalMaintenance", "rentalSecurity"][index]], service.price, 0, 100000),
      }));
    })(),
    rentalBenefits: readPaymentItems(values, "rentalBenefit", defaultPaymentSettings.rentalBenefits),
    installmentServices: readPaymentItems(values, "installmentService", defaultPaymentSettings.installmentServices),
    installmentBenefits: readPaymentItems(values, "installmentBenefit", defaultPaymentSettings.installmentBenefits),
  };
}
export function paymentSettings(): PaymentSettings {
  return paymentSettingsFromValues(snapshot["text-payment-settings"]?.values);
}
export function validatePaymentSettings(settings: PaymentSettings): string | null {
  if (
    settings.installmentPlans.length < 1 ||
    settings.installmentPlans.some(
      ({ months, surcharge }) =>
        !Number.isInteger(months) ||
        months < 1 ||
        !Number.isFinite(surcharge) ||
        surcharge < 0 ||
        surcharge > 100,
    ) ||
    new Set(settings.installmentPlans.map(({ months }) => months)).size !==
      settings.installmentPlans.length
  )
    return "Planurile de rate trebuie să aibă perioade distincte de minimum o lună și procente între 0% și 100%.";
  if (!Number.isInteger(settings.rentalMonths) || settings.rentalMonths < 1 || settings.rentalMonths > 60)
    return "Perioada chiriei trebuie să fie între 1 și 60 de luni.";
  if (
    settings.rentalServices.some(
      (service) => !service.name.trim() || !Number.isFinite(service.price) || service.price < 0 || service.price > 100000,
    )
  )
    return "Prețurile serviciilor de chirie trebuie să fie între 0 și 100.000 EUR.";
  if ([...settings.rentalBenefits, ...settings.installmentServices, ...settings.installmentBenefits].some((item) => !item.name.trim() || item.name.length > 200 || typeof item.included !== "boolean"))
    return "Completează denumirea fiecărui serviciu și beneficiu (maximum 200 de caractere).";
  return null;
}
const structural = new Set([
  "id",
  "slug",
  "type",
  "tone",
  "platform",
  "mobileOS",
  "demo",
  "src",
  "srcSet",
  "fallback",
  "code",
  "href",
  "url",
  "categories",
  "locales",
  "defaultLocale",
  "ogImage",
  "socialProfiles",
]);
/** Lazy reads preserve localized arrays and derived content without mutating source data. */
export function cmsContent<T extends object>(
  group: string,
  defaults: T,
  prefix = "",
): T {
  return new Proxy(defaults, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof property !== "string" || structural.has(property))
        return value;
      const key = prefix ? `${prefix}.${property}` : property;
      if (typeof value === "string") return cmsText(group, key, value);
      if (value && typeof value === "object")
        return cmsContent(group, value, key);
      return value;
    },
  });
}
export type Price = {
  standard: number;
  discounted: number | null;
  enabled: boolean;
};
export function validatePrice(price: Price): string | null {
  if (
    !Number.isFinite(price.standard) ||
    price.standard < 0 ||
    price.standard > 100000000
  )
    return "Prețul standard trebuie să fie un număr între 0 și 100.000.000 EUR.";
  if (
    price.discounted !== null &&
    (!Number.isFinite(price.discounted) ||
      price.discounted <= 0 ||
      price.discounted >= price.standard)
  )
    return "Prețul redus trebuie să fie mai mare decât zero și strict mai mic decât prețul standard.";
  if (price.enabled && price.discounted === null)
    return "Introdu un preț redus valid înainte de activarea reducerii.";
  return null;
}
export function projectPrice(id: number, fallback: number): Price {
  const doc = snapshot[`price-${id}`];
  const price = {
    standard: doc?.standard ?? fallback,
    discounted: doc?.discounted ?? null,
    enabled: doc?.enabled ?? false,
  };
  const validPrice = validatePrice(price)
    ? { standard: fallback, discounted: null, enabled: false }
    : price;
  return {
    ...validPrice,
    standard: Math.floor(validPrice.standard),
    discounted: validPrice.discounted === null ? null : Math.floor(validPrice.discounted),
  };
}
export function effectivePrice(id: number, fallback: number) {
  const p = projectPrice(id, fallback);
  return p.enabled ? p.discounted! : p.standard;
}
export function liveProject<T extends { id: number; price: number }>(
  project: T,
): T {
  return new Proxy(project, {
    get(target, key, receiver) {
      return key === "price"
        ? effectivePrice(target.id, target.price)
        : Reflect.get(target, key, receiver);
    },
  });
}
export function safeImageSource(src: string) {
  return (
    /^\/(?!\/)/.test(src) ||
    /^https:\/\/firebasestorage\.googleapis\.com\//.test(src)
  );
}
export function slotImages(slot: string): CmsImage[] | undefined {
  const images = snapshot[`media-${slot}`]?.images;
  return Array.isArray(images)
    ? images
        .filter(
          (img) =>
            img &&
            typeof img.src === "string" &&
            safeImageSource(img.src) &&
            typeof img.alt === "string",
        )
        .slice(0, 12)
    : undefined;
}
