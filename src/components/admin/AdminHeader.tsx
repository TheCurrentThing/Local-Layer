import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminHeader({
  eyebrow = "Owner Dashboard",
  title,
  description,
  previewHref = "/",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  previewHref?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-white/88 p-6 shadow-panel lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {eyebrow}
          </p>
          <Badge variant="secondary">Simple Owner View</Badge>
        </div>
        <h1 className="mt-3 font-heading text-4xl text-[var(--color-foreground)]">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-base text-[var(--color-foreground)]/72">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/admin">Overview</Link>
        </Button>
        <Button asChild>
          <a href={previewHref} target="_blank" rel="noopener noreferrer">
            Preview Website
          </a>
        </Button>
      </div>
    </div>
  );
}
