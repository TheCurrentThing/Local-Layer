"use client";

import { useState } from "react";
import {
  ArrowClockwise,
  PaintBrush,
  Clock,
  Lightning,
  Circle,
  CheckCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Update Special", icon: Lightning, key: "special", hint: "special.active → …" },
  { label: "Edit Hours",     icon: Clock,      key: "hours",   hint: "hours.schedule → …" },
  { label: "Change Theme",   icon: PaintBrush, key: "theme",   hint: "theme.active → …"  },
];

const activityLog = [
  { msg: "menu.special → Truffle Arancini · pushed",  time: "just now", live: true  },
  { msg: "hours.saturday → 10:00–23:00 · synced",     time: "2m ago",   live: false },
  { msg: "brand.accent → warm-amber · applied",        time: "5m ago",   live: false },
  { msg: "site.status → live · confirmed",             time: "8m ago",   live: false },
];

const hoursData = [
  { day: "Mon–Fri",  hours: "11:00 – 22:00", open: true  },
  { day: "Saturday", hours: "10:00 – 23:00", open: true  },
  { day: "Sunday",   hours: "Closed",         open: false },
];

export default function LiveControlPreview() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [pulseZone, setPulseZone]       = useState<string | null>(null);

  const handleAction = (key: string) => {
    setActiveAction(key);
    setPulseZone(key);
    setTimeout(() => { setActiveAction(null); setPulseZone(null); }, 2000);
  };

  return (
    <section id="live-control-preview" className="bg-card py-24 px-4 md:px-8 border-b border-border">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              04 / control.surface
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-border" />
            <span className="font-mono text-[10px] text-green-400 border border-green-400/30 bg-green-400/5 px-2 py-0.5 rounded-sm tracking-[0.15em]">
              LIVE
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            The control terminal.
          </h2>
          <p className="text-muted-foreground text-base max-w-md font-light mt-1">
            Admin panel on the left. Live site on the right. Every action reflects instantly — no deploys, no rebuilds.
          </p>
        </div>

        {/* Terminal panel */}
        <div className="rounded-md border border-border bg-background shadow-2xl overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">
              locallayer / dashboard · control-surface
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-[10px] text-green-400 tracking-[0.15em]">ALL SYSTEMS LIVE</span>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">

            {/* COL 1: Current state */}
            <div className="flex flex-col p-5 gap-4">
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">current.state</span>

              <div className={`rounded-sm border p-3 transition-all duration-300 ${pulseZone === "special" ? "border-primary bg-primary/5 shadow-[0_0_16px_hsl(var(--primary)/0.15)]" : "border-border bg-card/50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">special.active</span>
                  <span className="font-mono text-[9px] text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded-sm">TODAY</span>
                </div>
                <p className="text-foreground text-sm font-medium leading-tight">Truffle Arancini</p>
                <p className="text-muted-foreground text-xs mt-0.5 font-light">Black truffle aioli · $14</p>
              </div>

              <div className={`rounded-sm border p-3 transition-all duration-300 ${pulseZone === "hours" ? "border-primary bg-primary/5 shadow-[0_0_16px_hsl(var(--primary)/0.15)]" : "border-border bg-card/50"}`}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">hours.schedule</span>
                  <span className="font-mono text-[9px] text-green-400">● OPEN</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {hoursData.map((row) => (
                    <div key={row.day} className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">{row.day}</span>
                      <span className={`font-mono text-[10px] ${row.open ? "text-foreground" : "text-muted-foreground/40 line-through"}`}>
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-sm border p-3 transition-all duration-300 ${pulseZone === "theme" ? "border-primary bg-primary/5 shadow-[0_0_16px_hsl(var(--primary)/0.15)]" : "border-border bg-card/50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">brand.theme</span>
                  <span className="font-mono text-[9px] text-primary border border-primary/30 px-1.5 py-0.5 rounded-sm">SYNCED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary opacity-80" />
                  <span className="font-mono text-[10px] text-foreground">noir-warm · v2</span>
                </div>
              </div>
            </div>

            {/* COL 2: Actions + Feed */}
            <div className="flex flex-col p-5 gap-4">
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">quick.actions</span>

              <div className="flex flex-col gap-2">
                {quickActions.map(({ label, icon: Icon, key, hint }) => (
                  <button
                    key={key}
                    onClick={() => handleAction(key)}
                    className={`flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-sm border text-left transition-all duration-200 cursor-pointer group
                      ${activeAction === key
                        ? "border-primary bg-primary/10 shadow-[0_0_16px_hsl(var(--primary)/0.2)] -translate-y-0.5"
                        : "border-border bg-card/30 hover:border-primary/50 hover:-translate-y-0.5"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon weight="duotone" size={14} className={activeAction === key ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                      <span className={`font-mono text-[10px] tracking-wide ${activeAction === key ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {label}
                      </span>
                    </div>
                    <span className={`font-mono text-[9px] tracking-wide transition-opacity duration-200 ${activeAction === key ? "text-primary opacity-100" : "text-muted-foreground/40"}`}>
                      {activeAction === key ? "pushing…" : hint}
                    </span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-border/50" />

              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase flex items-center gap-2">
                activity.feed
                <ArrowClockwise weight="duotone" size={10} className="text-muted-foreground/50" />
              </span>

              <div className="flex flex-col gap-2">
                {activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {entry.live
                      ? <Circle weight="fill" size={6} className="text-primary animate-pulse shrink-0 mt-1" />
                      : <CheckCircle weight="duotone" size={6} className="text-muted-foreground/50 shrink-0 mt-1" />
                    }
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono text-[9px] text-foreground/80 leading-snug truncate">{entry.msg}</span>
                      <span className="font-mono text-[9px] text-muted-foreground/50">{entry.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: Live site */}
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40 shrink-0">
                <div className="flex-1 bg-muted/60 rounded-sm px-3 py-1 flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  <span className="font-mono text-[9px] text-muted-foreground truncate tracking-wide">
                    theplace.locallayer.app
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <CheckCircle weight="duotone" size={11} className="text-primary" />
                  <span className="font-mono text-[9px] text-muted-foreground">synced</span>
                </div>
              </div>

              <div className="relative flex-1 min-h-[260px] overflow-hidden">
                <img
                  src="https://c.animaapp.com/mo1y4fsr4OgbS4/img/ai_3.png"
                  alt="Live site preview"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
                {pulseZone === "special" && (
                  <div className="absolute inset-x-3 top-3 h-16 rounded-sm border border-primary bg-primary/10 flex items-center justify-center transition-all duration-300">
                    <span className="font-mono text-[10px] text-primary">special.active → updated ↗</span>
                  </div>
                )}
                {pulseZone === "hours" && (
                  <div className="absolute inset-x-3 bottom-10 h-12 rounded-sm border border-primary bg-primary/10 flex items-center justify-center transition-all duration-300">
                    <span className="font-mono text-[10px] text-primary">hours.schedule → synced ↗</span>
                  </div>
                )}
                {pulseZone === "theme" && (
                  <div className="absolute inset-3 rounded-sm border border-primary bg-primary/5 flex items-center justify-center transition-all duration-300">
                    <span className="font-mono text-[10px] text-primary">theme.active → applied ↗</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-card/90 backdrop-blur border-t border-border px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-[9px] text-muted-foreground">live · synced just now</span>
                  </div>
                  <span className="font-mono text-[9px] text-primary border border-primary/30 px-1.5 py-0.5 rounded-sm">
                    UPDATED
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/40">
            <span className="font-mono text-[9px] text-muted-foreground/60">
              // click any action — watch the preview respond
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.12em]">
                locallayer · all systems nominal
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button asChild variant="outline" className="rounded-sm border-border font-mono text-xs hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200">
            <a href="/onboarding" className="flex items-center gap-2">
              Launch Your Site
              <ArrowUpRight weight="duotone" size={14} />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
