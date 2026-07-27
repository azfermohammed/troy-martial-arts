"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BELT_RANKS } from "@/lib/data";
import { usePortal } from "@/lib/portal/store";
import { Icon } from "@/components/portal/icons";
import { exportCsv } from "@/lib/portal/csv";

/** Renders children only for admin accounts; everyone else sees a lock screen. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { user } = usePortal();
  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-panel text-muted shadow-card">
          <Icon name="lock" size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-graphite">
          Admin access only
        </h1>
        <p className="mt-2 text-sm text-muted">
          Student records, attendance, and finances are only visible to admin
          accounts.
        </p>
        <Link
          href="/portal/dashboard"
          className="mt-6 inline-block rounded-lg bg-graphite px-5 py-2.5 text-sm font-semibold text-white shadow-tab transition-colors hover:bg-graphite/90"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}

export const inputCls =
  "w-full rounded-lg border border-edge bg-panel px-3.5 py-2.5 text-sm text-graphite placeholder:text-muted/60 focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10";

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
        <h1 className="text-2xl font-semibold tracking-tight text-graphite">
          {title}
        </h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
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
    <div className={`rounded-xl border border-edge bg-panel shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "text-graphite",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
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
      className="inline-block rounded-full border border-edge px-3 py-1 text-xs font-bold"
      style={{ backgroundColor: entry.color, color: entry.text }}
    >
      {belt}
    </span>
  );
}

// Semantic status colour — carries meaning, so it stays outside the neutral system.
const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Overdue: "bg-red-100 text-red-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-canvas text-muted",
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
        STATUS_STYLES[status] ?? "bg-canvas text-muted"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-edge bg-panel p-7 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-graphite"
          >
            <Icon name="x" size={16} title="Close dialog" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Downloads the given rows as a CSV. Built in the browser — the portal has no
 * server, so nothing is uploaded anywhere.
 */
export function ExportButton<T extends Record<string, unknown>>({
  base,
  rows,
  columns,
  label = "Export CSV",
}: {
  /** Filename stem, e.g. "students" → troy-students-2026-07-26.csv */
  base: string;
  rows: T[];
  columns: { key: keyof T; label: string }[];
  label?: string;
}) {
  const empty = rows.length === 0;
  return (
    <button
      type="button"
      onClick={() => exportCsv(base, rows, columns)}
      disabled={empty}
      title={empty ? "Nothing to export" : `Export ${rows.length} rows`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon name="arrowRight" size={15} className="rotate-90" />
      {label}
      {!empty && <span className="text-xs text-muted">({rows.length})</span>}
    </button>
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-graphite px-4 py-2.5 text-sm font-semibold text-white shadow-tab transition-colors hover:bg-graphite/90 ${className}`}
    >
      {children}
    </button>
  );
}
