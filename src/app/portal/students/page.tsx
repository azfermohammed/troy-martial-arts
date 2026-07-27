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
  ExportButton,
  inputCls,
  Modal,
  PageHeader,
  PrimaryButton,
  StatusBadge,
} from "@/components/portal/ui";
import { Icon } from "@/components/portal/icons";

type Tab = "All" | "Assistants" | "Inactive";

const EMPTY_FORM = {
  name: "",
  age: 8,
  belt: "White",
  group: AGE_GROUPS[0] as string,
  phone: "",
  email: "",
  joinDate: new Date().toISOString().slice(0, 10),
  lastPromotionDate: "",
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
      // Stamp the promotion date so the next projection measures from the new
      // rank rather than from when the student joined.
      updateStudent(s.id, {
        belt: PORTAL_BELTS[idx + 1],
        lastPromotionDate: new Date().toISOString().slice(0, 10),
      });
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
      // Blank means "never promoted" — projections then fall back to joinDate.
      lastPromotionDate: String(fd.get("lastPromotionDate") ?? "") || undefined,
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
          <div className="flex flex-wrap items-center gap-2">
          <ExportButton
            base="students"
            rows={filtered.map((s) => ({
              name: s.name,
              age: s.age,
              belt: s.belt,
              group: s.group,
              status: s.status,
              phone: s.phone,
              email: s.email,
              joinDate: s.joinDate,
              lastPromotionDate: s.lastPromotionDate ?? "",
            }))}
            columns={[
              { key: "name", label: "Name" },
              { key: "age", label: "Age" },
              { key: "belt", label: "Belt" },
              { key: "group", label: "Program" },
              { key: "status", label: "Status" },
              { key: "phone", label: "Phone" },
              { key: "email", label: "Email" },
              { key: "joinDate", label: "Joined" },
              { key: "lastPromotionDate", label: "Belt since" },
            ]}
          />
          <PrimaryButton
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Icon name="plus" size={15} />
            Add student
          </PrimaryButton>
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-edge bg-panel p-1 shadow-tab">
          {(["All", "Assistants", "Inactive"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                tab === t
                  ? "bg-graphite text-white"
                  : "text-muted hover:bg-canvas hover:text-graphite"
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
            <tr className="border-b border-edge text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-4 py-3.5 font-semibold">Belt</th>
              <th className="px-4 py-3.5 font-semibold">Program</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Payments</th>
              <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  No students match.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b border-edge last:border-0 hover:bg-canvas"
              >
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-graphite">
                    {s.name}
                    {s.isAssistant && (
                      <span className="ml-2 rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold uppercase text-muted ring-1 ring-edge">
                        Assistant
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    Age {s.age} · {s.email}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <BeltBadge belt={s.belt} />
                </td>
                <td className="px-4 py-3.5 text-muted">{s.group}</td>
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
                      className="inline-flex items-center gap-1 rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
                    >
                      <Icon name="arrowUp" size={13} />
                      Belt
                    </button>
                    <button
                      onClick={() => {
                        setEditing(s);
                        setShowForm(true);
                      }}
                      className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
                    >
                      Edit
                    </button>
                    {/* Destructive — stays red */}
                    <button
                      onClick={() => setConfirmDelete(s)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
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
              <label className="mb-1 block text-xs font-semibold text-graphite">
                Full name *
              </label>
              <input name="name" required defaultValue={formDefaults.name} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Age *</label>
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
              <label className="mb-1 block text-xs font-semibold text-graphite">Belt</label>
              <select name="belt" defaultValue={formDefaults.belt} className={inputCls}>
                {PORTAL_BELTS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Program</label>
              <select name="group" defaultValue={formDefaults.group} className={inputCls}>
                {AGE_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Phone</label>
              <input name="phone" defaultValue={formDefaults.phone} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Email</label>
              <input name="email" type="email" defaultValue={formDefaults.email} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Join date</label>
              <input
                name="joinDate"
                type="date"
                defaultValue={formDefaults.joinDate}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">
                Current belt since
              </label>
              <input
                name="lastPromotionDate"
                type="date"
                defaultValue={formDefaults.lastPromotionDate ?? ""}
                className={inputCls}
              />
              <p className="mt-1 text-[11px] leading-snug text-muted">
                Drives the promotion estimate. Leave blank if never promoted.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-graphite">Status</label>
              <select name="status" defaultValue={formDefaults.status} className={inputCls}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-graphite">
            <input
              type="checkbox"
              name="isAssistant"
              defaultChecked={formDefaults.isAssistant}
              className="h-4 w-4 accent-graphite"
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
        <p className="text-sm text-muted">
          This removes <strong className="text-graphite">{confirmDelete?.name}</strong> along
          with their payments and attendance history. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="rounded-lg border border-edge px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirmDelete) deleteStudent(confirmDelete.id);
              setConfirmDelete(null);
            }}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
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
