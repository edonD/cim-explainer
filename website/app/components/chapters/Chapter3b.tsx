"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL, CHIP } from "../chipData";

const VDD = CHIP.supply_v; // 1.8V

interface WaveformPoint {
  time: number;
  value: number;
}

// Generate waveform data for a write operation
function generateWriteWaveforms(phase: number): {
  wl: WaveformPoint[];
  bl: WaveformPoint[];
  blb: WaveformPoint[];
  q: WaveformPoint[];
  qb: WaveformPoint[];
} {
  const steps = 100;
  const wl: WaveformPoint[] = [];
  const bl: WaveformPoint[] = [];
  const blb: WaveformPoint[] = [];
  const q: WaveformPoint[] = [];
  const qb: WaveformPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // WL: rises at t=0.2, falls at t=0.7
    const wlV = t < 0.2 ? 0 : t < 0.25 ? (t - 0.2) / 0.05 * VDD : t < 0.7 ? VDD : t < 0.75 ? (0.75 - t) / 0.05 * VDD : 0;
    // BL: driven to VDD from t=0.15
    const blV = t < 0.15 ? VDD / 2 : t < 0.2 ? VDD / 2 + (t - 0.15) / 0.05 * (VDD / 2) : VDD;
    // BLB: driven to 0 from t=0.15
    const blbV = t < 0.15 ? VDD / 2 : t < 0.2 ? VDD / 2 - (t - 0.15) / 0.05 * (VDD / 2) : 0;

    // Q: starts at 0, flips to VDD around t=0.35 (after WL opens and BL overpowers)
    let qV: number;
    if (t < 0.3) qV = 0;
    else if (t < 0.45) qV = ((t - 0.3) / 0.15) * VDD;
    else qV = VDD;

    // QB: starts at VDD, flips to 0 around t=0.35
    let qbV: number;
    if (t < 0.3) qbV = VDD;
    else if (t < 0.45) qbV = VDD - ((t - 0.3) / 0.15) * VDD;
    else qbV = 0;

    wl.push({ time: t, value: wlV });
    bl.push({ time: t, value: blV });
    blb.push({ time: t, value: blbV });
    q.push({ time: t, value: qV });
    qb.push({ time: t, value: qbV });
  }

  return { wl, bl, blb, q, qb };
}

