"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Braces, GitBranch, Github, Linkedin, Mail, MapPin, Monitor, Rocket, Server, X } from "lucide-react";
import { content, Language } from "@/data/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function Portfolio() {
  const [language, setLanguage] = useState<Language>("uk");
  const [contactOpen, setContactOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = content[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage === "uk" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

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
      <div className="main-bento">
      <section className="hero" id="top">
        <div className="portrait-wrap">
          <p className="eyebrow portrait-status"><span />{t.eyebrow}</p>
          <div className="portrait-frame">
            <div className="portrait-image-plane"><img src="/vlad-pixel-portrait-v2.png" alt="Vladyslav Huminiuk" /></div>
            {["<React />", "Node.js", "Next.js"].map((stack, index) => <span key={stack} className={`code-tag stack-tag stack-tag-${index + 1}`}>{stack}</span>)}
            <p>FULL-STACK DEVELOPER</p>
          </div>
          <div className="portrait-details">
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-meta"><span><MapPin size={16} />{t.location}</span><span className="portrait-availability"><i aria-hidden="true">//</i><b aria-hidden="true" />{t.available}</span></div>
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
          <div className="left-profile-card">
            <h1><small>{t.hello}</small><span className="hero-title-text">{t.title}</span></h1>
            <section className="profile-section about left-about" id="about">
              <p className="section-kicker">{t.aboutKicker}</p>
              <div className="profile-card">
                <div className="profile-info"><h2>{t.aboutTitle}</h2><p className="lead">{t.aboutText}</p></div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="profile-content">
      <section className="section profile-section dark-section" id="skills">
        <p className="section-kicker">{t.skillsKicker}</p>
        <div className="profile-card">
          <div className="profile-info"><h2>{t.skillsTitle}</h2><p className="mono-note"><Braces aria-hidden="true" /><span>BUILD · TEST · IMPROVE</span><Rocket aria-hidden="true" /></p><div className="skill-list">{t.skillGroups.map(([title, list], index) => {
            const SkillIcon = [Monitor, Server, GitBranch][index];
            return <article key={title}><h3>{title}</h3><SkillIcon className="skill-group-icon" aria-hidden="true" /><ul>{list.split(", ").map((skill) => <li key={skill}>{skill}</li>)}</ul></article>;
          })}</div></div>
        </div>
      </section>

      <section className="section profile-section education">
        <p className="section-kicker">{t.educationKicker}</p>
        <div className="profile-card">
          <div className="profile-info"><h2>{t.educationTitle}</h2><div className="timeline">{t.education.map(([year, degree, place]) => <article key={degree}><time>{year}</time><div><h3>{degree}</h3><p>{place}</p></div></article>)}</div></div>
        </div>
      </section>
      </div>
      </div>

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
