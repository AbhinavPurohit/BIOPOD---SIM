import React, { useRef, useState, useEffect } from 'react';
import { 
  Leaf, 
  Sparkles, 
  Wind, 
  ShieldCheck, 
  Power, 
  ChevronDown, 
  Activity, 
  Sliders, 
  Layers, 
  Droplets,
  ArrowDown,
  Gauge,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { BioPodControls, RoomConditions, SimulationDataPoint } from '../types';
import { calculatePM25AQI } from '../utils/simulationEngine';

interface BioPodScrollHeroProps {
  room: RoomConditions;
  controls: BioPodControls;
  currentPoint: SimulationDataPoint;
  isSimulating: boolean;
  onTogglePower: () => void;
  onSelectTank: (tankId: '01' | '02') => void;
  onOpenPrinciples: () => void;
  onScrollToSimulation?: () => void;
}

export const BioPodScrollHero: React.FC<BioPodScrollHeroProps> = ({
  room,
  controls,
  currentPoint,
  isSimulating,
  onTogglePower,
  onSelectTank,
  onOpenPrinciples,
  onScrollToSimulation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set up scrubbed scroll progress across 540vh (50% more scroll depth for immersive slide reading)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out scrubbed scroll with a gentle spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  // Track active stage for UI callouts and subtle highlight shifts
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.18) {
        setActiveStage(0); // Stage 0: Hero Opener
      } else if (latest < 0.44) {
        setActiveStage(1); // Stage 1: Algae Photobioreactors
      } else if (latest < 0.68) {
        setActiveStage(2); // Stage 2: HEPA H13 Filtration
      } else if (latest < 0.86) {
        setActiveStage(3); // Stage 3: ESP32 IoT & Adaptive Logic
      } else {
        setActiveStage(4); // Stage 4: Finale & CTA
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // ================= SCROLL-DRIVEN HARDWARE 3D TRANSFORMS =================
  // Scaled cleanly (+20%) for prominent visual presence with well-balanced negative space
  // Stage 0: Positioned at y: 95px with scale 1.02
  // Stage 1: Moves right (26%), scales to 1.08, tilts left for algae feature on left
  // Stage 2: Moves left (-26%), tilts right for HEPA feature on right
  // Stage 3: Moves to center-top (y: -35px), scales 1.00 for IoT telemetry dock below
  // Stage 4: Returns to center (y: -25px) with clean CTA (1.06)

  const hardwareX = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.42, 0.52, 0.66, 0.74, 0.86, 1.0],
    ['0%', '0%', '26%', '26%', '-26%', '-26%', '0%', '0%', '0%']
  );

  const hardwareY = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.42, 0.52, 0.66, 0.74, 0.86, 1.0],
    ['155px', '155px', '20px', '20px', '20px', '20px', '-35px', '-25px', '-25px']
  );

  const hardwareScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.42, 0.52, 0.66, 0.74, 0.86, 1.0],
    [0.98, 0.98, 1.08, 1.08, 1.08, 1.08, 1.00, 1.06, 1.06]
  );

  const hardwareRotateY = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.42, 0.52, 0.66, 0.74, 0.86, 1.0],
    [0, 0, -8, -8, 8, 8, 0, 0, 0]
  );

  const hardwareRotateX = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.42, 0.52, 0.66, 0.74, 0.86, 1.0],
    [2, 2, 3, 3, 3, 3, 3, 0, 0]
  );

  // ================= SCROLL-DRIVEN FEATURE OPACITIES & TRANSLATIONS =================
  // Feature 0: Opening Hero Text (Visible 0% - 16%)
  const heroTextOpacity = useTransform(smoothProgress, [0, 0.10, 0.16], [1, 1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 0.10, 0.16], [0, 0, -35]);

  // Feature 1: Algae Feature (Visible 18% - 44%)
  const algaeOpacity = useTransform(smoothProgress, [0.16, 0.23, 0.38, 0.44], [0, 1, 1, 0]);
  const algaeX = useTransform(smoothProgress, [0.16, 0.23, 0.38, 0.44], [-40, 0, 0, -30]);

  // Feature 2: HEPA Feature (Visible 44% - 68%)
  const hepaOpacity = useTransform(smoothProgress, [0.44, 0.51, 0.63, 0.68], [0, 1, 1, 0]);
  const hepaX = useTransform(smoothProgress, [0.44, 0.51, 0.63, 0.68], [40, 0, 0, 30]);

  // Feature 3: IoT & Smart Control Feature (Visible 68% - 86%)
  const iotOpacity = useTransform(smoothProgress, [0.68, 0.74, 0.83, 0.87], [0, 1, 1, 0]);
  const iotY = useTransform(smoothProgress, [0.68, 0.74, 0.83, 0.87], [35, 0, 0, -20]);

  // Feature 4: Finale & CTA (Visible 86% - 100%)
  const ctaOpacity = useTransform(smoothProgress, [0.86, 0.91, 1.0], [0, 1, 1]);
  const ctaY = useTransform(smoothProgress, [0.86, 0.91, 1.0], [35, 0, 0]);

  // Dynamic values
  const effectiveFanSpeed = controls.mode === 'ECO' ? 35 : controls.fanSpeed;
  const fanRotationDuration = `${Math.max(0.25, (100 - effectiveFanSpeed) / 75 + 0.3)}s`;
  const ledGlow = controls.ledIntensity / 100;
  const aqiData = calculatePM25AQI(currentPoint.roomPm25);

  const scrollToSim = () => {
    if (onScrollToSimulation) {
      onScrollToSimulation();
    } else {
      const el = document.getElementById('biopod-main-visualization-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="biopod-apple-scroll-experience"
      className="relative w-full h-[540vh]"
    >
      {/* Pinned Sticky Viewport (100vh) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between items-center z-10 select-none">
        
        {/* Subtle top progress track */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#152319]/40 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-[#69B82F] via-[#42B9D9] to-[#69B82F]"
            style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
          />
        </div>

        {/* Ambient Acoustic Wood Slats Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 hidden xl:flex justify-end gap-6 pr-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-full bg-gradient-to-b from-[#8C5D38] via-[#5A381F] to-[#2B180C] rounded-xs"
              />
            ))}
          </div>

          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#69B82F]/7 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#42B9D9]/7 rounded-full blur-[130px]" />
        </div>

        {/* ========================================================================= */}
        {/* 1. LAYER 1: STAGE 0 HERO INTRO TEXT (Positioned cleanly at the top)       */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : heroTextOpacity,
            y: reducedMotion ? 0 : heroTextY,
            pointerEvents: activeStage === 0 ? 'auto' : 'none',
          }}
          className="absolute top-0 inset-x-0 z-20 flex flex-col items-center pt-5 sm:pt-7 md:pt-8 px-4 text-center max-w-3xl mx-auto"
        >
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B3A1A]/90 border border-[#1E5C33] text-[#69B82F] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-2 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#69B82F] animate-pulse shadow-[0_0_8px_#69B82F]" />
            V2.4 BIO-REACTIVE AIR PURIFIER
          </div>

          {/* Main Brand Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#FAF8F2] uppercase font-sans leading-none drop-shadow-md">
            BIOPOD
          </h1>

          {/* Tagline */}
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FAF8F2] via-[#E8F5E6] to-[#69B82F]">
            Breathe Better. Think Sharper.
          </p>

          {/* Subtext */}
          <p className="mt-2 max-w-xl text-sm sm:text-base md:text-lg text-[#A6B8AC] font-sans font-normal leading-relaxed">
            Living microalgae carbon sequestration combined with medical-grade True HEPA H13 filtration.
          </p>

          {/* Scroll Down Prompt */}
          <button
            onClick={scrollToSim}
            className="mt-3.5 inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold text-[#A8DDA2] hover:text-[#FAF8F2] bg-[#0A140E]/85 hover:bg-[#112417] px-4 sm:px-5 py-1.5 rounded-full border border-[#1E3F27] transition-all cursor-pointer shadow-md backdrop-blur-sm group"
          >
            <ChevronDown className="w-4 h-4 text-[#69B82F] group-hover:translate-y-0.5 transition-transform" />
            <span>Scroll down to inspect architecture</span>
          </button>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. LAYER 2: FEATURE 1 — LIVING ALGAE CARBON CAPTURE (Left Column)         */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : algaeOpacity,
            x: reducedMotion ? 0 : algaeX,
            pointerEvents: activeStage === 1 ? 'auto' : 'none',
          }}
          className="absolute left-4 sm:left-8 lg:left-14 xl:left-28 2xl:left-[14%] top-1/2 -translate-y-1/2 z-20 max-w-md xl:max-w-lg"
        >
          <div className="space-y-3.5 bg-[#090F0C]/92 border border-[#1E3F27] p-5 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#69B82F] uppercase tracking-widest font-bold">
              <Leaf className="w-4 h-4 text-[#69B82F]" />
              01 / LIVING ALGAE CARBON CAPTURE
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F2] tracking-tight leading-tight">
                Natural Photosynthesis.
              </h2>
              <p className="text-xs sm:text-sm text-[#69B82F] font-semibold mt-0.5">
                Absorbs indoor CO₂ and generates pure oxygen.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#B0C2B5] font-sans leading-relaxed">
              Standard purifiers only catch dust, leaving stale <strong className="text-[#FAF8F2]">CO₂</strong> to cause fatigue and brain fog. BioPod uses living <em className="text-[#69B82F] font-medium">Chlorella vulgaris</em> algae in dual photobioreactors to naturally absorb carbon dioxide and continuously synthesize fresh <strong className="text-[#69B82F]">O₂</strong> for your workspace.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
              <div className="bg-[#050A07] p-3 rounded-xl border border-[#1B3523]">
                <span className="text-[#8C9A8F] block text-[10px]">CO₂ DRAWDOWN</span>
                <strong className="text-sm sm:text-base font-bold text-[#69B82F]">-350 ppm/hr</strong>
              </div>
              <div className="bg-[#050A07] p-3 rounded-xl border border-[#1B3523]">
                <span className="text-[#8C9A8F] block text-[10px]">OXYGEN OUTPUT</span>
                <strong className="text-sm sm:text-base font-bold text-[#69B82F]">+42 L pure O₂</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. LAYER 3: FEATURE 2 — TRUE HEPA H13 FILTRATION (Right Column)           */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : hepaOpacity,
            x: reducedMotion ? 0 : hepaX,
            pointerEvents: activeStage === 2 ? 'auto' : 'none',
          }}
          className="absolute right-4 sm:right-8 lg:left-auto lg:right-14 xl:right-28 2xl:right-[14%] top-1/2 -translate-y-1/2 z-20 max-w-md xl:max-w-lg"
        >
          <div className="space-y-3.5 bg-[#070D12]/92 border border-[#173847] p-5 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#42B9D9] uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4 text-[#42B9D9]" />
              02 / TRUE HEPA H13 FILTRATION
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F2] tracking-tight leading-tight">
                Hospital-Grade Clean Air.
              </h2>
              <p className="text-xs sm:text-sm text-[#42B9D9] font-semibold mt-0.5">
                Eliminates 99.97% of dust, allergens, and airborne particles.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A5BFCD] font-sans leading-relaxed">
              While the algae targets indoor gases, our dense medical-grade HEPA H13 filter traps microscopic allergens, PM2.5 smoke particles, pet dander, and respiratory droplets down to 0.1 microns—delivering clean, whisper-quiet airflow without harmful ozone.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
              <div className="bg-[#04080B] p-3 rounded-xl border border-[#132E3B]">
                <span className="text-[#8C9A8F] block text-[10px]">AEROSOL CAPTURE</span>
                <strong className="text-sm sm:text-base font-bold text-[#42B9D9]">99.97% @ 0.1µm</strong>
              </div>
              <div className="bg-[#04080B] p-3 rounded-xl border border-[#132E3B]">
                <span className="text-[#8C9A8F] block text-[10px]">CLEAN AIR DELIVERY</span>
                <strong className="text-sm sm:text-base font-bold text-[#42B9D9]">3.6 m³/min CADR</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#7C9AA8] pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#42B9D9]" />
              <span>Multi-mesh Pre-filter + True HEPA H13 Matrix</span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 4. LAYER 4: FEATURE 3 — SMART AUTO-PILOT CONTROL (Lower Third Dock)      */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : iotOpacity,
            y: reducedMotion ? 0 : iotY,
            pointerEvents: activeStage === 3 ? 'auto' : 'none',
          }}
          className="absolute inset-x-4 sm:inset-x-8 bottom-6 z-20 max-w-4xl mx-auto"
        >
          <div className="bg-[#090F0C]/92 border border-[#1E3F27] p-4.5 sm:p-5.5 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E4B83D] uppercase tracking-widest font-bold">
                <Cpu className="w-4 h-4 text-[#E4B83D]" />
                03 / INTELLIGENT AUTO-PILOT
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#FAF8F2] tracking-tight">
                Self-Adjusting Smart Purifier
              </h3>
              <p className="text-xs sm:text-sm text-[#A0B2A5] leading-relaxed">
                Precision optical laser sensors track dust and CO₂ every second. The onboard computer automatically adjusts fan speed and LED lighting so your air stays clean without touching a button.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-center">
              <div className="bg-[#050806] px-3.5 py-2 rounded-xl border border-[#1E2B21]">
                <span className="text-[9px] text-[#8C9A8F] block">LIVE AQI</span>
                <span className="text-lg font-bold text-[#69B82F]">{aqiData.aqi}</span>
              </div>
              <div className="bg-[#050806] px-3.5 py-2 rounded-xl border border-[#1E2B21]">
                <span className="text-[9px] text-[#8C9A8F] block">ROOM CO₂</span>
                <span className="text-lg font-bold text-[#69B82F]">{currentPoint.roomCo2} <span className="text-[10px]">ppm</span></span>
              </div>
              <div className="bg-[#050806] px-3.5 py-2 rounded-xl border border-[#1E2B21]">
                <span className="text-[9px] text-[#8C9A8F] block">O₂ PURITY</span>
                <span className="text-lg font-bold text-[#42B9D9]">{currentPoint.roomO2Pct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 5. LAYER 5: FINALE & INTERACTIVE CTA (Center Overlay)                     */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : ctaOpacity,
            y: reducedMotion ? 0 : ctaY,
            pointerEvents: activeStage === 4 ? 'auto' : 'none',
          }}
          className="absolute inset-x-4 bottom-8 z-20 max-w-2xl mx-auto text-center"
        >
          <div className="bg-[#080E0A]/95 border border-[#1E3F27] p-5 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-2xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#FAF8F2] tracking-tight">
                Experience BioPod in Action
              </h3>
              <p className="text-xs sm:text-sm text-[#A0B2A5] max-w-lg mx-auto mt-1">
                Run live multi-occupant simulations, adjust fan speeds, and test microalgae carbon reduction in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 font-mono text-xs">
              <button
                id="hero-scroll-run-simulation-btn"
                onClick={scrollToSim}
                className="px-6 py-3 rounded-xl bg-[#69B82F] hover:bg-[#58A025] text-[#060A07] font-extrabold tracking-wider uppercase transition-all shadow-lg hover:shadow-green-900/40 flex items-center gap-2 cursor-pointer scale-100 hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Sliders className="w-4 h-4" />
                <span>Run Simulation</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                id="hero-scroll-principles-btn"
                onClick={onOpenPrinciples}
                className="px-4 py-3 rounded-xl bg-[#121A15] hover:bg-[#1B2920] border border-[#253D2C] text-[#FAF8F2] font-bold transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <Layers className="w-4 h-4 text-[#69B82F]" />
                <span>Principles & Science</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 6. CENTERPINNED 3D HARDWARE CONTAINER (The Visual Hero)                  */}
        {/* ========================================================================= */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none z-10 px-4 sm:px-8">
          <motion.div
            style={{
              x: reducedMotion ? '0%' : hardwareX,
              y: reducedMotion ? '155px' : hardwareY,
              scale: reducedMotion ? 0.98 : hardwareScale,
              rotateY: reducedMotion ? 0 : hardwareRotateY,
              rotateX: reducedMotion ? 0 : hardwareRotateX,
              transformPerspective: 1200,
            }}
            className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl pointer-events-auto transition-shadow duration-500"
          >
            {/* PHYSICAL DEVICE HOUSING CONTAINER */}
            <div
              className={`w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1A221E] via-[#121814] to-[#0A0E0B] border-2 p-3.5 sm:p-5 shadow-2xl relative overflow-hidden transition-all duration-700 ${
                activeStage === 1
                  ? 'border-[#69B82F]/70 shadow-[0_0_40px_rgba(105,184,47,0.25)]'
                  : activeStage === 2
                  ? 'border-[#42B9D9]/70 shadow-[0_0_40px_rgba(66,185,217,0.25)]'
                  : activeStage === 3
                  ? 'border-[#E4B83D]/70 shadow-[0_0_40px_rgba(228,184,61,0.2)]'
                  : 'border-[#2F3C33] shadow-[0_25px_60px_rgba(0,0,0,0.88)]'
              }`}
            >
              {/* Metallic Bevel Top Glint */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#69B82F]/60 to-transparent" />

              {/* ---------------- 1. TOP VENTILATION & SENSOR HOUSING ---------------- */}
              <div className="bg-[#101612] rounded-xl border border-[#26332A] p-2.5 mb-3 flex items-center justify-between shadow-inner">
                {/* Left Fan Port */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#080B09] border border-[#2B3B30] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div 
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-[#42B9D9]/80"
                      style={{ animation: `spin-fan ${fanRotationDuration} linear infinite` }}
                    />
                    <div className="absolute w-2 h-2 rounded-full bg-[#1F2A23]" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#8C9A8F] hidden sm:inline font-bold">
                    INTAKE A
                  </span>
                </div>

                {/* Center Touch Display */}
                <div className="px-3.5 py-2 rounded-lg bg-[#060907] border border-[#1E2B21] flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-mono font-black text-[#69B82F] tracking-wider">
                      BioPod
                    </span>
                    <span className="text-xs text-[#A8DDA2]/80 font-mono hidden sm:inline">
                      Pure by Nature • Smart by Design
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5 text-[#69B82F] text-xs font-mono font-bold">
                    <span>💨 {effectiveFanSpeed}%</span>
                    <span>•</span>
                    <span>🌿 Bio-Mode</span>
                    <span>•</span>
                    <span>💡 {controls.ledIntensity}%</span>
                  </div>
                </div>

                {/* Right Fan Port */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono text-[#8C9A8F] hidden sm:inline font-bold">
                    INTAKE B
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#080B09] border border-[#2B3B30] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div 
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-[#42B9D9]/80"
                      style={{ animation: `spin-fan ${fanRotationDuration} linear infinite` }}
                    />
                    <div className="absolute w-2 h-2 rounded-full bg-[#1F2A23]" />
                  </div>
                </div>
              </div>

              {/* ---------------- 2. CENTER CHAMBERS (PRE-FILTER + HEPA + DUAL ALGAE BIOREACTORS) ---------------- */}
              <div className="relative bg-[#060907] rounded-xl sm:rounded-2xl border border-[#1E2B21] p-3 sm:p-3.5 grid grid-cols-12 gap-3 items-center min-h-[250px] sm:min-h-[275px] overflow-hidden">
                
                {/* 1. Pre-Filter Grid */}
                <div className="col-span-3 flex flex-col items-center justify-center h-full space-y-1.5">
                  <div className="text-xs sm:text-sm font-mono text-[#A8DDA2] uppercase text-center font-bold tracking-wider">
                    1. PRE-FILTER
                  </div>
                  <div className="w-full h-40 sm:h-44 rounded-xl bg-[#141A16] border border-[#2B3B30] p-2 flex flex-col justify-between items-center relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#8C9A8F_1px,transparent_1px)] [background-size:5px_5px]" />
                    <span className="text-[11px] sm:text-xs font-mono text-[#A0B0A5] z-10 font-semibold">Mesh Grid</span>
                    <div className="z-10 text-center">
                      <span className="text-sm sm:text-base font-mono text-[#E4B83D] block font-black tracking-wide">COARSE</span>
                      <span className="text-[11px] sm:text-xs text-[#A0B0A5] font-mono font-medium">&gt;10µm Dust</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono text-[#69B82F] z-10 font-bold">94% Active</span>
                  </div>
                </div>

                {/* 2. HEPA H13 Core */}
                <div
                  className={`col-span-4 flex flex-col items-center justify-center h-full space-y-1.5 relative rounded-xl p-0.5 transition-all duration-500 ${
                    activeStage === 2 ? 'ring-2 ring-[#42B9D9] bg-[#42B9D9]/10' : ''
                  }`}
                >
                  <div className="text-xs sm:text-sm font-mono text-[#42B9D9] uppercase text-center font-bold flex items-center gap-1.5 tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2. HEPA H13
                  </div>

                  <div className="w-full h-40 sm:h-44 rounded-xl bg-[#0C1E26] border-2 border-[#1E5669] p-2 flex flex-col justify-between items-center relative overflow-hidden shadow-lg">
                    {/* Vertical pleat lines */}
                    <div className="absolute inset-0 opacity-70 flex justify-around">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-[1.5px] h-full bg-gradient-to-b from-[#FAF8F2]/90 via-[#42B9D9]/80 to-[#FAF8F2]/90 shadow-xs"
                        />
                      ))}
                    </div>

                    {/* HORIZONTAL LUMINOUS CYAN AIRFLOW BEAMS */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-3">
                      <div className="w-full h-3 bg-gradient-to-r from-[#42B9D9]/20 via-[#42B9D9]/90 to-[#69B82F]/70 blur-xs animate-pulse" />
                      <div className="w-full h-3.5 bg-gradient-to-r from-[#42B9D9]/30 via-[#42B9D9] to-[#69B82F]/90 blur-xs" />
                      <div className="w-full h-3 bg-gradient-to-r from-[#42B9D9]/20 via-[#42B9D9]/90 to-[#69B82F]/70 blur-xs animate-pulse" />
                    </div>

                    <span className="text-xs sm:text-sm font-mono text-[#42B9D9] font-black z-10 bg-[#06141A]/90 px-2 py-1 rounded tracking-wide shadow-sm">
                      99.97% Capture
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-[#FAF8F2] z-10 bg-[#06141A]/95 px-2 py-1 rounded font-black tracking-wide shadow-sm">
                      Aerosol Trapped
                    </span>
                  </div>
                </div>

                {/* 3. Dual Algae Photobioreactors */}
                <div
                  className={`col-span-5 flex flex-col items-center justify-center h-full space-y-1.5 rounded-xl p-0.5 transition-all duration-500 ${
                    activeStage === 1 ? 'ring-2 ring-[#69B82F] bg-[#69B82F]/10' : ''
                  }`}
                >
                  <div className="text-xs sm:text-sm font-mono text-[#69B82F] uppercase text-center font-bold flex items-center gap-1.5 tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#69B82F]" /> 3. DUAL BIOREACTORS
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full">
                    {/* Tank 01 */}
                    <div
                      id="scroll-hero-cylinder-01"
                      onClick={() => onSelectTank('01')}
                      title="Chamber 01"
                      className="h-40 sm:h-44 rounded-xl bg-gradient-to-b from-[#092B15] via-[#0E3D1E] to-[#061F0E] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all p-2 flex flex-col justify-between items-center relative overflow-hidden cursor-pointer group shadow-lg"
                      style={{
                        boxShadow: `0 0 22px rgba(105, 184, 47, ${Math.max(0.3, ledGlow * 0.55)})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#69B82F]/35 via-transparent to-[#69B82F]/20 animate-pulse" />

                      {controls.airPump && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-around">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bubble-slow" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble-fast" style={{ animationDelay: '0.3s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/95 animate-bubble-slow" style={{ animationDelay: '0.6s' }} />
                        </div>
                      )}

                      <span className="text-[11px] sm:text-xs font-mono text-[#A8DDA2] font-extrabold z-10 tracking-wider">
                        TANK 01
                      </span>
                      <div className="z-10 text-center">
                        <span className="text-base sm:text-xl font-mono font-black text-white block tracking-tight">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-xs sm:text-[13px] font-mono text-[#C4E8BE] font-bold">
                          Chlorella
                        </span>
                      </div>
                    </div>

                    {/* Tank 02 */}
                    <div
                      id="scroll-hero-cylinder-02"
                      onClick={() => onSelectTank('02')}
                      title="Chamber 02"
                      className="h-40 sm:h-44 rounded-xl bg-gradient-to-b from-[#092B15] via-[#0E3D1E] to-[#061F0E] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all p-2 flex flex-col justify-between items-center relative overflow-hidden cursor-pointer group shadow-lg"
                      style={{
                        boxShadow: `0 0 22px rgba(105, 184, 47, ${Math.max(0.3, ledGlow * 0.55)})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#69B82F]/35 via-transparent to-[#69B82F]/20 animate-pulse" />

                      {controls.airPump && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-around">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble-fast" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bubble-slow" style={{ animationDelay: '0.5s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/95 animate-bubble-fast" style={{ animationDelay: '0.8s' }} />
                        </div>
                      )}

                      <span className="text-[11px] sm:text-xs font-mono text-[#A8DDA2] font-extrabold z-10 tracking-wider">
                        TANK 02
                      </span>
                      <div className="z-10 text-center">
                        <span className="text-base sm:text-xl font-mono font-black text-white block tracking-tight">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-xs sm:text-[13px] font-mono text-[#C4E8BE] font-bold">
                          Hydrogel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- 3. BOTTOM OLED TELEMETRY SCREEN & POWER BUTTON ---------------- */}
              <div
                className={`mt-3 bg-[#050806] rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3.5 grid grid-cols-5 gap-2 items-center font-mono shadow-inner transition-colors duration-500 ${
                  activeStage === 3 ? 'border-[#E4B83D]' : 'border-[#1E2B21]'
                }`}
              >
                {/* Telemetry 1: AQI */}
                <div className="text-center">
                  <span className="text-[11px] sm:text-xs text-[#8C9A8F] block font-bold">AQI</span>
                  <strong className="text-base sm:text-2xl font-black text-[#69B82F] block leading-tight">
                    {aqiData.aqi}
                  </strong>
                  <span className="text-[9px] sm:text-[11px] text-[#A8DDA2] block uppercase font-bold">
                    {aqiData.label}
                  </span>
                </div>

                {/* Telemetry 2: CO2 */}
                <div className="text-center">
                  <span className="text-[11px] sm:text-xs text-[#8C9A8F] block font-bold">CO₂</span>
                  <strong className="text-base sm:text-2xl font-black text-[#69B82F] block leading-tight">
                    {currentPoint.roomCo2}
                  </strong>
                  <span className="text-[10px] sm:text-xs text-[#8C9A8F] block font-semibold">
                    ppm
                  </span>
                </div>

                {/* Telemetry 3: TEMP */}
                <div className="text-center">
                  <span className="text-[11px] sm:text-xs text-[#8C9A8F] block font-bold">TEMP</span>
                  <strong className="text-base sm:text-2xl font-black text-[#69B82F] block leading-tight">
                    {room.temperature.toFixed(1)}
                  </strong>
                  <span className="text-[10px] sm:text-xs text-[#8C9A8F] block font-semibold">
                    °C
                  </span>
                </div>

                {/* Telemetry 4: HUMIDITY */}
                <div className="text-center">
                  <span className="text-[11px] sm:text-xs text-[#8C9A8F] block font-bold">HUMIDITY</span>
                  <strong className="text-base sm:text-2xl font-black text-[#69B82F] block leading-tight">
                    {room.humidity}
                  </strong>
                  <span className="text-[10px] sm:text-xs text-[#8C9A8F] block font-semibold">
                    %
                  </span>
                </div>

                {/* Telemetry 5: Capacitive Power Button */}
                <div className="flex justify-center items-center">
                  <button
                    id="scroll-hero-power-btn"
                    onClick={onTogglePower}
                    title={isSimulating ? 'Pause Hardware Simulation' : 'Power / Run Hardware Simulation'}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isSimulating
                        ? 'bg-[#0B3A1A] border-[#69B82F] text-[#69B82F] shadow-green-900/50 scale-105'
                        : 'bg-[#121914] border-[#2C3E31] text-[#69B82F] hover:border-[#69B82F]'
                    }`}
                  >
                    <Power className="w-4 h-4 animate-pulse" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom subtle indicator dots */}
        <div className="relative z-30 pb-3 flex items-center gap-2 font-mono text-[9px] text-[#8C9A8F]">
          <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeStage === 0 ? 'bg-[#69B82F] scale-125' : 'bg-[#1E3F27]'}`} />
          <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeStage === 1 ? 'bg-[#69B82F] scale-125' : 'bg-[#1E3F27]'}`} />
          <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeStage === 2 ? 'bg-[#42B9D9] scale-125' : 'bg-[#1E3F27]'}`} />
          <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeStage === 3 ? 'bg-[#E4B83D] scale-125' : 'bg-[#1E3F27]'}`} />
          <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeStage === 4 ? 'bg-[#69B82F] scale-125' : 'bg-[#1E3F27]'}`} />
        </div>

      </div>
    </div>
  );
};
