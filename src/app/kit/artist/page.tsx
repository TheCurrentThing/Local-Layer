"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, PaintBrush, ArrowUpRight, Images, CalendarBlank,
  Envelope, FolderOpen, ShoppingCart, X, ArrowRight, Plus, Minus,
  CheckCircle, Package, Tag, Stack,
} from "@phosphor-icons/react";

interface GalleryWork {
  id: string;
  title: string;
  medium: string;
  size: string;
  year: string;
  status: "AVAILABLE" | "SOLD" | "ON SHOW" | "PRINTS";
  accent: string;
  shopItemId?: string;
}

interface ProjectImage {
  id: string;
  caption: string;
  accent: string;
  order: number;
}

interface Project {
  id: string;
  title: string;
  year: string;
  medium: string;
  description: string;
  coverAccent: string;
  images: ProjectImage[];
  status: "ONGOING" | "COMPLETE" | "ARCHIVED";
}

interface ShopItem {
  id: string;
  title: string;
  type: "ORIGINAL" | "PRINT" | "DIGITAL" | "OTHER";
  price: number;
  edition?: string;
  workId?: string;
  status: "IN_STOCK" | "SOLD_OUT" | "MADE_TO_ORDER";
  accent: string;
}

interface CartLine {
  item: ShopItem;
  qty: number;
}

const galleryWorks: GalleryWork[] = [
  { id: "gw-1", title: "Threshold Study I",  medium: "Oil on linen",      size: "80 × 60cm",  year: "2025", status: "AVAILABLE", accent: "hsl(29 50% 55%)",   shopItemId: "si-1" },
  { id: "gw-2", title: "Quiet Interior #7",  medium: "Mixed media",       size: "60 × 60cm",  year: "2025", status: "SOLD",      accent: "hsl(220 40% 55%)" },
  { id: "gw-3", title: "Pale Field (Dusk)",  medium: "Acrylic on canvas", size: "120 × 90cm", year: "2024", status: "AVAILABLE", accent: "hsl(150 30% 40%)",  shopItemId: "si-2" },
  { id: "gw-4", title: "Fragment Series IV", medium: "Ink & gouache",     size: "40 × 30cm",  year: "2025", status: "AVAILABLE", accent: "hsl(0 30% 50%)",    shopItemId: "si-3" },
  { id: "gw-5", title: "Distance No. 2",     medium: "Oil on board",      size: "50 × 40cm",  year: "2024", status: "ON SHOW",   accent: "hsl(280 35% 55%)" },
  { id: "gw-6", title: "Archive, Morning",   medium: "Watercolour",       size: "30 × 42cm",  year: "2025", status: "PRINTS",    accent: "hsl(45 60% 60%)",   shopItemId: "si-4" },
];

