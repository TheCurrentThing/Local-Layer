import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { AdminSectionKey } from "@/types/admin";

export function AdminShell({
  title,
  description,
  children,
  brandName,
  activeKey: _activeKey,
  eyebrow,
  mainClassName: _mainClassName,
  contentClassName,
  previewHref,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  brandName: string;
  activeKey: AdminSectionKey;
  eyebrow?: string;
  mainClassName?: string;
  contentClassName?: string;
  previewHref?: string;
}) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        background: "#0c0c0e",
        color: "#e2e0d8",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <AdminSidebar
        brandName={brandName}
        persistenceEnabled={isSupabaseConfigured()}
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminHeader
          eyebrow={eyebrow ?? title}
          title={title}
          description={description}
          previewHref={previewHref ?? "/"}
        />

        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "12px",
          }}
          className={contentClassName}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
