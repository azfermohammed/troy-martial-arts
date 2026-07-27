"use client";

import { useState } from "react";
import { BIZ, PROGRAMS } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";

interface Lead {
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  ts: string;
}

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function TrialForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const fd = new FormData(e.currentTarget);
    const lead: Lead = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      program: String(fd.get("program") ?? ""),
      message: String(fd.get("message") ?? ""),
      ts: new Date().toISOString(),
    };

    setBusy(true);
    setFailed(false);

    const supabase = getSupabase();

    if (supabase) {
      const { error } = await supabase.from("leads").insert({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        program: lead.program,
        message: lead.message,
      });
      setBusy(false);
      if (error) {
        // Say so rather than showing a false success — an enquiry that
        // silently vanishes is worse than one the visitor knows to re-send.
        setFailed(true);
        return;
      }
      setSent(true);
      return;
    }

    // No database configured (local demo): keep the enquiry in this browser
    // so the portal's leads page still has something to show.
    try {
      const key = "tma-trial-leads";
      const existing: Lead[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(key, JSON.stringify([...existing, lead]));
    } catch {
      // storage unavailable (private mode) — fall through
    }
    setBusy(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
          ✓
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">
          Request received
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          We received your request. We&apos;ll call you within one business day
          to schedule your first class and fit your free uniform.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {failed && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900"
        >
          <strong className="font-bold">We couldn&apos;t send that.</strong>{" "}
          Nothing was saved, so please try again — or call us on{" "}
          <a href={BIZ.phoneHref} className="font-bold underline">
            {BIZ.phone}
          </a>{" "}
          and we&apos;ll book you in over the phone.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
            Parent / student name *
          </label>
          <input id="name" name="name" required placeholder="Jane Kim" className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-ink">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="(248) 555-0123"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="program" className="mb-1.5 block text-sm font-bold text-ink">
          Interested program *
        </label>
        <select id="program" name="program" required className={inputCls} defaultValue="">
          <option value="" disabled>
            Choose a program…
          </option>
          {PROGRAMS.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name} — {p.ages}
            </option>
          ))}
          <option value="Not sure">Not sure yet — help me choose</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-ink">
          Anything we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Ages of the kids, prior experience, preferred days…"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="w-full rounded-full bg-brand py-4 text-sm font-extrabold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {busy
          ? "Sending…"
          : `Request My ${BIZ.trial.priceLabel} 4-Week Trial →`}
      </button>
      <p className="text-center text-xs text-ink-soft/50">
        No spam, no obligation — we&apos;ll just call to set up your first class.
      </p>
    </form>
  );
}
