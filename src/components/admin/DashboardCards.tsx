import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <Card className="bg-white/86">
      <CardHeader className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]/52">
          {label}
        </p>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-[var(--color-foreground)]/68">
        {helper}
      </CardContent>
    </Card>
  );
}

export function QuickActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card className="bg-white/86">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-foreground)]/70">{description}</p>
        <Button asChild>
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
