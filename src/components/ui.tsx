import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-deep">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-ink-soft/80">{sub}</p>}
    </div>
  );
}

export function Stars({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={className}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 0 0-.363 1.118l1.286 3.958c.3.922-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 0 0-1.176 0l-3.367 2.446c-.784.57-1.838-.196-1.539-1.118l1.286-3.958a1 1 0 0 0-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
        </svg>
      ))}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  const variants = {
    primary:
      "bg-brand text-white shadow-pop hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-white text-ink ring-1 ring-ink/15 shadow-lift hover:ring-ink/30 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-ink hover:bg-ink/5",
    gold: "bg-gold text-ink shadow-lift hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0",
  } as const;
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Stat({
  value,
  label,
}: {
  /** ReactNode so callers can pass an animated counter, not just a string. */
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-ink sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-soft/70">{label}</p>
    </div>
  );
}

export function BeltStripe({ className = "h-1.5" }: { className?: string }) {
  return <div aria-hidden className={`belt-stripe w-full ${className}`} />;
}
