import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('admin-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-admin-theme', t);
    }
  } catch(e) {}
})();
`;

// ─── ONBOARDING GUARD ─────────────────────────────────────────────────────────
//
// Every /admin/* route passes through this layout (middleware already enforces
// authentication). Here we add the onboarding guard: an authenticated user who
// has not yet created a configured business is redirected back to /onboarding.
//
// Guard logic:
//   • Supabase not configured (dev/unconfigured mode) → allow through
//   • LOCALLAYER_BUSINESS_ID env var is set → business is pre-configured, skip check
//   • Not authenticated → allow through (middleware handles the /admin/login redirect)
//   • Authenticated, no complete business found → redirect to /onboarding
//   • Authenticated, complete business found → allow into dashboard
//
// What "complete business" means:
//   A row in the businesses table with is_active=true and onboarding_complete=true.
//   Businesses created via the onboarding flow have this set to true explicitly.
//   All businesses that existed before migration 012 inherit DEFAULT true.

async function getOnboardingGuardResult(): Promise<"allow" | "redirect_onboarding"> {
  // Pre-configured via env var — trust it, skip the DB check.
  if (process.env.LOCALLAYER_BUSINESS_ID) return "allow";

  if (!isSupabaseConfigured()) return "allow";

  const supabase = createSupabaseServerClient();
  if (!supabase) return "allow";

  // Check auth state without triggering a middleware-style redirect.
  // If no user, allow through — the middleware already redirected unauthenticated
  // users from real admin pages to /admin/login.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "allow";

  // Auth'd user — verify they have a configured business.
  const db = createSupabaseAdminClient();
  if (!db) return "allow";

  const { data: biz } = await db
    .from("businesses")
    .select("id")
    .eq("is_active", true)
    .eq("onboarding_complete", true)
    .limit(1)
    .maybeSingle<{ id: string }>();

  return biz ? "allow" : "redirect_onboarding";
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const guard = await getOnboardingGuardResult();
  if (guard === "redirect_onboarding") {
    redirect("/onboarding");
  }

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </>
  );
}
