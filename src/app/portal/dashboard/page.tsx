"use client";

import Link from "next/link";
import { usePortal } from "@/lib/portal/store";
import { Card, PageHeader, StatCard, StatusBadge } from "@/components/portal/ui";
import { PORTAL_BELTS } from "@/lib/portal/store";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

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

  // Recent activity: merge attendance + payments, newest first
  const activity = [
    ...attendance.map((a) => ({
      date: a.date,
      icon: a.present ? "✅" : "❌",
      text: `${students.find((s) => s.id === a.studentId)?.name ?? "Student"} — ${
        a.present ? "attended" : "missed"
      } ${a.classLabel}`,
    })),
    ...payments
      .filter((p) => p.status === "Paid")
      .map((p) => ({
        date: p.dueDate,
        icon: "💳",
        text: `${students.find((s) => s.id === p.studentId)?.name ?? "Student"} — paid $${p.amount} (${p.description})`,
      })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"} 👋`}
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
          accent={overdueCount > 0 ? "text-brand" : "text-ink"}
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
          <h2 className="font-display text-lg font-extrabold text-ink">
            Belt distribution
          </h2>
          <div className="mt-5 space-y-3">
            {beltCounts.map(({ belt, count }) => (
              <div key={belt} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-bold text-ink-soft">
                  {belt}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-brand"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-bold text-ink">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-extrabold text-ink">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span aria-hidden>{a.icon}</span>
                <span className="flex-1 text-ink-soft">{a.text}</span>
                <span className="shrink-0 text-xs text-ink-soft/50">{a.date.slice(5)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/portal/attendance", icon: "✅", title: "Take attendance", sub: "Check in today's classes" },
          { href: "/portal/students", icon: "🥋", title: "Add a student", sub: "New trial signup? Add them here" },
          { href: "/portal/payments", icon: "💳", title: "Collect payments", sub: `${overdueCount} overdue to follow up` },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group rounded-2xl border border-ink/8 bg-white p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-brand/30"
          >
            <span className="text-2xl">{q.icon}</span>
            <p className="mt-2 font-display text-base font-extrabold text-ink group-hover:text-brand">
              {q.title}
            </p>
            <p className="text-xs text-ink-soft/70">{q.sub}</p>
          </Link>
        ))}
      </div>

      {/* Overdue callout */}
      {overdueCount > 0 && (
        <Card className="mt-8 border-red-200 bg-red-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-red-900">
              ⚠️ {overdueCount} payment{overdueCount === 1 ? "" : "s"} overdue —{" "}
              {payments
                .filter((p) => p.status === "Overdue")
                .map((p) => data.students.find((s) => s.id === p.studentId)?.name)
                .filter(Boolean)
                .join(", ")}
            </p>
            <Link
              href="/portal/payments"
              className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white"
            >
              Review payments →
            </Link>
          </div>
        </Card>
      )}

      <p className="mt-10 text-center text-xs text-ink-soft/40">
        Demo mode — sample data stored on this device. <StatusBadge status="Active" /> badges
        and stats update live as you make changes.
      </p>
    </div>
  );
}
