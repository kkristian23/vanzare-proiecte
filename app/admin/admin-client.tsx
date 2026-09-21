"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  firebaseConfigured,
  firebaseMessage,
  firebaseServices,
} from "../lib/firebase-client";
import {
  type CmsDocument,
  type CmsImage,
  defaultPaymentSettings,
  paymentSettingsFromValues,
  paymentSettingsToValues,
  type PaymentSettings,
  type Price,
  validatePaymentSettings,
  validatePrice,
} from "../lib/cms-store";
import {
  projects,
  projectPaths,
  projectSlugs,
  getProject,
  launchProjectIds,
} from "../lib/project-catalog";
import { displayImageUrl } from "../lib/cms-image-url";
import { projectCardImages } from "../lib/project-card-images";
import { BrandLogo } from "../brand-logo";
import {
  readDocument,
  readDocuments,
  saveDocument,
  saveDocuments,
  uploadImage,
  validateImage,
} from "./repository";
import registry from "./content-registry.json";
import "./admin.css";
import { PaymentItemsEditor } from "./payment-items-editor";

type Section = "text" | "media" | "price" | "discount" | "payment";
type AdminNavigationCategory = "text" | "media" | "pricing" | "payment";
type DiscountStatusFilter = "all" | "active" | "inactive";
type PriceSort = "newest" | "alphabetical" | "low-high" | "high-low";
type DraftImage = CmsImage & { file?: File };
type SavedPrice = Price & { revision: number };
type OptionalNumber = number | "";
type StoredPaymentSettings = {
  installmentPlans: { months: OptionalNumber; surcharge: OptionalNumber }[];
  rentalMonths: OptionalNumber;
  rentalServices?: { name: string; price: OptionalNumber; included?: boolean }[];
  rentalBenefits?: { name: string; included?: boolean }[];
  installmentBenefits?: { name: string; included?: boolean }[];
  installmentServices?: { name: string; included?: boolean }[];
};
const discountPercentages = [10, 20, 30, 40, 50, 60, 70, 80, 90] as const;
const discountStatusFilters: readonly [DiscountStatusFilter, string][] = [
  ["all", "Toate"],
  ["active", "Cu reducere"],
  ["inactive", "Fără reducere"],
];
const priceSortOptions: readonly [PriceSort, string][] = [
  ["newest", "Cele mai noi"],
  ["alphabetical", "Ordine alfabetică"],
  ["low-high", "Preț mic → mare"],
  ["high-low", "Preț mare → mic"],
];
const projectPageSize = 25;
const nextInstallmentMonths = (plans: PaymentSettings["installmentPlans"]) => {
  const used = new Set(plans.map((plan) => plan.months));
  return [3, 6, 9, 12, 18, 24, 36, 48, 60].find(
    (months) => !used.has(months),
  ) ?? Math.max(0, ...plans.map(({ months }) => Number.isFinite(months) ? months : 0)) + 1;
};
const euro = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const textGroups = registry as unknown as {
  id: string;
  site: "monodev-catalog";
  label: string;
  fields: Record<string, string>;
}[];
const catalog = projects
  .map((project) => ({
    id: project.id,
    title: project.title,
    price: project.price,
    slug: projectSlugs[project.id],
  }))
  .sort((left, right) =>
    left.title.localeCompare(right.title, "ro", { sensitivity: "base" }),
  );
const mediaSlots = catalog.flatMap((project) => [
  {
    id: `media-catalog-${project.slug}`,
    label: `Card în catalog · ${project.title}`,
    max: 1,
    images:
      launchProjectIds.has(project.id) || project.id >= 67 || project.id === 7
        ? [
            {
              src:
                projectCardImages[project.slug]?.fallback ??
                (project.id === 7
                  ? "/projects/micora-cover.png"
                  : `/project-previews/${project.slug}.png`),
              alt: `${project.title} — ${getProject("ro", project.slug)?.description ?? ""}`,
            },
          ]
        : [],
  },
  {
    id: `media-detail-${project.slug}`,
    label: `Pagina proiectului în catalog · ${project.title}`,
    max: 12,
    images: getProject("ro", project.slug)?.image
      ? [
          {
            src: getProject("ro", project.slug)!.image!.src,
            alt: getProject("ro", project.slug)!.image!.alt,
          },
        ]
      : [],
  },
]);
function adminLocation() {
  const params =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URL(window.location.href).searchParams;
  const requestedSection = params.get("section");
  const section: Section = ["text", "media", "price", "discount", "payment"].includes(
    requestedSection ?? "",
  )
    ? (requestedSection as Section)
    : "text";
  const requestedSelection = params.get("selection");
  const selection =
    section === "text"
      ? textGroups.some(({ id }) => id === requestedSelection)
        ? requestedSelection!
        : textGroups[0].id
      : section === "media"
        ? mediaSlots.some(({ id }) => id === requestedSelection)
          ? requestedSelection!
          : mediaSlots[0].id
        : section === "price"
          ? "prices"
          : section === "discount"
            ? "discounts"
            : "text-payment-settings";
  const language = ["all", "ro", "ru", "en"].includes(
    params.get("language") ?? "",
  )
    ? params.get("language")!
    : "all";
  const requestedPage = Number(params.get("page"));
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage - 1
    : 0;
  const validPriceRangeValue = (value: string | null) => {
    if (value === null || value.trim() === "") return "";
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? value : "";
  };
  const priceMin = validPriceRangeValue(params.get("priceMin"));
  const priceMax = validPriceRangeValue(params.get("priceMax"));
  const requestedDiscountPercent = Number(params.get("discountPercent"));
  const discountPercent = discountPercentages.includes(
    requestedDiscountPercent as (typeof discountPercentages)[number],
  )
    ? requestedDiscountPercent
    : 10;
  const requestedDiscountStatus = params.get("discountStatus");
  const discountStatusFilter: DiscountStatusFilter = [
    "all",
    "active",
    "inactive",
  ].includes(requestedDiscountStatus ?? "")
    ? (requestedDiscountStatus as DiscountStatusFilter)
    : "all";
  const requestedPriceSort = params.get("priceSort");
  const priceSort: PriceSort = [
    "newest",
    "alphabetical",
    "low-high",
    "high-low",
  ].includes(requestedPriceSort ?? "")
    ? (requestedPriceSort as PriceSort)
    : "alphabetical";
  return {
    section,
    selection,
    search: params.get("search") ?? "",
    projectSearch: params.get("projectSearch") ?? "",
    language,
    page,
    priceMin,
    priceMax,
    discountPercent,
    discountStatusFilter,
    priceSort,
  };
}
type AdminUrlState = ReturnType<typeof adminLocation>;
function adminHref(state: AdminUrlState, hasDraft = false) {
  const url = new URL(window.location.href);
  url.searchParams.set("section", state.section);
  if (state.section === "text" || state.section === "media")
    url.searchParams.set("selection", state.selection);
  else url.searchParams.delete("selection");
  const setOptional = (key: string, value: string, fallback = "") => {
    if (value !== fallback) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  };
  setOptional("search", state.search);
  setOptional("projectSearch", state.projectSearch);
  setOptional("language", state.language, "all");
  setOptional("page", state.page ? String(state.page + 1) : "");
  setOptional("priceMin", state.priceMin);
  setOptional("priceMax", state.priceMax);
  setOptional(
    "discountPercent",
    state.discountPercent !== 10 ? String(state.discountPercent) : "",
  );
  setOptional("discountStatus", state.discountStatusFilter, "all");
  setOptional("priceSort", state.priceSort, "alphabetical");
  setOptional("draft", hasDraft ? "local" : "");
  return `${url.pathname}${url.search}${url.hash}`;
}
const draftKey = (section: Section, selection: string) =>
  `monodev-admin-draft:${section}:${selection}`;
