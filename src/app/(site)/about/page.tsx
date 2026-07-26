import type { Metadata } from "next";
import { BELT_RANKS, BIZ, HISTORY } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Stat,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Taekwondo in Troy, MI Since 1980",
  description:
    "Founded in 1980 as Kil's Martial Arts and bought by Master Tammy Trudeau in 2003, Troy Martial Arts is a Kukkiwon-certified school with 12+ certified instructors and 7,000+ students taught.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {BIZ.yearsOpen} years on the same corner,{" "}
              <span className="text-brand">one family at a time</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft/80">
              Since {BIZ.founded}, Troy Martial Arts has taught{" "}
              {BIZ.studentsTaught} students the art of Taekwondo — and the life
              skills that come with it. Generations of Troy families have earned
              their belts here; some of today&apos;s parents took their first
              class on this very mat.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft/80">{BIZ.mission}</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: String(BIZ.founded), label: "founded in Troy" },
              { value: BIZ.studentsTaught, label: "students taught" },
              { value: BIZ.instructorCount, label: "certified instructors" },
              { value: BIZ.combinedExperience, label: "combined experience" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-ink/8 bg-white p-7 text-center shadow-lift"
              >
                <Stat value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </Container>
        <BeltStripe />
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Leadership"
            title="Taught by masters, loved by students"
            sub="Led by Master Tammy Trudeau, our instructor team brings over 200 years of combined experience — and shows up for every student, every class."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-ink/8 bg-white p-8 shadow-lift sm:p-10">
            <p className="text-lg leading-relaxed text-ink-soft">
              &ldquo;Master Trudeau got down on her level to help her through her
              first class, and she left with a great sense of accomplishment and
              confidence.&rdquo;
            </p>
            <p className="mt-3 text-sm font-semibold text-ink-soft/60">
              — a first-class parent, Google review
            </p>
            <ul className="mt-6 grid gap-3 border-t border-ink/5 pt-6 text-sm text-ink-soft sm:grid-cols-2">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                Kukkiwon-certified Taekwondo school
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                Olympic-based curriculum
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {BIZ.instructorCount} professional certified instructors
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                Assistant program — top students learn to lead
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Founding story */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Our history</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              From Kil&apos;s Martial Arts to Troy Martial Arts
            </h2>
          </div>
          <ol className="mx-auto mt-12 max-w-3xl space-y-6">
            {HISTORY.map((h) => (
              <li
                key={h.year}
                className="grid gap-4 rounded-3xl border border-ink/8 bg-white p-7 shadow-lift sm:grid-cols-[110px_1fr] sm:gap-6"
              >
                <span className="font-display text-2xl font-extrabold text-brand">
                  {h.year}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {h.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft/80">
                    {h.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-ink py-16 text-white lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>The belt journey</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From white belt to black belt — a clear path
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {BELT_RANKS.map((belt, i) => (
              <span key={belt.name} className="flex items-center gap-2">
                <span
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold shadow-sm"
                  style={{ backgroundColor: belt.color, color: belt.text }}
                >
                  {belt.name}
                </span>
                {i < BELT_RANKS.length - 1 && (
                  <span aria-hidden className="text-white/30">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-white/70">
            Every belt has its own class track, so students always train with
            peers at their level — challenged, never overwhelmed. Beyond black
            belt, students continue through 6 Dan ranks.
          </p>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Come meet us — the mat is waiting
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft/80">
            Visit us at {BIZ.address} ({BIZ.addressNote}) or start your{" "}
            {BIZ.trial.headline.toLowerCase()} today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact">
              Start the {BIZ.trial.priceLabel} Trial
            </ButtonLink>
            <ButtonLink href={BIZ.phoneHref} variant="secondary">
              Call {BIZ.phone}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
