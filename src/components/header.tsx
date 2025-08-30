
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

const navLinks = [
  { href: "#gallery", label: "Product Gallery" },
  { href: "#features", label: "Why Us" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container flex h-20 items-center">
        <div className="mr-auto hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-12 w-auto" />
            <span className="sr-only">
              Urbangrey
            </span>
          </Link>
        </div>

        <div className="flex md:hidden mr-auto">
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
        <div className="flex md:hidden flex-grow justify-center">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="h-12 w-auto" />
                <span className="sr-only">
                Urbangrey
                </span>
            </Link>
        </div>


        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden md:flex">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#get-a-quote">Get a Quote</Link>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container flex flex-col items-start space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#get-a-quote" onClick={() => setIsMenuOpen(false)}>Get a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
