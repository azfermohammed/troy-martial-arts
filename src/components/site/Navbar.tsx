"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BIZ, NAV_LINKS } from "@/lib/data";
import { asset } from "@/lib/assetPath";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Troy Martial Arts home">
      <Image
        src={asset("/img/tma-logo-alt.png")}
        alt="Troy Martial Arts — Taekwondo &amp; Self Defense"
        width={1682}
        height={592}
        priority
        className="h-11 w-auto"
      />
      <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-brand sm:block">
        Since 1980
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-ink/5 text-brand"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/portal"
            className="text-sm font-semibold text-ink-soft/70 transition-colors hover:text-ink"
          >
            Portal
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            {BIZ.trial.priceLabel} · 4-Week Trial
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/5 bg-paper px-5 pb-6 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-ink/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-base font-semibold text-ink-soft/70 hover:bg-ink/5"
          >
            Student & Staff Portal
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-brand px-5 py-3 text-center text-base font-bold text-white shadow-pop"
          >
            {BIZ.trial.priceLabel} · 4-Week Trial
          </Link>
          <a
            href={BIZ.phoneHref}
            className="mt-3 block text-center text-sm font-semibold text-ink-soft"
          >
            Call {BIZ.phone}
          </a>
        </div>
      )}
    </header>
  );
}
