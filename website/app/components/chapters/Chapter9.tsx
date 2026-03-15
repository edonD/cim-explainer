"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";

const applications = [
  {
    icon: "🏥",
    title: "Implantable Medical Devices",
    desc: "Neural interfaces that process brain signals in real-time with microwatt power budgets",
    color: "#ef4444",
  },
  {
    icon: "📱",
    title: "Edge AI & IoT",
    desc: "Always-on keyword detection, gesture recognition, and anomaly detection without cloud connectivity",
    color: "#00f0ff",
  },
  {
    icon: "🛰️",
    title: "Autonomous Sensors",
    desc: "Satellites and remote sensors that classify data on-device before transmitting only what matters",
    color: "#a855f7",
  },
  {
    icon: "🔋",
    title: "Battery-Free AI",
    desc: "Energy-harvesting devices that compute on scavenged power — solar, RF, thermal",
    color: "#10b981",
  },
];

function PowerComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const comparisons = [
    { label: "GPU (NVIDIA A100)", power: 300_000, color: "#ef4444", unit: "300W" },
    { label: "Mobile GPU (Adreno)", power: 5_000, color: "#f59e0b", unit: "5W" },
    { label: "Neural Accelerator (NPU)", power: 500, color: "#a855f7", unit: "500mW" },
    { label: "CIM Tile (This Chip)", power: 10, color: "#10b981", unit: "<10mW" },
  ];

  const maxPower = comparisons[0].power;

  return (
    <div ref={ref} className="max-w-2xl mx-auto my-12">
      <div className="space-y-4">
        {comparisons.map((item, i) => {
          const logWidth = Math.max(
            5,
            (Math.log10(item.power) / Math.log10(maxPower)) * 100
          );

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-[#94a3b8]">{item.label}</span>
                <span className="mono font-bold" style={{ color: item.color }}>
                  {item.unit}
                </span>
              </div>
              <div className="h-6 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                    boxShadow: `0 0 15px ${item.color}44`,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${logWidth}%` } : {}}
                  transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
        <p className="text-center text-xs text-[#94a3b8] mt-2 mono">
          Power consumption for equivalent inference task (log scale)
        </p>
      </div>
    </div>
  );
}

export default function Chapter9() {
  return (
    <section id="chapter-9" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={9}
          title="Why This Matters"
          subtitle="The future of AI isn't bigger data centers"
          color="#10b981"
        />

        <PowerComparison />

        <ScrollReveal delay={0.1}>
          <div className="max-w-xl mx-auto mb-12">
            <GlowCard color="#10b981">
              <div className="text-center">
                <div className="mono text-sm text-[#94a3b8] mb-3">Energy per Inference (MNIST digit)</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="mono text-2xl text-[#ef4444] font-bold">~1 mJ</div>
                    <div className="text-[10px] text-[#94a3b8]">GPU</div>
                  </div>
                  <div>
                    <div className="mono text-2xl text-[#f59e0b] font-bold">~10 µJ</div>
                    <div className="text-[10px] text-[#94a3b8]">NPU</div>
                  </div>
                  <div>
                    <div className="mono text-2xl text-[#10b981] font-bold">~0.5 µJ</div>
                    <div className="text-[10px] text-[#94a3b8]">CIM Tile</div>
                  </div>
                </div>
                <div className="mono text-xs text-[#10b981] mt-3">
                  2,000× more efficient than GPU — runs on a coin cell battery for years
                </div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            {applications.map((app, i) => (
              <GlowCard key={i} color={app.color} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{app.icon}</span>
                  <div>
                    <h4
                      className="font-bold mb-1"
                      style={{ color: app.color }}
                    >
                      {app.title}
                    </h4>
                    <p className="text-sm text-[#94a3b8]">{app.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <motion.div
            className="text-center mt-20 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#10b981] mb-6">
              The future of AI isn&apos;t bigger data centers.
            </p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00f0ff] text-glow-cyan">
              It&apos;s smarter silicon.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Footer / credits */}
        <ScrollReveal delay={0.5}>
          <div className="mt-20 pt-12 border-t border-white/5 text-center">
            <p className="text-sm text-[#475569] mb-2">
              Built from a real chip design on the{" "}
              <span className="text-[#94a3b8]">SkyWater SKY130 130nm CMOS</span> process
            </p>
            <p className="text-xs text-[#334155] mono">
              All measurements, transistor sizes, and performance data are from actual SPICE simulations
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
