"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import DotProductGrid from "../anim/DotProductGrid";

function OhmsLawDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [resistance, setResistance] = useState(50);
  const voltage = 1.8;
  const current = voltage / resistance;

  return (
    <div ref={ref} className="max-w-2xl mx-auto my-12">
      <div className="text-center mb-6">
        <span className="mono text-2xl text-[#00f0ff]">V = I × R</span>
      </div>

      {/* Circuit visualization */}
      <div className="relative bg-[#0d1526] rounded-xl p-8 neon-border">
        <svg viewBox="0 0 400 160" className="w-full h-auto">
          {/* Wire top */}
          <line x1="50" y1="40" x2="180" y2="40" stroke="#00f0ff" strokeWidth="2" />
          <line x1="220" y1="40" x2="350" y2="40" stroke="#00f0ff" strokeWidth="2" />
          {/* Wire bottom */}
          <line x1="50" y1="120" x2="350" y2="120" stroke="#00f0ff" strokeWidth="2" />
          {/* Wire sides */}
          <line x1="50" y1="40" x2="50" y2="120" stroke="#00f0ff" strokeWidth="2" />
          <line x1="350" y1="40" x2="350" y2="120" stroke="#00f0ff" strokeWidth="2" />

          {/* Resistor symbol */}
          <path
            d="M180 40 L185 25 L195 55 L205 25 L215 55 L220 40"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />

          {/* Current flow particles */}
          {isInView &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.circle
                key={i}
                r="3"
                fill="#00f0ff"
                filter="url(#glow)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 2 / current,
                  repeat: Infinity,
                  delay: i * (2 / current / 6),
                  ease: "linear",
                }}
                style={{
                  offsetPath: `path('M 50 120 L 50 40 L 180 40 L 220 40 L 350 40 L 350 120 L 50 120')`,
                }}
              />
            ))}

          {/* Voltage source */}
          <text x="30" y="85" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle">
            {voltage}V
          </text>
          <circle cx="50" cy="70" r="8" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          <line x1="50" y1="64" x2="50" y2="76" stroke="#00f0ff" strokeWidth="1.5" />
          <line x1="46" y1="67" x2="54" y2="67" stroke="#00f0ff" strokeWidth="1.5" />

          {/* Labels */}
          <text x="200" y="15" fill="#f59e0b" fontSize="12" fontFamily="monospace" textAnchor="middle">
            R = {resistance}Ω
          </text>
          <text x="200" y="145" fill="#10b981" fontSize="12" fontFamily="monospace" textAnchor="middle">
            I = {(current * 1000).toFixed(1)} mA
          </text>

          {/* SVG filter for glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Resistance slider */}
        <div className="mt-6 flex items-center gap-4">
          <span className="mono text-sm text-[#f59e0b]">R:</span>
          <input
            type="range"
            min={10}
            max={200}
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="flex-1 accent-[#f59e0b] h-2"
          />
          <span className="mono text-sm text-[#f59e0b] w-16">{resistance}Ω</span>
        </div>
        <p className="text-center text-sm text-[#94a3b8] mt-3">
          Change the resistance (the <span className="text-[#f59e0b]">weight</span>) →
          the current (the <span className="text-[#10b981]">result</span>) changes.{" "}
          <span className="text-white font-semibold">Multiplication — for free.</span>
        </p>
      </div>
    </div>
  );
}

function KirchhoffDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [activeSources, setActiveSources] = useState([true, true, false, true]);

  const toggleSource = useCallback((idx: number) => {
    setActiveSources((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const currents = [28.36, 28.36, 28.36, 28.36]; // µA per cell
  const totalCurrent = activeSources.reduce(
    (sum, active, i) => sum + (active ? currents[i] : 0),
    0
  );

  return (
    <div ref={ref} className="max-w-2xl mx-auto my-12">
      <div className="text-center mb-6">
        <span className="mono text-2xl text-[#10b981]">ΣI = I₁ + I₂ + I₃ + I₄</span>
      </div>

      <div className="relative bg-[#0d1526] rounded-xl p-8 neon-border">
        <svg viewBox="0 0 400 200" className="w-full h-auto">
          {/* Shared wire (bitline) at bottom */}
          <line x1="40" y1="170" x2="360" y2="170" stroke="#10b981" strokeWidth="3" />
          <text x="380" y="174" fill="#10b981" fontSize="10" fontFamily="monospace">BL</text>

          {/* Current sources */}
          {[0, 1, 2, 3].map((i) => {
            const x = 80 + i * 80;
            const active = activeSources[i];
            return (
              <g key={i}>
                {/* Cell box */}
                <rect
                  x={x - 20}
                  y={30}
                  width={40}
                  height={40}
                  rx={4}
                  fill={active ? "#00f0ff10" : "#1e293b"}
                  stroke={active ? "#00f0ff" : "#334155"}
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  onClick={() => toggleSource(i)}
                />
                <text
                  x={x}
                  y={54}
                  fill={active ? "#00f0ff" : "#475569"}
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  W={active ? "1" : "0"}
                </text>

                {/* Wire down to shared line */}
                <line
                  x1={x}
                  y1={70}
                  x2={x}
                  y2={170}
                  stroke={active ? "#00f0ff" : "#1e293b"}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={active ? "none" : "4 4"}
                />

                {/* Current label */}
                {active && (
                  <text
                    x={x + 22}
                    y={120}
                    fill="#f59e0b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {currents[i]}µA
                  </text>
                )}

                {/* Animated current flow */}
                {active && isInView && (
                  <motion.circle
                    cx={x}
                    r="3"
                    fill="#00f0ff"
                    filter="url(#glow2)"
                    animate={{ cy: [75, 165] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: "linear",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Total current label */}
          <text x="200" y="195" fill="#10b981" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            I_total = {totalCurrent.toFixed(2)} µA
          </text>

          <defs>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <p className="text-center text-sm text-[#94a3b8] mt-4">
          Click cells to toggle weights. Currents on the shared wire{" "}
          <span className="text-[#10b981] font-semibold">sum automatically</span>
          . The wire does addition — physically.
        </p>
      </div>
    </div>
  );
}

export default function Chapter2() {
  return (
    <section id="chapter-2" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={2}
          title="The Key Insight"
          subtitle="Physics computes for free"
          color="#10b981"
        />

        <ScrollReveal>
          <GlowCard color="#00f0ff" className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-center">
              <span className="text-[#f59e0b] font-bold">Ohm&apos;s Law</span> is a
              free multiplier.{" "}
              <span className="text-[#10b981] font-bold">
                Kirchhoff&apos;s Current Law
              </span>{" "}
              is a free adder. Combine them in a grid → free matrix
              multiplication.
            </p>
          </GlowCard>
        </ScrollReveal>

        <ScrollReveal>
          <h3 className="text-2xl font-bold text-center text-[#f59e0b] mb-2">
            Ohm&apos;s Law: V = I × R
          </h3>
          <p className="text-center text-[#94a3b8] mb-4">
            A resistor multiplies. Change the resistance → change the result.
          </p>
        </ScrollReveal>

        <OhmsLawDemo />

        <ScrollReveal>
          <h3 className="text-2xl font-bold text-center text-[#10b981] mb-2 mt-16">
            Kirchhoff&apos;s Current Law: ΣI = 0
          </h3>
          <p className="text-center text-[#94a3b8] mb-4">
            Currents on a shared wire sum automatically. The wire is an adder.
          </p>
        </ScrollReveal>

        <KirchhoffDemo />

        <ScrollReveal delay={0.1}>
          <h3 className="text-2xl font-bold text-center text-[#00f0ff] mb-2 mt-16">
            Put It Together: Matrix-Vector Multiply
          </h3>
          <p className="text-center text-[#94a3b8] mb-4">
            A grid of binary weights × input activations = dot products. All in one shot.
          </p>
        </ScrollReveal>

        <DotProductGrid />

        <ScrollReveal delay={0.2}>
          <motion.p
            className="text-center text-2xl md:text-3xl font-bold mt-16 text-[#10b981]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Arrange resistors in a grid →{" "}
            <span className="text-glow-cyan text-[#00f0ff]">
              matrix multiplication in physics
            </span>
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
