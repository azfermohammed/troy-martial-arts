"use client";

import { useMemo, useState } from "react";
import { usePortal, type Payment } from "@/lib/portal/store";
import {
  AdminGate,
  Card,
  inputCls,
  Modal,
  PageHeader,
  PrimaryButton,
  StatCard,
  StatusBadge,
} from "@/components/portal/ui";

type Tab = "All" | "Paid" | "Pending" | "Overdue";

function PaymentsInner() {
  const { data, addPayment, markPaid } = usePortal();
  const { students, payments } = data;

  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const collected = payments
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);
  const pending = payments
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter((p) => p.status === "Overdue");

  const filtered = useMemo(() => {
    let list = payments;
    if (tab !== "All") list = list.filter((p) => p.status === tab);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = students.find((s) => s.id === p.studentId)?.name ?? "";
        return (
          name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      });
    }
    return [...list].sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  }, [payments, students, tab, query]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount") ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) return;
    addPayment({
      studentId: String(fd.get("studentId") ?? ""),
      amount,
      description: String(fd.get("description") ?? ""),
      dueDate: String(fd.get("dueDate") ?? ""),
      status: (fd.get("status") as Payment["status"]) ?? "Pending",
    });
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        sub="Tuition, gear, and event fees"
        action={
          <PrimaryButton onClick={() => setShowForm(true)}>+ Add payment</PrimaryButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Collected"
          value={`$${collected.toLocaleString()}`}
          accent="text-green-700"
        />
        <StatCard
          label="Pending"
          value={`$${pending.toLocaleString()}`}
          accent="text-amber-600"
        />
        <StatCard
          label="Overdue"
          value={String(overdue.length)}
          hint={overdue.length ? "needs follow-up" : "all caught up 🎉"}
          accent={overdue.length ? "text-brand" : "text-ink"}
        />
      </div>

      <div className="mb-5 mt-8 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-lift">
          {(["All", "Paid", "Pending", "Overdue"] as Tab[]).map((t) => (
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
          placeholder="Search student or description…"
          className={`${inputCls} max-w-xs`}
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/8 text-xs uppercase tracking-wider text-ink-soft/60">
              <th className="px-5 py-3.5 font-bold">Student</th>
              <th className="px-4 py-3.5 font-bold">Description</th>
              <th className="px-4 py-3.5 font-bold">Amount</th>
              <th className="px-4 py-3.5 font-bold">Due</th>
              <th className="px-4 py-3.5 font-bold">Status</th>
              <th className="px-4 py-3.5 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-soft/50">
                  No payments match.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                <td className="px-5 py-3.5 font-bold text-ink">
                  {students.find((s) => s.id === p.studentId)?.name ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-ink-soft">{p.description}</td>
                <td className="px-4 py-3.5 font-bold text-ink">${p.amount}</td>
                <td className="px-4 py-3.5 text-ink-soft">{p.dueDate}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  {p.status !== "Paid" ? (
                    <button
                      onClick={() => markPaid(p.id)}
                      className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                    >
                      Mark paid
                    </button>
                  ) : (
                    <span className="text-xs text-ink-soft/40">✓ settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={showForm} title="Add payment" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-ink">Student *</label>
            <select name="studentId" required className={inputCls} defaultValue="">
              <option value="" disabled>
                Choose a student…
              </option>
              {[...students]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Amount ($) *</label>
              <input
                name="amount"
                type="number"
                min={1}
                step="0.01"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">Due date *</label>
              <input
                name="dueDate"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-ink">Description *</label>
            <input
              name="description"
              required
              placeholder="August Tuition"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-ink">Status</label>
            <select name="status" defaultValue="Pending" className={inputCls}>
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
          <PrimaryButton type="submit" className="w-full">
            Add payment
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <AdminGate>
      <PaymentsInner />
    </AdminGate>
  );
}
