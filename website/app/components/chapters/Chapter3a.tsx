"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL, CHIP } from "../chipData";

// Voltage trace component — animated oscilloscope-style waveform
function VoltageTrace({
  label,
  color,
  voltage,
  targetVoltage,
  maxV,
}: {
  label: string;
  color: string;
  voltage: number;
  targetVoltage: number;
  maxV: number;
}) {
  const pct = (voltage / maxV) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="mono text-xs w-8" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-8 bg-[#080c16] rounded border border-[#1e293b] relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded"
          style={{ background: `${color}30` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 h-full w-0.5"
          style={{ background: color }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[10px]" style={{ color }}>
          {voltage.toFixed(2)}V
        </span>
      </div>
    </div>
  );
}

// Inverter gate visual
function InverterGate({
  x,
  y,
  label,
  inputHigh,
  outputHigh,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  inputHigh: boolean;
  outputHigh: boolean;
  highlight: boolean;
}) {
  const outColor = outputHigh ? "#00f0ff" : "#475569";
  const inColor = inputHigh ? "#00f0ff" : "#475569";

  return (
    <g>
      {/* Triangle shape for inverter */}
      <motion.path
        d={`M${x - 25},${y - 22} L${x + 25},${y} L${x - 25},${y + 22} Z`}
        fill={highlight ? "#00f0ff08" : "#0d1526"}
        stroke={highlight ? "#00f0ff" : "#1e293b"}
        strokeWidth="2"
        animate={{ stroke: highlight ? "#00f0ff" : "#1e293b" }}
        transition={{ duration: 0.3 }}
      />
      {/* Bubble (inversion) */}
      <circle cx={x + 30} cy={y} r="5" fill="none" stroke={outColor} strokeWidth="2" />
      {/* Label */}
      <text x={x} y={y + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
        {label}
      </text>
      {/* Input indicator */}
      <circle cx={x - 30} cy={y} r="3" fill={inColor} />
      {/* Output indicator */}
      <circle cx={x + 38} cy={y} r="3" fill={outColor} />
    </g>
  );
}

type SimStep = 0 | 1 | 2 | 3 | 4;

const STEP_DESCRIPTIONS: Record<SimStep, { title: string; detail: string }> = {
  0: {
    title: "Two NOT Gates",
    detail: "Start with two inverters. Each flips its input: HIGH → LOW, LOW → HIGH.",
  },
  1: {
    title: "Cross-Coupling",
    detail:
      "Connect each inverter's output to the other's input. This creates a feedback loop.",
  },
  2: {
    title: "Stable State: Q=1",
    detail:
      "Q is HIGH (1.8V) → right inverter outputs LOW → left inverter outputs HIGH → Q stays HIGH. The loop reinforces itself!",
  },
  3: {
    title: "Stability — Resisting Noise",
    detail: `Noise tries to push Q lower, but the feedback loop pulls it back. SNM = ${BITCELL.snm_mv} mV — the cell can withstand ${BITCELL.snm_mv} mV of noise before flipping.`,
  },
  4: {
    title: "Access Transistors Enable Writing",
    detail:
      "The wordline (WL) controls access transistors. When WL goes HIGH, external drivers can overpower the feedback loop and flip the stored bit.",
  },
};

export default function Chapter3a() {
  const [step, setStep] = useState<SimStep>(0);
  const [qVoltage, setQVoltage] = useState(1.8);
  const [qbVoltage, setQbVoltage] = useState(0);
  const [noiseActive, setNoiseActive] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setStep((s) => ((s + 1) % 5) as SimStep);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  // Voltage simulation based on step
  useEffect(() => {
    if (step === 0 || step === 1) {
      setQVoltage(1.8);
      setQbVoltage(0);
    } else if (step === 2) {
      setQVoltage(1.8);
      setQbVoltage(0);
    } else if (step === 3) {
      // Noise simulation
      setNoiseActive(true);
      const noiseTimer = setInterval(() => {
        setQVoltage((v) => {
          const noisy = v + (Math.random() - 0.6) * 0.15;
          return Math.max(1.2, Math.min(1.8, noisy));
        });
        setQbVoltage((v) => {
          const noisy = v + (Math.random() - 0.4) * 0.15;
          return Math.max(0, Math.min(0.6, noisy));
        });
      }, 150);
      // Snap back after noise
      const snapTimer = setTimeout(() => {
        clearInterval(noiseTimer);
        setQVoltage(1.8);
        setQbVoltage(0);
        setNoiseActive(false);
      }, 2500);
      return () => {
        clearInterval(noiseTimer);
        clearTimeout(snapTimer);
        setNoiseActive(false);
      };
    } else if (step === 4) {
      setQVoltage(1.8);
      setQbVoltage(0);
    }
  }, [step]);

  const showCrossCoupling = step >= 1;
  const showFeedback = step >= 2;
  const showAccess = step >= 4;
  const qHigh = qVoltage > 0.9;

  return (
    <div className="mt-16">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center text-[#00f0ff] mb-2">
          3a: How SRAM Stores a Bit
        </h3>
        <p className="text-center text-[#94a3b8] text-sm max-w-2xl mx-auto mb-8">
          Two cross-coupled inverters create a feedback loop that holds data indefinitely — no refresh needed.
        </p>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
          {/* Main SVG diagram */}
          <svg viewBox="0 0 520 280" className="w-full h-auto">
            <defs>
              <filter id="glow3a">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker id="arrowCyan" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f0ff" />
              </marker>
              <marker id="arrowGray" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
            </defs>

            {/* VDD rail */}
            <line x1="60" y1="30" x2="380" y2="30" stroke="#ef4444" strokeWidth="2" />
            <text x="220" y="22" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">
              VDD = {CHIP.supply_v}V
            </text>

            {/* VSS rail */}
            <line x1="60" y1="230" x2="380" y2="230" stroke="#475569" strokeWidth="2" />
            <text x="220" y="248" fill="#475569" fontSize="10" fontFamily="monospace" textAnchor="middle">
              VSS = 0V
            </text>

            {/* Left inverter (INV_L) */}
            <InverterGate
              x={140}
              y={130}
              label="INV_L"
              inputHigh={!qHigh}
              outputHigh={qHigh}
              highlight={showFeedback}
            />

            {/* Right inverter (INV_R) */}
            <InverterGate
              x={300}
              y={130}
              label="INV_R"
              inputHigh={qHigh}
              outputHigh={!qHigh}
              highlight={showFeedback}
            />

            {/* VDD to inverters */}
            <line x1="140" y1="30" x2="140" y2="105" stroke="#ef444480" strokeWidth="1.5" />
            <line x1="300" y1="30" x2="300" y2="105" stroke="#ef444480" strokeWidth="1.5" />

            {/* VSS to inverters */}
            <line x1="140" y1="155" x2="140" y2="230" stroke="#47556980" strokeWidth="1.5" />
            <line x1="300" y1="155" x2="300" y2="230" stroke="#47556980" strokeWidth="1.5" />

            {/* Q node */}
            <motion.circle
              cx="185"
              cy="130"
              r="12"
              fill={qHigh ? "#00f0ff15" : "#1e293b"}
              stroke={qHigh ? "#00f0ff" : "#475569"}
              strokeWidth="2"
              animate={{
                r: noiseActive ? [12, 14, 11, 13, 12] : 12,
                stroke: qHigh ? "#00f0ff" : "#475569",
              }}
              transition={{ duration: 0.3 }}
              filter={qHigh ? "url(#glow3a)" : undefined}
            />
            <text x="185" y="134" fill={qHigh ? "#00f0ff" : "#94a3b8"} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Q
            </text>
            <text x="185" y="118" fill={qHigh ? "#00f0ff" : "#475569"} fontSize="9" fontFamily="monospace" textAnchor="middle">
              {qVoltage.toFixed(2)}V
            </text>

            {/* QB node */}
            <motion.circle
              cx="255"
              cy="130"
              r="12"
              fill={!qHigh ? "#f59e0b15" : "#1e293b"}
              stroke={!qHigh ? "#f59e0b" : "#475569"}
              strokeWidth="2"
              animate={{
                r: noiseActive ? [12, 11, 14, 12, 13] : 12,
              }}
              transition={{ duration: 0.3 }}
              filter={!qHigh ? "url(#glow3a)" : undefined}
            />
            <text x="255" y="134" fill={!qHigh ? "#f59e0b" : "#94a3b8"} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              QB
            </text>
            <text x="255" y="118" fill={!qHigh ? "#f59e0b" : "#475569"} fontSize="9" fontFamily="monospace" textAnchor="middle">
              {qbVoltage.toFixed(2)}V
            </text>

            {/* Cross-coupling paths */}
            <AnimatePresence>
              {showCrossCoupling && (
                <>
                  {/* Q → INV_R input (top path) */}
                  <motion.path
                    d="M197 130 L220 130 L220 90 L265 90 L265 130"
                    fill="none"
                    stroke={showFeedback ? "#00f0ff" : "#94a3b8"}
                    strokeWidth="1.5"
                    markerEnd={showFeedback ? "url(#arrowCyan)" : "url(#arrowGray)"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* QB → INV_L input (bottom path) */}
                  <motion.path
                    d="M243 130 L220 130 L220 170 L175 170 L175 130"
                    fill="none"
                    stroke={showFeedback ? "#f59e0b" : "#94a3b8"}
                    strokeWidth="1.5"
                    markerEnd={showFeedback ? "url(#arrowCyan)" : "url(#arrowGray)"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Feedback loop label */}
            {showFeedback && (
              <motion.text
                x="220"
                y="80"
                fill="#10b981"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                feedback loop
              </motion.text>
            )}

            {/* Access transistors */}
            {showAccess && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Left access transistor */}
                <rect x="55" y="118" width="36" height="24" rx="3" fill="#a855f710" stroke="#a855f7" strokeWidth="1.5" />
                <text x="73" y="134" fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle">AXL</text>
                <line x1="40" y1="130" x2="55" y2="130" stroke="#a855f7" strokeWidth="1.5" />
                <text x="30" y="134" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="end">BL</text>
                <line x1="91" y1="130" x2="108" y2="130" stroke="#a855f7" strokeWidth="1.5" />

                {/* Right access transistor */}
                <rect x="350" y="118" width="36" height="24" rx="3" fill="#a855f710" stroke="#a855f7" strokeWidth="1.5" />
                <text x="368" y="134" fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle">AXR</text>
                <line x1="386" y1="130" x2="410" y2="130" stroke="#a855f7" strokeWidth="1.5" />
                <text x="420" y="134" fill="#a855f7" fontSize="9" fontFamily="monospace">BLB</text>
                <line x1="335" y1="130" x2="350" y2="130" stroke="#a855f7" strokeWidth="1.5" />

                {/* WL line */}
                <line x1="73" y1="105" x2="73" y2="118" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="368" y1="105" x2="368" y2="118" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="73" y1="105" x2="368" y2="105" stroke="#a855f7" strokeWidth="1.5" />
                <text x="220" y="100" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="middle">WL (Wordline)</text>
              </motion.g>
            )}

            {/* Animated current flow particles for feedback */}
            {showFeedback && !noiseActive && (
              <>
                <motion.circle
                  r="3"
                  fill="#00f0ff"
                  filter="url(#glow3a)"
                  animate={{
                    cx: [197, 220, 220, 265, 265],
                    cy: [130, 130, 90, 90, 130],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="3"
                  fill="#f59e0b"
                  filter="url(#glow3a)"
                  animate={{
                    cx: [243, 220, 220, 175, 175],
                    cy: [130, 130, 170, 170, 130],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                />
              </>
            )}

            {/* Noise indicator */}
            {noiseActive && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                transition={{ duration: 2.5 }}
              >
                <text x="220" y="190" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  ⚡ NOISE ⚡
                </text>
                <text x="220" y="205" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Cell resists — snaps back!
                </text>
              </motion.g>
            )}
          </svg>

          {/* Voltage traces (oscilloscope style) */}
          <div className="mt-4 space-y-2 px-4">
            <div className="mono text-xs text-[#475569] mb-1">Voltage Monitor</div>
            <VoltageTrace label="Q" color="#00f0ff" voltage={qVoltage} targetVoltage={1.8} maxV={1.8} />
            <VoltageTrace label="QB" color="#f59e0b" voltage={qbVoltage} targetVoltage={0} maxV={1.8} />
          </div>

          {/* Step description */}
          <div className="mt-6 px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#080c16] rounded-lg p-4 border border-[#1e293b]"
              >
                <div className="mono text-sm text-[#00f0ff] font-bold mb-1">
                  Step {step + 1}: {STEP_DESCRIPTIONS[step].title}
                </div>
                <p className="text-sm text-[#94a3b8]">{STEP_DESCRIPTIONS[step].detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {([0, 1, 2, 3, 4] as SimStep[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStep(s); setAutoPlay(false); }}
                className={`px-3 py-1.5 rounded-lg mono text-xs border transition-all ${
                  step === s
                    ? "bg-[#00f0ff15] border-[#00f0ff40] text-[#00f0ff]"
                    : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
                }`}
              >
                {s + 1}
              </button>
            ))}
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1.5 rounded-lg mono text-xs border transition-all ml-2 ${
                autoPlay
                  ? "bg-[#10b98115] border-[#10b98140] text-[#10b981]"
                  : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
              }`}
            >
              {autoPlay ? "⏸ Pause" : "▶ Auto"}
            </button>
          </div>
        </div>

        {/* Key insight card */}
        <ScrollReveal delay={0.2}>
          <GlowCard color="#10b981" className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <p className="text-[#94a3b8]">
                The cross-coupled inverters form a <span className="text-[#10b981] font-bold">bistable latch</span>.
                Once set, the feedback loop holds the data <span className="text-[#00f0ff]">indefinitely</span> — as
                long as power is on. No capacitor to refresh, no charge to leak away. That&apos;s why SRAM is
                faster than DRAM.
              </p>
              <p className="mono text-xs text-[#475569] mt-3">
                Data retention down to {BITCELL.data_retention_v}V supply — robust even at reduced voltages
              </p>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
