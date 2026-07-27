/**
 * Client-side CSV export.
 *
 * The portal has no server, so files are built in the browser and handed to
 * the user as a download. Nothing leaves the device.
 */

/** Escapes a single field per RFC 4180 — quotes doubled, field wrapped. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const header = columns.map((c) => cell(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => cell(r[c.key])).join(","));
  // BOM + CRLF so Excel opens UTF-8 correctly rather than mangling accents
  return "﻿" + [header, ...body].join("\r\n");
}

/** Triggers a download of `content` as `filename`. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Give the browser a tick to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** e.g. `troy-students-2026-07-26.csv` */
export function stampedFilename(base: string): string {
  return `troy-${base}-${new Date().toISOString().slice(0, 10)}.csv`;
}

export function exportCsv<T extends Record<string, unknown>>(
  base: string,
  rows: T[],
  columns: { key: keyof T; label: string }[]
): void {
  downloadCsv(stampedFilename(base), toCsv(rows, columns));
}
