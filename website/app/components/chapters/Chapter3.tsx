"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL } from "../chipData";
import Chapter3a from "./Chapter3a";
import Chapter3b from "./Chapter3b";
import Chapter3c from "./Chapter3c";
import Chapter3d from "./Chapter3d";
import Chapter3e from "./Chapter3e";

function TransistorDiagram() {
  const [phase, setPhase] = useState<"store1" | "store0" | "compute1" | "compute0">("store1");

  const isWeight1 = phase === "store1" || phase === "compute1";
  const isComputing = phase === "compute1" || phase === "compute0";
  const currentFlows = phase === "compute1";

  return (
    <div className="max-w-3xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        <svg viewBox="0 0 500 380" className="w-full h-auto">
          {/* Title */}
          <text x="250" y="20" fill="#00f0ff" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            8T SRAM CIM Bitcell
          </text>

          {/* VDD rail */}
          <line x1="80" y1="50" x2="320" y2="50" stroke="#ef4444" strokeWidth="2" />
          <text x="200" y="42" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">VDD = 1.8V</text>

          {/* VSS rail */}
          <line x1="80" y1="250" x2="420" y2="250" stroke="#475569" strokeWidth="2" />
          <text x="430" y="254" fill="#475569" fontSize="10" fontFamily="monospace">VSS</text>

          {/* === 6T Core (Left inverter) === */}
          <rect x="110" y="70" width="40" height="25" rx="3" fill="#ef444420" stroke="#ef4444" strokeWidth="1.5" />
          <text x="130" y="87" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">PL</text>
          <line x1="130" y1="50" x2="130" y2="70" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="130" y1="95" x2="130" y2="130" stroke="#94a3b8" strokeWidth="1.5" />

          <rect x="110" y="170" width="40" height="25" rx="3" fill="#00f0ff20" stroke="#00f0ff" strokeWidth="1.5" />
          <text x="130" y="187" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">NL</text>
          <line x1="130" y1="130" x2="130" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="130" y1="195" x2="130" y2="250" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Q node */}
          <circle cx="130" cy="130" r="8" fill={isWeight1 ? "#00f0ff30" : "#1e293b"} stroke={isWeight1 ? "#00f0ff" : "#475569"} strokeWidth="2" />
          <text x="130" y="134" fill={isWeight1 ? "#00f0ff" : "#475569"} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Q</text>

          {/* === 6T Core (Right inverter) === */}
          <rect x="210" y="70" width="40" height="25" rx="3" fill="#ef444420" stroke="#ef4444" strokeWidth="1.5" />
          <text x="230" y="87" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">PR</text>
          <line x1="230" y1="50" x2="230" y2="70" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="230" y1="95" x2="230" y2="130" stroke="#94a3b8" strokeWidth="1.5" />

          <rect x="210" y="170" width="40" height="25" rx="3" fill="#00f0ff20" stroke="#00f0ff" strokeWidth="1.5" />
          <text x="230" y="187" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">NR</text>
          <line x1="230" y1="130" x2="230" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="230" y1="195" x2="230" y2="250" stroke="#94a3b8" strokeWidth="1.5" />

          {/* QB node */}
          <circle cx="230" cy="130" r="8" fill={!isWeight1 ? "#00f0ff30" : "#1e293b"} stroke={!isWeight1 ? "#00f0ff" : "#475569"} strokeWidth="2" />
          <text x="230" y="134" fill={!isWeight1 ? "#00f0ff" : "#475569"} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">QB</text>

          {/* Cross-coupling */}
          <path d="M150 130 L165 130 L165 82 L210 82" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M210 130 L195 130 L195 182 L150 182" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />

          {/* === 2T Read Port === */}
          <rect x="350" y="120" width="50" height="28" rx="3"
            fill={currentFlows ? "#10b98130" : "#10b98110"}
            stroke="#10b981" strokeWidth="2" />
          <text x="375" y="138" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RD1</text>
          <text x="375" y="115" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">gate=Q</text>

          <rect x="350" y="200" width="50" height="28" rx="3"
            fill={isComputing ? "#a855f730" : "#a855f710"}
            stroke="#a855f7" strokeWidth="2" />
          <text x="375" y="218" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RD2</text>
          <text x="375" y="195" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">gate=WL</text>

          {/* BL connection */}
          <line x1="375" y1="50" x2="375" y2="120" stroke={currentFlows ? "#00f0ff" : "#475569"} strokeWidth="2" />
          <text x="392" y="64" fill="#00f0ff" fontSize="10" fontFamily="monospace">BL</text>

          {/* Mid node */}
          <line x1="375" y1="148" x2="375" y2="200" stroke={currentFlows ? "#10b981" : "#475569"} strokeWidth="1.5" />
          <circle cx="375" cy="174" r="3" fill={currentFlows ? "#10b981" : "#475569"} />
          <text x="398" y="178" fill="#94a3b8" fontSize="8" fontFamily="monospace">mid</text>

          {/* VSS connection */}
          <line x1="375" y1="228" x2="375" y2="250" stroke="#475569" strokeWidth="1.5" />

          {/* Q to RD1 gate connection */}
          <path d="M138 130 L290 130 L290 134 L350 134" fill="none"
            stroke={isWeight1 ? "#10b981" : "#475569"} strokeWidth="1.5" strokeDasharray="4 2" />

          {/* WL label */}
          <line x1="310" y1="214" x2="350" y2="214" stroke={isComputing ? "#a855f7" : "#475569"} strokeWidth="1.5" />
          <text x="305" y="218" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="end">WL</text>

          {/* Current flow animation */}
          {currentFlows && (
            <>
              <motion.circle
                r="4" fill="#00f0ff"
                animate={{ cy: [60, 120, 148, 200, 245] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                cx="375"
                filter="url(#glow3)"
              />
              <text x="420" y="100" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                I = {BITCELL.i_read_ua} µA
              </text>
            </>
          )}

          {!currentFlows && isComputing && (
            <text x="420" y="180" fill="#475569" fontSize="10" fontFamily="monospace">
              No current
            </text>
          )}

          {/* Transistor sizes annotation */}
          <text x="80" y="300" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            PMOS: W={BITCELL.Wp}µm L={BITCELL.Lp}µm
          </text>
          <text x="80" y="315" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            NMOS: W={BITCELL.Wn}µm L={BITCELL.Ln}µm
          </text>
          <text x="80" y="330" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            Read: W={BITCELL.Wrd}µm L={BITCELL.Lrd}µm
          </text>

          {/* State indicator */}
          <rect x="300" y="290" width="180" height="55" rx="6"
            fill={currentFlows ? "#10b98110" : "#0d1526"}
            stroke={currentFlows ? "#10b981" : "#475569"} strokeWidth="1.5" />
          <text x="390" y="310" fill={currentFlows ? "#10b981" : "#94a3b8"} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            {phase === "store1" && "Stored: W = 1"}
            {phase === "store0" && "Stored: W = 0"}
            {phase === "compute1" && "Computing: W=1 × WL=1"}
            {phase === "compute0" && "Computing: W=0 × WL=1"}
          </text>
          <text x="390" y="330" fill={currentFlows ? "#f59e0b" : "#475569"} fontSize="10" fontFamily="monospace" textAnchor="middle">
            {currentFlows ? `Current: ${BITCELL.i_read_ua} µA ✓` : `Current: ${phase === "compute0" ? "0.002 nA (≈0)" : "—"}`}
          </text>

          <defs>
            <filter id="glow3">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Phase controls */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {([
            ["store1", "Store W=1", "#00f0ff"],
            ["store0", "Store W=0", "#475569"],
            ["compute1", "Compute (W=1, WL=1)", "#10b981"],
            ["compute0", "Compute (W=0, WL=1)", "#ef4444"],
          ] as const).map(([p, label, color]) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              className={`px-4 py-2 rounded-lg mono text-xs border transition-all ${
                phase === p
                  ? "bg-white/10 border-white/30"
                  : "bg-transparent border-white/10 opacity-60 hover:opacity-100"
              }`}
              style={{ color }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chapter3() {
  return (
    <section id="chapter-3" className="chapter-section circuit-grid relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={3}
          title="The SRAM Bitcell"
          subtitle="How do you make a resistor that remembers?"
          color="#00f0ff"
        />

        <ScrollReveal>
          <p className="text-center text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto mb-4">
            The grid from Chapter 2 needs programmable resistors — resistors whose value
            we can <span className="text-[#00f0ff] font-bold">set</span> and that{" "}
            <span className="text-[#00f0ff] font-bold">stay set</span>. That&apos;s what
            the memory cell is.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-4">
            A standard 6T SRAM stores one bit. For CIM, we add{" "}
            <span className="text-[#10b981] font-bold">2 extra transistors</span> — a
            decoupled read port that lets the cell compute without disturbing the stored value.
          </p>
        </ScrollReveal>

        {/* Original 8T bitcell interactive diagram */}
        <TransistorDiagram />

        {/* Metric cards */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
            <GlowCard color="#00f0ff" delay={0}>
              <div className="text-center">
                <div className="mono text-3xl text-[#00f0ff] font-bold">
                  {BITCELL.i_read_ua} µA
                </div>
                <div className="text-sm text-[#94a3b8] mt-1">Read Current (W=1)</div>
                <div className="text-xs text-[#475569] mono mt-2">
                  Worst PVT: {BITCELL.pvt_worst_i_read_ua} µA
                </div>
              </div>
            </GlowCard>

            <GlowCard color="#10b981" delay={0.1}>
              <div className="text-center">
                <div className="mono text-3xl text-[#10b981] font-bold">
                  0.002 nA
                </div>
                <div className="text-sm text-[#94a3b8] mt-1">Leakage (W=0)</div>
                <div className="text-xs text-[#475569] mono mt-2">
                  ON/OFF: {(BITCELL.on_off_ratio / 1e6).toFixed(1)}M ratio
                </div>
              </div>
            </GlowCard>

            <GlowCard color="#f59e0b" delay={0.2}>
              <div className="text-center">
                <div className="mono text-3xl text-[#f59e0b] font-bold">
                  {BITCELL.cell_area_um2} µm²
                </div>
                <div className="text-sm text-[#94a3b8] mt-1">Cell Area</div>
                <div className="text-xs text-[#475569] mono mt-2">
                  72M cells per postage stamp
                </div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        {/* === Deep SRAM Sub-sections === */}

        {/* 3a: How SRAM Stores a Bit */}
        <Chapter3a />

        {/* 3b: Write Operation Animation */}
        <Chapter3b />

        {/* 3c: Read Operation vs CIM Compute */}
        <Chapter3c />

        {/* 3d: Stability — Butterfly Curve */}
        <Chapter3d />

        {/* 3e: SRAM in Context */}
        <Chapter3e />

        {/* Final SPICE netlist */}
        <ScrollReveal delay={0.3}>
          <div className="max-w-2xl mx-auto mt-16">
            <div className="mono text-xs text-center text-[#475569] mb-2">
              From the actual SPICE netlist (SKY130 PDK)
            </div>
            <div className="bg-[#080c16] rounded-xl p-4 border border-[#1e293b] overflow-x-auto">
              <pre className="mono text-[11px] leading-relaxed">
                <span className="text-[#475569]">{`* 6T Storage Core`}</span>{"\n"}
                <span className="text-[#ef4444]">XMPL</span>{" "}
                <span className="text-[#94a3b8]">q qb vdd vdd</span>{" "}
                <span className="text-[#10b981]">sky130_fd_pr__pfet_01v8</span>{" "}
                <span className="text-[#f59e0b]">W=0.55u L=0.15u</span>{"\n"}
                <span className="text-[#ef4444]">XMNL</span>{" "}
                <span className="text-[#94a3b8]">q qb vss vss</span>{" "}
                <span className="text-[#00f0ff]">sky130_fd_pr__nfet_01v8</span>{" "}
                <span className="text-[#f59e0b]">W=0.84u L=0.15u</span>{"\n\n"}
                <span className="text-[#475569]">{`* 2T CIM Read Port`}</span>{"\n"}
                <span className="text-[#10b981]">XMRD1</span>{" "}
                <span className="text-[#94a3b8]">bl q mid_rd vss</span>{" "}
                <span className="text-[#00f0ff]">sky130_fd_pr__nfet_01v8</span>{" "}
                <span className="text-[#f59e0b]">W=0.42u L=1.0u</span>{"\n"}
                <span className="text-[#10b981]">XMRD2</span>{" "}
                <span className="text-[#94a3b8]">mid_rd wl vss vss</span>{" "}
                <span className="text-[#00f0ff]">sky130_fd_pr__nfet_01v8</span>{" "}
                <span className="text-[#f59e0b]">W=0.42u L=1.0u</span>
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
