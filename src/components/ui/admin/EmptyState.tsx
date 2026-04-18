import type { ReactNode } from "react";

// EmptyState — shown when a list or section has no data yet.
//
// Use inside Panel when the content is empty to give users clear
// direction rather than a blank box.
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        gap: 10,
        textAlign: "center",
      }}
    >
      {icon && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--admin-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--admin-text-muted)",
            marginBottom: 2,
          }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--admin-text)",
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--admin-text-muted)",
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  );
}
