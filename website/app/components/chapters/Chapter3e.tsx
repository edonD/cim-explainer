"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";

type MemoryType = "sram" | "dram" | "flash";

const MEMORY_INFO: Record<MemoryType, {
  name: string;
  color: string;
  cell: string;
  transistors: string;
  speed: string;
  volatile: boolean;
  refresh: boolean;
  density: string;
  cost: string;
  useCase: string;
  mechanism: string;
}> = {
  sram: {
    name: "SRAM",
    color: "#00f0ff",
    cell: "6T cross-coupled inverters",
    transistors: "6-8T per bit",
    speed: "< 1 ns access",
    volatile: true,
    refresh: false,
    density: "Low (large cell)",
    cost: "Highest $/bit",
    useCase: "CPU cache (L1/L2/L3), CIM",
    mechanism: "Feedback loop (bistable latch) — data held by active transistors",
  },
  dram: {
    name: "DRAM",
    color: "#f59e0b",
    cell: "1T + 1 capacitor",
    transistors: "1T per bit",
    speed: "~10-50 ns access",
    volatile: true,
    refresh: true,
    density: "High",
    cost: "Low $/bit",
    useCase: "Main memory (DDR4/DDR5)",
    mechanism: "Charge on capacitor — leaks over ms, needs periodic refresh (~64 ms)",
  },
  flash: {
    name: "Flash (NAND)",
    color: "#10b981",
    cell: "1T floating gate",
    transistors: "1T per bit (or less w/ MLC)",
    speed: "~25-100 µs read",
    volatile: false,
    refresh: false,
    density: "Very high (3D stacking)",
    cost: "Lowest $/bit",
    useCase: "SSDs, storage",
    mechanism: "Trapped charge in floating gate — persists for years without power",
  },
};

