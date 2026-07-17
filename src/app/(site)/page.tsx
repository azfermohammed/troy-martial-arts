import Link from "next/link";
import { BIZ, PROGRAMS, REVIEWS } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Stars,
  Stat,
} from "@/components/ui";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* soft decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl"
      />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="animate-rise">
          <Eyebrow>🥋 Kukkiwon-Certified Taekwondo · Troy, MI</Eyebrow>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Confident kids.
            <br />
            Strong families.
            <br />
            <span className="text-brand">Since 1980.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft/80">
            Troy&apos;s most trusted martial arts school — {BIZ.yearsOpen} years,{" "}
            {BIZ.studentsTaught} students, and one promise: your family leaves
            every class more confident than they walked in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact">Start Your 4-Week Trial →</ButtonLink>
            <ButtonLink href="/schedule" variant="secondary">
              See Class Schedule
            </ButtonLink>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Stars className="h-5 w-5" />
            <p className="text-sm font-semibold text-ink">
              {BIZ.rating} from {BIZ.reviewCount} Google reviews
            </p>
          </div>
        </div>

        {/* Offer card composition */}
        <div className="relative animate-rise" style={{ animationDelay: "0.15s" }}>
          <div className="relative rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-8 text-white shadow-pop sm:p-10">
            <span className="inline-flex rounded-full bg-gold px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-ink">
              Limited-time offer
            </span>
            <p className="mt-5 font-display text-4xl font-extrabold leading-tight">
              {BIZ.trial.headline}
            </p>
            <p className="mt-1 text-lg font-semibold text-white/90">{BIZ.trial.sub}</p>
            <ul className="mt-6 space-y-3">
              {BIZ.trial.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
                    ✓
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-8 block rounded-full bg-white py-3.5 text-center text-sm font-extrabold text-brand-deep transition-transform hover:-translate-y-0.5"
            >
              Claim the Trial
            </Link>
          </div>

          {/* floating proof chip */}
          <div className="absolute -left-6 -top-5 hidden rounded-2xl bg-white px-5 py-3 shadow-lift sm:block">
            <p className="font-display text-2xl font-extrabold text-ink">{BIZ.yearsOpen}</p>
            <p className="text-xs font-semibold text-ink-soft/70">years in Troy</p>
          </div>
          <div className="absolute -bottom-5 -right-4 hidden rounded-2xl bg-white px-5 py-3 shadow-lift sm:block">
            <p className="font-display text-2xl font-extrabold text-ink">{BIZ.studentsTaught}</p>
            <p className="text-xs font-semibold text-ink-soft/70">students taught</p>
          </div>
        </div>
      </Container>
      <BeltStripe className="h-2" />
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-ink/5 bg-paper">
      <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        <Stat value={`${BIZ.rating}★`} label={`${BIZ.reviewCount} Google reviews`} />
        <Stat value={BIZ.instructorCount} label="certified instructors" />
        <Stat value={BIZ.classesPerWeek} label="classes every week" />
        <Stat value="6 days" label="drop-in flexibility" />
      </Container>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          center
          eyebrow="Programs"
          title="A class for every age — and every family"
          sub="From 5-year-olds finding their focus to adults finding their edge, every program follows our Kukkiwon-certified, Olympic-based curriculum."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Link
              key={p.id}
              href={`/programs#${p.id}`}
              className="group rounded-3xl border border-ink/8 bg-white p-7 shadow-lift transition-all duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-pop"
            >
              <span className="text-4xl">{p.emoji}</span>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand">
                {p.ages}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">{p.tagline}</p>
              <p className="mt-4 text-sm font-bold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

const VALUE_DETAILS: Record<string, { emoji: string; copy: string }> = {
  "Self-Confidence": {
    emoji: "🦁",
    copy: "Every belt earned is proof to your child that hard things are worth doing. Parents see the difference at school within weeks.",
  },
  Respect: {
    emoji: "🙇",
    copy: "Bowing in, listening first, lifting up teammates — respect is trained in every single class, not just talked about.",
  },
  Courtesy: {
    emoji: "🤝",
    copy: "Our students learn to lead with kindness. It shows — families from every background call this school home.",
  },
  Integrity: {
    emoji: "🛡️",
    copy: "Doing the right thing when nobody is watching. That's the black-belt standard we hold from day one.",
  },
};

function ValuesSection() {
  return (
    <section className="bg-ink py-20 text-white lg:py-24">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Why families choose Troy</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              More than kicks and punches — life skills that stick
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">{BIZ.mission}</p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm leading-relaxed text-white/80">
                &ldquo;My kids have never slept better since starting.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold">
                — a Troy parent, Google review
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {BIZ.values.map((v) => (
              <div
                key={v}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-gold/40"
              >
                <span className="text-3xl">{VALUE_DETAILS[v].emoji}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-gold">{v}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {VALUE_DETAILS[v].copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Real Google reviews"
            title={`${BIZ.rating} stars. ${BIZ.reviewCount} reviews. One community.`}
            sub="We didn't write these — Troy families did."
          />
          <ButtonLink href="/reviews" variant="secondary" className="shrink-0">
            Read all reviews
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.slice(0, 6).map((r) => (
            <figure
              key={r.name + r.context}
              className="flex flex-col rounded-3xl border border-ink/8 bg-white p-7 shadow-lift"
            >
              <Stars className="h-4 w-4" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-ink/5 pt-4">
                <p className="text-sm font-bold text-ink">{r.name}</p>
                <p className="text-xs text-ink-soft/60">{r.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TrialCTA() {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-dark to-brand-deep px-8 py-16 text-center text-white shadow-pop sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
          />
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold">
            The first kick is the hardest — we make it easy
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            4 weeks. Unlimited classes. Free uniform.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            Try any class that fits your week — no long-term commitment. See why
            648 families rated us {BIZ.rating} stars.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact" variant="gold">
              Claim Your Trial
            </ButtonLink>
            <a
              href={BIZ.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:border-white/70"
            >
              📞 {BIZ.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="border-t border-ink/5 bg-paper pb-20 pt-4 lg:pb-24">
      <Container className="grid items-center gap-10 pt-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Visit the dojang"
            title="Easy to find. Easy to fit into your week."
            sub="Right at the corner of Crooks Rd & South Blvd in the Rite-Aid Plaza — with classes six days a week, there's always a time that works."
          />
          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex gap-3">
              <dt className="font-bold text-ink">📍</dt>
              <dd className="text-ink-soft">
                {BIZ.address}
                <span className="block text-ink-soft/60">{BIZ.addressNote}</span>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="font-bold text-ink">📞</dt>
              <dd>
                <a href={BIZ.phoneHref} className="font-semibold text-brand hover:underline">
                  {BIZ.phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="font-bold text-ink">🕐</dt>
              <dd className="text-ink-soft">
                Classes Monday–Saturday · afternoons, evenings & Saturday mornings
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <ButtonLink href={BIZ.mapsHref} variant="secondary">
              Get Directions ↗
            </ButtonLink>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-ink/10 shadow-lift">
          <iframe
            title="Troy Martial Arts location map"
            src="https://www.google.com/maps?q=1881+South+Blvd+W,+Troy,+MI+48098&output=embed"
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProgramsSection />
      <ValuesSection />
      <ReviewsSection />
      <TrialCTA />
      <LocationSection />
    </>
  );
}
