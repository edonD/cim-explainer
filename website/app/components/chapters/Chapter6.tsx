"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { ADC } from "../chipData";

function SARAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [step, setStep] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);

  const inputVoltage = 1.15; // Example: ~midrange
  const vref = 1.8;
  const bits = 6;

  // Compute SAR steps
  const sarSteps: { bit: number; dacVoltage: number; result: number; code: string }[] = [];
  let dacV = 0;
  let code = "";
  for (let b = bits - 1; b >= 0; b--) {
    const testV = dacV + vref / Math.pow(2, bits - b);
    const bitVal = inputVoltage >= testV ? 1 : 0;
    if (bitVal) dacV = testV;
    code += bitVal;
    sarSteps.push({
      bit: bits - 1 - b,
      dacVoltage: testV,
      result: bitVal,
      code: code.padEnd(bits, "?"),
    });
  }

  useEffect(() => {
    if (!autoPlay || !isInView) return;
    setStep(-1);
    let s = -1;
    const interval = setInterval(() => {
      s++;
      if (s >= bits) {
        setAutoPlay(false);
        return;
      }
      setStep(s);
    }, 800);
    return () => clearInterval(interval);
  }, [autoPlay, isInView]);

  const currentStep = step >= 0 && step < bits ? sarSteps[step] : null;
  const currentCode = step >= 0 ? sarSteps[Math.min(step, bits - 1)].code : "??????";

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        {/* SAR visualization */}
        <div className="relative">
          <svg viewBox="0 0 500 280" className="w-full h-auto">
            {/* Voltage scale */}
            <line x1="60" y1="30" x2="60" y2="230" stroke="#334155" strokeWidth="1" />
            {[0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((v) => {
              const y = 230 - (v / 1.8) * 200;
              return (
                <g key={v}>
                  <line x1="55" y1={y} x2="60" y2={y} stroke="#475569" strokeWidth="1" />
                  <text x="48" y={y + 4} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                    {v.toFixed(1)}V
                  </text>
                </g>
              );
            })}

            {/* Input voltage line */}
            <line
              x1="65"
              y1={230 - (inputVoltage / 1.8) * 200}
              x2="440"
              y2={230 - (inputVoltage / 1.8) * 200}
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <text
              x="445"
              y={230 - (inputVoltage / 1.8) * 200 + 4}
              fill="#00f0ff"
              fontSize="10"
              fontFamily="monospace"
            >
              V_in = {inputVoltage.toFixed(2)}V
            </text>

            {/* SAR steps */}
            {sarSteps.map((s, i) => {
              const x = 80 + i * 60;
              const dacY = 230 - (s.dacVoltage / 1.8) * 200;
              const visible = i <= step;

              return (
                <g key={i}>
                  {/* Step column */}
                  <text
                    x={x + 20}
                    y={250}
                    fill={i === step ? "#f59e0b" : "#475569"}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Bit {bits - 1 - i}
                  </text>

                  {visible && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* DAC comparison level */}
                      <line
                        x1={x}
                        y1={dacY}
                        x2={x + 40}
                        y2={dacY}
                        stroke={s.result ? "#10b981" : "#ef4444"}
                        strokeWidth="2"
                      />

                      {/* Comparison arrow */}
                      <text
                        x={x + 20}
                        y={dacY - 8}
                        fill={s.result ? "#10b981" : "#ef4444"}
                        fontSize="14"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {s.result ? "1" : "0"}
                      </text>

                      {/* Comparison marker */}
                      <circle
                        cx={x + 20}
                        cy={dacY}
                        r="3"
                        fill={s.result ? "#10b981" : "#ef4444"}
                      />
                    </motion.g>
                  )}
                </g>
              );
            })}

            {/* Title */}
            <text x="250" y="18" fill="#f59e0b" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Successive Approximation: Binary Search on Voltage
            </text>
          </svg>
        </div>

        {/* Digital output display */}
        <div className="flex justify-center gap-1 my-4">
          {currentCode.split("").map((bit, i) => (
            <motion.div
              key={i}
              className={`w-10 h-12 rounded-lg flex items-center justify-center mono text-xl font-bold border ${
                bit === "?"
                  ? "border-[#334155] text-[#334155]"
                  : bit === "1"
                    ? "border-[#10b981] text-[#10b981] bg-[#10b981]/10"
                    : "border-[#ef4444]/50 text-[#ef4444]/50 bg-[#ef4444]/5"
              }`}
              animate={i === step ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {bit}
            </motion.div>
          ))}
        </div>
        <div className="text-center mono text-xs text-[#94a3b8] mb-4">
          MSB ← 6-bit output code → LSB
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setStep((s) => Math.max(-1, s - 1))}
            className="px-4 py-2 rounded-lg mono text-xs border border-white/10 text-[#94a3b8] hover:border-white/20"
          >
            ← Prev
          </button>
          <button
            onClick={() => { setStep(-1); setAutoPlay(true); }}
            className="px-4 py-2 rounded-lg mono text-xs border border-[#f59e0b]/40 text-[#f59e0b] bg-[#f59e0b]/10"
          >
            ▶ Run SAR
          </button>
          <button
            onClick={() => setStep((s) => Math.min(bits - 1, s + 1))}
            className="px-4 py-2 rounded-lg mono text-xs border border-white/10 text-[#94a3b8] hover:border-white/20"
          >
            Next →
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-[#94a3b8] mt-4"
          >
            {step === -1 && "Press Run SAR to see the successive approximation in action."}
            {currentStep && (
              <>
                Compare V_in ({inputVoltage.toFixed(2)}V) to DAC ({currentStep.dacVoltage.toFixed(3)}V):
                V_in {currentStep.result ? "≥" : "<"} DAC →{" "}
                <span className={currentStep.result ? "text-[#10b981]" : "text-[#ef4444]"}>
                  Bit {bits - 1 - currentStep.bit} = {currentStep.result}
                </span>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Chapter6() {
  return (
    <section id="chapter-6" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={6}
          title="The ADC"
          subtitle="Reading the analog answer"
          color="#f59e0b"
        />

        <ScrollReveal>
          <p className="text-center text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto mb-4">
            The array produced 64 analog voltages. But the rest of the system speaks{" "}
            <span className="text-[#f59e0b] font-bold">digital</span>. How do we convert?
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-8">
            Binary search. A{" "}
            <span className="text-[#f59e0b] font-bold">SAR ADC</span>{" "}
            asks &quot;is the voltage above half?&quot; then narrows down —
            6 comparisons yield 6 bits of precision.
          </p>
        </ScrollReveal>

        <SARAnimation />

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            <GlowCard color="#f59e0b" delay={0}>
              <div className="text-center">
                <div className="mono text-xl text-[#f59e0b] font-bold">{ADC.bits}-bit</div>
                <div className="text-xs text-[#94a3b8] mt-1">Resolution</div>
              </div>
            </GlowCard>
            <GlowCard color="#00f0ff" delay={0.1}>
              <div className="text-center">
                <div className="mono text-xl text-[#00f0ff] font-bold">{ADC.conversion_time_ns} ns</div>
                <div className="text-xs text-[#94a3b8] mt-1">Conversion Time</div>
              </div>
            </GlowCard>
            <GlowCard color="#10b981" delay={0.2}>
              <div className="text-center">
                <div className="mono text-xl text-[#10b981] font-bold">{ADC.power_uw.toFixed(1)} µW</div>
                <div className="text-xs text-[#94a3b8] mt-1">Power</div>
              </div>
            </GlowCard>
            <GlowCard color="#a855f7" delay={0.3}>
              <div className="text-center">
                <div className="mono text-xl text-[#a855f7] font-bold">{ADC.enob.toFixed(1)}</div>
                <div className="text-xs text-[#94a3b8] mt-1">ENOB (bits)</div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-center text-lg text-[#94a3b8] max-w-2xl mx-auto mt-8">
            <span className="text-[#f59e0b] font-bold">64 ADCs</span> read 64
            bitlines in parallel → 64 digital output values, each with{" "}
            <span className="mono text-[#00f0ff]">{ADC.lsb_mv} mV</span> precision.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
