import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
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
    "Family-owned Kukkiwon-certified Taekwondo school in Troy, Michigan since 1980. Kids, teens, adults & family classes 6 days a week. 4.9★ from 648 Google reviews. Start your 4-week trial today.",
  keywords: [
    "Taekwondo Troy MI",
    "martial arts Troy Michigan",
    "kids martial arts",
    "taekwondo classes near me",
    "Troy Martial Arts",
  ],
  openGraph: {
    title: "Troy Martial Arts — Taekwondo in Troy, MI Since 1980",
    description:
      "Confidence, discipline & fun for ages 5 to adult. Unlimited classes, flexible schedule, 4.9★ rated. Try 4 weeks with a free uniform.",
    type: "website",
    locale: "en_US",
  },
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
