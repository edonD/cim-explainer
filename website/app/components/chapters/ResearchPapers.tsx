"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";

interface PaperSpec {
  label: string;
  value: string;
  color: string;
}

interface PaperData {
  venue: string;
  venueColor: string;
  title: string;
  year: number;
  node: string;
  specs: PaperSpec[];
  innovation: string;
  architectureSvg: React.ReactNode;
}

function PaperCard({ paper, index }: { paper: PaperData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="relative rounded-xl bg-[#0d1526] border border-white/5 overflow-hidden cursor-pointer"
      style={{ boxShadow: `0 0 30px ${paper.venueColor}10` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Venue badge */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ background: `${paper.venueColor}15`, borderBottom: `1px solid ${paper.venueColor}20` }}
      >
        <span className="mono text-xs font-bold tracking-wider" style={{ color: paper.venueColor }}>
          [{paper.venue} {paper.year}]
        </span>
        <span className="mono text-[10px] text-[#94a3b8]">{paper.node}</span>
      </div>

      {/* Title */}
      <div className="px-5 pt-4 pb-3">
        <h4 className="text-sm font-bold text-[#e2e8f0] leading-tight">{paper.title}</h4>
      </div>

      {/* Architecture SVG */}
      <div className="px-5 py-3">
        <div className="bg-[#080d1a] rounded-lg p-4 border border-white/5">
          {paper.architectureSvg}
        </div>
      </div>

      {/* Specs row */}
      <div className="px-5 py-3 flex flex-wrap gap-3">
        {paper.specs.map((spec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
            className="rounded-lg px-3 py-2 text-center"
            style={{ background: `${spec.color}10`, border: `1px solid ${spec.color}20` }}
          >
            <div className="mono text-lg font-bold" style={{ color: spec.color }}>{spec.value}</div>
            <div className="text-[10px] text-[#94a3b8]">{spec.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Innovation text */}
      <motion.div
        className="px-5 pb-5"
        initial={false}
        animate={{ height: expanded ? "auto" : "auto" }}
      >
        <div className="rounded-lg p-3" style={{ background: `${paper.venueColor}08` }}>
          <div className="text-[10px] mono font-bold mb-1" style={{ color: paper.venueColor }}>
            KEY INNOVATION
          </div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">{paper.innovation}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── SVG Architecture Diagrams ── */

function OutlierAwareSvg() {
  return (
    <svg viewBox="0 0 400 120" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* Input activations */}
      <rect x="10" y="30" width="70" height="60" rx="4" fill="#00f0ff10" stroke="#00f0ff" strokeWidth="0.8" />
      <text x="45" y="55" textAnchor="middle" fill="#00f0ff" fontSize="8" fontFamily="monospace">Input</text>
      <text x="45" y="68" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">Activations</text>

      {/* Outlier detector */}
      <rect x="100" y="10" width="80" height="35" rx="4" fill="#ef444410" stroke="#ef4444" strokeWidth="0.8" />
      <text x="140" y="28" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">Outlier</text>
      <text x="140" y="38" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">Detector</text>

      {/* Normal path - CIM */}
      <rect x="100" y="55" width="80" height="35" rx="4" fill="#10b98110" stroke="#10b981" strokeWidth="0.8" />
      <text x="140" y="73" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">CIM Macro</text>
      <text x="140" y="83" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Low-precision</text>

      {/* Outlier path - FP */}
      <rect x="200" y="10" width="80" height="35" rx="4" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="240" y="28" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">FP Unit</text>
      <text x="240" y="38" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">High-precision</text>

      {/* Merge */}
      <rect x="300" y="30" width="80" height="60" rx="4" fill="#a855f710" stroke="#a855f7" strokeWidth="0.8" />
      <text x="340" y="55" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="monospace">Merge +</text>
      <text x="340" y="68" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="monospace">Accumulate</text>

      {/* Arrows */}
      <line x1="80" y1="50" x2="100" y2="27" stroke="#00f0ff" strokeWidth="0.8" markerEnd="url(#arrowCyan)" />
      <line x1="80" y1="65" x2="100" y2="72" stroke="#00f0ff" strokeWidth="0.8" markerEnd="url(#arrowCyan)" />
      <line x1="180" y1="27" x2="200" y2="27" stroke="#ef4444" strokeWidth="0.8" markerEnd="url(#arrowRed)" />
      <line x1="180" y1="72" x2="300" y2="60" stroke="#10b981" strokeWidth="0.8" markerEnd="url(#arrowGreen)" />
      <line x1="280" y1="27" x2="300" y2="50" stroke="#f59e0b" strokeWidth="0.8" markerEnd="url(#arrowAmber)" />

      {/* Labels */}
      <text x="92" y="105" fill="#94a3b8" fontSize="5" fontFamily="monospace">~95% normal values → CIM</text>
      <text x="200" y="105" fill="#94a3b8" fontSize="5" fontFamily="monospace">~5% outliers → FP</text>

      <defs>
        <marker id="arrowCyan" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#00f0ff" />
        </marker>
        <marker id="arrowRed" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#ef4444" />
        </marker>
        <marker id="arrowGreen" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#10b981" />
        </marker>
        <marker id="arrowAmber" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  );
}

function SparsityCimSvg() {
  return (
    <svg viewBox="0 0 400 120" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* Sparse weight matrix */}
      <rect x="10" y="15" width="90" height="90" rx="4" fill="#0d1526" stroke="#a855f7" strokeWidth="0.8" />
      <text x="55" y="10" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="monospace">Sparse Weights</text>
      {/* Grid with sparse dots */}
      {[0,1,2,3,4,5,6,7].map(r => [0,1,2,3,4,5,6,7].map(c => {
        const filled = [
          [0,2],[0,5],[1,1],[1,7],[2,3],[2,6],[3,0],[3,4],
          [4,2],[4,7],[5,1],[5,5],[6,3],[6,6],[7,0],[7,4]
        ].some(([fr, fc]) => fr === r && fc === c);
        return (
          <rect
            key={`${r}-${c}`}
            x={17 + c * 10}
            y={22 + r * 10}
            width="7"
            height="7"
            rx="1"
            fill={filled ? "#a855f780" : "#1e293b40"}
            stroke={filled ? "#a855f7" : "#1e293b"}
            strokeWidth="0.3"
          />
        );
      }))}

      {/* Sparsity detector */}
      <rect x="120" y="30" width="70" height="60" rx="4" fill="#00f0ff10" stroke="#00f0ff" strokeWidth="0.8" />
      <text x="155" y="55" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="monospace">Sparsity</text>
      <text x="155" y="67" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="monospace">Detector</text>

      {/* Skip logic */}
      <rect x="210" y="15" width="70" height="35" rx="4" fill="#ef444410" stroke="#ef4444" strokeWidth="0.8" />
      <text x="245" y="33" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">Skip Zero</text>
      <text x="245" y="43" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Save energy</text>

      {/* CIM compute */}
      <rect x="210" y="60" width="70" height="45" rx="4" fill="#10b98110" stroke="#10b981" strokeWidth="0.8" />
      <text x="245" y="78" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">CIM MAC</text>
      <text x="245" y="90" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Non-zero only</text>

      {/* Output */}
      <rect x="310" y="30" width="75" height="60" rx="4" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="347" y="55" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">Full-Path</text>
      <text x="347" y="67" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">Accumulator</text>

      {/* Arrows */}
      <line x1="100" y1="60" x2="120" y2="60" stroke="#a855f7" strokeWidth="0.8" />
      <line x1="190" y1="45" x2="210" y2="32" stroke="#00f0ff" strokeWidth="0.8" />
      <line x1="190" y1="65" x2="210" y2="80" stroke="#00f0ff" strokeWidth="0.8" />
      <line x1="280" y1="80" x2="310" y2="65" stroke="#10b981" strokeWidth="0.8" />
    </svg>
  );
}

function DualModeSvg() {
  return (
    <svg viewBox="0 0 400 130" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* 6T SRAM Array */}
      <rect x="120" y="25" width="160" height="80" rx="4" fill="#10b98108" stroke="#10b981" strokeWidth="0.8" />
      <text x="200" y="20" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">6T-SRAM CIM Array</text>

      {/* Grid lines */}
      {[0,1,2,3].map(i => (
        <g key={`row-${i}`}>
          <line x1="130" y1={38 + i * 16} x2="270" y2={38 + i * 16} stroke="#10b98130" strokeWidth="0.5" />
          <line x1={140 + i * 32} y1="30" x2={140 + i * 32} y2="100" stroke="#10b98130" strokeWidth="0.5" />
        </g>
      ))}

      {/* Inference mode (left) */}
      <rect x="10" y="25" width="90" height="35" rx="4" fill="#00f0ff10" stroke="#00f0ff" strokeWidth="0.8" />
      <text x="55" y="42" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="monospace">Inference</text>
      <text x="55" y="52" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">W × X forward</text>

      {/* Training mode (left) */}
      <rect x="10" y="70" width="90" height="35" rx="4" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="55" y="87" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">Training</text>
      <text x="55" y="97" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">W^T × grad back</text>

      {/* Output */}
      <rect x="300" y="40" width="85" height="50" rx="4" fill="#a855f710" stroke="#a855f7" strokeWidth="0.8" />
      <text x="342" y="60" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="monospace">Dual Output</text>
      <text x="342" y="75" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">192.3 TFLOPS/W</text>

      {/* Arrows */}
      <line x1="100" y1="42" x2="120" y2="50" stroke="#00f0ff" strokeWidth="0.8" />
      <line x1="100" y1="87" x2="120" y2="75" stroke="#f59e0b" strokeWidth="0.8" />
      <line x1="280" y1="65" x2="300" y2="65" stroke="#a855f7" strokeWidth="0.8" />

      {/* Transpose arrow */}
      <path d="M 200,105 C 200,120 200,120 200,105" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="200" y="125" textAnchor="middle" fill="#f59e0b" fontSize="6" fontFamily="monospace">Transpose mode: read columns as rows</text>
    </svg>
  );
}

function NatureMixedSvg() {
  return (
    <svg viewBox="0 0 400 130" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* TSMC chip outline */}
      <rect x="50" y="10" width="300" height="110" rx="6" fill="#0d1526" stroke="#a855f740" strokeWidth="1" strokeDasharray="4,2" />
      <text x="200" y="8" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">TSMC Mixed-Precision CIM Processor</text>

      {/* Memristor CIM block */}
      <rect x="65" y="25" width="85" height="55" rx="4" fill="#ef444410" stroke="#ef4444" strokeWidth="0.8" />
      <text x="107" y="45" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">Memristor</text>
      <text x="107" y="57" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">CIM</text>
      <text x="107" y="70" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Low precision</text>

      {/* SRAM CIM block */}
      <rect x="160" y="25" width="85" height="55" rx="4" fill="#00f0ff10" stroke="#00f0ff" strokeWidth="0.8" />
      <text x="202" y="45" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="monospace">SRAM</text>
      <text x="202" y="57" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="monospace">CIM</text>
      <text x="202" y="70" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Med precision</text>

      {/* Digital unit */}
      <rect x="255" y="25" width="85" height="55" rx="4" fill="#10b98110" stroke="#10b981" strokeWidth="0.8" />
      <text x="297" y="45" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">Tiny</text>
      <text x="297" y="57" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">Digital</text>
      <text x="297" y="70" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Full precision</text>

      {/* Controller */}
      <rect x="100" y="90" width="200" height="25" rx="4" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="200" y="106" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">Layer-Granular Precision Controller</text>

      {/* Connections */}
      <line x1="107" y1="80" x2="150" y2="95" stroke="#ef444460" strokeWidth="0.6" />
      <line x1="202" y1="80" x2="200" y2="90" stroke="#00f0ff60" strokeWidth="0.6" />
      <line x1="297" y1="80" x2="250" y2="95" stroke="#10b98160" strokeWidth="0.6" />
    </svg>
  );
}

function DMatrixSvg() {
  return (
    <svg viewBox="0 0 400 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* PCIe card outline */}
      <rect x="20" y="10" width="360" height="120" rx="6" fill="#0d1526" stroke="#00f0ff30" strokeWidth="1" />
      <text x="200" y="8" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">d-Matrix Corsair — PCIe 5.0 x16</text>

      {/* Chip 1 */}
      <rect x="35" y="22" width="155" height="95" rx="4" fill="#0a0f1e" stroke="#a855f730" strokeWidth="0.8" />
      <text x="112" y="18" textAnchor="middle" fill="#a855f7" fontSize="6" fontFamily="monospace">Chip 1 (TSMC 6nm)</text>

      {/* Chiplets in chip 1 */}
      {[0,1,2,3].map(i => (
        <g key={`c1-${i}`}>
          <rect
            x={42 + (i % 2) * 70}
            y={28 + Math.floor(i / 2) * 42}
            width="62"
            height="36"
            rx="3"
            fill="#00f0ff08"
            stroke="#00f0ff40"
            strokeWidth="0.6"
          />
          <text
            x={73 + (i % 2) * 70}
            y={44 + Math.floor(i / 2) * 42}
            textAnchor="middle"
            fill="#00f0ff"
            fontSize="6"
            fontFamily="monospace"
          >
            DIMC Core
          </text>
          <text
            x={73 + (i % 2) * 70}
            y={55 + Math.floor(i / 2) * 42}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="5"
            fontFamily="monospace"
          >
            256MB SRAM
          </text>
        </g>
      ))}

      {/* Chip 2 */}
      <rect x="210" y="22" width="155" height="95" rx="4" fill="#0a0f1e" stroke="#a855f730" strokeWidth="0.8" />
      <text x="287" y="18" textAnchor="middle" fill="#a855f7" fontSize="6" fontFamily="monospace">Chip 2 (TSMC 6nm)</text>

      {/* Chiplets in chip 2 */}
      {[0,1,2,3].map(i => (
        <g key={`c2-${i}`}>
          <rect
            x={217 + (i % 2) * 70}
            y={28 + Math.floor(i / 2) * 42}
            width="62"
            height="36"
            rx="3"
            fill="#00f0ff08"
            stroke="#00f0ff40"
            strokeWidth="0.6"
          />
          <text
            x={248 + (i % 2) * 70}
            y={44 + Math.floor(i / 2) * 42}
            textAnchor="middle"
            fill="#00f0ff"
            fontSize="6"
            fontFamily="monospace"
          >
            DIMC Core
          </text>
          <text
            x={248 + (i % 2) * 70}
            y={55 + Math.floor(i / 2) * 42}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="5"
            fontFamily="monospace"
          >
            256MB SRAM
          </text>
        </g>
      ))}

      {/* D2D link */}
      <line x1="190" y1="70" x2="210" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="200" y="82" textAnchor="middle" fill="#f59e0b" fontSize="5" fontFamily="monospace">D2D 1TB/s</text>

      {/* Bottom stats */}
      <text x="200" y="135" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
        2GB SRAM total · 150 TB/s on-chip BW · 8 chiplets · 256GB LPDDR5X
      </text>
    </svg>
  );
}

/* ── Paper Data ── */

const papers: PaperData[] = [
  {
    venue: "JSSC",
    venueColor: "#00f0ff",
    title: "22nm Outlier-Aware Floating-Point SRAM CIM for Large Language Models",
    year: 2025,
    node: "22nm TSMC",
    specs: [
      { label: "TFLOPS/W", value: "249.5", color: "#00f0ff" },
      { label: "Process", value: "22nm", color: "#a855f7" },
      { label: "Precision", value: "FP", color: "#f59e0b" },
      { label: "Target", value: "LLMs", color: "#10b981" },
    ],
    innovation:
      "Handles outlier activations in LLMs by splitting computation: ~95% of normal values go through efficient low-precision CIM, while ~5% high-magnitude outliers use a dedicated floating-point path. This solves the main accuracy problem that prevented CIM from running real LLMs.",
    architectureSvg: <OutlierAwareSvg />,
  },
  {
    venue: "ISSCC",
    venueColor: "#10b981",
    title: "51.6 TFLOPS/W Full-Datapath CIM Approaching Sparsity Bound for Compound AI",
    year: 2025,
    node: "Advanced Node",
    specs: [
      { label: "TFLOPS/W", value: "51.6", color: "#10b981" },
      { label: "Sparsity", value: "<2⁻³⁰", color: "#a855f7" },
      { label: "Target", value: "Edge AI", color: "#f59e0b" },
    ],
    innovation:
      "Exploits weight and activation sparsity in neural networks to skip zero-value computations entirely. The full-datapath design integrates sparsity detection, CIM compute, and accumulation, approaching the theoretical energy efficiency bound set by sparsity levels.",
    architectureSvg: <SparsityCimSvg />,
  },
  {
    venue: "ISSCC",
    venueColor: "#f59e0b",
    title: "28nm 192.3 TFLOPS/W Dual-Mode-Transpose 6T-SRAM CIM for Edge Training & Inference",
    year: 2025,
    node: "28nm",
    specs: [
      { label: "TFLOPS/W", value: "192.3", color: "#f59e0b" },
      { label: "Modes", value: "2", color: "#00f0ff" },
      { label: "Cell", value: "6T", color: "#10b981" },
      { label: "Use", value: "Train+Infer", color: "#a855f7" },
    ],
    innovation:
      "First CIM macro that supports BOTH inference AND on-chip training. Uses a transpose mode where the array columns are read as rows, enabling backpropagation (W^T × gradient) without moving weights. Standard 6T SRAM cells keep it manufacturable.",
    architectureSvg: <DualModeSvg />,
  },
  {
    venue: "Nature",
    venueColor: "#ef4444",
    title: "Mixed-Precision Memristor and SRAM Compute-in-Memory AI Processor",
    year: 2025,
    node: "TSMC Advanced",
    specs: [
      { label: "TFLOPS/W", value: "40.9", color: "#ef4444" },
      { label: "Accuracy", value: "<0.45%↓", color: "#10b981" },
      { label: "Wake-up", value: "374µs", color: "#f59e0b" },
      { label: "Journal", value: "Nature", color: "#a855f7" },
    ],
    innovation:
      "Published in Nature — the most prestigious scientific journal. Combines memristor CIM (ultra-low power, low precision), SRAM CIM (medium precision), and digital units (full precision) on one chip. A controller assigns each neural network layer to the optimal compute unit based on error sensitivity. Built by TSMC.",
    architectureSvg: <NatureMixedSvg />,
  },
  {
    venue: "COMMERCIAL",
    venueColor: "#a855f7",
    title: "d-Matrix Corsair: 2GB SRAM In-Memory Compute Platform for LLM Inference",
    year: 2025,
    node: "TSMC 6nm",
    specs: [
      { label: "SRAM", value: "2GB", color: "#a855f7" },
      { label: "Bandwidth", value: "150TB/s", color: "#00f0ff" },
      { label: "Funding", value: "$275M", color: "#10b981" },
      { label: "Tokens/s", value: "30K", color: "#f59e0b" },
    ],
    innovation:
      "A commercial product shipping to data centers. 8 chiplets with Digital In-Memory Computing (DIMC) cores compute matrix multiplications directly inside 2GB of SRAM. Runs Llama 70B at 30,000 tokens/sec with 2ms latency per token. 10× faster and 3-5× more energy efficient than GPUs for inference. $275M in venture funding proves market confidence.",
    architectureSvg: <DMatrixSvg />,
  },
];

export default function ResearchPapers() {
  return (
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-10">
          These are not lab demos. These are{" "}
          <span className="text-[#00f0ff] font-bold">peer-reviewed papers</span> at the top venues in chip design,
          a <span className="text-[#ef4444] font-bold">Nature publication</span>, and a{" "}
          <span className="text-[#a855f7] font-bold">$275M commercial product</span>.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {papers.map((paper, i) => (
          <PaperCard key={i} paper={paper} index={i} />
        ))}
      </div>
    </div>
  );
}
