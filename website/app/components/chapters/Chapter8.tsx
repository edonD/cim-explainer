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

        {/* Transistor Budget */}
        <ScrollReveal delay={0.3}>
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-lg font-bold text-[#00f0ff] text-center mb-4 mono">
              Transistor Budget
            </h3>
            <div className="bg-[#0d1526] rounded-xl p-5 neon-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#94a3b8] mono text-xs border-b border-white/5">
                    <th className="text-left py-2">Block</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Per Unit</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="mono">
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-[#10b981]">SRAM Array (64×64)</td>
                    <td className="text-right text-[#94a3b8]">4,096</td>
                    <td className="text-right text-[#94a3b8]">8T</td>
                    <td className="text-right text-white font-bold">32,768</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-[#a855f7]">PWM Drivers</td>
                    <td className="text-right text-[#94a3b8]">64</td>
                    <td className="text-right text-[#94a3b8]">{PWM.transistor_count}T</td>
                    <td className="text-right text-white font-bold">{64 * PWM.transistor_count}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-[#f59e0b]">SAR ADCs</td>
                    <td className="text-right text-[#94a3b8]">64</td>
                    <td className="text-right text-[#94a3b8]">~50T</td>
                    <td className="text-right text-white font-bold">~3,200</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-[#00f0ff]">Precharge PMOS</td>
                    <td className="text-right text-[#94a3b8]">64</td>
                    <td className="text-right text-[#94a3b8]">1T</td>
                    <td className="text-right text-white font-bold">64</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-[#94a3b8]">Control Logic</td>
                    <td className="text-right text-[#94a3b8]">1</td>
                    <td className="text-right text-[#94a3b8]">~200T</td>
                    <td className="text-right text-white font-bold">~200</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2 text-[#00f0ff]">TOTAL</td>
                    <td className="text-right" />
                    <td className="text-right" />
                    <td className="text-right text-[#00f0ff]">~36,616</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Timing Budget */}
        <ScrollReveal delay={0.4}>
          <div className="max-w-3xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-[#f59e0b] text-center mb-4 mono">
              Timing Budget (One Compute Cycle)
            </h3>
            <div className="bg-[#0d1526] rounded-xl p-5 neon-border">
              {[
                { phase: "Precharge", time: "~5 ns", pct: 2, color: "#ef4444" },
                { phase: "Compute (PWM)", time: "≤75 ns", pct: 25, color: "#a855f7" },
                { phase: "Settle", time: "~20 ns", pct: 7, color: "#10b981" },
                { phase: "ADC Convert", time: `${ADC.conversion_time_ns} ns`, pct: 36, color: "#f59e0b" },
                { phase: "Read/Output", time: "~10 ns", pct: 3, color: "#00f0ff" },
              ].map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: item.color }} className="mono">{item.phase}</span>
                    <span className="mono text-[#94a3b8]">{item.time}</span>
                  </div>
                  <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}44`,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-center mono text-xs text-[#94a3b8] mt-3">
                Total: ~{5 + 75 + 20 + ADC.conversion_time_ns + 10} ns → {(1e9 / (5 + 75 + 20 + ADC.conversion_time_ns + 10) / 1e6).toFixed(1)} MHz compute rate
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <GlowCard color="#00f0ff" className="max-w-3xl mx-auto mt-8">
            <p className="text-center text-lg text-[#94a3b8]">
              ~36,600 transistors performing {(CHIP.array_rows * CHIP.array_cols).toLocaleString()} simultaneous MACs —
              that&apos;s <span className="text-[#10b981] font-bold">112 MACs per transistor</span>.
              A GPU needs ~1,000 transistors per MAC unit.
            </p>
          </GlowCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
