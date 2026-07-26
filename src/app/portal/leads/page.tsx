"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminGate,
  Card,
  inputCls,
  PageHeader,
  StatCard,
} from "@/components/portal/ui";
import { Icon } from "@/components/portal/icons";
import { BIZ } from "@/lib/data";

/**
 * Shape written by the public trial form (components/site/TrialForm.tsx).
 * Read-only here — this page never writes the key back.
 */
interface Lead {
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  ts: string; // ISO datetime
}

const LEADS_KEY = "tma-trial-leads";

function fmtWhen(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysSince(ts: string): number {
  const d = new Date(ts).getTime();
  if (Number.isNaN(d)) return 0;
  return Math.floor((Date.now() - d) / 86_400_000);
}

function LeadsInner() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");

  // Leads live in the browser, so read them after mount.
  useEffect(() => {
    let parsed: Lead[] = [];
    try {
      const raw = localStorage.getItem(LEADS_KEY);
      const value: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(value)) {
        parsed = value.filter(
          (l): l is Lead =>
            typeof l?.name === "string" && typeof l?.ts === "string"
        );
      }
    } catch {
      // corrupted or unavailable storage — fall through to the empty state
    }
    const id = requestAnimationFrame(() => {
      setLeads(parsed.sort((a, b) => b.ts.localeCompare(a.ts)));
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.phone, l.email, l.program, l.message]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [leads, query]);

  const thisWeek = leads.filter((l) => daysSince(l.ts) <= 7).length;
  const waiting = leads.filter((l) => daysSince(l.ts) > 1).length;

  return (
    <div>
      <PageHeader
        title="Trial leads"
        sub={`Enquiries from the ${BIZ.trial.priceLabel} trial form on the public site.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total leads" value={ready ? String(leads.length) : "—"} />
        <StatCard
          label="Last 7 days"
          value={ready ? String(thisWeek) : "—"}
          accent={thisWeek > 0 ? "text-green-700" : "text-graphite"}
        />
        <StatCard
          label="Older than a day"
          value={ready ? String(waiting) : "—"}
          hint={waiting > 0 ? "follow these up" : "all fresh"}
          accent={waiting > 0 ? "text-red-600" : "text-graphite"}
        />
      </div>

      <div className="mb-5 mt-8 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, email…"
          className={`${inputCls} max-w-xs`}
        />
        {query && (
          <span className="text-xs text-muted">
            {filtered.length} of {leads.length}
          </span>
        )}
      </div>

      {ready && leads.length === 0 ? (
        <Card className="p-10 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-canvas text-muted">
            <Icon name="users" size={22} />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-graphite">
            No leads yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Enquiries submitted through the trial form on the public site will
            appear here.
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-muted">
            Demo mode stores leads in this browser only, so one submitted on a
            different device will not show up here. Connecting the form to email
            or a CRM is what makes this reliable.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead, i) => {
            const age = daysSince(lead.ts);
            return (
              <Card key={`${lead.ts}-${i}`} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-graphite">
                      {lead.name || "Unnamed enquiry"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {fmtWhen(lead.ts)}
                      {age > 0 && ` · ${age} day${age === 1 ? "" : "s"} ago`}
                    </p>
                  </div>
                  {lead.program && (
                    <span className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted ring-1 ring-edge">
                      {lead.program}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-graphite px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-graphite/90"
                    >
                      Call {lead.phone}
                    </a>
                  )}
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}?subject=${encodeURIComponent(
                        `Your ${BIZ.trial.headline} at ${BIZ.name}`
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-3.5 py-2 text-xs font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
                    >
                      Email {lead.email}
                    </a>
                  )}
                </div>

                {lead.message && (
                  <p className="mt-4 border-t border-edge pt-3 text-sm leading-relaxed text-muted">
                    {lead.message}
                  </p>
                )}
              </Card>
            );
          })}

          {ready && filtered.length === 0 && (
            <Card className="p-10 text-center text-sm text-muted">
              No leads match that search.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <AdminGate>
      <LeadsInner />
    </AdminGate>
  );
}
