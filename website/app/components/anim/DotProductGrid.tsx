"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";

export default function DotProductGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  // 4x4 weight matrix (binary: 0 or 1)
  const [weights, setWeights] = useState([
    [1, 0, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 1],
    [0, 0, 1, 1],
  ]);

  // 4-element input vector (0-15)
  const [inputs, setInputs] = useState([5, 10, 3, 8]);

  // Compute dot products
  const outputs = useMemo(() => {
    return [0, 1, 2, 3].map((j) =>
      inputs.reduce((sum, inp, i) => sum + weights[i][j] * inp, 0)
    );
  }, [weights, inputs]);

  const toggleWeight = (i: number, j: number) => {
    setWeights((prev) => {
      const next = prev.map((row) => [...row]);
      next[i][j] = next[i][j] === 1 ? 0 : 1;
      return next;
    });
  };

  const maxOutput = Math.max(...outputs, 1);

  return (
    <div ref={ref} className="max-w-2xl mx-auto my-12">
      <div className="bg-[#0d1526] rounded-xl p-6 neon-border">
        <div className="text-center mono text-sm text-[#00f0ff] mb-4">
          Interactive Matrix-Vector Multiply
        </div>

        <div className="flex items-start justify-center gap-4">
          {/* Input vector (left side / wordlines) */}
          <div className="flex flex-col items-end gap-1 mt-8">
            <div className="mono text-[10px] text-[#94a3b8] mb-1">Input x</div>
            {inputs.map((val, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={val}
                  onChange={(e) => {
                    const next = [...inputs];
                    next[i] = Number(e.target.value);
                    setInputs(next);
                  }}
                  className="w-16 accent-[#a855f7] h-1"
                />
                <div
                  className="w-8 h-8 rounded flex items-center justify-center mono text-xs font-bold border"
                  style={{
                    borderColor: "#a855f780",
                    backgroundColor: `rgba(168, 85, 247, ${val / 30})`,
                    color: "#a855f7",
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>

          {/* Weight matrix (center) */}
          <div>
            <div className="mono text-[10px] text-[#94a3b8] text-center mb-1">
              Weight W
            </div>
            <div className="grid grid-cols-4 gap-1">
              {weights.flat().map((w, idx) => {
                const i = Math.floor(idx / 4);
                const j = idx % 4;
                const active = w === 1;
                const contribution = active ? inputs[i] : 0;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => toggleWeight(i, j)}
                    className="w-10 h-10 rounded flex items-center justify-center mono text-xs font-bold border transition-all"
                    style={{
                      borderColor: active ? "#00f0ff60" : "#1e293b",
                      backgroundColor: active
                        ? `rgba(0, 240, 255, ${0.05 + contribution / 60})`
                        : "#0a0f1e",
                      color: active ? "#00f0ff" : "#334155",
                    }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      active && isInView
                        ? {
                            boxShadow: [
                              `0 0 0px #00f0ff00`,
                              `0 0 8px #00f0ff44`,
                              `0 0 0px #00f0ff00`,
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {w}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Equals sign */}
          <div className="flex items-center mt-12">
            <span className="mono text-xl text-[#f59e0b]">=</span>
          </div>

          {/* Output vector (right side / bitlines) */}
          <div className="flex flex-col items-start gap-1 mt-8">
            <div className="mono text-[10px] text-[#94a3b8] mb-1">Output y</div>
            {outputs.map((val, j) => (
              <div key={j} className="flex items-center gap-2">
                <div
                  className="w-10 h-8 rounded flex items-center justify-center mono text-xs font-bold border"
                  style={{
                    borderColor: "#10b98180",
                    backgroundColor: `rgba(16, 185, 129, ${val / maxOutput / 3})`,
                    color: "#10b981",
                  }}
                >
                  {val}
                </div>
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${Math.max(4, (val / maxOutput) * 60)}px`,
                    background: "linear-gradient(90deg, #10b981, #00f0ff)",
                    boxShadow: "0 0 6px #10b98144",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-4">
          Click cells to toggle weights (0/1). Drag sliders to change inputs.
          Each output is{" "}
          <span className="text-[#10b981] mono">y[j] = Σ W[i][j] × x[i]</span> —
          computed by physics in a single cycle.
        </p>
      </div>
    </div>
  );
}
