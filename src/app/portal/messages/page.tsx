"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  canMessage,
  DEMO_USERS,
  MESSAGING_ROLES,
  usePortal,
} from "@/lib/portal/store";
import { Card, inputCls, PageHeader, PrimaryButton } from "@/components/portal/ui";

function fmtTime(ts: string): string {
  return new Date(ts).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const { user, data, sendMessage } = usePortal();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState("");

  // Everyone this account is allowed to message
  const targets = useMemo(
    () =>
      user
        ? DEMO_USERS.filter(
            (u) => u.id !== user.id && canMessage(user.role, u.role)
          )
        : [],
    [user]
  );

  const currentId =
    activeId ??
    targets.find((t) =>
      data.messages.some(
        (m) =>
          (m.fromId === t.id && m.toId === user?.id) ||
          (m.toId === t.id && m.fromId === user?.id)
      )
    )?.id ??
    targets[0]?.id ??
    null;

  if (!user || !MESSAGING_ROLES.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <span className="text-5xl">💬</span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Messaging is for staff
        </h1>
        <p className="mt-2 text-sm text-ink-soft/70">
          Assistants and instructors can message masters here. Students and
          admin accounts don&apos;t use messaging.
        </p>
        <Link
          href="/portal/dashboard"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-pop"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const thread = data.messages
    .filter(
      (m) =>
        (m.fromId === user.id && m.toId === currentId) ||
        (m.fromId === currentId && m.toId === user.id)
    )
    .sort((a, b) => a.ts.localeCompare(b.ts));

  function send() {
    const trimmed = text.trim();
    if (!trimmed || !currentId) return;
    sendMessage(currentId, trimmed);
    setText("");
  }

  const ruleNote =
    user.role === "master"
      ? "As a master you can message assistants and instructors."
      : "You can message masters — staff-to-staff chat goes through them.";

  return (
    <div>
      <PageHeader title="Messages" sub={ruleNote} />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <Card className="self-start p-3">
          {targets.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-soft/60">
              Nobody to message yet.
            </p>
          )}
          {targets.map((t) => {
            const last = [...data.messages]
              .filter(
                (m) =>
                  (m.fromId === t.id && m.toId === user.id) ||
                  (m.toId === t.id && m.fromId === user.id)
              )
              .sort((a, b) => b.ts.localeCompare(a.ts))[0];
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                  currentId === t.id ? "bg-cream" : "hover:bg-cream/60"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-extrabold text-gold">
                  {t.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">
                    {t.name}
                    {t.isHeadMaster && " ⭐"}
                  </span>
                  <span className="block truncate text-xs text-ink-soft/60">
                    {last ? last.text : t.title}
                  </span>
                </span>
              </button>
            );
          })}
        </Card>

        {/* Thread */}
        <Card className="flex min-h-[420px] flex-col p-5">
          {currentId ? (
            <>
              <div className="border-b border-ink/5 pb-3">
                <p className="font-display text-base font-extrabold text-ink">
                  {DEMO_USERS.find((u) => u.id === currentId)?.name}
                  {DEMO_USERS.find((u) => u.id === currentId)?.isHeadMaster && " ⭐"}
                </p>
                <p className="text-xs text-ink-soft/60">
                  {DEMO_USERS.find((u) => u.id === currentId)?.title}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {thread.length === 0 && (
                  <p className="py-8 text-center text-sm text-ink-soft/50">
                    No messages yet — say hello 👋
                  </p>
                )}
                {thread.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.fromId === user.id
                        ? "ml-auto rounded-br-md bg-brand text-white"
                        : "rounded-bl-md bg-cream text-ink"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.fromId === user.id ? "text-white/60" : "text-ink-soft/50"
                      }`}
                    >
                      {fmtTime(m.ts)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t border-ink/5 pt-4">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={`Message ${DEMO_USERS.find((u) => u.id === currentId)?.name}…`}
                  className={inputCls}
                />
                <PrimaryButton onClick={send}>Send</PrimaryButton>
              </div>
            </>
          ) : (
            <p className="m-auto text-sm text-ink-soft/50">Select a conversation.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
