"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminNavItem } from "@/types/admin";

export function AdminSidebar({
  brandName,
  items,
  persistenceEnabled,
}: {
  brandName: string;
  items: AdminNavItem[];
  persistenceEnabled: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="space-y-4">
      <Card className="bg-white/88">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Restaurant Website Manager
          </p>
          <h2 className="mt-2 font-heading text-2xl text-[var(--color-foreground)]">
            {brandName}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-foreground)]/68">
            Use the menu on the left to update the website without touching code.
          </p>
          <div className="mt-4">
            <Badge variant={persistenceEnabled ? "default" : "secondary"}>
              {persistenceEnabled ? "Live Saving On" : "Seed Mode"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/88">
        <CardContent className="p-3">
          <nav className="space-y-1">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={[
                    "block rounded-2xl border px-4 py-3 transition",
                    active
                      ? "border-[var(--brand-primary)] bg-[color:rgba(165,60,47,0.08)]"
                      : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-muted)]/55",
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-foreground)]/62">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
