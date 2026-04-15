import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const setupSteps = [
  { step: "1", label: "Business Info", href: "/admin/setup?step=1" },
  { step: "2", label: "Branding", href: "/admin/setup?step=2" },
  { step: "3", label: "Hours", href: "/admin/setup?step=3" },
  { step: "4", label: "Menu Setup", href: "/admin/setup?step=4" },
  { step: "5", label: "Specials", href: "/admin/setup?step=5" },
  { step: "6", label: "Review", href: "/admin/setup?step=6" },
];

export function SetupWizardSteps({ currentStep }: { currentStep: string }) {
  return (
    <Card className="bg-white/86">
      <CardHeader>
        <CardTitle>Setup Progress</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {setupSteps.map((item) => {
          const active = item.step === currentStep;

          return (
            <Link
              key={item.step}
              href={item.href}
              className={[
                "rounded-2xl border px-4 py-3 text-sm transition",
                active
                  ? "border-[var(--brand-primary)] bg-[color:rgba(165,60,47,0.08)]"
                  : "border-[var(--color-border)] bg-[var(--color-muted)]/35 hover:bg-[var(--color-muted)]/55",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <Badge variant={active ? "default" : "secondary"}>{item.step}</Badge>
                <span className="font-semibold text-[var(--color-foreground)]">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
