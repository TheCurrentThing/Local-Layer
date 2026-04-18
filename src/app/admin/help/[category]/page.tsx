import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSitePayload } from "@/lib/queries";
import { HELP_CATEGORIES, getHelpCategory } from "@/content/help";
import type { HelpBlock, HelpArticle } from "@/types/help";

export const dynamic = "force-dynamic";

function renderBlock(block: HelpBlock, idx: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={idx} style={{ margin: 0, fontSize: 13, color: "var(--admin-text)", lineHeight: 1.7 }}>
          {block.text}
        </p>
      );

    case "heading":
      return (
        <p key={idx} style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--admin-text)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {block.text}
        </p>
      );

    case "steps":
      return (
        <ol key={idx} style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {block.items?.map((item, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--admin-text)", lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ol>
      );

    case "tip":
      return (
        <div
          key={idx}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(74,222,128,0.05)",
            border: "1px solid rgba(74,222,128,0.15)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>💡</span>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--admin-text)", lineHeight: 1.6 }}>
            {block.text}
          </p>
        </div>
      );

    case "warning":
      return (
        <div
          key={idx}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(248,113,113,0.05)",
            border: "1px solid rgba(248,113,113,0.15)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--admin-text)", lineHeight: 1.6 }}>
            {block.text}
          </p>
        </div>
      );

    case "link_list":
      return (
        <div key={idx} style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {block.links?.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 13px",
                borderRadius: 7,
                background: "rgba(217,119,6,0.08)",
                border: "1px solid rgba(217,119,6,0.2)",
                color: "#d97706",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {link.label} →
            </Link>
          ))}
        </div>
      );

    default:
      return null;
  }
}

function ArticleCard({ article }: { article: HelpArticle }) {
  return (
    <div
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--admin-border)",
        }}
      >
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
          {article.title}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--admin-text-muted)" }}>
          {article.summary}
        </p>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {article.blocks.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  );
}

export default async function HelpCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getHelpCategory(category);
  if (!cat) notFound();

  const payload = await getAdminSitePayload();
  const { brand, businessSlug } = payload;

  return (
    <AdminShell
      activeKey="help"
      brandName={brand.businessName}
      eyebrow="Help"
      title={cat.title}
      description={cat.description}
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* ── Back link + sibling nav ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/help"
            style={{
              fontSize: 11.5,
              color: "var(--admin-text-muted)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid var(--admin-border)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            ← All topics
          </Link>
          {HELP_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/admin/help/${c.slug}`}
              style={{
                fontSize: 11,
                color: "var(--admin-text-muted)",
                textDecoration: "none",
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid transparent",
              }}
            >
              {c.icon} {c.title}
            </Link>
          ))}
        </div>

        {/* ── Articles ── */}
        {cat.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}

        {/* ── Contact footer ── */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--admin-text)" }}>
              Didn't find your answer?
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--admin-text-muted)" }}>
              Email us and a real person will reply.
            </p>
          </div>
          <a
            href="mailto:hello@locallayer.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 13px",
              borderRadius: 7,
              background: "rgba(217,119,6,0.1)",
              border: "1px solid rgba(217,119,6,0.25)",
              color: "#d97706",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Email support →
          </a>
        </div>
      </div>
    </AdminShell>
  );
}
