"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEMO_USERS,
  PortalProvider,
  usePortal,
  type PortalUser,
  type Role,
} from "@/lib/portal/store";
import { BIZ } from "@/lib/data";

const ALL_ROLES: Role[] = ["student", "assistant", "instructor", "master", "admin"];

const NAV: { href: string; label: string; icon: string; roles: Role[] }[] = [
  { href: "/portal/dashboard", label: "Dashboard", icon: "📊", roles: ALL_ROLES },
  { href: "/portal/schedule", label: "Schedule", icon: "🗓️", roles: ALL_ROLES },
  { href: "/portal/messages", label: "Messages", icon: "💬", roles: ["assistant", "instructor", "master"] },
  { href: "/portal/students", label: "Students", icon: "🥋", roles: ["admin"] },
  { href: "/portal/attendance", label: "Attendance", icon: "✅", roles: ["admin"] },
  { href: "/portal/payments", label: "Payments", icon: "💳", roles: ["admin"] },
];

const ROLE_BADGES: Record<Role, string> = {
  student: "bg-blue-500/20 text-blue-200",
  assistant: "bg-green-500/20 text-green-200",
  instructor: "bg-amber-500/20 text-amber-200",
  master: "bg-red-500/20 text-red-200",
  admin: "bg-purple-500/20 text-purple-200",
};

function LoginScreen() {
  const { login } = usePortal();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold font-display text-lg font-extrabold text-ink shadow-pop">
            TMA
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-white">
            Portal
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {BIZ.name} · students & staff
          </p>
        </div>

        <div className="mt-9 space-y-3">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gold">
            Demo accounts — tap to sign in
          </p>
          {DEMO_USERS.map((u: PortalUser) => (
            <button
              key={u.id}
              onClick={() => login(u)}
              className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-gold/50 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-base font-extrabold text-white">
                {u.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-white">
                  {u.name}
                  {u.isHeadMaster && " ⭐"}
                </span>
                <span className="block truncate text-xs text-white/60">{u.title}</span>
              </span>
              <span
                className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${ROLE_BADGES[u.role]}`}
              >
                {u.role}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-white/40">
          Demo mode — data is stored on this device only.
          <br />
          <Link href="/" className="font-semibold text-white/60 underline hover:text-gold">
            ← Back to troymartialarts.net
          </Link>
        </p>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = usePortal();
  const pathname = usePathname();
  const nav = NAV.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-display text-xs font-extrabold text-ink">
            TMA
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-extrabold text-white">
              Troy Martial Arts
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Portal
            </span>
          </span>
        </Link>
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "bg-brand text-white shadow-pop"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between px-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user?.name}
                {user?.isHeadMaster && " ⭐"}
              </p>
              <p className="truncate text-xs text-white/50">{user?.title}</p>
            </div>
            {user && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${ROLE_BADGES[user.role]}`}
              >
                {user.role}
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-xl border border-white/15 py-2 text-xs font-bold text-white/70 transition-colors hover:border-brand hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-ink/10 bg-ink px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold font-display text-[10px] font-extrabold text-ink">
              TMA
            </span>
            <span className="text-sm font-extrabold text-white">Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${ROLE_BADGES[user.role]}`}
              >
                {user.role}
              </span>
            )}
            <button
              onClick={logout}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white/80"
            >
              Sign out
            </button>
          </div>
        </header>
        <nav className="sticky top-[53px] z-40 flex gap-1 overflow-x-auto border-b border-ink/10 bg-white px-3 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${
                pathname === item.href
                  ? "bg-brand text-white"
                  : "text-ink-soft hover:bg-ink/5"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, user } = usePortal();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gold font-display text-lg font-extrabold text-ink">
          TMA
        </span>
      </div>
    );
  }
  if (!user) return <LoginScreen />;
  return <Shell>{children}</Shell>;
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProvider>
      <Gate>{children}</Gate>
    </PortalProvider>
  );
}
