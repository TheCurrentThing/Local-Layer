"use client";

import { ArrowRight, ArrowDown, Globe, InstagramLogo, ShareNetwork, CheckCircle } from "@phosphor-icons/react";

const outputChannels = [
  {
    id: "website",
    icon: Globe,
    label: "Your Website",
    signal: { text: "LIVE", color: "text-green-400 border-green-400/30 bg-green-400/5" },
    preview: {
      title: "Friday Night Stop — Midtown",
      meta: "Food Truck · Fri Apr 19 · 5pm – 9pm",
      detail: "Corner of 5th & Elm. Cash + card. Tacos, burritos, agua fresca.",
      tag: "yourtruck.locallayer.app · auto-rendered",
    },
  },
  {
    id: "social",
    icon: ShareNetwork,
    label: "Social Preview",
    signal: { text: "READY TO SHARE", color: "text-primary border-primary/30 bg-primary/5" },
    preview: {
      title: "We'll be at 5th & Elm this Friday",
      meta: "5pm – 9pm · Tacos · Burritos · Agua Fresca",
      detail: "Tap to share → Instagram · Threads · SMS",
      tag: "share.preview · formatted",
    },
  },
];

const adminFields = [
  { key: "event.type",     val: "food_truck_stop",           status: "ok"      },
  { key: "event.title",    val: "Friday Night — Midtown",    status: "ok"      },
  { key: "event.date",     val: "2026-04-19",                status: "ok"      },
  { key: "event.time",     val: "17:00 – 21:00",             status: "ok"      },
  { key: "event.location", val: "5th & Elm, Midtown",        status: "ok"      },
  { key: "event.note",     val: "Cash + card accepted",      status: "ok"      },
  { key: "publish.status", val: "pushing…",                  status: "active"  },
];

const statusDot: Record<string, string> = {
  ok:     "bg-green-400",
  active: "bg-primary animate-pulse",
  warn:   "bg-yellow-400",
};

const principles = [
  "Enter information once — in your control panel.",
  "Your website reflects it immediately.",
  "A formatted share preview is ready instantly.",
  "No rewriting. No copy-pasting. No duplicate effort.",
];

export default function DistributionLayer() {
  return (
    <section
      id="distribution-layer"
      className="bg-background py-24 px-4 md:px-8 border-b border-border relative overflow-hidden"
    >
      {/* Subtle grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section header */}
        <div className="flex flex-col gap-2 mb-16">
          <span className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.15em] uppercase">
            yourbusiness.locallayer.app · control layer
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            Update once.<br />
            <em className="not-italic text-primary">Show everywhere.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-md font-light mt-1">
            LocalLayer is your source of truth. Every event, special, or update you enter flows to your website and is ready to share — without duplicating effort.
          </p>
        </div>

        {/* Main 3-column flow */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch mb-16">

          {/* Column 1 — Admin Input */}
          <div className="flex flex-col gap-0 rounded-sm border border-border bg-card overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">
                locallayer / control
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm border text-yellow-400 border-yellow-400/30 bg-yellow-400/5 tracking-[0.12em]">
                SAVING
              </span>
            </div>

            <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20 flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground/40">$</span>
              <span className="font-mono text-[11px] text-primary tracking-wide">ll event --create --push</span>
              <span className="inline-block w-[6px] h-[11px] bg-primary/70 animate-pulse ml-1" />
            </div>

            <div className="px-4 py-4 font-mono text-xs space-y-3 flex-1">
              {adminFields.map((field) => (
                <div key={field.key} className="flex items-start gap-2.5">
                  <span className={`w-[5px] h-[5px] rounded-full shrink-0 mt-[3px] ${statusDot[field.status]}`} />
                  <span className="text-muted-foreground min-w-[110px] shrink-0 text-[10px] leading-relaxed">{field.key}</span>
                  <span className="text-muted-foreground/30 shrink-0 text-[10px]">→</span>
                  <span className="text-foreground text-[10px] leading-relaxed">{field.val}</span>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.12em] uppercase">
                source of truth · 1 place to edit
              </span>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden lg:flex items-center justify-center px-2">
            <div className="flex flex-col items-center gap-1">
              <ArrowRight weight="thin" size={20} className="text-primary/50" />
              <span className="font-mono text-[8px] text-muted-foreground/40 tracking-[0.12em]">PUSH</span>
            </div>
          </div>
          <div className="flex lg:hidden items-center justify-center py-2">
            <ArrowDown weight="thin" size={18} className="text-primary/50" />
          </div>

          {/* Column 2 — Outputs stack */}
          <div className="flex flex-col gap-4">
            {outputChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.id} className="rounded-sm border border-border bg-card overflow-hidden shadow-md flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/60">
                    <div className="flex items-center gap-2">
                      <Icon size={12} weight="duotone" className="text-muted-foreground" />
                      <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">{ch.label.toLowerCase()}</span>
                    </div>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border tracking-[0.12em] ${ch.signal.color}`}>
                      {ch.signal.text}
                    </span>
                  </div>

                  <div className="px-4 py-4 flex flex-col gap-2 flex-1">
                    <span className="text-foreground text-xs font-medium leading-snug">{ch.preview.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground leading-relaxed">{ch.preview.meta}</span>
                    <span className="text-muted-foreground text-[11px] leading-relaxed">{ch.preview.detail}</span>
                  </div>

                  <div className="px-4 py-2 border-t border-border bg-muted/30">
                    <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.1em]">{ch.preview.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow 2 */}
          <div className="hidden lg:flex items-center justify-center px-2">
            <div className="flex flex-col items-center gap-1">
              <ArrowRight weight="thin" size={20} className="text-primary/50" />
              <span className="font-mono text-[8px] text-muted-foreground/40 tracking-[0.12em]">SHARE</span>
            </div>
          </div>
          <div className="flex lg:hidden items-center justify-center py-2">
            <ArrowDown weight="thin" size={18} className="text-primary/50" />
          </div>

          {/* Column 3 — Distribution targets */}
          <div className="flex flex-col gap-0 rounded-sm border border-border bg-card overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">
                distribution.targets
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm border text-green-400 border-green-400/30 bg-green-400/5 tracking-[0.12em]">
                READY
              </span>
            </div>

            <div className="px-4 py-4 flex flex-col gap-3 flex-1">
              {[
                { label: "website.events",    dest: "auto-rendered"         },
                { label: "instagram.post",    dest: "preview ready"         },
                { label: "threads.post",      dest: "preview ready"         },
                { label: "sms.update",        dest: "opt-in customers only" },
                { label: "google.business",   dest: "event synced"          },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2.5">
                  <CheckCircle size={11} weight="duotone" className="text-green-400 shrink-0" />
                  <span className="font-mono text-[10px] text-muted-foreground min-w-[130px] shrink-0">{t.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground/40 truncate">{t.dest}</span>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-border bg-muted/30 space-y-1.5">
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em] uppercase block">
                locallayer / distribution
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Your business is the source. These are just outputs.
              </p>
            </div>
          </div>

        </div>

        {/* Principles row */}
        <div className="border border-border rounded-sm bg-card/50 px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {principles.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-mono text-[9px] text-primary/60 tracking-[0.15em] shrink-0 mt-[3px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-muted-foreground text-[12px] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Bottom rail */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.15em] uppercase">
            locallayer = control layer
          </span>
          <div className="flex items-center gap-2">
            <InstagramLogo size={11} weight="duotone" className="text-muted-foreground/30" />
            <span className="font-mono text-[10px] text-muted-foreground/30 tracking-[0.12em] uppercase">
              social platforms = distribution layer
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