// Animated cell diagrams
function MemoryCellDiagram({ type }: { type: MemoryType }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      <defs>
        <filter id={`glow-${type}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {type === "sram" && (
        <g>
          {/* Cross-coupled inverters */}
          <rect x="30" y="40" width="50" height="70" rx="4" fill="#00f0ff08" stroke="#00f0ff" strokeWidth="1.5" />
          <text x="55" y="65" fill="#00f0ff" fontSize="9" fontFamily="monospace" textAnchor="middle">INV</text>
          <rect x="120" y="40" width="50" height="70" rx="4" fill="#00f0ff08" stroke="#00f0ff" strokeWidth="1.5" />
          <text x="145" y="65" fill="#00f0ff" fontSize="9" fontFamily="monospace" textAnchor="middle">INV</text>
          {/* Cross-coupling arrows */}
          <path d="M80 55 L100 55 L100 85 L120 85" fill="none" stroke="#00f0ff" strokeWidth="1" />
          <path d="M120 55 L100 55 L100 85 L80 85" fill="none" stroke="#00f0ff" strokeWidth="1" />
          {/* Labels */}
          <text x="90" y="35" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">Q</text>
          <text x="110" y="100" fill="#00f0ff" fontSize="8" fontFamily="monospace" textAnchor="middle">QB</text>
          <text x="100" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">6T SRAM Cell</text>
          {/* Feedback glow */}
          <motion.circle cx="100" cy="70" r="15" fill="none" stroke="#00f0ff30" strokeWidth="1"
            animate={{ r: [15, 20, 15], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </g>
      )}

      {type === "dram" && (
        <g>
          {/* Transistor */}
          <rect x="70" y="30" width="30" height="22" rx="3" fill="#f59e0b08" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="85" y="45" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">T</text>
          {/* Capacitor */}
          <line x1="85" y1="52" x2="85" y2="70" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="65" y1="70" x2="105" y2="70" stroke="#f59e0b" strokeWidth="2" />
          <line x1="70" y1="78" x2="100" y2="78" stroke="#f59e0b" strokeWidth="2" />
          <text x="115" y="76" fill="#f59e0b" fontSize="8" fontFamily="monospace">C</text>
          {/* Charge leaking */}
          <motion.circle r="2" fill="#f59e0b"
            animate={{ cx: [85, 90, 95, 100], cy: [74, 80, 88, 96], opacity: [1, 0.7, 0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <text x="85" y="105" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">charge leaks!</text>
          <text x="100" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">1T-1C DRAM Cell</text>
        </g>
      )}

      {type === "flash" && (
        <g>
          {/* Floating gate transistor */}
          <rect x="55" y="55" width="90" height="40" rx="4" fill="#10b98108" stroke="#10b981" strokeWidth="1.5" />
          {/* Floating gate (inner) */}
          <rect x="70" y="65" width="60" height="12" rx="2" fill="#10b98130" stroke="#10b981" strokeWidth="1" />
          <text x="100" y="74" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle">floating gate</text>
          {/* Control gate */}
          <rect x="75" y="40" width="50" height="12" rx="2" fill="#a855f720" stroke="#a855f7" strokeWidth="1" />
          <text x="100" y="49" fill="#a855f7" fontSize="7" fontFamily="monospace" textAnchor="middle">control</text>
          {/* Trapped electrons */}
          <motion.g animate={{ y: [0, -1, 0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <circle cx="80" cy="71" r="2" fill="#10b981" />
            <circle cx="90" cy="69" r="2" fill="#10b981" />
            <circle cx="100" cy="71" r="2" fill="#10b981" />
            <circle cx="110" cy="70" r="2" fill="#10b981" />
            <circle cx="120" cy="71" r="2" fill="#10b981" />
          </motion.g>
          <text x="100" y="110" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">trapped charge</text>
          <text x="100" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Flash Cell</text>
        </g>
      )}
    </svg>
  );
}

// Cache hierarchy diagram
function CacheHierarchy() {
  const levels = [
    { name: "CPU Core", size: "", color: "#ef4444", w: 60, type: "compute" },
    { name: "L1 Cache", size: "64 KB", color: "#00f0ff", w: 100, type: "sram" },
    { name: "L2 Cache", size: "256 KB", color: "#00f0ff", w: 150, type: "sram" },
    { name: "L3 Cache", size: "8-32 MB", color: "#00f0ff", w: 220, type: "sram" },
    { name: "Main Memory", size: "16-64 GB", color: "#f59e0b", w: 300, type: "dram" },
    { name: "Storage", size: "1-4 TB", color: "#10b981", w: 360, type: "flash" },
  ];

  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto max-w-lg mx-auto">
      {levels.map((level, i) => {
        const y = 10 + i * 44;
        const x = (400 - level.w) / 2;
        return (
          <motion.g
            key={level.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <rect
              x={x} y={y} width={level.w} height={34} rx="6"
              fill={`${level.color}10`}
              stroke={level.color}
              strokeWidth="1.5"
            />
            <text x="200" y={y + 15} fill={level.color} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              {level.name}
            </text>
            <text x="200" y={y + 27} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {level.size}
            </text>
            {/* Speed arrow on left */}
            {i > 0 && (
              <text x={x - 10} y={y + 20} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                {i === 1 ? "~1ns" : i === 2 ? "~3ns" : i === 3 ? "~10ns" : i === 4 ? "~50ns" : "~100µs"}
              </text>
            )}
          </motion.g>
        );
      })}
      {/* Left annotation */}
      <text x="15" y="140" fill="#475569" fontSize="9" fontFamily="monospace"
        transform="rotate(-90, 15, 140)">
        ← Faster | Slower →
      </text>
      {/* Right annotation */}
      <text x="385" y="140" fill="#475569" fontSize="9" fontFamily="monospace"
        transform="rotate(90, 385, 140)">
        ← Smaller | Larger →
      </text>
    </svg>
  );
}

export default function Chapter3e() {
  const [selectedMemory, setSelectedMemory] = useState<MemoryType>("sram");
  const info = MEMORY_INFO[selectedMemory];

  return (
    <div className="mt-20">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center text-[#00f0ff] mb-2">
          3e: SRAM in Context
        </h3>
        <p className="text-center text-[#94a3b8] text-sm max-w-2xl mx-auto mb-8">
          SRAM is just one type of memory. Understanding why it&apos;s used for CIM requires knowing how it compares.
        </p>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        {/* Memory type selector */}
        <div className="flex justify-center gap-3 mb-6">
          {(["sram", "dram", "flash"] as MemoryType[]).map((type) => {
            const mInfo = MEMORY_INFO[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedMemory(type)}
                className={`px-5 py-2.5 rounded-lg mono text-sm border transition-all ${
                  selectedMemory === type
                    ? "bg-white/5 border-white/20"
                    : "bg-transparent border-white/10 opacity-60 hover:opacity-100"
                }`}
                style={{ color: mInfo.color, borderColor: selectedMemory === type ? `${mInfo.color}40` : undefined }}
              >
                {mInfo.name}
              </button>
            );
          })}
        </div>

        {/* Cell diagram + info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0d1526] rounded-xl p-4 neon-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMemory}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MemoryCellDiagram type={selectedMemory} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-[#0d1526] rounded-xl p-5 border border-[#1e293b]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMemory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="mono text-lg font-bold mb-3" style={{ color: info.color }}>
                  {info.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Cell structure</span>
                    <span className="text-[#94a3b8] mono text-xs">{info.cell}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Transistors</span>
                    <span className="text-[#94a3b8] mono text-xs">{info.transistors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Speed</span>
                    <span className="mono text-xs" style={{ color: info.color }}>{info.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Volatile?</span>
                    <span className={`mono text-xs ${info.volatile ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                      {info.volatile ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Needs refresh?</span>
                    <span className={`mono text-xs ${info.refresh ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                      {info.refresh ? "Yes (every ~64ms)" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Density</span>
                    <span className="text-[#94a3b8] mono text-xs">{info.density}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475569]">Use case</span>
                    <span className="text-[#94a3b8] mono text-xs text-right max-w-[55%]">{info.useCase}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1e293b]">
                  <div className="text-xs text-[#475569] mb-1">How it stores data:</div>
                  <p className="text-xs text-[#94a3b8]">{info.mechanism}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Why SRAM for CIM */}
        <ScrollReveal delay={0.1}>
          <GlowCard color="#00f0ff" className="max-w-3xl mx-auto mb-8">
            <h4 className="mono text-sm text-[#00f0ff] font-bold mb-2">Why SRAM for CIM?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#94a3b8]">
              <div>
                <span className="text-[#00f0ff] font-bold">Speed:</span> Sub-nanosecond access means the
                computation (current flow through bitcell) happens almost instantly.
              </div>
              <div>
                <span className="text-[#f59e0b] font-bold">No refresh:</span> DRAM&apos;s periodic refresh would
                interrupt computation. SRAM holds data as long as power is on.
              </div>
              <div>
                <span className="text-[#10b981] font-bold">Compatibility:</span> SRAM can be fabricated in
                standard CMOS logic process — no special capacitor or floating gate layers.
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Cache hierarchy */}
        <ScrollReveal delay={0.2}>
          <div className="bg-[#0d1526] rounded-xl p-6 neon-border max-w-3xl mx-auto">
            <h4 className="mono text-sm text-[#00f0ff] font-bold mb-4 text-center">
              Where SRAM Lives: The Memory Hierarchy
            </h4>
            <CacheHierarchy />
            <p className="text-center text-xs text-[#475569] mono mt-4">
              CIM uses SRAM at the cache level — closest to compute, but now compute IS the memory
            </p>
          </div>
        </ScrollReveal>

        {/* Scale fact */}
        <ScrollReveal delay={0.3}>
          <GlowCard color="#a855f7" className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="mono text-3xl text-[#a855f7] font-bold">~10 billion</div>
              <div className="text-sm text-[#94a3b8] mt-2">
                SRAM transistors on a modern CPU (Apple M2: ~5B SRAM out of 20B total).
                Our CIM array uses {64 * 64 * 8} = {(64 * 64 * 8).toLocaleString()} transistors
                for {64 * 64} = {(64 * 64).toLocaleString()} multiply-accumulate operations per cycle.
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
