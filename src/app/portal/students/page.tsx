"use client";

import { useMemo, useState } from "react";
import { AGE_GROUPS } from "@/lib/data";
import {
  PORTAL_BELTS,
  usePortal,
  type Student,
} from "@/lib/portal/store";
import {
  AdminGate,
  BeltBadge,
  Card,
  inputCls,
  Modal,
  PageHeader,
  PrimaryButton,
  StatusBadge,
} from "@/components/portal/ui";

type Tab = "All" | "Assistants" | "Inactive";

const EMPTY_FORM = {
  name: "",
  age: 8,
  belt: "White",
  group: AGE_GROUPS[0] as string,
  phone: "",
  email: "",
  joinDate: new Date().toISOString().slice(0, 10),
  status: "Active" as const,
  isAssistant: false,
};

function StudentsInner() {
  const { data, addStudent, updateStudent, deleteStudent } = usePortal();
  const { students, payments } = data;

  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    let list = students;
    if (tab === "Assistants") list = list.filter((s) => s.isAssistant);
    if (tab === "Inactive") list = list.filter((s) => s.status === "Inactive");
    if (tab === "All") list = list.filter((s) => s.status === "Active");
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.belt.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [students, tab, query]);

  function paymentStatus(studentId: string): string {
    const mine = payments.filter((p) => p.studentId === studentId);
    if (mine.length === 0) return "—";
    if (mine.some((p) => p.status === "Overdue")) return "Overdue";
    if (mine.some((p) => p.status === "Pending")) return "Pending";
    return "Paid";
  }

  function promote(s: Student) {
    const idx = PORTAL_BELTS.indexOf(s.belt as (typeof PORTAL_BELTS)[number]);
    if (idx >= 0 && idx < PORTAL_BELTS.length - 1) {
      updateStudent(s.id, { belt: PORTAL_BELTS[idx + 1] });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const record = {
      name: String(fd.get("name") ?? ""),
      age: Number(fd.get("age") ?? 0),
      belt: String(fd.get("belt") ?? "White"),
      group: String(fd.get("group") ?? AGE_GROUPS[0]) as Student["group"],
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      joinDate: String(fd.get("joinDate") ?? ""),
      status: (fd.get("status") === "Inactive" ? "Inactive" : "Active") as Student["status"],
      isAssistant: fd.get("isAssistant") === "on",
    };
    if (editing) {
      updateStudent(editing.id, record);
    } else {
      addStudent(record);
    }
    setShowForm(false);
    setEditing(null);
  }

  const formDefaults = editing ?? EMPTY_FORM;

  return (
    <div>
      <PageHeader
        title="Students"
        sub={`${students.filter((s) => s.status === "Active").length} active · ${
          students.filter((s) => s.isAssistant).length
        } assistants`}
        action={
          <PrimaryButton
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Add student
          </PrimaryButton>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-lift">
          {(["All", "Assistants", "Inactive"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                tab === t ? "bg-brand text-white" : "text-ink-soft hover:bg-ink/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, belt…"
          className={`${inputCls} max-w-xs`}
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 text-xs uppercase tracking-wider text-ink-soft/60">
              <th className="px-5 py-3.5 font-bold">Student</th>
              <th className="px-4 py-3.5 font-bold">Belt</th>
              <th className="px-4 py-3.5 font-bold">Program</th>
              <th className="px-4 py-3.5 font-bold">Status</th>
              <th className="px-4 py-3.5 font-bold">Payments</th>
              <th className="px-4 py-3.5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-soft/50">
                  No students match.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-ink">
                    {s.name}
                    {s.isAssistant && (
                      <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-extrabold uppercase text-brand-deep">
                        Assistant
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink-soft/60">
                    Age {s.age} · {s.email}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <BeltBadge belt={s.belt} />
                </td>
                <td className="px-4 py-3.5 text-ink-soft">{s.group}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={paymentStatus(s.id)} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => promote(s)}
                      title="Promote to next belt"
                      className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink-soft hover:border-gold hover:text-brand-deep"
                    >
                      ⬆ Belt
                    </button>
                    <button
                      onClick={() => {
                        setEditing(s);
                        setShowForm(true);
                      }}
                      className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-bold text-ink-soft hover:border-ink/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(s)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add / Edit form */}
      <Modal
        open={showForm}
        title={editing ? `Edit ${editing.name}` : "Add student"}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4" key={editing?.id ?? "new"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Full name *</label>
              <input name="name" required defaultValue={formDefaults.name} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Age *</label>
              <input
                name="age"
                type="number"
                min={4}
                max={99}
                required
                defaultValue={formDefaults.age}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Belt</label>
              <select name="belt" defaultValue={formDefaults.belt} className={inputCls}>
                {PORTAL_BELTS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Program</label>
              <select name="group" defaultValue={formDefaults.group} className={inputCls}>
                {AGE_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Phone</label>
              <input name="phone" defaultValue={formDefaults.phone} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Email</label>
              <input name="email" type="email" defaultValue={formDefaults.email} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Join date</label>
              <input
                name="joinDate"
                type="date"
                defaultValue={formDefaults.joinDate}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Status</label>
              <select name="status" defaultValue={formDefaults.status} className={inputCls}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="isAssistant"
              defaultChecked={formDefaults.isAssistant}
              className="h-4 w-4 accent-brand"
            />
            Class assistant
          </label>
          <PrimaryButton type="submit" className="w-full">
            {editing ? "Save changes" : "Add student"}
          </PrimaryButton>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={confirmDelete !== null}
        title="Delete student?"
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-sm text-ink-soft">
          This removes <strong>{confirmDelete?.name}</strong> along with their
          payments and attendance history. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-bold text-ink-soft"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirmDelete) deleteStudent(confirmDelete.id);
              setConfirmDelete(null);
            }}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <AdminGate>
      <StudentsInner />
    </AdminGate>
  );
}