const projects: Project[] = [
  {
    id: "proj-1",
    title: "Pale Fields",
    year: "2024 – 2025",
    medium: "Oil & acrylic",
    description: "A series of large-format works examining the quality of diffused light in domestic landscapes. Each painting is made on site across multiple sessions.",
    coverAccent: "hsl(150 30% 40%)",
    status: "COMPLETE",
    images: [
      { id: "pi-1", caption: "Study 1 — early morning, north light", accent: "hsl(150 30% 40%)", order: 1 },
      { id: "pi-2", caption: "Study 3 — overcast, diffused",        accent: "hsl(160 25% 35%)", order: 2 },
      { id: "pi-3", caption: "Pale Field (Dusk) — final work",       accent: "hsl(45 35% 38%)",  order: 3 },
      { id: "pi-4", caption: "Detail — surface texture, oil",        accent: "hsl(30 25% 32%)",  order: 4 },
    ],
  },
  {
    id: "proj-2",
    title: "Threshold Studies",
    year: "2025",
    medium: "Oil on linen",
    description: "Paintings made at the edge of interior and exterior space — doorways, windows, thresholds. The series asks what it means to be on the periphery of a place.",
    coverAccent: "hsl(29 50% 55%)",
    status: "ONGOING",
    images: [
      { id: "pi-5", caption: "Threshold I — front door, morning",    accent: "hsl(29 50% 55%)", order: 1 },
      { id: "pi-6", caption: "Threshold II — kitchen window",        accent: "hsl(35 45% 48%)", order: 2 },
      { id: "pi-7", caption: "Threshold IV — studio entrance",       accent: "hsl(24 40% 42%)", order: 3 },
    ],
  },
  {
    id: "proj-3",
    title: "Fragment Series",
    year: "2025",
    medium: "Ink & gouache on paper",
    description: "Works on paper exploring memory and incompleteness. Imagery is deliberately fragmented; the viewer assembles meaning from partial information.",
    coverAccent: "hsl(0 30% 50%)",
    status: "ONGOING",
    images: [
      { id: "pi-8",  caption: "Fragment I — annotated",    accent: "hsl(0 30% 50%)",   order: 1 },
      { id: "pi-9",  caption: "Fragment III — detail",     accent: "hsl(348 28% 44%)", order: 2 },
      { id: "pi-10", caption: "Fragment IV — full sheet",  accent: "hsl(10 32% 46%)",  order: 3 },
      { id: "pi-11", caption: "Fragment V (in progress)",  accent: "hsl(355 26% 42%)", order: 4 },
      { id: "pi-12", caption: "Installation view, Cork",   accent: "hsl(0 20% 36%)",   order: 5 },
    ],
  },
];

const shopItems: ShopItem[] = [
  { id: "si-1", title: "Threshold Study I",       type: "ORIGINAL", price: 185000, workId: "gw-1", status: "IN_STOCK",       accent: "hsl(29 50% 55%)" },
  { id: "si-2", title: "Pale Field (Dusk)",        type: "ORIGINAL", price: 320000, workId: "gw-3", status: "IN_STOCK",       accent: "hsl(150 30% 40%)" },
  { id: "si-3", title: "Fragment Series IV",       type: "ORIGINAL", price:  95000, workId: "gw-4", status: "IN_STOCK",       accent: "hsl(0 30% 50%)" },
  { id: "si-4", title: "Archive, Morning — Print", type: "PRINT",    price:   8000, workId: "gw-6", status: "IN_STOCK",       edition: "Open edition", accent: "hsl(45 60% 60%)" },
  { id: "si-5", title: "Pale Fields Print Set",    type: "PRINT",    price:  22000,                 status: "IN_STOCK",       edition: "1 of 25",      accent: "hsl(150 30% 40%)" },
  { id: "si-6", title: "Commission — Oil on Linen",type: "OTHER",    price:  45000,                 status: "MADE_TO_ORDER",                           accent: "hsl(29 50% 55%)" },
];

const shows = [
  { title: "Group Exhibition — Still Forms", venue: "Liminal Gallery, Dublin", date: "Apr 25 – May 18, 2026", status: "UPCOMING" },
  { title: "Solo Show — Pale Fields",        venue: "The Depot, Cork",         date: "Jun 7 – Jun 28, 2026",  status: "UPCOMING" },
  { title: "Art Fair — Collect 2026",        venue: "Saatchi Gallery, London", date: "Feb 2026",              status: "PAST"     },
];

const statusColor: Record<string, string> = {
  AVAILABLE: "text-green-400 border-green-400/30 bg-green-400/5",
  SOLD:      "text-muted-foreground/40 border-border",
  "ON SHOW": "text-blue-400 border-blue-400/30 bg-blue-400/5",
  PRINTS:    "text-primary border-primary/30 bg-primary/5",
};

const projectStatusColor: Record<string, string> = {
  ONGOING:  "text-green-400 border-green-400/30 bg-green-400/5",
  COMPLETE: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  ARCHIVED: "text-muted-foreground/30 border-border",
};

const shopTypeLabel: Record<string, string> = {
  ORIGINAL: "Original",
  PRINT:    "Print",
  DIGITAL:  "Digital Download",
  OTHER:    "Commission",
};

