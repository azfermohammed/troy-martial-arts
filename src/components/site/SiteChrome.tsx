"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BIZ } from "@/lib/data";

/**
 * Appears once the visitor has scrolled past the hero, so the primary action
 * is always one tap away on a phone without covering content at the top.
 */
export function StickyCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const past = window.scrollY > window.innerHeight * 0.9;
      // Hide again near the footer so it never sits over the footer CTA
      const nearEnd =
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 320;
      setShown(past && !nearEnd);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-2">
        <a
          href={BIZ.phoneHref}
          className="flex-1 rounded-full border border-ink/15 py-3 text-center text-sm font-bold text-ink-soft"
        >
          Call
        </a>
        <Link
          href="/contact"
          className="flex-[1.6] rounded-full bg-brand py-3 text-center text-sm font-bold text-white shadow-pop"
        >
          {BIZ.trial.priceLabel} · 4-Week Trial
        </Link>
      </div>
    </div>
  );
}

/** Scroll-to-top, shown after a couple of screens. */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > window.innerHeight * 1.8);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!shown) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Back to top"
      className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink shadow-lift transition-colors hover:bg-cream lg:bottom-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

/**
 * Keyboard users land here first and can jump straight past the navigation.
 * Visually hidden until focused.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
    >
      Skip to content
    </a>
  );
}
