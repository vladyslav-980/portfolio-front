"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, FolderKanban, Github, GraduationCap, Layers3, Linkedin, Mail, Menu, Send, UserRound, X } from "lucide-react";
import { content, Language } from "@/data/content";

const NavItemIcon = ({ id }: { id: string }) => {
  const Icon = id === "about" ? UserRound : id === "skills" ? Layers3 : id === "education" ? GraduationCap : id === "contact" ? Send : FolderKanban;
  return <Icon className="nav-item-icon" aria-hidden="true" />;
};

export default function ProjectsPortfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[language];

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

      <section className="projects-hero">
        <a className="back-link" href="/"><ArrowLeft />{language === "uk" ? "На головну" : "Back home"}</a>
        <p className="section-kicker">{t.projectsKicker}</p>
        <h1>{t.projectsTitle}</h1>
        <p>{language === "uk" ? "Добірка комерційних, командних і навчальних робіт — від інтерфейсу до серверної логіки." : "A selection of commercial, team and educational work — from interface to server-side logic."}</p>
      </section>

      <section className="section projects" id="projects">
        <div className="project-list">{t.projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <div className={`project-visual visual-${index + 1}`}><strong>{project.title.slice(0, 2).toUpperCase()}</strong></div>
            <div className="project-info"><p>{project.type}</p><h2>{project.title}</h2><p className="project-description">{project.description}</p><span className="stack">{project.stack}</span><a href={project.link} target="_blank" rel="noreferrer">{t.viewProject}<ArrowUpRight /></a></div>
          </article>
        ))}</div>
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
