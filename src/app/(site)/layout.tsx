import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/Reveal";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Scroll-revealed content starts hidden, so make it visible when JS
          is unavailable — otherwise most of the page never appears. */}
      <noscript>
        <style>{`.reveal,.stagger-item{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
