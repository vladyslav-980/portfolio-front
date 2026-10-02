"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Braces, Check, FolderKanban, Github, GraduationCap, Layers3, Linkedin, Mail, MapPin, Menu, Search, Send, UserRound, X } from "lucide-react";
import { content, Language } from "@/data/content";
import { API_URL } from "@/lib/api";

type ApiProject = {
  _id: string;
  slug: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  type: string;
  stack: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
};

const NavItemIcon = ({ id }: { id: string }) => {
  const Icon = id === "about" ? UserRound : id === "skills" ? Layers3 : id === "education" ? GraduationCap : id === "contact" ? Send : FolderKanban;
  return <Icon className="nav-item-icon" aria-hidden="true" />;
};

const ProjectsWindowIcon = () => (
  <svg viewBox="0 0 128 112" aria-hidden="true">
    <path className="icon-shadow" d="M12 27h42l9 10h53v65H12z" />
    <path className="icon-folder" d="M7 20h44l10 11h60v65H7z" />
    <path className="icon-screen" d="M18 42h92v40H18z" />
    <path className="icon-line" d="M28 53h35M28 63h56M28 73h42" />
  </svg>
);

export default function ProjectsPortfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [projectsStatus, setProjectsStatus] = useState<"loading" | "success" | "error">("loading");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successClosing, setSuccessClosing] = useState(false);
  const [crtSignalActive, setCrtSignalActive] = useState(false);
  const [resultsSignalActive, setResultsSignalActive] = useState(false);
  const [projectsWindowMode, setProjectsWindowMode] = useState<"normal" | "minimized" | "maximized" | "closed">("normal");
  const [projectsWindowTransition, setProjectsWindowTransition] = useState<"idle" | "into-folder" | "launcher-opening" | "out-of-folder">("idle");
  const crtSignalTimer = useRef<number | null>(null);
  const resultsSignalStartTimer = useRef<number | null>(null);
  const resultsSignalEndTimer = useRef<number | null>(null);
  const windowTransitionTimer = useRef<number | null>(null);
  const windowTransitionEndTimer = useRef<number | null>(null);
  const projectsWindowBodyRef = useRef<HTMLDivElement | null>(null);
  const t = content[language];

  const clearWindowTransitionTimers = () => {
    if (windowTransitionTimer.current) window.clearTimeout(windowTransitionTimer.current);
    if (windowTransitionEndTimer.current) window.clearTimeout(windowTransitionEndTimer.current);
  };

  const sendWindowToFolder = (nextMode: "minimized" | "closed") => {
    if (projectsWindowTransition !== "idle") return;
    clearWindowTransitionTimers();
    setProjectsWindowTransition("into-folder");
    windowTransitionTimer.current = window.setTimeout(() => {
      setProjectsWindowMode(nextMode);
      setProjectsWindowTransition("idle");
    }, 140);
  };

  const restoreWindowFromFolder = () => {
    if (projectsWindowTransition !== "idle") return;
    clearWindowTransitionTimers();
    setProjectsWindowTransition("launcher-opening");
    windowTransitionTimer.current = window.setTimeout(() => {
      setProjectsWindowMode("normal");
      setProjectsWindowTransition("out-of-folder");
      windowTransitionEndTimer.current = window.setTimeout(() => setProjectsWindowTransition("idle"), 175);
    }, 80);
  };

  const triggerCrtSignal = () => {
    if (crtSignalTimer.current) window.clearTimeout(crtSignalTimer.current);
    if (resultsSignalStartTimer.current) window.clearTimeout(resultsSignalStartTimer.current);
    if (resultsSignalEndTimer.current) window.clearTimeout(resultsSignalEndTimer.current);
    setCrtSignalActive(false);
    setResultsSignalActive(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setCrtSignalActive(true)));
    crtSignalTimer.current = window.setTimeout(() => setCrtSignalActive(false), 1050);
    resultsSignalStartTimer.current = window.setTimeout(() => setResultsSignalActive(true), 950);
    resultsSignalEndTimer.current = window.setTimeout(() => setResultsSignalActive(false), 2350);
  };

  const filterCopy = language === "uk" ? {
    title: "Пошук і сортування", search: "Пошук проєктів", placeholder: "Назва, технологія або опис...",
    all: "Усі", commercial: "Комерційні", pet: "Пет-проєкти", inProgress: "В процесі",
    empty: "Проєктів за цими параметрами не знайдено", loading: "Завантаження проєктів...", error: "Не вдалося завантажити проєкти",
  } : {
    title: "Search & sort", search: "Search projects", placeholder: "Title, technology or description...",
    all: "All", commercial: "Commercial", pet: "Pet projects", inProgress: "In progress",
    empty: "No projects match these filters", loading: "Loading projects...", error: "Could not load projects",
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setProjectsStatus("loading");
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (query.trim()) params.set("search", query.trim());
      if (projectFilter !== "all") params.set("type", projectFilter);

      try {
        const response = await fetch(`${API_URL}/api/projects?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Projects request failed");
        const data = await response.json() as { items?: ApiProject[]; total?: number };
        setProjects(Array.isArray(data.items) ? data.items : []);
        setProjectsTotal(typeof data.total === "number" ? data.total : data.items?.length ?? 0);
        setProjectsStatus("success");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProjectsTotal(0);
        setProjectsStatus("error");
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, projectFilter]);

  useEffect(() => {
    projectsWindowBodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [query, projectFilter, projectsStatus]);

  const projectTypeLabel = (type: string) => {
    const labels: Record<string, Record<Language, string>> = {
      commercial: { uk: "Комерційний проєкт", en: "Commercial project" },
      pet: { uk: "Пет-проєкт", en: "Pet project" },
      "in-progress": { uk: "В процесі", en: "In progress" },
    };
    return labels[type]?.[language] ?? type;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage === "uk" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

  useEffect(() => () => {
    if (crtSignalTimer.current) window.clearTimeout(crtSignalTimer.current);
    if (resultsSignalStartTimer.current) window.clearTimeout(resultsSignalStartTimer.current);
    if (resultsSignalEndTimer.current) window.clearTimeout(resultsSignalEndTimer.current);
    clearWindowTransitionTimers();
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem("portfolio-language", nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.style.overflow = contactOpen || projectsWindowMode === "maximized" ? "hidden" : "";
    document.body.classList.toggle("projects-window-fullscreen", projectsWindowMode === "maximized");
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("projects-window-fullscreen");
    };
  }, [language, contactOpen, projectsWindowMode]);

  useEffect(() => {
    if (projectsWindowMode !== "maximized") return;
    const restoreWindow = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProjectsWindowMode("normal");
    };
    window.addEventListener("keydown", restoreWindow);
    return () => window.removeEventListener("keydown", restoreWindow);
  }, [projectsWindowMode]);

  useEffect(() => {
    if (contactStatus !== "success") return;
    setSuccessClosing(false);
    const fadeTimer = window.setTimeout(() => setSuccessClosing(true), 7000);
    const closeTimer = window.setTimeout(() => {
      setContactOpen(false);
      setContactStatus("idle");
      setSuccessClosing(false);
    }, 7600);
    return () => { window.clearTimeout(fadeTimer); window.clearTimeout(closeTimer); };
  }, [contactStatus]);

  const validateContactField = (fieldName: string, fieldValue: string) => {
    const value = fieldValue.trim();
    if (fieldName === "name") return value.length < 2 ? t.validation.name : "";
    if (fieldName === "email") {
      if (!value) return t.validation.emailRequired;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : t.validation.emailInvalid;
    }
    if (fieldName === "message") return value.length < 10 ? t.validation.message : "";
    return "";
  };

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = { name: String(formData.get("name") ?? "").trim(), email: String(formData.get("email") ?? "").trim(), message: String(formData.get("message") ?? "").trim() };
    const nextErrors: Record<string, string> = {};
    Object.entries(values).forEach(([fieldName, fieldValue]) => { const error = validateContactField(fieldName, fieldValue); if (error) nextErrors[fieldName] = error; });
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      setContactStatus("idle");
      (form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLElement | null)?.focus();
      return;
    }
    setFieldErrors({});
    setContactStatus("loading");
    try {
      const response = await fetch(`${API_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setContactStatus("success");
    } catch { setContactStatus("error"); }
  }

  const navHref = (id: string) => {
    if (id === "about") return "/#about";
    if (id === "projects") return "#projects";
    if (id === "reviews") return "#reviews";
    return `/#${id}`;
  };

  return (
    <main className="projects-page">
      <header className="site-header">
        <a className="logo" href="/#top" aria-label="Vladyslav Huminiuk — home">
          <span>VH</span>
          <em className="logo-pixels" aria-hidden="true"><b /><b /><b /><b /><b /></em>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {t.nav.map(([id, label]) => <a key={id} href={navHref(id)} onClick={() => setMenuOpen(false)}><i className="nav-item-dot" aria-hidden="true" /><span>{label}</span><NavItemIcon id={id} /></a>)}
          <div className="language mobile-language" aria-label="Language selector">
            <button className={language === "uk" ? "active" : ""} onClick={() => changeLanguage("uk")}>UA</button>
            <span>/</span>
            <button className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
          </div>
        </nav>
        <div className="header-actions">
          <div className="language" aria-label="Language selector">
            <button className={language === "uk" ? "active" : ""} onClick={() => changeLanguage("uk")}>UA</button>
            <span>/</span>
            <button className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="projects-filter-panel" id="projects" aria-label={filterCopy.title}>
        <div className="projects-filter-layout">
        <div className="projects-filter-heading">
          <p className="section-kicker">{t.projectsKicker}</p>
          <h1>{t.projectsTitle}</h1>
          <p className="projects-filter-description">{language === "uk" ? "Добірка комерційних і власних проєктів — від адаптивного інтерфейсу до серверної логіки та стабільного API." : "A selection of commercial and personal projects—from responsive interfaces to server-side logic and reliable APIs."}</p>
        </div>
        <div className="projects-computer">
        <div className={`projects-computer-screen ${crtSignalActive ? "signal-hit" : ""}`}>
        <div className="projects-filter-controls">
          <label className="project-search"><span>{filterCopy.search}</span><span className="project-search-field"><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); triggerCrtSignal(); }} onKeyDown={(event) => { if (event.key === "Enter") triggerCrtSignal(); }} placeholder={filterCopy.placeholder} /></span></label>
          <fieldset className="project-filter-group">
            <legend>{language === "uk" ? "Тип проєкту" : "Project type"}</legend>
            {(["all", "commercial", "pet", "in-progress"] as const).map((filter) => <button type="button" key={filter} className={projectFilter === filter ? "active" : ""} onClick={() => { setProjectFilter(filter); triggerCrtSignal(); }}>{filter === "in-progress" ? filterCopy.inProgress : filterCopy[filter]}</button>)}
          </fieldset>
          <div className="projects-console" key={`${projectsTotal}-${projectFilter}-${projectsStatus}`} role="status" aria-live="polite">
            <div className="projects-console-screen">
              <p><span>&gt;</span> {projectsTotal} projects loaded</p>
              <p><span>&gt;</span> filter: {projectFilter}</p>
              <p><span>&gt;</span> status: <strong>{projectsStatus === "success" ? "ready" : projectsStatus}</strong><i aria-hidden="true" /></p>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
      </section>

      <section className={`section projects ${resultsSignalActive ? "signal-scan" : ""}`}>
        {projectsWindowMode === "minimized" || projectsWindowMode === "closed" ? (
          <button className={`projects-window-launcher ${projectsWindowMode} ${projectsWindowTransition === "launcher-opening" ? "launcher-opening" : ""}`} type="button" onClick={restoreWindowFromFolder} disabled={projectsWindowTransition !== "idle"} aria-label={language === "uk" ? "Відкрити вікно проєктів" : "Open projects window"}>
            <ProjectsWindowIcon />
            <span>{projectsWindowMode === "minimized" ? (language === "uk" ? "ПРОЄКТИ ЗГОРНУТО" : "PROJECTS MINIMIZED") : (language === "uk" ? "ВІДКРИТИ ПРОЄКТИ" : "OPEN PROJECTS")}</span>
          </button>
        ) : <div className={`projects-window ${projectsWindowMode === "maximized" ? "maximized" : ""} ${projectsWindowTransition === "into-folder" ? "into-folder" : ""} ${projectsWindowTransition === "out-of-folder" ? "out-of-folder" : ""}`}>
          <div className="projects-window-titlebar">
            <span><i aria-hidden="true" />{language === "uk" ? "ПРОЄКТИ.EXE" : "PROJECTS.EXE"}</span>
            <div className="projects-window-controls" aria-label={language === "uk" ? "Керування вікном" : "Window controls"}>
              <button type="button" disabled={projectsWindowTransition !== "idle"} onClick={() => sendWindowToFolder("minimized")} aria-label={language === "uk" ? "Згорнути" : "Minimize"}>—</button>
              <button type="button" disabled={projectsWindowTransition !== "idle"} onClick={() => setProjectsWindowMode(projectsWindowMode === "maximized" ? "normal" : "maximized")} aria-label={projectsWindowMode === "maximized" ? (language === "uk" ? "Відновити розмір" : "Restore") : (language === "uk" ? "Розгорнути" : "Maximize")} aria-pressed={projectsWindowMode === "maximized"}>{projectsWindowMode === "maximized" ? "❐" : "□"}</button>
              <button type="button" disabled={projectsWindowTransition !== "idle"} onClick={() => sendWindowToFolder("closed")} className="window-close" aria-label={language === "uk" ? "Закрити" : "Close"}>×</button>
            </div>
          </div>
          <div className="projects-window-body" ref={projectsWindowBodyRef}>
            <div className="project-list" key={`${query}-${projectFilter}-${projectsStatus}`}>{projectsStatus === "success" && projects.map((project, index) => (
              <article className="project-card project-card-enter" key={project._id} style={{ animationDelay: `${index * 70}ms` }}>
                <div className="project-info"><p>{projectTypeLabel(project.type)}</p><h2>{project.title[language]}</h2><p className="project-description">{project.description[language]}</p><a className="project-open-button" href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noreferrer">{t.viewProject}<ArrowUpRight /></a></div>
                <div className="project-media">
                  <a className={`project-visual visual-${index % 3 + 1}${project.imageUrl ? " has-image" : ""}`} href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noreferrer" aria-label={`${t.viewProject}: ${project.title[language]}`} style={project.imageUrl ? { backgroundImage: `url(${project.imageUrl})` } : undefined}><strong>{project.title[language].slice(0, 2).toUpperCase()}</strong></a>
                  <span className="stack"><span>{project.stack.join(" · ")}</span><Braces aria-hidden="true" /></span>
                </div>
              </article>
            ))}</div>
            {projectsStatus === "loading" && <p className="projects-empty projects-loading">{filterCopy.loading}</p>}
            {projectsStatus === "error" && <p className="projects-empty projects-error">{filterCopy.error}</p>}
            {projectsStatus === "success" && projects.length === 0 && <p className="projects-empty">{filterCopy.empty}</p>}
          </div>
        </div>}
      </section>

      <section className="section reviews" id="reviews">
        <p className="section-kicker">{t.reviewsKicker}</p>
        <div className="section-grid"><h2>{t.reviewsTitle}</h2></div>
        <div className="review-grid">{t.reviews.map((review) => <blockquote key={review.author}><span>“</span><p>{review.quote}</p><footer><strong>{review.author}</strong><small>{review.role}</small></footer></blockquote>)}</div>
      </section>

      <section className="section project-contact" id="contact">
        <div><p className="section-kicker">{language === "uk" ? "Контакти" : "Contact"}</p><h2>{t.footerTitle}</h2><p>{t.footerText}</p><button className="primary-button" type="button" onClick={() => { setContactStatus("idle"); setFieldErrors({}); setContactOpen(true); }}>{t.contact}<ArrowUpRight /></button></div>
      </section>

      <footer className="footer copyright-footer projects-footer" id="site-footer">
        <p className="copyright">© 2026 Vladyslav Huminiuk</p>
        <div className="socials footer-socials"><a href="https://github.com/70X14" target="_blank" rel="noreferrer"><Github />GitHub</a><a href="https://www.linkedin.com/in/vladyslav-huminiuk" target="_blank" rel="noreferrer"><Linkedin />LinkedIn</a><a href="mailto:vldgum@gmail.com"><Mail />Email</a></div>
        <p className="footer-location"><MapPin aria-hidden="true" />{t.location}</p>
      </footer>

      {contactOpen && <div className={`modal-backdrop ${successClosing ? "success-closing" : ""}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setContactOpen(false); }}>
        <section className={`contact-modal ${contactStatus === "success" ? "contact-success-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="projects-contact-title">
          {contactStatus === "success" ? <div className="contact-success" role="status" aria-live="polite"><div className="contact-success-copy"><p className="section-kicker">MESSAGE / SENT</p><h2 id="projects-contact-title">{language === "uk" ? "Дякую!" : "Thank you!"}</h2><p>{language === "uk" ? "Ваше повідомлення успішно надіслано. Я зв’яжуся з вами найближчим часом." : "Your message has been sent successfully. I’ll get back to you soon."}</p></div><span className="contact-success-check" aria-hidden="true"><Check /></span></div> : <>
            <button className="modal-close" onClick={() => setContactOpen(false)} aria-label={t.close}><X /></button>
            <p className="section-kicker">CONTACT / FORM</p><h2 id="projects-contact-title">{t.formTitle}</h2><p>{t.formText}</p>
            <form onSubmit={submitContact} noValidate onInput={(event) => { const fieldName = (event.target as HTMLInputElement | HTMLTextAreaElement).name; if (fieldName && fieldErrors[fieldName]) setFieldErrors((current) => ({ ...current, [fieldName]: "" })); }} onBlur={(event) => { const field = event.target; if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !["name", "email", "message"].includes(field.name)) return; setFieldErrors((current) => ({ ...current, [field.name]: validateContactField(field.name, field.value) })); }}>
              <label>{t.name}<input className={fieldErrors.name ? "invalid" : ""} name="name" type="text" minLength={2} maxLength={80} required /><small className={`field-error ${fieldErrors.name ? "visible" : ""}`} role="alert">{fieldErrors.name || "\u00a0"}</small></label>
              <label>{t.email}<input className={fieldErrors.email ? "invalid" : ""} name="email" type="email" maxLength={120} required /><small className={`field-error ${fieldErrors.email ? "visible" : ""}`} role="alert">{fieldErrors.email || "\u00a0"}</small></label>
              <label>{t.message}<textarea className={fieldErrors.message ? "invalid" : ""} name="message" minLength={10} maxLength={500} rows={4} required /><small className="character-limit">{t.messageLimit}</small><small className={`field-error ${fieldErrors.message ? "visible" : ""}`} role="alert">{fieldErrors.message || "\u00a0"}</small></label>
              <input className="honey" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className="primary-button" type="submit" disabled={contactStatus === "loading"}>{contactStatus === "loading" ? t.sending : t.send}<ArrowUpRight /></button>
              {contactStatus === "error" && <p className="form-message error">{t.error}</p>}
            </form>
          </>}
        </section>
      </div>}
    </main>
  );
}
