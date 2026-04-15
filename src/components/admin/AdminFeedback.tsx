import { Card, CardContent } from "@/components/ui/card";

type SearchValue = string | string[] | undefined;

function getFirstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function AdminFeedback({
  searchParams,
}: {
  searchParams?: Record<string, SearchValue>;
}) {
  const status = getFirstValue(searchParams?.status);
  const error = getFirstValue(searchParams?.error);

  if (!status && !error) {
    return null;
  }

  const toneClasses = error
    ? "border-red-200 bg-red-50 text-red-800"
    : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <Card className={toneClasses}>
      <CardContent className="p-4 text-sm font-medium">
        {error ?? status}
      </CardContent>
    </Card>
  );
}
