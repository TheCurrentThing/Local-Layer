import type { HTMLInputTypeAttribute, ReactNode } from "react";
import Link from "next/link";
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
    <div className={cn("admin-panel overflow-hidden text-white", className)}>
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="label-upper" style={{ color: "#d97706" }}>
            {eyebrow ?? "System Panel"}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{title}</span>
        </div>
        {description ? (
          <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{description}</span>
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
      <span className="label-upper">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        className="ctrl-input"
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
      <span className="label-upper">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="ctrl-input"
        style={{ resize: "none" }}
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
    <label
      className="flex items-center gap-3 rounded-[8px] text-sm transition"
      style={{
        padding: "10px 12px",
        background: "var(--admin-input-bg)",
        border: "1px solid var(--admin-input-border)",
        color: "var(--admin-text)",
      }}
    >
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4"
        style={{ accentColor: "#d97706" }}
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
      <span className="label-upper">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="ctrl-input"
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
      <span className="label-upper">{label}</span>
      <input
        name={name}
        type="file"
        accept={accept}
        className="ctrl-input"
        style={{
          color: "var(--admin-text-muted)",
        }}
      />
      {helperText ? (
        <p style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{helperText}</p>
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost"
    >
      {label}
    </a>
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
    <Link href={href} className="btn-ghost">
      {label}
    </Link>
  );
}
