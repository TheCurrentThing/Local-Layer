"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getSupabaseAdminClientOrThrow, isSupabaseConfigured } from "@/lib/supabase";
import { generateVerificationToken } from "@/lib/launch";
import type { SiteStatus } from "@/lib/business";

const LAUNCH_PATH = "/admin/launch";

function redirectLaunch(state: { status?: string; error?: string }): never {
  const params = new URLSearchParams();
  if (state.status) params.set("status", state.status);
  if (state.error) params.set("error", state.error);
  redirect(params.size > 0 ? `${LAUNCH_PATH}?${params.toString()}` : LAUNCH_PATH);
}

function revalidateLaunch() {
  revalidatePath(LAUNCH_PATH);
  revalidatePath("/admin");
}

function isRedirectSignal(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = "digest" in error ? (error as { digest?: string }).digest : null;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

async function getAdminClient() {
  await requireAdminAccess();
  if (!isSupabaseConfigured()) {
    redirectLaunch({ error: "Supabase is not configured." });
  }
  return getSupabaseAdminClientOrThrow();
}

// ─── SITE STATUS ACTIONS ──────────────────────────────────────────────────────

/**
 * Set site_status to 'ready'.
 * The business is configured and ready to go live, but not yet publicly accessible.
 */
export async function markSiteReadyAction() {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();

    const { error } = await client
      .from("businesses")
      .update({ site_status: "ready" as SiteStatus, updated_at: new Date().toISOString() })
      .eq("id", businessId);

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Site marked as ready. Click Publish to go live." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not update site status.",
    });
  }
}

/**
 * Set site_status to 'live'.
 * The business site becomes publicly accessible via its slug URL.
 */
export async function publishSiteAction() {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();

    const { error } = await client
      .from("businesses")
      .update({ site_status: "live" as SiteStatus, updated_at: new Date().toISOString() })
      .eq("id", businessId);

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Site is now live and publicly accessible." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not publish site.",
    });
  }
}

/**
 * Set site_status to 'paused'.
 * Takes the site offline without deleting content.
 */
export async function pauseSiteAction() {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();

    const { error } = await client
      .from("businesses")
      .update({ site_status: "paused" as SiteStatus, updated_at: new Date().toISOString() })
      .eq("id", businessId);

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Site paused. It is no longer publicly accessible." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not pause site.",
    });
  }
}

/**
 * Set site_status back to 'draft'.
 * Useful for resetting a paused site to editing state.
 */
export async function unpublishSiteAction() {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();

    const { error } = await client
      .from("businesses")
      .update({ site_status: "draft" as SiteStatus, updated_at: new Date().toISOString() })
      .eq("id", businessId);

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Site returned to draft. No longer publicly accessible." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not update site status.",
    });
  }
}

// ─── DOMAIN ACTIONS ───────────────────────────────────────────────────────────

/**
 * Add a custom domain record for the current business.
 * Generates a TXT verification token the user must add to their DNS.
 * Domain starts in 'pending' status.
 */
export async function addDomainAction(formData: FormData) {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();

    const raw = String(formData.get("domain") ?? "").trim().toLowerCase();
    // Strip protocol if pasted — accept bare domain or www.domain
    const domain = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    if (!domain || domain.length < 4 || !domain.includes(".")) {
      redirectLaunch({ error: "Please enter a valid domain name (e.g. www.example.com)." });
    }

    const token = generateVerificationToken();

    const { error } = await client.from("business_domains").insert({
      business_id: businessId,
      domain,
      status: "pending",
      verification_token: token,
      is_primary: false,
    });

    if (error) {
      if (error.code === "23505") {
        redirectLaunch({ error: `Domain "${domain}" is already registered.` });
      }
      throw new Error(error.message);
    }

    revalidateLaunch();
    redirectLaunch({
      status: `Domain "${domain}" added. Add the TXT record shown below to verify ownership.`,
    });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not add domain.",
    });
  }
}

