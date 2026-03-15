"use client";

import { motion } from "framer-motion";
import ParticleField from "./anim/ParticleField";

const chapters = [
  { num: 1, title: "The Problem", color: "#ef4444" },
  { num: 2, title: "The Key Insight", color: "#10b981" },
  { num: 3, title: "The SRAM Bitcell", color: "#00f0ff" },
  { num: 4, title: "The PWM Driver", color: "#a855f7" },
  { num: 5, title: "The Array", color: "#10b981" },
  { num: 6, title: "The ADC", color: "#f59e0b" },
  { num: 7, title: "Neural Inference", color: "#00f0ff" },
  { num: 8, title: "The Full Chip", color: "#00f0ff" },
  { num: 9, title: "Why It Matters", color: "#10b981" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 circuit-grid overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0a0f1e] to-transparent" />

      {/* Particle field */}
      <ParticleField />

      {/* Animated circuit lines in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-20"
            style={{
              top: `${20 + i * 12}%`,
              left: "-10%",
              width: "120%",
            }}
            animate={{
              x: ["-20%", "20%", "-20%"],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Chip icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 inline-block"
        >
          <div className="w-20 h-20 rounded-xl border-2 border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center justify-center mx-auto relative">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="5" width="14" height="14" rx="2" stroke="#00f0ff" strokeWidth="1.5" />
              <rect x="8" y="8" width="8" height="8" rx="1" fill="#00f0ff" opacity="0.2" stroke="#00f0ff" strokeWidth="0.5" />
              {/* Pins */}
              {[7, 12, 17].map((x) => (
                <g key={`t${x}`}>
                  <line x1={x} y1="2" x2={x} y2="5" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                  <line x1={x} y1="19" x2={x} y2="22" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                </g>
              ))}
              {[7, 12, 17].map((y) => (
                <g key={`l${y}`}>
                  <line x1="2" y1={y} x2="5" y2={y} stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                  <line x1="19" y1={y} x2="22" y2={y} stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                </g>
              ))}
            </svg>
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{
                boxShadow: [
                  "0 0 20px #00f0ff15",
                  "0 0 40px #00f0ff25",
                  "0 0 20px #00f0ff15",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-[#00f0ff] text-glow-cyan">Compute</span>
          <br />
          <span className="text-white">in Memory</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          How a chip performs neural network inference using analog physics —
          no data movement, no digital multiply-accumulate, just Ohm&apos;s Law.
        </motion.p>

        <motion.p
          className="mono text-sm text-[#475569] mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Built from a real SKY130 130nm CMOS design — actual transistor sizes and SPICE measurements
        </motion.p>

        {/* Chapter navigation dots */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {chapters.map((ch) => (
            <a
              key={ch.num}
              href={`#chapter-${ch.num}`}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 transition-all"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ch.color }}
              />
              <span className="text-xs text-[#475569] group-hover:text-[#94a3b8] transition-colors">
                {ch.title}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-[#475569] mb-2">Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
