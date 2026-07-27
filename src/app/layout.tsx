import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { BIZ } from "@/lib/data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Troy Martial Arts | Taekwondo in Troy, MI — Since 1980",
    template: "%s | Troy Martial Arts",
  },
  description:
    "Family-owned Kukkiwon-certified Taekwondo school in Troy, Michigan since 1980. Kids, teens, adults & family classes 6 days a week. 4.9★ from 500+ Google reviews. Start your $29 4-week trial today.",
  metadataBase: new URL(BIZ.siteUrl),
  alternates: { canonical: "/" },
  applicationName: BIZ.name,
  authors: [{ name: BIZ.name, url: BIZ.siteUrl }],
  creator: BIZ.name,
  publisher: BIZ.legalName,
  category: "Sports & Recreation",
  keywords: [
    "Taekwondo Troy MI",
    "martial arts Troy Michigan",
    "kids martial arts",
    "taekwondo classes near me",
    "Troy Martial Arts",
    "Kukkiwon Taekwondo Michigan",
    "self defense classes Troy",
    "family martial arts Rochester Hills",
    "summer camp Troy MI",
    "adult taekwondo Auburn Hills",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Troy Martial Arts — Taekwondo in Troy, MI Since 1980",
    description:
      "Confidence, discipline & fun for ages 5 to adult. Unlimited classes, flexible schedule, 4.9★ rated. Try 4 weeks for $29 with a free uniform.",
    type: "website",
    locale: "en_US",
    siteName: BIZ.name,
    url: BIZ.siteUrl,
    images: [
      {
        url: "/img/class-2.jpg",
        width: 1024,
        height: 683,
        alt: "Students sparring at Troy Martial Arts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Troy Martial Arts — Taekwondo in Troy, MI Since 1980",
    description:
      "Kukkiwon-certified Taekwondo for ages 5 to adult. 4 weeks for $29 with a free uniform.",
    images: ["/img/class-2.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
