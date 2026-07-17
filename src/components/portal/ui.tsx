"use client";

import type { ReactNode } from "react";
import { BELT_RANKS } from "@/lib/data";

export const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function PageHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {title}
        </h1>
        {sub && <p className="mt-1 text-sm text-ink-soft/70">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ink/8 bg-white shadow-lift ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "text-ink",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-soft/60">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl font-extrabold ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft/60">{hint}</p>}
    </Card>
  );
}

/** Belt chip colored from the shared BELT_RANKS palette. */
export function BeltBadge({ belt }: { belt: string }) {
  const entry =
    BELT_RANKS.find((b) => b.name === belt) ??
    (belt.includes("Black")
      ? BELT_RANKS[BELT_RANKS.length - 1]
      : BELT_RANKS[0]);
  return (
    <span
      className="inline-block rounded-full border border-ink/10 px-3 py-1 text-xs font-bold"
      style={{ backgroundColor: entry.color, color: entry.text }}
    >
      {belt}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Overdue: "bg-red-100 text-red-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-slate-100 text-slate-600",
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-brand-dark ${className}`}
    >
      {children}
    </button>
  );
}
