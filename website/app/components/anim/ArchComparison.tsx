"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function ArchComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto my-12">
      {/* Traditional */}
      <div className="bg-[#0d1526] rounded-xl p-5 border border-[#ef4444]/20">
        <h4 className="mono text-sm text-[#ef4444] font-bold text-center mb-4">
          Traditional: Fetch → Compute → Store
        </h4>
        <svg viewBox="0 0 240 120" className="w-full h-auto">
          {/* Memory */}
          <rect x="10" y="10" width="60" height="40" rx="4" fill="#ef444410" stroke="#ef4444" strokeWidth="1" />
          <text x="40" y="34" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">Memory</text>

          {/* ALU */}
          <rect x="170" y="10" width="60" height="40" rx="4" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="1" />
          <text x="200" y="34" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">ALU</text>

          {/* Bus */}
          <line x1="70" y1="30" x2="170" y2="30" stroke="#334155" strokeWidth="2" />

          {/* Data packets moving back and forth */}
          {isInView && (
            <>
              <motion.rect
                width="10" height="6" rx="1" fill="#ef4444"
                animate={{
                  x: step === 0 ? 75 : step === 1 ? 155 : step === 2 ? 155 : 75,
                  y: 27,
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 0.4 }}
                filter="url(#gArc)"
              />
              <motion.rect
                width="10" height="6" rx="1" fill="#ef4444"
                animate={{
                  x: step === 2 ? 75 : step === 3 ? 155 : 115,
                  y: 27,
                  opacity: step > 1 ? [0.8, 1, 0.8] : 0,
                }}
                transition={{ duration: 0.4 }}
                filter="url(#gArc)"
              />
            </>
          )}

          {/* Step labels */}
          <text x="120" y="65" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
            {step === 0 && "① Fetch weight from memory"}
            {step === 1 && "② Fetch input from memory"}
            {step === 2 && "③ Compute: weight × input"}
            {step === 3 && "④ Store result back to memory"}
          </text>
          <text x="120" y="80" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            4 bus transfers per MAC
          </text>

          {/* Counter */}
          <text x="120" y="105" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">
            64 MACs → 256 bus transfers → 64+ cycles
          </text>

          <defs>
            <filter id="gArc">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* CIM */}
      <div className="bg-[#0d1526] rounded-xl p-5 border border-[#10b981]/20">
        <h4 className="mono text-sm text-[#10b981] font-bold text-center mb-4">
          CIM: Compute Where Data Lives
        </h4>
        <svg viewBox="0 0 240 120" className="w-full h-auto">
          {/* Unified Memory+Compute block */}
          <rect x="50" y="10" width="140" height="50" rx="6" fill="#10b98108" stroke="#10b981" strokeWidth="1.5" />
          <text x="120" y="28" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            Memory = Compute
          </text>
          <text x="120" y="42" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
            Weights stored + computed in place
          </text>

          {/* Input arrow */}
          <line x1="20" y1="35" x2="50" y2="35" stroke="#a855f7" strokeWidth="1.5" />
          <polygon points="47,31 53,35 47,39" fill="#a855f7" />
          <text x="15" y="28" fill="#a855f7" fontSize="6" fontFamily="monospace" textAnchor="end">PWM</text>
          <text x="15" y="38" fill="#a855f7" fontSize="6" fontFamily="monospace" textAnchor="end">input</text>

          {/* Output arrow */}
          <line x1="190" y1="35" x2="220" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
          <polygon points="217,31 223,35 217,39" fill="#f59e0b" />
          <text x="235" y="28" fill="#f59e0b" fontSize="6" fontFamily="monospace">ADC</text>
          <text x="235" y="38" fill="#f59e0b" fontSize="6" fontFamily="monospace">result</text>

          {/* Animated glow inside */}
          {isInView && (
            <motion.rect
              x="55" y="15" width="130" height="40" rx="4"
              fill="none" stroke="#10b981"
              animate={{ strokeOpacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              strokeWidth="2"
            />
          )}

          {/* Step description */}
          <text x="120" y="80" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            0 bus transfers per MAC
          </text>

          {/* Counter */}
          <text x="120" y="100" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">
            64 MACs → 0 bus transfers → 1 cycle
          </text>
        </svg>
      </div>
    </div>
  );
}
