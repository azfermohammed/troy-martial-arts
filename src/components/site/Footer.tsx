import Link from "next/link";
import Image from "next/image";
import { BIZ, NAV_LINKS, PROGRAMS } from "@/lib/data";
import { BeltStripe, Container } from "@/components/ui";
import { asset } from "@/lib/assetPath";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <BeltStripe className="h-2" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* Logo art is blue on transparent, so it sits on a white chip here */}
          <span className="inline-flex rounded-xl bg-white px-3 py-2">
            <Image
              src={asset("/img/tma-logo-alt.png")}
              alt="Troy Martial Arts — Taekwondo &amp; Self Defense"
              width={1682}
              height={592}
              className="h-9 w-auto"
            />
          </span>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Kukkiwon-Certified Taekwondo · Since {BIZ.founded}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{BIZ.mission}</p>
          <p className="mt-4 text-sm text-white/70">{BIZ.hours}</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white/50">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/80 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/portal" className="text-sm text-white/80 transition-colors hover:text-gold">
                Student & Staff Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white/50">Programs</p>
          <ul className="mt-4 space-y-2.5">
            {PROGRAMS.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/programs#${p.id}`}
                  className="text-sm text-white/80 transition-colors hover:text-gold"
                >
                  {p.name} · {p.ages}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white/50">Visit us</p>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-white/80">
            <p>{BIZ.address}</p>
            <p className="text-white/60">{BIZ.addressNote}</p>
            <p>
              <a href={BIZ.phoneHref} className="font-semibold text-gold hover:underline">
                {BIZ.phone}
              </a>
            </p>
            <p className="text-white/60">Classes 6 days a week · Mon–Sat</p>
          </address>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BIZ.legalName} · Serving Troy, MI since {BIZ.founded}
          </p>
          <p>
            ★ {BIZ.rating} rating from {BIZ.reviewCount} Google reviews
          </p>
        </Container>
      </div>
    </footer>
  );
}
