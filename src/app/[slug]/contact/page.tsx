import { notFound } from "next/navigation";
import { ContactSection } from "@/components/sections/ContactSection";
import { getBusinessSitePayload } from "@/lib/queries";

type SlugContactPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessContactPage({ params }: SlugContactPageProps) {
  const { slug } = await params;
  const payload = await getBusinessSitePayload(slug);

  if (!payload) {
    notFound();
  }

  return (
    <ContactSection
      brand={payload.brand}
      hours={payload.hours}
      title={payload.homePage.contactTitle}
      subtitle={payload.homePage.contactSubtitle}
    />
  );
}
