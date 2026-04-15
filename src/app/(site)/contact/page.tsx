import { ContactSection } from "@/components/sections/ContactSection";
import { getSitePayload } from "@/lib/queries";

export default async function ContactPage() {
  const payload = await getSitePayload();

  return (
    <ContactSection
      brand={payload.brand}
      hours={payload.hours}
      features={payload.features}
    />
  );
}
