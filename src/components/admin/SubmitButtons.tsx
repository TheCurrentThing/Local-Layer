"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function PendingSubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel ?? "Saving..." : label}
    </Button>
  );
}

export function PendingDeleteButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      disabled={pending}
      className="border-red-200 text-red-700 hover:bg-red-50"
    >
      {pending ? pendingLabel ?? "Deleting..." : label}
    </Button>
  );
}
