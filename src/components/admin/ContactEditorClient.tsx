"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useMobile } from "@/hooks/useMobile";
import { saveContactInfoAction } from "@/app/admin/actions";

/* ─── icon SVGs ─────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 2.5A1 1 0 0 1 3 1.5h1.5l1 2.5-.75.75A6.5 6.5 0 0 0 7.25 7l.75-.75 2.5 1V8.5a1 1 0 0 1-1 1C4.5 9.5 2 5.5 2 2.5z" stroke="#d97706" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 6.5-3.5 6.5S2.5 7 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="#d97706" strokeWidth="1.1" />
    <circle cx="6" cy="4.5" r="1.2" fill="#d97706" />
  </svg>
);
const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1.5" y="2.5" width="9" height="7" rx="1" stroke="#d97706" strokeWidth="1.1" />
    <path d="M1.5 4l4.5 3 4.5-3" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="#d97706" strokeWidth="1.1" />
    <path d="M6 1.5S4 4 4 6s2 4.5 2 4.5M6 1.5S8 4 8 6s-2 4.5-2 4.5M1.5 6h9" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="#d97706" strokeWidth="1.1" />
    <circle cx="6" cy="6" r="2" stroke="#d97706" strokeWidth="1.1" />
    <circle cx="8.8" cy="3.2" r="0.6" fill="#d97706" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7 2H5.5A1.5 1.5 0 0 0 4 3.5V5H2.5v2H4v4.5h2V7h1.5l.5-2H6V3.5A.5.5 0 0 1 6.5 3H7V2z" stroke="#d97706" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M8 1.5v7a2.5 2.5 0 1 1-2-2.45V4.3A4.5 4.5 0 1 0 10 8.5V4a5.5 5.5 0 0 1-2-.5" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 5.5l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── US states ─────────────────────────────────────────── */
