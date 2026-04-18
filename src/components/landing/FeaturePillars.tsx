"use client";

import {
  Sliders,
  Clock,
  Star,
  Palette,
  Image,
  TextT,
  Broadcast,
  ListBullets,
  GitBranch,
} from "@phosphor-icons/react";

const pillars = [
  {
    index:     "01",
    id:        "control",
    label:     "Control",
    signal:    "LIVE SYNC",
    signalClass: "text-green-400 border-green-400/30 bg-green-400/5",
    headline:  "Everything your business runs on, live-editable.",
    body:      "Menu, hours, specials — all updated from one panel. Every change is immediate. No rebuilds, no waiting, no middlemen.",
    items: [
      { icon: Sliders, title: "Menu Editor",   code: "menu.items → published",   detail: "Add, remove, or reprice items across sections in real time." },
      { icon: Clock,   title: "Hours Control", code: "hours.schedule → active",  detail: "Set regular hours, holiday overrides, and temporary closures."  },
      { icon: Star,    title: "Specials",       code: "specials.today → visible", detail: "Push today's special to your live site in under 10 seconds." },
    ],
  },
  {
    index:     "02",
    id:        "identity",
    label:     "Identity",
    signal:    "BRAND SYNCED",
    signalClass: "text-primary border-primary/30 bg-primary/5",
    headline:  "Your brand, consistent and always on-model.",
    body:      "Switch themes, update your logo, lock in your palette. Your site reflects your brand — not a template someone else designed.",
    items: [
      { icon: Palette, title: "Theme Switcher",      code: "theme.active → kit-default",  detail: "Choose from curated themes built for your business type." },
      { icon: Image,   title: "Logo & Brand Assets", code: "brand.logo → applied",        detail: "Upload once, applied everywhere across your entire site."  },
      { icon: TextT,   title: "Color & Type",        code: "style.tokens → locked",       detail: "Lock in your palette and typography across every page."    },
    ],
  },
  {
    index:     "03",
    id:        "awareness",
    label:     "Awareness",
    signal:    "MONITORING",
    signalClass: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    headline:  "Know what's live, what changed, and when.",
    body:      "A live status rail and activity feed keep you oriented. Every change logged, every update confirmed. Nothing goes out unnoticed.",
    items: [
      { icon: Broadcast,   title: "Live Status",    code: "site.status → live",      detail: "Real-time indicators show what's published and what's pending." },
      { icon: ListBullets, title: "Activity Feed",  code: "feed.events → streaming", detail: "A timestamped log of every update made to your site."           },
      { icon: GitBranch,   title: "Change History", code: "history.depth → 30d",     detail: "Review past changes and understand what your site looked like before." },
    ],
  },
];

export default function FeaturePillars() {
  return (
    <section id="feature-pillars" className="bg-card py-24 px-4 md:px-8 border-b border-border">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col gap-2 mb-16">
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            06 / system.capabilities
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            Three pillars.<br />One system.
          </h2>
        </div>

        <div className="flex flex-col gap-0 divide-y divide-border border border-border rounded-md overflow-hidden bg-background">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group grid grid-cols-1 md:grid-cols-[280px_1fr] transition-colors duration-200 hover:bg-card/50"
            >
              {/* Label column */}
              <div className="flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em]">{pillar.index}</span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border tracking-[0.15em] ${pillar.signalClass}`}>
                      ● {pillar.signal}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-medium text-foreground tracking-[0.1em] uppercase">
                    {pillar.label}
                  </span>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col gap-2">
                  <h3 className="font-heading text-xl md:text-2xl text-foreground leading-snug">
                    {pillar.headline}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">{pillar.body}</p>
                </div>
              </div>

              {/* Feature items */}
              <div className="flex flex-col divide-y divide-border/60">
                {pillar.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 px-6 py-5 group/item transition-colors duration-150 hover:bg-card"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-sm border border-border bg-muted flex items-center justify-center shrink-0 group-hover/item:border-primary/40 transition-colors duration-150">
                        <Icon weight="duotone" size={16} className="text-primary" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{item.title}</span>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed font-light">
                          {item.detail}
                        </p>
                        <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em] mt-0.5">
                          → {item.code}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
