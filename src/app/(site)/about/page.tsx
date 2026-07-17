import type { Metadata } from "next";
import { BELT_RANKS, BIZ } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Stat,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "About — 45 Years of Taekwondo in Troy, MI",
  description:
    "Founded in 1980, Troy Martial Arts is a Kukkiwon-certified Taekwondo school led by Master Trudeau with 12+ certified instructors and 7,000+ students taught.",
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
            <div className="mt-6 grid gap-4 border-t border-ink/5 pt-6 text-sm text-ink-soft sm:grid-cols-2">
              <p>🥋 Kukkiwon-certified Taekwondo school</p>
              <p>🏅 Olympic-based curriculum</p>
              <p>👥 {BIZ.instructorCount} professional certified instructors</p>
              <p>🧒 Assistant program — top students learn to lead</p>
            </div>
          </div>
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
            <ButtonLink href="/contact">Start Free Trial</ButtonLink>
            <ButtonLink href={BIZ.phoneHref} variant="secondary">
              📞 {BIZ.phone}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
