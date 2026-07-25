"use client";

import Link from "next/link";
import { usePortal, PORTAL_BELTS } from "@/lib/portal/store";
import { CLASS_SESSIONS, sessionLabel } from "@/lib/data";
import {
  BeltBadge,
  Card,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/portal/ui";
import { Icon, type IconName } from "@/components/portal/icons";
import { projectPromotion, PROMOTION_RULES } from "@/lib/portal/promotion";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

/* ------------------------------------------------------------------ */
/* Personal view — every non-admin role                                */
/* ------------------------------------------------------------------ */

function PersonalDashboard() {
  const { user, data } = usePortal();
  const { students, attendance } = data;

  const me = user?.studentId
    ? students.find((s) => s.id === user.studentId)
    : undefined;

  const myAttendance = me
    ? attendance
        .filter((a) => a.studentId === me.id)
        .sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const present = myAttendance.filter((a) => a.present);

  // Staff without a linked student record still have classes they run
  const myClasses = Object.entries(data.staffing).filter(
    ([, s]) => user && (s.leads.includes(user.id) || s.helpers.includes(user.id))
  );

  const projection =
    me &&
    projectPromotion({
      currentBelt: me.belt,
      belts: PORTAL_BELTS,
      // Student records have no lastPromotionDate, so joinDate is the only
      // available rank-start proxy. Adding that field would make this exact.
      inRankSince: me.joinDate,
      attendanceDates: present.map((a) => a.date),
    });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"}`}
        sub={me ? "Your classes and belt progress." : "Your classes at the dojang."}
      />

      {me && projection && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Current belt
            </p>
            <div className="mt-3">
              <BeltBadge belt={me.belt} />
            </div>
          </Card>
          <StatCard
            label="Classes attended"
            value={String(present.length)}
            hint={`${myAttendance.length - present.length} missed`}
          />
          <StatCard
            label={`Toward ${projection.nextBelt ?? "next rank"}`}
            value={`${projection.classesAttended}/${projection.classesRequired}`}
            hint={`${Math.round(projection.progress * 100)}% of classes logged`}
          />
          <StatCard
            label="Projected promotion"
            value={
              projection.eligibleNow
                ? "Eligible"
                : projection.projectedDate
                  ? fmtDate(projection.projectedDate)
                  : "Top rank"
            }
            hint="estimated — confirm with your instructor"
            accent={projection.eligibleNow ? "text-green-700" : "text-graphite"}
          />
        </div>
      )}

      {me && projection?.nextBelt && (
        <Card className="mt-6 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-graphite">
              Progress to {projection.nextBelt}
            </h2>
            <p className="text-xs text-muted">
              {PROMOTION_RULES.classesRequired} classes ·{" "}
              {PROMOTION_RULES.minWeeksInRank} weeks minimum in rank
            </p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-canvas ring-1 ring-edge">
            <div
              className="h-full rounded-full bg-graphite transition-all"
              style={{ width: `${projection.progress * 100}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            {projection.eligibleNow ? (
              <>You&apos;ve met the requirements — ask about testing.</>
            ) : (
              <>
                {projection.classesRequired - projection.classesAttended} more
                classes at the recommended{" "}
                {PROMOTION_RULES.recommendedClassesPerWeek} per week.
              </>
            )}
          </p>
        </Card>
      )}

      {myClasses.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">
            Classes you teach
          </h2>
          <ul className="mt-4 space-y-2">
            {myClasses.map(([classId, s]) => {
              const session = CLASS_SESSIONS.find((c) => c.id === classId);
              return (
                <li
                  key={classId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-edge px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0">
                    <span className="block font-medium text-graphite">
                      {session ? `${session.day} ${session.slot}` : classId}
                    </span>
                    {session && (
                      <span className="block text-xs text-muted">
                        {sessionLabel(session)}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {user && s.leads.includes(user.id) ? "Lead" : "Helper"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-graphite">
          Every class you&apos;ve attended
        </h2>
        <Card className="overflow-x-auto">
          {myAttendance.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              {me
                ? "No classes recorded yet."
                : "Your account isn't linked to a student record, so there's no attendance history to show."}
            </p>
          ) : (
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-edge text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-4 py-3.5 font-semibold">Class</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-edge last:border-0 hover:bg-canvas"
                  >
                    <td className="px-5 py-3 text-muted">{fmtDate(a.date)}</td>
                    <td className="px-4 py-3 font-medium text-graphite">
                      {a.classLabel}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.present ? "Present" : "Absent"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <Link
          href="/portal/schedule"
          className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
        >
          <Icon name="calendar" size={15} />
          See the full class calendar
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin view — business figures, admin accounts only                  */
/* ------------------------------------------------------------------ */

function AdminDashboard() {
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

  const beltCounts = PORTAL_BELTS.map((belt) => ({
    belt,
    count: active.filter((s) => s.belt === belt).length,
  })).filter((b) => b.count > 0);
  const maxCount = Math.max(1, ...beltCounts.map((b) => b.count));

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
    </div>
  );
}

export default function DashboardPage() {
  const { user } = usePortal();
  // Financial and roster-wide data is admin-only; everyone else gets their own
  // classes and belt progress.
  return user?.role === "admin" ? <AdminDashboard /> : <PersonalDashboard />;
}
