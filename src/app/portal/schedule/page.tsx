"use client";

import Link from "next/link";
import {
  beltToLevel,
  CLASS_SESSIONS,
  LEVEL_BELTS,
  LEVEL_COLORS,
  sessionLabel,
  TIME_SLOTS,
  WEEKDAYS,
  type ClassSession,
} from "@/lib/data";
import { usePortal } from "@/lib/portal/store";
import { Card, PageHeader } from "@/components/portal/ui";
import { Icon } from "@/components/portal/icons";

const DAY_FULL: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

function sessionAt(day: string, start: number): ClassSession | undefined {
  return CLASS_SESSIONS.find((s) => s.day === day && s.start === start);
}

/** One class in the grid. Highlighted when it matches the viewer's belt. */
function SessionCell({ session, mine }: { session: ClassSession; mine: boolean }) {
  return (
    <div
      className={`h-full rounded-lg border p-2 text-left transition-colors ${
        mine
          ? "border-graphite/30 bg-canvas ring-1 ring-graphite/15"
          : "border-edge bg-panel"
      }`}
    >
      <p className="text-[11px] font-semibold leading-tight text-graphite">
        {sessionLabel(session)}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-muted">
        {session.levels.flatMap((l) => LEVEL_BELTS[l]).join(", ")}
      </p>
      {session.focus && (
        <span className="mt-1.5 inline-block rounded-full bg-graphite px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          {session.focus} only
        </span>
      )}
      {mine && (
        <span className="mt-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-graphite">
          <Icon name="check" size={10} />
          Your belt
        </span>
      )}
    </div>
  );
}

export default function PortalSchedulePage() {
  const { user, data } = usePortal();

  const me = user?.studentId
    ? data.students.find((s) => s.id === user.studentId)
    : undefined;
  const myLevel = me ? beltToLevel(me.belt) : null;

  const mineCount = myLevel
    ? CLASS_SESSIONS.filter((s) => s.levels.includes(myLevel)).length
    : 0;

  return (
    <div>
      <PageHeader
        title="Class calendar"
        sub={
          me
            ? `${mineCount} of ${CLASS_SESSIONS.length} classes a week are open to your ${me.belt} belt.`
            : `All ${CLASS_SESSIONS.length} classes each week, six days a week.`
        }
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

      {/* Desktop: full week grid */}
      <Card className="hidden overflow-x-auto p-4 lg:block">
        <div
          className="grid min-w-[900px] gap-2"
          style={{ gridTemplateColumns: `88px repeat(${WEEKDAYS.length}, 1fr)` }}
        >
          <div />
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="pb-2 text-center text-xs font-bold uppercase tracking-wider text-muted"
            >
              {DAY_FULL[d]}
            </div>
          ))}

          {TIME_SLOTS.map(({ start, slot }) => (
            <div key={start} className="contents">
              <div className="flex items-start justify-end pr-1 pt-2 text-[11px] font-semibold leading-tight text-muted">
                {slot}
              </div>
              {WEEKDAYS.map((day) => {
                const s = sessionAt(day, start);
                return (
                  <div key={day + start} className="min-h-[74px]">
                    {s ? (
                      <SessionCell
                        session={s}
                        mine={!!myLevel && s.levels.includes(myLevel)}
                      />
                    ) : (
                      <div className="h-full rounded-lg border border-dashed border-edge/70" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Mobile: day by day */}
      <div className="space-y-5 lg:hidden">
        {WEEKDAYS.map((day) => {
          const sessions = CLASS_SESSIONS.filter((s) => s.day === day).sort(
            (a, b) => a.start - b.start
          );
          return (
            <div key={day}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
                {DAY_FULL[day]}
              </h2>
              <Card className="divide-y divide-edge">
                {sessions.map((s) => {
                  const mine = !!myLevel && s.levels.includes(myLevel);
                  return (
                    <div
                      key={s.id}
                      className={`flex gap-3 p-4 ${mine ? "bg-canvas" : ""}`}
                    >
                      <div className="w-24 shrink-0 text-xs font-semibold text-graphite">
                        {s.slot}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-graphite">
                          {sessionLabel(s)}
                          {s.focus && (
                            <span className="ml-2 rounded-full bg-graphite px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                              {s.focus} only
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-muted">
                          {s.levels.flatMap((l) => LEVEL_BELTS[l]).join(", ")}
                        </p>
                      </div>
                      {mine && (
                        <Icon
                          name="check"
                          size={16}
                          title="Open to your belt"
                          className="mt-0.5 shrink-0 text-graphite"
                        />
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="mt-6 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">
          Belt levels
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(LEVEL_BELTS) as (keyof typeof LEVEL_BELTS)[]).map((lvl) => (
            <div key={lvl}>
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${LEVEL_COLORS[lvl]}`}
              >
                {lvl}
              </span>
              <p className="mt-1.5 text-xs leading-snug text-muted">
                {LEVEL_BELTS[lvl].join(", ")}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-edge pt-3 text-xs text-muted">
          Classes run up to 40 minutes. The school recommends two classes a week —
          you may attend as many as you like.
        </p>
      </Card>
    </div>
  );
}
