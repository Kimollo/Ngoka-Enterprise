import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Source_Sans_3 } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ngoka Enterprise — Fresh Eggs, Poultry & Groceries",
  description:
    "Fresh eggs, chicken, and daily groceries in Semorishi, Limpopo. Ngoka Enterprise has been open since 2009. Call or WhatsApp to order. We deliver to neighbouring villages.",
};

export const viewport: Viewport = {
  themeColor: "#F6F0E6",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: metadata.description,
  url: site.mapsUrl,
  telephone: site.phones.call.e164,
  currenciesAccepted: "ZAR",
  paymentAccepted: "Cash, Credit Card, Instant EFT",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Semorishi",
    addressLocality: "Ga-Seema",
    addressRegion: "Limpopo",
    postalCode: site.postalCode,
    addressCountry: "ZA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.coordinates.lat,
    longitude: site.coordinates.lng,
  },
  openingHoursSpecification: site.hours.map((row) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: row.day,
    opens: row.opens,
    closes: row.closes,
  })),
  areaServed: "Neighbouring villages around Semorishi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
