"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { CHIP, ADC, PWM, BITCELL, ARRAY } from "../chipData";

function ChipExplodedView() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const layers = [
    {
      label: "PWM Drivers (64×)",
      color: "#a855f7",
      desc: `${PWM.transistor_count} transistors each, ${PWM.t_lsb_ns.toFixed(1)}ns LSB`,
      yOffset: 0,
    },
    {
      label: "64×64 SRAM CIM Array",
      color: "#10b981",
      desc: `${CHIP.array_rows * CHIP.array_cols} bitcells, ${BITCELL.cell_area_um2}µm² each`,
      yOffset: 1,
    },
    {
      label: "64 SAR ADCs",
      color: "#f59e0b",
      desc: `${ADC.bits}-bit, ${ADC.conversion_time_ns}ns, ${ADC.power_uw.toFixed(1)}µW each`,
      yOffset: 2,
    },
    {
      label: "Control Logic",
      color: "#00f0ff",
      desc: "Timing, sequencing, I/O",
      yOffset: 3,
    },
  ];

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-8 neon-border">
        <div className="space-y-4">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, y: 0 }
                  : {}
              }
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative"
            >
              {/* 3D-ish layer card */}
              <div
                className="relative rounded-xl p-4 border-2 overflow-hidden"
                style={{
                  borderColor: `${layer.color}40`,
                  background: `linear-gradient(135deg, ${layer.color}08, ${layer.color}03)`,
                  transform: `perspective(800px) rotateX(5deg) rotateY(-2deg)`,
                  boxShadow: `0 4px 20px ${layer.color}15, inset 0 0 40px ${layer.color}05`,
                }}
              >
                {/* Grid pattern inside */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(${layer.color}20 1px, transparent 1px),
                      linear-gradient(90deg, ${layer.color}20 1px, transparent 1px)
                    `,
                    backgroundSize: i === 1 ? "8px 8px" : "20px 20px",
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4
                      className="mono text-sm font-bold"
                      style={{ color: layer.color }}
                    >
                      {layer.label}
                    </h4>
                    <p className="text-xs text-[#94a3b8] mt-1">{layer.desc}</p>
                  </div>

                  {/* Layer icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${layer.color}15`,
                      border: `1px solid ${layer.color}30`,
                    }}
                  >
                    <span className="mono text-lg" style={{ color: layer.color }}>
                      {i === 0 && "⊲"}
                      {i === 1 && "⊞"}
                      {i === 2 && "⊳"}
                      {i === 3 && "⊡"}
                    </span>
                  </div>
                </div>

                {/* Connection lines between layers */}
                {i < layers.length - 1 && (
                  <motion.div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-px h-4"
                    style={{ background: `linear-gradient(${layer.color}, ${layers[i + 1].color})` }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ delay: i * 0.2 + 0.5 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chapter8() {
  return (
    <section id="chapter-8" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={8}
          title="The Full Chip"
          subtitle="SKY130 SRAM-CIM Inference Tile"
          color="#00f0ff"
        />

        <ScrollReveal>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-8">
            All the pieces assembled into a single compute tile. Built on{" "}
            <span className="text-[#00f0ff] font-bold">{CHIP.technology}</span> —
            a real, manufacturable process.
          </p>
        </ScrollReveal>

        <ChipExplodedView />

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <GlowCard color="#00f0ff" delay={0}>
              <div className="text-center">
                <div className="mono text-2xl text-[#00f0ff] font-bold">
                  &lt;{ARRAY.compute_cycle_ns} ns
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Compute Cycle</div>
              </div>
            </GlowCard>
            <GlowCard color="#10b981" delay={0.1}>
              <div className="text-center">
                <div className="mono text-2xl text-[#10b981] font-bold">
                  &lt;{ARRAY.power_mw} mW
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Power</div>
              </div>
            </GlowCard>
            <GlowCard color="#f59e0b" delay={0.2}>
              <div className="text-center">
                <div className="mono text-2xl text-[#f59e0b] font-bold">
                  {BITCELL.energy_per_mac_pj} pJ
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Energy / MAC</div>
              </div>
            </GlowCard>
            <GlowCard color="#a855f7" delay={0.3}>
              <div className="text-center">
                <div className="mono text-2xl text-[#a855f7] font-bold">
                  &gt;{ARRAY.mnist_accuracy_pct}%
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">MNIST Accuracy</div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <GlowCard color="#00f0ff" className="max-w-3xl mx-auto mt-8">
            <p className="text-center text-lg text-[#94a3b8]">
              This entire tile does what would take a GPU millions of transistors —
              with a <span className="text-[#10b981] font-bold">fraction of the power</span>.
              The array alone: {CHIP.array_rows * CHIP.array_cols} cells ×{" "}
              8 transistors = <span className="mono text-[#00f0ff]">
              {(CHIP.array_rows * CHIP.array_cols * 8).toLocaleString()} transistors
              </span> for {(CHIP.array_rows * CHIP.array_cols).toLocaleString()} simultaneous MACs.
            </p>
          </GlowCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
