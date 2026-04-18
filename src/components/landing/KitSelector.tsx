"use client";

import Link from "next/link";
import { ArrowUpRight, ForkKnife, Truck, PaintBrush, Wrench } from "@phosphor-icons/react";

const kits = [
  {
    id: "restaurant",
    href: "/kit/restaurant",
    label: "Restaurant",
    icon: ForkKnife,
    signal: "FOOD & DRINK",
    signalClass: "text-primary border-primary/30 bg-primary/5",
    desc: "Menu sections, table specials, kitchen hours, and seasonal updates — all live from one panel.",
    fields: [
      { key: "menu.sections",   val: "Starters, Mains, Desserts" },
      { key: "specials.today",  val: "Chef's Selection · live"        },
      { key: "hours.service",   val: "Lunch + Dinner"               },
    ],
    accent: "group-hover:border-primary/50 group-hover:bg-primary/[0.02]",
  },
  {
    id: "food-truck",
    href: "/kit/food-truck",
    label: "Food Truck",
    icon: Truck,
    signal: "MOBILE",
    signalClass: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    desc: "Location drops, rotating menus, today's stop and hours — published the moment you know them.",
    fields: [
      { key: "location.today",  val: "Main St & 4th · 11:00–15:00" },
      { key: "menu.rotating",   val: "6 items · updated daily"      },
      { key: "status.open",     val: "true"                          },
    ],
    accent: "group-hover:border-yellow-400/40 group-hover:bg-yellow-400/[0.02]",
  },
  {
    id: "artist",
    href: "/kit/artist",
    label: "Artist",
    icon: PaintBrush,
    signal: "CREATIVE",
    signalClass: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    desc: "Portfolio, shows, prints, commissions — kept current without touching code or a CMS.",
    fields: [
      { key: "portfolio.works",  val: "24 pieces · 3 new"          },
      { key: "shows.upcoming",   val: "Gallery Night · Fri 7pm"     },
      { key: "commissions.open", val: "true"                         },
    ],
    accent: "group-hover:border-blue-400/40 group-hover:bg-blue-400/[0.02]",
  },
  {
    id: "trade",
    href: "/kit/trade",
    label: "Trade",
    icon: Wrench,
    signal: "SERVICES",
    signalClass: "text-green-400 border-green-400/30 bg-green-400/5",
    desc: "Service areas, availability, quotes, and contact details — updated as your schedule changes.",
    fields: [
      { key: "services.list",    val: "Plumbing, Fit-out, Repair"   },
      { key: "availability",     val: "Open for quotes"              },
      { key: "area.covered",     val: "15km radius"                  },
    ],
    accent: "group-hover:border-green-400/40 group-hover:bg-green-400/[0.02]",
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
              4 KITS
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
            Pick your Kit.
          </h2>
          <p className="text-muted-foreground text-base font-light mt-1 max-w-lg">
            LocalLayer ships with purpose-built control surfaces for each business type. Not generic templates — operational systems tuned to how that business actually runs.
          </p>
        </div>

        {/* Kit grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-md overflow-hidden">
          {kits.map((kit) => {
            const Icon = kit.icon;
            return (
              <Link
                key={kit.id}
                href={kit.href}
                className={`group flex flex-col gap-5 p-7 bg-background border border-transparent transition-all duration-200 ${kit.accent} cursor-pointer`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm border border-border bg-muted flex items-center justify-center group-hover:border-inherit transition-colors duration-200">
                      <Icon weight="duotone" size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">{kit.label}</span>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border tracking-[0.15em] w-fit ${kit.signalClass}`}>
                        {kit.signal}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    weight="duotone"
                    size={16}
                    className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors duration-200 mt-1"
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {kit.desc}
                </p>

                {/* Data preview rows */}
                <div className="rounded-sm border border-border bg-card overflow-hidden">
                  {kit.fields.map((field, i) => (
                    <div
                      key={field.key}
                      className={`flex items-center justify-between px-3 py-2 ${i < kit.fields.length - 1 ? "border-b border-border/60" : ""}`}
                    >
                      <span className="font-mono text-[9px] text-muted-foreground tracking-wide shrink-0">{field.key}</span>
                      <span className="font-mono text-[9px] text-foreground/80 text-right truncate ml-4">
                        {field.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 mt-auto pt-1">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-[0.12em]">Preview {kit.label} Kit</span>
                  <div className="h-px flex-1 bg-border group-hover:bg-primary/20 transition-colors duration-200" />
                </div>

              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">
            your site lives at business-name.locallayer.app
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em] hidden sm:block">
            platform.kits → 4 active
          </span>
        </div>

      </div>
    </section>
  );
}
