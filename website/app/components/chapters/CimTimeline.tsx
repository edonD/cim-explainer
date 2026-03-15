"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineEntry {
  year: string;
  label: string;
  detail: string;
  color: string;
  efficiency: string;
  isOurs?: boolean;
}

const timeline: TimelineEntry[] = [
  {
    year: "2018",
    label: "First SRAM CIM Demos",
    detail: "~1 TOPS/W, MNIST-only proof of concept. Binary weights, small arrays.",
    color: "#94a3b8",
    efficiency: "~1 TOPS/W",
  },
  {
    year: "2019",
    label: "Multi-bit Precision",
    detail: "2-4 bit weights, CNN support. Energy efficiency reaches ~10 TOPS/W.",
    color: "#64748b",
    efficiency: "~10 TOPS/W",
  },
  {
    year: "2020",
    label: "Larger Arrays, Better ADCs",
    detail: "256×256 arrays, 8-bit ADCs. First ImageNet demos on CIM.",
    color: "#a855f7",
    efficiency: "~20 TOPS/W",
  },
  {
    year: "2021",
    label: "Digital CIM Emerges",
    detail: "Digital CIM macros solve analog noise issues. Accuracy improves significantly.",
    color: "#00f0ff",
    efficiency: "~30 TOPS/W",
  },
  {
    year: "2022",
    label: "Hybrid Architectures",
    detail: "Mixed analog/digital CIM. Multi-macro chips. First transformer support.",
    color: "#10b981",
    efficiency: "~50 TOPS/W",
  },
  {
    year: "2023",
    label: "Transformer & FP Support",
    detail: "Floating-point CIM macros. Attention-layer acceleration. d-Matrix founded.",
    color: "#f59e0b",
    efficiency: "~70 TFLOPS/W",
  },
  {
    year: "2024",
    label: "LLM-Capable Designs",
    detail: "Outlier-aware quantization. Full-datapath CIM. Commercial prototypes shipping.",
    color: "#ef4444",
    efficiency: "~150 TFLOPS/W",
  },
  {
    year: "2025",
    label: "250 TFLOPS/W + Commercial",
    detail: "ISSCC/JSSC papers at 192-250 TFLOPS/W. Nature paper. d-Matrix Corsair ships. $275M funding.",
    color: "#00f0ff",
    efficiency: "250 TFLOPS/W",
  },
  {
    year: "2026",
    label: "3D Stacked CIM",
    detail: "d-Matrix Raptor (4nm, 3D DRAM). On-chip LLM inference. CIM becomes mainstream.",
    color: "#a855f7",
    efficiency: "Next gen",
  },
];

function EfficiencyChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const dataPoints = [
    { year: 2018, value: 1, label: "1 TOPS/W" },
    { year: 2019, value: 10, label: "10" },
    { year: 2020, value: 20, label: "20" },
    { year: 2021, value: 30, label: "30" },
    { year: 2022, value: 50, label: "50" },
    { year: 2023, value: 70, label: "70" },
    { year: 2024, value: 150, label: "150" },
    { year: 2025, value: 250, label: "250 TFLOPS/W" },
  ];

  const maxVal = 280;
  const chartW = 360;
  const chartH = 140;
  const padL = 40;
  const padB = 20;

  return (
    <div ref={ref} className="max-w-2xl mx-auto my-10">
      <h4 className="text-center mono text-sm text-[#94a3b8] mb-4">
        CIM Energy Efficiency Over Time
      </h4>
      <div className="bg-[#0d1526] rounded-xl p-5 neon-border">
        <svg viewBox={`0 0 ${chartW} ${chartH + padB}`} className="w-full">
          {/* Y-axis labels */}
          {[0, 50, 100, 150, 200, 250].map((v) => {
            const y = chartH - (v / maxVal) * chartH;
            return (
              <g key={v}>
                <line x1={padL} y1={y} x2={chartW} y2={y} stroke="#1e293b" strokeWidth="0.5" />
                <text x={padL - 4} y={y + 3} textAnchor="end" fill="#475569" fontSize="7" fontFamily="monospace">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Data line */}
          <motion.polyline
            points={dataPoints
              .map((d, i) => {
                const x = padL + (i / (dataPoints.length - 1)) * (chartW - padL - 10);
                const y = chartH - (d.value / maxVal) * chartH;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Area under curve */}
          <motion.polygon
            points={
              dataPoints
                .map((d, i) => {
                  const x = padL + (i / (dataPoints.length - 1)) * (chartW - padL - 10);
                  const y = chartH - (d.value / maxVal) * chartH;
                  return `${x},${y}`;
                })
                .join(" ") +
              ` ${padL + ((dataPoints.length - 1) / (dataPoints.length - 1)) * (chartW - padL - 10)},${chartH} ${padL},${chartH}`
            }
            fill="url(#cimGrad)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 1, delay: 1 }}
          />

          {/* Data points */}
          {dataPoints.map((d, i) => {
            const x = padL + (i / (dataPoints.length - 1)) * (chartW - padL - 10);
            const y = chartH - (d.value / maxVal) * chartH;
            return (
              <g key={i}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#00f0ff"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                />
                <text x={x} y={chartH + 12} textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
                  {d.year}
                </text>
                {(i === 0 || i === dataPoints.length - 1) && (
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fill="#00f0ff"
                    fontSize="6"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Our chip marker */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            <circle cx={padL + (0 / 7) * (chartW - padL - 10)} cy={chartH - (1 / maxVal) * chartH} r="6" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <text
              x={padL + 30}
              y={chartH - (1 / maxVal) * chartH - 2}
              fill="#10b981"
              fontSize="6"
              fontFamily="monospace"
            >
              ← Our SKY130 (130nm prototype)
            </text>
          </motion.g>

          <defs>
            <linearGradient id="cimGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function CimTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="max-w-4xl mx-auto my-16">
      <h3 className="text-2xl font-bold text-center text-[#00f0ff] mb-2">
        CIM Evolution: 2018 → 2026
      </h3>
      <p className="text-center text-sm text-[#94a3b8] mb-8">
        From lab demos to commercial products in 7 years
      </p>

      <EfficiencyChart />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#94a3b8] via-[#00f0ff] to-[#a855f7]" />

        {timeline.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex items-start mb-6 ${
              i % 2 === 0
                ? "md:flex-row md:text-right"
                : "md:flex-row-reverse md:text-left"
            } flex-row text-left`}
          >
            {/* Content */}
            <div className={`flex-1 ${i % 2 === 0 ? "md:pr-10" : "md:pl-10"} pl-12 md:pl-0`}>
              <div
                className="rounded-lg p-3 inline-block"
                style={{
                  background: `${entry.color}08`,
                  border: `1px solid ${entry.color}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-1" style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                  <span className="mono text-xs font-bold" style={{ color: entry.color }}>
                    {entry.year}
                  </span>
                  <span className="mono text-xs text-[#94a3b8]">·</span>
                  <span className="mono text-xs" style={{ color: entry.color }}>
                    {entry.efficiency}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#e2e8f0] mb-1">{entry.label}</div>
                <div className="text-xs text-[#94a3b8] max-w-xs">{entry.detail}</div>
              </div>
            </div>

            {/* Dot on timeline */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10"
              style={{
                borderColor: entry.color,
                background: entry.year === "2025" ? entry.color : "#0a0f1e",
                boxShadow: entry.year === "2025" ? `0 0 12px ${entry.color}` : "none",
              }}
            />

            {/* Spacer for other side */}
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
