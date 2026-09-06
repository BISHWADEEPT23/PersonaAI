import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PeacockQuillNibLogo } from "../components/PeacockQuillNibLogo";

const PEN_IMG = "https://images.unsplash.com/photo-1512255631150-62ae26eb1966?w=700&h=380&fit=crop&auto=format";
const PAD_IMG = "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=700&h=380&fit=crop&auto=format";
const JOURNAL_IMG = "https://images.unsplash.com/photo-1569360556894-15dca0c6ff1a?w=700&h=420&fit=crop&auto=format";
const WRITING_IMG = "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?w=700&h=420&fit=crop&auto=format";
const DESK_IMG = "https://images.unsplash.com/photo-1775129667571-7fa3f51c05e3?w=600&h=380&fit=crop&auto=format";

function Badge({ children, variant = "dark" }: { children: React.ReactNode; variant?: "dark" | "light" | "lavender" }) {
  const base = "inline-flex items-center gap-1.5 text-[10px] tracking-widest font-mono uppercase px-3 py-1.5 rounded-full border";
  if (variant === "dark")
    return <span className={`${base} border-white/20 text-white/70`}>{children}</span>;
  if (variant === "lavender")
    return <span className={`${base} border-[#7c6fbf]/30 text-[#7c6fbf]`}>{children}</span>;
  return <span className={`${base} border-[rgba(26,22,18,0.2)] text-[#6b6256]`}>{children}</span>;
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  return (
    <span className={`inline-block border border-[rgba(26,22,18,0.2)] rounded-full px-4 py-1.5 text-sm text-[#6b6256] ${className}`}>
      {children}
    </span>
  );
}

