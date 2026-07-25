"use client";

import Link from "next/link";
import { usePortal } from "@/lib/portal/store";
import { Card, PageHeader, StatCard, StatusBadge } from "@/components/portal/ui";
import { Icon, type IconName } from "@/components/portal/icons";
import { PORTAL_BELTS } from "@/lib/portal/store";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const QUICK_ACTIONS: { href: string; icon: IconName; title: string; sub: string }[] = [
  {
    href: "/portal/attendance",
    icon: "clipboard",
    title: "Take attendance",
    sub: "Check in today's classes",
  },
  {
    href: "/portal/students",
    icon: "users",
    title: "Add a student",
    sub: "New trial signup? Add them here",
  },
  { href: "/portal/payments", icon: "card", title: "Collect payments", sub: "" },
];

export default function DashboardPage() {
  const { user, data } = usePortal();
  const { students, payments, attendance } = data;

  const active = students.filter((s) => s.status === "Active");
  const collected = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = payments
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = payments.filter((p) => p.status === "Overdue").length;

  const weekCutoff = daysAgo(7);
  const weekRecords = attendance.filter((a) => a.date >= weekCutoff);
  const weekPresent = weekRecords.filter((a) => a.present).length;
  const weekRate = weekRecords.length
    ? Math.round((weekPresent / weekRecords.length) * 100)
    : 0;

  // Belt distribution across active students
  const beltCounts = PORTAL_BELTS.map((belt) => ({
    belt,
    count: active.filter((s) => s.belt === belt).length,
  })).filter((b) => b.count > 0);
  const maxCount = Math.max(1, ...beltCounts.map((b) => b.count));

  // Recent activity: merge attendance + payments, newest first.
  // Icon tone stays semantic — green attended, red missed, neutral payment.
  const activity: { date: string; icon: IconName; tone: string; text: string }[] = [
    ...attendance.map((a) => ({
      date: a.date,
      icon: (a.present ? "check" : "x") as IconName,
      tone: a.present ? "text-green-600" : "text-red-600",
      text: `${students.find((s) => s.id === a.studentId)?.name ?? "Student"} — ${
        a.present ? "attended" : "missed"
      } ${a.classLabel}`,
    })),
    ...payments
      .filter((p) => p.status === "Paid")
      .map((p) => ({
        date: p.dueDate,
        icon: "card" as IconName,
        tone: "text-muted",
        text: `${students.find((s) => s.id === p.studentId)?.name ?? "Student"} — paid $${p.amount} (${p.description})`,
      })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"}`}
        sub="Here's what's happening at the dojang."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active students"
          value={String(active.length)}
          hint={`${students.filter((s) => s.isAssistant).length} assistants on the mat`}
        />
        <StatCard
          label="Collected this month"
          value={`$${collected.toLocaleString()}`}
          hint="all payments marked Paid"
          accent="text-green-700"
        />
        <StatCard
          label="Outstanding"
          value={`$${outstanding.toLocaleString()}`}
          hint={`${overdueCount} overdue payment${overdueCount === 1 ? "" : "s"}`}
          accent={overdueCount > 0 ? "text-red-600" : "text-graphite"}
        />
        <StatCard
          label="Attendance (7 days)"
          value={`${weekRate}%`}
          hint={`${weekPresent} of ${weekRecords.length} check-ins present`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Belt distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">
            Belt distribution
          </h2>
          <div className="mt-5 space-y-3">
            {beltCounts.map(({ belt, count }) => (
              <div key={belt} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-muted">
                  {belt}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-canvas ring-1 ring-edge">
                  <div
                    className="h-full rounded-full bg-graphite"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-graphite">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Icon name={a.icon} size={16} className={`mt-0.5 ${a.tone}`} />
                <span className="flex-1 text-muted">{a.text}</span>
                <span className="shrink-0 text-xs text-muted">{a.date.slice(5)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-xl border border-edge bg-panel p-5 shadow-card transition-colors hover:border-graphite/25"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas text-graphite ring-1 ring-edge">
              <Icon name={q.icon} size={18} />
            </span>
            <p className="mt-3 text-base font-semibold tracking-tight text-graphite">
              {q.title}
            </p>
            <p className="text-xs text-muted">
              {q.href === "/portal/payments"
                ? `${overdueCount} overdue to follow up`
                : q.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Overdue callout — semantic red, it's a warning */}
      {overdueCount > 0 && (
        <Card className="mt-8 border-red-200 bg-red-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-start gap-2 text-sm font-medium text-red-900">
              <Icon name="alert" size={16} className="mt-0.5" />
              <span>
                {overdueCount} payment{overdueCount === 1 ? "" : "s"} overdue —{" "}
                {payments
                  .filter((p) => p.status === "Overdue")
                  .map((p) => data.students.find((s) => s.id === p.studentId)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </p>
            <Link
              href="/portal/payments"
              className="inline-flex items-center gap-1.5 rounded-lg bg-graphite px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-graphite/90"
            >
              Review payments
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        </Card>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        Demo mode — sample data stored on this device. <StatusBadge status="Active" /> badges
        and stats update live as you make changes.
      </p>
    </div>
  );
}
