"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import TimingDiagram from "../anim/TimingDiagram";
import { BITCELL, CHIP } from "../chipData";

type ArraySize = 1 | 4 | 8 | 64;

function CIMArray() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [size, setSize] = useState<ArraySize>(4);
  const [phase, setPhase] = useState<"idle" | "precharge" | "compute" | "result">("idle");
  const [autoPlay, setAutoPlay] = useState(false);

  // Generate random weights
  const weights = useMemo(() => {
    const w: number[][] = [];
    for (let i = 0; i < 64; i++) {
      w.push([]);
      for (let j = 0; j < 64; j++) {
        w[i].push(Math.random() > 0.5 ? 1 : 0);
      }
    }
    return w;
  }, []);

  // Random input pulses (0-15)
  const inputs = useMemo(() => {
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16));
  }, []);

  // Auto-play cycle
  useEffect(() => {
    if (!autoPlay || !isInView) return;
    const phases: typeof phase[] = ["precharge", "compute", "result"];
    let idx = 0;
    const interval = setInterval(() => {
      setPhase(phases[idx % 3]);
      idx++;
    }, 1500);
    return () => clearInterval(interval);
  }, [autoPlay, isInView]);

  const displaySize = Math.min(size, 16);
  const cellSize = size <= 8 ? 40 : 8;
  const gap = size <= 8 ? 4 : 1;

  return (
    <div ref={ref} className="max-w-4xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        {/* Size controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {([1, 4, 8, 64] as ArraySize[]).map((s) => (
            <button
              key={s}
              onClick={() => { setSize(s); setPhase("idle"); }}
              className={`px-4 py-2 rounded-lg mono text-xs border transition-all ${
                size === s
                  ? "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff]"
                  : "border-white/10 text-[#94a3b8] hover:border-white/20"
              }`}
            >
              {s === 1 ? "1×1" : `${s}×${s}`}
            </button>
          ))}
        </div>

        {/* Array visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* WL labels (left) */}
            {size <= 8 && (
              <div className="absolute -left-12 top-0 flex flex-col" style={{ gap }}>
                {Array.from({ length: displaySize }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-end mono text-[10px]"
                    style={{ height: cellSize }}
                  >
                    <span className={phase === "compute" ? "text-[#a855f7]" : "text-[#475569]"}>
                      WL{i}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* BL labels (top) */}
            {size <= 8 && (
              <div className="flex mb-1" style={{ gap }}>
                {Array.from({ length: displaySize }).map((_, j) => (
                  <div
                    key={j}
                    className="mono text-[10px] text-center"
                    style={{ width: cellSize }}
                  >
                    <span className={phase === "result" ? "text-[#10b981]" : "text-[#475569]"}>
                      BL{j}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Grid */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${displaySize}, ${cellSize}px)`,
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: displaySize * displaySize }).map((_, idx) => {
                const i = Math.floor(idx / displaySize);
                const j = idx % displaySize;
                const w = weights[i][j];
                const active = w === 1 && phase === "compute";
                const precharged = phase === "precharge";

                return (
                  <motion.div
                    key={idx}
                    className="rounded-sm flex items-center justify-center border"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontSize: cellSize > 20 ? 10 : 6,
                    }}
                    animate={{
                      backgroundColor: precharged
                        ? "#00f0ff15"
                        : active
                          ? "#10b98130"
                          : w === 1
                            ? "#00f0ff08"
                            : "#0a0f1e",
                      borderColor: active
                        ? "#10b981"
                        : precharged
                          ? "#00f0ff40"
                          : w === 1
                            ? "#00f0ff30"
                            : "#1e293b",
                      boxShadow: active
                        ? "0 0 8px #10b98144"
                        : precharged
                          ? "0 0 4px #00f0ff22"
                          : "none",
                    }}
                    transition={{ duration: 0.3, delay: (i + j) * 0.01 }}
                  >
                    {cellSize > 20 && (
                      <span
                        className="mono font-bold"
                        style={{
                          color: w === 1 ? "#00f0ff" : "#334155",
                        }}
                      >
                        {w}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bitline voltage indicators (bottom) */}
            {phase === "result" && size <= 8 && (
              <div className="flex mt-2" style={{ gap }}>
                {Array.from({ length: displaySize }).map((_, j) => {
                  const activeCount = Array.from({ length: displaySize }).filter(
                    (__, i) => weights[i][j] === 1
                  ).length;
                  const vDrop = (activeCount / displaySize) * 100;
                  return (
                    <div key={j} style={{ width: cellSize }} className="text-center">
                      <div
                        className="h-8 rounded-sm mx-auto"
                        style={{
                          width: cellSize - 4,
                          background: `linear-gradient(180deg, #10b981 ${vDrop}%, #0a0f1e ${vDrop}%)`,
                          opacity: 0.6,
                        }}
                      />
                      <span className="mono text-[8px] text-[#10b981]">
                        {activeCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Phase controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {([
            ["precharge", "① Precharge", "#00f0ff"],
            ["compute", "② Compute", "#a855f7"],
            ["result", "③ Result", "#10b981"],
          ] as const).map(([p, label, color]) => (
            <button
              key={p}
              onClick={() => { setPhase(p); setAutoPlay(false); }}
              className={`px-4 py-2 rounded-lg mono text-xs border transition-all ${
                phase === p
                  ? "bg-white/10 border-white/30"
                  : "border-white/10 opacity-60 hover:opacity-100"
              }`}
              style={{ color }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-2 rounded-lg mono text-xs border transition-all ${
              autoPlay
                ? "bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#f59e0b]"
                : "border-white/10 text-[#94a3b8] hover:border-white/20"
            }`}
          >
            {autoPlay ? "⏸ Stop" : "▶ Auto"}
          </button>
        </div>

        {/* Phase description */}
        <div className="text-center text-sm text-[#94a3b8]">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {phase === "idle" && "Select a phase to see the compute cycle."}
              {phase === "precharge" && (
                <>All bitlines pulled to <span className="text-[#00f0ff] mono">VDD = 1.8V</span>. PMOS precharge transistors charge the bitline capacitors.</>
              )}
              {phase === "compute" && (
                <>{size}×{size === 64 ? "64" : size} PWM pulses arrive on wordlines. Cells with <span className="text-[#00f0ff]">W=1</span> discharge their bitline. Currents sum by KCL.</>
              )}
              {phase === "result" && (
                <><span className="text-[#10b981] font-bold">{size}</span> analog voltages on {size} bitlines = <span className="text-[#10b981] font-bold">{size} dot products</span> computed in ONE shot.</>
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Chapter5() {
  return (
    <section id="chapter-5" className="chapter-section circuit-grid relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={5}
          title="The Array"
          subtitle="Where magic happens — 64×64 simultaneous multiply-accumulates"
          color="#10b981"
        />

        <ScrollReveal>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-4">
            Tile {CHIP.array_rows}×{CHIP.array_cols} = {CHIP.array_rows * CHIP.array_cols} bitcells into a grid.
            Each row shares a wordline (input). Each column shares a bitline (output).
            The result is a{" "}
            <span className="text-[#10b981] font-bold">matrix-vector multiplier</span> that
            computes in physics.
          </p>
        </ScrollReveal>

        <CIMArray />

        <ScrollReveal delay={0.1}>
          <TimingDiagram
            title="One Compute Cycle — Signal Timing"
            signals={[
              {
                name: "rst",
                color: "#ef4444",
                type: "digital",
                waveform: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              },
              {
                name: "wl[i]",
                color: "#a855f7",
                type: "digital",
                waveform: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              },
              {
                name: "bl[j]",
                color: "#10b981",
                type: "analog",
                waveform: [0.5, 0.8, 1, 1, 1, 0.95, 0.88, 0.8, 0.72, 0.65, 0.6, 0.55, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
              },
              {
                name: "ADC",
                color: "#f59e0b",
                type: "digital",
                waveform: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
              },
              {
                name: "d_out",
                color: "#00f0ff",
                type: "digital",
                waveform: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              },
            ]}
            timeLabels={["0", "5ns", "80ns", "100ns", "208ns", "300ns"]}
            phaseLabels={[
              { start: 0, end: 3, label: "PRE", color: "#ef4444" },
              { start: 3, end: 12, label: "COMPUTE", color: "#a855f7" },
              { start: 12, end: 14, label: "SETTLE", color: "#10b981" },
              { start: 14, end: 19, label: "ADC CONVERT", color: "#f59e0b" },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <GlowCard color="#10b981" className="max-w-3xl mx-auto">
            <div className="text-center">
              <p className="mono text-sm text-[#94a3b8] mb-2">Bitline voltage after compute:</p>
              <p className="mono text-lg text-[#10b981]">
                V_BL[j] = VDD − (1/C_BL) × Σ( W[i][j] × I_READ × T_pulse[i] )
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="mono text-xl text-[#00f0ff] font-bold">
                    {BITCELL.i_read_ua} µA
                  </div>
                  <div className="text-xs text-[#94a3b8]">I_READ per cell</div>
                </div>
                <div>
                  <div className="mono text-xl text-[#f59e0b] font-bold">
                    {CHIP.array_rows * CHIP.array_cols}
                  </div>
                  <div className="text-xs text-[#94a3b8]">MAC operations</div>
                </div>
                <div>
                  <div className="mono text-xl text-[#a855f7] font-bold">1</div>
                  <div className="text-xs text-[#94a3b8]">Clock cycle</div>
                </div>
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <motion.p
            className="text-center text-2xl md:text-3xl font-bold mt-12 text-[#10b981]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            64 multiply-accumulate operations. One cycle.{" "}
            <span className="text-[#00f0ff] text-glow-cyan">Zero data movement.</span>
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
