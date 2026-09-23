"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "exit" | "enter";
type Direction = "forward" | "back";

const GREEN_PIXELS = Array.from({ length: 112 }, (_, index) => {
  const row = Math.floor(index / 14);
  const column = index % 14;
  const offset = (row * 5 + column * 3) % 8;

  return {
    forwardDelay: `${column * 20 + offset * 4}ms`,
    backDelay: `${(13 - column) * 20 + offset * 4}ms`,
  };
});

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [direction, setDirection] = useState<Direction>("forward");
  const navigating = useRef(false);
  const previousPath = useRef(pathname);
  const navigationTimer = useRef<number | null>(null);
  const finishTimer = useRef<number | null>(null);
  const pendingHash = useRef("");

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/projects");
  }, [router]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!navigating.current) return;

    requestAnimationFrame(() => {
      if (pendingHash.current && pendingHash.current !== "#top") {
        document.querySelector(pendingHash.current)?.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      pendingHash.current = "";
      setPhase("enter");
    });
    finishTimer.current = window.setTimeout(() => {
      setPhase("idle");
      navigating.current = false;
    }, 520);
  }, [pathname]);

  useEffect(() => {
    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || navigating.current) return;

      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) {
        if (url.hash === "#top") {
          event.preventDefault();
          window.history.replaceState(null, "", url.href);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
        return;
      }
      if (url.pathname !== "/" && url.pathname !== "/projects") return;

      event.preventDefault();
      navigating.current = true;
      pendingHash.current = url.hash;
      setDirection(url.pathname === "/projects" ? "forward" : "back");
      setPhase("exit");

      navigationTimer.current = window.setTimeout(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }, 470);
    };

    document.addEventListener("click", handleNavigation);
    return () => {
      document.removeEventListener("click", handleNavigation);
      if (navigationTimer.current) window.clearTimeout(navigationTimer.current);
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
    };
  }, [router]);

  if (phase === "idle") return null;

  return (
    <div className={`page-transition ${phase} ${direction}`} aria-hidden="true">
      {GREEN_PIXELS.map((pixel, index) => (
        <i
          key={index}
          style={{
            "--delay-forward": pixel.forwardDelay,
            "--delay-back": pixel.backDelay,
          } as CSSProperties}
        />
      ))}
      <div className="transition-rails" />
      <div className="transition-brand"><span>VH</span><b /></div>
    </div>
  );
}
