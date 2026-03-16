# CIM Chip Explainer — 3Blue1Brown Style

You are building an animated, scroll-driven explainer website that teaches how Compute-in-Memory chips work. The style is **3Blue1Brown**: build intuition through visuals, pose questions before revealing answers, and make the viewer feel like they *discovered* each idea rather than being told it.

## The 3Blue1Brown Philosophy

These rules override everything else:

1. **One idea per screen.** Never show two concepts at once. If the viewer needs to hold two new ideas in their head simultaneously, you've failed. Each scroll section introduces exactly ONE thing.

2. **Question → Pause → Reveal.** Every section starts with a question or puzzle. Give the viewer a moment to think. Then reveal the answer with a satisfying animation. Example: "What if we could multiply two numbers... without any transistors switching?" (pause) Then show Ohm's law doing multiplication.

3. **Build from what they know.** The viewer knows Ohm's law, basic transistors, digital logic. Start THERE. Never introduce jargon without first building the intuition for why that thing needs to exist. Don't say "8T SRAM bitcell" — say "What if a memory cell could also compute?" and then build the 8T cell piece by piece.

4. **Visuals carry the explanation, not text.** If you need a paragraph to explain something, your animation isn't good enough. Text should be short — a sentence or two to frame what the viewer is about to see. The animation does the teaching.

5. **Each animation should have an "aha!" moment.** The viewer should feel something click. Design every animation around that click. The click in Chapter 2 is: "Wait... physics is doing the math for free?" The click in Chapter 5 is: "Holy shit, 4096 multiplications in one clock cycle?"

6. **Pacing matters more than completeness.** It's better to explain 3 ideas perfectly than 10 ideas poorly. Cut anything that doesn't serve the narrative. If a detail is cool but breaks the flow, cut it.

7. **Conversational, not academic.** Write like a smart friend explaining over coffee. Not a textbook. Not a paper abstract. "Here's the wild part..." is better than "It should be noted that..."

## The Real Chip

The explainer is based on a real CIM chip designed in SKY130 130nm CMOS. The design lives at `~/workspace/sky130-cim/`. Read these files for real numbers:

```
~/workspace/sky130-cim/master_spec.json
~/workspace/sky130-cim/blocks/bitcell/README.md
~/workspace/sky130-cim/blocks/bitcell/measurements.json
~/workspace/sky130-cim/blocks/pwm-driver/README.md
~/workspace/sky130-cim/blocks/pwm-driver/measurements.json
~/workspace/sky130-cim/blocks/adc/README.md
~/workspace/sky130-cim/blocks/adc/measurements.json
~/workspace/sky130-cim/blocks/array/program.md
~/workspace/sky130-cim/blocks/array/specs.json
```

Use the REAL measured numbers (currents, voltages, transistor sizes, timing). Real numbers make it believable.

## Tech Stack

```bash
npx create-next-app@latest website --typescript --tailwind --app --no-eslint --no-src-dir
cd website
npm install framer-motion three @react-three/fiber @react-three/drei @types/three d3 puppeteer
```

- **Framer Motion** — scroll-triggered animations, transitions
- **D3.js** — data visualizations, waveforms
- **Three.js** — 3D chip views (use sparingly — only where 3D genuinely helps)
- **Canvas/SVG** — circuit diagrams, signal animations
- Dark theme. Cyan for signals, amber for energy, green for data. Neon glow on active elements.

**No component file over 600 lines.** Split into sub-components. TypeScript strict, no `any`.

---

## The Story

The explainer is a single-page scroll. Each chapter is one idea. The narrative has three acts:

### Act I: The Problem and the Insight (Chapters 1–2)

The viewer should walk away knowing: *"Moving data wastes energy. Physics can do math for free."*

---

**Chapter 1: "Why does AI burn so much power?"**

Open with something visceral. A GPU drawing 300 watts. A data center's electric bill. Then zoom in — WHY is it so hungry?

Animate the von Neumann bottleneck:
- Memory on one side. Processor on the other. A narrow bus between them.
- Data packets shuttle back and forth. Each trip costs energy.
- The packets move faster and faster. The bus glows red. Heat.
- A counter ticks up: "Energy spent computing: 8%. Energy spent moving data: 92%."

