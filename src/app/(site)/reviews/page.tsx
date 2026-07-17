import type { Metadata } from "next";
import { BIZ, REVIEWS } from "@/lib/data";
import {
  BeltStripe,
  ButtonLink,
  Container,
  SectionHeading,
  Stars,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Reviews — 4.9★ from 648 Troy Families",
  description:
    "Read real Google reviews from Troy Martial Arts families. 4.9 stars across 648 reviews for kids, teens, adult and family Taekwondo classes.",
};

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 text-center lg:py-20">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="flex items-center gap-4 rounded-3xl bg-white px-8 py-5 shadow-lift">
              <p className="font-display text-6xl font-extrabold text-ink">{BIZ.rating}</p>
              <div className="text-left">
                <Stars className="h-6 w-6" />
                <p className="mt-1 text-sm font-semibold text-ink-soft">
                  {BIZ.reviewCount} Google reviews
                </p>
              </div>
            </div>
          </div>
          <SectionHeading
            center
            title="Troy families said it better than we ever could"
            sub="Every quote below is from a public Google review of Troy Martial Arts."
          />
        </Container>
        <BeltStripe />
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>figure]:mb-6 [&>figure]:break-inside-avoid">
            {REVIEWS.map((r) => (
              <figure
                key={r.name + r.context}
                className="rounded-3xl border border-ink/8 bg-white p-7 shadow-lift"
              >
                <Stars className="h-4 w-4" />
                <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-ink/5 pt-4">
                  <p className="text-sm font-bold text-ink">{r.name}</p>
                  <p className="text-xs text-ink-soft/60">{r.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-ink p-10 text-center text-white">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to write your own review?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Start with the {BIZ.trial.headline.toLowerCase()} — unlimited
              classes and a free uniform — and see what {BIZ.reviewCount}{" "}
              families are talking about.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/contact" variant="gold">
                Start Free Trial
              </ButtonLink>
              <ButtonLink href={BIZ.mapsHref} variant="ghost" className="text-white hover:bg-white/10">
                See all reviews on Google ↗
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
