import { BIZ, FAQS, INSTRUCTORS, PROGRAMS } from "@/lib/data";

/**
 * JSON-LD for search engines.
 *
 * Server-rendered into the static HTML, so crawlers see it without running any
 * JavaScript. Everything here mirrors data already visible on the page —
 * nothing is asserted to Google that a visitor cannot also read.
 */

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Built from our own constants, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** The school itself — address, hours, rating, the trial offer. */
export function LocalBusinessSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "SportsActivityLocation"],
        name: BIZ.name,
        legalName: BIZ.legalName,
        description: BIZ.mission,
        url: BIZ.siteUrl,
        telephone: BIZ.phone,
        foundingDate: String(BIZ.founded),
        address: {
          "@type": "PostalAddress",
          streetAddress: "1881 South Blvd W",
          addressLocality: "Troy",
          addressRegion: "MI",
          postalCode: "48098",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 42.6064,
          longitude: -83.1499,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "22:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(BIZ.rating),
          reviewCount: "500",
          bestRating: "5",
        },
        areaServed: [
          "Troy, MI",
          "Rochester Hills, MI",
          "Auburn Hills, MI",
          "Rochester, MI",
          "Bloomfield, MI",
        ],
        makesOffer: {
          "@type": "Offer",
          name: BIZ.trial.headline,
          description: BIZ.trial.sub,
          price: String(BIZ.trial.price),
          priceCurrency: "USD",
        },
        employee: INSTRUCTORS.map((i) => ({
          "@type": "Person",
          name: i.name,
          jobTitle: i.role ?? "Instructor",
        })),
      }}
    />
  );
}

/** The FAQ page, so answers can surface directly in search results. */
export function FaqSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/** Each program as a course offering. */
export function CoursesSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: PROGRAMS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Course",
            name: `${p.name} — ${p.ages}`,
            description: p.blurb,
            provider: { "@type": "Organization", name: BIZ.name },
          },
        })),
      }}
    />
  );
}

/** Breadcrumb trail for interior pages. */
export function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          item: `${BIZ.siteUrl}${t.path}`,
        })),
      }}
    />
  );
}
