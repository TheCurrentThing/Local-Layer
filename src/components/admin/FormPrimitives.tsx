import type { HTMLInputTypeAttribute, ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PendingDeleteButton,
  PendingSubmitButton,
} from "@/components/admin/SubmitButtons";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  step?: string;
  min?: string | number;
};

type TextareaProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
  required?: boolean;
};

type CheckboxProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
};

type SelectProps = {
  label: string;
  name: string;
  defaultValue?: string;
  options: Array<{ value: string; label: string }>;
};

type FileInputProps = {
  label: string;
  name: string;
  accept?: string;
  helperText?: string;
};

export function AdminCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="bg-white/86">
      <CardHeader>
        <CardTitle className="text-stone-900">{title}</CardTitle>
        {description ? (
          <p className="mt-2 text-sm text-stone-600">
            {description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function AdminInput({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  step,
  min,
}: InputProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder,
  required,
}: TextareaProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]"
      />
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--brand-primary)]"
      />
      <span>{label}</span>
    </label>
  );
}

export function AdminSelect({
  label,
  name,
  defaultValue,
  options,
}: SelectProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[var(--brand-primary)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminFileInput({
  label,
  name,
  accept,
  helperText,
}: FileInputProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {label}
      </span>
      <input
        name={name}
        type="file"
        accept={accept}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--brand-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
      />
      {helperText ? (
        <p className="text-xs text-stone-500">{helperText}</p>
      ) : null}
    </label>
  );
}

export function HiddenField({
  name,
  value,
}: {
  name: string;
  value?: string | number | null;
}) {
  return <input type="hidden" name={name} value={value ?? ""} />;
}

export function SaveButton({ label = "Save Changes" }: { label?: string }) {
  return <PendingSubmitButton label={label} />;
}

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  return <PendingDeleteButton label={label} />;
}

export function PreviewLink({
  href = "/",
  label = "Preview Website",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Button asChild variant="outline">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </Button>
  );
}

export function PageLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button asChild variant="outline">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
