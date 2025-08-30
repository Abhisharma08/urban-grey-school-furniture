import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section id="contact">
      <div className="bg-gradient-to-r from-accent to-orange-400">
        <div className="container py-24 text-center text-accent-foreground">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
           Ready to Shape Your Space?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-accent-foreground/80 md:text-xl">
            Download our latest catalogue to explore our full range of restaurant furniture — and get a personalized quote tailored for your project.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
              <Link href="#get-a-quote">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
