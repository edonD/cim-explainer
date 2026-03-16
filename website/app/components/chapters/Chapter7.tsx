"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { BITCELL, ADC, CHIP } from "../chipData";
import ArchComparison from "../anim/ArchComparison";

// Simple MNIST-style digit (7x7 pixel grid)
const DIGIT_7 = [
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0],
];

type InferencePhase = "input" | "pwm" | "compute" | "adc" | "relu" | "output";

function InferencePipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [phase, setPhase] = useState<InferencePhase>("input");
  const [autoPlay, setAutoPlay] = useState(false);

  const phases: InferencePhase[] = ["input", "pwm", "compute", "adc", "relu", "output"];
  const phaseIdx = phases.indexOf(phase);

  // Simulated output scores
  const scores = useMemo(() => [0.01, 0.02, 0.01, 0.05, 0.01, 0.02, 0.03, 0.82, 0.02, 0.01], []);

  // Auto-start when scrolled into view
  const hasAutoStarted = useRef(false);
  useEffect(() => {
    if (isInView && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      setAutoPlay(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (!autoPlay || !isInView) return;
    let idx = 0;
    setPhase(phases[0]);
    const interval = setInterval(() => {
      idx++;
      if (idx >= phases.length) {
        setAutoPlay(false);
        return;
      }
      setPhase(phases[idx]);
    }, 1500);
    return () => clearInterval(interval);
  }, [autoPlay, isInView]);

  const phaseLabels: Record<InferencePhase, { label: string; color: string; desc: string }> = {
    input: { label: "① Pixel Input", color: "#00f0ff", desc: "Handwritten digit pixels become input activations" },
    pwm: { label: "② PWM Encode", color: "#a855f7", desc: "Pixel values → proportional pulse widths on wordlines" },
    compute: { label: "③ Array Compute", color: "#10b981", desc: "4,096 multiply-accumulates in a single cycle — currents sum on bitlines" },
    adc: { label: "④ ADC Digitize", color: "#f59e0b", desc: "64 SAR ADCs convert analog bitline voltages to 6-bit digital" },
    relu: { label: "⑤ ReLU Activation", color: "#ef4444", desc: "max(0, x) — negative values clamped to zero" },
    output: { label: "⑥ Classification", color: "#00f0ff", desc: "Output layer scores → highest confidence wins" },
  };

  const current = phaseLabels[phase];

  return (
    <div ref={ref} className="max-w-5xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        {/* Phase navigation */}
        <div className="flex flex-wrap justify-center gap-1 mb-8">
          {phases.map((p, i) => (
            <button
              key={p}
              onClick={() => { setPhase(p); setAutoPlay(false); }}
              className={`px-3 py-1.5 rounded-lg mono text-[10px] border transition-all ${
                phase === p
                  ? "bg-white/10 border-white/30"
                  : i <= phaseIdx
                    ? "border-white/10 opacity-80"
                    : "border-white/5 opacity-30"
              }`}
              style={{ color: phaseLabels[p].color }}
            >
              {phaseLabels[p].label}
            </button>
          ))}
          <button
            onClick={() => { setAutoPlay(true); }}
            className="px-3 py-1.5 rounded-lg mono text-[10px] border border-[#f59e0b]/40 text-[#f59e0b]"
          >
            ▶ Auto
          </button>
        </div>

        {/* Main visualization area */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center min-h-[300px]">
          {/* Input digit */}
          <div className={`text-center transition-opacity duration-300 ${phaseIdx >= 0 ? "opacity-100" : "opacity-20"}`}>
            <div className="text-xs mono text-[#00f0ff] mb-2">Input Digit</div>
            <div className="inline-grid grid-cols-7 gap-0.5">
              {DIGIT_7.flat().map((pixel, i) => (
                <motion.div
                  key={i}
                  className="w-5 h-5 rounded-sm"
                  animate={{
                    backgroundColor: pixel
                      ? phase === "pwm" ? "#a855f7" : "#00f0ff"
                      : "#1e293b",
                    boxShadow: pixel && phase === "pwm"
                      ? "0 0 6px #a855f7"
                      : pixel ? "0 0 4px #00f0ff44" : "none",
                  }}
                  transition={{ delay: phase === "input" ? i * 0.01 : 0 }}
                />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl"
              style={{ color: current.color }}
            >
              →
            </motion.div>
          </div>

          {/* CIM Array */}
          <div className={`text-center transition-opacity duration-300 ${phaseIdx >= 2 ? "opacity-100" : "opacity-20"}`}>
            <div className="text-xs mono text-[#10b981] mb-2">64×64 CIM Array</div>
            <div className="inline-grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-[2px]"
                  animate={{
                    backgroundColor: phase === "compute"
                      ? Math.random() > 0.5 ? "#10b98140" : "#0d1526"
                      : "#1e293b10",
                    borderColor: phase === "compute" ? "#10b981" : "#1e293b",
                  }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  style={{ border: "1px solid #1e293b" }}
                />
              ))}
            </div>
            {phase === "compute" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mono text-[10px] text-[#f59e0b] mt-2"
              >
                4,096 MACs in 1 cycle
              </motion.div>
            )}
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl"
              style={{ color: current.color }}
            >
              →
            </motion.div>
          </div>

          {/* Output */}
          <div className={`text-center transition-opacity duration-300 ${phaseIdx >= 5 ? "opacity-100" : "opacity-20"}`}>
            <div className="text-xs mono text-[#00f0ff] mb-2">Output Scores</div>
            <div className="space-y-1">
              {scores.map((score, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="mono text-[10px] text-[#94a3b8] w-3">{i}</span>
                  <div className="flex-1 h-3 bg-[#1e293b] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: i === 7
                          ? "linear-gradient(90deg, #10b981, #00f0ff)"
                          : "#475569",
                      }}
                      initial={{ width: 0 }}
                      animate={phase === "output" ? { width: `${score * 100}%` } : { width: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />
                  </div>
                  <span className="mono text-[9px] w-8" style={{ color: i === 7 ? "#10b981" : "#475569" }}>
                    {phase === "output" ? `${(score * 100).toFixed(0)}%` : ""}
                  </span>
                </div>
              ))}
            </div>
            {phase === "output" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 text-2xl font-bold text-[#10b981]"
              >
                It&apos;s a 7!
              </motion.div>
            )}
          </div>
        </div>

        {/* Phase description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mt-6 p-3 rounded-lg"
            style={{
              backgroundColor: `${current.color}08`,
              borderLeft: `3px solid ${current.color}`,
            }}
          >
            <p className="text-sm" style={{ color: current.color }}>
              {current.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Chapter7() {
  return (
    <section id="chapter-7" className="chapter-section circuit-grid relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={7}
          title="Neural Network Inference"
          subtitle="Everything connects. This is the finale."
          color="#00f0ff"
        />

        <ScrollReveal>
          <p className="text-center text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto mb-4">
            A handwritten &quot;7&quot; enters the chip. Watch what happens.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-8">
            Pixel values become PWM pulses (Chapter 4). Pulses hit the array where
            weights are stored (Chapter 3 + 5). Physics computes 64 dot products in
            one shot (Chapter 2 + 5). ADCs digitize (Chapter 6). The answer comes out —{" "}
            <span className="text-[#10b981] font-bold">
              the weights never moved
            </span>.
          </p>
        </ScrollReveal>

        <InferencePipeline />

        <ArchComparison />

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            <GlowCard color="#ef4444">
              <h4 className="mono text-sm text-[#ef4444] font-bold mb-3">
                Digital Processor (GPU)
              </h4>
              <div className="space-y-2 text-sm text-[#94a3b8]">
                <div className="flex justify-between">
                  <span>MACs per cycle</span>
                  <span className="mono text-[#ef4444]">1 (per ALU)</span>
                </div>
                <div className="flex justify-between">
                  <span>64-element dot product</span>
                  <span className="mono text-[#ef4444]">64+ cycles</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy per MAC</span>
                  <span className="mono text-[#ef4444]">~20 pJ</span>
                </div>
                <div className="flex justify-between">
                  <span>Data movement</span>
                  <span className="mono text-[#ef4444]">Every operation</span>
                </div>
              </div>
            </GlowCard>

            <GlowCard color="#10b981">
              <h4 className="mono text-sm text-[#10b981] font-bold mb-3">
                CIM Array (This Chip)
              </h4>
              <div className="space-y-2 text-sm text-[#94a3b8]">
                <div className="flex justify-between">
                  <span>MACs per cycle</span>
                  <span className="mono text-[#10b981]">{CHIP.array_rows * CHIP.array_cols}</span>
                </div>
                <div className="flex justify-between">
                  <span>64-element dot product</span>
                  <span className="mono text-[#10b981]">1 cycle</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy per MAC</span>
                  <span className="mono text-[#10b981]">{BITCELL.energy_per_mac_pj} pJ</span>
                </div>
                <div className="flex justify-between">
                  <span>Data movement</span>
                  <span className="mono text-[#10b981]">Zero</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <motion.p
            className="text-center text-2xl md:text-3xl font-bold mt-12 text-[#00f0ff]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The weights never moved. Computation happened{" "}
            <span className="text-glow-cyan">where the data was stored.</span>
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