Pause. Let that land.

Then the question: *"What if the data never had to move?"*

This chapter should feel like a problem that NEEDS solving. The viewer should feel the waste.

---

**Chapter 2: "Physics can multiply. For free."**

This is the most important chapter. If the viewer doesn't feel the "aha!" here, nothing else matters. Take your time.

**Part 1: The multiplier you already know.**
- Show a resistor. Current flows through it.
- V = I × R. That's multiplication. A resistor multiplies current by resistance to produce voltage.
- Interactive: a slider for R (the "weight"). Drag it. Watch the output voltage change. You're multiplying.
- "No transistors switched. No clock cycles. No energy spent on logic gates. Ohm's law just... did it."

**Part 2: The adder you already know.**
- Show two wires carrying current merging into one wire.
- The currents add. Kirchhoff's current law. The wire itself is an adder.
- Interactive: toggle current sources on/off. Watch the sum update on the shared wire.
- "The wire is doing addition. For free."

**Part 3: The punchline.**
- "So if resistors multiply... and wires add... what happens if we arrange resistors in a grid?"
- Animate: a small 3×3 grid appears. Inputs on one side, outputs on the other.
- Light up one row — multiplications happen in each cell. Currents sum on each column.
- "That's a dot product. One column just computed a dot product. Using physics."
- Zoom out slightly: "Every column does this simultaneously. That's... matrix multiplication."
- Beat. "A grid of resistors just did matrix multiplication. In one step. With no processor."

This should feel like a magic trick that's also completely obvious in hindsight.

---

### Act II: How We Actually Build It (Chapters 3–6)

The viewer should walk away knowing: *"Here's exactly how you turn that physics trick into a real chip."*

Each chapter answers one question that the previous chapter raised.

---

**Chapter 3: "How do you make a resistor that remembers?"**

The grid from Chapter 2 needs programmable resistors — resistors whose value we can SET and that STAY set. That's what the memory cell is.

**Start simple.** Two NOT gates feeding into each other. Animate the feedback loop:
- If Q is high → feeds into the second inverter → forces QB low → feeds back → keeps Q high.
- It's a latch. It holds a bit. Show the voltage stabilizing on an oscilloscope-style trace.

**Then add access.** "But how do we write to it?" Add the two access transistors. Show the wordline going high, the bitlines overpowering the latch. The bit flips. Wordline goes low — the new value is locked in.

**Then the CIM twist.** "This is a standard 6T SRAM cell. Every processor has billions of them. But watch what happens when we add two more transistors..."

Add the read port transistors. Now the cell can output a current proportional to its stored bit WITHOUT disturbing the stored value. The cell is both memory AND a programmable switch in our compute grid.

Show the real numbers: I_read = 28.36 µA when storing 1. I_leak = 0.002 nA when storing 0. On/off ratio: 14.8 million. "That switch is VERY good at being either on or off."

Size context: "This cell is 1.38 µm². You could fit 72 million of them on a postage stamp."

---

**Chapter 4: "How do you feed in the inputs?"**

Chapter 2 showed inputs as analog values. Chapter 3 showed the weights are binary (stored bit = 1 or 0). So the input has to carry the precision.

"We encode the input as TIME."

Animate pulse width modulation:
- A 4-bit number (say, 5 = 0101) becomes a pulse that's ON for 5 units of time.
- 15 = 1111 → long pulse. 1 = 0001 → short pulse. 0 = 0000 → no pulse.
- Show all 16 codes as pulses of increasing width, side by side.

"Longer pulse → more time for current to flow → larger contribution to the dot product."

Connect it back: "The pulse width IS the input value. The cell's stored bit IS the weight. Current × time = the product. Physics does the rest."

Real numbers: T_LSB = 5.0 ns, linearity = 0.026%.

---

**Chapter 5: "Now put 4,096 of them together."**

This is the climax of Act II. Build up slowly.

