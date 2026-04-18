"use client";

import { XCircle, CheckCircle } from "@phosphor-icons/react";

const rows = [
  {
    attribute:   "Site updates",
    traditional: { value: "Requires rebuild or a developer" },
    locallayer:  { value: "Live in < 200ms" },
  },
  {
    attribute:   "Menu changes",
    traditional: { value: "Edit files or navigate a clunky CMS" },
    locallayer:  { value: "One field. One save. Done." },
  },
  {
    attribute:   "Site accuracy",
    traditional: { value: "Drifts from reality over time" },
    locallayer:  { value: "Always reflects your business" },
  },
  {
    attribute:   "Technical overhead",
    traditional: { value: "Hosting, deploys, caches, DNS…" },
    locallayer:  { value: "Zero. None. Handled." },
  },
  {
    attribute:   "Hours & specials",
    traditional: { value: "Hardcoded or CMS-dependent" },
    locallayer:  { value: "Live-editable, always current" },
  },
  {
    attribute:   "Business type fit",
    traditional: { value: "Generic templates for everyone" },
    locallayer:  { value: "Purpose-built Kits per business" },
  },
];

export default function WhyLocalLayer() {
  return (
    <section id="why-locallayer" className="bg-background py-24 px-4 md:px-6 border-b border-border">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            05 / comparison
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            Not a website builder.
          </h2>
          <p className="text-muted-foreground text-base font-light mt-1 max-w-md">
            LocalLayer treats your site as a live system — always reflecting your business as it actually is right now.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-xl">

          {/* Header row */}
          <div className="grid grid-cols-[1fr_1.1fr_1.1fr] border-b border-border">
            <div className="px-5 py-3 border-r border-border">
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">attribute</span>
            </div>
            <div className="px-5 py-3 border-r border-border flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase ml-1">Website Builder</span>
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <div className="relative flex">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </div>
              <span className="font-mono text-[9px] text-primary tracking-[0.15em] uppercase ml-1.5">LocalLayer</span>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row) => (
            <div
              key={row.attribute}
              className="grid grid-cols-[1fr_1.1fr_1.1fr] border-b border-border/60 last:border-b-0 transition-colors duration-150 hover:bg-muted/10"
            >
              <div className="px-5 py-4 border-r border-border/60 flex items-center">
                <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wide">{row.attribute}</span>
              </div>
              <div className="px-5 py-4 border-r border-border/60 flex items-start gap-2.5">
                <XCircle weight="duotone" size={14} className="text-muted-foreground/30 mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground/60 leading-snug font-light">{row.traditional.value}</span>
              </div>
              <div className="px-5 py-4 flex items-start gap-2.5 bg-primary/[0.03]">
                <CheckCircle weight="duotone" size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-xs text-foreground leading-snug">{row.locallayer.value}</span>
              </div>
            </div>
          ))}

          {/* Verdict row */}
          <div className="grid grid-cols-[1fr_1.1fr_1.1fr] border-t border-border">
            <div className="px-5 py-3 border-r border-border">
              <span className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.15em]">verdict</span>
            </div>
            <div className="px-5 py-3 border-r border-border flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.15em]">STATUS: STATIC</span>
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-[9px] text-green-400 tracking-[0.15em]">STATUS: LIVE</span>
            </div>
          </div>
        </div>

        {/* Proof strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { mono: "SYNC: 0ms",    label: "Instant updates"       },
            { mono: "REBUILD: none", label: "Zero deploy steps"     },
            { mono: "KITS: 4",      label: "Purpose-built per type" },
          ].map((item) => (
            <div
              key={item.mono}
              className="flex items-center gap-4 rounded-sm border border-border bg-card px-5 py-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-150"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-sm text-primary font-medium tracking-wide">{item.mono}</span>
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.1em]">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
