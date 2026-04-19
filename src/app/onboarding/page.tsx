import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./OnboardingFlow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Get Started — Local Layer",
};

// ─── ONBOARDING ENTRY LOGIC ───────────────────────────────────────────────────
//
// Three possible states when a user hits /onboarding:
//
//   1. Not authenticated → show the full 4-step flow (step 1 = create account)
//
//   2. Authenticated + has a complete business → redirect to /admin.
//      This covers users who have already finished onboarding and accidentally
//      navigated back to this URL.
//
//   3. Authenticated + NO complete business → show onboarding starting at step 2
//      (Identity). This covers users who completed account creation (step 1) but
//      abandoned before finishing the kit selection and site generation steps.
//      They don't need to create an account again — just pick up where they left off.

export default async function OnboardingPage() {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Authenticated — check whether they already have a configured business.
        const db = createSupabaseAdminClient();
        const envId = process.env.LOCALLAYER_BUSINESS_ID;
        let hasBusiness = false;
        if (db) {
          const baseQuery = db
            .from("businesses")
            .select("id")
            .eq("is_active", true)
            .eq("onboarding_complete", true)
            .limit(1);
          const { data } = await (envId
            ? baseQuery.eq("id", envId)
            : baseQuery
          ).maybeSingle<{ id: string }>();
          hasBusiness = data !== null;
        }

        if (hasBusiness) {
          // Fully configured — send to dashboard.
          redirect("/admin");
        }

        // Auth'd but no business yet — resume at the Identity step.
        // Step 1 (account creation) is already done so we skip it.
        return <OnboardingFlow initialStep={2} />;
      }
    }
  }

  // Not authenticated — start from the beginning.
  return <OnboardingFlow initialStep={1} />;
}