- Start with ONE cell + ONE pulse = one multiplication. Show it.
- Add a second row. Two cells on the same column. Two pulses arrive. Both currents flow into the same wire. "Kirchhoff adds them. That's a dot product of size 2."
- Grow to 4×4. Animate: 4 pulses arrive simultaneously, 4 columns each sum 4 products. "16 multiplications. 4 additions. One step."
- Grow to 64×64. Zoom out. "4,096 multiplications. 64 dot products. One clock cycle. Zero data movement."

**The key animation** — a complete compute cycle:
1. **Precharge:** all bitlines pulled to VDD. Clean slate.
2. **Compute:** 64 PWM pulses arrive on all wordlines simultaneously. Cells with weight=1 discharge their bitline. Cells with weight=0 do nothing. Show currents flowing, bitline voltages dropping.
3. **Result:** 64 analog voltages. Each one is a dot product. Done.

Show the formula: V_BL[j] = VDD - (1/C_BL) × Σ(W[i][j] × I_READ × T_pulse[i])

"64 multiply-accumulate operations. One cycle. The weights never moved."

---

**Chapter 6: "Reading the analog answer."**

"The array produced 64 analog voltages. But the rest of the system speaks digital. We need to convert."

Show the SAR ADC doing binary search:
- "Is the voltage above half? Yes → MSB is 1."
- "Is it above three-quarters? No → next bit is 0."
- 6 comparisons → 6-bit digital result.
- Interactive: let the user watch the approximation converge step by step.

64 ADCs, one per column. All convert simultaneously. Real numbers: 6-bit, 108 ns, 5.1 µW each.

---

### Act III: The Payoff (Chapters 7–8)

---

**Chapter 7: "A neural network, running inside memory."**

Everything connects. This should feel like the finale of a symphony.

Show a simple neural network (MNIST digit classifier). A handwritten "7" enters:

1. Pixel values → PWM pulses (Chapter 4)
2. Pulses hit the array where weights are stored (Chapter 3 + 5)
3. Physics computes 64 dot products in one shot (Chapter 2 + 5)
4. ADCs digitize the results (Chapter 6)
5. Apply activation function (ReLU — just clamp negatives to zero)
6. Feed to the next layer (or read the final output)
7. Output: "It's a 7!" with confidence bars.

Side-by-side comparison:
- Digital processor: millions of clock cycles, data shuttling back and forth.
- CIM chip: a handful of cycles, data never moves.

"The weights never moved. The computation happened WHERE the data was stored. That's compute-in-memory."

---

**Chapter 8: "This is real."**

Show the full chip: PWM drivers + 64×64 array + 64 ADCs + control logic. Clean exploded view.

Then zoom out to the bigger picture:
- This isn't theory. CIM chips are publishing at ISSCC, in Nature, and shipping commercially.
- d-Matrix raised $275M for a CIM inference chip. ISSCC 2025 showed 250 TFLOPS/W.
- "Our SKY130 prototype proves the same physics at 130nm. A node shrink gets you to the state of the art."

End on applications: edge AI, implantable medical devices, battery-free sensors, always-on intelligence.

"The future of AI isn't bigger data centers. It's smarter silicon."

---

## Visual Design

- **Dark background** — deep navy (#0a0f1e) to black
- **Signal flow:** cyan (#00f0ff)
- **Energy/power:** amber (#f59e0b)
- **Data/results:** green (#10b981)
- **Bottlenecks/waste:** red (#ef4444)
- Neon glow on active elements. Grid patterns in backgrounds.
- Monospace for numbers, clean sans-serif for text.
- Generous whitespace. Cinematic pacing. Let animations breathe.

## Quality Bar

After every significant visual change, screenshot and evaluate:
- Would a 3Blue1Brown viewer say "that's beautiful and clear"?
- Can someone with basic electronics knowledge follow it without pausing?
- Does every animation have a purpose, or is it just decoration?
- Are the real chip numbers visible and contextualized?

If any answer is no, iterate before moving on.

## Screenshot Loop

Create `screenshot.js` with Puppeteer. After significant changes: screenshot at 1920x1080 and 390x844, save to `screenshots/`, self-evaluate, iterate if needed.

## Development

Work chapter by chapter, in order. Each chapter must be solid before moving to the next — later chapters build on earlier ones. Commit after each chapter passes the quality bar.
