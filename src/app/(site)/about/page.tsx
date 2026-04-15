import { AboutSection } from "@/components/sections/AboutSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { getSitePayload } from "@/lib/queries";

export default async function AboutPage() {
  const payload = await getSitePayload();

  return (
    <>
      <AboutSection about={payload.aboutPage} />
      {payload.features.showGallery ? (
        <GallerySection images={payload.galleryImages} />
      ) : null}
    </>
  );
}
