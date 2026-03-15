"use client";

import { motion } from "framer-motion";

interface ChapterHeaderProps {
  number: number;
  title: string;
  subtitle: string;
  color?: string;
}

export default function ChapterHeader({
  number,
  title,
  subtitle,
  color = "#00f0ff",
}: ChapterHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="mb-16 text-center"
    >
      <div
        className="mono text-sm tracking-[0.3em] uppercase mb-3 opacity-60"
        style={{ color }}
      >
        Chapter {number}
      </div>
      <h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        style={{ color }}
      >
        {title}
      </h2>
      <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto">
        {subtitle}
      </p>
      <motion.div
        className="mt-6 mx-auto h-px w-24"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </motion.div>
  );
}
