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
import { Icon, type IconName } from "@/components/portal/icons";

const ALL_ROLES: Role[] = ["student", "assistant", "instructor", "master", "admin"];

const NAV: { href: string; label: string; icon: IconName; roles: Role[] }[] = [
  { href: "/portal/dashboard", label: "Dashboard", icon: "chart", roles: ALL_ROLES },
  { href: "/portal/schedule", label: "Schedule", icon: "calendar", roles: ALL_ROLES },
  { href: "/portal/messages", label: "Messages", icon: "chat", roles: ["assistant", "instructor", "master"] },
  { href: "/portal/students", label: "Students", icon: "users", roles: ["admin"] },
  { href: "/portal/attendance", label: "Attendance", icon: "clipboard", roles: ["admin"] },
  { href: "/portal/payments", label: "Payments", icon: "card", roles: ["admin"] },
];

// Role stays colour-coded (it carries meaning), retuned for light surfaces.
const ROLE_BADGES: Record<Role, string> = {
  student: "bg-blue-50 text-blue-700",
  assistant: "bg-green-50 text-green-700",
  instructor: "bg-amber-50 text-amber-700",
  master: "bg-red-50 text-red-700",
  admin: "bg-purple-50 text-purple-700",
};

/** Square wordmark used on the login screen and in the shell header. */
function Mark({ className = "h-9 w-9 text-xs" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-graphite font-semibold tracking-tight text-white ${className}`}
    >
      TMA
    </span>
  );
}

function LoginScreen() {
  const { login } = usePortal();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Mark className="mx-auto h-14 w-14 text-base shadow-tab" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-graphite">
            Portal
          </h1>
          <p className="mt-2 text-sm text-muted">
            {BIZ.name} · students &amp; staff
          </p>
        </div>

        <div className="mt-9 space-y-2">
          <p className="pb-1 text-center text-xs font-semibold uppercase tracking-widest text-muted">
            Demo accounts — tap to sign in
          </p>
          {DEMO_USERS.map((u: PortalUser) => (
            <button
              key={u.id}
              onClick={() => login(u)}
              className="flex w-full items-center gap-4 rounded-xl border border-edge bg-panel p-4 text-left shadow-card transition-colors hover:border-graphite/25"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas text-base font-semibold text-graphite">
                {u.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 truncate text-sm font-semibold text-graphite">
                  {u.name}
                  {u.isHeadMaster && (
                    <Icon name="star" size={13} title="Head master" className="text-amber-500" />
                  )}
                </span>
                <span className="block truncate text-xs text-muted">{u.title}</span>
              </span>
              <span
                className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGES[u.role]}`}
              >
                {u.role}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted">
          Demo mode — data is stored on this device only.
          <br />
          <Link
            href="/"
            className="font-semibold text-graphite underline underline-offset-2 hover:text-graphite/70"
          >
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
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-edge bg-panel lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-6">
          <Mark />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-graphite">
              Troy Martial Arts
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Portal
            </span>
          </span>
        </Link>
        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-graphite text-white shadow-tab"
                  : "text-muted hover:bg-canvas hover:text-graphite"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-edge p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-sm font-semibold text-graphite">
                {user?.name}
                {user?.isHeadMaster && (
                  <Icon name="star" size={13} title="Head master" className="text-amber-500" />
                )}
              </p>
              <p className="truncate text-xs text-muted">{user?.title}</p>
            </div>
            {user && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${ROLE_BADGES[user.role]}`}
              >
                {user.role}
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-edge py-2 text-xs font-semibold text-muted transition-colors hover:border-graphite/25 hover:text-graphite"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-edge bg-panel px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Mark className="h-8 w-8 text-[10px]" />
            <span className="text-sm font-semibold tracking-tight text-graphite">
              Portal
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${ROLE_BADGES[user.role]}`}
              >
                {user.role}
              </span>
            )}
            <button
              onClick={logout}
              className="rounded-lg border border-edge px-3 py-1.5 text-xs font-semibold text-muted"
            >
              Sign out
            </button>
          </div>
        </header>
        <nav className="sticky top-[53px] z-40 flex gap-1 overflow-x-auto border-b border-edge bg-panel px-3 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                pathname === item.href
                  ? "bg-graphite text-white"
                  : "text-muted hover:bg-canvas hover:text-graphite"
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
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
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Mark className="h-14 w-14 animate-pulse text-base" />
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
