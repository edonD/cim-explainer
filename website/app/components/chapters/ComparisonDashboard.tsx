"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface ChipEntry {
  name: string;
  color: string;
  node: string;
  efficiency: string;
  effNum: number;
  arraySize: string;
  target: string;
  power: string;
  powerNum: number;
  precision: string;
  highlight?: boolean;
}

const chips: ChipEntry[] = [
  {
    name: "Our SKY130",
    color: "#10b981",
    node: "130nm",
    efficiency: "~0.5 TOPS/W",
    effNum: 0.5,
    arraySize: "64×64",
    target: "Edge AI Prototype",
    power: "<10 mW",
    powerNum: 10,
    precision: "1b W / 4b I",
    highlight: true,
  },
  {
    name: "JSSC '25 FP CIM",
    color: "#00f0ff",
    node: "22nm",
    efficiency: "249.5 TFLOPS/W",
    effNum: 249.5,
    arraySize: "256×256",
    target: "LLM Inference",
    power: "~mW range",
    powerNum: 5,
    precision: "FP16",
  },
  {
    name: "ISSCC '25 Dual",
    color: "#f59e0b",
    node: "28nm",
    efficiency: "192.3 TFLOPS/W",
    effNum: 192.3,
    arraySize: "256×256",
    target: "Train + Infer",
    power: "~mW range",
    powerNum: 5,
    precision: "FP + INT",
  },
  {
    name: "Nature '25",
    color: "#ef4444",
    node: "TSMC Adv.",
    efficiency: "40.9 TFLOPS/W",
    effNum: 40.9,
    arraySize: "Multi-macro",
    target: "Edge AI",
    power: "~mW range",
    powerNum: 10,
    precision: "Mixed",
  },
  {
    name: "d-Matrix Corsair",
    color: "#a855f7",
    node: "6nm",
    efficiency: "38 TOPS/W",
    effNum: 38,
    arraySize: "2GB SRAM",
    target: "Cloud Inference",
    power: "275W",
    powerNum: 275000,
    precision: "INT4/INT8",
  },
  {
    name: "NVIDIA H100",
    color: "#64748b",
    node: "4nm",
    efficiency: "~1 TFLOPS/W",
    effNum: 1,
    arraySize: "80GB HBM3",
    target: "Everything",
    power: "700W",
    powerNum: 700000,
    precision: "FP8-FP64",
  },
];

function EfficiencyBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const maxEff = 260;

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-10">
      <h4 className="text-center mono text-sm text-[#94a3b8] mb-6">
        Energy Efficiency Comparison (TFLOPS/W)
      </h4>
      <div className="space-y-3">
        {chips.filter(c => c.effNum > 0).map((chip, i) => {
          const width = Math.max(3, (chip.effNum / maxEff) * 100);
          return (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="mono" style={{ color: chip.color }}>
                  {chip.name}
                </span>
                <span className="mono font-bold" style={{ color: chip.color }}>
                  {chip.efficiency}
                </span>
              </div>
              <div className="h-5 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${chip.color}aa, ${chip.color})`,
                    boxShadow: chip.highlight ? `0 0 15px ${chip.color}60` : `0 0 8px ${chip.color}30`,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${width}%` } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-[#475569] mt-3 mono">
        Note: Our SKY130 is a 130nm prototype — efficiency scales with node shrink
      </p>
    </div>
  );
}

export default function ComparisonDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto my-16">
      <h3 className="text-2xl font-bold text-center text-[#f59e0b] mb-2">
        How We Compare
      </h3>
      <p className="text-center text-sm text-[#94a3b8] mb-8">
        Our prototype vs. the state of the art and commercial products
      </p>

      <EfficiencyBars />

      {/* Comparison Table */}
      <div className="overflow-x-auto my-10">
        <div className="bg-[#0d1526] rounded-xl p-1 neon-border min-w-[700px]">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[#94a3b8] mono border-b border-white/5">
                <th className="text-left p-3">Metric</th>
                {chips.map((chip, i) => (
                  <th
                    key={i}
                    className="text-center p-3 cursor-pointer transition-colors"
                    style={{ color: hoveredIdx === i ? chip.color : "#94a3b8" }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {chip.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="mono">
              {[
                { label: "Process Node", key: "node" as const },
                { label: "Efficiency", key: "efficiency" as const },
                { label: "Array / Memory", key: "arraySize" as const },
                { label: "Target", key: "target" as const },
                { label: "Power", key: "power" as const },
                { label: "Precision", key: "precision" as const },
              ].map((row, ri) => (
                <motion.tr
                  key={ri}
                  className="border-b border-white/5"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + ri * 0.05 }}
                >
                  <td className="p-3 text-[#94a3b8] font-bold">{row.label}</td>
                  {chips.map((chip, ci) => (
                    <td
                      key={ci}
                      className="p-3 text-center transition-colors"
                      style={{
                        color: hoveredIdx === ci ? chip.color : "#e2e8f0",
                        background: hoveredIdx === ci ? `${chip.color}08` : "transparent",
                      }}
                    >
                      {chip[row.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Scaling Argument */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mt-8"
      >
        <div className="rounded-xl p-6 bg-[#10b98108] border border-[#10b98120]">
          <h4 className="mono text-sm font-bold text-[#10b981] mb-3">THE SCALING ARGUMENT</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="mono text-2xl font-bold text-[#94a3b8]">130nm</div>
              <div className="text-xs text-[#94a3b8] mt-1">Our prototype</div>
              <div className="mono text-sm text-[#10b981] mt-1">~0.5 TOPS/W</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <svg viewBox="0 0 80 20" className="w-16">
                <line x1="5" y1="10" x2="70" y2="10" stroke="#10b981" strokeWidth="1.5" />
                <polygon points="70,5 80,10 70,15" fill="#10b981" />
              </svg>
              <div className="text-[10px] text-[#10b981] mono mt-1">Node shrink</div>
            </div>
            <div>
              <div className="mono text-2xl font-bold text-[#10b981]">22nm</div>
              <div className="text-xs text-[#94a3b8] mt-1">Same architecture</div>
              <div className="mono text-sm text-[#10b981] mt-1">250 TFLOPS/W</div>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8] text-center mt-4">
            The JSSC 2025 paper proves that CIM at 22nm achieves 250 TFLOPS/W. Our chip uses the{" "}
            <span className="text-[#10b981]">same fundamental architecture</span> — 8T SRAM bitcells,
            PWM encoding, column-parallel ADCs. The path from prototype to product is a node shrink
            and precision upgrade — both well-understood engineering problems.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
