import { QuoteForm } from "./quote-form";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <Image
        src="https://res.cloudinary.com/ddqqlfsjp/image/upload/v1753781894/Cover_vj7fil.jpg"
        alt="Office furniture"
        fill
        className="object-cover"
        priority
      />
      <div className="container relative z-20 py-24 lg:py-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
              <span className="text-accent">Restaurant Furniture</span> Restaurant Furniture That Balances Style & Durability
            </h1>
            <p className="max-w-xl text-lg text-white lg:mx-0 mx-auto md:text-xl">
               At Urban Grey, we create restaurant furniture that defines ambience while withstanding everyday use. From fine-dining elegance to casual setups, our furniture delivers a blend of durability, design, and comfort that keeps guests coming back.

            </p>
          </div>
          <div>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
