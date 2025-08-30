
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");

  useEffect(() => {
    // If the 'success' param is not 'true', redirect to the homepage.
    if (successParam !== "true") {
      router.replace("/");
    }
  }, [successParam, router]);

  // While we're checking, show a loading state. Or if redirecting, this will be brief.
  if (successParam !== "true") {
    return <ThankYouSkeleton />;
  }

  // If the param is correct, show the thank you message.
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="gtag-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('event', 'conversion', {
                'send_to': 'GTM-MB4NDVM6/UFulCNPTqNgaEIfEjYRA',
                'value': 1.0,
                'currency': 'INR'
            });
          `,
        }}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container text-center py-20">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Thank You!
            </h1>
            <p className="mt-6 text-lg text-foreground/80 md:text-xl">
              Your quote request has been successfully submitted. Our team will
              review your requirements and get back to you shortly...
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ThankYouSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <div className="container text-center py-20">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                        <Skeleton className="h-12 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-full mx-auto" />
                        <Skeleton className="h-6 w-2/3 mx-auto" />
                        <Skeleton className="h-12 w-40 mx-auto" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouSkeleton />}>
      <ThankYouContent />
    </Suspense>
  );
}
