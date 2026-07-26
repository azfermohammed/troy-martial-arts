"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Shared observer options — reveal a little before the element is fully in view. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.12,
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Fades its children up as they scroll into view.
 *
 * Children render with `.reveal` (hidden) and gain `.is-visible` once observed,
 * so there is no flash of already-visible content on load. Users with JS off
 * are covered by the <noscript> override in the site layout, and
 * prefers-reduced-motion is honoured in CSS as well as here.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion is handled in CSS, which forces .reveal visible.
    // Only the missing-observer case needs handling here; defer the state
    // change out of the effect body so it doesn't cascade a render.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }
    }, OBSERVER_OPTIONS);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Counts up to a number once scrolled into view. Falls back to the final value
 * immediately when motion is reduced or observers are unavailable.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Starts at the real value so server-rendered and no-JS output is correct;
  // when we can animate we reset to 0 on mount and count up on scroll.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nothing to do — leave the true value on screen.
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      return;
    }

    let frame = 0;
    // Arm at zero outside the effect body so this isn't a cascading setState.
    const arm = requestAnimationFrame(() => setDisplay(0));

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out cubic, so it decelerates into the final number
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, OBSERVER_OPTIONS);

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(arm);
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
