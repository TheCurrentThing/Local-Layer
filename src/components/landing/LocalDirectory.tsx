"use client";

import { useRef, useState } from "react";
import { MapPin, ArrowLeft, ArrowRight, ArrowUpRight, Star } from "@phosphor-icons/react";

interface BizCard {
  id: string;
  name: string;
  subdomain: string;
  type: string;
  typeSignal: string;
  typeClass: string;
  tagline: string;
  location: string;
  distance: string;
  status: "LIVE" | "OPEN" | "CLOSED";
  accent: string;
  fields: { key: string; val: string }[];
  starred?: boolean;
}

const CARDS: BizCard[] = [
  {
    id: "margot",
    name: "Margot & Co.",
    subdomain: "margot.locallayer.app",
    type: "Restaurant",
    typeSignal: "FOOD & DRINK",
    typeClass: "text-primary border-primary/30 bg-primary/5",
    tagline: "Slow food, good light, seasonal menu.",
    location: "Fitzroy, VIC",
    distance: "0.4 km",
    status: "OPEN",
    accent: "border-primary/20",
    fields: [
      { key: "specials.today", val: "Duck Confit · live" },
      { key: "hours.dinner",   val: "6pm – 10pm" },
      { key: "reservations",   val: "2 tables left tonight" },
    ],
  },
  {
    id: "ironbark",
    name: "Ironbark Trades",
    subdomain: "ironbark.locallayer.app",
    type: "Trade",
    typeSignal: "SERVICES",
    typeClass: "text-green-400 border-green-400/30 bg-green-400/5",
    tagline: "Residential fit-outs and plumbing, done properly.",
    location: "Collingwood, VIC",
    distance: "0.9 km",
    status: "LIVE",
    accent: "border-green-400/20",
    fields: [
      { key: "availability",    val: "Open for quotes" },
      { key: "services",        val: "Fit-out, Plumbing" },
      { key: "area.covered",    val: "10 km radius" },
    ],
  },
  {
    id: "vault",
    name: "Vault Coffee",
    subdomain: "vault.locallayer.app",
    type: "Food Truck",
    typeSignal: "MOBILE",
    typeClass: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    tagline: "Third-wave espresso, no fixed address.",
    location: "CBD, VIC",
    distance: "1.2 km",
    status: "OPEN",
    accent: "border-yellow-400/20",
    fields: [
      { key: "location.now",   val: "Flinders Ln & Swanston" },
      { key: "hours.today",    val: "7:00 – 14:30" },
      { key: "special.today",  val: "Oat Cortado + Kouign" },
    ],
  },
  {
    id: "freya",
    name: "Freya Solberg",
    subdomain: "freyasolberg.locallayer.app",
    type: "Artist",
    typeSignal: "CREATIVE",
    typeClass: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    tagline: "Oil and charcoal. Mostly landscapes, sometimes people.",
    location: "Brunswick, VIC",
    distance: "1.8 km",
    status: "LIVE",
    accent: "border-blue-400/20",
    fields: [
      { key: "portfolio.new",   val: "3 works added this week" },
      { key: "commissions",     val: "Open · 3 slots left" },
      { key: "shows.next",      val: "Group Show · Sat 7pm" },
    ],
    starred: true,
  },
  {
    id: "harrow",
    name: "Harrow Kitchen",
    subdomain: "harrow.locallayer.app",
    type: "Restaurant",
    typeSignal: "FOOD & DRINK",
    typeClass: "text-primary border-primary/30 bg-primary/5",
    tagline: "Modern Australian. Fire-driven, ingredient-led.",
    location: "South Yarra, VIC",
    distance: "2.1 km",
    status: "OPEN",
    accent: "border-primary/20",
    fields: [
      { key: "menu.tonight",   val: "7 courses · set menu" },
      { key: "hours.service",  val: "Dinner only · Tue–Sat" },
      { key: "bookings",       val: "Filling fast" },
    ],
  },
  {
    id: "patchwork",
    name: "Patchwork Print Co.",
    subdomain: "patchwork.locallayer.app",
    type: "Artist",
    typeSignal: "CREATIVE",
    typeClass: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    tagline: "Risograph print studio. Runs, editions, commissions.",
    location: "Northcote, VIC",
    distance: "2.6 km",
    status: "LIVE",
    accent: "border-blue-400/20",
    fields: [
      { key: "editions.active",  val: "Issue 04 · 18 left" },
      { key: "commissions",      val: "Closed · opens May" },
      { key: "studio.drop",      val: "Sat 10am–2pm" },
    ],
  },
  {
    id: "apex",
    name: "Apex Electrical",
    subdomain: "apex.locallayer.app",
    type: "Trade",
    typeSignal: "SERVICES",
    typeClass: "text-green-400 border-green-400/30 bg-green-400/5",
    tagline: "Residential and commercial electrical. Licensed.",
    location: "Richmond, VIC",
    distance: "3.0 km",
    status: "LIVE",
    accent: "border-green-400/20",
    fields: [
      { key: "availability",   val: "2 slots this week" },
      { key: "services",       val: "Rewire, Solar, EV" },
      { key: "response",       val: "Same-day quotes" },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  LIVE:   "text-primary border-primary/30 bg-primary/5",
  OPEN:   "text-green-400 border-green-400/30 bg-green-400/5",
  CLOSED: "text-muted-foreground border-border bg-muted/20",
};

export default function LocalDirectory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const CARD_W = 320 + 12;

  function slide(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? CARD_W * 2 : -CARD_W * 2, behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  return (
    <section id="local-directory" className="bg-background py-24 px-4 md:px-8 border-b border-border overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              02.5 / local.directory
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-border" />
            <span className="font-mono text-[9px] text-green-400 border border-green-400/30 bg-green-400/5 px-2 py-0.5 rounded-sm tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              LIVE NEAR YOU
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
                See who&apos;s on LocalLayer<br className="hidden sm:block" /> in your area.
              </h2>
              <p className="text-muted-foreground text-base font-light mt-2 max-w-lg flex items-center gap-1.5">
                <MapPin weight="duotone" size={14} className="text-primary shrink-0" />
                Fitzroy, VIC — showing businesses within 5 km
              </p>
            </div>

            {/* Arrow controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => slide("left")}
                disabled={!canLeft}
                className={`w-9 h-9 rounded-sm border flex items-center justify-center transition-all duration-150
                  ${canLeft
                    ? "border-border bg-muted hover:border-primary/40 hover:text-primary text-foreground"
                    : "border-border/30 bg-muted/20 text-muted-foreground/20 cursor-default"}`}
              >
                <ArrowLeft weight="bold" size={13} />
              </button>
              <button
                onClick={() => slide("right")}
                disabled={!canRight}
                className={`w-9 h-9 rounded-sm border flex items-center justify-center transition-all duration-150
                  ${canRight
                    ? "border-border bg-muted hover:border-primary/40 hover:text-primary text-foreground"
                    : "border-border/30 bg-muted/20 text-muted-foreground/20 cursor-default"}`}
              >
                <ArrowRight weight="bold" size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {CARDS.map((biz) => (
            <BizCardItem key={biz.id} biz={biz} />
          ))}

          {/* "Your business?" end card */}
          <div className="snap-start shrink-0 w-[280px] rounded-sm border border-dashed border-border/50 bg-card/40 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-10 h-10 rounded-full border border-dashed border-border/60 flex items-center justify-center">
              <span className="font-mono text-lg text-muted-foreground/40">+</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.12em] leading-relaxed">
              YOUR BUSINESS<br />COULD BE HERE
            </p>
            <a
              href="#final-cta"
              className="font-mono text-[9px] text-primary border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-sm tracking-[0.12em] hover:bg-primary/10 transition-colors"
            >
              GET LISTED →
            </a>
          </div>
        </div>

        {/* Scroll indicator dots */}
        <ScrollDots total={CARDS.length} scrollRef={scrollRef} cardW={CARD_W} />

      </div>
    </section>
  );
}

function BizCardItem({ biz }: { biz: BizCard }) {
  return (
    <a
      href={`https://${biz.subdomain}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`snap-start shrink-0 w-[320px] rounded-sm border bg-card flex flex-col gap-4 p-5 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 cursor-pointer group ${biz.accent}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border tracking-[0.15em] ${biz.typeClass}`}>
              {biz.typeSignal}
            </span>
            {biz.starred && (
              <Star weight="fill" size={10} className="text-yellow-400" />
            )}
          </div>
          <h3 className="font-heading text-xl text-foreground leading-tight mt-0.5">{biz.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border tracking-[0.12em] ${STATUS_STYLES[biz.status]}`}>
            {biz.status}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wide">
            {biz.distance}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
        {biz.tagline}
      </p>

      {/* Live data fields */}
      <div className="rounded-sm border border-border bg-background/60 overflow-hidden">
        {biz.fields.map((f, i) => (
          <div
            key={f.key}
            className={`flex items-center justify-between px-3 py-1.5 ${i < biz.fields.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <span className="font-mono text-[9px] text-muted-foreground/60 tracking-wide shrink-0">{f.key}</span>
            <span className="font-mono text-[9px] text-foreground/70 text-right truncate ml-3">{f.val}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-0.5">
        <div className="flex items-center gap-1.5">
          <MapPin weight="duotone" size={10} className="text-muted-foreground/40" />
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-wide">{biz.location}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground/30 group-hover:text-primary transition-colors duration-200">
          <span className="font-mono text-[9px] tracking-[0.1em]">{biz.subdomain}</span>
          <ArrowUpRight weight="bold" size={10} />
        </div>
      </div>
    </a>
  );
}

function ScrollDots({
  total,
  scrollRef,
  cardW,
}: {
  total: number;
  scrollRef: React.RefObject<HTMLDivElement>;
  cardW: number;
}) {
  const [active, setActive] = useState(0);

  if (typeof window !== "undefined") {
    const el = scrollRef.current;
    if (el && !el.dataset.dotListener) {
      el.dataset.dotListener = "1";
      el.addEventListener("scroll", () => {
        const idx = Math.round(el.scrollLeft / cardW);
        setActive(Math.min(idx, total - 1));
      });
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => {
            scrollRef.current?.scrollTo({ left: i * cardW, behavior: "smooth" });
            setActive(i);
          }}
          className={`h-px transition-all duration-200 rounded-full ${
            i === active ? "w-6 bg-primary" : "w-3 bg-border"
          }`}
        />
      ))}
    </div>
  );
}
