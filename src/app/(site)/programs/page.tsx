import type { Metadata } from "next";
import Image from "next/image";
import { BIZ, PROGRAMS } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  Eyebrow,
  SectionHeading,
} from "@/components/ui";
import { asset } from "@/lib/assetPath";

export const metadata: Metadata = {
  title: "Programs — Kids, Teens, Adults & Family Taekwondo",
  description:
    "Kukkiwon-certified Taekwondo programs in Troy, MI for ages 5 to adult: Kids 5–10, Kids 11–15, Adults, Family Classes, Competition Teams, and Summer Camp.",
};

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 lg:py-20">
          <SectionHeading
            center
            eyebrow="Programs"
            title="Find your family's fit"
            sub={`Every program runs on the same ${BIZ.yearsOpen}-year-proven curriculum — Olympic-based, Kukkiwon-certified, and taught by ${BIZ.instructorCount} professional instructors.`}
          />
        </Container>
        <BeltStripe />
      </section>

      <section className="py-16 lg:py-20">
        <Container className="space-y-16">
          {PROGRAMS.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              className={`grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <Eyebrow>{p.ages}</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold text-ink">{p.name}</h2>
                <p className="mt-2 text-lg font-semibold text-brand">{p.tagline}</p>
                <p className="mt-4 leading-relaxed text-ink-soft/80">{p.blurb}</p>
                <ul className="mt-6 space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/contact">
                    Start the {BIZ.trial.priceLabel} Trial
                  </ButtonLink>
                  <ButtonLink href="/schedule" variant="ghost">
                    View times →
                  </ButtonLink>
                </div>
              </div>
              <div className="overflow-hidden rounded-[2.5rem] border border-ink/10 shadow-lift">
                <Image
                  src={asset(p.image)}
                  alt={`${p.name} — ${p.ages} at Troy Martial Arts`}
                  width={1024}
                  height={683}
                  className="h-64 w-full object-cover lg:h-80"
                />
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-cream py-16">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Not sure which program fits?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft/80">
            Call us — we&apos;ll recommend the right class for your family and set up
            your first visit in about two minutes.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href={BIZ.phoneHref}>Call {BIZ.phone}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Request Info Online
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
