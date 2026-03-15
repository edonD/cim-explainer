"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";

function DataBus() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [packets, setPackets] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setPackets((prev) => {
        const next = [...prev, Date.now()];
        return next.slice(-8);
      });
    }, 300);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="relative w-full max-w-4xl mx-auto my-12">
      {/* Memory block */}
      <div className="flex items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-shrink-0 w-40 md:w-56 h-32 md:h-40 rounded-xl border-2 border-[#00f0ff]/40 bg-[#00f0ff]/5 flex flex-col items-center justify-center gap-2"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span className="mono text-[#00f0ff] text-sm font-bold">MEMORY</span>
          <span className="text-[10px] text-[#94a3b8]">Weights & Data</span>
        </motion.div>

        {/* Data bus */}
        <div className="flex-1 relative h-16 mx-2 md:mx-4">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full h-8 rounded-full bg-[#ef4444]/5 border border-[#ef4444]/20 relative overflow-hidden">
              {/* Bus label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="mono text-[10px] text-[#ef4444]/60 z-10">
                  DATA BUS
                </span>
              </div>
              {/* Animated packets */}
              {packets.map((id, i) => (
                <motion.div
                  key={id}
                  className="absolute top-1 h-6 w-6 rounded bg-[#ef4444]/60"
                  initial={{ left: i % 2 === 0 ? "-10%" : "110%", opacity: 0.8 }}
                  animate={{
                    left: i % 2 === 0 ? "110%" : "-10%",
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 1.2, ease: "linear" }}
                  style={{
                    boxShadow: "0 0 12px #ef4444aa",
                  }}
                />
              ))}
              {/* Heat glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 15px #ef444433",
                    "0 0 30px #ef444466",
                    "0 0 15px #ef444433",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
          {/* Arrows */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-8">
            <motion.span
              className="text-[#ef4444] text-lg"
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              →
            </motion.span>
            <motion.span
              className="text-[#ef4444] text-lg"
              animate={{ x: [4, -4, 4] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ←
            </motion.span>
          </div>
        </div>

        {/* Compute block */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-shrink-0 w-40 md:w-56 h-32 md:h-40 rounded-xl border-2 border-[#f59e0b]/40 bg-[#f59e0b]/5 flex flex-col items-center justify-center gap-2"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
          </svg>
          <span className="mono text-[#f59e0b] text-sm font-bold">
            PROCESSOR
          </span>
          <span className="text-[10px] text-[#94a3b8]">ALU / Compute</span>
        </motion.div>
      </div>
    </div>
  );
}

function EnergyCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / 3000, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView]);

  const moveEnergy = Math.round(92 * progress);
  const computeEnergy = Math.round(8 * progress);

  return (
    <div ref={ref} className="max-w-xl mx-auto my-12">
      <div className="mb-4 text-center text-sm text-[#94a3b8] mono">
        Energy Breakdown in Neural Network Inference
      </div>
      {/* Data movement bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#ef4444]">Data Movement</span>
          <span className="mono text-[#ef4444] font-bold">{moveEnergy}%</span>
        </div>
        <div className="h-8 bg-[#1e293b] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${moveEnergy}%`,
              background:
                "linear-gradient(90deg, #ef4444, #f97316)",
              boxShadow: "0 0 20px #ef444466",
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${92}%` } : {}}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {/* Compute bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#10b981]">Actual Computation</span>
          <span className="mono text-[#10b981] font-bold">
            {computeEnergy}%
          </span>
        </div>
        <div className="h-8 bg-[#1e293b] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #10b981, #34d399)",
              boxShadow: "0 0 20px #10b98166",
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: "8%" } : {}}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Chapter1() {
  return (
    <section
      id="chapter-1"
      className="chapter-section circuit-grid relative"
    >
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={1}
          title="The Problem"
          subtitle="Why is AI so power hungry?"
          color="#ef4444"
        />

        <ScrollReveal>
          <p className="text-center text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-8">
            In a traditional computer, data lives in{" "}
            <span className="text-[#00f0ff] font-semibold">memory</span> and
            computation happens in the{" "}
            <span className="text-[#f59e0b] font-semibold">processor</span>.
            Every operation requires shuttling data back and forth across a
            shared bus.
          </p>
        </ScrollReveal>

        <DataBus />

        <ScrollReveal delay={0.2}>
          <p className="text-center text-[#94a3b8] max-w-2xl mx-auto mb-4">
            This is the{" "}
            <span className="text-[#ef4444] font-bold">
              von Neumann bottleneck
            </span>
            . The bus between memory and compute becomes a chokepoint — glowing
            red with wasted energy.
          </p>
        </ScrollReveal>

        <EnergyCounter />

        <ScrollReveal delay={0.3}>
          <div className="flex justify-center">
            <GlowCard color="#ef4444" className="max-w-lg text-center">
              <p className="text-xl md:text-2xl font-bold text-[#ef4444] mb-2">
                &gt;90% of energy
              </p>
              <p className="text-[#94a3b8]">
                in neural network inference is spent{" "}
                <span className="text-white font-semibold">moving data</span>,
                not computing.
              </p>
            </GlowCard>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <motion.p
            className="text-center text-2xl md:text-3xl font-bold mt-16 text-[#00f0ff]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            What if we could compute{" "}
            <span className="text-glow-cyan">where the data already lives?</span>
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
