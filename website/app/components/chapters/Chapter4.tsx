"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import { PWM } from "../chipData";

function PWMWaveforms() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [selectedCode, setSelectedCode] = useState(7);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    setAnimating(true);
    return () => setAnimating(false);
  }, [isInView]);

  const codes = Array.from({ length: 16 }, (_, i) => i);
  const maxWidth = 300;
  const pulseWidth = (code: number) => (code / 15) * maxWidth;

  return (
    <div ref={ref} className="max-w-3xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        {/* Binary input display */}
        <div className="text-center mb-6">
          <span className="mono text-sm text-[#94a3b8]">4-bit input code: </span>
          <span className="mono text-2xl text-[#a855f7] font-bold">
            {selectedCode.toString(2).padStart(4, "0")}
          </span>
          <span className="mono text-sm text-[#94a3b8]"> = </span>
          <span className="mono text-2xl text-[#f59e0b] font-bold">{selectedCode}</span>
          <span className="mono text-sm text-[#94a3b8]"> → pulse = </span>
          <span className="mono text-lg text-[#00f0ff] font-bold">
            {(selectedCode * PWM.t_lsb_ns).toFixed(1)} ns
          </span>
        </div>

        {/* All 16 waveforms */}
        <svg viewBox="0 0 460 340" className="w-full h-auto">
          {codes.map((code) => {
            const y = 10 + code * 20;
            const pw = pulseWidth(code);
            const isSelected = code === selectedCode;

            return (
              <g
                key={code}
                className="cursor-pointer"
                onClick={() => setSelectedCode(code)}
                opacity={isSelected ? 1 : 0.3}
              >
                {/* Code label */}
                <text
                  x="35"
                  y={y + 14}
                  fill={isSelected ? "#f59e0b" : "#475569"}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {code}
                </text>

                {/* Baseline */}
                <line
                  x1="45"
                  y1={y + 16}
                  x2={45 + maxWidth + 40}
                  y2={y + 16}
                  stroke="#1e293b"
                  strokeWidth="1"
                />

                {/* Pulse */}
                {code > 0 && (
                  <motion.g>
                    {/* Rising edge */}
                    <line x1={60} y1={y + 16} x2={60} y2={y + 2}
                      stroke={isSelected ? "#a855f7" : "#a855f750"}
                      strokeWidth={isSelected ? 2 : 1} />
                    {/* High level */}
                    <motion.line
                      x1={60}
                      y1={y + 2}
                      x2={60 + pw}
                      y2={y + 2}
                      stroke={isSelected ? "#a855f7" : "#a855f750"}
                      strokeWidth={isSelected ? 2 : 1}
                      initial={{ x2: 60 }}
                      animate={animating ? { x2: 60 + pw } : {}}
                      transition={{ duration: 0.5, delay: code * 0.05 }}
                    />
                    {/* Falling edge */}
                    <motion.line
                      x1={60 + pw}
                      y1={y + 2}
                      x2={60 + pw}
                      y2={y + 16}
                      stroke={isSelected ? "#a855f7" : "#a855f750"}
                      strokeWidth={isSelected ? 2 : 1}
                      initial={{ opacity: 0 }}
                      animate={animating ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + code * 0.05 }}
                    />
                    {/* Fill */}
                    <motion.rect
                      x={60}
                      y={y + 2}
                      height={14}
                      rx={1}
                      fill={isSelected ? "#a855f720" : "#a855f708"}
                      initial={{ width: 0 }}
                      animate={animating ? { width: pw } : {}}
                      transition={{ duration: 0.5, delay: code * 0.05 }}
                    />
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Time axis */}
          <line x1="60" y1="335" x2={60 + maxWidth} y2="335" stroke="#475569" strokeWidth="1" />
          <text x={60 + maxWidth / 2} y="330" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Time →
          </text>
          <text x="60" y="330" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">0</text>
          <text x={60 + maxWidth} y="330" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{PWM.max_pulse_ns.toFixed(0)}ns</text>

          {/* Annotations */}
          <text x={60 + maxWidth + 20} y="20" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            no pulse
          </text>
          <text x={60 + maxWidth + 20} y="325" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            max pulse
          </text>
        </svg>

        {/* Code slider */}
        <div className="flex items-center gap-4 mt-4">
          <span className="mono text-sm text-[#a855f7]">Code:</span>
          <input
            type="range"
            min={0}
            max={15}
            value={selectedCode}
            onChange={(e) => setSelectedCode(Number(e.target.value))}
            className="flex-1 accent-[#a855f7] h-2"
          />
          <span className="mono text-sm text-[#f59e0b] w-8">{selectedCode}</span>
        </div>

        <p className="text-center text-sm text-[#94a3b8] mt-4">
          Bigger number → longer pulse → more time for current to flow → larger dot product contribution.
        </p>
      </div>
    </div>
  );
}

export default function Chapter4() {
  return (
    <section id="chapter-4" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={4}
          title="The PWM Driver"
          subtitle="Encoding inputs as time"
          color="#a855f7"
        />

        {/* The question first */}
        <ScrollReveal>
          <p className="text-center text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto mb-4">
            Chapter 2 showed analog multiplication. Chapter 3 showed
            binary weight storage. So how do we feed in a{" "}
            <span className="text-[#a855f7] font-bold">multi-bit input value</span>?
          </p>
        </ScrollReveal>

        {/* The reveal */}
        <ScrollReveal delay={0.2}>
          <motion.p
            className="text-center text-3xl md:text-4xl font-bold text-[#a855f7] my-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We encode the input as <span className="text-glow-purple">TIME</span>.
          </motion.p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-center text-lg text-[#94a3b8] max-w-3xl mx-auto mb-8">
            A 4-bit number becomes a pulse whose width is proportional to its value.
            The number 5 becomes a pulse that&apos;s ON for 5 units of time.
            15 → long pulse. 1 → short pulse. 0 → no pulse at all.
          </p>
        </ScrollReveal>

        <PWMWaveforms />

        {/* Connect it back */}
        <ScrollReveal delay={0.1}>
          <GlowCard color="#a855f7" className="max-w-2xl mx-auto">
            <p className="text-center text-[#94a3b8]">
              The <span className="text-[#a855f7] font-bold">pulse width</span> IS the input value.
              The cell&apos;s <span className="text-[#00f0ff] font-bold">stored bit</span> IS the weight.
              Current × time = the product.{" "}
              <span className="text-white font-semibold">Physics does the rest.</span>
            </p>
          </GlowCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            <GlowCard color="#a855f7" delay={0}>
              <div className="text-center">
                <div className="mono text-xl text-[#a855f7] font-bold">
                  {PWM.t_lsb_ns.toFixed(1)} ns
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">T_LSB</div>
              </div>
            </GlowCard>
            <GlowCard color="#10b981" delay={0.1}>
              <div className="text-center">
                <div className="mono text-xl text-[#10b981] font-bold">
                  {PWM.linearity_pct}%
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Linearity Error</div>
              </div>
            </GlowCard>
            <GlowCard color="#00f0ff" delay={0.2}>
              <div className="text-center">
                <div className="mono text-xl text-[#00f0ff] font-bold">
                  {PWM.rise_time_ns} ns
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Rise Time</div>
              </div>
            </GlowCard>
            <GlowCard color="#f59e0b" delay={0.3}>
              <div className="text-center">
                <div className="mono text-xl text-[#f59e0b] font-bold">
                  {PWM.transistor_count}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">Transistors</div>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
