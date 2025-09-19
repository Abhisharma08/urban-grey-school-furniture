import { QuoteForm } from "./quote-form";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <Image
        src="https://res.cloudinary.com/dtc8bbbco/image/upload/v1758261167/WhatsApp_Image_2025-09-19_at_11.16.32_AM_1_mwhopz.jpg"
        alt="Office furniture"
        fill
        className="object-cover"
        priority
      />
      <div className="container relative z-20 py-24 lg:py-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
              <span className="text-accent">School Furniture </span> for Every Classroom
            </h1>
            <p className="max-w-xl text-lg text-white lg:mx-0 mx-auto md:text-xl">
               At Urban Grey, we design school furniture that goes beyond function — building spaces where students learn, focus, and grow. From primary classrooms and libraries to labs and common areas, our collections balance comfort, durability, and learning-friendly design.



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
