import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./OnboardingFlow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Get Started — Local Layer",
};

export default async function OnboardingPage() {
  // Already signed in → send to admin dashboard
  const client = createSupabaseServerClient();
  if (client) {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user) redirect("/admin");
  }

  return <OnboardingFlow />;
}
