"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FlowStep {
  label: string;
  sublabel: string;
  color: string;
  value: string;
}

const steps: FlowStep[] = [
  { label: "Input", sublabel: "4-bit digital", color: "#a855f7", value: "0101" },
  { label: "PWM", sublabel: "5ns × code", color: "#a855f7", value: "25ns" },
  { label: "Wordline", sublabel: "pulse on WL", color: "#a855f7", value: "█████" },
  { label: "Bitcell", sublabel: "W × I_read", color: "#00f0ff", value: "28.4µA" },
  { label: "Bitline", sublabel: "Σ currents", color: "#10b981", value: "V_BL" },
  { label: "ADC", sublabel: "6-bit SAR", color: "#f59e0b", value: "101100" },
  { label: "Output", sublabel: "digital result", color: "#00f0ff", value: "44" },
];

export default function DataFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="max-w-4xl mx-auto my-12 overflow-x-auto">
      <div className="min-w-[640px] flex items-center justify-center gap-0 px-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            {/* Step node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 relative"
                style={{
                  borderColor: `${step.color}60`,
                  backgroundColor: `${step.color}08`,
                  boxShadow: `0 0 15px ${step.color}20`,
                }}
              >
                <span className="mono text-[10px] font-bold" style={{ color: step.color }}>
                  {step.value}
                </span>
              </div>
              <span
                className="mono text-[10px] font-bold mt-1"
                style={{ color: step.color }}
              >
                {step.label}
              </span>
              <span className="text-[8px] text-[#475569]">{step.sublabel}</span>
            </motion.div>

            {/* Arrow */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.15 + 0.1 }}
                className="flex items-center mx-1"
              >
                <div
                  className="h-px w-6"
                  style={{
                    background: `linear-gradient(90deg, ${step.color}, ${steps[i + 1].color})`,
                  }}
                />
                <div
                  className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px]"
                  style={{ borderLeftColor: steps[i + 1].color }}
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#475569] mono mt-4">
        Complete signal path through one CIM column — analog computation, zero data movement
      </p>
    </div>
  );
}
