import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── DOMAIN RESOLVER (edge-safe, no server-only imports) ─────────────────────

/**
 * Look up a business slug by custom domain via Supabase REST.
 * Only resolves 'active' domain records belonging to 'live' businesses.
 * Edge-safe: no server-only imports.
 */
async function resolveSlugFromCustomDomain(host: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data } = await client
      .from("business_domains")
      .select("businesses!inner(slug, is_active, site_status)")
      .eq("domain", host)
      .eq("status", "active")
      .maybeSingle<{ businesses: { slug: string; is_active: boolean; site_status: string } }>();

    const biz = data?.businesses;
    if (!biz || !biz.is_active || biz.site_status !== "live") return null;
    return biz.slug;
  } catch {
    return null;
  }
}

// ─── HOST CLASSIFICATION ──────────────────────────────────────────────────────

/**
 * Returns the root hostname of the platform (without protocol or path).
 * e.g. NEXT_PUBLIC_APP_URL="https://locallayer.com" → "locallayer.com"
 */
function getPlatformHostname(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return null;
  try {
    return new URL(appUrl.startsWith("http") ? appUrl : `https://${appUrl}`).hostname;
  } catch {
    return null;
  }
}

/**
 * Returns true if the host is the LocalLayer platform root (not a tenant domain).
 * Custom-domain and subdomain requests return false.
 */
function isPlatformRoot(host: string, platformHostname: string | null): boolean {
  if (!host) return true;
  if (host.startsWith("localhost") || host.startsWith("127.") || host.startsWith("[::1]")) {
    return true;
  }
  if (host.includes(".vercel.app")) return true;
  if (platformHostname && host === platformHostname) return true;
  return false;
}

/**
 * If host is a tenant subdomain of the platform (e.g. "my-bistro.locallayer.com"),
 * returns the slug part ("my-bistro"). Returns null for non-subdomain hosts.
 *
 * Subdomains resolve without a DB lookup — they're derived directly from the host header.
 * This keeps subdomain routing fast and always-on without a business_domains record.
 */
function extractSubdomainSlug(host: string, platformHostname: string | null): string | null {
  if (!platformHostname) return null;
  const suffix = `.${platformHostname}`;
  if (!host.endsWith(suffix)) return null;
  const slug = host.slice(0, -suffix.length);
  // Guard against nested subdomains (e.g. "a.b.locallayer.com") — only allow single level.
  if (!slug || slug.includes(".")) return null;
  return slug;
}

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  const platformHostname = getPlatformHostname();

  const isPublicPath =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/favicon");

  // ── SUBDOMAIN ROUTING: {slug}.locallayer.com → /[slug]/ ───────────────────
  // No DB lookup — subdomain IS the slug. Fast, always-on.
  // Must check before isPlatformRoot because subdomains return false from isPlatformRoot.
  if (isPublicPath && !isPlatformRoot(host, platformHostname)) {
    const subdomainSlug = extractSubdomainSlug(host, platformHostname);
    if (subdomainSlug) {
      const rewritten = request.nextUrl.clone();
      rewritten.pathname = pathname === "/" ? `/${subdomainSlug}` : `/${subdomainSlug}${pathname}`;
      return NextResponse.rewrite(rewritten);
    }

    // ── CUSTOM DOMAIN ROUTING: custom-domain.com → /[slug]/ ──────────────────
    // DB lookup in business_domains. Only runs for non-platform, non-subdomain hosts.
    const slug = await resolveSlugFromCustomDomain(host);
    if (slug) {
      const rewritten = request.nextUrl.clone();
      rewritten.pathname = pathname === "/" ? `/${slug}` : `/${slug}${pathname}`;
      return NextResponse.rewrite(rewritten);
    }

    // Unknown external domain — 404.
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // ── ADMIN AUTH: protect /admin/* routes ───────────────────────────────────
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase not configured — allow through (dev/unconfigured mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session token if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
