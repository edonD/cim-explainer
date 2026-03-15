"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL, CHIP } from "../chipData";

type ReadMode = "6t-read" | "8t-cim";

// Simplified circuit diagram for 6T read vs 8T CIM
function CircuitComparison({ mode }: { mode: ReadMode }) {
  const is6T = mode === "6t-read";
  const currentFlows = true;

  return (
    <svg viewBox="0 0 480 320" className="w-full h-auto">
      <defs>
        <filter id="glow3c">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Title */}
      <text x="240" y="20" fill={is6T ? "#ef4444" : "#10b981"} fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        {is6T ? "6T SRAM: Traditional Read" : "8T CIM: Decoupled Read Port"}
      </text>

      {/* VDD rail */}
      <line x1="60" y1="45" x2="300" y2="45" stroke="#ef4444" strokeWidth="2" />
      <text x="180" y="38" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle">VDD</text>

      {/* VSS rail */}
      <line x1="60" y1="240" x2="420" y2="240" stroke="#475569" strokeWidth="2" />

      {/* 6T Core — simplified */}
      <rect x="90" y="85" width="40" height="22" rx="3" fill="#ef444415" stroke="#ef4444" strokeWidth="1.5" />
      <text x="110" y="100" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">PL</text>

      <rect x="90" y="155" width="40" height="22" rx="3" fill="#00f0ff15" stroke="#00f0ff" strokeWidth="1.5" />
      <text x="110" y="170" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">NL</text>

      <rect x="190" y="85" width="40" height="22" rx="3" fill="#ef444415" stroke="#ef4444" strokeWidth="1.5" />
      <text x="210" y="100" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">PR</text>

      <rect x="190" y="155" width="40" height="22" rx="3" fill="#00f0ff15" stroke="#00f0ff" strokeWidth="1.5" />
      <text x="210" y="170" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">NR</text>

      {/* Wires to VDD/VSS */}
      <line x1="110" y1="45" x2="110" y2="85" stroke="#ef444460" strokeWidth="1" />
      <line x1="210" y1="45" x2="210" y2="85" stroke="#ef444460" strokeWidth="1" />
      <line x1="110" y1="177" x2="110" y2="240" stroke="#47556960" strokeWidth="1" />
      <line x1="210" y1="177" x2="210" y2="240" stroke="#47556960" strokeWidth="1" />

      {/* Q / QB nodes */}
      <line x1="110" y1="107" x2="110" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="210" y1="107" x2="210" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="110" cy="130" r="6" fill="#00f0ff20" stroke="#00f0ff" strokeWidth="1.5" />
      <text x="110" y="133" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">Q</text>
      <circle cx="210" cy="130" r="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <text x="210" y="133" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">QB</text>

      {/* Cross-coupling */}
      <path d="M116 130 L140 130 L140 95 L190 95" fill="none" stroke="#94a3b830" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M190 130 L175 130 L175 165 L130 165" fill="none" stroke="#94a3b830" strokeWidth="1" strokeDasharray="3 2" />

      {is6T ? (
        /* === 6T READ: Access transistors connect BL/BLB directly to Q/QB === */
        <g>
          {/* Left access transistor */}
          <rect x="40" y="118" width="30" height="24" rx="3" fill="#a855f720" stroke="#a855f7" strokeWidth="2" />
          <text x="55" y="134" fill="#a855f7" fontSize="7" fontFamily="monospace" textAnchor="middle">AXL</text>
          <line x1="20" y1="130" x2="40" y2="130" stroke="#a855f7" strokeWidth="1.5" />
          <text x="12" y="134" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="end">BL</text>
          <line x1="70" y1="130" x2="104" y2="130" stroke="#a855f7" strokeWidth="1.5" />

          {/* Right access transistor */}
          <rect x="240" y="118" width="30" height="24" rx="3" fill="#a855f720" stroke="#a855f7" strokeWidth="2" />
          <text x="255" y="134" fill="#a855f7" fontSize="7" fontFamily="monospace" textAnchor="middle">AXR</text>
          <line x1="216" y1="130" x2="240" y2="130" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="270" y1="130" x2="290" y2="130" stroke="#a855f7" strokeWidth="1.5" />
          <text x="298" y="134" fill="#a855f7" fontSize="9" fontFamily="monospace">BLB</text>

          {/* WL connection */}
          <line x1="55" y1="108" x2="55" y2="118" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="255" y1="108" x2="255" y2="118" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="55" y1="108" x2="255" y2="108" stroke="#a855f7" strokeWidth="1.5" />
          <text x="155" y="103" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle">WL</text>

          {/* DANGER: current through storage node */}
          <motion.circle
            r="3" fill="#ef4444" filter="url(#glow3c)"
            animate={{ cx: [20, 55, 110, 110, 110], cy: [130, 130, 130, 170, 240] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Warning annotation */}
          <g>
            <rect x="310" y="80" width="155" height="70" rx="6" fill="#ef444410" stroke="#ef4444" strokeWidth="1" />
            <text x="387" y="98" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">⚠ READ DISTURB</text>
            <text x="387" y="115" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Current flows through Q node</text>
            <text x="387" y="130" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Can flip stored data if</text>
            <text x="387" y="143" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">cell ratio is too small!</text>
          </g>

          <text x="15" y="260" fill="#ef4444" fontSize="10" fontFamily="monospace">
            ❌ Read path shares storage nodes — risk of data corruption
          </text>
        </g>
      ) : (
        /* === 8T CIM: Decoupled 2T read port === */
        <g>
          {/* RD1 — gate=Q */}
          <rect x="340" y="110" width="50" height="26" rx="3" fill="#10b98120" stroke="#10b981" strokeWidth="2" />
          <text x="365" y="127" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RD1</text>
          <text x="365" y="105" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">gate=Q</text>

          {/* RD2 — gate=WL */}
          <rect x="340" y="185" width="50" height="26" rx="3" fill="#a855f720" stroke="#a855f7" strokeWidth="2" />
          <text x="365" y="202" fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RD2</text>
          <text x="365" y="180" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">gate=WL</text>

          {/* BL line */}
          <line x1="365" y1="45" x2="365" y2="110" stroke="#00f0ff" strokeWidth="2" />
          <text x="380" y="58" fill="#00f0ff" fontSize="9" fontFamily="monospace">RBL</text>

          {/* Mid node */}
          <line x1="365" y1="136" x2="365" y2="185" stroke="#10b981" strokeWidth="1.5" />

          {/* VSS */}
          <line x1="365" y1="211" x2="365" y2="240" stroke="#475569" strokeWidth="1.5" />

          {/* Q → RD1 gate */}
          <path d="M116 130 L280 130 L280 123 L340 123" fill="none"
            stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* WL → RD2 gate */}
          <line x1="310" y1="198" x2="340" y2="198" stroke="#a855f7" strokeWidth="1.5" />
          <text x="305" y="202" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="end">WL</text>

          {/* Current flow */}
          <motion.circle
            r="3" fill="#00f0ff" filter="url(#glow3c)"
            animate={{ cx: 365, cy: [55, 110, 136, 185, 240] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Success annotation */}
          <g>
            <rect x="60" y="265" width="370" height="48" rx="6" fill="#10b98110" stroke="#10b981" strokeWidth="1" />
            <text x="245" y="283" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              ✓ DECOUPLED READ — Storage nodes undisturbed
            </text>
            <text x="245" y="300" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Read port (RD1+RD2) is completely separate from the 6T core. I_read = {BITCELL.i_read_ua} µA
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

export default function Chapter3c() {
  const [mode, setMode] = useState<ReadMode>("6t-read");

  return (
    <div className="mt-20">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center text-[#10b981] mb-2">
          3c: Read Operation vs CIM Compute
        </h3>
        <p className="text-center text-[#94a3b8] text-sm max-w-2xl mx-auto mb-8">
          The 6T cell&apos;s Achilles heel: reading through the same port that stores data. The 8T CIM cell solves this.
        </p>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        {/* Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode("6t-read")}
            className={`px-5 py-2.5 rounded-lg mono text-sm border transition-all ${
              mode === "6t-read"
                ? "bg-[#ef444415] border-[#ef444440] text-[#ef4444]"
                : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
            }`}
          >
            6T Traditional Read
          </button>
          <button
            onClick={() => setMode("8t-cim")}
            className={`px-5 py-2.5 rounded-lg mono text-sm border transition-all ${
              mode === "8t-cim"
                ? "bg-[#10b98115] border-[#10b98140] text-[#10b981]"
                : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
            }`}
          >
            8T CIM Compute
          </button>
        </div>

        <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "6t-read" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "6t-read" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <CircuitComparison mode={mode} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Comparison table */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 bg-[#080c16] rounded-xl border border-[#1e293b] overflow-hidden max-w-3xl mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="p-3 text-left mono text-xs text-[#475569]">Feature</th>
                  <th className="p-3 text-center mono text-xs text-[#ef4444]">6T SRAM Read</th>
                  <th className="p-3 text-center mono text-xs text-[#10b981]">8T CIM Compute</th>
                </tr>
              </thead>
              <tbody className="mono text-xs">
                <tr className="border-b border-[#1e293b08]">
                  <td className="p-3 text-[#94a3b8]">Read path</td>
                  <td className="p-3 text-center text-[#ef4444]">Through storage node</td>
                  <td className="p-3 text-center text-[#10b981]">Separate 2T port</td>
                </tr>
                <tr className="border-b border-[#1e293b08]">
                  <td className="p-3 text-[#94a3b8]">Read disturb?</td>
                  <td className="p-3 text-center text-[#ef4444]">Yes — can flip data</td>
                  <td className="p-3 text-center text-[#10b981]">No — storage isolated</td>
                </tr>
                <tr className="border-b border-[#1e293b08]">
                  <td className="p-3 text-[#94a3b8]">Read type</td>
                  <td className="p-3 text-center text-[#94a3b8]">Charge sharing (voltage)</td>
                  <td className="p-3 text-center text-[#94a3b8]">Current mode</td>
                </tr>
                <tr className="border-b border-[#1e293b08]">
                  <td className="p-3 text-[#94a3b8]">CIM compatible?</td>
                  <td className="p-3 text-center text-[#ef4444]">Poor — disturb during compute</td>
                  <td className="p-3 text-center text-[#10b981]">Excellent — no disturb</td>
                </tr>
                <tr className="border-b border-[#1e293b08]">
                  <td className="p-3 text-[#94a3b8]">Transistor count</td>
                  <td className="p-3 text-center text-[#94a3b8]">6T</td>
                  <td className="p-3 text-center text-[#94a3b8]">8T (+33% area)</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#94a3b8]">Read current</td>
                  <td className="p-3 text-center text-[#94a3b8]">~50-100 µA (destructive)</td>
                  <td className="p-3 text-center text-[#10b981]">{BITCELL.i_read_ua} µA (non-destructive)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <GlowCard color="#10b981" className="max-w-2xl mx-auto mt-8">
            <p className="text-center text-[#94a3b8]">
              The 2 extra transistors (RD1 + RD2) in the 8T cell use a{" "}
              <span className="text-[#10b981] font-bold">long channel</span> (L={BITCELL.Lrd}µm vs {BITCELL.Ln}µm)
              for precise current control. This gives a{" "}
              <span className="text-[#f59e0b] font-bold mono">{(BITCELL.on_off_ratio / 1e6).toFixed(1)}M</span> ON/OFF
              ratio — essential for accurate analog computation where leakage is noise.
            </p>
          </GlowCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
