# CIM Chip Explainer - Interactive Animated Experience

An interactive scroll-driven educational experience explaining how Compute-in-Memory (CIM) chips perform neural network inference using analog physics. Built from **real SPICE measurements** of a SKY130 130nm CMOS chip design.

## Current State

| Chapter | Status | Visual | Clarity | Animation | Accuracy |
|---------|--------|--------|---------|-----------|----------|
| 1. The Problem (von Neumann) | Complete | 9/10 | 9/10 | 8/10 | 9/10 |
| 2. Key Insight (Ohm/KCL) | Complete | 9/10 | 9/10 | 8/10 | 10/10 |
| 3. 8T SRAM Bitcell | Complete | 8/10 | 8/10 | 8/10 | 10/10 |
| 4. PWM Driver | Complete | 8/10 | 9/10 | 8/10 | 10/10 |
| 5. 64x64 Array | Complete | 8/10 | 9/10 | 8/10 | 10/10 |
| 6. SAR ADC | Complete | 8/10 | 9/10 | 9/10 | 10/10 |
| 7. Neural Network Inference | Complete | 9/10 | 9/10 | 8/10 | 9/10 |
| 8. Full Chip | Complete | 8/10 | 9/10 | 7/10 | 10/10 |
| 9. Why This Matters | Complete | 9/10 | 9/10 | 8/10 | 9/10 |

**Average: 8.7/10**

## Screenshots

### Hero
![Hero](../screenshots/hero-desktop.png)

### Chapter 1: The Von Neumann Bottleneck
![Chapter 1](../screenshots/chapter-1.png)

### Chapter 2: Physics Computes for Free
![Chapter 2](../screenshots/chapter-2.png)

### Chapter 3: The 8T SRAM Bitcell
![Chapter 3](../screenshots/chapter-3.png)

### Chapter 5: The CIM Array
![Chapter 5](../screenshots/chapter-5.png)

### Chapter 7: Neural Network Inference
![Chapter 7](../screenshots/chapter-7.png)

### Chapter 9: Why This Matters
![Chapter 9](../screenshots/chapter-9.png)

## What's New
- **v3**: Particle background, scroll progress bar, floating chapter nav
- **v2**: Fixed label overlaps in Ch3, text cutoff in Ch4, added Puppeteer screenshots
- **v1**: All 9 chapters with interactive visualizations and real chip data

## Tech Stack
- **Next.js 16** with TypeScript and Tailwind CSS
- **Framer Motion** for scroll-triggered animations
- **HTML5 Canvas** for particle field background
- **SVG** for circuit diagrams and waveform visualizations
- **Puppeteer** for automated screenshots

## Real Chip Data Used
All numbers come from actual SPICE simulations of the SKY130 CIM design:
- **Bitcell**: I_read=28.36µA, I_leak=0.002nA, ON/OFF=14.9M, cell area=1.383µm²
- **PWM Driver**: T_LSB=5.0ns, linearity=0.026%, 6 transistors
- **SAR ADC**: 6-bit, 108ns conversion, ENOB=6.0, 5.1µW
- **Full Tile**: 64x64 array, <500ns compute, <10mW power

## Running Locally

```bash
cd website
npm install
npm run dev
```

## Taking Screenshots

```bash
node screenshot.js
```

## Next Up
- More dramatic array compute animation with current flow visualization
- Enhanced Chapter 8 with 3D chip view using Three.js
- Sound design for key moments
- Mobile layout optimization
