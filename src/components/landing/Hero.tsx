"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "@phosphor-icons/react";

const systemReadings = [
  { key: "platform.status",  value: "operational",     highlight: true  },
  { key: "kits.active",      value: "4 deployed"                        },
  { key: "sync.latency",     value: "< 200ms"                           },
  { key: "sites.live",       value: "synced · 0s ago", highlight: false },
];

const liveSignals = [
  { label: "LIVE",        color: "bg-green-400",  text: "text-green-400"  },
  { label: "SYNCED",      color: "bg-primary",    text: "text-primary"    },
  { label: "CONTROLLED",  color: "bg-blue-400",   text: "text-blue-400"   },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-background min-h-[calc(100vh-56px)] flex flex-col justify-center border-b border-border overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)/0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)/0.5) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-16 md:py-20">

        {/* System breadcrumb */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">locallayer</span>
          <span className="font-mono text-[10px] text-muted-foreground/30">/</span>
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">platform</span>
          <span className="font-mono text-[10px] text-muted-foreground/30">/</span>
          <span className="font-mono text-[10px] text-primary/80 tracking-[0.2em] uppercase">v1.0.0</span>
          <span className="ml-3 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-green-400 tracking-[0.15em] uppercase">running</span>
          </span>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">

          {/* LEFT */}
          <div className="lg:w-[42%] flex flex-col gap-8 lg:pt-4">

            <div className="flex flex-col gap-4">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-[64px] text-foreground leading-[1.05] tracking-tight text-balance">
                Your business.{" "}
                <em className="not-italic text-primary">Live.</em>{" "}
                Under control.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm font-light">
                LocalLayer is a live control system for local businesses. Update your menu, specials, hours, and branding in real time — no rebuilding, no technical overhead.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground rounded-sm font-mono text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_24px_hsl(var(--primary)/0.3)] transition-all duration-200"
              >
                <a href="/onboarding" className="flex items-center gap-2">
                  Launch Your Site
                  <ArrowUpRight weight="bold" className="w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-sm border-border font-mono text-sm tracking-wide hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <a href="#kit-selector">Explore Kits</a>
              </Button>
            </div>

            {/* Signal tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {liveSignals.map((sig) => (
                <span
                  key={sig.label}
                  className="inline-flex items-center gap-1.5 border border-border bg-card/50 px-2.5 py-1 rounded-sm"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sig.color} shrink-0`} />
                  <span className={`font-mono text-[10px] tracking-[0.15em] ${sig.text}`}>{sig.label}</span>
                </span>
              ))}
            </div>

            {/* System readings */}
            <div className="rounded-sm border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] uppercase">platform.status</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-[10px] text-green-400 tracking-[0.15em]">NOMINAL</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {systemReadings.map((r) => (
                  <div key={r.key} className="flex items-center justify-between px-3 py-2">
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wide">{r.key}</span>
                    <span className={`font-mono text-[10px] tracking-wide ${r.highlight ? "text-primary" : "text-foreground"}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — dashboard frame */}
          <div className="lg:w-[58%]">
            <div className="relative rounded-lg border border-border bg-card shadow-2xl overflow-hidden group">

              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">
                  dashboard.locallayer.app
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-[10px] text-green-400 tracking-[0.15em]">LIVE</span>
                </div>
              </div>

              {/* Dashboard image */}
              <div className="relative">
                <img
                  src="https://c.animaapp.com/mo1y4fsr4OgbS4/img/ai_1.png"
                  alt="LocalLayer control dashboard"
                  loading="eager"
                  className="w-full h-auto block transition-all duration-500 group-hover:brightness-105"
                />
                <span className="absolute top-3 left-3 font-mono text-[9px] text-muted-foreground bg-background/80 border border-border px-1.5 py-0.5 rounded-sm tracking-[0.12em] backdrop-blur-sm">
                  kit.restaurant
                </span>
                <span className="absolute top-3 right-3 font-mono text-[9px] text-muted-foreground bg-background/80 border border-border px-1.5 py-0.5 rounded-sm tracking-[0.12em] backdrop-blur-sm">
                  v1.0.0
                </span>
                <span className="absolute bottom-3 left-3 font-mono text-[9px] text-green-400 bg-background/80 border border-border px-1.5 py-0.5 rounded-sm tracking-[0.12em] backdrop-blur-sm">
                  live:true
                </span>
                <span className="absolute bottom-3 right-3 font-mono text-[9px] text-primary bg-background/80 border border-border px-1.5 py-0.5 rounded-sm tracking-[0.12em] backdrop-blur-sm">
                  sync:ok
                </span>
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/15 transition-all duration-500 pointer-events-none" />
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-[0.1em]">menu.json — 14 items</span>
                  <span className="font-mono text-[9px] text-muted-foreground tracking-[0.1em]">hours: open</span>
                </div>
                <span className="font-mono text-[9px] text-green-400 tracking-[0.1em]">● synced 2s ago</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between px-1">
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.12em]">real-time</span>
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.12em]">no rebuild</span>
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.12em]">always current</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
