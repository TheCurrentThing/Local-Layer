"use client";

import Link from "next/link";
import { ArrowLeft, Truck, MapPin, Clock, CalendarBlank, ArrowUpRight, NavigationArrow } from "@phosphor-icons/react";

const todayStop = {
  status: "OPEN NOW",
  location: "Main St & 4th Ave, Midtown",
  time: "11:00 – 15:00",
  note: "Cash + card. Limited parking on Main — use the lot on 3rd.",
  lat: "40.7128° N",
  lng: "74.0060° W",
};

const upcomingStops = [
  { day: "Tomorrow", date: "Sat Apr 20", location: "East Market Square", time: "10:00 – 14:00", confirmed: true },
  { day: "Sunday",   date: "Sun Apr 21", location: "Riverside Park",      time: "12:00 – 16:00", confirmed: true },
  { day: "Monday",   date: "Mon Apr 22", location: "TBA",                 time: "TBA",           confirmed: false },
  { day: "Tuesday",  date: "Tue Apr 23", location: "Downtown Food Festival", time: "11:00 – 20:00", confirmed: true },
];

const menuItems = [
  { name: "Birria Tacos (3)",  desc: "Braised beef, consommé, onion, cilantro", price: "$14", tag: "BESTSELLER" },
  { name: "Al Pastor Burrito", desc: "Pineapple pork, rice, black beans, pico", price: "$11" },
  { name: "Elote in a Cup",    desc: "Grilled corn, cotija, chili, lime crema", price: "$6" },
  { name: "Agua Fresca",       desc: "Horchata or Hibiscus · rotating daily",   price: "$4" },
  { name: "Churro Bites",      desc: "Cinnamon sugar, chocolate dip",           price: "$5" },
  { name: "Loaded Nachos",     desc: "Cheese, jalapeños, sour cream, guac",     price: "$10" },
];

export default function FoodTruckKit() {
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
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em]">kit.food-truck</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">LIVE PREVIEW</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5">

        <div
          className="border-x border-border relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, hsl(24 11% 9%) 0%, hsl(44 20% 11%) 60%, hsl(24 11% 9%) 100%)" }}
        >
          <div className="px-6 md:px-10 py-12 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm border border-yellow-400/30 bg-yellow-400/5 flex items-center justify-center">
                <Truck weight="duotone" size={20} className="text-yellow-400" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-yellow-400 tracking-[0.2em] uppercase block">Mobile · Always Moving</span>
                <span className="font-heading text-xl text-foreground">Callejero</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase">Where We Are Today</span>
              <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight">
                Main St <span className="text-yellow-400">&amp;</span> 4th Ave
              </h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-green-400 border border-green-400/30 bg-green-400/5 px-2.5 py-1 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {todayStop.status}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground border border-border px-2.5 py-1 rounded-sm">
                  <Clock weight="duotone" size={11} />
                  {todayStop.time}
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-light max-w-sm mt-1 leading-relaxed">{todayStop.note}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 py-2.5 px-5 rounded-sm bg-yellow-400 text-background font-mono text-[11px] tracking-wide font-medium hover:-translate-y-0.5 transition-all duration-200">
                <NavigationArrow weight="fill" size={13} />
                Get Directions
              </button>
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em]">{todayStop.lat} · {todayStop.lng}</span>
            </div>

          </div>
        </div>

        <div className="border-x border-border grid grid-cols-1 lg:grid-cols-[1fr_300px] divide-y lg:divide-y-0 lg:divide-x divide-border">

          <div className="py-10 px-6 md:px-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Today&apos;s Menu</span>
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[9px] text-yellow-400 border border-yellow-400/30 bg-yellow-400/5 px-2 py-0.5 rounded-sm tracking-[0.12em]">
                {menuItems.length} ITEMS
              </span>
            </div>

            <div className="flex flex-col gap-0 rounded-sm border border-border bg-card overflow-hidden">
              {menuItems.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-start justify-between gap-4 px-4 py-4 ${i < menuItems.length - 1 ? "border-b border-border/60" : ""}`}
                >
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground font-medium">{item.name}</span>
                      {(item as { tag?: string }).tag && (
                        <span className="font-mono text-[8px] text-yellow-400 border border-yellow-400/30 bg-yellow-400/5 px-1.5 py-0.5 rounded-sm tracking-[0.1em]">
                          {(item as { tag?: string }).tag}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs font-light">{item.desc}</span>
                  </div>
                  <span className="font-mono text-sm text-foreground shrink-0">{item.price}</span>
                </div>
              ))}
            </div>

            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em] mt-3 px-1">
              Menu · updated daily · allergen info available on request
            </p>
          </div>

          <div className="py-10 px-6 flex flex-col gap-8">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarBlank weight="duotone" size={14} className="text-muted-foreground" />
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Upcoming Stops</span>
              </div>
              <div className="flex flex-col gap-px rounded-sm border border-border overflow-hidden">
                {upcomingStops.map((stop, i) => (
                  <div
                    key={stop.date}
                    className={`px-4 py-3 flex flex-col gap-1 ${
                      i < upcomingStops.length - 1 ? "border-b border-border/50" : ""
                    } ${stop.confirmed ? "bg-card" : "bg-card opacity-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.15em] uppercase">{stop.day}</span>
                      {stop.confirmed
                        ? <span className="font-mono text-[8px] text-green-400 border border-green-400/30 bg-green-400/5 px-1.5 py-0.5 rounded-sm tracking-[0.1em]">CONFIRMED</span>
                        : <span className="font-mono text-[8px] text-muted-foreground/30 border border-border px-1.5 py-0.5 rounded-sm tracking-[0.1em]">TBA</span>
                      }
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin weight="duotone" size={11} className="text-yellow-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground leading-snug">{stop.location}</span>
                    </div>
                    {stop.time !== "TBA" && (
                      <span className="font-mono text-[10px] text-muted-foreground pl-4">{stop.time}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-primary/20 bg-primary/[0.03] p-4 flex flex-col gap-2">
              <span className="font-mono text-[9px] text-primary tracking-[0.15em] uppercase">Stay Updated</span>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Locations drop the night before. Tap below to share the schedule.
              </p>
              <button className="mt-1 flex items-center justify-center gap-2 py-2 rounded-sm border border-primary/30 font-mono text-[11px] text-primary hover:bg-primary/5 transition-colors duration-200">
                Share Our Location
                <ArrowUpRight size={12} weight="bold" />
              </button>
            </div>

          </div>

        </div>

        <div className="border border-t-0 border-border px-5 py-2.5 flex items-center justify-between bg-muted/30">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">callejero.locallayer.app</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">powered by LocalLayer</span>
          </div>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border mt-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] uppercase">kit.food-truck — template preview</span>
          <p className="text-muted-foreground text-sm font-light">Location, schedule, and menu — all updated from one panel. Customers always know where to find you.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 py-2 px-4 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 shrink-0">
          <ArrowLeft size={12} weight="bold" />
          Back to LocalLayer
        </Link>
      </div>

    </div>
  );
}
