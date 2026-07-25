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
import { Icon } from "@/components/portal/icons";

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
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-panel text-muted shadow-card">
          <Icon name="chat" size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-graphite">
          Messaging is for staff
        </h1>
        <p className="mt-2 text-sm text-muted">
          Assistants and instructors can message masters here. Students and
          admin accounts don&apos;t use messaging.
        </p>
        <Link
          href="/portal/dashboard"
          className="mt-6 inline-block rounded-lg bg-graphite px-5 py-2.5 text-sm font-semibold text-white shadow-tab transition-colors hover:bg-graphite/90"
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
        <Card className="self-start p-2">
          {targets.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted">
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                  currentId === t.id
                    ? "bg-canvas ring-1 ring-edge"
                    : "hover:bg-canvas/60"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-semibold text-graphite ring-1 ring-edge">
                  {t.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 truncate text-sm font-semibold text-graphite">
                    {t.name}
                    {t.isHeadMaster && (
                      <Icon
                        name="star"
                        size={13}
                        title="Head master"
                        className="text-amber-500"
                      />
                    )}
                  </span>
                  <span className="block truncate text-xs text-muted">
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
              <div className="border-b border-edge pb-3">
                <p className="flex items-center gap-1 text-base font-semibold tracking-tight text-graphite">
                  {DEMO_USERS.find((u) => u.id === currentId)?.name}
                  {DEMO_USERS.find((u) => u.id === currentId)?.isHeadMaster && (
                    <Icon
                      name="star"
                      size={14}
                      title="Head master"
                      className="text-amber-500"
                    />
                  )}
                </p>
                <p className="text-xs text-muted">
                  {DEMO_USERS.find((u) => u.id === currentId)?.title}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {thread.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No messages yet — say hello.
                  </p>
                )}
                {thread.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      m.fromId === user.id
                        ? "ml-auto rounded-br-sm bg-graphite text-white"
                        : "rounded-bl-sm border border-edge bg-canvas text-graphite"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.fromId === user.id ? "text-white/50" : "text-muted"
                      }`}
                    >
                      {fmtTime(m.ts)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t border-edge pt-4">
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
            <p className="m-auto text-sm text-muted">Select a conversation.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
