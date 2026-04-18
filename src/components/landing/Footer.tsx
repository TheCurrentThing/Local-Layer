"use client";

import { Separator } from "@/components/ui/separator";
import { GithubLogo, TwitterLogo, LinkedinLogo } from "@phosphor-icons/react";

const navLinks = [
  { label: "Kits",               href: "#kit-selector"        },
  { label: "How It Works",       href: "#how-it-works"        },
  { label: "Live Control",       href: "#live-control-preview" },
  { label: "vs. Website Builders", href: "#why-locallayer"    },
  { label: "Get Started →",      href: "#final-cta",   highlight: true },
];

const socialLinks = [
  { icon: TwitterLogo,  label: "Twitter",  href: "#" },
  { icon: GithubLogo,   label: "GitHub",   href: "#" },
  { icon: LinkedinLogo, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">

      {/* Status rail */}
      <div className="border-b border-border/50 px-6 py-2 flex items-center gap-3">
        <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.2em] uppercase">sys.locallayer</span>
        <span className="font-mono text-[9px] text-muted-foreground/30">·</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.15em]">all systems operational</span>
        </div>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/40 hidden sm:block tracking-[0.12em]">
          uptime: 99.98%
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
                <span className="font-mono text-[9px] text-primary-foreground font-bold tracking-tight">LL</span>
              </div>
              <span className="font-mono text-sm font-medium text-foreground tracking-[0.05em]">LocalLayer</span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed max-w-[200px] tracking-wide">
              Your business. Live. Under control.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-7 h-7 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200"
                >
                  <Icon weight="duotone" size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">Platform</span>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ label, href, highlight }: { label: string; href: string; highlight?: boolean }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`font-mono text-[11px] transition-colors duration-150 ${
                      highlight ? "text-primary hover:text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kits */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">Kits</span>
            <ul className="flex flex-col gap-2">
              {["Restaurant", "Food Truck", "Artist", "Trade"].map((kit) => (
                <li key={kit}>
                  <a
                    href="#kit-selector"
                    className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {kit}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <Separator className="my-8 bg-border/40" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em]">
            © {new Date().getFullYear()} LocalLayer. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">
              live system · v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
