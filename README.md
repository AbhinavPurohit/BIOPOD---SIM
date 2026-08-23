# BioPod — Intelligent Bio-Integrated Air Purification Simulator

BioPod is an interactive simulation platform for a next-generation air purification system that combines True HEPA H13 filtration with microalgae-based CO₂ sequestration.

The simulator models indoor air quality and dynamically visualizes how BioPod responds to different environmental and operating conditions over a 60-minute simulation.

## Features

* Interactive BioPod hardware visualization
* True HEPA H13 PM2.5 filtration simulation
* Microalgae-based CO₂ capture simulation
* Oxygen generation tracking
* Algae density and growth simulation
* Real-time CO₂ and PM2.5 monitoring
* AQI calculation and visualization
* Temperature and humidity monitoring
* Fan speed control
* LED intensity control
* Air-pump/aeration control
* Multiple room simulation presets
* Live simulation telemetry graphs
* 60-minute simulation timeline
* Simulation speed controls
* System health monitoring
* Interactive algae-tank visualization
* Apple-style scroll-driven product presentation
* Animated aurora background
* Responsive interface

## Simulation Model

The BioPod simulator combines multiple modeled processes:

* PM2.5 removal through HEPA filtration
* Continuous CO₂ generation from room occupants
* Biological CO₂ capture through microalgae
* Photosynthetic O₂ generation
* Effects of LED intensity on algae activity
* Effects of temperature on biological performance
* Effects of aeration and gas-liquid transfer
* Room-volume-based pollutant calculations
* Dynamic AQI estimation

The simulation generates minute-by-minute data from 0–60 minutes and displays the resulting changes through interactive graphs and visualizations.

## Technology Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide React
* Canvas Confetti
* GitHub Actions
* GitHub Pages

## Project Structure

```text
BIOPOD---SIM/
├── src/
│   ├── components/
│   ├── utils/
│   │   ├── simulationEngine.ts
│   │   └── audioSynthesizer.ts
│   ├── App.tsx
│   └── types.ts
├── public/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
└── vite.config.ts
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/AbhinavPurohit/BIOPOD---SIM.git
cd BIOPOD---SIM
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

## Production Build

Create a production build:

```bash
npm run build
```

The optimized production files will be generated in the `dist` directory.

## Live Demo

[BioPod Live Simulation](https://abhinavpurohit.github.io/BIOPOD---SIM/)

## Source Code

[GitHub Repository](https://github.com/AbhinavPurohit/BIOPOD---SIM)

## Important Note

BioPod is currently a simulation and prototype platform. The performance values and improvement percentages presented by the simulator are modeled/target values and should not be interpreted as experimentally validated real-world performance.

The simulator is intended to demonstrate the concept, system behavior, control variables, and potential performance of a bio-integrated air purification system.

## Project Goal

The goal of BioPod is to explore how conventional particulate filtration can be combined with biological CO₂ capture to create a more intelligent and sustainable indoor air purification system.

## License

This project is currently intended as an academic/prototype project. Add an appropriate open-source license if you decide to distribute the source code under specific licensing terms.
