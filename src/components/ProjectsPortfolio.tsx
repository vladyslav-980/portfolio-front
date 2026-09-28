"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, FolderKanban, Github, GraduationCap, Layers3, Linkedin, Mail, Menu, Search, Send, UserRound, X } from "lucide-react";
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

export default function ProjectsPortfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [projectSort, setProjectSort] = useState("default");
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [projectsStatus, setProjectsStatus] = useState<"loading" | "success" | "error">("loading");
  const t = content[language];

  const filterCopy = language === "uk" ? {
    title: "Пошук і сортування", search: "Пошук проєктів", placeholder: "Назва, технологія або опис...",
    all: "Усі", commercial: "Комерційні", team: "Командні", landing: "Лендинги",
    sort: "Сортування", defaultSort: "За замовчуванням", titleAsc: "Назва: А—Я", titleDesc: "Назва: Я—А",
    empty: "Проєктів за цими параметрами не знайдено", loading: "Завантаження проєктів...", error: "Не вдалося завантажити проєкти",
  } : {
    title: "Search & sort", search: "Search projects", placeholder: "Title, technology or description...",
    all: "All", commercial: "Commercial", team: "Team", landing: "Landings",
    sort: "Sort by", defaultSort: "Default order", titleAsc: "Title: A—Z", titleDesc: "Title: Z—A",
    empty: "No projects match these filters", loading: "Loading projects...", error: "Could not load projects",
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setProjectsStatus("loading");
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (query.trim()) params.set("search", query.trim());
      if (projectFilter !== "all") params.set("type", projectFilter);
      if (projectSort !== "default") {
        params.set("sort", "title");
        params.set("order", projectSort === "title-desc" ? "desc" : "asc");
      }

      try {
        const response = await fetch(`${API_URL}/api/projects?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Projects request failed");
        const data = await response.json() as { items?: ApiProject[] };
        setProjects(Array.isArray(data.items) ? data.items : []);
        setProjectsStatus("success");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProjectsStatus("error");
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, projectFilter, projectSort]);

  const projectTypeLabel = (type: string) => {
    const labels: Record<string, Record<Language, string>> = {
      commercial: { uk: "Комерційний проєкт", en: "Commercial project" },
      team: { uk: "Командний проєкт", en: "Team project" },
      landing: { uk: "Адаптивний лендинг", en: "Responsive landing" },
    };
    return labels[type]?.[language] ?? type;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage === "uk" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem("portfolio-language", nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const navHref = (id: string) => {
    if (id === "about") return "/#about";
    if (id === "projects") return "#projects";
    if (id === "reviews") return "#reviews";
    return `/#${id}`;
  };

  return (
    <main>
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

      <section className="projects-filter-panel" id="projects" aria-labelledby="projects-filter-title">
        <p className="section-kicker" id="projects-filter-title">// {filterCopy.title}</p>
        <div className="projects-filter-controls">
          <label className="project-search"><span>{filterCopy.search}</span><span className="project-search-field"><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={filterCopy.placeholder} /></span></label>
          <fieldset className="project-filter-group">
            <legend>{language === "uk" ? "Тип проєкту" : "Project type"}</legend>
            {(["all", "commercial", "team", "landing"] as const).map((filter) => <button type="button" key={filter} className={projectFilter === filter ? "active" : ""} onClick={() => setProjectFilter(filter)}>{filterCopy[filter]}</button>)}
          </fieldset>
          <label className="project-sort"><span>{filterCopy.sort}</span><select value={projectSort} onChange={(event) => setProjectSort(event.target.value)}><option value="default">{filterCopy.defaultSort}</option><option value="title-asc">{filterCopy.titleAsc}</option><option value="title-desc">{filterCopy.titleDesc}</option></select></label>
        </div>
      </section>

      <section className="section projects">
        <div className="project-list">{projectsStatus === "success" && projects.map((project, index) => (
          <article className="project-card" key={project._id}>
            <div className={`project-visual visual-${index % 3 + 1}`} style={project.imageUrl ? { backgroundImage: `url(${project.imageUrl})` } : undefined}><strong>{project.title[language].slice(0, 2).toUpperCase()}</strong></div>
            <div className="project-info"><p>{projectTypeLabel(project.type)}</p><h2>{project.title[language]}</h2><p className="project-description">{project.description[language]}</p><span className="stack">{project.stack.join(" · ")}</span><a href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noreferrer">{t.viewProject}<ArrowUpRight /></a></div>
          </article>
        ))}</div>
        {projectsStatus === "loading" && <p className="projects-empty projects-loading">{filterCopy.loading}</p>}
        {projectsStatus === "error" && <p className="projects-empty">{filterCopy.error}</p>}
        {projectsStatus === "success" && projects.length === 0 && <p className="projects-empty">{filterCopy.empty}</p>}
      </section>

      <section className="section reviews" id="reviews">
        <p className="section-kicker">{t.reviewsKicker}</p>
        <div className="section-grid"><h2>{t.reviewsTitle}</h2></div>
        <div className="review-grid">{t.reviews.map((review) => <blockquote key={review.author}><span>“</span><p>{review.quote}</p><footer><strong>{review.author}</strong><small>{review.role}</small></footer></blockquote>)}</div>
      </section>

      <footer className="footer compact-footer" id="contact">
        <div><p className="section-kicker">{language === "uk" ? "Контакти" : "Contact"}</p><h2>{t.footerTitle}</h2><p>{t.footerText}</p><a className="primary-button light" href="mailto:vldgum@gmail.com">{t.contact}<ArrowUpRight /></a></div>
        <div className="socials"><a href="https://github.com/70X14" target="_blank" rel="noreferrer"><Github />GitHub</a><a href="https://www.linkedin.com/in/vladyslav-huminiuk" target="_blank" rel="noreferrer"><Linkedin />LinkedIn</a><a href="mailto:vldgum@gmail.com"><Mail />Email</a></div>
        <p className="copyright">© {new Date().getFullYear()} Vladyslav Huminiuk</p>
      </footer>
    </main>
  );
}
