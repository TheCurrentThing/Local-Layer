import type { Metadata } from "next";
import "@/app/globals.css";
import { buildBrandCssVariables } from "@/lib/brand";
import { getSitePayload } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getSitePayload();

  return {
    title: `${payload.brand.businessName} | Local Restaurant Website System`,
    description: payload.brand.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getSitePayload();

  return (
    <html lang="en">
      <body style={buildBrandCssVariables(payload.brand)}>{children}</body>
    </html>
  );
}
