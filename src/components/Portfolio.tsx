"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Menu, X } from "lucide-react";
import { content, Language } from "@/data/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const MonitorIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><rect x="3" y="3" width="18" height="13" rx="1" /><path d="M8 21h8M12 16v5" /><g className="monitor-site"><rect x="6" y="6" width="12" height="7" fill="currentColor" stroke="none" /><path d="M8 9h4M8 11h8" stroke="var(--blue)" /></g></svg>;
const ServerIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><circle className="server-light server-light-one" cx="7" cy="6.5" r="1.2" fill="currentColor" stroke="none" /><circle className="server-light server-light-two" cx="7" cy="17.5" r="1.2" fill="currentColor" stroke="none" /></svg>;
const WorkflowIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><path className="workflow-line workflow-line-one" d="M5 4v13" /><path className="workflow-line workflow-line-two" d="M5 17c7 0 12-2 12-9" /><circle cx="5" cy="19" r="2" /><circle cx="17" cy="6" r="2" /></svg>;
const FullstackIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="m8 8-4 4 4 4M16 8l4 4-4 4" /><path className="fullstack-slash" d="m14 5-4 14" /></svg>;
const UniversityIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><path d="M3 9h18L12 3 3 9ZM3 21h18M5 18h14" /><path className="university-column column-one" d="M6 10v8" /><path className="university-column column-two" d="M10 10v8" /><path className="university-column column-three" d="M14 10v8" /><path className="university-column column-four" d="M18 10v8" /></svg>;
const GraduationIcon = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><g className="graduation-cap"><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3 3 9 3 12 0v-5M22 9v6" /></g></svg>;
const BuildMarkIcon = () => <svg className="build-mark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="M8 4H6v6l-2 2 2 2v6h2M16 4h2v6l2 2-2 2v6h-2" /><path className="build-cursor" d="M12 7v10" /></svg>;
const AnimatedRocketIcon = () => <svg className="animated-rocket-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path className="rocket-flame" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
const ConsoleIcon = () => <svg className="hero-console-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><rect x="2" y="3" width="20" height="18" rx="1" /><path d="M2 8h20M5 5.5h.01M8 5.5h.01M6 12l3 2-3 2" /><path className="console-underscore" d="M12 17h5" /></svg>;

