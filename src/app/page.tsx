import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import KitSelector from "@/components/landing/KitSelector";
import LocalDirectory from "@/components/landing/LocalDirectory";
import HowItWorks from "@/components/landing/HowItWorks";
import DistributionLayer from "@/components/landing/DistributionLayer";
import LiveControlPreview from "@/components/landing/LiveControlPreview";
import WhyLocalLayer from "@/components/landing/WhyBranchkit";
import FeaturePillars from "@/components/landing/FeaturePillars";
import Pricing from "@/components/landing/Pricing";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Local Layer — Your business. Live. Under control.",
  description:
    "Update your menu, specials, hours, and branding in real time — without rebuilding your website.",
};

export default async function LandingPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Hero />
        <KitSelector />
        <LocalDirectory />
        <HowItWorks />
        <DistributionLayer />
        <LiveControlPreview />
        <WhyLocalLayer />
        <FeaturePillars />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
