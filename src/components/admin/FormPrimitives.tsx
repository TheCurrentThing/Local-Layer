import type { HTMLInputTypeAttribute, ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PendingDeleteButton,
  PendingSubmitButton,
} from "@/components/admin/SubmitButtons";
import { cn } from "@/lib/utils";

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
  className,
  bodyClassName,
  eyebrow,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  eyebrow?: string;
}) {
  return (
    <div
      className={cn(
        "admin-panel overflow-hidden border-white/[0.06] bg-white/[0.012] text-white",
        className,
      )}
    >
      <div className="flex items-baseline gap-3 border-b border-white/[0.07] px-4 py-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
          {eyebrow ?? "System Panel"}
        </span>
        <span className="text-[13px] font-semibold text-white/80">{title}</span>
        {description ? (
          <span className="ml-auto text-xs text-white/38">{description}</span>
        ) : null}
      </div>
      <div className={cn("space-y-4 px-4 py-4", bodyClassName)}>
        {children}
      </div>
    </div>
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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
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
        className="w-full rounded-[8px] border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[var(--color-primary)]/60 focus:bg-black/40"
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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[8px] border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[var(--color-primary)]/60 focus:bg-black/40"
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
    <label className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white transition hover:border-white/16">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--color-primary)]"
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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-[8px] border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--color-primary)]/60 focus:bg-black/40"
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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </span>
      <input
        name={name}
        type="file"
        accept={accept}
        className="w-full rounded-[8px] border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/70 outline-none transition file:mr-3 file:rounded-[6px] file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
      />
      {helperText ? (
        <p className="text-xs text-white/45">{helperText}</p>
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
    <Button
      asChild
      variant="outline"
      className="rounded-[0.95rem] border-white/12 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
    >
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
    <Button
      asChild
      variant="outline"
      className="rounded-[0.95rem] border-white/12 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