export default function Portfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState("");
  const [activeAboutTab, setActiveAboutTab] = useState(0);
  const [displayedAboutText, setDisplayedAboutText] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = content[language];

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem("portfolio-language", nextLanguage);
  };

  const navHref = (id: string) => {
    if (id === "projects") return "/projects";
    return `#${id}`;
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);
    if (id === "projects") return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedSection("");
    requestAnimationFrame(() => setHighlightedSection(id));
    window.setTimeout(() => setHighlightedSection((current) => current === id ? "" : current), 16400);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage === "uk" || savedLanguage === "en") setLanguage(savedLanguage);
    const initialSection = window.location.hash.slice(1);
    if (["about", "skills", "education", "contact"].includes(initialSection)) {
      setHighlightedSection(initialSection);
      window.setTimeout(() => setHighlightedSection(""), 16400);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [language, contactOpen]);

  useEffect(() => {
    const fullText = t.aboutTabs[activeAboutTab][1];
    let characterIndex = 0;
    setDisplayedAboutText("");
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setDisplayedAboutText(fullText.slice(0, characterIndex));
      if (characterIndex >= fullText.length) window.clearInterval(typingTimer);
    }, 14);
    return () => window.clearInterval(typingTimer);
  }, [activeAboutTab, language, t.aboutTabs]);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Vladyslav Huminiuk — home">
          <span>VH</span>
          <em className="logo-pixels" aria-hidden="true"><b /><b /><b /><b /><b /></em>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {t.nav.map(([id, label]) => <a key={id} href={navHref(id)} onClick={(event) => handleNavClick(event, id)}>{label}</a>)}
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

      <div className="main-bento">
      <section className="hero" id="top">
        <div className={`portrait-wrap nav-focus-target ${highlightedSection === "contact" ? "nav-highlight" : ""}`} id="contact">
          <p className="eyebrow portrait-status"><span />{t.eyebrow}</p>
          <div className="portrait-frame">
            <div className="portrait-image-plane"><img src="/vlad-pixel-portrait-v2.png" alt="Vladyslav Huminiuk" /></div>
            {["<React />", "Node.js", "Next.js"].map((stack, index) => <span key={stack} className={`code-tag stack-tag stack-tag-${index + 1}`}>{stack}</span>)}
            <p>FULL-STACK DEVELOPER</p>
          </div>
          <div className="portrait-details">
            <p className="hero-intro">{t.intro}</p>
          </div>
          <div className="portrait-controls">
            <div className="portrait-actions">
              <button className="primary-button" onClick={() => { setStatus("idle"); setContactOpen(true); }}>{t.contact}<ArrowUpRight /></button>
              <a className="text-link" href="/projects">{t.projectsButton}<ArrowDownRight /></a>
            </div>
            <div className="portrait-socials">
              <a href="https://github.com/70X14" target="_blank" rel="noreferrer" aria-label="GitHub"><Github />GitHub</a>
              <a href="https://www.linkedin.com/in/vladyslav-huminiuk" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin />LinkedIn</a>
              <a href="mailto:vldgum@gmail.com" aria-label="Email"><Mail />Email</a>
            </div>
          </div>
        </div>
        <div className="hero-copy">
          <div className={`left-profile-card nav-focus-target ${highlightedSection === "about" ? "nav-highlight" : ""}`} id="about">
            <h1><ConsoleIcon /><small>{t.hello}</small><span className="hero-title-text">{t.title}</span></h1>
            <section className="profile-section about left-about">
              <p className="section-kicker">{t.aboutKicker}</p>
              <div className="terminal-about">
                <div className="terminal-bar"><span /><span /><span /><strong>vlad@portfolio:~</strong></div>
                <div className="terminal-commands" role="tablist" aria-label={t.aboutKicker}>{["whoami", "approach", "build", "learning"].map((command, index) => <button key={command} className={activeAboutTab === index ? "active" : ""} onClick={() => setActiveAboutTab(index)} role="tab" aria-selected={activeAboutTab === index}>./{command}</button>)}</div>
                <div className="terminal-output" role="tabpanel">
                  <p className="terminal-prompt"><span>vlad@portfolio</span>:~$ {`./${["whoami", "approach", "build", "learning"][activeAboutTab]}`}</p>
                  <h2>{t.aboutTabs[activeAboutTab][0]}</h2>
                  <p className="typing-output">{displayedAboutText}<i className="typing-cursor" aria-hidden="true" /></p>
                </div>
                <div className="terminal-stats">{t.aboutFacts.map(([value, label]) => <span key={label}><strong>{value}</strong> {label}</span>)}</div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="profile-content">
      <section className={`section profile-section dark-section nav-focus-target ${highlightedSection === "skills" ? "nav-highlight" : ""}`} id="skills">
        <p className="section-kicker">{t.skillsKicker}</p>
        <div className="profile-card">
          <div className="profile-info"><h2>{t.skillsTitle}</h2><p className="mono-note"><BuildMarkIcon /><span>BUILD · TEST · IMPROVE</span><AnimatedRocketIcon /></p><div className="skill-list">{t.skillGroups.map(([title, list], index) => {
            const SkillIcon = [MonitorIcon, ServerIcon, WorkflowIcon][index];
            return <article key={title}><h3>{title}</h3><SkillIcon className="skill-group-icon" aria-hidden="true" /><ul>{list.split(", ").map((skill) => <li key={skill}>{skill}</li>)}</ul></article>;
          })}</div></div>
        </div>
      </section>

      <section className={`section profile-section education nav-focus-target ${highlightedSection === "education" ? "nav-highlight" : ""}`} id="education">
        <p className="section-kicker">{t.educationKicker}</p>
        <div className="profile-card">
          <div className="profile-info"><h2>{t.educationTitle}</h2><div className="timeline">{t.education.map(([year, degree, place], index) => {
            const EducationIcon = [FullstackIcon, UniversityIcon, GraduationIcon][index];
            return <article key={degree}><time>{year}</time><div><h3>{degree}</h3><p>{place}</p></div><EducationIcon className="education-icon" aria-hidden="true" /></article>;
          })}</div></div>
        </div>
      </section>
      </div>
      </div>

      <footer className="footer copyright-footer" id="site-footer">
        <p className="copyright">© 2026 Vladyslav Huminiuk</p>
        <p className="footer-location"><MapPin aria-hidden="true" />{t.location}</p>
      </footer>

      {contactOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}>
        <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <button className="modal-close" onClick={() => setContactOpen(false)} aria-label={t.close}><X /></button>
          <p className="section-kicker">CONTACT / FORM</p><h2 id="contact-title">{t.formTitle}</h2><p>{t.formText}</p>
          <form onSubmit={submitContact}>
            <label>{t.name}<input name="name" type="text" minLength={2} maxLength={80} required /></label>
            <label>{t.email}<input name="email" type="email" maxLength={120} required /></label>
            <label>{t.message}<textarea name="message" minLength={20} maxLength={500} rows={4} required /><small className="character-limit">{t.messageLimit}</small></label>
            <input className="honey" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="primary-button" type="submit" disabled={status === "loading"}>{status === "loading" ? t.sending : t.send}<ArrowUpRight /></button>
            {status === "success" && <p className="form-message success">{t.success}</p>}
            {status === "error" && <p className="form-message error">{t.error}</p>}
          </form>
        </section>
      </div>}
    </main>
  );
}
