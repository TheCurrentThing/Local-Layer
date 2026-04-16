import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let path: string;
  try {
    const body = await request.json();
    path = typeof body.path === "string" ? body.path.slice(0, 500) : "/";
  } catch {
    path = "/";
  }

  const referrer = request.headers.get("referer");
  const client = createSupabaseAdminClient();

  if (!client) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  await client.from("page_views").insert({
    path,
    referrer: referrer ? referrer.slice(0, 500) : null,
  });

  return NextResponse.json({ ok: true });
}
