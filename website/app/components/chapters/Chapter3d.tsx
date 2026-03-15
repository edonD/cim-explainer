"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL, CHIP } from "../chipData";

const VDD = CHIP.supply_v;
const SNM = BITCELL.snm_mv; // 557 mV

// Inverter transfer curve: approximate CMOS inverter VTC
// Uses tanh approximation for a smooth S-curve
function inverterVTC(vin: number, vdd: number, gain: number = 12): number {
  const mid = vdd / 2;
  return vdd / 2 * (1 - Math.tanh(gain * (vin - mid) / vdd));
}

// Generate butterfly curve data points
function generateButterflyCurve(vdd: number, nPoints: number = 200): {
  leftCurve: { x: number; y: number }[];
  rightCurve: { x: number; y: number }[];
} {
  const leftCurve: { x: number; y: number }[] = [];
  const rightCurve: { x: number; y: number }[] = [];

  for (let i = 0; i <= nPoints; i++) {
    const v = (i / nPoints) * vdd;
    // Left inverter: QB = f(Q) → plot as (Q, QB)
    const qb = inverterVTC(v, vdd);
    leftCurve.push({ x: v, y: qb });
    // Right inverter: Q = f(QB) → plot as (QB_in, Q_out) but on same axes as (Q, QB)
    // To overlay: we plot the inverse, which means x=f(v), y=v
    const q = inverterVTC(v, vdd);
    rightCurve.push({ x: q, y: v });
  }

  return { leftCurve, rightCurve };
}