const shopStatusColor: Record<string, string> = {
  IN_STOCK:      "text-green-400 border-green-400/30 bg-green-400/5",
  SOLD_OUT:      "text-muted-foreground/40 border-border",
  MADE_TO_ORDER: "text-primary border-primary/30 bg-primary/5",
};

function formatPrice(pence: number) {
  return `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ColourField({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        background: `radial-gradient(ellipse at 40% 40%, ${accent} 0%, transparent 70%), linear-gradient(135deg, hsl(24 11% 11%) 0%, hsl(24 11% 8%) 100%)`,
      }}
    />
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const img = project.images[activeImg];

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase">project</span>
            <h2 className="font-heading text-4xl text-foreground">{project.title}</h2>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground">{project.year} · {project.medium}</span>
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border tracking-[0.1em] ${projectStatusColor[project.status]}`}>
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
          <div className="flex flex-col gap-3">
            <div className="relative rounded-sm border border-border overflow-hidden" style={{ paddingBottom: "66%" }}>
              <div className="absolute inset-0 opacity-40">
                <ColourField accent={img.accent} />
              </div>
              <div className="absolute inset-[8%] rounded-sm border border-white/10" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm text-muted-foreground font-light leading-snug">{img.caption}</span>
              <span className="font-mono text-[9px] text-muted-foreground/40 shrink-0">{activeImg + 1} / {project.images.length}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase mb-1">Images in this project</span>
              <div className="grid grid-cols-4 gap-1.5">
                {project.images.map((pi, i) => (
                  <button
                    key={pi.id}
                    onClick={() => setActiveImg(i)}
                    className={`relative rounded-sm border overflow-hidden aspect-square transition-all duration-150 ${i === activeImg ? "border-blue-400/60 shadow-[0_0_8px_hsl(220_40%_55%/0.3)]" : "border-border hover:border-border/80"}`}
                  >
                    <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 40% 40%, ${pi.accent} 0%, transparent 70%), hsl(24 11% 9%)` }} />
                  </button>
                ))}
                <button className="relative rounded-sm border border-dashed border-border aspect-square flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group">
                  <Plus size={12} className="text-muted-foreground/30 group-hover:text-primary/60" />
                </button>
              </div>
            </div>

            <div className="rounded-sm border border-border p-3 flex flex-col gap-2">
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase">About this project</span>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{project.description}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                disabled={activeImg === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm border border-border font-mono text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft size={10} weight="bold" /> Prev
              </button>
              <button
                onClick={() => setActiveImg((i) => Math.min(project.images.length - 1, i + 1))}
                disabled={activeImg === project.images.length - 1}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm border border-border font-mono text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={10} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ lines, onUpdate, onClose }: {
  lines: CartLine[];
  onUpdate: (id: string, delta: number) => void;
  onClose: () => void;
}) {
  const total = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border-l border-border flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart weight="duotone" size={16} className="text-primary" />
            <span className="font-mono text-[11px] tracking-[0.15em] text-foreground uppercase">Cart</span>
            {lines.length > 0 && (
              <span className="font-mono text-[9px] text-primary border border-primary/30 bg-primary/5 px-1.5 py-0.5 rounded-sm">
                {lines.reduce((s, l) => s + l.qty, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-sm hover:bg-card transition-colors">
            <X size={13} className="text-muted-foreground" />
          </button>
        </div>

        {checkedOut ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <CheckCircle weight="duotone" size={40} className="text-green-400" />
            <h3 className="font-heading text-2xl text-foreground">Order received</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              This is a demo — in production, your payment processor handles fulfilment from here.
            </p>
            <button
              onClick={() => { setCheckedOut(false); onClose(); }}
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <Package weight="duotone" size={28} className="text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground font-light">Your cart is empty</p>
                </div>
              ) : (
                lines.map((line) => (
                  <div key={line.item.id} className="flex items-center gap-3 rounded-sm border border-border bg-card p-3">
                    <div className="w-12 h-12 rounded-sm border border-border overflow-hidden shrink-0 relative">
                      <div className="absolute inset-0 opacity-30">
                        <ColourField accent={line.item.accent} />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs text-foreground font-medium leading-snug truncate">{line.item.title}</span>
                      <span className="font-mono text-[9px] text-muted-foreground/60">{shopTypeLabel[line.item.type]}</span>
                      <span className="font-mono text-[10px] text-primary">{formatPrice(line.item.price)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onUpdate(line.item.id, -1)}
                        className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:border-primary/40 transition-colors"
                      >
                        <Minus size={9} className="text-muted-foreground" />
                      </button>
                      <span className="font-mono text-[11px] text-foreground w-4 text-center">{line.qty}</span>
                      <button
                        onClick={() => onUpdate(line.item.id, +1)}
                        className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:border-primary/40 transition-colors"
                      >
                        <Plus size={9} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-[0.12em]">Total</span>
                  <span className="font-mono text-sm text-foreground">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setCheckedOut(true)}
                  className="w-full py-2.5 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center font-mono text-[9px] text-muted-foreground/30 tracking-[0.1em]">
                  Payments via Stripe · Secure checkout
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type TabKey = "gallery" | "projects" | "shop";

export default function ArtistKit() {
  const [activeTab, setActiveTab] = useState<TabKey>("gallery");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  function addToCart(item: ShopItem) {
    setCartLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) return prev.map((l) => l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { item, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateCart(id: string, delta: number) {
    setCartLines((prev) =>
      prev
        .map((l) => l.item.id === id ? { ...l, qty: l.qty + delta } : l)
        .filter((l) => l.qty > 0)
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "gallery",  label: "Gallery",  icon: <Images weight="duotone" size={13} /> },
    { key: "projects", label: "Projects", icon: <Stack weight="duotone" size={13} /> },
    { key: "shop",     label: "Shop",     icon: <Tag weight="duotone" size={13} /> },
  ];

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
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em]">kit.artist</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart weight="duotone" size={14} className="text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-mono text-[8px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">LIVE PREVIEW</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5">

        <div className="border-x border-border px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm border border-blue-400/30 bg-blue-400/5 flex items-center justify-center">
                <PaintBrush weight="duotone" size={18} className="text-blue-400" />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase">Independent Artist · Dublin</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-foreground tracking-tight">
              Clara Moran
            </h1>
            <p className="text-muted-foreground text-sm font-light max-w-sm leading-relaxed">
              Painting through restraint. Works explore stillness, domestic space, and the grammar of light.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <span className="font-mono text-[10px] text-blue-400 border border-blue-400/30 bg-blue-400/5 px-2.5 py-1 rounded-sm tracking-[0.12em]">
              COMMISSIONS OPEN
            </span>
            <div className="flex items-center gap-2">
              <Images weight="duotone" size={12} className="text-muted-foreground/50" />
              <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.12em]">
                {galleryWorks.length} works · {projects.length} projects
              </span>
            </div>
          </div>
        </div>

        <div className="border-x border-t border-border flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3.5 font-mono text-[10px] tracking-[0.15em] uppercase border-r border-border transition-all duration-150
                ${activeTab === tab.key
                  ? "text-foreground bg-card border-b-2 border-b-blue-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40 border-b border-b-border"
                }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === "shop" && cartCount > 0 && (
                <span className="font-mono text-[8px] text-primary border border-primary/30 bg-primary/5 px-1.5 py-0.5 rounded-sm">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
          <div className="flex-1 border-b border-border" />
        </div>

        {activeTab === "gallery" && (
          <div className="border-x border-border">
            <div className="px-6 md:px-10 pt-8 pb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Selected Works</span>
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em]">2024 – 2025</span>
            </div>
            <div className="px-6 md:px-10 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryWorks.map((work) => {
                const shopItem = work.shopItemId ? shopItems.find((s) => s.id === work.shopItemId) : null;
                return (
                  <div
                    key={work.id}
                    className="group flex flex-col gap-0 rounded-sm border border-border bg-card overflow-hidden hover:-translate-y-0.5 hover:border-border/80 transition-all duration-200"
                  >
                    <div className="relative overflow-hidden" style={{ paddingBottom: "75%" }}>
                      <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
                        <ColourField accent={work.accent} />
                      </div>
                      <div className="absolute inset-0 flex items-end justify-end p-3">
                        <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border tracking-[0.1em] ${statusColor[work.status]}`}>
                          {work.status}
                        </span>
                      </div>
                      <div className="absolute inset-[10%] rounded-sm opacity-10 border" style={{ borderColor: work.accent }} />
                    </div>
                    <div className="px-3 py-3 flex flex-col gap-0.5">
                      <span className="text-sm text-foreground font-medium leading-snug">{work.title}</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{work.medium}</span>
                        <span className="font-mono text-[9px] text-muted-foreground/40">{work.size}</span>
                      </div>
                      {shopItem && shopItem.status === "IN_STOCK" && (
                        <button
                          onClick={() => addToCart(shopItem)}
                          className="mt-2 w-full py-1.5 rounded-sm border border-primary/30 bg-primary/5 font-mono text-[9px] text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 tracking-[0.1em]"
                        >
                          {shopItem.type === "PRINT" ? "Buy Print" : `Buy — ${formatPrice(shopItem.price)}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border px-6 md:px-10 py-8">
              <div className="flex items-center gap-3 mb-6">
                <CalendarBlank weight="duotone" size={14} className="text-muted-foreground" />
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Shows &amp; Exhibitions</span>
              </div>
              <div className="flex flex-col rounded-sm border border-border overflow-hidden">
                {shows.map((show, i) => (
                  <div
                    key={show.title}
                    className={`px-4 py-4 flex flex-col gap-1 ${i < shows.length - 1 ? "border-b border-border/60" : ""} ${show.status === "PAST" ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm text-foreground font-medium leading-snug">{show.title}</span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border shrink-0 tracking-[0.1em] ${show.status === "UPCOMING" ? "text-blue-400 border-blue-400/30 bg-blue-400/5" : "text-muted-foreground/30 border-border"}`}>
                        {show.status}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs font-light">{show.venue}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">{show.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="border-x border-border">
            <div className="px-6 md:px-10 pt-8 pb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Projects</span>
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em]">{projects.length} series</span>
            </div>
            <div className="px-6 md:px-10 pb-10 flex flex-col gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setOpenProject(project)}
                  className="group w-full text-left rounded-sm border border-border bg-card hover:border-blue-400/30 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_hsl(220_40%_55%/0.08)] transition-all duration-200 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 relative shrink-0" style={{ minHeight: "120px" }}>
                      <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-300">
                        <ColourField accent={project.coverAccent} />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 flex gap-1">
                        {project.images.slice(0, 3).map((pi) => (
                          <div key={pi.id} className="w-5 h-5 rounded-sm border border-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(ellipse at 40% 40%, ${pi.accent} 0%, transparent 70%), hsl(24 11% 9%)` }} />
                          </div>
                        ))}
                        {project.images.length > 3 && (
                          <div className="w-5 h-5 rounded-sm border border-white/10 bg-card flex items-center justify-center">
                            <span className="font-mono text-[7px] text-muted-foreground/50">+{project.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-5 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-2xl text-foreground leading-tight">{project.title}</h3>
                        <div className="flex items-center gap-2 shrink-0 mt-1">
                          <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border tracking-[0.1em] ${projectStatusColor[project.status]}`}>
                            {project.status}
                          </span>
                          <FolderOpen weight="duotone" size={14} className="text-muted-foreground/30 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
                        <span className="text-border text-xs">·</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{project.medium}</span>
                        <span className="text-border text-xs">·</span>
                        <span className="font-mono text-[10px] text-muted-foreground/50">{project.images.length} images</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">{project.description}</p>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-12 shrink-0 border-l border-border">
                      <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </button>
              ))}

              <button className="w-full rounded-sm border border-dashed border-border py-6 flex items-center justify-center gap-2 font-mono text-[10px] text-muted-foreground/40 hover:text-primary/60 hover:border-primary/30 transition-all duration-200 group">
                <Plus size={12} className="group-hover:scale-110 transition-transform" />
                New Project
              </button>
            </div>
          </div>
        )}

        {activeTab === "shop" && (
          <div className="border-x border-border">
            <div className="px-6 md:px-10 pt-8 pb-3 flex items-center gap-3">
              <Tag weight="duotone" size={13} className="text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Shop</span>
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.1em]">{shopItems.length} items</span>
            </div>

            <div className="px-6 md:px-10 pb-10">
              <div className="flex flex-wrap gap-2 mb-6">
                {(["ORIGINAL", "PRINT", "OTHER"] as const).map((type) => (
                  <span key={type} className="font-mono text-[9px] text-muted-foreground/50 border border-border px-2.5 py-1 rounded-sm tracking-[0.1em] cursor-default">
                    {shopTypeLabel[type]}s
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.map((item) => {
                  const inCart = cartLines.find((l) => l.item.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col rounded-sm border border-border bg-card overflow-hidden hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="relative overflow-hidden" style={{ paddingBottom: "60%" }}>
                        <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-300">
                          <ColourField accent={item.accent} />
                        </div>
                        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                          <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border tracking-[0.1em] ${shopStatusColor[item.status]}`}>
                            {item.status === "MADE_TO_ORDER" ? "MADE TO ORDER" : item.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="font-mono text-[8px] text-muted-foreground/50 border border-border bg-background/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                            {shopTypeLabel[item.type]}
                          </span>
                        </div>
                        {item.edition && (
                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="font-mono text-[8px] text-muted-foreground/50 border border-border bg-background/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                              {item.edition}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-3.5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-foreground font-medium leading-snug">{item.title}</span>
                          <span className="font-mono text-sm text-primary shrink-0">{formatPrice(item.price)}</span>
                        </div>

                        {item.status !== "SOLD_OUT" ? (
                          <button
                            onClick={() => addToCart(item)}
                            className={`w-full py-2 rounded-sm font-mono text-[10px] tracking-[0.1em] transition-all duration-150 flex items-center justify-center gap-2
                              ${inCart
                                ? "bg-primary text-primary-foreground border border-primary"
                                : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"
                              }`}
                          >
                            <ShoppingCart size={11} weight="duotone" />
                            {inCart ? `In Cart (${inCart.qty})` : "Add to Cart"}
                          </button>
                        ) : (
                          <div className="w-full py-2 rounded-sm border border-border font-mono text-[10px] text-muted-foreground/30 text-center tracking-[0.1em]">
                            Sold Out
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-sm border border-border bg-card p-4 flex items-start gap-3">
                <CheckCircle weight="duotone" size={16} className="text-green-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] text-green-400 tracking-[0.15em] uppercase">Secure checkout</span>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Payments processed via Stripe. All originals shipped with certificate of authenticity. Prints dispatched within 5 working days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-x border-t border-border px-6 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em] uppercase">Commissions &amp; Enquiries</span>
            <p className="text-sm text-muted-foreground font-light">Oil on canvas · Print editions · Exhibition loans · 6–8 week lead time</p>
          </div>
          <button className="flex items-center gap-2 py-2 px-5 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200 shrink-0">
            <Envelope weight="duotone" size={13} />
            Send an Enquiry
          </button>
        </div>

        <div className="border border-t-0 border-border px-5 py-2.5 flex items-center justify-between bg-muted/30">
          <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">claramoran.locallayer.app</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.12em]">powered by LocalLayer</span>
          </div>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border mt-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] uppercase">kit.artist — template preview</span>
          <p className="text-muted-foreground text-sm font-light">Gallery, projects, shop, and commissions — controlled from one dashboard.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 py-2 px-4 rounded-sm border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 shrink-0">
          <ArrowLeft size={12} weight="bold" />
          Back to LocalLayer
        </Link>
      </div>

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
      {cartOpen && <CartDrawer lines={cartLines} onUpdate={updateCart} onClose={() => setCartOpen(false)} />}

    </div>
  );
}
