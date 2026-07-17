"use client";

import { useState } from "react";
import {
  AGE_GROUPS,
  BIZ,
  LEVEL_COLORS,
  SCHEDULE,
  type AgeGroup,
} from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  SectionHeading,
} from "@/components/ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Sort key: minutes since midnight for a slot like "4:30–5:00 PM" / "9:50–10:30 AM". */
function slotMinutes(slot: string): number {
  const m = slot.match(/^(\d+):(\d+)/);
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  if (slot.includes("PM") && h < 12) h += 12;
  return h * 60 + min;
}

export default function SchedulePage() {
  const [group, setGroup] = useState<AgeGroup>("Ages 5–10");
  const levels = SCHEDULE.filter((s) => s.group === group);

  // day -> sorted sessions for the selected group
  const byDay = DAYS.map((day) => {
    const sessions = levels
      .flatMap((lvl) =>
        lvl.blocks
          .filter((b) => b.days.includes(day))
          .map((b) => ({ level: lvl.level, belts: lvl.belts, slot: b.slot, note: b.note }))
      )
      .sort((a, b) => slotMinutes(a.slot) - slotMinutes(b.slot));
    return { day, sessions };
  });

  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 lg:py-20">
          <SectionHeading
            center
            eyebrow="2024–25 Class Schedule"
            title="Unlimited classes, six days a week"
            sub="Every membership includes unlimited classes — drop in on any session for your age group and belt level. No rigid twice-a-week slots."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {AGE_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  group === g
                    ? "bg-brand text-white shadow-pop"
                    : "bg-white text-ink-soft ring-1 ring-ink/10 hover:ring-ink/30"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Container>
        <BeltStripe />
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          {/* Level legend */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {levels.map((lvl) => (
              <span
                key={lvl.id}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold ${LEVEL_COLORS[lvl.level]}`}
              >
                {lvl.level} · {lvl.belts}
              </span>
            ))}
          </div>

          {/* Weekly grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {byDay.map(({ day, sessions }) => (
              <div
                key={day}
                className="rounded-3xl border border-ink/8 bg-white p-4 shadow-lift"
              >
                <p className="pb-3 text-center font-display text-sm font-extrabold uppercase tracking-widest text-ink">
                  {day}
                  {day === "Sat" && (
                    <span className="block text-[10px] font-semibold normal-case tracking-normal text-ink-soft/60">
                      mornings
                    </span>
                  )}
                </p>
                <div className="space-y-2">
                  {sessions.length === 0 && (
                    <p className="rounded-xl bg-cream py-4 text-center text-xs text-ink-soft/50">
                      No classes
                    </p>
                  )}
                  {sessions.map((s, i) => (
                    <div
                      key={`${s.level}-${s.slot}-${i}`}
                      className={`rounded-xl border px-3 py-2.5 ${LEVEL_COLORS[s.level]}`}
                    >
                      <p className="text-[11px] font-extrabold">{s.level}</p>
                      <p className="text-[11px] font-medium opacity-90">{s.slot}</p>
                      {s.note && (
                        <p className="mt-0.5 inline-block rounded-full bg-white/60 px-1.5 text-[9px] font-bold uppercase tracking-wide text-ink">
                          {s.note} only
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-cream p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-ink">
              Not sure where your child fits?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft/80">
              Belt level decides the class, and we place every new student
              personally. Start the {BIZ.trial.headline.toLowerCase()} and
              we&apos;ll handle the rest.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact">Start Free Trial</ButtonLink>
              <ButtonLink href={BIZ.phoneHref} variant="secondary">
                📞 {BIZ.phone}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
