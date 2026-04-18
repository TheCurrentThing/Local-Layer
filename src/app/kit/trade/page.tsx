"use client";

import Link from "next/link";
import { ArrowLeft, Wrench, CheckCircle, Phone, Envelope, MapPin, Clock, ShieldCheck, ArrowUpRight, Star } from "@phosphor-icons/react";

const services = [
  {
    name: "General Plumbing",
    items: ["Tap replacement & repair", "Burst pipe emergency", "Toilet install & repair", "Bathroom fit-out", "Water pressure diagnosis"],
    tag: "RESIDENTIAL",
  },
  {
    name: "Fit-Out & Renovation",
    items: ["Full bathroom renovation", "Kitchen plumbing fit-out", "Utility room install", "New build first-fix & second-fix"],
    tag: "RESIDENTIAL + COMMERCIAL",
  },
  {
    name: "Commercial",
    items: ["Office plumbing contracts", "Commercial kitchen fit-out", "Planned maintenance", "Annual service agreements"],
    tag: "COMMERCIAL",
  },
];

const trustPoints = [
  { label: "Fully Licensed",      detail: "Registered with the Plumbing & Heating Guild"   },
  { label: "15 Years Experience", detail: "Residential & commercial across the region"       },
  { label: "Same-Day Available",  detail: "Emergency call-outs · 7 days a week"             },
  { label: "Fixed-Price Quotes",  detail: "No hidden charges. Written quote before any work" },
  { label: "Insured to €2M",      detail: "Full public liability & professional indemnity"   },
];

const testimonials = [
  { name: "Aoife M.",   text: "Called at 7am with a burst pipe — they were there by 9. Professional, tidy, fairly priced.", rating: 5 },
  { name: "James R.",   text: "Did our full bathroom renovation. Communication was clear throughout. Would highly recommend.", rating: 5 },
  { name: "Siobhán K.", text: "Annual service agreement for our office. Always reliable, always on time.", rating: 5 },
];

const availability = [
  { day: "Mon – Fri",  status: "Open for bookings",    available: true  },
  { day: "Saturday",   status: "Limited availability", available: true  },
  { day: "Sunday",     status: "Emergency only",       available: false },
];

export default function TradeKit() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.12em]">
              <ArrowLeft size={12} weight="bold" />
              locallayer
            </Link>
            <span className="text-border">·</span>
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em]">kit.trade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">LIVE PREVIEW</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5">

        <div
          className="border-x border-border"
          style={{ background: "linear-gradient(160deg, hsl(24 11% 9%) 0%, hsl(150 10% 10%) 60%, hsl(24 11% 9%) 100%)" }}
        >
          <div className="px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:items-end">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm border border-green-400/30 bg-green-400/5 flex items-center justify-center">
                  <Wrench weight="duotone" size={20} className="text-green-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-green-400 tracking-[0.2em] uppercase block">Licensed Trade · Cork City</span>
                  <span className="font-heading text-xl text-foreground">Murphy Plumbing &amp; Fit-out</span>
                </div>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl text-foreground leading-tight max-w-lg">
                Quality trades work. <em className="not-italic text-green-400">Done properly.</em>
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-green-400 border border-green-400/30 bg-green-400/5 px-2.5 py-1 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Accepting New Work
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground border border-border px-2.5 py-1 rounded-sm">
                  <MapPin weight="duotone" size={11} />
                  15km Radius · Cork City
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:min-w-[200px]">
              <a
                href="tel:0851234567"
                className="flex items-center justify-center gap-2 py-3 rounded-sm bg-green-400 text-background font-mono text-sm tracking-wide font-medium hover:-translate-y-0.5 transition-all duration-200"
              >
                <Phone weight="fill" size={14} />
                085 123 4567
              </a>
              <a
                href="mailto:info@murphyplumbing.ie"
                className="flex items-center justify-center gap-2 py-2.5 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-green-400/30 transition-all duration-200"
              >
                <Envelope weight="duotone" size={12} />
                Request a Quote
              </a>
            </div>
          </div>
        </div>

        <div className="border-x border-t border-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y divide-border/60">
          {trustPoints.map((pt) => (
            <div key={pt.label} className="px-4 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck weight="duotone" size={12} className="text-green-400 shrink-0" />
                <span className="font-mono text-[9px] text-green-400 tracking-[0.1em]">{pt.label}</span>
              </div>
              <span className="text-xs text-muted-foreground font-light leading-snug">{pt.detail}</span>
            </div>
          ))}
        </div>

        <div className="border-x border-t border-border grid grid-cols-1 lg:grid-cols-[1fr_280px] divide-y lg:divide-y-0 lg:divide-x divide-border">

          <div className="py-10 px-6 md:px-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Services</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-col gap-6">
              {services.map((service) => (
                <div key={service.name} className="rounded-sm border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/40">
                    <span className="font-heading text-lg text-foreground">{service.name}</span>
                    <span className="font-mono text-[8px] text-green-400 border border-green-400/30 bg-green-400/5 px-1.5 py-0.5 rounded-sm tracking-[0.1em]">
                      {service.tag}
                    </span>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-2">
                    {service.items.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle weight="duotone" size={13} className="text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Customer Reviews</span>
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" size={11} className="text-primary" />
                  ))}
                  <span className="font-mono text-[9px] text-primary ml-1.5">5.0</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-sm border border-border bg-card p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} weight="fill" size={10} className="text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <span className="font-mono text-[9px] text-muted-foreground/50">— {t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-10 px-6 flex flex-col gap-8">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock weight="duotone" size={14} className="text-muted-foreground" />
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Availability</span>
              </div>
              <div className="rounded-sm border border-border bg-card overflow-hidden">
                {availability.map((a, i) => (
                  <div
                    key={a.day}
                    className={`flex items-center justify-between px-3 py-3 ${i < availability.length - 1 ? "border-b border-border/60" : ""}`}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">{a.day}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-[5px] h-[5px] rounded-full ${a.available ? "bg-green-400" : "bg-yellow-400"}`} />
                      <span className={`font-mono text-[10px] ${a.available ? "text-green-400" : "text-yellow-400"}`}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 px-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-[9px] text-green-400 tracking-[0.12em]">Open for quotes · responds same day</span>
              </div>
            </div>

            <div className="rounded-sm border border-border p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin weight="duotone" size={13} className="text-muted-foreground" />
                <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">Service Area</span>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Cork City centre + 15km radius. Including Ballincollig, Carrigaline, Midleton, Douglas, Bishopstown.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="tel:0851234567"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200"
              >
                <Phone weight="duotone" size={14} />
                Call Now
              </a>
              <a
                href="mailto:info@murphyplumbing.ie"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              >
                <Envelope weight="duotone" size={12} />
                Email for a Quote
                <ArrowUpRight size={11} weight="bold" />
              </a>
              <p className="font-mono text-[9px] text-muted-foreground/40 text-center tracking-[0.1em] mt-1">
                Written quotes · no obligation · fixed price
              </p>
            </div>

          </div>

        </div>

        <div className="border border-t-0 border-border px-5 py-2.5 flex items-center justify-between bg-muted/30">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">murphyplumbing.locallayer.app</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">powered by LocalLayer</span>
          </div>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border mt-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] uppercase">kit.trade — template preview</span>
          <p className="text-muted-foreground text-sm font-light">Services, availability, and contact — all live from your dashboard. Customers always see your current status.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 py-2 px-4 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 shrink-0">
          <ArrowLeft size={12} weight="bold" />
          Back to LocalLayer
        </Link>
      </div>

    </div>
  );
}
