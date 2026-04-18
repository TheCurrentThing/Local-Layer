"use client";

import Link from "next/link";
import type { HelpCategoryMeta } from "@/types/help";

export function HelpCategoryGrid({ categories }: { categories: HelpCategoryMeta[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 8,
      }}
    >
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/admin/help/${cat.slug}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "14px 16px",
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            textDecoration: "none",
            transition: "border-color 0.12s, background 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.3)";
            (e.currentTarget as HTMLElement).style.background = "rgba(217,119,6,0.03)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--admin-border)";
            (e.currentTarget as HTMLElement).style.background = "var(--admin-surface)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{cat.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
              {cat.title}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.55 }}>
            {cat.description}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)", opacity: 0.6 }}>
            {cat.articles.length} {cat.articles.length === 1 ? "article" : "articles"} →
          </p>
        </Link>
      ))}
    </div>
  );
}
