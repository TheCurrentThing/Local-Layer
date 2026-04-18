import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Local Layer — Your business. Live. Under control.",
  description: "Update your menu, specials, hours, and branding in real time — without rebuilding your website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
