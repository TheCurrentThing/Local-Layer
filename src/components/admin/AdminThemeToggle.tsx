"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

type AdminTheme = "dark" | "light";

function applyTheme(theme: AdminTheme) {
  document.documentElement.setAttribute("data-admin-theme", theme);
}

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<AdminTheme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme") as AdminTheme | null;
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: AdminTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("admin-theme", next);
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 6,
        background: "var(--admin-panel-bg)",
        border: "1px solid var(--admin-panel-border)",
        color: "var(--admin-ghost-text)",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background 0.12s, border-color 0.12s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--admin-hover-bg)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--admin-panel-bg)";
      }}
    >
      {isDark ? <Sun size={12} weight="bold" /> : <Moon size={12} weight="bold" />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
