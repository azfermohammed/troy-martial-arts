"use client";

import { useMemo, useState } from "react";
import { SCHEDULE } from "@/lib/data";
import { usePortal } from "@/lib/portal/store";
import {
  AdminGate,
  Card,
  inputCls,
  PageHeader,
  PrimaryButton,
  StatusBadge,
} from "@/components/portal/ui";

const today = () => new Date().toISOString().slice(0, 10);

// "Advanced · Ages 11–15" labels, matched to student groups
const CLASS_OPTIONS = SCHEDULE.map((c) => ({
  label: `${c.level} · ${c.group}`,
  group: c.group,
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
  const roster = students.filter(
    (s) => s.status === "Active" && s.group === selectedClass?.group
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
      />

      {/* Take attendance */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Take attendance
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-ink">Class</label>
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
            <label className="mb-1 block text-xs font-bold text-ink">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-5 divide-y divide-ink/5 rounded-2xl border border-ink/8">
          {roster.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-soft/50">
              No active students in this program group.
            </p>
          )}
          {roster.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div>
                <p className="text-sm font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-soft/60">{s.belt}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggle(s.id, true)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                    marks[s.id] === true
                      ? "bg-green-600 text-white"
                      : "border border-ink/10 text-ink-soft hover:border-green-400"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => toggle(s.id, false)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                    marks[s.id] === false
                      ? "bg-red-600 text-white"
                      : "border border-ink/10 text-ink-soft hover:border-red-400"
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
            <span className="text-sm font-bold text-green-700">✓ Attendance saved</span>
          )}
        </div>
      </Card>

      {/* History */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-ink">Recent records</h2>
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
              <tr className="border-b border-ink/8 text-xs uppercase tracking-wider text-ink-soft/60">
                <th className="px-5 py-3.5 font-bold">Date</th>
                <th className="px-4 py-3.5 font-bold">Student</th>
                <th className="px-4 py-3.5 font-bold">Class</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((a) => (
                <tr key={a.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                  <td className="px-5 py-3 text-ink-soft">{a.date}</td>
                  <td className="px-4 py-3 font-bold text-ink">
                    {students.find((s) => s.id === a.studentId)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{a.classLabel}</td>
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
