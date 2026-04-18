"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin").trim();

  if (!email || !password) {
    redirect(`/admin/login?error=${encodeURIComponent("Email and password are required.")}`);
  }

  const client = createSupabaseServerClient();
  if (!client) {
    redirect(`/admin/login?error=${encodeURIComponent("Auth not configured.")}`);
  }

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  const dest = redirectTo.startsWith("/admin") && !redirectTo.includes("://")
    ? redirectTo
    : "/admin";

  redirect(dest);
}

export async function signOutAction() {
  const client = createSupabaseServerClient();
  if (client) {
    await client.auth.signOut();
  }
  redirect("/admin/login");
}
