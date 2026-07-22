"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export type AnalyticsEvent = {
  type: "page_view" | "scroll_depth" | "cta_click" | "form_open" | "form_submit";
  path: string;
  target?: string;
  referrer?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const SESSION_KEY = "seka_analytics_session";

function getSessionId() {
  try {
    const current = window.sessionStorage.getItem(SESSION_KEY);
    if (current) {
      return current;
    }

    const next = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function sendMetrics(sessionId: string, events: AnalyticsEvent[]) {
  if (!events.length || navigator.doNotTrack === "1") {
    return;
  }

  const payload = JSON.stringify({ sessionId, events });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/metrics", blob);
    return;
  }

  fetch("/api/metrics", {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
    keepalive: true
  }).catch(() => undefined);
}

export function trackSiteEvent(event: Omit<AnalyticsEvent, "path"> & { path?: string }) {
  if (typeof window === "undefined") {
    return;
  }

  sendMetrics(getSessionId(), [
    {
      ...event,
      path: event.path ?? window.location.pathname
    }
  ]);
}

function labelForElement(element: Element) {
  const explicit = element.getAttribute("data-track-label");
  if (explicit) {
    return explicit;
  }

  const aria = element.getAttribute("aria-label");
  if (aria) {
    return aria;
  }

  return element.textContent?.replace(/\s+/g, " ").trim().slice(0, 160) || element.tagName.toLowerCase();
}

export function SiteAnalytics() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const sentDepthsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  useEffect(() => {
    const sessionId = sessionIdRef.current ?? getSessionId();
    sessionIdRef.current = sessionId;
    sentDepthsRef.current = new Set();

    sendMetrics(sessionId, [
      {
        type: "page_view",
        path: pathname,
        referrer: document.referrer || undefined,
        metadata: { title: document.title }
      }
    ]);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollable <= 0) {
          return;
        }

        const depth = Math.round((window.scrollY / scrollable) * 100);
        const milestone = [25, 50, 75, 90].find((value) => depth >= value && !sentDepthsRef.current.has(value));

        if (!milestone || !sessionIdRef.current) {
          return;
        }

        sentDepthsRef.current.add(milestone);
        sendMetrics(sessionIdRef.current, [{ type: "scroll_depth", path: window.location.pathname, metadata: { depth: milestone } }]);
      });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a, button, [data-track]") : null;

      if (!target || !sessionIdRef.current) {
        return;
      }

      const isTrackable =
        target.hasAttribute("data-track") ||
        target.classList.contains("button") ||
        target.closest(".catalog-card") ||
        target.closest(".inventory-disclosure") ||
        target.closest(".component-item");

      if (!isTrackable) {
        return;
      }

      sendMetrics(sessionIdRef.current, [
        {
          type: "cta_click",
          path: window.location.pathname,
          target: labelForElement(target),
          metadata: target instanceof HTMLAnchorElement ? { href: target.href } : undefined
        }
      ]);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
