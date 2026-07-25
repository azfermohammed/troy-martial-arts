"use client";

import { useState } from "react";
import {
  BIZ,
  CLASS_SESSIONS,
  LEVEL_BELTS,
  LEVEL_COLORS,
  WEEKDAYS,
  type Level,
} from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  SectionHeading,
} from "@/components/ui";

const DAY_FULL: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const LEVELS = Object.keys(LEVEL_BELTS) as Level[];

export default function SchedulePage() {
  const [level, setLevel] = useState<Level | "All">("All");

  const visible =
    level === "All"
      ? CLASS_SESSIONS
      : CLASS_SESSIONS.filter((s) => s.levels.includes(level));

  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 text-center lg:py-20">
          <SectionHeading
            center
            eyebrow="Weekly schedule"
            title="Find a class that fits your week"
            sub={`${CLASS_SESSIONS.length} classes a week, six days a week. Every class runs up to 40 minutes — we recommend two a week, but you can attend as many as you like.`}
          />
        </Container>
        <BeltStripe />
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          {/* Belt filter — pick your belt, see only your classes */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setLevel("All")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                level === "All"
                  ? "bg-brand text-white"
                  : "border border-ink/15 text-ink-soft hover:border-ink/40"
              }`}
            >
              All belts
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  level === l
                    ? "bg-brand text-white"
                    : "border border-ink/15 text-ink-soft hover:border-ink/40"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {level !== "All" && (
            <p className="mt-4 text-center text-sm text-ink-soft/70">
              {LEVEL_BELTS[level].join(", ")} —{" "}
              <strong className="text-ink">{visible.length} classes</strong> a week
            </p>
          )}

          {/* Week grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WEEKDAYS.map((day) => {
              const sessions = visible
                .filter((s) => s.day === day)
                .sort((a, b) => a.start - b.start);
              return (
                <div
                  key={day}
                  className="rounded-3xl border border-ink/8 bg-white p-6 shadow-lift"
                >
                  <h2 className="font-display text-lg font-bold text-ink">
                    {DAY_FULL[day]}
                  </h2>
                  {sessions.length === 0 ? (
                    <p className="mt-4 text-sm text-ink-soft/60">
                      No classes for this belt.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {sessions.map((s) => (
                        <li
                          key={s.id}
                          className="border-t border-ink/5 pt-3 first:border-0 first:pt-0"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-sm font-bold text-ink">
                              {s.slot}
                            </span>
                            {s.focus && (
                              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-deep">
                                {s.focus} only
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {s.levels.map((l) => (
                              <span
                                key={l}
                                className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${LEVEL_COLORS[l]}`}
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                          <p className="mt-1.5 text-xs leading-snug text-ink-soft/70">
                            {s.levels.flatMap((l) => LEVEL_BELTS[l]).join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl bg-cream p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-ink">
              Not sure which class is yours?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft/80">
              Your belt decides the class, and we place every new student
              personally. Start the {BIZ.trial.priceLabel}{" "}
              {BIZ.trial.headline.toLowerCase()} and we&apos;ll handle the rest.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact">
                Start the {BIZ.trial.priceLabel} Trial
              </ButtonLink>
              <ButtonLink href={BIZ.phoneHref} variant="secondary">
                Call {BIZ.phone}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
