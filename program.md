# CIM Chip Explainer — Interactive Animated Educational Experience

You are a world-class technical educator, animation designer, and web developer. Your mission: build the most visually stunning, deeply educational, interactive animated explainer of how a Compute-in-Memory (CIM) chip works — from transistor-level to neural network inference.

The audience knows basic electronics (Ohm's law, transistors as switches, digital logic) but has NEVER seen a CIM chip. By the end of your explainer, they must fully understand how analog computation replaces digital multiply-accumulate operations, and how a neural network runs entirely inside memory.

## Phase 1: Learn the CIM Architecture

Read the actual CIM chip design from this repository. The full project lives at `~/workspace/sky130-cim/`. Read these files to understand the real design:

```
~/workspace/sky130-cim/master_spec.json          — top-level chip spec
~/workspace/sky130-cim/interfaces.md             — block interface contracts
~/workspace/sky130-cim/blocks/bitcell/README.md  — 8T SRAM bitcell design
~/workspace/sky130-cim/blocks/bitcell/measurements.json — actual measured parameters
~/workspace/sky130-cim/blocks/bitcell/design.cir — SPICE netlist
~/workspace/sky130-cim/blocks/pwm-driver/README.md — PWM wordline driver
~/workspace/sky130-cim/blocks/pwm-driver/measurements.json — actual measured parameters
~/workspace/sky130-cim/blocks/adc/README.md      — SAR ADC design
~/workspace/sky130-cim/blocks/adc/measurements.json — actual measured parameters
~/workspace/sky130-cim/blocks/array/program.md   — 64x64 array specification
~/workspace/sky130-cim/blocks/array/specs.json   — array targets
```

You MUST use the REAL numbers from these files. Not textbook examples — the actual transistor sizes, voltages, currents, and performance metrics from the SKY130 design.

## Phase 2: Build the Animated Explainer

### Tech Stack
Use whatever delivers the best visual result. Recommended:

```bash
npx create-next-app@latest website --typescript --tailwind --app --no-eslint --no-src-dir
cd website
npm install framer-motion three @react-three/fiber @react-three/drei @types/three d3 puppeteer
```

- **Three.js / React Three Fiber** — for 3D chip visualizations, exploded views, fly-throughs
- **D3.js** — for animated data flow diagrams, waveforms, matrix visualizations
- **Framer Motion** — for scroll-triggered animations, transitions
- **HTML5 Canvas** — for custom animated circuit diagrams, signal flow
- **Web Audio API** — subtle sound design if it enhances understanding
- **CSS animations** — for simpler effects

### Code Architecture (NON-NEGOTIABLE)
- **NO component file may exceed 600 lines** — split into sub-components
- Components in `app/components/`, 3D scenes in `app/components/three/`, animations in `app/components/anim/`
- TypeScript strict, no `any`

### The Story Arc (Scroll-Driven Experience)

The explainer is a single-page scroll experience. Each section builds on the previous. The user scrolls through a story that goes from "why does this exist?" to "holy shit, a neural network is running inside memory."

#### Chapter 1: The Problem
- **"Why is AI so power hungry?"** — visualize a traditional processor: data shuttling back and forth between memory and compute units (the von Neumann bottleneck)
- Animated diagram: memory on one side, ALU on the other, data bus between them glowing red with heat as data moves back and forth
- Counter showing: energy spent on COMPUTATION vs energy spent on DATA MOVEMENT
- Reveal: **>90% of energy in neural network inference is spent moving data, not computing**
- "What if we could compute WHERE the data already lives?"

#### Chapter 2: The Key Insight
- **"Ohm's Law is a free multiplier"** — V = I × R
- Animate: a resistor with current flowing. Change the resistance (weight), change the voltage (result). Multiplication for free — no transistor switching, no clock cycles.
- **"Kirchhoff's Current Law is a free adder"** — currents on a wire sum automatically
- Animate: multiple current sources merging onto a shared wire. The wire does addition physically.
- "So if we arrange resistors in a grid... we get matrix multiplication. For free. In physics."

#### Chapter 3: The SRAM Bitcell
- **Show the actual 8T SRAM CIM bitcell** from the design
- Start with a simple 6T SRAM (cross-coupled inverters), explain how it stores a bit
- Add the 2 extra transistors for CIM readout — explain why
- Animate: write operation (storing weight = 1 or weight = 0)
- Animate: read/compute operation — wordline goes high, current flows (or not) based on stored weight
- Show REAL numbers: I_read = 28.36 µA, I_leak = 0.002 nA, on/off ratio = 14.8 million
- Use the actual transistor sizes from the design (Wp=0.55µm, Wn=0.84µm, etc.)
- Scale visualization: "This cell is 1.38 µm² — you could fit 72 million on a postage stamp"

#### Chapter 4: The PWM Driver
- **"How do we encode the INPUT values?"** — Pulse Width Modulation
- Animate: a 4-bit digital code (e.g., 0101 = 5) converting to a pulse of proportional width
- Show all 16 codes (0-15) as pulses of increasing width
- Explain: longer pulse = more time for current to flow = larger dot product contribution
- Show REAL numbers: T_LSB = 5.0 ns, linearity = 0.026%, rise time = 0.148 ns
- "The pulse width IS the input activation value"

#### Chapter 5: The Array — Where Magic Happens
- **Build up the 64×64 array visually**
- Start with ONE bitcell + ONE wordline = one multiplication
- Add a second row = two multiplications, currents sum on the bitline (Kirchhoff!)
- Grow to 4×4 with animation — show the dot product forming
- Grow to 64×64 — zoom out to see the full array
- **THE KEY ANIMATION**: Show a complete compute cycle:
  1. Precharge: all bitlines pulled to VDD (animate PMOS transistors charging capacitors)
  2. Compute: 64 PWM pulses arrive simultaneously on wordlines. Cells with weight=1 discharge their bitline. Animation shows current flowing through cells, bitline voltages dropping proportionally.
  3. Result: 64 analog voltages sitting on 64 bitlines = 64 dot products computed IN ONE SHOT
- Show the formula: V_BL[j] = VDD - (1/C_BL) × Σ(W[i][j] × I_READ × T_pulse[i])
- "64 multiply-accumulate operations. One clock cycle. Zero data movement."

#### Chapter 6: The ADC — Reading the Answer
- **"The answer is an analog voltage. We need it digital."**
- Show the SAR ADC architecture from the real design
- Animate the successive approximation: binary search on voltage
  - Compare to Vref/2 → set MSB
  - Compare to Vref/4 → set next bit
  - ... repeat for 6 bits
- Show REAL numbers: 6-bit resolution, 108 ns conversion, 5.1 µW power, ENOB = 6.0
- 64 ADCs read 64 bitlines → 64 digital output values

#### Chapter 7: Neural Network Inference
- **"Now put it all together"** — this is the climax
- Show a simple neural network (e.g., MNIST digit recognition): input layer → hidden layer → output layer
- Map the weight matrix to the CIM array: each weight stored in one bitcell
- Animate a handwritten digit flowing in:
  1. Pixel values → PWM encoded → wordline pulses
  2. Array computes dot products (show the bitlines discharging)
  3. ADCs digitize results
  4. Activation function applied (ReLU)
  5. Feed to next layer (or read final output)
  6. Output: "It's a 7!" with confidence scores
- Side-by-side comparison: how many clock cycles this would take on a digital processor vs CIM
- Power comparison: digital multiply-accumulate vs analog CIM
- "The weights never moved. The computation happened WHERE the data was stored."

#### Chapter 8: The Full Chip
- 3D exploded view of the complete CIM tile:
  - PWM drivers (top)
  - 64×64 SRAM array (center)
  - 64 SAR ADCs (bottom)
  - Control logic (side)
- Fly-through camera animation
- Specs overlay: compute time < 500 ns, power < 10 mW, area estimate
- "This entire chip does what would take a GPU millions of transistors to do — with a fraction of the power."

#### Chapter 9: Why This Matters
- Applications: edge AI, IoT, implantable medical devices, autonomous sensors
- Power comparison infographic: GPU vs CIM for same inference task
- "The future of AI isn't bigger data centers. It's smarter silicon."

### Visual Design
- Dark background (deep navy #0a0f1e to black)
- Circuit-aesthetic color palette: cyan (#00f0ff) for signals, amber (#f59e0b) for energy/power, green (#10b981) for data, red (#ef4444) for bottlenecks
- Neon glow effects on active circuit elements
- Grid/schematic-line patterns in backgrounds
- Clean monospace font for technical values, sans-serif for explanatory text
- Generous spacing, cinematic feel

### Visual Evaluation Loop (CRITICAL)

Create `screenshot.js` with Puppeteer:
1. Start Next.js dev server
2. Screenshot full page at 1920x1080 and 390x844
3. Screenshot each chapter individually
4. Save to `screenshots/`

After EVERY significant change:
1. Screenshot
2. Self-evaluate on a scorecard:
   - Visual quality (1-10): Does this look like a premium educational experience?
   - Clarity (1-10): Would someone with basic electronics knowledge understand this?
   - Animation quality (1-10): Are animations smooth, purposeful, and enhancing understanding?
   - Technical accuracy (1-10): Are the numbers and explanations correct?
   - Flow (1-10): Does each chapter naturally lead to the next?
3. **ONLY commit if ALL scores are 8+ and average is 9+**
4. If any score is below 8, iterate until it passes

### Critic Agent (Every 10 Minutes)

Every 10 minutes, spawn a fresh Claude subprocess with screenshots and ask:

```
"You are an electrical engineering student who knows basic electronics but has never
seen a CIM chip. Look at these screenshots of an educational explainer website.
1. After viewing this, do you understand how compute-in-memory works? What's still confusing?
2. Rate the visual quality 1-10
3. What's the weakest explanation?
4. What's the best part?
5. Would you share this with a friend? Why/why not?
Be honest and specific."
```

Address the critic's confusion points before continuing.

## README.md Dashboard

Update after EVERY commit:
1. Current state — chapters complete, animation quality
2. Screenshots
3. What's New
4. Critic feedback summary
5. Next Up

## MANDATORY: Commit and Push After EVERY Change (NON-NEGOTIABLE)

**YOU MUST run `git add -A && git commit -m "description" && git push` after EVERY single change.** Not batched. EVERY change. Commits are your heartbeat. No commits = no proof of life. This is the MOST IMPORTANT rule.

## Development Loop

LOOP FOREVER:

1. Pick highest-impact chapter/animation to build
2. Implement (components under 600 lines)
3. Screenshot and self-evaluate
4. If scores pass: commit and push
5. Every 10 min: spawn critic, incorporate feedback
6. Update README.md
7. Repeat

**NEVER STOP.** If all chapters are built, add more interactivity, more animations, more detail. Make it the best CIM explainer that has ever existed. The human is away. When they come back, they should understand CIM deeply and be blown away by the presentation.

## URGENT ADDITION: Deep SRAM Simulation

Chapter 3 needs to be MUCH deeper. The current transistor diagram is too static. Add the following:

### 3a: How SRAM Stores a Bit (Animated Simulation)
- Show the cross-coupled inverter pair step by step:
  1. Two NOT gates feeding back into each other
  2. Animate: if Q is high, it forces QB low through the right inverter, which forces Q high through the left inverter — the feedback loop that HOLDS data
  3. Show the voltage waveforms at Q and QB stabilizing (like an oscilloscope trace)
  4. Show what happens when you TRY to flip it — the cell resists (that is stability / SNM)
  5. Then show how the access transistors (controlled by wordline) allow WRITING by overpowering the feedback

### 3b: Write Operation Animation
- Step-by-step animated simulation:
  1. Cell stores Q=0 initially (show voltages)
  2. Bitlines BL=VDD, BLB=0 driven externally (show the strong drivers)
  3. Wordline goes HIGH — access transistors turn ON
  4. The external drivers overpower the cross-coupled inverters
  5. Q flips to 1, QB flips to 0
  6. Wordline goes LOW — cell now holds the new value
  7. Show voltage waveforms throughout (animated line chart, like SPICE output)

### 3c: Read Operation vs CIM Compute
- Compare traditional SRAM read (charge sharing on bitline) vs CIM compute (current-mode readout)
- Show why the 8T cell is better than 6T for CIM — decoupled read port does not disturb stored data

### 3d: Stability Visualization
- Butterfly curve animation: plot Q vs QB transfer characteristics
- Show the two stable states as the "eyes" of the butterfly
- SNM = the largest square that fits inside = 557 mV (from real measurements)
- Animate what happens when noise pushes the operating point — it snaps back to stable state

### 3e: General SRAM Knowledge Section
- What is SRAM vs DRAM vs Flash — comparison table with animations
- Why SRAM is fast (no refresh needed, no charge pump)
- Where SRAM lives in a processor (L1/L2/L3 cache hierarchy) — animated diagram
- The 6T cell topology and WHY cross-coupling creates bistability
- Scaling: how many SRAM cells fit on modern chips (billions)

Make these sub-sections scroll-triggered with smooth animations. Use animated SVG waveforms, canvas-based voltage traces, and interactive elements where the user can toggle wordline/bitlines to see what happens. This should feel like an interactive circuit simulator, not a static diagram.

Commit and push after EACH sub-section is implemented.

## URGENT ADDITION: Research-Backed Demos — Make It Believable

The explainer currently explains the concepts but does not PROVE them with real research. Nobody will believe this works unless you show the papers, the results, and the context. Use the BUAA CIM literature collection as your source: https://github.com/BUAA-CI-LAB/Literatures-on-SRAM-based-CIM

### New Chapter: "CIM Is Not Theory — It Is Shipping"

Add a new chapter (or expand Chapter 8/9) that shows the REAL state of the art. For each key paper/chip, create a visual demo card that includes:

1. **Search for each paper** using web search to find the actual results, figures, architecture diagrams, and key metrics
2. **Recreate the key diagrams** as clean SVG/Canvas visualizations — NOT screenshots, but YOUR OWN recreations showing the architecture
3. **Show the performance numbers** in compelling data visualizations

### Papers to Research and Visualize (search for each one)

**Macro Level (Circuit Designs):**
- "22nm 109-250 TFLOPS/W Outlier-Aware FP SRAM CIM" (JSSC 2025) — show how they handle floating-point in SRAM
- "51.6 TFLOPS/W Full-Datapath CIM Approaching Sparsity Bound" (ISSCC 2025) — show sparsity exploitation
- "192.3 TFLOPS/W Dual-Mode-Transpose Digital 6T-SRAM CIM" (ISSCC 2025) — training AND inference in CIM
- "28nm 64kb Bit-Rotated Hybrid-CIM Macro" (ISSCC 2025) — hybrid analog/digital approach

**Architecture Level (Full Systems):**
- "Mixed-precision memristor and SRAM CIM AI processor" (Nature 2025) — a Nature paper means serious validation
- "Efficient Edge Vision Transformer Accelerator with CIM" (DAC 2025) — CIM running transformers, not just CNNs

**Commercial:**
- d-Matrix Corsair chip — 1GB SRAM, 100B parameter models, $275M raised
- Search for their architecture and recreate a simplified version

### How to Present Each Paper

For each paper/chip, create a visual card with:

```
┌─────────────────────────────────────────────────┐
│  [ISSCC 2025]  22nm Outlier-Aware FP CIM        │
│  ─────────────────────────────────────────────── │
│                                                   │
│  [Recreated architecture diagram as SVG]          │
│  Show: the macro layout, data flow, key blocks    │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 250      │  │ 22nm     │  │ FP16     │       │
│  │ TFLOPS/W │  │ TSMC     │  │ Support  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                   │
│  Key Innovation: Handles outlier activations in   │
│  LLMs by splitting computation into normal and    │
│  outlier paths — solves the main accuracy problem │
│  that prevented CIM from running real LLMs.       │
│                                                   │
│  [Link to paper]                                  │
└─────────────────────────────────────────────────┘
```

### Timeline Visualization

Create an animated timeline showing CIM evolution:
- 2018: First SRAM CIM demos (~1 TOPS/W, MNIST only)
- 2019-2020: Multi-bit precision, CNNs
- 2021-2022: Digital CIM macros, better accuracy
- 2023: Transformer support, hybrid architectures
- 2024: Floating-point CIM, LLM-capable designs
- 2025: 250 TFLOPS/W, commercial chips (d-Matrix), Nature papers
- 2026: 3D stacked CIM, on-chip LLM inference

Show where OUR chip sits on this timeline — "We are building on the same architecture that achieved 250 TFLOPS/W at 22nm. Our SKY130 prototype proves the concept at 130nm."

### Comparison Dashboard

Create an interactive comparison table:
| Metric | Our SKY130 | ISSCC 2025 Best | d-Matrix | Traditional GPU |
|--------|-----------|-----------------|----------|-----------------|
| Node | 130nm | 22nm | Advanced | 4nm |
| Energy Efficiency | X TOPS/W | 250 TFLOPS/W | 10x over HBM | ~1 TFLOPS/W |
| Array Size | 64x64 | 256x256 | 1GB SRAM | N/A |
| Target | Edge AI | Edge+Cloud | Cloud inference | Everything |
| Power | <10mW | ~mW range | Watts | 300W+ |

### The Credibility Argument

The narrative must be: "This is not a science project. This is a proven technology class that has Nature papers, ISSCC papers, and $275M in VC funding. We are building a prototype on SKY130 that demonstrates the same fundamental principles. The path to a commercial product is a node shrink and precision upgrade — both well-understood engineering problems."

Search the web for EVERY paper mentioned above. Read the abstracts. Find the key figures and metrics. Recreate the architectures as clean diagrams. Make this chapter the most research-dense, credibility-building section of the entire explainer.

Commit and push after EACH paper visualization is added.
