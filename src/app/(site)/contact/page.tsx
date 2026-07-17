import type { Metadata } from "next";
import { BIZ } from "@/lib/data";
import { TrialForm } from "@/components/site/TrialForm";
import {
  BeltStripe,
  Container,
  Eyebrow,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Start Your 4-Week Trial — Contact Us",
  description:
    "Claim your 4-week Taekwondo trial at Troy Martial Arts: unlimited classes plus a free uniform. Call (248) 828-4360 or request info online.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="py-16 text-center lg:py-20">
          <Eyebrow>🥋 {BIZ.trial.headline} · {BIZ.trial.sub}</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Your first class is closer than you think
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft/80">
            Fill out the form or just call — we&apos;ll match your family to the
            right class and get you on the mat this week.
          </p>
        </Container>
        <BeltStripe />
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-ink/8 bg-white p-8 shadow-lift sm:p-10">
            <h2 className="font-display text-2xl font-bold text-ink">
              Request your trial
            </h2>
            <p className="mt-1 text-sm text-ink-soft/70">
              Takes 30 seconds. We reply within one business day.
            </p>
            <div className="mt-6">
              <TrialForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-ink p-8 text-white">
              <h3 className="font-display text-lg font-bold text-gold">
                Prefer to talk?
              </h3>
              <a
                href={BIZ.phoneHref}
                className="mt-2 block font-display text-3xl font-extrabold hover:text-gold"
              >
                {BIZ.phone}
              </a>
              <p className="mt-2 text-sm text-white/70">
                Ask about the {BIZ.trial.headline.toLowerCase()} — unlimited
                classes and a free uniform included.
              </p>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-8 shadow-lift">
              <h3 className="font-display text-lg font-bold text-ink">Find us</h3>
              <p className="mt-2 text-sm text-ink-soft">
                {BIZ.address}
                <span className="block text-ink-soft/60">{BIZ.addressNote}</span>
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                🕐 Classes Mon–Sat · afternoons, evenings & Saturday mornings
              </p>
              <a
                href={BIZ.mapsHref}
                className="mt-4 inline-block text-sm font-bold text-brand hover:underline"
              >
                Get directions ↗
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-ink/10 shadow-lift">
              <iframe
                title="Troy Martial Arts location map"
                src="https://www.google.com/maps?q=1881+South+Blvd+W,+Troy,+MI+48098&output=embed"
                className="h-[260px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
