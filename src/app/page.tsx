import { Header } from "@/components/header";
import { Hero } from "@/components/landing/hero";
import { ConferenceSolutions } from "@/components/landing/ConferenceSolutions"
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/landing/gallery";
import { FloatingEnquireButton } from "@/components/landing/floating-enquire-button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Gallery />
         {/* <ConferenceSolutions/>*/}
        <WhyChooseUs />
        <CTA />
      </main>
      <FloatingEnquireButton />
      <Footer />
    </div>
  );
}
