"use client";
import { cmsText } from "../lib/cms-store";
import { useCms } from "../components/cms-live";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Link2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Locale, locales } from "../i18n";
import { BrandLogo } from "../brand-logo";
import { localePath } from "../lib/site-config";
import { getFaqCategories } from "../lib/faq-content";
import { faqUi } from "../lib/faq-ui";
import { FooterLinks } from "../components/seo-shell";
import { JsonLd, faqSchema } from "../components/json-ld";
import "./intrebari.css";
import "../page-language-switch.css";

export default function QuestionsPage({
  initialLocale = "ro",
}: {
  initialLocale?: Locale;
}) {
  useCms();
  const locale = initialLocale;
  const c = faqUi[locale];
  const categories = getFaqCategories(locale);
  const [active, setActive] = useState<string | null>(null);
  const [sharedCategory, setSharedCategory] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [open, setOpen] = useState<string[]>([]);
  const count = categories.reduce(
    (total, category) => total + category.questions.length,
    0,
  );
  const toggleCategory = (
    category: (typeof categories)[number],
    trigger: HTMLButtonElement,
  ) => {
    const willOpen = active !== category.title;
    const categoryElement = trigger.closest<HTMLElement>(
      ".faq-category-option",
    );
    setActive((current) =>
      current === category.title ? null : category.title,
    );
    setOpen([]);
    if (willOpen && categoryElement) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          categoryElement.scrollIntoView({ block: "start", behavior: "auto" }),
        ),
      );
    }
  };
  const shareCategory = async (category: (typeof categories)[number]) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${category.code}`;
    const shareData = {
      title: category.title,
      text: category.description,
      url,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copiat. Îl poți trimite unde dorești.");
    } catch {
      window.prompt("Copiază linkul categoriei:", url);
    }
    window.setTimeout(() => setShareMessage(null), 3500);
  };
  useEffect(() => {
    let highlightTimer: number | undefined;
    const openCategoryFromHash = () => {
      const code = decodeURIComponent(window.location.hash).replace(
        "#faq-",
        "",
      );
      const category = categories.find((item) => item.code === code);
      if (category) {
        setActive(category.title);
        setOpen([]);
        setSharedCategory(category.title);
        window.clearTimeout(highlightTimer);
        highlightTimer = window.setTimeout(() => setSharedCategory(null), 5000);
      }
    };
    openCategoryFromHash();
    window.addEventListener("hashchange", openCategoryFromHash);
    return () => {
      window.removeEventListener("hashchange", openCategoryFromHash);
      window.clearTimeout(highlightTimer);
    };
  }, [locale]);
  const renderQuestions = (category: (typeof categories)[number]) => (
    <div className="faq-inline-questions" hidden={active !== category.title}>
      <p>{category.description}</p>
      <div className="faq-list">
        {category.questions.map((item, index) => {
          const id = `${category.code}-${index}`;
          const isOpen = open.includes(id);
          return (
            <article className={isOpen ? "open" : ""} key={id}>
              <button
                aria-controls={`answer-${id}`}
                aria-expanded={isOpen}
                onClick={() =>
                  setOpen((current) =>
                    isOpen
                      ? current.filter((openId) => openId !== id)
                      : [...current, id],
                  )
                }
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.question}</strong>
                <ChevronDown />
              </button>
              <div className="faq-answer" id={`answer-${id}`} hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
  return (
    <main className="faq-page">
      <div className="faq-noise" aria-hidden="true" />
      <header className="faq-nav">
        <BrandLogo className="faq-logo" href={localePath(locale)} inverse />
        <div className="faq-runtime">
          <i /> {c.knowledge} <b>{cmsText("faq-client", "literal-2485f4d55aae6c5b", "v1.0.0")}</b>
        </div>
        <div className="page-nav-tools">
          <nav className="page-language-switch" aria-label={c.language}>
            {locales.map((language) => (
              <a
                key={language}
                className={locale === language ? "active" : ""}
                href={localePath(language, "intrebari")}
                data-analytics-event="language_change"
                data-language={language}
                hrefLang={language}
                lang={language}
              >
                {language.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <section className="faq-hero">
        <div>
          <a className="faq-back faq-hero-back" href={localePath(locale)}>
            <ArrowLeft /> {c.back}
          </a>
          <p className="faq-kicker">
            <span>{cmsText("faq-client", "literal-f1534392279bddbf", "00")}</span> {cmsText("faq-client", "literal-005e1574a2b5c816", " / ")}{c.kicker}
          </p>
          <h1>
            {c.hero[0]}
            <br />
            {c.hero[1]} <em>{c.hero[2]}</em>
            <br />
            {c.hero[3]}
          </h1>
          <p className="faq-lead">{c.lead}</p>
        </div>
        <div className="faq-stat-card">
          <em className="faq-stat-edition">
            {cmsText("faq-client", "literal-7dbef783a890cc6b", "KNOWLEDGE")}<br />
            {cmsText("faq-client", "literal-344328bd87a04220", "EDITION")}</em>
          <Sparkles />
          <strong>{count}</strong>
          <span>
            {c.answers}
            <br />
            <b>{c.meaningful}</b>
          </span>
          <small>{cmsText("faq-client", "literal-6505c08c957ef99b", "STATUS: READY_TO_HELP")}</small>
        </div>
      </section>
      <section className="faq-workspace">
        <aside className="faq-sidebar">
          <p>{cmsText("faq-client", "literal-5da345a47290ee22", "/ ")}{c.navigation}</p>
          {categories.map((category) => (
            <div
              key={category.title}
              id={`faq-${category.code}`}
              className={`faq-category-option${active === category.title ? " active" : ""}`}
            >
              <div
                className={`faq-category-actions${sharedCategory === category.title ? " shared" : ""}`}
              >
                <button
                  className={active === category.title ? "selected" : ""}
                  aria-expanded={active === category.title}
                  onClick={(event) =>
                    toggleCategory(category, event.currentTarget)
                  }
                >
                  <span>{category.code}</span> {category.title}
                </button>
                <button
                  className="faq-category-share"
                  type="button"
                  onClick={() => void shareCategory(category)}
                  aria-label={`Distribuie categoria ${category.title}`}
                  title={cmsText("faq-client", "literal-d129ea7609286d9e", "Distribuie categoria")}
                >
                  <Link2 />
                </button>
              </div>
              {renderQuestions(category)}
            </div>
          ))}
          <a href={localePath(locale, "contact")}>
            {c.moreQuestions} <ArrowUpRight />
          </a>
        </aside>
      </section>
      {shareMessage && (
        <p className="faq-share-message" role="status">
          {shareMessage}
        </p>
      )}
      <JsonLd
        data={faqSchema(
          categories.flatMap((category) =>
            category.questions.map((item) => ({
              q: item.question,
              a: item.answer,
            })),
          ),
        )}
      />
      <footer className="faq-footer">
        <div className="faq-footer-main">
          <span>{cmsText("faq-client", "literal-b17f48f4917456d7", "© 2026 MONO/DEV")}</span>
          <p>{c.footer}</p>
          <a href={localePath(locale, "contact")}>
            {c.contact} <ArrowUpRight />
          </a>
        </div>
        <FooterLinks locale={locale} />
      </footer>
    </main>
  );
}