// SVG waveform renderer
function WaveformChart({
  data,
  color,
  label,
  maxV,
  width,
  height,
  playProgress,
}: {
  data: WaveformPoint[];
  color: string;
  label: string;
  maxV: number;
  width: number;
  height: number;
  playProgress: number;
}) {
  const padding = { top: 4, bottom: 4, left: 0, right: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build path
  const points = data.map((p) => {
    const x = padding.left + p.time * chartW;
    const y = padding.top + chartH - (p.value / maxV) * chartH;
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;

  // Clip to playProgress
  const clipX = padding.left + playProgress * chartW;

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <clipPath id={`clip-${label}`}>
          <rect x="0" y="0" width={clipX} height={height} />
        </clipPath>
      </defs>
      {/* Grid lines */}
      <line x1={padding.left} y1={padding.top} x2={padding.left + chartW} y2={padding.top}
        stroke="#1e293b" strokeWidth="0.5" />
      <line x1={padding.left} y1={padding.top + chartH} x2={padding.left + chartW} y2={padding.top + chartH}
        stroke="#1e293b" strokeWidth="0.5" />
      <line x1={padding.left} y1={padding.top + chartH / 2} x2={padding.left + chartW} y2={padding.top + chartH / 2}
        stroke="#1e293b30" strokeWidth="0.5" strokeDasharray="3 3" />
      {/* Waveform (dimmed full) */}
      <path d={pathD} fill="none" stroke={`${color}20`} strokeWidth="1.5" />
      {/* Waveform (active portion) */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" clipPath={`url(#clip-${label})`} />
      {/* Playhead */}
      <line x1={clipX} y1={0} x2={clipX} y2={height} stroke={`${color}60`} strokeWidth="1" />
    </svg>
  );
}

type WriteStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WRITE_STEPS: Record<WriteStep, { title: string; detail: string; progress: number }> = {
  0: {
    title: "Initial State: Q=0, QB=1",
    detail: "Cell currently stores a '0'. Q is at 0V, QB is at 1.8V. Bitlines are precharged to VDD/2.",
    progress: 0.1,
  },
  1: {
    title: "Drive Bitlines",
    detail: "External write drivers slam BL to VDD (1.8V) and BLB to 0V. These are strong drivers that can overpower the cell.",
    progress: 0.2,
  },
  2: {
    title: "Wordline Goes HIGH",
    detail: "WL rises to 1.8V, turning ON both access transistors (AXL and AXR). The bitlines are now connected to the internal nodes.",
    progress: 0.28,
  },
  3: {
    title: "Fight! Drivers vs Cell",
    detail: "BL (1.8V) pushes Q up while BLB (0V) pulls QB down. The external drivers are sized larger than the cell transistors — they WIN.",
    progress: 0.37,
  },
  4: {
    title: "Cell Flips!",
    detail: "Q crosses the threshold → right inverter starts pulling QB low → left inverter pushes Q high. The feedback loop now reinforces the NEW state!",
    progress: 0.5,
  },
  5: {
    title: "Wordline Goes LOW",
    detail: "WL drops to 0V, disconnecting the bitlines. The cell is now isolated and holds Q=1, QB=0.",
    progress: 0.75,
  },
  6: {
    title: "Write Complete: Q=1",
    detail: `Cell now stores '1'. The feedback loop locks it in. Data is stable with SNM = ${BITCELL.snm_mv} mV.`,
    progress: 1.0,
  },
};

export default function Chapter3b() {
  const [writeStep, setWriteStep] = useState<WriteStep>(0);
  const [playProgress, setPlayProgress] = useState(0.1);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef<number | null>(null);

  const waveforms = generateWriteWaveforms(writeStep);

  // Animate playhead
  useEffect(() => {
    if (!isPlaying) return;
    let start: number | null = null;
    const duration = 4000; // 4 seconds for full animation

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setPlayProgress(progress);

      // Auto-advance step based on progress
      if (progress < 0.15) setWriteStep(0);
      else if (progress < 0.22) setWriteStep(1);
      else if (progress < 0.3) setWriteStep(2);
      else if (progress < 0.4) setWriteStep(3);
      else if (progress < 0.55) setWriteStep(4);
      else if (progress < 0.75) setWriteStep(5);
      else setWriteStep(6);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  const handleStepClick = (s: WriteStep) => {
    setWriteStep(s);
    setPlayProgress(WRITE_STEPS[s].progress);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setPlayProgress(0);
    setWriteStep(0);
    setIsPlaying(true);
  };

  // Current voltages based on progress
  const getVoltageAtProgress = (data: WaveformPoint[], progress: number): number => {
    const idx = Math.min(Math.floor(progress * (data.length - 1)), data.length - 1);
    return data[idx]?.value ?? 0;
  };

  const qV = getVoltageAtProgress(waveforms.q, playProgress);
  const qbV = getVoltageAtProgress(waveforms.qb, playProgress);
  const wlV = getVoltageAtProgress(waveforms.wl, playProgress);
  const blV = getVoltageAtProgress(waveforms.bl, playProgress);

  return (
    <div className="mt-20">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center text-[#f59e0b] mb-2">
          3b: Write Operation
        </h3>
        <p className="text-center text-[#94a3b8] text-sm max-w-2xl mx-auto mb-8">
          How do you overpower a feedback loop? With brute force — the external drivers are stronger than the cell.
        </p>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
          {/* Circuit state diagram */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "WL", value: wlV, color: "#a855f7" },
              { label: "BL", value: blV, color: "#00f0ff" },
              { label: "Q", value: qV, color: "#10b981" },
              { label: "QB", value: qbV, color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#080c16] rounded-lg p-3 border border-[#1e293b] text-center">
                <div className="mono text-xs" style={{ color }}>
                  {label}
                </div>
                <motion.div
                  className="mono text-xl font-bold mt-1"
                  style={{ color }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  key={value.toFixed(1)}
                >
                  {value.toFixed(2)}V
                </motion.div>
                <div className="mt-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    animate={{ width: `${(value / VDD) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Voltage waveforms — SPICE-like output */}
          <div className="bg-[#080c16] rounded-lg p-4 border border-[#1e293b]">
            <div className="mono text-xs text-[#475569] mb-2">Voltage Waveforms (SPICE-style)</div>
            <div className="space-y-1">
              {[
                { data: waveforms.wl, color: "#a855f7", label: "WL" },
                { data: waveforms.bl, color: "#00f0ff", label: "BL" },
                { data: waveforms.blb, color: "#94a3b8", label: "BLB" },
                { data: waveforms.q, color: "#10b981", label: "Q" },
                { data: waveforms.qb, color: "#f59e0b", label: "QB" },
              ].map(({ data, color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="mono text-[10px] w-6 text-right" style={{ color }}>
                    {label}
                  </span>
                  <WaveformChart
                    data={data}
                    color={color}
                    label={label}
                    maxV={VDD}
                    width={400}
                    height={30}
                    playProgress={playProgress}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mono text-[9px] text-[#475569] mt-1 px-8">
              <span>0 ns</span>
              <span>~5 ns</span>
              <span>~10 ns</span>
            </div>
          </div>

          {/* Step description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={writeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-4 bg-[#080c16] rounded-lg p-4 border border-[#1e293b]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="mono text-xs px-2 py-0.5 rounded bg-[#f59e0b20] text-[#f59e0b]">
                  Step {writeStep + 1}/7
                </span>
                <span className="mono text-sm text-[#f59e0b] font-bold">
                  {WRITE_STEPS[writeStep].title}
                </span>
              </div>
              <p className="text-sm text-[#94a3b8]">{WRITE_STEPS[writeStep].detail}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={handlePlay}
              className="px-4 py-2 rounded-lg mono text-xs border bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b] hover:bg-[#f59e0b25] transition-all"
            >
              ▶ Play Write Cycle
            </button>
            {([0, 1, 2, 3, 4, 5, 6] as WriteStep[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStepClick(s)}
                className={`w-8 h-8 rounded-lg mono text-xs border transition-all ${
                  writeStep === s
                    ? "bg-[#f59e0b15] border-[#f59e0b40] text-[#f59e0b]"
                    : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
                }`}
              >
                {s + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Key numbers card */}
        <ScrollReveal delay={0.2}>
          <GlowCard color="#f59e0b" className="max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <p className="text-[#94a3b8]">
                The write operation takes approximately <span className="text-[#f59e0b] font-bold mono">~1 ns</span> —
                the time for the external drivers (W={BITCELL.Wax}µm access transistors) to overpower the
                cell&apos;s internal feedback. The cell ratio (W<sub>n</sub>/W<sub>ax</sub> = {(BITCELL.Wn / BITCELL.Wax).toFixed(1)})
                ensures the cell is <span className="text-[#10b981]">stable during read</span> but
                <span className="text-[#f59e0b]"> writable</span> when driven.
              </p>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
