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
 * Drifts its children against the scroll direction.
 *
 * `strength` is how far it moves relative to scroll — 0.15 means it lags the
 * page by 15%. Translation happens in a rAF and is capped, so a long page
 * can't push the element far enough to leave a gap.
 */
export function Parallax({
  children,
  strength = 0.15,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-60, Math.min(60, -fromCentre * strength));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
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
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/**
 * Tips towards the pointer in 3D.
 *
 * Mouse only — gated on `pointer: fine`, since on a touchscreen the tilt would
 * fire on tap and feel like a glitch.
 */
export function TiltCard({
  children,
  max = 7,
  className = "",
}: {
  children: ReactNode;
  /** Maximum rotation in degrees. */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
    };
    const reset = () => {
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

/**
 * A thin reading-progress bar pinned to the top of the viewport.
 *
 * Scales a fixed element rather than animating width, so it stays on the
 * compositor and never triggers layout while scrolling.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${pct})`;
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
      ref={ref}
      aria-hidden
      className="scroll-progress w-full"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

/**
 * Reveals children one after another once the group scrolls into view — used
 * for the belt journey, so ranks light up in order rather than all at once.
 */
export function StaggerIn({
  children,
  step = 70,
  className = "",
}: {
  children: ReactNode[];
  /** Milliseconds between each child. */
  step?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setStarted(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setStarted(true);
        observer.disconnect();
      }
    }, OBSERVER_OPTIONS);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <span
          key={i}
          // .stagger-item (not Tailwind's opacity-0) so the <noscript> and
          // reduced-motion rules can force these visible.
          className={started ? "belt-pop" : "stagger-item"}
          style={started ? { animationDelay: `${i * step}ms` } : undefined}
        >
          {child}
        </span>
      ))}
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
