"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { List, X } from "@phosphor-icons/react";
import { createBrowserClient } from "@supabase/ssr";

const navLinks = [
  { label: "Kits",         href: "#kit-selector"       },
  { label: "How It Works", href: "#how-it-works"        },
  { label: "Live Control", href: "#live-control-preview" },
  { label: "vs. Builders", href: "#why-locallayer"      },
  { label: "Pricing",      href: "#pricing"             },
];

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">

          {/* Wordmark */}
          <a href="#" className="flex items-center gap-3 shrink-0" aria-label="LocalLayer home">
            <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
              <span className="font-mono text-[9px] text-primary-foreground font-bold tracking-tight">LL</span>
            </div>
            <span className="font-mono text-sm font-medium tracking-[0.05em] text-foreground">
              LocalLayer
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground border border-border/60 px-2 py-0.5 rounded-sm bg-muted/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-sm hover:bg-muted/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/50 uppercase select-none">
              sys:ready
            </span>
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost" size="sm" className="font-mono text-[11px] tracking-wide px-3">
                  <a href="/admin">Dashboard</a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="font-mono text-[11px] tracking-wide px-3"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="font-mono text-[11px] tracking-wide px-3">
                  <a href="/admin/login">Sign In</a>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground rounded-sm font-mono text-[11px] tracking-wide hover:-translate-y-0.5 transition-all duration-150 px-4">
                  <a href="/onboarding">Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn ? (
              <Button asChild size="sm" className="bg-primary text-primary-foreground rounded-sm font-mono text-[11px] px-3">
                <a href="/admin">Dashboard</a>
              </Button>
            ) : (
              <Button asChild size="sm" className="bg-primary text-primary-foreground rounded-sm font-mono text-[11px] px-3">
                <a href="/onboarding">Get Started</a>
              </Button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
            >
              {open ? <X size={18} weight="duotone" /> : <List size={18} weight="duotone" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="max-w-7xl mx-auto px-5 py-2 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-3 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors duration-150"
              >
                <span>{link.label}</span>
                <span className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.12em]">{link.href.replace("#", "/")}</span>
              </a>
            ))}
            <div className="mt-2 pt-3 border-t border-border flex items-center justify-between px-3 pb-2">
              <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground hover:text-foreground uppercase transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <a
                  href="/admin/login"
                  className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground hover:text-foreground uppercase transition-colors"
                >
                  Sign In
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