const adminDraftPrefix = "monodev-admin-draft:";
const activeAdminDrafts = new Set<string>();
type StoredAdminDraft = {
  key: string;
  section: Section;
  selection: string;
  value: unknown;
};
function storedAdminDrafts(_version = 0): StoredAdminDraft[] {
  if (typeof window === "undefined") return [];
  const sections: Section[] = ["text", "media", "price", "discount", "payment"];
  const drafts: StoredAdminDraft[] = [];
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(adminDraftPrefix)) continue;
      const separator = key.indexOf(":", adminDraftPrefix.length);
      if (separator === -1) continue;
      const section = key.slice(adminDraftPrefix.length, separator) as Section;
      const selection = key.slice(separator + 1);
      const stored = window.localStorage.getItem(key);
      if (!sections.includes(section) || !selection || !stored) continue;
      drafts.push({ key, section, selection, value: JSON.parse(stored) });
      activeAdminDrafts.add(key);
    }
  } catch {
    // A malformed or unavailable local storage must not block the editor.
  }
  return drafts;
}
function storedPaymentSettings(settings: PaymentSettings): StoredPaymentSettings {
  return {
    installmentPlans: settings.installmentPlans.map((plan) => ({
      months: Number.isNaN(plan.months) ? "" : plan.months,
      surcharge: Number.isNaN(plan.surcharge) ? "" : plan.surcharge,
    })),
    rentalMonths: Number.isNaN(settings.rentalMonths) ? "" : settings.rentalMonths,
    rentalServices: settings.rentalServices.map((service) => ({
      name: service.name,
      price: Number.isNaN(service.price) ? "" : service.price,
      included: service.included,
    })),
    rentalBenefits: settings.rentalBenefits.map((benefit) => ({ name: benefit.name, included: benefit.included })),
    installmentBenefits: settings.installmentBenefits.map((item) => ({ ...item })),
    installmentServices: settings.installmentServices.map((item) => ({ ...item })),
  };
}
function readAdminDraft<T>(section: Section, selection: string): T | null {
  try {
    const key = draftKey(section, selection);
    const stored = window.localStorage.getItem(key);
    if (!stored) return null;
    activeAdminDrafts.add(key);
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}
function sameNumber(left: number, right: number) {
  return left === right || (Number.isNaN(left) && Number.isNaN(right));
}
function samePaymentSettings(left: PaymentSettings, right: PaymentSettings) {
  return (
    sameNumber(left.rentalMonths, right.rentalMonths) &&
    left.installmentPlans.length === right.installmentPlans.length &&
    left.rentalServices.length === right.rentalServices.length &&
    left.rentalBenefits.length === right.rentalBenefits.length &&
    left.installmentBenefits.length === right.installmentBenefits.length &&
    left.installmentBenefits.every((item, index) => item.name === right.installmentBenefits[index].name && item.included === right.installmentBenefits[index].included) &&
    left.installmentServices.length === right.installmentServices.length &&
    left.installmentServices.every((item, index) => item.name === right.installmentServices[index].name && item.included === right.installmentServices[index].included) &&
    left.installmentPlans.every(
      (plan, index) =>
        sameNumber(plan.months, right.installmentPlans[index].months) &&
        sameNumber(plan.surcharge, right.installmentPlans[index].surcharge),
    ) &&
    left.rentalServices.every(
      (service, index) =>
        service.name === right.rentalServices[index].name &&
        sameNumber(service.price, right.rentalServices[index].price) &&
        service.included === right.rentalServices[index].included,
    )
    && left.rentalBenefits.every(
      (benefit, index) => benefit.name === right.rentalBenefits[index].name && benefit.included === right.rentalBenefits[index].included,
    )
  );
}
function DraftStatus({ isDraft, onRestore }: { isDraft: boolean; onRestore: () => void }) {
  if (!isDraft) return null;
  return <span className="admin-draft-status">Draft<button type="button" onClick={onRestore}>Restabilește</button></span>;
}
function writeAdminDraft(section: Section, selection: string, value: unknown) {
  try {
    const key = draftKey(section, selection);
    window.localStorage.setItem(key, JSON.stringify(value));
    activeAdminDrafts.add(key);
  } catch {
    // The editor remains usable if private browsing or a full quota blocks storage.
  }
}
function clearAdminDraft(section: Section, selection: string) {
  try {
    const key = draftKey(section, selection);
    window.localStorage.removeItem(key);
    activeAdminDrafts.delete(key);
  } catch {
    // Nothing else is required when local storage is unavailable.
  }
}
function hasAdminDraftForCategory(category: AdminNavigationCategory) {
  const sections: Section[] =
    category === "pricing" ? ["price", "discount"] : [category];
  const matchesCategory = (key: string) =>
    sections.some((section) => key.startsWith(`monodev-admin-draft:${section}:`));

  if (Array.from(activeAdminDrafts).some(matchesCategory)) return true;
  if (typeof window === "undefined") return false;
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && matchesCategory(key)) return true;
    }
  } catch {
    // A blocked local storage must not affect navigation.
  }
  return false;
}
function fieldLabel(key: string) {
  const names: Record<string, string> = {
    ro: "Română",
    ru: "Rusă",
    en: "Engleză",
    title: "Titlu",
    subtitle: "Subtitlu",
    description: "Descriere",
    desc: "Descriere",
    summary: "Rezumat",
    hero: "Introducere",
    footer: "Footer",
    nav: "Navigare",
    sections: "Secțiuni",
    items: "Elemente",
    questions: "Întrebări",
    question: "Întrebare",
    answer: "Răspuns",
    paragraphs: "Paragrafe",
    email: "Email",
    phone: "Telefon",
    country: "Țară",
    name: "Nume",
    contact: "Contact",
    cta: "Buton",
    features: "Funcționalități",
    text: "Text",
    label: "Etichetă",
    stack: "Tehnologii",
  };
  if (key.startsWith("literal-")) return "Text afișat";
  return key
    .split(".")
    .map(
      (part) =>
        names[part] ??
        (/^\d+$/.test(part)
          ? `#${Number(part) + 1}`
          : part.replace(/([a-z])([A-Z])/g, "$1 $2")),
    )
    .join(" / ");
}
export default function Admin() {
  const [access, setAccess] = useState<
    "loading" | "login" | "denied" | "admin"
  >(firebaseConfigured ? "loading" : "login");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [leaveAction, setLeaveAction] = useState<(() => void) | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [section, setSection] = useState<Section>(
    () => adminLocation().section,
  );
  const [selection, setSelection] = useState(
    () => adminLocation().selection,
  );
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [draftsVersion, setDraftsVersion] = useState(0);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [projectPriceDrafts, setProjectPriceDrafts] = useState<Record<number, string>>(
    {},
  );
  const [editedPriceIds, setEditedPriceIds] = useState<number[]>([]);
  const [paymentDraft, setPaymentDraft] = useState<PaymentSettings>(
    defaultPaymentSettings,
  );
  const [savedPaymentDraft, setSavedPaymentDraft] = useState<PaymentSettings>(
    defaultPaymentSettings,
  );
  const [discountPercent, setDiscountPercent] = useState(
    () => adminLocation().discountPercent,
  );
  const [priceMinInput, setPriceMinInput] = useState(
    () => adminLocation().priceMin,
  );
  const [priceMaxInput, setPriceMaxInput] = useState(
    () => adminLocation().priceMax,
  );
  const [appliedPriceMin, setAppliedPriceMin] = useState(
    () => adminLocation().priceMin,
  );
  const [appliedPriceMax, setAppliedPriceMax] = useState(
    () => adminLocation().priceMax,
  );
  const [discountStatusFilter, setDiscountStatusFilter] =
    useState<DiscountStatusFilter>(() => adminLocation().discountStatusFilter);
  const [discountStatusInput, setDiscountStatusInput] =
    useState<DiscountStatusFilter>(() => adminLocation().discountStatusFilter);
  const [priceSort, setPriceSort] = useState<PriceSort>(
    () => adminLocation().priceSort,
  );
  const [priceSortInput, setPriceSortInput] = useState<PriceSort>(
    () => adminLocation().priceSort,
  );
  const [discountProjectIds, setDiscountProjectIds] = useState<number[]>([]);
  const [discountOverrides, setDiscountOverrides] = useState<
    Record<number, OptionalNumber>
  >({});
  const [discountPrices, setDiscountPrices] = useState<Record<number, SavedPrice>>(
    {},
  );
  const [images, setImages] = useState<DraftImage[]>([]);
  const [search, setSearch] = useState(() => adminLocation().search);
  const [projectSearch, setProjectSearch] = useState(
    () => adminLocation().projectSearch,
  );
  const [language, setLanguage] = useState(() => adminLocation().language);
  const [page, setPage] = useState(() => adminLocation().page);
  const previews = useRef(new Set<string>());
  const uploads = useRef(new Map<File, CmsImage>());
  const dirtyRef = useRef(false);
  const hrefRef = useRef("");
  const priceFilterRef = useRef<HTMLDetailsElement>(null);
  const savedDrafts = storedAdminDrafts(draftsVersion);
  const currentDraftKey = draftKey(section, selection);
  const globalDraftCount = savedDrafts.some(({ key }) => key === currentDraftKey)
    ? savedDrafts.length
    : savedDrafts.length + Number(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      const dropdown = priceFilterRef.current;
      if (
        !dropdown?.open ||
        !(event.target instanceof Node) ||
        dropdown.contains(event.target)
      )
        return;
      dropdown.removeAttribute("open");
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !priceFilterRef.current?.open) return;
      priceFilterRef.current.removeAttribute("open");
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  useEffect(() => {
    const state = {
      section,
      selection,
      search,
      projectSearch,
      language,
      page,
      priceMin: appliedPriceMin,
      priceMax: appliedPriceMax,
      discountPercent,
      discountStatusFilter,
      priceSort,
    };
    const href = adminHref(state, dirty);
    hrefRef.current = href;
    window.history.replaceState(null, "", href);
  }, [
    section,
    selection,
    search,
    projectSearch,
    language,
    page,
    appliedPriceMin,
    appliedPriceMax,
    discountPercent,
    discountStatusFilter,
    priceSort,
    dirty,
  ]);
  useEffect(() => {
    const restoreLocation = () => {
      const next = adminLocation();
      const applyLocation = () => {
        setDirty(false);
        setSection(next.section);
        setSelection(next.selection);
        setSearch(next.search);
        setProjectSearch(next.projectSearch);
        setPage(next.page);
        setLanguage(next.language);
        setPriceMinInput(next.priceMin);
        setPriceMaxInput(next.priceMax);
        setAppliedPriceMin(next.priceMin);
        setAppliedPriceMax(next.priceMax);
        setDiscountPercent(next.discountPercent);
        setDiscountStatusFilter(next.discountStatusFilter);
        setDiscountStatusInput(next.discountStatusFilter);
        setPriceSort(next.priceSort);
        setPriceSortInput(next.priceSort);
        setMessage("");
        setError("");
      };
      if (dirtyRef.current) {
        window.history.pushState(null, "", hrefRef.current);
        setLeaveAction(() => applyLocation);
        return;
      }
      applyLocation();
    };
    window.addEventListener("popstate", restoreLocation);
    return () => window.removeEventListener("popstate", restoreLocation);
  }, []);
  const group = textGroups.find((group) => group.id === selection);
  const slot = mediaSlots.find((slot) => slot.id === selection);
  const items =
    section === "text"
      ? textGroups
      : section === "media"
        ? mediaSlots
        : [];
  const fields = Object.entries(group?.fields ?? {}).filter(
    ([key, original]) =>
      (language === "all" || key.split(".").includes(language)) &&
      `${fieldLabel(key)} ${original} ${values[key] ?? ""}`
        .toLocaleLowerCase("ro")
        .includes(search.toLocaleLowerCase("ro")),
  );
  const selectedDiscounts = new Set(discountProjectIds);
  const normalizedProjectSearch = projectSearch.trim().toLocaleLowerCase("ro");
  const searchFilteredCatalog = normalizedProjectSearch
    ? catalog.filter((project) =>
        project.title.toLocaleLowerCase("ro").includes(normalizedProjectSearch),
      )
    : catalog;
  const minimumPrice = appliedPriceMin === "" ? null : Number(appliedPriceMin);
  const maximumPrice = appliedPriceMax === "" ? null : Number(appliedPriceMax);
  const priceForProject = (project: (typeof catalog)[number]) => {
    const saved = discountPrices[project.id];
    const standard = Math.floor(saved?.standard ?? project.price);
    return (
      section === "discount" && saved?.enabled && saved.discounted !== null
        ? Math.floor(saved.discounted)
        : standard
    );
  };
  const priceFilteredCatalog = searchFilteredCatalog.filter((project) => {
    const priceForFilter = priceForProject(project);
    return (
      (minimumPrice === null || priceForFilter >= minimumPrice) &&
      (maximumPrice === null || priceForFilter <= maximumPrice)
    );
  });
  const statusFilteredCatalog =
    discountStatusFilter !== "all"
      ? priceFilteredCatalog.filter((project) =>
          discountStatusFilter === "active"
            ? section === "discount"
              ? selectedDiscounts.has(project.id)
              : Boolean(discountPrices[project.id]?.enabled)
            : section === "discount"
              ? !selectedDiscounts.has(project.id)
              : !discountPrices[project.id]?.enabled,
        )
      : priceFilteredCatalog;
  const filteredCatalog = [...statusFilteredCatalog].sort((left, right) => {
    if (priceSort === "newest") return right.id - left.id;
    if (priceSort === "low-high")
      return priceForProject(left) - priceForProject(right);
    if (priceSort === "high-low")
      return priceForProject(right) - priceForProject(left);
    return left.title.localeCompare(right.title, "ro", { sensitivity: "base" });
  });
  const discountPageCount = Math.max(
    1,
    Math.ceil(filteredCatalog.length / projectPageSize),
  );
  const discountCurrentPage = Math.min(page, discountPageCount - 1);
  const visibleDiscountProjects = filteredCatalog.slice(
    discountCurrentPage * projectPageSize,
    (discountCurrentPage + 1) * projectPageSize,
  );
  const pricePageCount = Math.max(
    1,
    Math.ceil(filteredCatalog.length / projectPageSize),
  );
  const priceCurrentPage = Math.min(page, pricePageCount - 1);
  const visiblePriceProjects = filteredCatalog.slice(
    priceCurrentPage * projectPageSize,
    (priceCurrentPage + 1) * projectPageSize,
  );
  const applyPriceRange = () => {
    const minimum = priceMinInput === "" ? null : Number(priceMinInput);
    const maximum = priceMaxInput === "" ? null : Number(priceMaxInput);
    if (
      (minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) ||
      (maximum !== null && (!Number.isFinite(maximum) || maximum < 0))
    ) {
      setError("Introdu valori de preț valide, mai mari sau egale cu zero.");
      return false;
    }
    if (minimum !== null && maximum !== null && minimum > maximum) {
      setError("Prețul minim nu poate fi mai mare decât prețul maxim.");
      return false;
    }
    setError("");
    setAppliedPriceMin(priceMinInput);
    setAppliedPriceMax(priceMaxInput);
    setDiscountStatusFilter(discountStatusInput);
    setPriceSort(priceSortInput);
    setPage(0);
    return true;
  };
  const resetPriceRange = () => {
    setPriceMinInput("");
    setPriceMaxInput("");
    setAppliedPriceMin("");
    setAppliedPriceMax("");
    setDiscountStatusInput("all");
    setDiscountStatusFilter("all");
    setPriceSortInput("alphabetical");
    setPriceSort("alphabetical");
    setPage(0);
    setError("");
  };
  const updateProjectPriceDraft = (projectId: number, value: string) => {
    const project = catalog.find(({ id }) => id === projectId);
    if (!project) return;
    const savedPrice = discountPrices[projectId]?.standard ?? project.price;
    const changed = value === "" || Number(value) !== savedPrice;
    const remainingEdited = editedPriceIds.filter((id) => id !== projectId);
    const nextEditedPriceIds = changed
      ? [...remainingEdited, projectId]
      : remainingEdited;

    setProjectPriceDrafts((current) => ({ ...current, [projectId]: value }));
    setEditedPriceIds(nextEditedPriceIds);
    setDirty(nextEditedPriceIds.length > 0);
    if (nextEditedPriceIds.length === 0) clearAdminDraft("price", selection);
  };
  const activePriceFilterCount =
    Number(appliedPriceMin !== "" || appliedPriceMax !== "") +
    Number(discountStatusFilter !== "all") +
    Number(priceSort !== "alphabetical");
  const priceRangeFilter = (label: string) => (
    <details ref={priceFilterRef} className="admin-price-filter-dropdown">
      <summary>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filtre
        {activePriceFilterCount > 0 && <strong>{activePriceFilterCount}</strong>}
      </summary>
      <div className="admin-price-filter-panel">
        <div className="admin-price-range-heading">
          <span>{label}</span>
          {(appliedPriceMin !== "" || appliedPriceMax !== "") && (
            <small>
              {appliedPriceMin || "0"} € – {appliedPriceMax ? `${appliedPriceMax} €` : "fără limită"}
            </small>
          )}
        </div>
        <div className="admin-price-range-controls">
        <label>
          Minim
          <span className="admin-price-range-input">
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={priceMinInput}
              onChange={(event) => setPriceMinInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (applyPriceRange())
                    event.currentTarget.closest("details")?.removeAttribute("open");
                }
              }}
            />
            <span>€</span>
          </span>
        </label>
        <span className="admin-price-range-separator" aria-hidden="true">–</span>
        <label>
          Maxim
          <span className="admin-price-range-input">
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="Fără limită"
              value={priceMaxInput}
              onChange={(event) => setPriceMaxInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (applyPriceRange())
                    event.currentTarget.closest("details")?.removeAttribute("open");
                }
              }}
            />
            <span>€</span>
          </span>
        </label>
        </div>
        <div className="admin-price-filter-selects">
          <label>
            Ordonează proiectele
            <select value={priceSortInput} onChange={(event) => setPriceSortInput(event.target.value as PriceSort)}>
              {priceSortOptions.map(([value, optionLabel]) => (
                <option key={value} value={value}>{optionLabel}</option>
              ))}
            </select>
          </label>
          <label>
            Reducere
            <select value={discountStatusInput} onChange={(event) => setDiscountStatusInput(event.target.value as DiscountStatusFilter)}>
              {discountStatusFilters.map(([value, optionLabel]) => (
                <option key={value} value={value}>{optionLabel}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="admin-price-filter-actions">
          <button
            type="button"
            className="admin-price-range-submit"
            onClick={(event) => {
              if (applyPriceRange())
                event.currentTarget.closest("details")?.removeAttribute("open");
            }}
          >
            Filtrează
          </button>
          <button type="button" className="admin-secondary admin-price-range-reset" onClick={resetPriceRange}>
            Resetează
          </button>
        </div>
      </div>
    </details>
  );
  const projectDiscountPercent = (projectId: number) =>
    discountOverrides[projectId] ?? discountPercent;
  const validProjectDiscountPercent = (projectId: number) => {
    const percent = projectDiscountPercent(projectId);
    return typeof percent === "number" ? percent : Number.NaN;
  };
  const discountTotals = catalog.reduce(
    (totals, project) => {
      const standard = Math.floor(discountPrices[project.id]?.standard ?? project.price);
      const percent = validProjectDiscountPercent(project.id);
      const final = selectedDiscounts.has(project.id) && Number.isFinite(percent)
        ? Math.floor(
            (standard * (100 - percent)) / 100,
          )
        : standard;
      totals.standard += standard;
      totals.final += final;
      return totals;
    },
    { standard: 0, final: 0 },
  );
  useEffect(() => {
    if (!message && !error) return;
    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [message, error]);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const { auth, db } = firebaseServices();
    let roleUnsubscribe = () => {};
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      roleUnsubscribe();
      const current = ++generation;
      setAccess("loading");
      setEmail(user?.email ?? "");
      if (!user) {
        setAccess("login");
        return;
      }
      roleUnsubscribe = onSnapshot(
        doc(db, "cmsAdmins", user.uid),
        (role) => {
          if (current !== generation) return;
          setAccess(
            role.exists() && role.data().active === true ? "admin" : "denied",
          );
        },
        (e) => {
          if (current === generation) {
            setAccess("denied");
            setError(firebaseMessage(e));
          }
        },
      );
    });
    return () => {
      generation++;
      unsubscribe();
      roleUnsubscribe();
    };
  }, []);
  useEffect(() => {
    if (access !== "admin") return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset the form while fetching a different remote document.
    setLoading(true);
    setLoadFailed(false);
    setError("");
    const request =
      section === "discount" || section === "price"
        ? readDocuments(catalog.map((project) => `price-${project.id}`)).then(
            (documents) =>
            catalog.map((project) => {
              const saved = documents[`price-${project.id}`];
              return [
                project.id,
                {
                  standard: saved?.standard ?? project.price,
                  discounted: saved?.discounted ?? null,
                  enabled: saved?.enabled ?? false,
                  revision: saved?.revision ?? 0,
                },
              ] as const;
            }),
          )
        : readDocument(selection);
    request
      .then((saved) => {
        if (cancelled) return;
        if (section === "discount" || section === "price") {
          const prices = Object.fromEntries(saved as [number, SavedPrice][]);
          setDiscountPrices(prices);
          if (section === "price") {
            const draft = readAdminDraft<{
              projectPriceDrafts: Record<number, string>;
              editedPriceIds: number[];
            }>(section, selection);
            const nextPriceDrafts =
              draft?.projectPriceDrafts ??
                Object.fromEntries(
                  catalog.map((project) => [
                    project.id,
                    String(prices[project.id]?.standard ?? project.price),
                  ]),
                );
            const nextEditedPriceIds = (draft?.editedPriceIds ?? []).filter(
              (projectId) => {
                const project = catalog.find(({ id }) => id === projectId);
                const savedPrice = project
                  ? prices[projectId]?.standard ?? project.price
                  : undefined;
                const draftValue = nextPriceDrafts[projectId];
                return (
                  savedPrice !== undefined &&
                  (draftValue === "" || Number(draftValue) !== savedPrice)
                );
              },
            );
            setProjectPriceDrafts(nextPriceDrafts);
            setEditedPriceIds(nextEditedPriceIds);
            if (draft && nextEditedPriceIds.length === 0)
              clearAdminDraft(section, selection);
            setDirty(nextEditedPriceIds.length > 0);
            setLoading(false);
            return;
          }
          const selected = catalog
            .filter((project) => prices[project.id]?.enabled)
            .map((project) => project.id);
          const first = prices[selected[0]];
          const currentPercent = first?.discounted
            ? Math.round((1 - first.discounted / first.standard) * 100)
            : 10;
          const basePercent = discountPercentages.includes(
            currentPercent as (typeof discountPercentages)[number],
          )
            ? currentPercent
            : 10;
          const overrides = Object.fromEntries(
            selected.flatMap((projectId) => {
              const savedPrice = prices[projectId];
              if (!savedPrice?.discounted || savedPrice.standard <= 0) return [];
              const percent = Math.round(
                (1 - savedPrice.discounted / savedPrice.standard) * 100,
              );
              return percent === basePercent ? [] : [[projectId, percent]];
            }),
          );
          const draft = readAdminDraft<{
            discountProjectIds: number[];
            discountPercent: number;
            discountOverrides: Record<number, OptionalNumber>;
          }>(section, selection);
          const linkedPercent = new URL(window.location.href).searchParams.has(
            "discountPercent",
          )
            ? adminLocation().discountPercent
            : null;
          setDiscountProjectIds(draft?.discountProjectIds ?? selected);
          setDiscountPercent(
            draft?.discountPercent ?? linkedPercent ?? basePercent,
          );
          setDiscountOverrides(draft?.discountOverrides ?? overrides);
          setDirty(Boolean(draft));
          setLoading(false);
          return;
        }
        const document = saved as CmsDocument | null;
        setRevision(document?.revision ?? 0);
        if (section === "payment") {
          const draft = readAdminDraft<{ paymentDraft: StoredPaymentSettings }>(
            section,
            selection,
          );
          const savedPaymentSettings = paymentSettingsFromValues(document?.values);
          setSavedPaymentDraft(savedPaymentSettings);
          setPaymentDraft(
            draft?.paymentDraft
              ? {
                  installmentPlans: draft.paymentDraft.installmentPlans.map(
                    (plan) => ({
                      months:
                        plan.months === "" ? Number.NaN : Number(plan.months),
                      surcharge:
                        plan.surcharge === ""
                          ? Number.NaN
                          : Number(plan.surcharge),
                    }),
                  ),
                  rentalMonths:
                    draft.paymentDraft.rentalMonths === ""
                      ? Number.NaN
                      : Number(draft.paymentDraft.rentalMonths),
                  rentalServices: draft.paymentDraft.rentalServices?.map((service) => ({ name: service.name, price: service.price === "" ? Number.NaN : Number(service.price), included: service.included !== false })) ?? savedPaymentSettings.rentalServices,
                  rentalBenefits: draft.paymentDraft.rentalBenefits?.map((benefit) => ({ name: benefit.name, included: benefit.included !== false })) ?? savedPaymentSettings.rentalBenefits,
                  installmentBenefits: draft.paymentDraft.installmentBenefits?.map((item) => ({ name: item.name, included: item.included !== false })) ?? savedPaymentSettings.installmentBenefits,
                  installmentServices: draft.paymentDraft.installmentServices?.map((item) => ({ name: item.name, included: item.included !== false })) ?? savedPaymentSettings.installmentServices,
                }
              : savedPaymentSettings,
          );
          setDirty(Boolean(draft));
          setLoading(false);
          return;
        }
        if (section === "text") {
          const draft = readAdminDraft<{ values: Record<string, string> }>(
            section,
            selection,
          );
          setValues(
            draft?.values ?? { ...group?.fields, ...document?.values },
          );
          setDirty(Boolean(draft));
        } else {
          const draft = readAdminDraft<{ images: DraftImage[] }>(
            section,
            selection,
          );
          setImages(draft?.images ?? document?.images ?? slot?.images ?? []);
          setDirty(Boolean(draft));
        }
        setLoading(false);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(firebaseMessage(e));
          setLoadFailed(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [access, selection, reload, group, slot, section]);
  useEffect(() => {
    if (!dirty || loading) return;
    if (section === "text")
      writeAdminDraft(section, selection, { values });
    else if (section === "media") {
      if (images.every((image) => !image.file && !image.src.startsWith("blob:")))
        writeAdminDraft(section, selection, { images });
    } else if (section === "price")
      writeAdminDraft(section, selection, {
        projectPriceDrafts,
        editedPriceIds,
      });
    else if (section === "discount")
      writeAdminDraft(section, selection, {
        discountProjectIds,
        discountPercent,
        discountOverrides,
      });
    else if (section === "payment")
      writeAdminDraft(section, selection, {
        paymentDraft: storedPaymentSettings(paymentDraft),
      });
  }, [
    dirty,
    loading,
    section,
    selection,
    values,
    images,
    projectPriceDrafts,
    editedPriceIds,
    discountProjectIds,
    discountPercent,
    discountOverrides,
    paymentDraft,
  ]);
  useEffect(() => {
    if (section !== "payment" || loading) return;
    const unchanged = samePaymentSettings(paymentDraft, savedPaymentDraft);
    setDirty(!unchanged);
    if (unchanged) clearAdminDraft(section, selection);
  }, [section, selection, loading, paymentDraft, savedPaymentDraft]);
  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        dirtyRef.current &&
        link &&
        !event.defaultPrevented &&
        link.target !== "_blank" &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault();
        event.stopPropagation();
        setLeaveAction(() => () => window.location.assign(link.href));
      }
    };
    document.addEventListener("click", navigate, true);
    const urls = previews.current;
    return () => {
      document.removeEventListener("click", navigate, true);
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  const choose = (next: string, nextSection = section) => {
    if (busy) return;
    const applyChoice = () => {
    window.history.pushState(
      null,
      "",
      adminHref({
        section: nextSection,
        selection: next,
        search: "",
        projectSearch,
        language: "all",
        page: 0,
        priceMin: appliedPriceMin,
        priceMax: appliedPriceMax,
        discountPercent,
        discountStatusFilter,
        priceSort,
      }, false),
    );
    setDirty(false);
    setSection(nextSection);
    setSelection(next);
    setSearch("");
    setPage(0);
    setLanguage("all");
    setMessage("");
    setError("");
    };
    if (dirty) {
      setLeaveAction(() => applyChoice);
      return;
    }
    applyChoice();
  };
  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget,
      data = new FormData(form);
    try {
      const { auth, persistence } = firebaseServices();
      await persistence;
      await signInWithEmailAndPassword(
        auth,
        String(data.get("email")),
        String(data.get("password")),
      );
      form.reset();
    } catch (e) {
      setError(firebaseMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    if (busy) return;
    const applyLogout = async () => {
    setBusy(true);
    setError("");
    try {
      await signOut(firebaseServices().auth);
      setDirty(false);
      setValues({});
      setImages([]);
      setMessage("");
    } catch (e) {
      setError(firebaseMessage(e));
    } finally {
      setBusy(false);
    }
    };
    if (dirty) {
      setLeaveAction(() => () => void applyLogout());
      return;
    }
    await applyLogout();
  };
  const addImage = async (file: File | undefined, index?: number) => {
    if (!file) return;
    setError("");
    let src = "";
    try {
      validateImage(file);
      src = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () =>
          img.naturalWidth <= 16000 && img.naturalHeight <= 16000
            ? resolve()
            : reject(
                new Error(
                  "Imaginea poate avea cel mult 16.000 px pe fiecare latură.",
                ),
              );
        img.onerror = () =>
          reject(new Error("Fișierul nu este o imagine validă."));
        img.src = src;
      });
      previews.current.add(src);
      setImages((current) =>
        index === undefined
          ? [...current, { src, alt: "", file }]
          : current.map((image, i) =>
              i === index ? { src, alt: image.alt, file } : image,
            ),
      );
      setDirty(true);
      setMessage("");
    } catch (e) {
      if (src) URL.revokeObjectURL(src);
      setError(firebaseMessage(e));
    }
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (section === "payment") {
      const issue = validatePaymentSettings(paymentDraft);
      if (issue) {
        setError(issue);
        return;
      }
      setBusy(true);
      try {
        await saveDocument(
          "text-payment-settings",
          {
            values: paymentSettingsToValues(paymentDraft),
          },
          revision,
        );
        setRevision(revision + 1);
        setSavedPaymentDraft(paymentDraft);
        clearAdminDraft(section, selection);
        setDirty(false);
        setMessage("Condițiile pentru rate și chirie au fost publicate pe site.");
      } catch (e) {
        setError(firebaseMessage(e));
      } finally {
        setBusy(false);
      }
      return;
    }
    if (section === "price") {
      setBusy(true);
      try {
        const entries = editedPriceIds.map((projectId) => {
          const project = catalog.find(({ id }) => id === projectId)!;
          const current = discountPrices[projectId] ?? {
            standard: project.price,
            discounted: null,
            enabled: false,
            revision: 0,
          };
          const standard = Math.floor(Number(projectPriceDrafts[projectId]));
          const discountRatio =
            current.enabled && current.discounted && current.standard > 0
              ? current.discounted / current.standard
              : null;
          const value: Price = {
            standard,
            discounted: discountRatio
              ? Math.floor(standard * discountRatio)
              : current.discounted,
            enabled: current.enabled,
          };
          const issue = validatePrice(value);
          if (issue) throw new Error(`${project.title}: ${issue}`);
          return {
            id: `price-${projectId}`,
            value,
            revision: current.revision,
          };
        });
        await saveDocuments(entries);
        setDiscountPrices((current) => {
          const next = { ...current };
          entries.forEach(({ id, value, revision }) => {
            const projectId = Number(id.slice("price-".length));
            next[projectId] = { ...value, revision: revision + 1 } as SavedPrice;
          });
          return next;
        });
        setEditedPriceIds([]);
        clearAdminDraft(section, selection);
        setDirty(false);
        setMessage("Prețurile au fost salvate și sunt publicate pe site.");
      } catch (e) {
        setError(firebaseMessage(e));
      } finally {
        setBusy(false);
      }
      return;
    }
    if (section === "discount") {
      setBusy(true);
      try {
        const selected = new Set(discountProjectIds);
        const changed = catalog.filter(
          (project) =>
            selected.has(project.id) || discountPrices[project.id]?.enabled,
        );
        const entries = changed.map((project) => {
          const current = discountPrices[project.id] ?? {
            standard: project.price,
            discounted: null,
            enabled: false,
            revision: 0,
          };
          const enabled = selected.has(project.id);
          const standard = Math.floor(current.standard);
          const percent = validProjectDiscountPercent(project.id);
          if (enabled && (!Number.isInteger(percent) || percent < 1 || percent > 99))
            throw new Error(
              `${project.title}: reducerea trebuie să fie un procent întreg între 1% și 99%.`,
            );
          const discounted = enabled
            ? Math.floor((standard * (100 - percent)) / 100)
            : null;
          const value: Price = {
            standard,
            discounted,
            enabled,
          };
          const issue = validatePrice(value);
          if (issue) throw new Error(`${project.title}: ${issue}`);
          return {
            id: `price-${project.id}`,
            value,
            revision: current.revision,
          };
        });
        await saveDocuments(entries);
        setDiscountPrices((current) => {
          const next = { ...current };
          entries.forEach(({ id, value, revision }) => {
            const projectId = Number(id.slice("price-".length));
            next[projectId] = { ...value, revision: revision + 1 } as SavedPrice;
          });
          return next;
        });
        clearAdminDraft(section, selection);
        setDirty(false);
        setMessage("Reducerile au fost salvate și sunt publicate pe site.");
      } catch (e) {
        setError(firebaseMessage(e));
      } finally {
        setBusy(false);
      }
      return;
    }
    let payload: Omit<CmsDocument, "revision">;
    payload = section === "text" ? { values } : { images: [] };
    setBusy(true);
    try {
      if (section === "media") {
        const ready: CmsImage[] = [];
        for (const image of images) {
          if (image.file) {
            const uploaded =
              uploads.current.get(image.file) ??
              (await uploadImage(image.file, (progress) =>
                setMessage(
                  `Încărcare imagine ${ready.length + 1}/${images.length}: ${progress}%`,
                ),
              ));
            uploads.current.set(image.file, uploaded);
            ready.push({ ...uploaded, alt: image.alt });
          } else
            ready.push({
              src: image.src,
              alt: image.alt,
              ...(image.path ? { path: image.path } : {}),
            });
        }
        payload = { images: ready };
      }
      await saveDocument(selection, payload, revision);
      setRevision(revision + 1);
      if (payload.images) setImages(payload.images);
      clearAdminDraft(section, selection);
      setDirty(false);
      setMessage("Modificările au fost salvate și sunt publicate pe site.");
    } catch (e) {
      setMessage("");
      setError(firebaseMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const saveAllDrafts = async () => {
    if (busy || globalSaving || loading || globalDraftCount === 0) return;
    setGlobalSaving(true);
    setError("");
    setMessage("");

    const hasPendingMediaUpload =
      section === "media" &&
      dirty &&
      images.some((image) => image.file || image.src.startsWith("blob:"));
    if (dirty && !hasPendingMediaUpload) {
      if (section === "text") writeAdminDraft(section, selection, { values });
      else if (section === "media") writeAdminDraft(section, selection, { images });
      else if (section === "price")
        writeAdminDraft(section, selection, { projectPriceDrafts, editedPriceIds });
      else if (section === "discount")
        writeAdminDraft(section, selection, {
          discountProjectIds,
          discountPercent,
          discountOverrides,
        });
      else writeAdminDraft(section, selection, {
        paymentDraft: storedPaymentSettings(paymentDraft),
      });
    }

    const failures: string[] = [];
    let savedCount = 0;
    let currentSectionSaved = false;
    const markSaved = (draft: Pick<StoredAdminDraft, "section" | "selection">) => {
      clearAdminDraft(draft.section, draft.selection);
      savedCount += 1;
      if (draft.section === section && draft.selection === selection)
        currentSectionSaved = true;
    };
    const readCurrentPrices = async () => {
      const documents = await readDocuments(
        catalog.map((project) => `price-${project.id}`),
      );
      return Object.fromEntries(
        catalog.map((project) => {
          const saved = documents[`price-${project.id}`];
          return [
            project.id,
            {
              standard: saved?.standard ?? project.price,
              discounted: saved?.discounted ?? null,
              enabled: saved?.enabled ?? false,
              revision: saved?.revision ?? 0,
            } as SavedPrice,
          ];
        }),
      ) as Record<number, SavedPrice>;
    };
    const saveStoredDraft = async (draft: StoredAdminDraft) => {
      if (draft.section === "text") {
        const values = (draft.value as { values?: Record<string, string> }).values;
        if (!values) throw new Error("Draftul de texte nu este valid.");
        const document = await readDocument(draft.selection);
        await saveDocument(draft.selection, { values }, document?.revision ?? 0);
        return;
      }
      if (draft.section === "media") {
        const draftImages = (draft.value as { images?: DraftImage[] }).images;
        if (!draftImages || draftImages.some((image) => image.file || image.src.startsWith("blob:")))
          throw new Error("Imaginile locale trebuie salvate din secțiunea lor curentă.");
        const document = await readDocument(draft.selection);
        await saveDocument(draft.selection, { images: draftImages }, document?.revision ?? 0);
        return;
      }
      if (draft.section === "payment") {
        const stored = (draft.value as { paymentDraft?: StoredPaymentSettings }).paymentDraft;
        if (!stored) throw new Error("Draftul pentru rate și chirie nu este valid.");
        const document = await readDocument("text-payment-settings");
        const savedSettings = paymentSettingsFromValues(document?.values);
        const settings: PaymentSettings = {
          installmentPlans: stored.installmentPlans.map((plan) => ({
            months: plan.months === "" ? Number.NaN : Number(plan.months),
            surcharge: plan.surcharge === "" ? Number.NaN : Number(plan.surcharge),
          })),
          rentalMonths:
            stored.rentalMonths === "" ? Number.NaN : Number(stored.rentalMonths),
          rentalServices:
            stored.rentalServices?.map((service) => ({
              name: service.name,
              price: service.price === "" ? Number.NaN : Number(service.price), included: service.included !== false,
            })) ?? savedSettings.rentalServices,
          rentalBenefits:
            stored.rentalBenefits?.map((benefit) => ({ name: benefit.name, included: benefit.included !== false })) ?? savedSettings.rentalBenefits,
          installmentBenefits: stored.installmentBenefits?.map((item) => ({ name: item.name, included: item.included !== false })) ?? savedSettings.installmentBenefits,
          installmentServices: stored.installmentServices?.map((item) => ({ name: item.name, included: item.included !== false })) ?? savedSettings.installmentServices,
        };
        const issue = validatePaymentSettings(settings);
        if (issue) throw new Error(issue);
        await saveDocument(
          "text-payment-settings",
          {
            values: paymentSettingsToValues(settings),
          },
          document?.revision ?? 0,
        );
        return;
      }
      const prices = await readCurrentPrices();
      if (draft.section === "price") {
        const stored = draft.value as {
          projectPriceDrafts?: Record<number, string>;
          editedPriceIds?: number[];
        };
        const entries = (stored.editedPriceIds ?? []).map((projectId) => {
          const project = catalog.find(({ id }) => id === projectId);
          if (!project) throw new Error("Un proiect din draft nu mai există.");
          const current = prices[projectId];
          const standard = Math.floor(Number(stored.projectPriceDrafts?.[projectId]));
          const ratio =
            current.enabled && current.discounted && current.standard > 0
              ? current.discounted / current.standard
              : null;
          const value: Price = {
            standard,
            discounted: ratio ? Math.floor(standard * ratio) : current.discounted,
            enabled: current.enabled,
          };
          const issue = validatePrice(value);
          if (issue) throw new Error(`${project.title}: ${issue}`);
          return { id: `price-${projectId}`, value, revision: current.revision };
        });
        if (entries.length) await saveDocuments(entries);
        return;
      }
      const stored = draft.value as {
        discountProjectIds?: number[];
        discountPercent?: number;
        discountOverrides?: Record<number, OptionalNumber>;
      };
      const selected = new Set(stored.discountProjectIds ?? []);
      const entries = catalog
        .filter((project) => selected.has(project.id) || prices[project.id]?.enabled)
        .map((project) => {
          const current = prices[project.id];
          const enabled = selected.has(project.id);
          const percent = stored.discountOverrides?.[project.id] ?? stored.discountPercent;
          const validPercent =
            typeof percent === "number" &&
            Number.isInteger(percent) &&
            percent >= 1 &&
            percent <= 99;
          if (enabled && !validPercent)
            throw new Error(`${project.title}: reducerea trebuie să fie un procent întreg între 1% și 99%.`);
          const value: Price = {
            standard: Math.floor(current.standard),
            discounted: enabled
              ? Math.floor((current.standard * (100 - Number(percent))) / 100)
              : null,
            enabled,
          };
          const issue = validatePrice(value);
          if (issue) throw new Error(`${project.title}: ${issue}`);
          return { id: `price-${project.id}`, value, revision: current.revision };
        });
      if (entries.length) await saveDocuments(entries);
    };

    try {
      const order: Record<Section, number> = {
        text: 0,
        payment: 1,
        price: 2,
        discount: 3,
        media: 4,
      };
      const drafts = storedAdminDrafts(draftsVersion)
        .filter(
          (draft) =>
            !(
              hasPendingMediaUpload &&
              draft.section === section &&
              draft.selection === selection
            ),
        )
        .sort((left, right) => order[left.section] - order[right.section]);
      for (const draft of drafts) {
        try {
          await saveStoredDraft(draft);
          markSaved(draft);
        } catch (e) {
          failures.push(`${draft.selection}: ${firebaseMessage(e)}`);
        }
      }
      if (hasPendingMediaUpload) {
        try {
          const ready: CmsImage[] = [];
          for (const image of images) {
            if (image.file) {
              const uploaded =
                uploads.current.get(image.file) ??
                (await uploadImage(image.file, (progress) =>
                  setMessage(`Încărcare imagine ${ready.length + 1}/${images.length}: ${progress}%`),
                ));
              uploads.current.set(image.file, uploaded);
              ready.push({ ...uploaded, alt: image.alt });
            } else ready.push({ src: image.src, alt: image.alt, ...(image.path ? { path: image.path } : {}) });
          }
          await saveDocument(selection, { images: ready }, revision);
          setImages(ready);
          markSaved({ section, selection });
        } catch (e) {
          failures.push(`${selection}: ${firebaseMessage(e)}`);
        }
      }
      if (currentSectionSaved) {
        setDirty(false);
        if (section === "payment") setSavedPaymentDraft(paymentDraft);
        if (section === "price") setEditedPriceIds([]);
      }
      setDraftsVersion((value) => value + 1);
      if (failures.length) {
        setError(`${failures.length} secțiuni au rămas nesalvate. ${failures[0]}`);
        if (savedCount) setMessage(`Au fost salvate ${savedCount} secțiuni.`);
      } else if (savedCount) setMessage(`Au fost salvate ${savedCount} secțiuni.`);
    } finally {
      setGlobalSaving(false);
    }
  };
  const reloadSection = () => {
    if (busy) return;
    const applyReload = () => {
      clearAdminDraft(section, selection);
      setDirty(false);
      setReload((n) => n + 1);
    };
    if (dirty) {
      setLeaveAction(() => applyReload);
      return;
    }
    applyReload();
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <BrandLogo href="/ro" className="admin-brand" inverse />
        <span>Administrare catalog</span>
        {access === "admin" && (
          <div>
            <span>{email}</span>
            <button type="button" onClick={logout} disabled={busy}>
              Deconectare
            </button>
          </div>
        )}
      </header>
      {access === "loading" ? (
        <p role="status" className="admin-card">
          Se verifică sesiunea…
        </p>
      ) : access !== "admin" ? (
        <section className="admin-card admin-login">
          <p className="admin-eyebrow">Acces administratori</p>
          <h1>{access === "denied" ? "Cont neautorizat" : "Autentificare"}</h1>
          {access === "denied" ? (
            <>
              <p>
                Contul {email} nu este autorizat să administreze acest site.
                Accesul trebuie acordat explicit de proprietarul proiectului.
              </p>
              <button onClick={logout} disabled={busy}>
                Folosește alt cont
              </button>
            </>
          ) : (
            <form onSubmit={login}>
              <p>Folosește contul de administrator atribuit pentru MONO/DEV.</p>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  disabled={busy || !firebaseConfigured}
                />
              </label>
              <label>
                Parolă
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={busy || !firebaseConfigured}
                />
              </label>
              <button type="submit" disabled={busy || !firebaseConfigured}>
                {busy ? "Se autentifică…" : "Autentificare"}
              </button>
              {!firebaseConfigured && (
                <p role="status">
                  Conexiunea Firebase nu este configurată. Urmează pașii din
                  documentația de instalare.
                </p>
              )}
            </form>
          )}
        </section>
      ) : (
        <div className="admin-workspace">
          <div className="admin-sidebar-stack">
            <aside className="admin-sidebar">
            <div className="admin-sidebar-title">
              <span>Panou de control</span>
            </div>
            <nav aria-label="Secțiuni administrare">
              {(
                [
                  ["text", "Textele catalogului"],
                  ["media", "Coperțile din catalog"],
                  ["pricing", "Prețuri & Reduceri"],
                  ["payment", "Rate și chirie"],
                ] as const
              ).map(([key, label]) => {
                const isCurrent =
                  key === "pricing"
                    ? section === "price" || section === "discount"
                    : section === key;
                const hasUnsavedChanges =
                  (dirty && isCurrent) || hasAdminDraftForCategory(key);

                return (
                  <button
                    key={key}
                    aria-current={isCurrent ? "page" : undefined}
                    disabled={busy}
                    onClick={() =>
                      choose(
                        key === "pricing"
                          ? "prices"
                          : key === "payment"
                            ? "text-payment-settings"
                          : key === "text"
                            ? textGroups[0].id
                            : mediaSlots[0].id,
                        key === "pricing" ? "price" : key,
                      )
                    }
                  >
                    <span>{label}</span>
                    {hasUnsavedChanges && (
                      <span className="admin-unsaved-dot" aria-label="Modificări nesalvate" />
                    )}
                  </button>
                );
              })}
            </nav>
            {(section === "text" || section === "media") && (
              <label>
                {section === "text" ? "Pagina și secțiunea" : "Fișa din catalog"}
                <select
                  aria-label={
                    section === "text"
                      ? "Pagina și secțiunea"
                      : "Fișa din catalog"
                  }
                  value={selection}
                  disabled={busy}
                  onChange={(e) => choose(e.target.value)}
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            </aside>
            <div className="admin-sidebar-actions">
              <button
                type="button"
                className="admin-global-save"
                onClick={() => void saveAllDrafts()}
                disabled={busy || globalSaving || loading || globalDraftCount === 0}
                title="Salvează toate modificările locale"
              >
                Salvează tot{globalDraftCount > 0 ? ` (${globalDraftCount})` : ""}
              </button>
              <button
                type="button"
                className="admin-secondary admin-reload-section"
                disabled={busy}
                onClick={reloadSection}
                aria-label="Reîncarcă secțiunea"
                title="Reîncarcă secțiunea"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12a9 9 0 0 0-15.5-6.2L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 15.5 6.2L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </button>
            </div>
          </div>
          <section
            className={`admin-editor ${
              section === "payment"
                ? "admin-editor-payment"
                : section === "discount" || section === "price"
                  ? "admin-editor-discount"
                  : ""
            }`}
          >
            <div className="admin-editor-heading">
              <div>
                <p className="admin-eyebrow">
                  {section === "text"
                    ? "Textele catalogului"
                    : section === "media"
                      ? "Coperțile din catalog"
                      : section === "payment"
                        ? "Rate și chirie"
                        : "Reduceri"}
                </p>
                <h2>
                  {section === "discount"
                    ? "Reduceri pentru proiecte"
                    : section === "price"
                      ? "Prețurile proiectelor"
                      : section === "payment"
                        ? "Condiții de plată"
                    : items.find((item) => item.id === selection)?.label}
                </h2>
              </div>
              <span
                className={`admin-save-status ${dirty ? "is-unsaved" : "is-saved"}`}
                role="status"
              >
                {dirty ? "Nesalvat" : "Salvat"}
              </span>
            </div>
            {(section === "price" || section === "discount") && (
              <nav className="admin-subcategories" aria-label="Subcategorii reduceri">
                <button
                  type="button"
                  aria-current={section === "price" ? "page" : undefined}
                  disabled={busy}
                  onClick={() => choose("prices", "price")}
                >
                  Prețurile proiectelor
                </button>
                <button
                  type="button"
                  aria-current={section === "discount" ? "page" : undefined}
                  disabled={busy}
                  onClick={() => choose("discounts", "discount")}
                >
                  Aplică reduceri
                </button>
              </nav>
            )}
            {loading ? (
              <p role="status">Se încarcă datele…</p>
            ) : loadFailed ? (
              <button onClick={() => setReload((n) => n + 1)}>
                Reîncearcă încărcarea
              </button>
            ) : (
              <form onSubmit={save}>
                <fieldset
                  disabled={busy}
                  onWheel={(event) => {
                    const input = event.target;
                    if (
                      input instanceof HTMLInputElement &&
                      input.type === "number"
                    )
                      input.blur();
                  }}
                >
                  {section === "text" && (
                    <>
                      <div className="admin-search">
                        <label>
                          Caută un text
                          <input
                            type="search"
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setPage(0);
                            }}
                          />
                        </label>
                        <label>
                          Limba
                          <select
                            value={language}
                            onChange={(e) => {
                              setLanguage(e.target.value);
                              setPage(0);
                            }}
                          >
                            <option value="all">Toate limbile</option>
                            <option value="ro">Română</option>
                            <option value="ru">Rusă</option>
                            <option value="en">Engleză</option>
                          </select>
                        </label>
                      </div>
                      <p>
                        {fields.length} câmpuri. Textele sunt afișate ca text
                        simplu, fără HTML.
                      </p>
                      {fields
                        .slice(page * 40, (page + 1) * 40)
                        .map(([key, original]) => (
                          <label key={key} className="admin-text-field">
                            {fieldLabel(key)}
                            {original.length > 100 ||
                            original.includes("\n") ? (
                              <textarea
                                rows={4}
                                maxLength={20000}
                                value={values[key] ?? original}
                                onChange={(e) => {
                                  setValues((current) => ({
                                    ...current,
                                    [key]: e.target.value,
                                  }));
                                  setDirty(true);
                                  setMessage("");
                                }}
                              />
                            ) : (
                              <input
                                maxLength={20000}
                                value={values[key] ?? original}
                                onChange={(e) => {
                                  setValues((current) => ({
                                    ...current,
                                    [key]: e.target.value,
                                  }));
                                  setDirty(true);
                                  setMessage("");
                                }}
                              />
                            )}
                            <small>Inițial: {original}</small>
                          </label>
                        ))}
                      {fields.length > 40 && (
                        <div className="admin-pagination">
                          <button
                            type="button"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                          >
                            Anterior
                          </button>
                          <span>
                            {page + 1} / {Math.ceil(fields.length / 40)}
                          </span>
                          <button
                            type="button"
                            disabled={(page + 1) * 40 >= fields.length}
                            onClick={() => setPage(page + 1)}
                          >
                            Următor
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {section === "price" && (
                    <div className="admin-price-fields">
                      <div className="admin-discount-intro admin-price-intro">
                        <div>
                          <p className="admin-eyebrow">Catalog și prețuri</p>
                          <h3>Gestionează prețurile proiectelor</h3>
                          <p>Moneda catalogului este EUR. Reducerile se configurează separat.</p>
                        </div>
                        <span className="admin-discount-selection-count admin-price-edit-count">
                          <strong>{editedPriceIds.length}</strong>
                          prețuri modificate
                        </span>
                      </div>
                      <section className="admin-discount-toolbar admin-price-toolbar" aria-label="Instrumente pentru prețuri">
                        <label className="admin-project-search">
                          Caută proiect
                          <input
                            type="search"
                            aria-label="Caută proiect după nume în prețuri"
                            placeholder="Scrie numele proiectului"
                            value={projectSearch}
                            onChange={(event) => {
                              setProjectSearch(event.target.value);
                              setPage(0);
                            }}
                          />
                        </label>
                        {priceRangeFilter("Preț original")}
                      </section>
                      <p className="admin-discount-results-summary">
                        <strong>{filteredCatalog.length}</strong> rezultate din {catalog.length}
                        {filteredCatalog.length > 0 && (
                          <> · afișate {priceCurrentPage * projectPageSize + 1}–{Math.min((priceCurrentPage + 1) * projectPageSize, filteredCatalog.length)}</>
                        )}
                      </p>
                      <div className="admin-project-price-list">
                        {visiblePriceProjects.map((project) => {
                          const saved = discountPrices[project.id];
                          const isEdited = editedPriceIds.includes(project.id);
                          const hasActiveDiscount = Boolean(
                            saved?.enabled && saved.discounted !== null,
                          );
                          return (
                            <article
                              key={project.id}
                              className={`admin-project-price ${
                                isEdited ? "is-edited" : ""
                              } ${hasActiveDiscount ? "has-discount" : "has-no-discount"}`}
                            >
                              <Link
                                className="admin-project-open"
                                href={
                                  projectPaths[project.id] ??
                                  `/ro/projects/${projectSlugs[project.id]}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Deschide ${project.title} pe site`}
                                title="Deschide proiectul pe site"
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M13 5h6v6M19 5l-9 9M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
                                </svg>
                              </Link>
                              <div className="admin-price-card-heading">
                                <strong title={project.title}>{project.title}</strong>
                              </div>
                              <label>
                                <span className="admin-price-field-heading">
                                  <span>Preț original</span>
                                  {isEdited && (
                                    <button
                                      type="button"
                                      className="admin-price-restore"
                                      aria-label={`Restabilește prețul salvat pentru ${project.title}`}
                                      title="Restabilește valoarea salvată"
                                      onClick={() =>
                                        updateProjectPriceDraft(
                                          project.id,
                                          String(saved?.standard ?? project.price),
                                        )
                                      }
                                    >
                                      Nesalvat
                                      <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                                        <path d="M3 4v6h6" />
                                      </svg>
                                    </button>
                                  )}
                                </span>
                                <span className="admin-number-field">
                                  <input
                                    aria-label={`Preț actual pentru ${project.title}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={9}
                                    required
                                    value={projectPriceDrafts[project.id] ?? ""}
                                    onChange={(event) =>
                                      updateProjectPriceDraft(
                                        project.id,
                                        event.target.value.replace(/\D/g, ""),
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="admin-number-clear"
                                    aria-label={`Șterge prețul pentru ${project.title}`}
                                    onClick={() => updateProjectPriceDraft(project.id, "")}
                                  >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="m7 7 10 10M17 7 7 17" />
                                    </svg>
                                  </button>
                                </span>
                              </label>
                              {hasActiveDiscount && (
                                <small className="admin-price-active-discount">
                                  Reducere activă <strong>{euro.format(saved!.discounted!)}</strong>
                                </small>
                              )}
                              {!hasActiveDiscount && (
                                <small className="admin-price-no-discount">
                                  <span aria-hidden="true" /> Fără reducere
                                </small>
                              )}
                            </article>
                          );
                        })}
                      </div>
                      {filteredCatalog.length === 0 && (
                        <div className="admin-discount-empty" role="status">
                          <strong>Niciun proiect nu corespunde filtrelor.</strong>
                          <span>Schimbă numele căutat sau intervalul de preț.</span>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "discount" && (
                    <div className="admin-discounts">
                      <div className="admin-discount-intro">
                        <div>
                          <p className="admin-eyebrow">Centru de reduceri</p>
                          <h3>Configurează campania</h3>
                          <p>Caută, filtrează și aplică reduceri individuale sau în masă.</p>
                        </div>
                        <span className="admin-discount-selection-count">
                          <strong>{discountProjectIds.length}</strong>
                          proiecte selectate
                        </span>
                      </div>
                      <section className="admin-discount-toolbar" aria-label="Instrumente pentru reduceri">
                        <label className="admin-project-search">
                          Caută proiect
                          <input
                            type="search"
                            aria-label="Caută proiect după nume în reduceri"
                            placeholder="Scrie numele proiectului"
                            value={projectSearch}
                            onChange={(event) => {
                              setProjectSearch(event.target.value);
                              setPage(0);
                            }}
                          />
                        </label>
                        <label className="admin-discount-percent">
                          Reducere implicită
                          <select
                            aria-label="Procentul reducerii"
                            value={discountPercent}
                            onChange={(event) => {
                              setDiscountPercent(Number(event.target.value));
                              setDirty(true);
                            }}
                          >
                            {discountPercentages.map((percent) => (
                              <option key={percent} value={percent}>
                                {percent}%
                              </option>
                            ))}
                          </select>
                        </label>
                        {priceRangeFilter("Preț redus")}
                      </section>
                      <dl className="admin-discount-totals">
                        <div>
                          <dt>Valoarea totală a proiectelor</dt>
                          <dd>{euro.format(discountTotals.standard)}</dd>
                        </div>
                        <div>
                          <dt>Total cu reducerea activă</dt>
                          <dd>{euro.format(discountTotals.final)}</dd>
                        </div>
                        <div>
                          <dt>Reducere totală</dt>
                          <dd>
                            {euro.format(
                              discountTotals.standard - discountTotals.final,
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="admin-discount-actions">
                        <button
                          type="button"
                          className="admin-secondary"
                          onClick={() => {
                            setDiscountProjectIds((current) => [
                              ...new Set([
                                ...current,
                                ...filteredCatalog.map(({ id }) => id),
                              ]),
                            ]);
                            setDirty(true);
                          }}
                          disabled={filteredCatalog.length === 0}
                        >
                          Selectează rezultatele ({filteredCatalog.length})
                        </button>
                        <button
                          type="button"
                          className="admin-secondary"
                          onClick={() => {
                            const filteredIds = new Set(
                              filteredCatalog.map(({ id }) => id),
                            );
                            setDiscountProjectIds((current) =>
                              current.filter((id) => !filteredIds.has(id)),
                            );
                            setDiscountOverrides((current) =>
                              Object.fromEntries(
                                Object.entries(current).filter(
                                  ([id]) => !filteredIds.has(Number(id)),
                                ),
                              ),
                            );
                            setDirty(true);
                          }}
                          disabled={filteredCatalog.length === 0}
                        >
                          Deselectează rezultatele
                        </button>
                        <button
                          type="button"
                          className="admin-secondary admin-clear-discounts"
                          onClick={() => {
                            setDiscountProjectIds([]);
                            setDiscountOverrides({});
                            setDirty(true);
                          }}
                        >
                          Elimină toate reducerile
                        </button>
                      </div>
                      <p className="admin-discount-results-summary">
                        <strong>{filteredCatalog.length}</strong> rezultate din {catalog.length}
                        {filteredCatalog.length > 0 && (
                          <> · afișate {discountCurrentPage * projectPageSize + 1}–{Math.min((discountCurrentPage + 1) * projectPageSize, filteredCatalog.length)}</>
                        )}
                      </p>
                      <div className="admin-discount-projects">
                        {visibleDiscountProjects.map((project) => {
                          const standard = Math.floor(
                            discountPrices[project.id]?.standard ?? project.price,
                          );
                          const percent = projectDiscountPercent(project.id);
                          const numericPercent =
                            typeof percent === "number" ? percent : Number.NaN;
                          const reduced = Math.floor(
                            (standard * (100 - numericPercent)) / 100,
                          );
                          const saving = standard - reduced;
                          const isSelected = selectedDiscounts.has(project.id);
                          return (
                            <article
                              key={project.id}
                              className={`admin-discount-project ${isSelected ? "is-selected" : ""}`}
                            >
                              <Link
                                className="admin-project-open"
                                href={
                                  projectPaths[project.id] ??
                                  `/ro/projects/${projectSlugs[project.id]}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Deschide ${project.title} pe site`}
                                title="Deschide proiectul pe site"
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M13 5h6v6M19 5l-9 9M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
                                </svg>
                              </Link>
                              <label className="admin-discount-project-toggle">
                                <input
                                  type="checkbox"
                                  aria-label={`Aplică reducerea pentru ${project.title}`}
                                  checked={discountProjectIds.includes(project.id)}
                                  onChange={(event) => {
                                    setDiscountProjectIds((current) =>
                                      event.target.checked
                                        ? [...current, project.id]
                                        : current.filter((id) => id !== project.id),
                                    );
                                    if (!event.target.checked)
                                      setDiscountOverrides((current) => {
                                        const next = { ...current };
                                        delete next[project.id];
                                        return next;
                                      });
                                    setDirty(true);
                                  }}
                                />
                                <strong>{project.title}</strong>
                                <span className="admin-discount-state">
                                  {isSelected ? `${percent}% activă` : "Fără reducere"}
                                </span>
                              </label>
                              <div className="admin-discount-price-flow">
                                {Number.isFinite(reduced)
                                  ? (
                                    <>
                                      <span>€{standard}</span>
                                      <span aria-hidden="true">→</span>
                                      <strong>€{isSelected ? reduced : standard}</strong>
                                      {isSelected && <em title={`Economisești €${saving}`}>−€{saving}</em>}
                                    </>
                                  )
                                  : "Introdu procentul reducerii."}
                              </div>
                              {isSelected && (
                                <label className="admin-custom-discount">
                                  Reducere individuală (%)
                                  <span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="99"
                                      step="1"
                                      aria-label={`Reducere individuală pentru ${project.title}`}
                                      value={percent}
                                      onChange={(event) => {
                                        setDiscountOverrides((current) => ({
                                          ...current,
                                          [project.id]: event.target.value === ""
                                            ? ""
                                            : Number(event.target.value),
                                        }));
                                        setDirty(true);
                                      }}
                                    />
                                    {discountOverrides[project.id] !== undefined && (
                                      <button
                                        type="button"
                                        className="admin-secondary"
                                        onClick={() => {
                                          setDiscountOverrides((current) => {
                                            const next = { ...current };
                                            delete next[project.id];
                                            return next;
                                          });
                                          setDirty(true);
                                        }}
                                      >
                                        Implicit {discountPercent}%
                                      </button>
                                    )}
                                  </span>
                                </label>
                              )}
                            </article>
                          );
                        })}
                      </div>
                      {filteredCatalog.length === 0 && (
                        <div className="admin-discount-empty" role="status">
                          <strong>Niciun proiect nu corespunde filtrelor.</strong>
                          <span>Schimbă căutarea, intervalul de preț sau starea reducerii.</span>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "payment" && (
                    <div className="admin-payment-settings">
                      <section>
                        <h3>Plata în rate</h3>
                        <div className="admin-payment-plans">
                          {paymentDraft.installmentPlans.map((plan, index) => (
                            <article key={index}>
                              <strong>Planul {index + 1}</strong>
                              <label>
                                <span>Perioada (luni)<DraftStatus isDraft={!sameNumber(plan.months, savedPaymentDraft.installmentPlans[index]?.months ?? Number.NaN)} onRestore={() => { const installmentPlans = [...paymentDraft.installmentPlans]; installmentPlans[index] = { ...plan, months: savedPaymentDraft.installmentPlans[index]?.months ?? plan.months }; setPaymentDraft({ ...paymentDraft, installmentPlans }); setDirty(true); }} /></span>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  required
                                  value={Number.isNaN(plan.months) ? "" : plan.months}
                                  onChange={(event) => {
                                    const installmentPlans = [
                                      ...paymentDraft.installmentPlans,
                                    ];
                                    installmentPlans[index] = {
                                      ...plan,
                                      months:
                                        event.target.value === ""
                                          ? Number.NaN
                                          : Number(event.target.value),
                                    };
                                    setPaymentDraft({
                                      ...paymentDraft,
                                      installmentPlans,
                                    });
                                    setDirty(true);
                                  }}
                                />
                              </label>
                              <label>
                                <span>Adaos la preț (%)<DraftStatus isDraft={!sameNumber(plan.surcharge, savedPaymentDraft.installmentPlans[index]?.surcharge ?? Number.NaN)} onRestore={() => { const installmentPlans = [...paymentDraft.installmentPlans]; installmentPlans[index] = { ...plan, surcharge: savedPaymentDraft.installmentPlans[index]?.surcharge ?? plan.surcharge }; setPaymentDraft({ ...paymentDraft, installmentPlans }); setDirty(true); }} /></span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  required
                                  value={
                                    Number.isNaN(plan.surcharge)
                                      ? ""
                                      : plan.surcharge
                                  }
                                  onChange={(event) => {
                                    const installmentPlans = [
                                      ...paymentDraft.installmentPlans,
                                    ];
                                    installmentPlans[index] = {
                                      ...plan,
                                      surcharge:
                                        event.target.value === ""
                                          ? Number.NaN
                                          : Number(event.target.value),
                                    };
                                    setPaymentDraft({
                                      ...paymentDraft,
                                      installmentPlans,
                                    });
                                    setDirty(true);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                className="admin-icon-button admin-danger"
                                aria-label={`Elimină planul ${index + 1}`}
                                title="Elimină opțiunea"
                                disabled={paymentDraft.installmentPlans.length <= 1}
                                onClick={() => {
                                  setPaymentDraft({
                                    ...paymentDraft,
                                    installmentPlans:
                                      paymentDraft.installmentPlans.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                      ),
                                  });
                                  setDirty(true);
                                }}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4.8h6V7m2 0-.7 12H7.7L7 7m3.5 4v4.5m3-4.5v4.5" /></svg>
                              </button>
                            </article>
                          ))}
                          <button
                          type="button"
                          className="admin-add-plan"
                          aria-label="Adaugă opțiune de plată în rate"
                          title="Adaugă opțiune"
                          onClick={() => {
                            setPaymentDraft({
                              ...paymentDraft,
                              installmentPlans: [
                                ...paymentDraft.installmentPlans,
                                {
                                  months: nextInstallmentMonths(
                                    paymentDraft.installmentPlans,
                                  ),
                                  surcharge: 0,
                                },
                              ],
                            });
                            setDirty(true);
                          }}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                        </div>
                        <PaymentItemsEditor
                            title="Servicii — cumpără în rate"
                            items={paymentDraft.installmentServices}
                            newItem={{ name: "", included: true }}
                            onChange={(installmentServices) => { setPaymentDraft({ ...paymentDraft, installmentServices }); setDirty(true); }}
                            onRestore={() => { setPaymentDraft({ ...paymentDraft, installmentServices: savedPaymentDraft.installmentServices.map((item) => ({ ...item })) }); setDirty(true); }}
                          />
                        <PaymentItemsEditor
                            title="Beneficii — cumpără în rate"
                            items={paymentDraft.installmentBenefits}
                            newItem={{ name: "", included: true }}
                            onChange={(installmentBenefits) => { setPaymentDraft({ ...paymentDraft, installmentBenefits }); setDirty(true); }}
                            onRestore={() => { setPaymentDraft({ ...paymentDraft, installmentBenefits: savedPaymentDraft.installmentBenefits.map((item) => ({ ...item })) }); setDirty(true); }}
                          />
                      </section>
                      <section>
                        <h3>Chirie lunară</h3>
                        <div className="admin-rental-settings">
                          <label>
                            <span>Perioada contractului (luni)<DraftStatus isDraft={!sameNumber(paymentDraft.rentalMonths, savedPaymentDraft.rentalMonths)} onRestore={() => { setPaymentDraft({ ...paymentDraft, rentalMonths: savedPaymentDraft.rentalMonths }); setDirty(true); }} /></span>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              step="1"
                              required
                              value={
                                Number.isNaN(paymentDraft.rentalMonths)
                                  ? ""
                                  : paymentDraft.rentalMonths
                              }
                              onChange={(event) => {
                                setPaymentDraft({
                                  ...paymentDraft,
                                  rentalMonths:
                                    event.target.value === ""
                                      ? Number.NaN
                                      : Number(event.target.value),
                                });
                                setDirty(true);
                              }}
                            />
                          </label>
                          <PaymentItemsEditor
                            title="Servicii — chirie lunară"
                            items={paymentDraft.rentalServices}
                            newItem={{ name: "", included: true, price: 0 }}
                            onChange={(rentalServices) => { setPaymentDraft({ ...paymentDraft, rentalServices }); setDirty(true); }}
                            onRestore={() => { setPaymentDraft({ ...paymentDraft, rentalServices: savedPaymentDraft.rentalServices.map((item) => ({ ...item })) }); setDirty(true); }}
                          />
                          <PaymentItemsEditor
                            title="Beneficii — chirie lunară"
                            items={paymentDraft.rentalBenefits}
                            newItem={{ name: "", included: true }}
                            onChange={(rentalBenefits) => { setPaymentDraft({ ...paymentDraft, rentalBenefits }); setDirty(true); }}
                            onRestore={() => { setPaymentDraft({ ...paymentDraft, rentalBenefits: savedPaymentDraft.rentalBenefits.map((item) => ({ ...item })) }); setDirty(true); }}
                          />
                        </div>
                      </section>
                    </div>
                  )}
                  {section === "media" && (
                    <>
                      <p>
                        JPEG, PNG, WebP sau AVIF · maximum 5 MB / imagine ·
                        maximum 16.000 px pe latură.{" "}
                        {slot?.max === 1
                          ? "O singură copertă."
                          : "Până la 12 imagini, în ordinea de mai jos."}
                      </p>
                      <p>
                        Imaginea existentă rămâne publicată până la salvarea cu
                        succes. Eliminarea o retrage din această secțiune;
                        fișierele comune sunt păstrate.
                      </p>
                      {images.map((image, index) => (
                        <article className="admin-image" key={image.src}>
                          <img
                            src={displayImageUrl(image.src)}
                            alt={image.alt || "Previzualizare copertă"}
                            onError={(e) => {
                              e.currentTarget.hidden = true;
                            }}
                          />
                          <label>
                            Text alternativ
                            <input
                              maxLength={1000}
                              value={image.alt}
                              onChange={(e) => {
                                setImages((current) =>
                                  current.map((item, i) =>
                                    i === index
                                      ? { ...item, alt: e.target.value }
                                      : item,
                                  ),
                                );
                                setDirty(true);
                              }}
                            />
                          </label>
                          <div className="admin-image-actions">
                            <label className="admin-upload">
                              Înlocuiește
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                onChange={(e) => {
                                  void addImage(e.target.files?.[0], index);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            {images.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => {
                                    const next = [...images];
                                    [next[index - 1], next[index]] = [
                                      next[index],
                                      next[index - 1],
                                    ];
                                    setImages(next);
                                    setDirty(true);
                                  }}
                                >
                                  Mai sus
                                </button>
                                <button
                                  type="button"
                                  disabled={index === images.length - 1}
                                  onClick={() => {
                                    const next = [...images];
                                    [next[index + 1], next[index]] = [
                                      next[index],
                                      next[index + 1],
                                    ];
                                    setImages(next);
                                    setDirty(true);
                                  }}
                                >
                                  Mai jos
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              className="admin-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Elimini această imagine din secțiune? Schimbarea se publică după salvare.",
                                  )
                                ) {
                                  setImages((current) =>
                                    current.filter((_, i) => i !== index),
                                  );
                                  setDirty(true);
                                }
                              }}
                            >
                              Elimină
                            </button>
                          </div>
                        </article>
                      ))}
                      {!images.length && (
                        <p>
                          Nu este selectată nicio imagine. Dacă nu ai salvat
                          încă o copertă aici, site-ul păstrează ilustrația
                          originală.
                        </p>
                      )}
                      {images.length < (slot?.max ?? 1) && (
                        <label className="admin-upload">
                          Adaugă imagine
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={(e) => {
                              void addImage(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </>
                  )}
                </fieldset>
                <div className="admin-save">
                  {(section === "price" || section === "discount") &&
                    (section === "price" ? pricePageCount : discountPageCount) > 1 && (
                      <nav className="admin-discount-pagination admin-save-pagination" aria-label="Paginarea proiectelor">
                        <button
                          type="button"
                          className="admin-secondary"
                          disabled={busy || (section === "price" ? priceCurrentPage : discountCurrentPage) === 0}
                          onClick={() => setPage((section === "price" ? priceCurrentPage : discountCurrentPage) - 1)}
                        >← Înapoi</button>
                        <span>Pagina <strong>{(section === "price" ? priceCurrentPage : discountCurrentPage) + 1}</strong> din {section === "price" ? pricePageCount : discountPageCount}</span>
                        <button
                          type="button"
                          className="admin-secondary"
                          disabled={busy || (section === "price" ? priceCurrentPage >= pricePageCount - 1 : discountCurrentPage >= discountPageCount - 1)}
                          onClick={() => setPage((section === "price" ? priceCurrentPage : discountCurrentPage) + 1)}
                        >Înainte →</button>
                      </nav>
                    )}
                </div>
              </form>
            )}
          </section>
        </div>
      )}
      {leaveAction && (
        <div className="admin-confirm-backdrop" role="presentation">
          <section
            className="admin-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-unsaved-title"
          >
            <p className="admin-eyebrow">Modificări nesalvate</p>
            <h2 id="admin-unsaved-title">Vrei să continui?</h2>
            <p>
              Modificările tale sunt păstrate local și le poți relua ulterior.
            </p>
            <div className="admin-confirm-actions">
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setLeaveAction(null)}
              >
                Rămâi aici
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = leaveAction;
                  setLeaveAction(null);
                  action();
                }}
              >
                Continuă
              </button>
            </div>
          </section>
        </div>
      )}
      {(error || message) && (
        <div
          className={`admin-notice ${error ? "admin-error" : ""}`}
          role={error ? "alert" : "status"}
        >
          <span>{error || message}</span>
          <button
            type="button"
            aria-label="Închide mesajul"
            onClick={() => {
              setError("");
              setMessage("");
            }}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
