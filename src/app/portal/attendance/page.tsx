"use client";

import { useMemo, useState } from "react";
import { beltToLevel, CLASS_SESSIONS, sessionLabel } from "@/lib/data";
import { usePortal } from "@/lib/portal/store";
import {
  AdminGate,
  Card,
  ExportButton,
  inputCls,
  PageHeader,
  PrimaryButton,
  StatusBadge,
} from "@/components/portal/ui";
import { Icon } from "@/components/portal/icons";

const today = () => new Date().toISOString().slice(0, 10);

// One option per real class on the mat, e.g.
// "Mon 5:10–5:50 PM · Beginner & Intermediate"
const CLASS_OPTIONS = CLASS_SESSIONS.map((c) => ({
  label: `${c.day} ${c.slot} · ${sessionLabel(c)}`,
  session: c,
}));

function AttendanceInner() {
  const { data, recordAttendance } = usePortal();
  const { students, attendance } = data;

  const [date, setDate] = useState(today());
  const [classLabel, setClassLabel] = useState(CLASS_OPTIONS[0].label);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [savedFlash, setSavedFlash] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");

  const selectedClass = CLASS_OPTIONS.find((c) => c.label === classLabel);
  // Belt level decides who is on the mat, not age group.
  const roster = students.filter(
    (s) =>
      s.status === "Active" &&
      !!selectedClass &&
      selectedClass.session.levels.includes(beltToLevel(s.belt))
  );

  function toggle(id: string, present: boolean) {
    setMarks((m) => ({ ...m, [id]: present }));
  }

  function save() {
    const records = Object.entries(marks).map(([studentId, present]) => ({
      studentId,
      classLabel,
      date,
      present,
    }));
    if (records.length === 0) return;
    recordAttendance(records);
    setMarks({});
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  const history = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    return [...attendance]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((a) => {
        if (!q) return true;
        const name = students.find((s) => s.id === a.studentId)?.name ?? "";
        return (
          name.toLowerCase().includes(q) || a.classLabel.toLowerCase().includes(q)
        );
      })
      .slice(0, 30);
  }, [attendance, students, historyQuery]);

  const todayRecords = attendance.filter((a) => a.date === today());

  return (
    <div>
      <PageHeader
        title="Attendance"
        sub={`${todayRecords.length} check-in${todayRecords.length === 1 ? "" : "s"} recorded today`}
        action={
          <ExportButton
            base="attendance"
            rows={history.map((a) => ({
              date: a.date,
              student: students.find((s) => s.id === a.studentId)?.name ?? "—",
              classLabel: a.classLabel,
              present: a.present ? "Present" : "Absent",
            }))}
            columns={[
              { key: "date", label: "Date" },
              { key: "student", label: "Student" },
              { key: "classLabel", label: "Class" },
              { key: "present", label: "Status" },
            ]}
          />
        }
      />

      {/* Take attendance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight text-graphite">
          Take attendance
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-graphite">
              Class
            </label>
            <select
              value={classLabel}
              onChange={(e) => {
                setClassLabel(e.target.value);
                setMarks({});
              }}
              className={inputCls}
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-graphite">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-5 divide-y divide-edge rounded-xl border border-edge">
          {roster.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              No active students in this program group.
            </p>
          )}
          {roster.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-graphite">{s.name}</p>
                <p className="text-xs text-muted">{s.belt}</p>
              </div>
              {/* Present/absent keep their semantic green + red */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggle(s.id, true)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                    marks[s.id] === true
                      ? "bg-green-600 text-white"
                      : "border border-edge text-muted hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => toggle(s.id, false)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                    marks[s.id] === false
                      ? "bg-red-600 text-white"
                      : "border border-edge text-muted hover:border-red-400 hover:text-red-700"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4">
          <PrimaryButton onClick={save}>
            Save {Object.keys(marks).length > 0 && `(${Object.keys(marks).length})`}
          </PrimaryButton>
          {savedFlash && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <Icon name="check" size={16} />
              Attendance saved
            </span>
          )}
        </div>
      </Card>

      {/* History */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-graphite">
            Recent records
          </h2>
          <input
            value={historyQuery}
            onChange={(e) => setHistoryQuery(e.target.value)}
            placeholder="Search student or class…"
            className={`${inputCls} max-w-xs`}
          />
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-edge text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 font-semibold">Student</th>
                <th className="px-4 py-3.5 font-semibold">Class</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-edge last:border-0 hover:bg-canvas"
                >
                  <td className="px-5 py-3 text-muted">{a.date}</td>
                  <td className="px-4 py-3 font-semibold text-graphite">
                    {students.find((s) => s.id === a.studentId)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{a.classLabel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.present ? "Present" : "Absent"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <AdminGate>
      <AttendanceInner />
    </AdminGate>
  );
}
