import "server-only";

export async function requireAdminAccess() {
  return {
    mode: "placeholder" as const,
    message:
      "Admin auth is not fully implemented yet. Replace this placeholder with a Supabase session check before production launch.",
  };
}
