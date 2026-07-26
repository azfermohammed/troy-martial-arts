import type { Metadata } from "next";
import { BIZ, FAQS, type Faq } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ — Classes, Belt Promotions, Sparring & Tournaments",
  description:
    "Common questions about Troy Martial Arts: how many classes a week, how belt promotions work, sparring gear, tournaments, and watching class from home.",
};

const TOPIC_ORDER: Faq["topic"][] = [
  "Classes",
  "Belts & testing",
  "Sparring",
  "Events",
  "Parents",
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 text-center lg:py-20">
          <SectionHeading
            center
            eyebrow="Questions"
            title="Frequently asked questions"
            sub="The things families ask us most. If your question isn't here, call the front desk — we're happy to talk it through."
          />
        </Container>
        <BeltStripe />
      </section>

      <section className="py-14 lg:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {TOPIC_ORDER.map((topic) => {
              const items = FAQS.filter((f) => f.topic === topic);
              if (items.length === 0) return null;
              return (
                <div key={topic}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-brand">
                    {topic}
                  </h2>
                  <dl className="mt-4 space-y-4">
                    {items.map((f) => (
                      <div
                        key={f.q}
                        className="rounded-2xl border border-ink/8 bg-white p-6 shadow-lift"
                      >
                        <dt className="font-display text-lg font-bold text-ink">
                          {f.q}
                        </dt>
                        <dd className="mt-2 leading-relaxed text-ink-soft/85">
                          {f.a}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>

          <div className="mt-14 rounded-3xl bg-ink p-10 text-center text-white">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Still have a question?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Call the front desk and we&apos;ll answer it properly — or start the{" "}
              {BIZ.trial.priceLabel} {BIZ.trial.headline.toLowerCase()} and see the
              school for yourself.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href={BIZ.phoneHref} variant="gold">
                Call {BIZ.phone}
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Request info online
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
