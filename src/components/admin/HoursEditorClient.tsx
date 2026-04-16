"use client";

import { useState, useTransition } from "react";
import { saveHourAction, deleteHourAction, saveQuickHoursAction } from "@/app/admin/actions";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type DayName = (typeof DAY_NAMES)[number];

type DayState = { open: string; close: string; closed: boolean; id?: string };
type WeekState = Record<DayName, DayState>;

type HourEntry = {
  id: string;
  dayLabel: string;
  openText: string;
  isActive: boolean;
  sortOrder: number;
};

/* ─── time utilities ─────────────────────────────────────── */

/** "5:30 AM" → "05:30" */
function toHHMM(str: string): string {
  const m = str.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return "";
  let h = parseInt(m[1]);
  const min = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

/** "05:30" → "5:30 AM" */
function fmt(t: string): string {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** "5:30 AM – 3:00 PM" → { open: "05:30", close: "15:00" } */
function parseOpenText(text: string): { open: string; close: string } {
  const parts = text.split(/[–—]/).map((s) => s.trim());
  return {
    open: parts[0] ? toHHMM(parts[0]) : "",
    close: parts[1] ? toHHMM(parts[1]) : "",
  };
}

/** Build week state from BranchKit hours rows */
function initWeek(hours: HourEntry[]): WeekState {
  const result = {} as WeekState;
  for (const day of DAY_NAMES) {
    const entry = hours.find((e) =>
      e.dayLabel.toLowerCase().includes(day.toLowerCase().slice(0, 3))
    );
    if (entry) {
      const { open, close } = parseOpenText(entry.openText);
      result[day] = { open, close, closed: !entry.isActive, id: entry.id };
    } else {
      result[day] = { open: "", close: "", closed: true };
    }
  }
  return result;
}

/* ─── component ──────────────────────────────────────────── */

export function HoursEditorClient({
  hours,
  quickHoursLabel,
}: {
  hours: HourEntry[];
  quickHoursLabel: string;
}) {
  const [week, setWeek] = useState<WeekState>(() => initWeek(hours));
  const [selected, setSelected] = useState<DayName>("Monday");
  const [isPending, startTransition] = useTransition();

  const sel = week[selected];
  const openCount = DAY_NAMES.filter((d) => !week[d].closed).length;

  function updateDay(day: DayName, patch: Partial<DayState>) {
    setWeek((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function copyToDay(targetDay: DayName) {
    updateDay(targetDay, { open: sel.open, close: sel.close, closed: false });
  }

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/hours");
      fd.set("day_label", selected);
      fd.set("open_text", sel.open && sel.close ? `${fmt(sel.open)} – ${fmt(sel.close)}` : sel.open || "");
      fd.set("is_active", sel.closed ? "" : "on");
      if (sel.id) fd.set("hour_id", sel.id);
      await saveHourAction(fd);
    });
  }

  function handleSaveQuick(formData: FormData) {
    startTransition(async () => {
      await saveQuickHoursAction(formData);
    });
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
        padding: "2px",
        gap: "12px",
      }}
    >
      {/* ── LEFT: Day selector ── */}
      <div
        style={{
          width: 184,
          minWidth: 184,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="panel-header">
          <span className="label-upper">Week Days</span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#4ade80",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {openCount} open
          </span>
        </div>

        <div style={{ flex: 1, padding: "6px", overflowY: "auto" }}>
          {DAY_NAMES.map((day) => {
            const d = week[day];
            const active = selected === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(day)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 10px",
                  borderRadius: 8,
                  marginBottom: 3,
                  background: active ? "rgba(217,119,6,0.09)" : "transparent",
                  border: active
                    ? "1px solid rgba(217,119,6,0.2)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: d.closed ? "#252530" : "#4ade80",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#e2e0d8" : "#7a7a84",
                  }}
                >
                  {day}
                </span>
                {d.closed ? (
                  <span
                    style={{
                      fontSize: 9,
                      color: "#252530",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    CLOSED
                  </span>
                ) : (
                  <span style={{ fontSize: 9, color: "#3a3a42" }}>{fmt(d.open)}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: Day editor ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: sel.closed ? "#252530" : "#4ade80",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>
              {selected}
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateDay(selected, { closed: !sel.closed })}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              background: sel.closed
                ? "rgba(74,222,128,0.08)"
                : "rgba(239,68,68,0.08)",
              color: sel.closed ? "#4ade80" : "#f87171",
              border: `1px solid ${sel.closed ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {sel.closed ? "Mark Open" : "Mark Closed"}
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {sel.closed ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.025)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* X circle */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="#2e2e35" strokeWidth="1.5" />
                  <path d="M8 8l6 6M14 8l-6 6" stroke="#2e2e35" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontSize: 13, color: "#4b4b54", margin: 0 }}>
                {selected} is marked as Closed
              </p>
              <p style={{ fontSize: 11, color: "#2e2e35", margin: 0 }}>
                Toggle above to set open hours
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
              {/* Time pickers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {(
                  [
                    { label: "Opening Time", key: "open" as const },
                    { label: "Closing Time", key: "close" as const },
                  ] as const
                ).map(({ label, key }) => (
                  <div key={key}>
                    <span
                      className="label-upper"
                      style={{ display: "block", marginBottom: 7 }}
                    >
                      {label}
                    </span>
                    <input
                      type="time"
                      value={sel[key]}
                      onChange={(e) => updateDay(selected, { [key]: e.target.value })}
                      className="ctrl-input"
                      style={{ fontSize: 14 }}
                    />
                    <p style={{ fontSize: 11, color: "#5a5a64", marginTop: 5 }}>
                      {fmt(sel[key])}
                    </p>
                  </div>
                ))}
              </div>

              {/* Session summary */}
              {sel.open && sel.close && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 8,
                    background: "rgba(217,119,6,0.06)",
                    border: "1px solid rgba(217,119,6,0.15)",
                  }}
                >
                  <span
                    className="label-upper"
                    style={{ display: "block", marginBottom: 4 }}
                  >
                    Session
                  </span>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#c9c7c0",
                      margin: 0,
                    }}
                  >
                    {fmt(sel.open)} — {fmt(sel.close)}
                  </p>
                </div>
              )}

              {/* Copy to other days */}
              <div>
                <span
                  className="label-upper"
                  style={{ display: "block", marginBottom: 8 }}
                >
                  Copy to Other Days
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {DAY_NAMES.filter((d) => d !== selected).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => copyToDay(day)}
                      className="btn-ghost"
                      style={{ padding: "5px 10px", fontSize: 11 }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(217,119,6,0.28)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,255,255,0.07)";
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer save */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? "Saving…" : "Save Hours"}
          </button>
        </div>
      </div>

      {/* ── RIGHT: Week overview + quick summary ── */}
      <div
        style={{
          width: 212,
          minWidth: 212,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="panel-header">
          <span className="label-upper">Week Overview</span>
        </div>

        {/* Week list */}
        <div style={{ flex: 1, padding: "6px 12px", overflowY: "auto" }}>
          {DAY_NAMES.map((day) => {
            const d = week[day];
            return (
              <div
                key={day}
                onClick={() => setSelected(day)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 2px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: selected === day ? "#c9c7c0" : "#5a5a64",
                    fontWeight: selected === day ? 600 : 400,
                    width: 28,
                  }}
                >
                  {day.slice(0, 3)}
                </span>
                {d.closed ? (
                  <span
                    style={{
                      fontSize: 10,
                      color: "#252530",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Closed
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 500, color: "#6b6b74" }}>
                    {fmt(d.open)} – {fmt(d.close)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick summary */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          <form action={handleSaveQuick}>
            <input type="hidden" name="redirect_to" value="/admin/hours" />
            <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>
              Quick Summary
            </span>
            <textarea
              name="quick_info_hours_label"
              defaultValue={quickHoursLabel}
              rows={3}
              className="ctrl-input"
              style={{ resize: "none", fontSize: 11 }}
            />
            <p style={{ fontSize: 9, color: "#2e2e35", marginTop: 5, marginBottom: 8 }}>
              Shown on homepage hero section
            </p>
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Save Summary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
