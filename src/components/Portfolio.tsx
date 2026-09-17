"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Menu, X } from "lucide-react";
import { content, Language } from "@/data/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function Portfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = content[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [language, contactOpen]);

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
        <a className="logo" href="#top" aria-label="Vladyslav Huminiuk — home"><span>VH</span><i /></a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {t.nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language" aria-label="Language selector">
            <button className={language === "uk" ? "active" : ""} onClick={() => setLanguage("uk")}>UA</button>
            <span>/</span>
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span />{t.eyebrow}</p>
          <h1><small>{t.hello}</small>{t.title}</h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => { setStatus("idle"); setContactOpen(true); }}>{t.contact}<ArrowUpRight /></button>
            <a className="text-link" href="#projects">{t.projectsButton}<ArrowDownRight /></a>
          </div>
          <div className="hero-meta"><span><MapPin size={16} />{t.location}</span><span className="status-dot">{t.available}</span></div>
        </div>
        <div className="portrait-wrap">
          <div className="portrait-frame">
            <img src="https://github.com/70X14.png" alt="Vladyslav Huminiuk" />
            <span className="code-tag tag-one">&lt;React /&gt;</span>
            <span className="code-tag tag-two">Node.js</span>
          </div>
          <p>FULL-STACK<br />DEVELOPER</p>
        </div>
      </section>

      <section className="section about" id="about">
        <p className="section-kicker">{t.aboutKicker}</p>
        <div className="section-grid">
          <h2>{t.aboutTitle}</h2>
          <div><p className="lead">{t.aboutText}</p><a className="inline-email" href="mailto:vldgum@gmail.com">vldgum@gmail.com <ArrowUpRight /></a></div>
        </div>
        <div className="facts">{t.facts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="section dark-section" id="skills">
        <p className="section-kicker">{t.skillsKicker}</p>
        <div className="section-grid"><h2>{t.skillsTitle}</h2><p className="mono-note">01 — BUILD<br />02 — TEST<br />03 — IMPROVE</p></div>
        <div className="skill-list">{t.skillGroups.map(([title, list], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{list}</p></article>)}</div>
      </section>

      <section className="section projects" id="projects">
        <p className="section-kicker">{t.projectsKicker}</p>
        <div className="section-grid"><h2>{t.projectsTitle}</h2></div>
        <div className="project-list">{t.projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <div className={`project-visual visual-${index + 1}`}><span>0{index + 1}</span><strong>{project.title.slice(0, 2).toUpperCase()}</strong></div>
            <div className="project-info"><p>{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><span className="stack">{project.stack}</span><a href={project.link} target="_blank" rel="noreferrer">{t.viewProject}<ArrowUpRight /></a></div>
          </article>
        ))}</div>
      </section>

      <section className="section reviews" id="reviews">
        <p className="section-kicker">{t.reviewsKicker}</p><div className="section-grid"><h2>{t.reviewsTitle}</h2></div>
        <div className="review-grid">{t.reviews.map((review) => <blockquote key={review.author}><span>“</span><p>{review.quote}</p><footer><strong>{review.author}</strong><small>{review.role}</small></footer></blockquote>)}</div>
      </section>

      <section className="section education">
        <p className="section-kicker">{t.educationKicker}</p><div className="section-grid"><h2>{t.educationTitle}</h2></div>
        <div className="timeline">{t.education.map(([year, degree, place]) => <article key={degree}><time>{year}</time><div><h3>{degree}</h3><p>{place}</p></div></article>)}</div>
      </section>

      <footer className="footer" id="contact">
        <div><p className="section-kicker">06 / Contact</p><h2>{t.footerTitle}</h2><p>{t.footerText}</p><button className="primary-button light" onClick={() => { setStatus("idle"); setContactOpen(true); }}>{t.contact}<ArrowUpRight /></button></div>
        <div className="socials"><a href="https://github.com/70X14" target="_blank" rel="noreferrer"><Github />GitHub</a><a href="https://www.linkedin.com/in/vladyslav-huminiuk" target="_blank" rel="noreferrer"><Linkedin />LinkedIn</a><a href="mailto:vldgum@gmail.com"><Mail />Email</a></div>
        <p className="copyright">© {new Date().getFullYear()} Vladyslav Huminiuk</p>
      </footer>

      {contactOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}>
        <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <button className="modal-close" onClick={() => setContactOpen(false)} aria-label={t.close}><X /></button>
          <p className="section-kicker">CONTACT / FORM</p><h2 id="contact-title">{t.formTitle}</h2><p>{t.formText}</p>
          <form onSubmit={submitContact}>
            <label>{t.name}<input name="name" type="text" minLength={2} maxLength={80} required /></label>
            <label>{t.email}<input name="email" type="email" maxLength={120} required /></label>
            <label>{t.message}<textarea name="message" minLength={20} maxLength={3000} rows={6} required /></label>
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
