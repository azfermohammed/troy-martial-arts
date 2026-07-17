"use client";

import Link from "next/link";
import { AGE_GROUPS, LEVEL_COLORS, SCHEDULE } from "@/lib/data";
import { Card, PageHeader } from "@/components/portal/ui";

export default function PortalSchedulePage() {
  return (
    <div>
      <PageHeader
        title="Class schedule"
        sub="2024–25 grid — same source of truth as the public website"
        action={
          <Link
            href="/schedule"
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-bold text-ink-soft hover:border-ink/40"
          >
            View public page ↗
          </Link>
        }
      />

      <div className="space-y-8">
        {AGE_GROUPS.map((group) => (
          <section key={group}>
            <h2 className="mb-3 font-display text-lg font-extrabold text-ink">
              {group}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {SCHEDULE.filter((c) => c.group === group).map((c) => (
                <Card key={c.id} className="p-5">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_COLORS[c.level]}`}
                  >
                    {c.level}
                  </span>
                  <p className="mt-2 text-xs font-semibold text-ink-soft/60">{c.belts}</p>
                  <ul className="mt-3 space-y-1.5">
                    {c.blocks.map((b, i) => (
                      <li key={i} className="text-xs text-ink-soft">
                        <span className="font-bold text-ink">{b.days.join("/")}</span>{" "}
                        {b.slot}
                        {b.note && (
                          <span className="ml-1 rounded-full bg-cream px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-deep">
                            {b.note}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
