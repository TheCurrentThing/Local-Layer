"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Broadcast, CheckCircle } from "@phosphor-icons/react";

const statusRail = [
  { key: "menu",      val: "14 items · live",     active: true  },
  { key: "hours",     val: "Open · closes 23:00", active: true  },
  { key: "specials",  val: "1 active item",        active: true  },
  { key: "kit",       val: "Restaurant · synced", active: false },
];

const confirmations = [
  "No rebuilds. No waiting. No technical overhead.",
  "Every change you make is live in seconds.",
  "Your site always reflects your business.",
];

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="bg-background min-h-screen flex items-center justify-center py-24 px-4"
    >
      <div className="w-full max-w-3xl flex flex-col gap-16">

        {/* Terminal panel */}
        <div className="rounded-md border border-border overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 bg-muted border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.15em] uppercase">
              locallayer · control panel
            </span>
            <div className="flex items-center gap-1.5">
              <Broadcast weight="duotone" size={11} className="text-primary" />
              <span className="font-mono text-[10px] text-primary tracking-[0.15em]">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border border-b border-border">
            {statusRail.map((item) => (
              <div key={item.key} className="flex flex-col gap-1 px-4 py-3 bg-card">
                <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">{item.key}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${item.active ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                  <span className="font-mono text-[10px] text-foreground leading-tight">{item.val}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card px-6 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">system.status</span>
              <div className="flex flex-col gap-2">
                {confirmations.map((pt) => (
                  <div key={pt} className="flex items-start gap-2">
                    <CheckCircle weight="duotone" size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="font-mono text-xs text-foreground leading-snug">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 opacity-50">
              <span className="font-mono text-[9px] text-muted-foreground">v1.0.0 · stable</span>
              <span className="font-mono text-[9px] text-muted-foreground">all systems nominal</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 bg-muted/60 border-t border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.12em]">
              locallayer is running · your site is live
            </span>
          </div>
        </div>

        {/* Headline + CTA */}
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight tracking-tight text-balance">
            Run your website like a system,{" "}
            <em className="not-italic text-primary">not a project.</em>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md font-light">
            LocalLayer gives you live control over every part of your business presence — always current, always yours.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-sm bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_32px_hsl(var(--primary)/0.35)] transition-all duration-200 px-8"
            >
              <Link href="/onboarding" className="flex items-center gap-2">
                Get Started
                <ArrowUpRight weight="bold" className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-sm border-border font-mono text-sm tracking-wide hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 px-8"
            >
              <a href="#kit-selector">Explore Kits</a>
            </Button>
          </div>

          <span className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.15em]">
            No setup fees · No rebuilds · your-name.locallayer.app from day one
          </span>
        </div>

      </div>
    </section>
  );
}
