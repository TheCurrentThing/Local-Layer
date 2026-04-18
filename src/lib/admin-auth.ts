import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase-server";

export async function requireAdminAccess() {
  const client = createSupabaseServerClient();

  // Supabase not configured — dev/unconfigured mode, allow through
  if (!client) {
    return { mode: "dev" as const };
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return { mode: "auth" as const, userId: user.id };
}

export async function getAdminUser() {
  const client = createSupabaseServerClient();
  if (!client) return null;
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}
