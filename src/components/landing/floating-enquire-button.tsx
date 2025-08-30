
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function FloatingEnquireButton() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const galleryElement = document.getElementById("gallery");

    if (!galleryElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the button if the gallery section is intersecting or has been scrolled past.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: "0px", 
        threshold: 0, 
      }
    );

    observer.observe(galleryElement);

    return () => {
      if (galleryElement) {
        observer.unobserve(galleryElement);
      }
    };
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-t border-border transition-transform duration-300 ease-in-out md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Button
        asChild
        size="lg"
        className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse"
      >
        <Link href="#get-a-quote">Enquire Now</Link>
      </Button>
    </div>
  );
}
