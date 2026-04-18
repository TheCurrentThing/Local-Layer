"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ForkKnife, Clock, Star, MapPin, Phone, ArrowUpRight, Lightning, ShoppingBag, Plus, Minus, X, CheckCircle, Bag } from "@phosphor-icons/react";

interface OrderItem {
  name: string;
  price: number;
  note?: string;
}
interface CartLine {
  item: OrderItem;
  qty: number;
  note: string;
}

const specials: (OrderItem & { desc: string; tag: string })[] = [
  { name: "Lobster Bisque", desc: "Cognac cream, chive oil, grilled sourdough croutons", price: 22, tag: "Tonight only" },
  { name: "Duck Confit Pappardelle", desc: "Slow-cooked duck leg, soft herbs, aged pecorino, brown butter", price: 34, tag: "Fri & Sat" },
  { name: "Burnt Basque Cheesecake", desc: "Pedro Ximénez reduction, candied walnut", price: 13, tag: "Dessert special" },
];

const menuSections: { title: string; items: (OrderItem & { desc: string; featured?: boolean })[] }[] = [
  {
    title: "Starters",
    items: [
      { name: "Burrata & Heritage Tomato", desc: "Cold-press olive oil, sea salt, basil", price: 16 },
      { name: "Crispy Squid", desc: "Lemon aioli, smoked paprika", price: 14 },
      { name: "Soup du Jour", desc: "Ask your server", price: 10 },
    ],
  },
  {
    title: "Mains",
    items: [
      { name: "Truffle Risotto", desc: "Arborio, wild mushroom, parmesan, truffle oil", price: 28, featured: true },
      { name: "Pan-Seared Salmon", desc: "Caperberry butter, haricot vert, potato rosti", price: 32 },
      { name: "Grass-Fed Sirloin 250g", desc: "Bone marrow butter, fries, chimichurri", price: 42 },
      { name: "Roasted Cauliflower Steak", desc: "Harissa yoghurt, pomegranate, pine nuts", price: 24 },
    ],
  },
  {
    title: "Desserts",
    items: [
      { name: "Valrhona Chocolate Fondant", desc: "Vanilla bean ice cream", price: 14 },
      { name: "Seasonal Sorbet", desc: "Three scoops, rotating", price: 10 },
    ],
  },
];

const hours = [
  { day: "Mon – Tue", time: "Closed" },
  { day: "Wed – Thu", time: "17:00 – 22:00" },
  { day: "Fri – Sat", time: "12:00 – 14:30, 17:00 – 23:00" },
  { day: "Sunday",    time: "12:00 – 16:00" },
];

function fmt(n: number) { return `$${n.toFixed(2)}`; }
function cartTotal(cart: CartLine[]) { return cart.reduce((s, l) => s + l.item.price * l.qty, 0); }
function cartCount(cart: CartLine[]) { return cart.reduce((s, l) => s + l.qty, 0); }