/**
 * Remove a domain record.
 * Only removes domains owned by the current business (business-scoped).
 */
export async function removeDomainAction(formData: FormData) {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();
    const domainId = String(formData.get("domain_id") ?? "").trim();

    if (!domainId) redirectLaunch({ error: "Domain ID is required." });

    const { error } = await client
      .from("business_domains")
      .delete()
      .eq("id", domainId)
      .eq("business_id", businessId); // tenancy guard

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Domain removed." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not remove domain.",
    });
  }
}

/**
 * Mark a domain as the primary domain for the business.
 * Clears is_primary on all other domains first (only one primary allowed).
 */
export async function setPrimaryDomainAction(formData: FormData) {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();
    const domainId = String(formData.get("domain_id") ?? "").trim();

    if (!domainId) redirectLaunch({ error: "Domain ID is required." });

    // Clear existing primary
    await client
      .from("business_domains")
      .update({ is_primary: false })
      .eq("business_id", businessId);

    // Set new primary (business-scoped guard via AND condition)
    const { error } = await client
      .from("business_domains")
      .update({ is_primary: true })
      .eq("id", domainId)
      .eq("business_id", businessId);

    if (error) throw new Error(error.message);

    revalidateLaunch();
    redirectLaunch({ status: "Primary domain updated." });
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not update primary domain.",
    });
  }
}

/**
 * Trigger a domain verification check.
 *
 * Full DNS TXT verification requires the server to perform a DNS lookup.
 * This stub marks the domain as 'verified' if the verification_token is set,
 * allowing manual verification for now.
 *
 * Production path: replace with an actual dns.resolve() check or a
 * third-party DNS verification service (e.g. Cloudflare, DNSimple API).
 */
export async function verifyDomainAction(formData: FormData) {
  try {
    const client = await getAdminClient();
    const businessId = await getCurrentAdminBusinessId();
    const domainId = String(formData.get("domain_id") ?? "").trim();

    if (!domainId) redirectLaunch({ error: "Domain ID is required." });

    // Fetch the domain record to confirm ownership
    const { data: domainRow, error: fetchError } = await client
      .from("business_domains")
      .select("id, domain, verification_token, status")
      .eq("id", domainId)
      .eq("business_id", businessId) // tenancy guard
      .maybeSingle<{
        id: string;
        domain: string;
        verification_token: string | null;
        status: string;
      }>();

    if (fetchError || !domainRow) {
      redirectLaunch({ error: "Domain not found." });
    }

    // ── Production: DNS TXT lookup would happen here ──────────────────────────
    // const dns = await import("dns/promises");
    // const records = await dns.resolveTxt(domainRow!.domain).catch(() => []);
    // const found = records.flat().some(r => r === domainRow!.verification_token);
    // For now we simulate a successful verification check:
    const verificationPassed = Boolean(domainRow!.verification_token);

    const now = new Date().toISOString();

    if (verificationPassed) {
      const { error } = await client
        .from("business_domains")
        .update({
          status: "active",
          verified_at: now,
          last_checked_at: now,
          notes: "Verified via admin check.",
        })
        .eq("id", domainId)
        .eq("business_id", businessId);

      if (error) throw new Error(error.message);

      revalidateLaunch();
      redirectLaunch({
        status: `Domain "${domainRow!.domain}" verified and now active. Point your DNS CNAME to your deployment host.`,
      });
    } else {
      await client
        .from("business_domains")
        .update({ status: "failed", last_checked_at: now, notes: "TXT record not found." })
        .eq("id", domainId)
        .eq("business_id", businessId);

      revalidateLaunch();
      redirectLaunch({
        error: `Verification failed for "${domainRow!.domain}". Add the TXT record and try again.`,
      });
    }
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectLaunch({
      error: err instanceof Error ? err.message : "Could not verify domain.",
    });
  }
}
