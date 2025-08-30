import type {Metadata} from 'next';
import { Analytics } from "@vercel/analytics/next"
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'Buy Conference Chairs Online – Executive & Ergonomic Seating | Urban Grey',
  description: 'Explore premium conference chairs at Urban Grey. Discover ergonomic, executive, and mesh seating crafted for boardrooms and meeting rooms. Stylish design, lasting comfort, and fast delivery across India.',
  keywords: 'workspace Products, urban grey furniture, office solutions, commercial furniture, workspace solutions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-17188479495"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GTM-MB4NDVM6');
            `,
          }}
        />
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
