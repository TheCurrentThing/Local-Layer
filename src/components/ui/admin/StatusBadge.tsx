// StatusBadge — inline status indicator used in admin panels.
//
// Standardises how we display status values (active, pending, failed, etc.)
// across the dashboard so they're consistent and scannable at a glance.

type StatusVariant =
  | "active"
  | "live"
  | "pending"
  | "draft"
  | "warning"
  | "error"
  | "muted";

const VARIANT_STYLES: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  active:  { bg: "rgba(74,222,128,0.1)",  text: "#4ade80", dot: "#4ade80"  },
  live:    { bg: "rgba(74,222,128,0.1)",  text: "#4ade80", dot: "#4ade80"  },
  pending: { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24", dot: "#fbbf24"  },
  draft:   { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", dot: "#94a3b8"  },
  warning: { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24", dot: "#fbbf24"  },
  error:   { bg: "rgba(248,113,113,0.1)", text: "#f87171", dot: "#f87171"  },
  muted:   { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", dot: "#94a3b8"  },
};

export function StatusBadge({
  variant,
  label,
  pulse = false,
}: {
  variant: StatusVariant;
  label: string;
  pulse?: boolean;
}) {
  const s = VARIANT_STYLES[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 20,
        background: s.bg,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: s.text,
      }}
    >
      <span
        className={pulse ? "animate-pulse-dot" : undefined}
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
