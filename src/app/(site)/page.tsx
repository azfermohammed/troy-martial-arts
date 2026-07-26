import Link from "next/link";
import Image from "next/image";
import { BIZ, CLASS_SESSIONS, INSTRUCTORS, PROGRAMS, REVIEWS } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
  Stars,
  Stat,
} from "@/components/ui";
import { asset } from "@/lib/assetPath";
import { CountUp, Reveal } from "@/components/site/Reveal";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <Container className="relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="animate-rise">
          <Eyebrow>Kukkiwon-Certified Taekwondo · Troy, MI</Eyebrow>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Taekwondo &amp; Self Defense
            <br />
            in Troy, Michigan
            <br />
            <span className="text-brand">Since 1980.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft/80">
            {BIZ.yearsOpen} years on the corner of Crooks &amp; South Blvd,{" "}
            {BIZ.studentsTaught} students instructed, and {BIZ.instructorCount}{" "}
            certified instructors with {BIZ.combinedExperience} of combined
            experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact">
              Start the {BIZ.trial.priceLabel} 4-Week Trial →
            </ButtonLink>
            <ButtonLink href="/schedule" variant="secondary">
              See Class Schedule
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <Stars className="h-5 w-5" />
              <p className="text-sm font-semibold text-ink">
                {BIZ.rating} from {BIZ.reviewCount} Google reviews
              </p>
            </div>
            <Image
              src={asset("/img/team-usa.jpg")}
              alt="Team USA affiliation"
              width={494}
              height={69}
              className="h-6 w-auto opacity-80"
            />
          </div>
        </div>

        {/* Real class photography, with the offer priced honestly on top */}
        <div className="relative animate-rise" style={{ animationDelay: "0.15s" }}>
          <div className="overflow-hidden rounded-3xl border border-ink/10 shadow-lift">
            <Image
              src={asset("/img/class-2.jpg")}
              alt="Young students sparring in protective gear at Troy Martial Arts"
              width={1024}
              height={683}
              priority
              className="h-[380px] w-full object-cover sm:h-[440px]"
            />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-brand p-5 text-white shadow-pop sm:left-8 sm:right-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold leading-none">
                {BIZ.trial.priceLabel}
              </span>
              <span className="font-display text-lg font-bold">
                / {BIZ.trial.headline}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white/90">{BIZ.trial.sub}</p>
          </div>
        </div>
      </Container>
      <BeltStripe className="mt-10 h-2" />
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-ink/5 bg-paper">
      <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        <Stat value={`${BIZ.rating}★`} label={`${BIZ.reviewCount} Google reviews`} />
        <Stat
          value={<CountUp value={12} suffix="+" />}
          label="certified instructors"
        />
        <Stat
          value={<CountUp value={CLASS_SESSIONS.length} />}
          label="classes every week"
        />
        <Stat
          value={<CountUp value={7000} suffix="+" />}
          label="students taught"
        />
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
          sub="Kids, teens, adults and whole families train on a Kukkiwon-certified, Olympic-based curriculum, six days a week."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
            <Link
              href={`/programs#${p.id}`}
              className="group block h-full overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-lift transition-all duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-pop"
            >
              <Image
                src={asset(p.image)}
                alt={`${p.name} — ${p.ages}`}
                width={800}
                height={500}
                className="h-44 w-full object-cover"
              />
              <div className="p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-brand">
                  {p.ages}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/75">
                  {p.tagline}
                </p>
                {p.classesPerWeek && (
                  <p className="mt-3 text-xs font-semibold text-ink-soft/60">
                    {p.classesPerWeek}
                  </p>
                )}
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-ink py-20 text-white lg:py-24">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Why choose Troy Martial Arts</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {BIZ.motto}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">{BIZ.mission}</p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                The five tenets of Taekwondo
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {BIZ.tenets.join(" · ")}
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {BIZ.whyChooseUs.map((reason) => (
              <li
                key={reason}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-semibold leading-relaxed text-white/85 transition-colors hover:border-gold/40"
              >
                {reason}
              </li>
            ))}
            <li className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-semibold leading-relaxed text-white/85 sm:col-span-2">
              {BIZ.serviceArea}
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

function InstructorsSection() {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          center
          eyebrow="Our instructors"
          title={`${BIZ.instructorCount} certified instructors, ${BIZ.combinedExperience} combined`}
          sub="Engineers, teachers, a surgeon and multi-time state champions — every one of them Kukkiwon and USAT ranked."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INSTRUCTORS.map((i, idx) => (
            <Reveal key={i.name} delay={(idx % 3) * 90}>
            <div
              className="h-full rounded-2xl border border-ink/8 bg-white p-6 shadow-lift transition-transform duration-200 hover:-translate-y-1"
            >
              <h3 className="font-display text-base font-bold text-ink">{i.name}</h3>
              {i.role && (
                <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-brand">
                  {i.role}
                </p>
              )}
              <p className="mt-1 text-xs font-semibold text-ink-soft/70">{i.rank}</p>
              <ul className="mt-3 space-y-1">
                {i.credentials.map((c) => (
                  <li key={c} className="text-xs leading-relaxed text-ink-soft/70">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-soft/60">
          Every instructor is also a Team USA Certified Associate Coach and Safesport
          Instructor, Red Cross certified in First Aid/AED/CPR, and has passed a
          national background check.
        </p>
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
            eyebrow="Google reviews"
            title={`${BIZ.rating} stars from ${BIZ.reviewCount} reviews`}
            sub="What Troy families say about training here."
          />
          <ButtonLink href="/reviews" variant="secondary" className="shrink-0">
            Read all reviews
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.slice(0, 6).map((r, i) => (
            <Reveal key={r.name + r.context} delay={(i % 3) * 90}>
            <figure
              className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-7 shadow-lift"
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
            </Reveal>
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
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-dark to-brand-deep px-8 py-14 text-white shadow-pop sm:px-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-gold">
                Special offer
              </p>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {BIZ.trial.priceLabel} — 4 weeks of unlimited classes,
                <br className="hidden sm:block" /> plus a free full uniform.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/85">{BIZ.tagline}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="/contact" variant="gold">
                  Claim the {BIZ.trial.priceLabel} Trial
                </ButtonLink>
                <a
                  href={BIZ.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-bold text-white transition-colors hover:border-white/70"
                >
                  Call {BIZ.phone}
                </a>
              </div>
            </div>

            <ul className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-6">
              {BIZ.trial.terms.map((term) => (
                <li key={term} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
                    ✓
                  </span>
                  {term}
                </li>
              ))}
            </ul>
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
            sub={`At the corner of Crooks Rd & South Blvd in the Rite-Aid Plaza, open ${BIZ.daysPerWeek}.`}
          />
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-soft/60">
                Address
              </dt>
              <dd className="mt-1 text-ink-soft">
                {BIZ.address}
                <span className="block text-ink-soft/60">{BIZ.addressNote}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-soft/60">
                Phone
              </dt>
              <dd className="mt-1">
                <a href={BIZ.phoneHref} className="font-semibold text-brand hover:underline">
                  {BIZ.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-soft/60">
                Hours
              </dt>
              <dd className="mt-1 text-ink-soft">{BIZ.hours}</dd>
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
      <WhySection />
      <InstructorsSection />
      <ReviewsSection />
      <TrialCTA />
      <LocationSection />
    </>
  );
}
