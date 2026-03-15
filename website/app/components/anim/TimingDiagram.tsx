"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Signal {
  name: string;
  color: string;
  waveform: number[]; // 0-1 normalized values at each time step
  type: "digital" | "analog";
}

interface TimingDiagramProps {
  signals: Signal[];
  timeLabels: string[];
  phaseLabels: { start: number; end: number; label: string; color: string }[];
  title?: string;
}

export default function TimingDiagram({
  signals,
  timeLabels,
  phaseLabels,
  title,
}: TimingDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = signals[0]?.waveform.length || 0;
  const labelWidth = 70;
  const chartWidth = 400;
  const rowHeight = 40;
  const totalHeight = signals.length * rowHeight + 50;
  const stepWidth = chartWidth / Math.max(steps - 1, 1);

  useEffect(() => {
    if (!playing || !isInView) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= steps - 1) {
          setPlaying(false);
          return steps - 1;
        }
        return p + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [playing, isInView, steps]);

  const visibleSteps = Math.min(Math.ceil(progress) + 1, steps);

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-8">
      <div className="bg-[#0d1526] rounded-xl p-4 neon-border">
        {title && (
          <div className="text-center mono text-sm text-[#00f0ff] mb-3">
            {title}
          </div>
        )}

        <svg
          viewBox={`0 0 ${labelWidth + chartWidth + 20} ${totalHeight}`}
          className="w-full h-auto"
        >
          {/* Phase labels at top */}
          {phaseLabels.map((phase, i) => {
            const x1 = labelWidth + phase.start * stepWidth;
            const x2 = labelWidth + phase.end * stepWidth;
            return (
              <g key={i}>
                <rect
                  x={x1}
                  y={0}
                  width={x2 - x1}
                  height={16}
                  fill={`${phase.color}15`}
                  rx={3}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={12}
                  fill={phase.color}
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {phase.label}
                </text>
              </g>
            );
          })}

          {/* Signals */}
          {signals.map((signal, si) => {
            const y = 25 + si * rowHeight;
            const baseline = y + rowHeight - 8;
            const top = y + 4;

            // Build path
            const points: string[] = [];
            for (let t = 0; t < visibleSteps; t++) {
              const x = labelWidth + t * stepWidth;
              const val = signal.waveform[t];
              const yPos = signal.type === "digital"
                ? (val > 0.5 ? top : baseline)
                : baseline - val * (baseline - top);

              if (t === 0) {
                points.push(`M ${x} ${yPos}`);
              } else if (signal.type === "digital") {
                // Sharp transitions for digital
                const prevVal = signal.waveform[t - 1];
                const prevY = prevVal > 0.5 ? top : baseline;
                if (Math.abs(val - prevVal) > 0.1) {
                  points.push(`L ${x} ${prevY}`);
                }
                points.push(`L ${x} ${yPos}`);
              } else {
                points.push(`L ${x} ${yPos}`);
              }
            }

            return (
              <g key={si}>
                {/* Label */}
                <text
                  x={labelWidth - 4}
                  y={y + rowHeight / 2 + 4}
                  fill={signal.color}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {signal.name}
                </text>

                {/* Grid line */}
                <line
                  x1={labelWidth}
                  y1={baseline + 4}
                  x2={labelWidth + chartWidth}
                  y2={baseline + 4}
                  stroke="#1e293b"
                  strokeWidth="0.5"
                />

                {/* Waveform */}
                <motion.path
                  d={points.join(" ")}
                  fill="none"
                  stroke={signal.color}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Current position marker */}
                {progress > 0 && (
                  <circle
                    cx={labelWidth + Math.min(progress, steps - 1) * stepWidth}
                    cy={
                      signal.type === "digital"
                        ? signal.waveform[Math.min(Math.floor(progress), steps - 1)] > 0.5
                          ? top
                          : baseline
                        : baseline -
                          signal.waveform[Math.min(Math.floor(progress), steps - 1)] *
                            (baseline - top)
                    }
                    r="3"
                    fill={signal.color}
                    filter="url(#glowTD)"
                  />
                )}
              </g>
            );
          })}

          {/* Time cursor */}
          {progress > 0 && (
            <line
              x1={labelWidth + Math.min(progress, steps - 1) * stepWidth}
              y1={20}
              x2={labelWidth + Math.min(progress, steps - 1) * stepWidth}
              y2={totalHeight - 10}
              stroke="#ffffff20"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          )}

          {/* Time axis */}
          {timeLabels.map((label, i) => {
            const x = labelWidth + (i / (timeLabels.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={totalHeight - 2}
                fill="#475569"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}

          <defs>
            <filter id="glowTD">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Controls */}
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => { setProgress(0); setPlaying(true); }}
            className="px-4 py-1.5 rounded-lg mono text-xs border border-[#00f0ff]/40 text-[#00f0ff] bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10"
          >
            ▶ Play
          </button>
          <button
            onClick={() => setPlaying(false)}
            className="px-4 py-1.5 rounded-lg mono text-xs border border-white/10 text-[#94a3b8] hover:border-white/20"
          >
            ⏸ Pause
          </button>
          <button
            onClick={() => { setProgress(0); setPlaying(false); }}
            className="px-4 py-1.5 rounded-lg mono text-xs border border-white/10 text-[#94a3b8] hover:border-white/20"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}