const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","Washington D.C."],["FL","Florida"],
  ["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],
  ["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],
  ["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],
  ["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],
  ["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],
  ["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],
  ["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],
  ["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],
  ["WY","Wyoming"],
] as const;

/* ─── FieldRow ───────────────────────────────────────────── */
function FieldRow({
  icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px", borderRadius: 9, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.062)", transition: "border-color 0.13s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.062)"; }}
    >
      {icon && (
        <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="label-upper" style={{ display: "block", marginBottom: 3 }}>{label}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ background: "transparent", border: "none", outline: "none", color: "#c9c7c0", fontSize: 13, width: "100%", caretColor: "#d97706", fontFamily: "inherit" }}
        />
        {helper && <p style={{ fontSize: 10, color: "#3a3a42", marginTop: 3 }}>{helper}</p>}
      </div>
    </div>
  );
}

/* ─── StateCombobox ──────────────────────────────────────── */
function StateCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length === 0
    ? US_STATES
    : US_STATES.filter(([abbr, name]) =>
        abbr.toLowerCase().startsWith(query.toLowerCase()) ||
        name.toLowerCase().includes(query.toLowerCase())
      );

  function select(abbr: string) {
    onChange(abbr);
    setQuery(abbr);
    setOpen(false);
  }

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{ display: "flex", alignItems: "flex-start", padding: "11px 14px", borderRadius: 9, background: "rgba(255,255,255,0.022)", border: `1px solid ${open ? "rgba(217,119,6,0.35)" : "rgba(255,255,255,0.062)"}`, transition: "border-color 0.13s" }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.062)"; }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="label-upper" style={{ display: "block", marginBottom: 3 }}>State</span>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="TX"
            style={{ background: "transparent", border: "none", outline: "none", color: "#c9c7c0", fontSize: 13, width: "100%", caretColor: "#d97706", fontFamily: "inherit" }}
          />
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, marginTop: 14, opacity: 0.3 }}>
          <path d="M2 3.5l3 3 3-3" stroke="#c9c7c0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#18181f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", maxHeight: 200, overflowY: "auto" }}>
          {filtered.map(([abbr, name]) => (
            <div
              key={abbr}
              onMouseDown={() => select(abbr)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(217,119,6,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706", width: 24, flexShrink: 0 }}>{abbr}</span>
              <span style={{ fontSize: 12, color: "#7a7a84" }}>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── component ──────────────────────────────────────────── */
export function ContactEditorClient({
  phone: initPhone,
  email: initEmail,
  addressLine1: initLine1,
  city: initCity,
  state: initState,
  zip: initZip,
  facebook: initFacebook,
  instagram: initInstagram,
  tiktok: initTiktok,
  googleBusiness: initGoogleBusiness,
}: {
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  googleBusiness: string;
}) {
  const isMobile = useMobile();
  const [phone, setPhone] = useState(initPhone);
  const [email, setEmail] = useState(initEmail);
  const [line1, setLine1] = useState(initLine1);
  const [city, setCity] = useState(initCity);
  const [state, setState] = useState(initState);
  const [zip, setZip] = useState(initZip);
  const [facebook, setFacebook] = useState(initFacebook);
  const [instagram, setInstagram] = useState(initInstagram);
  const [tiktok, setTiktok] = useState(initTiktok);
  const [googleBusiness, setGoogleBusiness] = useState(initGoogleBusiness);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fullAddress = [line1, city, state, zip].filter(Boolean).join(", ");
  const mapsUrl = fullAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
    : "";

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/contact");
      fd.set("phone", phone);
      fd.set("email", email);
      fd.set("address_line_1", line1);
      fd.set("city", city);
      fd.set("state", state);
      fd.set("zip", zip);
      fd.set("facebook_url", facebook);
      fd.set("instagram_url", instagram);
      fd.set("tiktok_url", tiktok);
      fd.set("google_business_url", googleBusiness);
      await saveContactInfoAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div
      className="animate-fade-in"
      style={isMobile
        ? { display: "flex", flexDirection: "column", overflow: "auto", padding: "2px", gap: "12px" }
        : { height: "100%", display: "flex", overflow: "hidden", padding: "2px", gap: "12px" }
      }
    >
      {/* ── LEFT: Contact fields ── */}
      <div style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>Contact Info</span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            style={saved ? {
              display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
              fontSize: 11, fontWeight: 700, background: "rgba(74,222,128,0.08)", color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)", cursor: "default",
            } : {
              display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", border: "none", background: "#d97706", color: "#fff",
              transition: "background 0.15s",
            }}
          >
            {saved ? <><CheckIcon /> Saved</> : isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Business info */}
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 10, color: "#3e3e46" }}>Business Info</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldRow
                icon={<PhoneIcon />}
                label="Phone"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="(555) 000-0000"
                helper="Used for the Call Now button on your site"
              />
              <FieldRow
                icon={<MailIcon />}
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="hello@yourrestaurant.com"
                helper="Optional — shown in the contact section if entered"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 10, color: "#3e3e46" }}>Location</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldRow
                icon={<PinIcon />}
                label="Street Address"
                value={line1}
                onChange={setLine1}
                placeholder="123 Main Street"
                helper="Street number and name only"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 8 }}>
                <FieldRow icon={<PinIcon />} label="City" value={city} onChange={setCity} placeholder="Small Town" />
                <StateCombobox value={state} onChange={setState} />
                <FieldRow label="ZIP" value={zip} onChange={setZip} placeholder="75001" />
              </div>
            </div>
          </div>

          {/* Online presence */}
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 10, color: "#3e3e46" }}>Online Presence</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldRow icon={<FacebookIcon />} label="Facebook" value={facebook} onChange={setFacebook} placeholder="facebook.com/yourpage" helper="Paste the full URL to your Facebook page" />
              <FieldRow icon={<InstagramIcon />} label="Instagram" value={instagram} onChange={setInstagram} placeholder="@yourhandle" helper="Your @handle or full Instagram URL" />
              <FieldRow icon={<TikTokIcon />} label="TikTok" value={tiktok} onChange={setTiktok} placeholder="@yourhandle" />
              <FieldRow icon={<GlobeIcon />} label="Google Business" value={googleBusiness} onChange={setGoogleBusiness} placeholder="Paste your Google Business profile URL" helper="Find it by searching your business name on Google Maps → Share → Copy link" />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Map + live card ── */}
      <div style={{ width: isMobile ? "100%" : 272, minWidth: isMobile ? undefined : 272, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Map panel */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div className="panel-header">
            <span className="label-upper">Directions Link</span>
          </div>
          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
            <p style={{ fontSize: 11, color: "#4b4b54", margin: 0, lineHeight: 1.5 }}>
              Built automatically from your address. The "Get Directions" button on your site links here.
            </p>
            <div
              style={{ flex: 1, borderRadius: 8, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.058)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, minHeight: 80 }}
            >
              <PinIcon />
              {fullAddress ? (
                <>
                  <p style={{ fontSize: 11, color: "#7a7a84", textAlign: "center", margin: 0 }}>{fullAddress}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "#d97706", textDecoration: "underline" }}
                  >
                    Open in Google Maps ↗
                  </a>
                </>
              ) : (
                <p style={{ fontSize: 11, color: "#3a3a42", margin: 0 }}>Enter an address to see the link</p>
              )}
            </div>
          </div>
        </div>

        {/* Live preview card */}
        <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          <div className="panel-header">
            <span className="label-upper">Live Preview</span>
          </div>
          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: <PhoneIcon />, val: phone || "No phone entered" },
              { icon: <PinIcon />,   val: fullAddress || "No address entered" },
              { icon: <MailIcon />,  val: email || "No email entered" },
            ].map(({ icon, val }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#7a7a84", wordBreak: "break-all" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
