import type { BrandConfig, BusinessHour } from "@/types/site";

export function LocalBusinessJsonLd({
  brand,
  hours,
}: {
  brand: BrandConfig;
  hours: BusinessHour[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand.businessName,
    telephone: brand.phone,
    email: brand.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.addressLine1,
      addressLocality: brand.city,
      addressRegion: brand.state,
      postalCode: brand.zip,
      addressCountry: "US",
    },
    description: brand.tagline,
    openingHours: hours.map((entry) => `${entry.dayLabel}: ${entry.openText}`),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