// SVG butterfly curve chart
function ButterflyCurveChart({
  noisePoint,
  showSquares,
  animateNoise,
}: {
  noisePoint: { x: number; y: number } | null;
  showSquares: boolean;
  animateNoise: boolean;
}) {
  const vdd = VDD;
  const { leftCurve, rightCurve } = useMemo(() => generateButterflyCurve(vdd), [vdd]);

  const W = 400;
  const H = 400;
  const pad = 45;
  const chartW = W - pad * 2;
  const chartH = H - pad * 2;

  const toSvg = (x: number, y: number) => ({
    sx: pad + (x / vdd) * chartW,
    sy: pad + chartH - (y / vdd) * chartH,
  });

  const leftPath = leftCurve.map((p) => {
    const { sx, sy } = toSvg(p.x, p.y);
    return `${sx},${sy}`;
  }).join(" L");

  const rightPath = rightCurve.map((p) => {
    const { sx, sy } = toSvg(p.x, p.y);
    return `${sx},${sy}`;
  }).join(" L");

  // Stable points
  const stable1 = toSvg(0.02, vdd - 0.02);
  const stable2 = toSvg(vdd - 0.02, 0.02);
  const unstable = toSvg(vdd / 2, vdd / 2);

  // SNM squares (approximate)
  const snmV = SNM / 1000; // Convert mV to V
  // Lower-left eye: around (0, VDD) region
  const sq1 = toSvg(0.15, vdd - 0.15 - snmV);
  const sq1end = toSvg(0.15 + snmV, vdd - 0.15);
  // Upper-right eye: around (VDD, 0) region
  const sq2 = toSvg(vdd - 0.15 - snmV, 0.15);
  const sq2end = toSvg(vdd - 0.15, 0.15 + snmV);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-md mx-auto">
      <defs>
        <filter id="glow3d">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x={pad} y={pad} width={chartW} height={chartH} fill="#080c16" rx="4" />

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const { sx, sy } = toSvg(frac * vdd, 0);
        const { sy: sy2 } = toSvg(0, frac * vdd);
        return (
          <g key={frac}>
            <line x1={sx} y1={pad} x2={sx} y2={pad + chartH} stroke="#1e293b" strokeWidth="0.5" />
            <line x1={pad} y1={sy2} x2={pad + chartW} y2={sy2} stroke="#1e293b" strokeWidth="0.5" />
            <text x={sx} y={pad + chartH + 15} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {(frac * vdd).toFixed(1)}
            </text>
            <text x={pad - 8} y={sy2 + 4} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">
              {(frac * vdd).toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Axes labels */}
      <text x={W / 2} y={H - 5} fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">
        Q (V)
      </text>
      <text x="12" y={H / 2} fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle"
        transform={`rotate(-90, 12, ${H / 2})`}>
        QB (V)
      </text>

      {/* Diagonal (Q = QB line) */}
      <line x1={toSvg(0, 0).sx} y1={toSvg(0, 0).sy} x2={toSvg(vdd, vdd).sx} y2={toSvg(vdd, vdd).sy}
        stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Left curve: QB = f(Q) */}
      <motion.path
        d={`M${leftPath}`}
        fill="none"
        stroke="#00f0ff"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Right curve: inverse */}
      <motion.path
        d={`M${rightPath}`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* SNM squares */}
      {showSquares && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <rect
            x={sq1.sx} y={sq1.sy}
            width={sq1end.sx - sq1.sx} height={sq1end.sy - sq1.sy}
            fill="#10b98115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2"
          />
          <rect
            x={sq2.sx} y={sq2.sy}
            width={sq2end.sx - sq2.sx} height={sq2end.sy - sq2.sy}
            fill="#10b98115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2"
          />
          <text x={(sq1.sx + sq1end.sx) / 2} y={(sq1.sy + sq1end.sy) / 2 + 4}
            fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            SNM
          </text>
          <text x={(sq2.sx + sq2end.sx) / 2} y={(sq2.sy + sq2end.sy) / 2 + 4}
            fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            SNM
          </text>
        </motion.g>
      )}

      {/* Stable points */}
      <motion.circle cx={stable1.sx} cy={stable1.sy} r="6" fill="#10b981" filter="url(#glow3d)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} />
      <text x={stable1.sx + 12} y={stable1.sy + 4} fill="#10b981" fontSize="9" fontFamily="monospace">
        Q=0, QB=1
      </text>

      <motion.circle cx={stable2.sx} cy={stable2.sy} r="6" fill="#10b981" filter="url(#glow3d)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
      <text x={stable2.sx - 12} y={stable2.sy - 8} fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="end">
        Q=1, QB=0
      </text>

      {/* Unstable point */}
      <motion.circle cx={unstable.sx} cy={unstable.sy} r="5" fill="none" stroke="#ef4444" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} />
      <text x={unstable.sx + 10} y={unstable.sy - 8} fill="#ef4444" fontSize="8" fontFamily="monospace">
        metastable
      </text>

      {/* Noise animation */}
      {animateNoise && noisePoint && (
        <motion.circle
          r="5"
          fill="#ef4444"
          filter="url(#glow3d)"
          animate={{
            cx: [toSvg(0.1, 1.7).sx, toSvg(0.4, 1.3).sx, toSvg(0.2, 1.5).sx, toSvg(0.05, 1.75).sx],
            cy: [toSvg(0.1, 1.7).sy, toSvg(0.4, 1.3).sy, toSvg(0.2, 1.5).sy, toSvg(0.05, 1.75).sy],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Legend */}
      <g transform={`translate(${W - 130}, ${pad + 10})`}>
        <line x1="0" y1="0" x2="20" y2="0" stroke="#00f0ff" strokeWidth="2" />
        <text x="25" y="4" fill="#00f0ff" fontSize="9" fontFamily="monospace">QB = f(Q)</text>
        <line x1="0" y1="16" x2="20" y2="16" stroke="#f59e0b" strokeWidth="2" />
        <text x="25" y="20" fill="#f59e0b" fontSize="9" fontFamily="monospace">Q = f(QB)</text>
      </g>
    </svg>
  );
}

type StabilityStep = "curves" | "squares" | "noise" | "snap";

export default function Chapter3d() {
  const [step, setStep] = useState<StabilityStep>("curves");
  const [noisePoint, setNoisePoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (step === "noise" || step === "snap") {
      setNoisePoint({ x: 0.3, y: 1.5 });
    } else {
      setNoisePoint(null);
    }
  }, [step]);

  return (
    <div className="mt-20">
      <ScrollReveal>
        <h3 className="text-2xl font-bold text-center text-[#a855f7] mb-2">
          3d: Stability — The Butterfly Curve
        </h3>
        <p className="text-center text-[#94a3b8] text-sm max-w-2xl mx-auto mb-8">
          How much noise can an SRAM cell withstand before flipping? The butterfly curve reveals the answer.
        </p>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
          <ButterflyCurveChart
            noisePoint={noisePoint}
            showSquares={step === "squares" || step === "noise" || step === "snap"}
            animateNoise={step === "noise" || step === "snap"}
          />

          {/* Step description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-[#080c16] rounded-lg p-4 border border-[#1e293b]"
            >
              {step === "curves" && (
                <div>
                  <div className="mono text-sm text-[#a855f7] font-bold mb-1">The Two Transfer Curves</div>
                  <p className="text-sm text-[#94a3b8]">
                    Plot <span className="text-[#00f0ff]">QB = f(Q)</span> (left inverter) and{" "}
                    <span className="text-[#f59e0b]">Q = f(QB)</span> (right inverter, mirrored) on the same axes.
                    Where they intersect = stable operating points. The two &ldquo;eyes&rdquo; of the butterfly are where the cell stores 0 or 1.
                  </p>
                </div>
              )}
              {step === "squares" && (
                <div>
                  <div className="mono text-sm text-[#10b981] font-bold mb-1">
                    SNM = {SNM} mV — Largest Square Inside Each Eye
                  </div>
                  <p className="text-sm text-[#94a3b8]">
                    The <span className="text-[#10b981]">Static Noise Margin</span> is the side length of the largest
                    square that fits inside each eye. Larger square = more stable cell. At {SNM} mV, this cell can
                    withstand {SNM} mV of DC noise — {((SNM / (VDD * 1000)) * 100).toFixed(0)}% of VDD. Spec requires only 100 mV.
                  </p>
                </div>
              )}
              {step === "noise" && (
                <div>
                  <div className="mono text-sm text-[#ef4444] font-bold mb-1">Noise Pushes the Operating Point</div>
                  <p className="text-sm text-[#94a3b8]">
                    When noise perturbs Q or QB, the operating point moves within the eye. Watch the{" "}
                    <span className="text-[#ef4444]">red dot</span> — it wanders but stays trapped inside the eye.
                    As long as noise is less than SNM, the cell <span className="text-[#10b981]">snaps back</span> to its stable state.
                  </p>
                </div>
              )}
              {step === "snap" && (
                <div>
                  <div className="mono text-sm text-[#10b981] font-bold mb-1">Snap Back — Feedback Wins</div>
                  <p className="text-sm text-[#94a3b8]">
                    The cross-coupled feedback acts like a restoring force. Push the operating point, and it springs back.
                    Only if noise exceeds {SNM} mV ({((SNM / (VDD * 1000)) * 100).toFixed(0)}% of VDD) will the cell flip to the other eye. At worst-case PVT: SNM = 437 mV — still 4.4× above spec.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {([
              ["curves", "Transfer Curves", "#a855f7"],
              ["squares", "SNM Squares", "#10b981"],
              ["noise", "Add Noise", "#ef4444"],
              ["snap", "Snap Back", "#10b981"],
            ] as [StabilityStep, string, string][]).map(([s, label, color]) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-4 py-2 rounded-lg mono text-xs border transition-all ${
                  step === s
                    ? `bg-[${color}15] border-white/20 text-white`
                    : "bg-transparent border-white/10 text-[#94a3b8] hover:text-white"
                }`}
                style={step === s ? { color, borderColor: `${color}40` } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SNM metrics */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
            <GlowCard color="#10b981" delay={0}>
              <div className="text-center">
                <div className="mono text-3xl text-[#10b981] font-bold">{SNM} mV</div>
                <div className="text-sm text-[#94a3b8] mt-1">Nominal SNM</div>
                <div className="text-xs text-[#475569] mono mt-2">tt/27°C/{VDD}V</div>
              </div>
            </GlowCard>
            <GlowCard color="#f59e0b" delay={0.1}>
              <div className="text-center">
                <div className="mono text-3xl text-[#f59e0b] font-bold">437 mV</div>
                <div className="text-sm text-[#94a3b8] mt-1">Worst-Case SNM</div>
                <div className="text-xs text-[#475569] mono mt-2">sf/-40°C/1.62V</div>
              </div>
            </GlowCard>
            <GlowCard color="#a855f7" delay={0.2}>
              <div className="text-center">
                <div className="mono text-3xl text-[#a855f7] font-bold">100 mV</div>
                <div className="text-sm text-[#94a3b8] mt-1">Spec Requirement</div>
                <div className="text-xs text-[#475569] mono mt-2">4.4× margin at worst case</div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
