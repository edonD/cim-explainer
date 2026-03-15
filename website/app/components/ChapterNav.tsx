"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const chapters = [
  { id: "chapter-1", num: 1, title: "The Problem", color: "#ef4444" },
  { id: "chapter-2", num: 2, title: "Key Insight", color: "#10b981" },
  { id: "chapter-3", num: 3, title: "Bitcell", color: "#00f0ff" },
  { id: "chapter-4", num: 4, title: "PWM Driver", color: "#a855f7" },
  { id: "chapter-5", num: 5, title: "The Array", color: "#10b981" },
  { id: "chapter-6", num: 6, title: "The ADC", color: "#f59e0b" },
  { id: "chapter-7", num: 7, title: "Inference", color: "#00f0ff" },
  { id: "chapter-8", num: 8, title: "Full Chip", color: "#00f0ff" },
  { id: "chapter-9", num: 9, title: "Why It Matters", color: "#10b981" },
];

export default function ChapterNav() {
  const [activeChapter, setActiveChapter] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setShowNav(window.scrollY > window.innerHeight * 0.5);

      // Determine active chapter
      const sections = chapters
        .map((ch) => {
          const el = document.getElementById(ch.id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id: ch.id, top: rect.top, bottom: rect.bottom };
        })
        .filter(Boolean);

      const viewMid = window.innerHeight / 3;
      for (const section of sections) {
        if (section && section.top < viewMid && section.bottom > 0) {
          setActiveChapter(section.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-2"
        >
          {chapters.map((ch, i) => {
            const isActive = activeChapter === ch.id;
            const isHovered = hoveredIdx === i;

            return (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="flex items-center gap-2 group"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {/* Label (shown on hover or active) */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="mono text-[10px] whitespace-nowrap px-2 py-0.5 rounded"
                      style={{
                        color: ch.color,
                        backgroundColor: `${ch.color}10`,
                      }}
                    >
                      {ch.num}. {ch.title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Dot */}
                <motion.div
                  className="rounded-full transition-all"
                  animate={{
                    width: isActive ? 12 : 6,
                    height: isActive ? 12 : 6,
                    backgroundColor: isActive ? ch.color : `${ch.color}40`,
                    boxShadow: isActive ? `0 0 8px ${ch.color}66` : "none",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </a>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
