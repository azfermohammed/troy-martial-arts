"use client";

import Link from "next/link";
import { AGE_GROUPS, LEVEL_COLORS, SCHEDULE } from "@/lib/data";
import { Card, PageHeader } from "@/components/portal/ui";
import { Icon } from "@/components/portal/icons";

export default function PortalSchedulePage() {
  return (
    <div>
      <PageHeader
        title="Class schedule"
        sub="2024–25 grid — same source of truth as the public website"
        action={
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
          >
            View public page
            <Icon name="arrowRight" size={15} />
          </Link>
        }
      />

      <div className="space-y-8">
        {AGE_GROUPS.map((group) => (
          <section key={group}>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-graphite">
              {group}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {SCHEDULE.filter((c) => c.group === group).map((c) => (
                <Card key={c.id} className="p-5">
                  {/* Level colour is semantic (class difficulty), so it stays */}
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_COLORS[c.level]}`}
                  >
                    {c.level}
                  </span>
                  <p className="mt-2 text-xs font-medium text-muted">{c.belts}</p>
                  <ul className="mt-3 space-y-1.5">
                    {c.blocks.map((b, i) => (
                      <li key={i} className="text-xs text-muted">
                        <span className="font-semibold text-graphite">
                          {b.days.join("/")}
                        </span>{" "}
                        {b.slot}
                        {b.note && (
                          <span className="ml-1 rounded-full border border-edge bg-canvas px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
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
