import type { ReactNode, CSSProperties } from "react";

type PanelVariant = "default" | "flush" | "highlight";

// Panel — the fundamental admin content container.
//
// Wraps a titled, bordered card that all admin editor sections use.
// Consistent spacing, border, and background across the dashboard.
export function Panel({
  title,
  description,
  children,
  variant = "default",
  action,
  className,
  style,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  variant?: PanelVariant;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const isFlush = variant === "flush";
  const isHighlight = variant === "highlight";

  return (
    <div
      className={className}
      style={{
        background: isHighlight
          ? "rgba(217,119,6,0.06)"
          : "var(--admin-surface)",
        border: isHighlight
          ? "1px solid rgba(217,119,6,0.18)"
          : "1px solid var(--admin-border)",
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: isFlush ? "14px 16px 0" : "14px 16px",
            borderBottom: !isFlush ? "1px solid var(--admin-border)" : undefined,
          }}
        >
          <div>
            {title && (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--admin-text)",
                  lineHeight: 1.4,
                }}
              >
                {title}
              </p>
            )}
            {description && (
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: "var(--admin-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}

      <div style={{ padding: isFlush ? "12px 16px 16px" : 16 }}>{children}</div>
    </div>
  );
}
