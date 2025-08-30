import Image from "next/image";
import { Briefcase, RockingChair, Tv, Lightbulb, Truck } from "lucide-react";

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-accent" />,
    title: "Executive Conference Tables",
    desc: "Sleek, spacious designs with power integration and cable management.",
  },
  {
    icon: <RockingChair className="h-8 w-8 text-accent" />,
    title: "Ergonomic Seating",
    desc: "Premium comfort for long discussions — available in mesh, leather, and fabric.",
  },
  {
    icon: <Tv className="h-8 w-8 text-accent" />,
    title: "Custom Storage & AV Units",
    desc: "Credenzas, consoles, and media walls tailored to your room and requirements.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-accent" />,
    title: "Acoustic Paneling & Lighting Concepts",
    desc: "Designed for focus, privacy, and professional ambience in every meeting.",
  },
  {
    icon: <Truck className="h-8 w-8 text-accent" />,
    title: "Pan-India Delivery & Expert Installation",
    desc: "Reliable execution and expert service across the country.",
  },
];

export function ConferenceSolutions() {
  return (
    <section className="py-20 bg-background text-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
        
        {/* Image Section */}
        <div>
          <Image
            src="https://res.cloudinary.com/ddqqlfsjp/image/upload/v1753783422/WhatsApp_Image_2025-07-29_at_12.21.44_PM_aqwlhd.jpg" // Replace with your actual image
            alt="Conference Room"
            width={600}
            height={600}
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Content Section */}
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-8">
            Shape Conversations with Comfort and Clarity
          </h2>

          <div className="space-y-8">
            {features.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
