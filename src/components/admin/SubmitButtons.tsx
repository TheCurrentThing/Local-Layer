"use client";

import { useFormStatus } from "react-dom";

export function PendingSubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary" style={{ opacity: pending ? 0.7 : 1 }}>
      {pending ? pendingLabel ?? "Saving..." : label}
    </button>
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
    <button type="submit" disabled={pending} className="btn-danger" style={{ opacity: pending ? 0.7 : 1 }}>
      {pending ? pendingLabel ?? "Deleting..." : label}
    </button>
  );
}
