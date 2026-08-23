import React, { useState } from 'react';
import { 
  Leaf, 
  Sparkles, 
  Wind, 
  Cpu, 
  ShieldCheck, 
  Power, 
  Layers,
  ChevronRight,
  Maximize2,
  Activity,
  Flame,
  Droplets,
  Thermometer
} from 'lucide-react';
import { BioPodControls, RoomConditions, SimulationDataPoint } from '../types';
import { calculatePM25AQI } from '../utils/simulationEngine';

interface BioPodHeroSectionProps {
  room: RoomConditions;
  controls: BioPodControls;
  currentPoint: SimulationDataPoint;
  isSimulating: boolean;
  onTogglePower: () => void;
  onSelectTank: (tankId: '01' | '02') => void;
  onRunSimulation?: () => void;
}

export const BioPodHeroSection: React.FC<BioPodHeroSectionProps> = ({
  room,
  controls,
  currentPoint,
  isSimulating,
  onTogglePower,
  onSelectTank,
  onRunSimulation,
}) => {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  // Dynamic values
  const effectiveFanSpeed = controls.mode === 'ECO' ? 35 : controls.fanSpeed;
  const fanRotationDuration = `${Math.max(0.25, (100 - effectiveFanSpeed) / 75 + 0.3)}s`;
  const ledGlow = (controls.ledIntensity / 100);
  const aqiData = calculatePM25AQI(currentPoint.roomPm25);

  return (
    <section 
      id="biopod-modern-hero"
      className="relative w-full overflow-hidden rounded-2xl border-2 border-[#242A26] bg-[#0E1210] shadow-2xl text-[#FAF8F2]"
    >
      {/* ================= BACKGROUND AMBIENCE (Warm Modern Architectural Room + Dark Wood Table + Botanical Silhouettes) ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm wooden countertop gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#26170E] via-[#1A1009]/80 to-transparent opacity-90"></div>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-[#3B2414] border-t border-[#5C3A20]/60 opacity-95"></div>

        {/* Vertical Acoustic Wooden Wall Slats (Right Side Background) */}
        <div className="absolute top-0 right-0 w-2/5 h-full opacity-25 flex justify-end gap-3.5 pr-6">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-2.5 h-full bg-gradient-to-b from-[#8C5D38] via-[#5A381F] to-[#2B180C] rounded-sm shadow-sm"></div>
          ))}
        </div>

        {/* Warm Ambient Architectural Golden Lighting in background */}
        <div className="absolute -top-24 -left-12 w-96 h-96 bg-[#E4B83D]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#69B82F]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#42B9D9]/10 rounded-full blur-3xl"></div>

        {/* Soft Botanical Indoor Plant Foliage Silhouette (Left and Right Accents) */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#0B2E17]/40 rounded-full blur-2xl"></div>
        <div className="absolute top-12 -right-8 w-72 h-72 bg-[#092412]/50 rounded-full blur-2xl"></div>
      </div>

      {/* ================= HERO CONTENT WRAPPER ================= */}
      <div className="relative z-10 w-full p-6 sm:p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: BIOPOD TITLE & FEATURE LIST ================= */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            {/* Top Brand Pill */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0B4D20] text-[#69B82F] text-xs font-mono font-bold tracking-widest uppercase border border-[#1E5C33] flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#69B82F] animate-pulse"></span>
                V2.4 IOT PHOTOBIOREACTOR
              </span>
              <span className="text-xs font-mono text-[#8C9A8F]">
                PATENT PENDING
              </span>
            </div>

            {/* Main Brand Title & Tagline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FAF8F2] flex items-center gap-3">
                BIOPOD
              </h1>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF8F2]">
                Breathe Better.{' '}
                <span className="text-[#69B82F] block sm:inline">
                  Think Sharper.
                </span>
              </div>
              <div className="w-16 h-1 bg-[#69B82F] rounded-full mt-3"></div>
            </div>

            {/* Core 4 Feature Bullets (Exact Match to Reference Image) */}
            <div className="space-y-4 pt-2">
              {/* Feature 1: Biological CO2 Capture */}
              <div 
                onMouseEnter={() => setActiveHover('algae')}
                onMouseLeave={() => setActiveHover(null)}
                className={`flex items-start gap-3.5 p-2 rounded-xl transition-all ${
                  activeHover === 'algae' ? 'bg-[#152319] translate-x-1.5' : 'hover:bg-[#152319]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#0B3A1A] border border-[#1E5C33] flex items-center justify-center text-[#69B82F] shrink-0 shadow-inner">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FAF8F2] leading-tight">
                    Biological CO₂ Capture
                  </h4>
                  <p className="text-xs text-[#9DAFA2] mt-0.5 font-sans">
                    Powered by living microalgae (<em className="text-[#A8DDA2]">Chlorella vulgaris</em>) fixing carbon & emitting pure O₂.
                  </p>
                </div>
              </div>

              {/* Feature 2: HEPA Filtration */}
              <div 
                onMouseEnter={() => setActiveHover('hepa')}
                onMouseLeave={() => setActiveHover(null)}
                className={`flex items-start gap-3.5 p-2 rounded-xl transition-all ${
                  activeHover === 'hepa' ? 'bg-[#122329] translate-x-1.5' : 'hover:bg-[#122329]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#0F2D38] border border-[#1E5669] flex items-center justify-center text-[#42B9D9] shrink-0 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FAF8F2] leading-tight">
                    HEPA Filtration
                  </h4>
                  <p className="text-xs text-[#9DAFA2] mt-0.5 font-sans">
                    Captures 99.97% of fine aerosols, PM2.5 particulates, allergens, and pollen.
                  </p>
                </div>
              </div>

              {/* Feature 3: Clean Air Out */}
              <div 
                onMouseEnter={() => setActiveHover('airflow')}
                onMouseLeave={() => setActiveHover(null)}
                className={`flex items-start gap-3.5 p-2 rounded-xl transition-all ${
                  activeHover === 'airflow' ? 'bg-[#152319] translate-x-1.5' : 'hover:bg-[#152319]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#0B3A1A] border border-[#1E5C33] flex items-center justify-center text-[#69B82F] shrink-0 shadow-inner">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FAF8F2] leading-tight">
                    Clean Air Out
                  </h4>
                  <p className="text-xs text-[#9DAFA2] mt-0.5 font-sans">
                    Enriched oxygen stream restoring peak cognitive performance and deep focus.
                  </p>
                </div>
              </div>

              {/* Feature 4: Smart & Adaptive */}
              <div 
                onMouseEnter={() => setActiveHover('esp32')}
                onMouseLeave={() => setActiveHover(null)}
                className={`flex items-start gap-3.5 p-2 rounded-xl transition-all ${
                  activeHover === 'esp32' ? 'bg-[#222115] translate-x-1.5' : 'hover:bg-[#222115]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#3A3312] border border-[#6B5D21] flex items-center justify-center text-[#E4B83D] shrink-0 shadow-inner">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#FAF8F2] leading-tight">
                    Smart & Adaptive
                  </h4>
                  <p className="text-xs text-[#9DAFA2] mt-0.5 font-sans">
                    ESP32-powered dual-loop PID algorithm automating fan speeds and LED illumination.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {onRunSimulation && (
                <button
                  id="hero-start-sim-btn"
                  onClick={onRunSimulation}
                  className="px-5 py-2.5 rounded-xl bg-[#69B82F] hover:bg-[#78CB36] text-[#060D09] font-mono font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-green-900/40 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>RUN LIVE EMULATION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                id="hero-toggle-power-btn"
                onClick={onTogglePower}
                className="px-4 py-2.5 rounded-xl bg-[#171E19] hover:bg-[#222C25] border border-[#2B3B2F] text-[#FAF8F2] font-mono font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Power className={`w-3.5 h-3.5 ${isSimulating ? 'text-[#69B82F]' : 'text-[#8C9A8F]'}`} />
                <span>{isSimulating ? 'PAUSE SYSTEM' : 'START SYSTEM'}</span>
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PHOTOREALISTIC HARDWARE RENDERING ================= */}
          <div className="lg:col-span-7 flex justify-center items-center">
            
            {/* PHYSICAL DEVICE HOUSING CONTAINER */}
            <div className="w-full max-w-2xl xl:max-w-3xl rounded-2xl bg-gradient-to-b from-[#1C221E] to-[#0A0E0B] border-2 border-[#2F3C33] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              
              {/* Outer Metallic Bevel Glint */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#69B82F]/40 to-transparent"></div>

              {/* ---------------- 1. TOP VENTILATION & SENSOR HOUSING ---------------- */}
              <div className="bg-[#121714] rounded-xl border border-[#26332A] p-2 sm:p-3 mb-3 flex items-center justify-between shadow-inner">
                {/* Left Fan Port */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#080B09] border border-[#2B3B30] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-dashed border-[#42B9D9]/80"
                      style={{ animation: `spin-fan ${fanRotationDuration} linear infinite` }}
                    ></div>
                    <div className="absolute w-2 h-2 rounded-full bg-[#1F2A23]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C9A8F] hidden sm:inline">
                    INTAKE A
                  </span>
                </div>

                {/* Center Glossy Touch Screen with Brand Badge */}
                <div className="px-4 py-1.5 rounded-lg bg-[#060907] border border-[#1E2B21] flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#69B82F] tracking-wider">
                      BioPod
                    </span>
                    <span className="text-[9px] text-[#A8DDA2]/60 font-mono">
                      Pure by Nature • Smart by Design
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[#69B82F] text-[10px]">
                    <span>💨 {effectiveFanSpeed}%</span>
                    <span>•</span>
                    <span>🌿 Bio-Mode</span>
                    <span>•</span>
                    <span>💡 {controls.ledIntensity}%</span>
                  </div>
                </div>

                {/* Right Fan Port */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#8C9A8F] hidden sm:inline">
                    INTAKE B
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#080B09] border border-[#2B3B30] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-dashed border-[#42B9D9]/80"
                      style={{ animation: `spin-fan ${fanRotationDuration} linear infinite` }}
                    ></div>
                    <div className="absolute w-2 h-2 rounded-full bg-[#1F2A23]"></div>
                  </div>
                </div>
              </div>

              {/* ---------------- 2. CENTER CHAMBERS (PRE-FILTER + HEPA + LUMINOUS BLUE AIR RAYS + DUAL ALGAE CYLINDERS) ---------------- */}
              <div className="relative bg-[#060907] rounded-xl border border-[#1E2B21] p-3.5 sm:p-4 grid grid-cols-12 gap-3 items-center min-h-[280px] overflow-hidden">
                
                {/* Visual Air Intake & Pre-Filter (Left 3 cols) */}
                <div className="col-span-3 flex flex-col items-center justify-center h-full space-y-2">
                  <div className="text-[9px] font-mono text-[#A8DDA2] uppercase text-center font-semibold">
                    1. PRE-FILTER
                  </div>
                  <div className="w-full h-44 rounded-lg bg-[#141A16] border border-[#2B3B30] p-1.5 flex flex-col justify-between items-center relative overflow-hidden shadow-inner">
                    {/* Mesh texture */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#8C9A8F_1px,transparent_1px)] [background-size:6px_6px]"></div>
                    <span className="text-[8px] font-mono text-[#8C9A8F] z-10">Mesh Grid</span>
                    <div className="z-10 text-center">
                      <span className="text-[9px] font-mono text-[#E4B83D] block font-bold">COARSE</span>
                      <span className="text-[8px] text-[#8C9A8F]">&gt;10µm Dust</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#69B82F] z-10">94% Active</span>
                  </div>
                </div>

                {/* HEPA Filter Pleats with Clean Air Laminar Flow Stream (Center 4 cols) */}
                <div className="col-span-4 flex flex-col items-center justify-center h-full space-y-2 relative">
                  <div className="text-[9px] font-mono text-[#42B9D9] uppercase text-center font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 2. HEPA H13
                  </div>

                  {/* Pleated Filter Core */}
                  <div className="w-full h-44 rounded-lg bg-[#0C1E26] border-2 border-[#1E5669] p-1.5 flex flex-col justify-between items-center relative overflow-hidden shadow-lg">
                    {/* Vertical pleat lines */}
                    <div className="absolute inset-0 opacity-70 flex justify-around">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-[2px] h-full bg-gradient-to-b from-[#FAF8F2]/90 via-[#42B9D9]/80 to-[#FAF8F2]/90 shadow-sm"></div>
                      ))}
                    </div>

                    {/* HORIZONTAL LUMINOUS CYAN AIRFLOW BEAMS (Exact match to reference image) */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-4">
                      <div className="w-full h-3 bg-gradient-to-r from-[#42B9D9]/20 via-[#42B9D9]/90 to-[#69B82F]/70 blur-xs animate-pulse"></div>
                      <div className="w-full h-4 bg-gradient-to-r from-[#42B9D9]/30 via-[#42B9D9] to-[#69B82F]/90 blur-xs"></div>
                      <div className="w-full h-3 bg-gradient-to-r from-[#42B9D9]/20 via-[#42B9D9]/90 to-[#69B82F]/70 blur-xs animate-pulse"></div>
                    </div>

                    <span className="text-[8px] font-mono text-[#42B9D9] font-bold z-10 bg-[#06141A]/80 px-1 rounded">
                      99.97% Capture
                    </span>
                    <span className="text-[8px] font-mono text-[#FAF8F2] z-10 bg-[#06141A]/90 px-1.5 py-0.5 rounded font-bold">
                      Aerosol Trapped
                    </span>
                  </div>
                </div>

                {/* Dual Algae Photobioreactor Glass Cylinders (Right 5 cols) */}
                <div className="col-span-5 flex flex-col items-center justify-center h-full space-y-2">
                  <div className="text-[9px] font-mono text-[#69B82F] uppercase text-center font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#69B82F]" /> 3. DUAL BIOREACTORS
                  </div>

                  {/* Dual Cylinders Container */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {/* Cylinder 1 */}
                    <div
                      id="hero-cylinder-01"
                      onClick={() => onSelectTank('01')}
                      title="Inspect Chamber 01"
                      className="h-44 rounded-xl bg-gradient-to-b from-[#092B15] via-[#0E3D1E] to-[#061F0E] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all p-1.5 flex flex-col justify-between items-center relative overflow-hidden cursor-pointer group shadow-lg"
                      style={{
                        boxShadow: `0 0 20px rgba(105, 184, 47, ${ledGlow * 0.45})`,
                      }}
                    >
                      {/* Fluid glow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#69B82F]/30 via-transparent to-[#69B82F]/20 animate-pulse"></div>

                      {/* Rising fine bubbles */}
                      {controls.airPump && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-around">
                          <div className="w-1 h-1 rounded-full bg-white/90 animate-bubble-slow"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble-fast" style={{ animationDelay: '0.3s' }}></div>
                          <div className="w-1 h-1 rounded-full bg-white/95 animate-bubble-slow" style={{ animationDelay: '0.6s' }}></div>
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-[#A8DDA2] font-bold z-10">
                        TANK 01
                      </span>
                      <div className="z-10 text-center">
                        <span className="text-xs font-mono font-extrabold text-white block">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-[7px] font-mono text-[#A8DDA2]/80">
                          Chlorella
                        </span>
                      </div>
                      <span className="text-[7px] font-mono text-[#69B82F] z-10 group-hover:underline">
                        Inspect ↗
                      </span>
                    </div>

                    {/* Cylinder 2 */}
                    <div
                      id="hero-cylinder-02"
                      onClick={() => onSelectTank('02')}
                      title="Inspect Chamber 02"
                      className="h-44 rounded-xl bg-gradient-to-b from-[#092B15] via-[#0E3D1E] to-[#061F0E] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all p-1.5 flex flex-col justify-between items-center relative overflow-hidden cursor-pointer group shadow-lg"
                      style={{
                        boxShadow: `0 0 20px rgba(105, 184, 47, ${ledGlow * 0.45})`,
                      }}
                    >
                      {/* Fluid glow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#69B82F]/30 via-transparent to-[#69B82F]/20 animate-pulse"></div>

                      {/* Rising fine bubbles */}
                      {controls.airPump && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-around">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble-fast" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-1 rounded-full bg-white/90 animate-bubble-slow" style={{ animationDelay: '0.5s' }}></div>
                          <div className="w-1 h-1 rounded-full bg-white/95 animate-bubble-fast" style={{ animationDelay: '0.8s' }}></div>
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-[#A8DDA2] font-bold z-10">
                        TANK 02
                      </span>
                      <div className="z-10 text-center">
                        <span className="text-xs font-mono font-extrabold text-white block">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-[7px] font-mono text-[#A8DDA2]/80">
                          Hydrogel
                        </span>
                      </div>
                      <span className="text-[7px] font-mono text-[#69B82F] z-10 group-hover:underline">
                        Inspect ↗
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- 3. BOTTOM OLED TELEMETRY SCREEN & POWER BUTTON ---------------- */}
              <div className="mt-3 bg-[#050806] rounded-xl border-2 border-[#1E2B21] p-3 sm:p-4 grid grid-cols-5 gap-2 items-center font-mono shadow-inner">
                {/* Telemetry 1: AQI */}
                <div className="text-center">
                  <span className="text-[9px] text-[#8C9A8F] block">AQI</span>
                  <strong className="text-base sm:text-xl font-black text-[#69B82F] block leading-tight">
                    {aqiData.aqi}
                  </strong>
                  <span className="text-[9px] text-[#A8DDA2]/80 block uppercase">
                    {aqiData.label}
                  </span>
                </div>

                {/* Telemetry 2: CO2 */}
                <div className="text-center">
                  <span className="text-[9px] text-[#8C9A8F] block">CO₂</span>
                  <strong className="text-base sm:text-xl font-black text-[#69B82F] block leading-tight">
                    {currentPoint.roomCo2}
                  </strong>
                  <span className="text-[9px] text-[#8C9A8F] block">
                    ppm
                  </span>
                </div>

                {/* Telemetry 3: TEMP */}
                <div className="text-center">
                  <span className="text-[9px] text-[#8C9A8F] block">TEMP</span>
                  <strong className="text-base sm:text-xl font-black text-[#69B82F] block leading-tight">
                    {room.temperature.toFixed(1)}
                  </strong>
                  <span className="text-[9px] text-[#8C9A8F] block">
                    °C
                  </span>
                </div>

                {/* Telemetry 4: HUMIDITY */}
                <div className="text-center">
                  <span className="text-[9px] text-[#8C9A8F] block">HUMIDITY</span>
                  <strong className="text-base sm:text-xl font-black text-[#69B82F] block leading-tight">
                    {room.humidity}
                  </strong>
                  <span className="text-[9px] text-[#8C9A8F] block">
                    %
                  </span>
                </div>

                {/* Telemetry 5: Capacitive Power Button */}
                <div className="flex justify-center items-center">
                  <button
                    id="hero-capacitive-power-btn"
                    onClick={onTogglePower}
                    title={isSimulating ? 'Pause Hardware Simulation' : 'Power / Run Hardware Simulation'}
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isSimulating
                        ? 'bg-[#0B3A1A] border-[#69B82F] text-[#69B82F] shadow-green-900/50 scale-105'
                        : 'bg-[#121914] border-[#2C3E31] text-[#69B82F] hover:border-[#69B82F]'
                    }`}
                  >
                    <Power className="w-5 h-5 animate-pulse" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
