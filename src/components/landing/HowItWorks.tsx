"use client";

import { ArrowDown } from "@phosphor-icons/react";

const steps = [
  {
    step: "01",
    command: "ll edit --live",
    label: "Edit",
    headline: "Your business, editable in seconds.",
    body: "Change your menu, hours, specials, or branding from one control surface. No code. No waiting. Every field is live.",
    fields: [
      { key: "menu.special",   val: "Truffle Risotto — $24", status: "pending" },
      { key: "hours.friday",   val: "17:00 – 23:00",         status: "pending" },
      { key: "brand.accent",   val: "warm-amber",            status: "pending" },
      { key: "site.status",    val: "syncing…",              status: "active"  },
    ],
    signal: { label: "CHANGES PENDING", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  },
  {
    step: "02",
    command: "ll push --instant",
    label: "Propagate",
    headline: "Live in seconds. No deploy step.",
    body: "Changes propagate the moment you save. No cache flush. No rebuild cycle. Your customers see it immediately.",
    fields: [
      { key: "site.status",    val: "live · synced 0s ago",  status: "active" },
      { key: "special.active", val: "Truffle Risotto",        status: "ok"     },
      { key: "hours.now",      val: "Open until 23:00",       status: "ok"     },
      { key: "latency.ms",     val: "< 200ms",               status: "ok"     },
    ],
    signal: { label: "LIVE", color: "text-green-400 border-green-400/30 bg-green-400/5" },
  },
  {
    step: "03",
    command: "ll status --watch",
    label: "Monitor",
    headline: "One dashboard. Every change logged.",
    body: "Activity feed, live status rail, quick actions. You always know what's on your site — and you can change it instantly.",
    fields: [
      { key: "activity.last",  val: "Special updated · 2m ago", status: "ok"     },
      { key: "site.uptime",    val: "99.98%",                   status: "ok"     },
      { key: "actions.ready",  val: "3 available",              status: "ok"     },
      { key: "monitor.status", val: "watching",                 status: "active" },
    ],
    signal: { label: "UPDATED", color: "text-primary border-primary/30 bg-primary/5" },
  },
];

const statusDot: Record<string, string> = {
  pending: "bg-yellow-400",
  active:  "bg-primary animate-pulse",
  ok:      "bg-green-400",
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 px-4 md:px-8 border-b border-border">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col gap-2 mb-16">
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            03 / system.flow
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            How it works.
          </h2>
          <p className="text-muted-foreground text-base max-w-md font-light mt-1">
            Three stages. One continuous control flow.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-0">
          {steps.map((step, idx) => (
            <div key={step.step}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 py-10 md:py-12">

                {/* Left */}
                <div className="flex flex-col justify-center gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.2em]">
                        STEP {step.step}
                      </span>
                      <div className="h-px flex-1 bg-border max-w-[48px]" />
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border tracking-[0.15em] ${step.signal.color}`}>
                        {step.signal.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground/50">$</span>
                      <span className="font-mono text-sm text-primary tracking-wide">{step.command}</span>
                      <span className="inline-block w-[7px] h-[13px] bg-primary/70 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl md:text-3xl text-foreground leading-snug">
                      {step.headline}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light max-w-xs">
                      {step.body}
                    </p>
                  </div>
                </div>

                {/* Right: data panel */}
                <div className="rounded-sm border border-border bg-card overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/60">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">
                      locallayer / {step.label.toLowerCase()}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground opacity-40">step.{step.step}</span>
                  </div>

                  <div className="px-4 py-4 font-mono text-xs space-y-3">
                    {step.fields.map((field) => (
                      <div key={field.key} className="flex items-center gap-3">
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${statusDot[field.status]}`} />
                        <span className="text-muted-foreground min-w-[130px] shrink-0 text-[11px]">{field.key}</span>
                        <span className="text-muted-foreground opacity-30 shrink-0">→</span>
                        <span className="text-foreground text-[11px] truncate">{field.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[9px] text-muted-foreground tracking-[0.12em] uppercase">
                      {step.label} · processing
                    </span>
                  </div>
                </div>

              </div>

              {idx < steps.length - 1 && (
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-border/50" />
                  <ArrowDown weight="thin" size={14} className="text-muted-foreground/30 shrink-0" />
                  <div className="flex-1 h-px bg-border/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em] uppercase">
            edit → propagate → monitor
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em] uppercase">
            your-name.locallayer.app
          </span>
        </div>
      </div>
    </section>
  );
}
