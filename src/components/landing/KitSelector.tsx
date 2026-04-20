"use client";

import { ForkKnife, Wrench, ShoppingBag } from "@phosphor-icons/react";

const groups = [
  {
    id: "food",
    icon: ForkKnife,
    label: "Food & Drink",
    signal: "6 KITS",
    signalClass: "text-primary border-primary/30 bg-primary/5",
    accentHover: "group-hover:border-primary/40 group-hover:bg-primary/[0.02]",
    iconColor: "text-primary",
    desc: "From sit-down restaurants to weekend pop-ups. Menu sections, live specials, service windows, and kitchen hours — all published the moment they change.",
    kits: ["Restaurant", "Café", "Diner", "Bar", "Food Truck", "Pop-up"],
    preview: { key: "specials.tonight", val: "Pan-seared halibut · $34 · live" },
  },
  {
    id: "services",
    icon: Wrench,
    label: "Services",
    signal: "5 KITS",
    signalClass: "text-green-400 border-green-400/30 bg-green-400/5",
    accentHover: "group-hover:border-green-400/40 group-hover:bg-green-400/[0.02]",
    iconColor: "text-green-400",
    desc: "Trades, appointments, project work, and mobile services. Built around availability, trust signals, and contact — not menus or inventory.",
    kits: ["On Demand", "Scheduled", "Project", "Professional", "Mobile"],
    preview: { key: "booking.status", val: "Open · 3 slots this week" },
  },
  {
    id: "retail",
    icon: ShoppingBag,
    label: "Retail & Products",
    signal: "6 KITS",
    signalClass: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    accentHover: "group-hover:border-blue-400/40 group-hover:bg-blue-400/[0.02]",
    iconColor: "text-blue-400",
    desc: "Physical shops, maker studios, artists, and collectors. Products, gallery, collections, and hours — updated from a panel, not a CMS.",
    kits: ["Retail Shop", "Maker / Craft", "Artist / Creator", "Brand", "Vintage", "Collector"],
    preview: { key: "inventory.recent", val: "11 new pieces this week" },
  },
];

export default function KitSelector() {
  return (
    <section id="kit-selector" className="bg-card py-24 px-4 md:px-8 border-b border-border">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              02 / platform.kits
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-border" />
            <span className="font-mono text-[10px] text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded-sm tracking-[0.15em]">
              17 KITS
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            Kits built for real<br className="hidden sm:block" /> local businesses.
          </h2>
          <p className="text-muted-foreground text-base font-light mt-1 max-w-xl">
            LocalLayer isn&apos;t a theme picker — it&apos;s a category-aware platform. Pick a starting point built for how your type of business actually runs.
          </p>
        </div>

        {/* Group grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-md overflow-hidden">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className={`group flex flex-col gap-5 p-7 bg-background border border-transparent transition-all duration-200 ${group.accentHover}`}
              >
                {/* Group header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm border border-border bg-muted flex items-center justify-center">
                      <Icon weight="duotone" size={18} className={group.iconColor} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] text-foreground tracking-[0.12em] uppercase font-semibold">
                        {group.label}
                      </span>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border tracking-[0.15em] w-fit ${group.signalClass}`}>
                        {group.signal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {group.desc}
                </p>

                {/* Kit tags */}
                <div className="flex flex-wrap gap-1.5">
                  {group.kits.map((kit) => (
                    <span
                      key={kit}
                      className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground border border-border/70 bg-muted/40 px-2 py-1 rounded-sm"
                    >
                      {kit}
                    </span>
                  ))}
                </div>

                {/* Sample live field */}
                <div className="rounded-sm border border-border bg-card overflow-hidden mt-auto">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-mono text-[9px] text-muted-foreground tracking-wide shrink-0">
                      {group.preview.key}
                    </span>
                    <span className="font-mono text-[9px] text-foreground/80 text-right truncate ml-4">
                      {group.preview.val}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">
            each kit ships category-aware copy, sections, and defaults
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em] hidden sm:block">
            platform.kits → 17 active
          </span>
        </div>

      </div>
    </section>
  );
}
