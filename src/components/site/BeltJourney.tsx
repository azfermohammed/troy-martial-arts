"use client";

import { useEffect, useRef, useState } from "react";

export interface Belt {
  name: string;
  color: string;
  text: string;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The plain list. This is what renders on the server, with JS off, under
 * reduced motion, and on viewports too short to pin comfortably — so the ranks
 * are always in the DOM whether or not the scroll effect runs.
 */
function BeltList({ belts }: { belts: Belt[] }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {belts.map((belt, i) => (
        <span key={belt.name} className="flex items-center gap-2">
          <span
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold shadow-sm"
            style={{ backgroundColor: belt.color, color: belt.text }}
          >
            {belt.name}
          </span>
          {i < belts.length - 1 && (
            <span aria-hidden className="text-white/30">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Pins the belt progression and advances it White → Black as the section
 * scrolls past, so the rank order is something you move through rather than a
 * row you read.
 *
 * Falls back to BeltList whenever pinning would be a bad idea; the enhanced
 * view is only switched on after mount, once the viewport is known.
 */
export function BeltJourney({ belts }: { belts: Belt[] }) {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Decide once, after mount, whether to pin at all.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Pinning needs vertical room; on short viewports the list reads better.
    if (window.innerHeight < 560) return;
    const id = requestAnimationFrame(() => setEnhanced(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const el = trackRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      // 0 at the moment the section pins, 1 as it unpins
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      setActive(
        Math.min(belts.length - 1, Math.floor(progress * belts.length))
      );
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
  }, [enhanced, belts.length]);

  if (!enhanced) return <BeltList belts={belts} />;

  const current = belts[active];

  return (
    <div
      ref={trackRef}
      className="relative mt-10"
      // Enough room that each rank gets a comfortable slice of scroll
      style={{ height: `${belts.length * 34 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          Rank {active + 1} of {belts.length}
        </p>

        <div
          key={current.name}
          className="belt-pop mt-6 flex h-32 w-64 items-center justify-center rounded-3xl border border-white/25 shadow-pop sm:h-40 sm:w-80"
          style={{ backgroundColor: current.color, color: current.text }}
        >
          <span className="font-display text-3xl font-extrabold sm:text-4xl">
            {current.name}
          </span>
        </div>

        {/* Full rail — every rank stays visible, the reached ones lit */}
        <div className="mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-1.5 px-4">
          {belts.map((belt, i) => (
            <span
              key={belt.name}
              className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-all duration-300 ${
                i <= active
                  ? "border-white/30 opacity-100"
                  : "border-white/10 opacity-35"
              }`}
              style={{
                backgroundColor: i <= active ? belt.color : "transparent",
                color: i <= active ? belt.text : "rgba(255,255,255,0.65)",
              }}
            >
              {belt.name}
            </span>
          ))}
        </div>

        <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gold transition-all duration-300"
            style={{ width: `${((active + 1) / belts.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
