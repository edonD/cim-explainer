"use client";

import { motion } from "framer-motion";
import ChapterHeader from "../ui/ChapterHeader";
import ScrollReveal from "../ui/ScrollReveal";
import GlowCard from "../ui/GlowCard";
import ResearchPapers from "./ResearchPapers";
import CimTimeline from "./CimTimeline";
import ComparisonDashboard from "./ComparisonDashboard";

function CredibilityNarrative() {
  return (
    <ScrollReveal delay={0.2}>
      <div className="max-w-3xl mx-auto mt-16 mb-12">
        <motion.div
          className="rounded-xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #00f0ff08, #a855f708, #10b98108)",
            border: "1px solid #00f0ff15",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              linear-gradient(#00f0ff20 1px, transparent 1px),
              linear-gradient(90deg, #00f0ff20 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }} />

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#00f0ff] mb-4 text-center">
              The Bottom Line
            </h3>
            <div className="space-y-4 text-sm text-[#94a3b8] leading-relaxed">
              <p>
                This is{" "}
                <span className="text-[#ef4444] font-bold">not a science project</span>.
                Compute-in-Memory is a proven technology class with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="text-center p-4 rounded-lg bg-[#ef444408] border border-[#ef444420]">
                  <div className="mono text-3xl font-bold text-[#ef4444]">Nature</div>
                  <div className="text-xs text-[#94a3b8] mt-1">
                    Published in the world&apos;s most prestigious scientific journal
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#00f0ff08] border border-[#00f0ff20]">
                  <div className="mono text-3xl font-bold text-[#00f0ff]">ISSCC</div>
                  <div className="text-xs text-[#94a3b8] mt-1">
                    Multiple papers at the top chip design conference
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#10b98108] border border-[#10b98120]">
                  <div className="mono text-3xl font-bold text-[#10b981]">$275M</div>
                  <div className="text-xs text-[#94a3b8] mt-1">
                    Venture capital funding for d-Matrix commercial chips
                  </div>
                </div>
              </div>
              <p>
                We are building a prototype on the{" "}
                <span className="text-[#10b981] font-bold">SkyWater SKY130 130nm</span> process
                that demonstrates the same fundamental principles used in these state-of-the-art designs.
                The architecture is identical: 8T SRAM bitcells for weight storage, PWM encoding for
                input activations, analog current-domain multiply-accumulate, and column-parallel ADC readout.
              </p>
              <p>
                The path to a commercial product is a{" "}
                <span className="text-[#f59e0b] font-bold">node shrink</span> (130nm → 22nm) and a{" "}
                <span className="text-[#a855f7] font-bold">precision upgrade</span> (1-bit → multi-bit weights)
                — both well-understood engineering problems that the papers above have already solved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

function ValidationChecklist() {
  const items = [
    { check: "Analog multiply via Ohm's Law (V=IR)", proven: "Every CIM paper since 2018", color: "#00f0ff" },
    { check: "Current-domain accumulation (KCL)", proven: "Fundamental physics, all CIM designs", color: "#00f0ff" },
    { check: "8T SRAM bitcell for CIM", proven: "ISSCC 2025, JSSC 2025, Nature 2025", color: "#10b981" },
    { check: "PWM input encoding", proven: "Standard technique, our design matches", color: "#10b981" },
    { check: "Column-parallel SAR ADC", proven: "All major CIM macros use this", color: "#f59e0b" },
    { check: "Floating-point support", proven: "JSSC 2025: 249.5 TFLOPS/W at 22nm", color: "#f59e0b" },
    { check: "LLM inference capability", proven: "d-Matrix Corsair: 30K tokens/s on Llama 70B", color: "#a855f7" },
    { check: "Commercial viability", proven: "$275M VC funding, shipping product", color: "#a855f7" },
  ];

  return (
    <ScrollReveal delay={0.3}>
      <div className="max-w-3xl mx-auto my-12">
        <h4 className="text-lg font-bold text-center text-[#10b981] mb-6 mono">
          Technology Validation Checklist
        </h4>
        <div className="bg-[#0d1526] rounded-xl p-5 neon-border">
          <div className="space-y-2">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <motion.div
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 + 0.2, type: "spring" }}
                >
                  <svg viewBox="0 0 12 12" className="w-3 h-3">
                    <path d="M2,6 L5,9 L10,3" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
                <div className="flex-1">
                  <div className="text-xs text-[#e2e8f0]">{item.check}</div>
                  <div className="text-[10px] text-[#94a3b8] mono">{item.proven}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Chapter10() {
  return (
    <section id="chapter-10" className="chapter-section relative">
      <div className="max-w-6xl mx-auto">
        <ChapterHeader
          number={10}
          title="CIM Is Real"
          subtitle="Not theory. Not a lab demo. Proven technology that is shipping."
          color="#00f0ff"
        />

        <ResearchPapers />

        <CimTimeline />

        <ComparisonDashboard />

        <ValidationChecklist />

        <CredibilityNarrative />

        {/* Final call-to-action */}
        <ScrollReveal delay={0.4}>
          <motion.div
            className="text-center mt-12 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-3xl font-bold text-[#94a3b8] mb-4">
              250 TFLOPS/W at 22nm.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#00f0ff] mb-4">
              30,000 tokens/sec on Llama 70B.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#10b981] text-glow-green">
              We&apos;re building on proven technology.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Updated footer */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 pt-12 border-t border-white/5 text-center">
            <p className="text-sm text-[#475569] mb-2">
              Built from a real chip design on{" "}
              <span className="text-[#94a3b8]">SkyWater SKY130 130nm CMOS</span>
            </p>
            <p className="text-xs text-[#334155] mono mb-1">
              All measurements from actual SPICE simulations · Research data from IEEE and Nature
            </p>
            <p className="text-[10px] text-[#1e293b] mono">
              Sources: JSSC 2025, ISSCC 2025, Nature Vol. 639, d-Matrix / Hot Chips 2025
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
