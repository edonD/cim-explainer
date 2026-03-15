"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  color?: string;
  className?: string;
  delay?: number;
}

export default function GlowCard({
  children,
  color = "#00f0ff",
  className = "",
  delay = 0,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className={`relative rounded-xl p-6 bg-[#0d1526] border border-white/5 ${className}`}
      style={{
        boxShadow: `0 0 30px ${color}15, inset 0 1px 0 ${color}10`,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-5"
        style={{
          background: `radial-gradient(ellipse at top, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
