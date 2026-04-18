import { notFound } from "next/navigation";
import { AboutSection } from "@/components/sections/AboutSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { getBusinessSitePayload } from "@/lib/queries";

type SlugAboutPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessAboutPage({ params }: SlugAboutPageProps) {
  const { slug } = await params;
  const payload = await getBusinessSitePayload(slug);

  if (!payload) {
    notFound();
  }

  return (
    <>
      <AboutSection about={payload.aboutPage} />
      {payload.features.showGallery ? (
        <GallerySection images={payload.galleryImages} />
      ) : null}
    </>
  );
}
