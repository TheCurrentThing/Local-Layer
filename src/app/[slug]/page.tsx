import { notFound } from "next/navigation";
import { SiteRenderer } from "@/renderers/SiteRenderer";
import { getBusinessSitePayload } from "@/lib/queries";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessHomePage({ params }: SlugPageProps) {
  const { slug } = await params;
  const payload = await getBusinessSitePayload(slug);

  if (!payload) {
    notFound();
  }

  return <SiteRenderer payload={payload} basePath={`/${slug}`} />;
}