function SpecRow({ label, sublabel, fillPct, dark }: { label: string; sublabel: string; fillPct: number; dark?: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <p className={`text-sm mb-0.5 ${dark ? "text-white/90" : "text-[#1a1612]"}`}>
        <span className="font-serif text-lg font-medium leading-none">{label}</span>
        <span className={`font-sans text-[11px] ml-1 ${dark ? "text-white/50" : "text-[#6b6256]"}`}>{sublabel}</span>
      </p>
      <p className={`font-mono text-[9px] tracking-widest uppercase mb-2 ${dark ? "text-white/40" : "text-[#a09890]"}`}>
        {/* label handled outside */}
      </p>
      <div className={`progress-bar ${dark ? "" : "light"}`}>
        <div className={`progress-fill ${dark ? "" : "light"}`} style={{ width: `${fillPct}%` }} />
      </div>
    </div>
  );
}

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-5 bg-[var(--bg)]/90 backdrop-blur-sm border-b border-[rgba(26,22,18,0.06)]">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="mr-2 p-2 -ml-2 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors rounded-full hover:bg-[rgba(26,22,18,0.05)]"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PeacockQuillNibLogo className="w-8 h-8 drop-shadow-sm" />
        <span className="font-serif text-base font-medium tracking-tight hidden sm:block">GenReflect</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-[#6b6256]">
        <a href="#products" className="hover:text-[var(--ink)] transition-colors">Products</a>
        <a href="#how" className="hover:text-[var(--ink)] transition-colors">How it works</a>
        <a href="#concept" className="hover:text-[var(--ink)] transition-colors">Philosophy</a>
        <a href="#for-you" className="hover:text-[var(--ink)] transition-colors">For you</a>
      </div>
      <button className="text-sm border border-[rgba(26,22,18,0.25)] rounded-full px-5 py-2 hover:bg-[var(--ink)] hover:text-white transition-all duration-200">
        Join waitlist
      </button>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
      <p className="font-mono text-[10px] tracking-widest uppercase text-[#a09890] mb-8">
        Analog writing · Digital memory
      </p>
      <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] font-medium leading-[1.05] tracking-tight mb-6 max-w-5xl">
        Your handwriting,<br />
        <em className="not-italic" style={{ color: "var(--accent-italic)" }}>finally remembered.</em>
      </h1>
      <p className="text-[clamp(1rem,1.5vw,1.2rem)] text-[#6b6256] max-w-xl leading-relaxed mb-12">
        GenReflect pairs a precision smart pen with an intelligent syncing pad — so every word you write on paper lives instantly in your digital world.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="bg-[var(--ink)] text-white rounded-full px-8 py-3.5 text-sm font-medium hover:bg-[#2d2520] transition-colors">
          Join the waitlist
        </button>
        <button className="border border-[rgba(26,22,18,0.25)] rounded-full px-8 py-3.5 text-sm text-[#6b6256] hover:border-[rgba(26,22,18,0.5)] transition-colors">
          See how it works
        </button>
      </div>
      <div className="mt-20 w-full max-w-5xl relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden h-64 bg-[var(--navy)]">
            <img src={PEN_IMG} alt="GenReflect smart pen" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
          </div>
          <div className="rounded-2xl overflow-hidden h-64 bg-[#f0e9dc]">
            <img src={PAD_IMG} alt="GenReflect syncing pad" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="products" className="px-6 py-24">
      <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-medium text-center mb-14 leading-tight">
        Two pieces.{" "}
        <em className="italic" style={{ color: "var(--accent-italic)" }}>One ritual.</em>
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Smart Pen Card — dark navy */}
        <div
          className="rounded-3xl p-8 flex flex-col"
          style={{ background: "var(--navy)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <Badge variant="dark">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] inline-block" />
              Smart Pen
            </Badge>
            <span className="font-mono text-[10px] text-white/30 tracking-widest">GEN 01</span>
          </div>

          <div className="rounded-2xl overflow-hidden mb-6 h-52 bg-[#0a1220]">
            <img src={PEN_IMG} alt="GenReflect smart pen" className="w-full h-full object-cover opacity-85" />
          </div>

          <h3 className="font-serif text-3xl font-medium text-white mb-3">
            GenReflect <em className="italic" style={{ color: "var(--accent-green)" }}>Pen</em>
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Engineered for the way you actually write. Every stroke captured at 4096 pressure levels — synced before your hand lifts off the page.
          </p>

          <div className="mt-auto border-t border-white/10 pt-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "High", sub: "precision", tag: "PRESSURE SENSING", fill: 100 },
                { label: "Near", sub: "instant", tag: "SYNC SPEED", fill: 70 },
                { label: "All", sub: "day", tag: "BATTERY LIFE", fill: 85 },
              ].map((s) => (
                <div key={s.tag}>
                  <p className="text-white text-lg font-serif font-medium leading-none mb-0.5">
                    {s.label}{" "}
                    <span className="text-white/50 text-[11px] font-sans">{s.sub}</span>
                  </p>
                  <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase mb-2">{s.tag}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.fill}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Syncing Pad Card — warm cream */}
        <div
          className="rounded-3xl p-8 flex flex-col border"
          style={{ background: "var(--cream-card)", borderColor: "rgba(26,22,18,0.1)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <Badge variant="light">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a09890] inline-block" />
              Syncing Pad
            </Badge>
            <span className="font-mono text-[10px] text-[#a09890] tracking-widest">A5 FORMAT</span>
          </div>

          <div className="rounded-2xl overflow-hidden mb-6 h-52 bg-[#e8e0d2]">
            <img src={WRITING_IMG} alt="GenReflect syncing pad" className="w-full h-full object-cover" />
          </div>

          <h3 className="font-serif text-3xl font-medium text-[var(--ink)] mb-3">
            GenReflect <em className="italic" style={{ color: "var(--accent-italic)" }}>Pad</em>
          </h3>
          <p className="text-[#6b6256] text-sm leading-relaxed mb-6">
            Not just a notebook. An intelligent surface that listens. Premium paper meets an electromagnetic grid — invisible to the eye, essential to the experience.
          </p>

          <div className="mt-auto border-t pt-6" style={{ borderColor: "rgba(26,22,18,0.1)" }}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Premium", sub: "grade", tag: "PAPER QUALITY", fill: 90 },
                { label: "Dot", sub: "grid", tag: "GRID STYLE", fill: 60 },
                { label: "A5", sub: "size", tag: "FORMAT", fill: 75 },
              ].map((s) => (
                <div key={s.tag}>
                  <p className="text-[var(--ink)] text-lg font-serif font-medium leading-none mb-0.5">
                    {s.label}{" "}
                    <span className="text-[#a09890] text-[11px] font-sans">{s.sub}</span>
                  </p>
                  <p className="font-mono text-[9px] text-[#a09890] tracking-widest uppercase mb-2">{s.tag}</p>
                  <div className="progress-bar light">
                    <div className="progress-fill light" style={{ width: `${s.fill}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-tight">
            Three steps.{" "}
            <em className="italic" style={{ color: "var(--accent-italic)" }}>One</em>
            <br />
            <em className="italic" style={{ color: "var(--accent-italic)" }}>ritual.</em>
          </h2>
          <p className="text-[#6b6256] text-sm max-w-xs leading-relaxed md:text-right">
            From blank page to searchable digital note — without changing how you write.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1 — dark green, tall */}
          <div
            className="rounded-3xl p-8 flex flex-col row-span-2 min-h-[500px]"
            style={{ background: "var(--green-dark)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] text-white/30 tracking-widest">STEP 01</span>
              <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/60">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </div>
            </div>

            <Badge variant="dark">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] inline-block" />
              Open the Pad
            </Badge>

            <h3 className="font-serif text-[2.2rem] font-medium text-white leading-tight mt-5 mb-4">
              Write on the syncing pad
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-auto">
              Place the GenReflect pad on any surface. Open to a fresh page. The electromagnetic grid beneath the paper is already listening — invisible, silent, ready.
            </p>

            <div className="mt-8 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
                <span className="font-mono text-[10px] text-white/50 tracking-widest">PAD ACTIVE</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 mb-2 overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-[var(--accent-green)] opacity-80" />
              </div>
              <div className="h-1 rounded-full bg-white/10 mb-4 overflow-hidden">
                <div className="h-full w-1/4 rounded-full bg-[var(--accent-green)] opacity-40" />
              </div>
              <span className="font-mono text-[10px] text-white/30 tracking-wider">| writing...</span>
              <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mt-4">
                PREMIUM DOT-GRID PAPER · A5 FORMAT
              </p>
            </div>
          </div>

          {/* Step 2 — cream */}
          <div
            className="rounded-3xl p-8 flex flex-col border"
            style={{ background: "var(--cream-card)", borderColor: "rgba(26,22,18,0.08)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] text-[#a09890] tracking-widest">STEP 02</span>
              <div className="flex items-center gap-4">
                <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(26,22,18,0.08)", background: "var(--cream-card)" }}>
                  <Badge variant="light">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a09890] inline-block" />
                    Capturing
                  </Badge>
                  <div className="mt-3 space-y-1.5">
                    {[100, 85, 60, 45].map((w, i) => (
                      <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "var(--accent-italic)", opacity: 0.4 + i * 0.1 }} />
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-[#a09890] mt-3 tracking-wider">
                    Pressure-sensitive · Bluetooth ready
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-[rgba(26,22,18,0.15)] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#6b6256]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </div>
              </div>
            </div>

            <Badge variant="light">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a09890] inline-block" />
              Pick up the pen
            </Badge>

            <h3 className="font-serif text-[1.8rem] font-medium text-[var(--ink)] leading-tight mt-4 mb-3">
              Pen captures every thought
            </h3>
            <p className="text-[#6b6256] text-sm leading-relaxed">
              The GenReflect pen writes exactly like a quality ballpoint. As your hand moves, pressure, angle, and position are recorded in real time — no lag, no interruption.
            </p>
          </div>

          {/* Step 3 — lavender */}
          <div
            className="rounded-3xl p-8 flex flex-col"
            style={{ background: "var(--lavender)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] text-[#7c6fbf]/60 tracking-widest">STEP 03</span>
              <div className="flex items-center gap-4">
                <div className="rounded-xl p-4 bg-white/60 border border-[#7c6fbf]/10 flex-1">
                  <Badge variant="lavender">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c6fbf] inline-block" />
                    Synced
                  </Badge>
                  <div className="mt-3 space-y-1.5 text-sm">
                    {["Phone", "Tablet", "Browser"].map((d) => (
                      <div key={d} className="flex justify-between items-center">
                        <span className="text-[#6b6256] font-mono text-[11px]">{d}</span>
                        <span className="text-[#7c6fbf] text-xs">• ✓</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-[#7c6fbf]/60 mt-3 tracking-wider">
                    Near-instant · Cross-platform
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-[#7c6fbf]/25 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#7c6fbf]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
              </div>
            </div>

            <Badge variant="lavender">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c6fbf] inline-block" />
              Watch it appear
            </Badge>

            <h3 className="font-serif text-[1.8rem] font-medium leading-tight mt-4 mb-3" style={{ color: "#3d3470" }}>
              Real-time sync to your device
            </h3>
            <p className="text-[#5a5280] text-sm leading-relaxed">
              The moment your pen lifts, your words are already in the app. Searchable, shareable, and safe — your handwriting lives digitally without you doing a thing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConceptSection() {
  const [active, setActive] = useState(0);

  const cards = [
    {
      id: "[001]",
      bg: "var(--green-dark)",
      dark: true,
      title: <>Analog soul. <em className="italic" style={{ color: "var(--accent-green)" }}>Digital memory.</em></>,
      body: "The concept behind GenReflect is to make the act of writing on paper feel magical again — by giving every word you write a second life in your digital world. No scanning, no photographing, no typing. Just write.",
      bullets: [
        { l: "Write naturally", s: "On real paper, with real ink" },
        { l: "Search everything", s: "Find any note by keyword" },
        { l: "Sync instantly", s: "Appears in your app as you write" },
        { l: "Keep the original", s: "Physical and digital, both preserved" },
      ],
      label: "CONCEPT ACTIVE",
    },
    {
      id: "[002]",
      bg: "var(--cream-card)",
      dark: false,
      title: <>Still feels like <em className="italic" style={{ color: "var(--accent-italic)" }}>writing</em></>,
      body: "No special paper. No weird digital stylus. The GenReflect pen writes on the pad exactly like a quality ballpoint — because it is one.",
      bullets: [],
      label: "NATURAL WRITING EXPERIENCE",
    },
    {
      id: "[003]",
      bg: "var(--lavender)",
      dark: false,
      title: <>Works where <em className="italic" style={{ color: "var(--lavender-dark)" }}>you do</em></>,
      body: "iOS, Android, macOS, browser. Your notes follow you everywhere without friction — searchable, organised, and always readable.",
      bullets: [],
      label: "CROSS-PLATFORM",
    },
  ];

  return (
    <section id="concept" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-medium mb-3 leading-tight">
          The idea is{" "}
          <em className="italic" style={{ color: "var(--accent-italic)" }}>simple.</em>
        </h2>
        <p className="text-[#6b6256] text-sm max-w-md leading-relaxed mb-14">
          Your handwriting carries something a keyboard never will — intention, texture, and feeling. GenReflect is being built to honor that.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 flex flex-col cursor-pointer transition-all duration-300 border ${i === 0 ? "md:col-span-2" : ""}`}
              style={{
                background: c.bg,
                borderColor: c.dark ? "transparent" : "rgba(26,22,18,0.08)",
                opacity: active === i || active !== i ? 1 : 0.6,
              }}
              onClick={() => setActive(i)}
            >
              <div className="flex items-center justify-between mb-8">
                <span className={`font-mono text-[10px] tracking-widest ${c.dark ? "text-white/30" : "text-[#a09890]"}`}>{c.id}</span>
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${c.dark ? "border-white/20" : "border-[rgba(26,22,18,0.15)]"}`}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={c.dark ? "text-white/50" : "text-[#6b6256]"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
              </div>

              <h3 className={`font-serif text-[1.9rem] font-medium leading-tight mb-4 ${c.dark ? "text-white" : "text-[var(--ink)]"}`}>
                {c.title}
              </h3>

              <p className={`text-sm leading-relaxed mb-6 ${c.dark ? "text-white/60" : "text-[#6b6256]"}`}>{c.body}</p>

              {c.bullets.length > 0 && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-auto">
                  {c.bullets.map((b, bi) => (
                    <div key={bi} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--accent-green)" }} />
                      <div>
                        <p className="text-white text-sm font-medium">{b.l}</p>
                        <p className="text-white/50 text-xs">{b.s}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={`mt-8 pt-5 flex items-center justify-between border-t ${c.dark ? "border-white/10" : "border-[rgba(26,22,18,0.1)]"}`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.dark ? "var(--accent-green)" : "#a09890" }} />
                  <span className={`font-mono text-[9px] tracking-widest ${c.dark ? "text-white/40" : "text-[#a09890]"}`}>{c.label}</span>
                </div>
                {i === 0 && (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <span key={dot} className="w-5 h-1 rounded-full" style={{ background: dot === 0 ? "var(--accent-green)" : "rgba(255,255,255,0.2)" }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForYouSection() {
  const audiences = ["Daily Journalers", "Morning Pages Writers", "Reflection Practitioners", "Analog Enthusiasts", "Writers & Authors", "Mindfulness Seekers"];

  return (
    <section id="for-you" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left */}
          <div className="flex-1">
            <Badge variant="light">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a09890] inline-block" />
              For Journalers &amp; Writers
            </Badge>

            <h2 className="font-serif text-[clamp(2.5rem,4vw,3.8rem)] font-medium leading-tight mt-6 mb-8">
              Your pen already{" "}
              <em className="italic" style={{ color: "var(--accent-italic)" }}>knows the</em>
              <br />
              <em className="italic" style={{ color: "var(--accent-italic)" }}>way.</em>
            </h2>

            <div className="border-l-2 pl-6 mb-8" style={{ borderColor: "rgba(26,22,18,0.15)" }}>
              <p className="text-[#6b6256] text-sm leading-relaxed mb-4">
                Journaling is one of the most personal acts a person can perform. The weight of the pen, the texture of the paper, the rhythm of your own handwriting — these are not just habits. They are how you think.
              </p>
              <p className="text-[#6b6256] text-sm leading-relaxed mb-4">
                GenReflect is being built for those of you who refuse to give that up — but still want the convenience of having your words searchable, backed up, and always with you.
              </p>
              <p className="font-serif text-base italic text-[var(--ink)]">
                "You shouldn't have to choose between the analog and the digital. You deserve both."
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <Pill key={a}>{a}</Pill>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex-shrink-0 w-full md:w-[45%] space-y-4">
            <div className="rounded-2xl overflow-hidden h-56 relative bg-[#e8e0d0]">
              <img src={DESK_IMG} alt="A cozy writing desk with coffee and candle" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">✍️</span>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">The writing ritual</p>
                  <p className="text-xs text-[#6b6256]">preserved, amplified</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(26,22,18,0.1)", background: "var(--cream-card)" }}>
                <p className="font-serif text-xl font-medium mb-1" style={{ color: "var(--accent-italic)" }}>Analog</p>
                <p className="text-xs text-[#6b6256] leading-relaxed">writing feel, fully preserved on real paper</p>
              </div>
              <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(26,22,18,0.1)", background: "var(--cream-card)" }}>
                <p className="font-serif text-xl font-medium mb-1" style={{ color: "var(--accent-italic)" }}>Digital</p>
                <p className="text-xs text-[#6b6256] leading-relaxed">backup of every note, always accessible</p>
              </div>
              <div className="rounded-2xl border p-5 col-span-2" style={{ borderColor: "rgba(26,22,18,0.1)", background: "var(--cream-card)" }}>
                <p className="font-serif text-xl font-medium mb-1" style={{ color: "var(--lavender-dark)" }}>One</p>
                <p className="text-xs text-[#6b6256] leading-relaxed">seamless experience bridging both worlds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="px-6 py-32 text-center">
      <p className="font-mono text-[10px] tracking-widest uppercase text-[#a09890] mb-6">Early access · Limited quantity</p>
      <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-medium mb-6 leading-tight">
        Be first to <em className="italic" style={{ color: "var(--accent-italic)" }}>write</em> history.
      </h2>
      <p className="text-[#6b6256] max-w-md mx-auto mb-10 leading-relaxed">
        Join the waitlist and be among the first to experience GenReflect when it ships.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 rounded-full px-5 py-3 text-sm border outline-none focus:border-[rgba(26,22,18,0.4)] transition-colors bg-transparent"
          style={{ borderColor: "rgba(26,22,18,0.2)" }}
        />
        <button className="bg-[var(--ink)] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#2d2520] transition-colors whitespace-nowrap">
          Join waitlist
        </button>
      </div>

      <div className="mt-20 pt-8 border-t flex items-center justify-between max-w-6xl mx-auto" style={{ borderColor: "rgba(26,22,18,0.1)" }}>
        <div className="flex items-center gap-2">
          <PeacockQuillNibLogo className="w-7 h-7" />
          <span className="font-serif text-sm font-medium">GenReflect</span>
        </div>
        <p className="text-xs text-[#a09890]">© 2026 GenReflect. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-[#a09890]">
          <a href="#" className="hover:text-[var(--ink)] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[var(--ink)] transition-colors">Terms</a>
          <a href="#" className="hover:text-[var(--ink)] transition-colors">Contact</a>
        </div>
      </div>
    </section>
  );
}

export default function GenReflectProduct() {
  return (
    <div className="min-h-screen text-[var(--ink)]" style={{ background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar />
      <main>
        <HeroSection />
        <ProductsSection />
        <HowItWorksSection />
        <ConceptSection />
        <ForYouSection />
        <FooterCTA />
      </main>
    </div>
  );
}
