import Link from "next/link";
import { BIZ, NAV_LINKS } from "@/lib/data";

/**
 * 404. Rendered outside the (site) group, so it carries its own minimal
 * chrome rather than the full marketing nav.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-brand sm:text-7xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">
        That page isn&apos;t on the mat
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft/80">
        The link may be out of date. Everything below is still where it should
        be — or call us and we&apos;ll point you the right way.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-pop transition-colors hover:bg-brand-dark"
        >
          Back to home
        </Link>
        <a
          href={BIZ.phoneHref}
          className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-ink/40"
        >
          Call {BIZ.phone}
        </a>
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm font-semibold text-ink-soft/70 underline underline-offset-4 hover:text-brand"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