function CartDrawer({ cart, open, onClose, onUpdate, onClear }: { cart: CartLine[]; open: boolean; onClose: () => void; onUpdate: (name: string, delta: number) => void; onClear: () => void; }) {
  const [confirmed, setConfirmed] = useState(false);
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [name, setName] = useState("");

  const handlePlace = () => {
    if (!name.trim()) return;
    setConfirmed(true);
  };

  function reset() { setConfirmed(false); onClear(); onClose(); }

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full z-50 w-full max-w-sm bg-background border-l border-border flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag weight="duotone" size={16} className="text-primary" />
            <span className="font-mono text-[11px] tracking-[0.15em] text-foreground uppercase">Carryout Order</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} weight="bold" />
          </button>
        </div>

        {confirmed ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <CheckCircle size={48} weight="duotone" className="text-green-400" />
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-2xl text-foreground">Order Received</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">Thanks, <span className="text-foreground">{name}</span>! Your carryout order is being prepared.</p>
            </div>
            <div className="rounded-sm border border-green-400/20 bg-green-400/[0.04] px-5 py-3 w-full flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wide">Pickup in</span>
                <span className="font-mono text-[10px] text-green-400">{pickupTime === "ASAP" ? "~20 min" : pickupTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wide">Total charged</span>
                <span className="font-mono text-[10px] text-foreground">{fmt(cartTotal(cart))}</span>
              </div>
            </div>
            <button onClick={reset} className="w-full py-2.5 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] tracking-wide hover:-translate-y-0.5 transition-all duration-200">Done</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 h-full text-center py-16">
                  <Bag size={32} weight="duotone" className="text-border" />
                  <p className="text-muted-foreground text-sm font-light">Your order is empty.</p>
                  <p className="font-mono text-[9px] text-muted-foreground/50 tracking-wide">Add items from the menu.</p>
                </div>
              ) : (
                cart.map((line) => (
                  <div key={line.item.name} className="rounded-sm border border-border bg-card p-3 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-foreground font-medium leading-tight">{line.item.name}</span>
                      <span className="font-mono text-[11px] text-primary shrink-0">{fmt(line.item.price * line.qty)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onUpdate(line.item.name, -1)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                        <Minus size={10} weight="bold" />
                      </button>
                      <span className="font-mono text-[11px] text-foreground w-4 text-center">{line.qty}</span>
                      <button onClick={() => onUpdate(line.item.name, +1)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                        <Plus size={10} weight="bold" />
                      </button>
                      <span className="font-mono text-[9px] text-muted-foreground/40 ml-1">{fmt(line.item.price)} each</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border px-5 py-5 flex flex-col gap-4 shrink-0">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wide">Subtotal</span>
                    <span className="font-mono text-[10px] text-foreground">{fmt(cartTotal(cart))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wide">Est. ready</span>
                    <span className="font-mono text-[10px] text-green-400">~20 min</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wide uppercase">Pickup time</span>
                  <div className="flex gap-2 flex-wrap">
                    {["ASAP", "30 min", "45 min", "1 hr"].map((t) => (
                      <button key={t} onClick={() => setPickupTime(t)} className={`font-mono text-[10px] px-3 py-1.5 rounded-sm border transition-all duration-150 ${pickupTime === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wide uppercase">Name for order</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 font-light focus:outline-none focus:border-primary/50 transition-colors" />
                </div>

                <button onClick={handlePlace} disabled={!name.trim()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none">
                  Place Carryout Order · {fmt(cartTotal(cart))}
                  <ArrowUpRight size={13} weight="bold" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function AddBtn({ item, onAdd }: { item: OrderItem; onAdd: (item: OrderItem) => void }) {
  const [flash, setFlash] = useState(false);
  function handle() {
    onAdd(item);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  }
  return (
    <button onClick={handle} className={`shrink-0 flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded-sm border transition-all duration-150 ${flash ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>
      <Plus size={9} weight="bold" />
      Add
    </button>
  );
}

export default function RestaurantKit() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(item: OrderItem) {
    setCart((prev) => {
      const existing = prev.find((l) => l.item.name === item.name);
      if (existing) return prev.map((l) => l.item.name === item.name ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { item, qty: 1, note: "" }];
    });
  }

  function updateCart(name: string, delta: number) {
    setCart((prev) => prev.map((l) => l.item.name === name ? { ...l, qty: l.qty + delta } : l).filter((l) => l.qty > 0));
  }

  const count = cartCount(cart);

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
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em]">kit.restaurant</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-primary/40 px-2.5 py-1 rounded-sm">
              <ShoppingBag weight="duotone" size={13} />
              <span className="tracking-[0.1em]">Carryout</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground font-mono text-[8px] flex items-center justify-center font-bold">{count}</span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">LIVE PREVIEW</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-0">

        <div className="relative border-x border-border overflow-hidden">
          <div className="h-64 md:h-80 flex flex-col items-center justify-center gap-4 relative" style={{ background: "linear-gradient(160deg, hsl(24 11% 9%) 0%, hsl(29 20% 12%) 60%, hsl(24 11% 9%) 100%)" }}>
            <div className="w-12 h-12 rounded-sm border border-primary/30 flex items-center justify-center mb-1">
              <ForkKnife weight="duotone" size={24} className="text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight text-center">The Larder</h1>
            <p className="text-muted-foreground text-sm font-light tracking-wide">Modern European · Garden District</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-green-400 border border-green-400/30 bg-green-400/5 px-2.5 py-1 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Open Today · Dinner
              </span>
              <button onClick={() => setCartOpen(true)} className="flex items-center gap-1.5 font-mono text-[10px] text-primary border border-primary/30 bg-primary/5 px-2.5 py-1 rounded-sm hover:bg-primary/10 transition-colors">
                <ShoppingBag weight="duotone" size={10} />
                Order Carryout
              </button>
            </div>
          </div>
        </div>

        <div className="border-x border-border grid grid-cols-1 lg:grid-cols-[1fr_280px] divide-y lg:divide-y-0 lg:divide-x divide-border">

          <div className="py-10 px-6 md:px-10">

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Lightning weight="duotone" size={14} className="text-yellow-400" />
                <span className="font-mono text-[10px] text-yellow-400 tracking-[0.2em] uppercase">Today&apos;s Specials</span>
                <div className="flex-1 h-px bg-yellow-400/20" />
                <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.12em]">changes regularly</span>
              </div>
              <div className="rounded-sm border border-yellow-400/20 bg-yellow-400/[0.03] overflow-hidden divide-y divide-yellow-400/10">
                {specials.map((special) => (
                  <div key={special.name} className="flex items-start justify-between gap-4 px-5 py-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-foreground font-medium">{special.name}</span>
                        <span className="font-mono text-[9px] text-yellow-400 border border-yellow-400/30 bg-yellow-400/5 px-1.5 py-0.5 rounded-sm tracking-[0.12em] shrink-0">{special.tag}</span>
                      </div>
                      <span className="text-muted-foreground text-xs font-light leading-relaxed">{special.desc}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-sm text-foreground">{fmt(special.price)}</span>
                      <AddBtn item={special} onAdd={addToCart} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10 p-5 rounded-sm border border-primary/20 bg-primary/[0.03] relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="font-mono text-[9px] text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded-sm tracking-[0.15em]">CHEF&apos;S PICK</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] uppercase block mb-2">Featured Dish</span>
              <h3 className="font-heading text-2xl text-foreground mb-1">Truffle Risotto</h3>
              <p className="text-muted-foreground text-sm font-light mb-3">Arborio rice, wild mushroom, aged parmesan, white truffle oil. Finished tableside.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base text-primary font-medium">$28.00</span>
                  <AddBtn item={{ name: "Truffle Risotto", price: 28 }} onAdd={addToCart} />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/50 tracking-wide">Tonight only · limited</span>
              </div>
            </div>

            {menuSections.map((section) => (
              <div key={section.title} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">{section.title}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground font-medium">{item.name}</span>
                          {item.featured && <Star weight="duotone" size={11} className="text-primary shrink-0" />}
                        </div>
                        <span className="text-muted-foreground text-xs font-light leading-relaxed">{item.desc}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-sm text-foreground">{fmt(item.price)}</span>
                        <AddBtn item={item} onAdd={addToCart} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>

          <div className="py-10 px-6 flex flex-col gap-8">

            <div className="rounded-sm border border-primary/25 bg-primary/[0.04] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShoppingBag weight="duotone" size={14} className="text-primary" />
                <span className="font-mono text-[10px] text-primary tracking-[0.15em] uppercase">Order Carryout</span>
              </div>
              <p className="text-muted-foreground text-xs font-light leading-relaxed">Add items from the menu, choose a pickup time, and we&apos;ll have it ready.</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-0.5 rounded-sm tracking-wide">~20 min ready</span>
                <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wide">no delivery fee</span>
              </div>
              <button onClick={() => setCartOpen(true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200">
                View Order
                {count > 0 && <span className="bg-primary-foreground/20 rounded-full px-1.5 py-0.5 text-[9px]">{count}</span>}
                <ArrowUpRight size={13} weight="bold" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock weight="duotone" size={14} className="text-muted-foreground" />
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Hours</span>
              </div>
              <div className="rounded-sm border border-border bg-card overflow-hidden">
                {hours.map((h, i) => (
                  <div key={h.day} className={`flex items-start justify-between px-3 py-2.5 text-xs ${i < hours.length - 1 ? "border-b border-border/60" : ""} ${h.day === "Fri – Sat" ? "bg-primary/[0.03]" : ""}`}>
                    <span className="font-mono text-[10px] text-muted-foreground">{h.day}</span>
                    <span className={`font-mono text-[10px] text-right ${h.time === "Closed" ? "text-muted-foreground/40" : "text-foreground"}`}>{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1.5 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="font-mono text-[9px] text-green-400 tracking-[0.12em]">Open now · Fri dinner service</span>
              </div>
            </div>

            <div className="rounded-sm border border-yellow-400/20 bg-yellow-400/[0.03] p-4">
              <span className="font-mono text-[9px] text-yellow-400 tracking-[0.15em] uppercase block mb-1.5">Today&apos;s Note</span>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Kitchen closes at 22:30 Fri & Sat. Reservations recommended for groups of 4+.</p>
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-primary/10 border border-primary/30 text-primary font-mono text-[11px] tracking-wide hover:-translate-y-0.5 transition-all duration-200">
                Book a Table
                <ArrowUpRight size={13} weight="bold" />
              </button>
              <a href="tel:+" className="w-full flex items-center justify-center gap-2 py-2 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-border/80 transition-all duration-200">
                <Phone weight="duotone" size={12} />
                (555) 012-3456
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin weight="duotone" size={13} className="text-muted-foreground" />
                <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">Find Us</span>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">42 Garden District Ave<br />Near the park · Free parking after 18:00</p>
            </div>

          </div>

        </div>

        <div className="border border-t-0 border-border px-5 py-2.5 flex items-center justify-between bg-muted/30">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">thelarder.locallayer.app</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">powered by LocalLayer</span>
          </div>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border mt-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] uppercase">kit.restaurant — template preview</span>
          <p className="text-muted-foreground text-sm font-light">This is what your customers see. You control every field from your LocalLayer dashboard.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 py-2 px-4 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 shrink-0">
          <ArrowLeft size={12} weight="bold" />
          Back to LocalLayer
        </Link>
      </div>

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onUpdate={updateCart} onClear={() => setCart([])} />
    </div>
  );
}
