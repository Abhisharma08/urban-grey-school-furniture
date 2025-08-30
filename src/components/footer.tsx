import Link from "next/link";
import { Logo } from "@/components/icons";

export function Footer() {
  return (
    <footer id="footer-section" className="border-t border-border bg-card pb-28 md:pb-0">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Link href="/" className="mb-4 sm:mb-0">
            <Logo className="h-10 w-auto" />
            <span className="sr-only">Urbangrey</span>
          </Link>
          <p className="text-sm text-foreground/60">
            &copy; 2025 UrbanGrey, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
