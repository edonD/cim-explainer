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
