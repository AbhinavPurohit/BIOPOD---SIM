import React, { useState } from 'react';
import { 
  Wind, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Sun, 
  Flame, 
  Droplets,
  Info,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Users,
  Gauge,
  HeartPulse
} from 'lucide-react';
import { BioPodControls, RoomConditions, SimulationDataPoint, TankDetails } from '../types';
import { calculatePM25AQI } from '../utils/simulationEngine';

interface BioPodCoreVisualizerProps {
  room: RoomConditions;
  controls: BioPodControls;
  currentPoint: SimulationDataPoint;
  isSimulating: boolean;
  tempUnit: 'C' | 'F';
  onSelectTank: (tankId: '01' | '02') => void;
}

export const BioPodCoreVisualizer: React.FC<BioPodCoreVisualizerProps> = ({
  room,
  controls,
  currentPoint,
  isSimulating,
  tempUnit,
  onSelectTank,
}) => {
  const [activeHoverComponent, setActiveHoverComponent] = useState<string | null>(null);

  // Dynamic values
  const effectiveFanSpeed = controls.mode === 'ECO' ? 30 : controls.fanSpeed;
  const fanRotationDuration = `${Math.max(0.2, (100 - effectiveFanSpeed) / 80 + 0.25)}s`;
  const ledGlowOpacity = (controls.ledIntensity / 100) * 0.9;
  const bubbleSpeedClass = controls.airPump ? (effectiveFanSpeed > 70 ? 'animate-bubble-fast' : 'animate-bubble-slow') : '';

  const displayInputTemp =
    tempUnit === 'C' ? `${room.temperature}°C` : `${((room.temperature * 9) / 5 + 32).toFixed(1)}°F`;

  const inputAqiData = calculatePM25AQI(room.pm25);
  const numOccupants = room.occupants !== undefined ? room.occupants : 2;

  return (
    <div
      id="biopod-main-visualization-section"
      className="w-full bg-[#0C140F] border border-[#1E3F27] p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full">
        {/* Top Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#69B82F] font-bold">
                PHYSICAL PROTOTYPE ARCHITECTURE
              </h2>
              <span className="h-1.5 w-1.5 rounded-full bg-[#69B82F] animate-pulse"></span>
              <span className="text-[11px] font-mono text-[#A8DDA2]/70">
                MICROALGAE PHOTOBIOREACTOR V2.4
              </span>
            </div>
            <p className="text-sm font-semibold text-[#FAF8F2] mt-0.5">
              Live Airflow Filtration & Biological Carbon Sequestration Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-[#060D09] text-[#FAF8F2] border border-[#1E3F27] px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#69B82F]" />
              Occupants: <strong className="text-[#69B82F]">{numOccupants}</strong>
            </span>
            <span className="text-xs font-mono bg-[#060D09] text-[#FAF8F2] border border-[#1E3F27] px-2.5 py-1 rounded-md">
              Mode: <strong className="text-[#69B82F]">{controls.mode}</strong>
            </span>
            <span className="text-xs font-mono bg-[#060D09] text-[#FAF8F2] border border-[#1E3F27] px-2.5 py-1 rounded-md">
              Throughput: <strong className="text-[#69B82F]">{(0.8 + (controls.fanSpeed / 100) * 3.7).toFixed(1)} m³/min</strong>
            </span>
          </div>
        </div>

        {/* 3-Column Architecture: INPUT AIR | BIOPOD PHYSICAL CORE | BIOLOGICAL LOOP & OUTPUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= LEFT PANEL: INPUT AIR ================= */}
          <div
            id="panel-input-air"
            className="lg:col-span-3 bg-[#080F0A] rounded-xl border border-[#1E3F27] p-4 sm:p-5 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3F27] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C0392B] animate-pulse"></div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-[#FAF8F2] uppercase">
                    INPUT AIR (ROOM)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C9A8F] bg-[#060D09] px-1.5 py-0.5 rounded border border-[#1E3F27]">
                  AMBIENT
                </span>
              </div>

              {/* Input Metric 1: CO2 */}
              <div className="space-y-3 font-mono">
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F] mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAF8F2]">
                      <Flame className="w-3.5 h-3.5 text-[#E67E22]" /> CO₂ CONCENTRATION
                    </span>
                    <span className="text-[9px] text-[#A8DDA2]/70 bg-[#060D09] px-1 py-0.2 rounded">NDIR SENSOR</span>
                  </div>
                  <div className="text-2xl font-bold text-[#FAF8F2] flex items-baseline gap-1">
                    {room.co2} <span className="text-xs font-normal text-[#8C9A8F]">ppm</span>
                  </div>
                  <div className="text-[10px] text-[#E4B83D] mt-0.5 font-sans flex items-center justify-between">
                    <span>{room.co2 > 1000 ? '⚠️ Fatigue threshold' : 'Optimal baseline'}</span>
                    <span className="text-[#8C9A8F] font-mono text-[9px]">{numOccupants} pers. exhaling</span>
                  </div>
                </div>

                {/* Input Metric 2: PM2.5 */}
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F] mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAF8F2]">
                      <Wind className="w-3.5 h-3.5 text-[#42B9D9]" /> PM2.5 PARTICULATE
                    </span>
                    <span className="text-[9px] text-[#42B9D9] bg-[#0E242C] px-1 py-0.2 rounded font-semibold">LASER OPTICAL</span>
                  </div>
                  <div className="text-2xl font-bold text-[#FAF8F2] flex items-baseline gap-1">
                    {room.pm25} <span className="text-xs font-normal text-[#8C9A8F]">µg/m³</span>
                  </div>
                  <div className="text-[10px] text-[#8C9A8F] mt-0.5 font-sans">
                    {room.pm25 > 35 ? 'Hazardous fine aerosol dust' : 'Normal ambient particulate'}
                  </div>
                </div>

                {/* Input Metric 3: AIR QUALITY INDEX (AQI) */}
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F] mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAF8F2]">
                      <Gauge className="w-3.5 h-3.5 text-[#69B82F]" /> AIR INDEX (AQI)
                    </span>
                    <span className="text-[9px] text-[#8C9A8F] bg-[#060D09] px-1 py-0.2 rounded">US EPA</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#FAF8F2]">{inputAqiData.aqi}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: `${inputAqiData.color}20`,
                        color: inputAqiData.color,
                        border: `1px solid ${inputAqiData.color}60`,
                      }}
                    >
                      {inputAqiData.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8C9A8F] mt-0.5 font-sans">
                    {inputAqiData.aqi <= 50 ? 'Optimal Cognitive Range' : 'Filtration Required'}
                  </div>
                </div>

                {/* Input Metric 4: Temp, Humidity & Occupants */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#0C1711] p-2 rounded-lg border border-[#1E3F27]">
                    <span className="text-[9px] text-[#8C9A8F] block mb-0.5">TEMP</span>
                    <span className="text-xs font-bold text-[#FAF8F2]">{displayInputTemp}</span>
                  </div>
                  <div className="bg-[#0C1711] p-2 rounded-lg border border-[#1E3F27]">
                    <span className="text-[9px] text-[#8C9A8F] block mb-0.5">HUMIDITY</span>
                    <span className="text-xs font-bold text-[#FAF8F2]">{room.humidity}%</span>
                  </div>
                  <div className="bg-[#0C1711] p-2 rounded-lg border border-[#1E3F27]">
                    <span className="text-[9px] text-[#8C9A8F] block mb-0.5">PEOPLE</span>
                    <span className="text-xs font-bold text-[#69B82F]">{numOccupants}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inflow Air Particle Animation Indicator */}
            <div className="mt-4 pt-2.5 border-t border-[#1E3F27] text-xs font-mono text-[#8C9A8F] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E67E22] animate-ping"></span>
                Inflow Air Stream
              </span>
              <span className="text-[11px] text-[#69B82F] font-semibold">Active Ingestion →</span>
            </div>
          </div>

          {/* ================= CENTER: BIOPOD CORE CHAMBER ================= */}
          <div
            id="panel-biopod-core"
            className="lg:col-span-6 bg-[#171A18] rounded-xl border-2 border-[#242C26] p-4 sm:p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-md"
          >
            {/* Background subtle technical blueprint grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#69B82F_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Chamber Title & Active Blueprint Status */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#2C362F] mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0B4D20] text-[#69B82F] text-[10px] font-mono font-bold tracking-widest border border-[#0F602B]">
                  BIOPOD HARDWARE CORE
                </span>
                <span className="text-xs font-mono text-[#8C9A8F]">SERIAL #BP-2026-X9</span>
              </div>
              <div className="text-[11px] font-mono text-[#69B82F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#69B82F] animate-pulse"></span>
                LIVING ALGAE PURIFIER
              </div>
            </div>

            {/* Schematic Flow: Intake -> Fan -> PreFilter -> HEPA -> Split Dual Algae Tanks -> Output */}
            <div className="relative z-10 flex flex-col items-center gap-3 w-full py-1">
              
              {/* STAGE 0: AIR INFLOW NOZZLE */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#42B9D9] bg-[#0E201B] px-3 py-1 rounded-full border border-[#16382C]">
                <Wind className="w-3.5 h-3.5 animate-bounce" />
                <span>AIR INFLOW (DIRTY AMBIENT AIR)</span>
              </div>

              {/* STAGE 1: INTAKE FAN */}
              <div
                id="component-fan"
                onMouseEnter={() => setActiveHoverComponent('fan')}
                onMouseLeave={() => setActiveHoverComponent(null)}
                className="w-full max-w-sm bg-[#1F2621] hover:bg-[#263029] transition-all rounded-lg border border-[#344237] p-2.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-[#0E1510] border border-[#3E5243] flex items-center justify-center overflow-hidden">
                    {/* Spinning blades animation */}
                    <div
                      className="w-6 h-6 border-2 border-dashed border-[#42B9D9] rounded-full"
                      style={{
                        animation: `spin-fan ${fanRotationDuration} linear infinite`,
                      }}
                    ></div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      INTAKE FAN
                      <span className="text-[10px] font-normal text-[#42B9D9] bg-[#0E242C] px-1.5 py-0.2 rounded">
                        {effectiveFanSpeed}% SPEED
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#8C9A8F]">
                      {currentPoint.fanRpm} RPM • Brushless DC Motor
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#69B82F] bg-[#122B18] px-2 py-1 rounded border border-[#1E4D27]">
                  {controls.mode === 'AUTO' ? 'AUTO PID' : 'ACTIVE'}
                </span>
              </div>

              {/* Airflow Connector Arrow */}
              <div className="flex justify-center text-[#42B9D9] opacity-70">
                <span className="text-xs font-mono animate-flow-down">↓↓↓</span>
              </div>

              {/* STAGE 2: PRE-FILTER (Coarse capture) */}
              <div
                id="component-prefilter"
                onMouseEnter={() => setActiveHoverComponent('prefilter')}
                onMouseLeave={() => setActiveHoverComponent(null)}
                className="w-full max-w-sm bg-[#1F2621] hover:bg-[#263029] transition-all rounded-lg border border-[#344237] p-2.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#2A1F18] border border-[#6E4F32] flex items-center justify-center text-[#E4B83D]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white">
                      PRE-FILTER (COARSE MESH)
                    </div>
                    <div className="text-[10px] font-mono text-[#8C9A8F]">
                      Captures hair, large dust & pollen (&gt;10µm)
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#69B82F]">ACTIVE (94%)</span>
              </div>

              {/* Airflow Connector Arrow */}
              <div className="flex justify-center text-[#42B9D9] opacity-70">
                <span className="text-xs font-mono animate-flow-down">↓↓↓</span>
              </div>

              {/* STAGE 3: TRUE HEPA FILTER */}
              <div
                id="component-hepa"
                onMouseEnter={() => setActiveHoverComponent('hepa')}
                onMouseLeave={() => setActiveHoverComponent(null)}
                className="w-full max-w-sm bg-[#1F2621] hover:bg-[#263029] transition-all rounded-lg border border-[#344237] p-2.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#132A33] border border-[#23586C] flex items-center justify-center text-[#42B9D9]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                      HEPA H13 FILTER
                      <span className="text-[9px] text-[#42B9D9]">99.97%</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#8C9A8F]">
                      Micro-glass fiber pleat • Traps PM2.5 & aerosols
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#69B82F]">ACTIVE</span>
              </div>

              {/* Airflow Connector Arrow - Split into Dual Tanks */}
              <div className="flex items-center justify-center w-full max-w-sm text-[#69B82F] opacity-80 gap-16">
                <span className="text-xs font-mono">↙ SPARGING</span>
                <span className="text-xs font-mono">SPARGING ↘</span>
              </div>

              {/* STAGE 4: DUAL ALGAE PHOTOBIOREACTORS (TANK 01 & TANK 02 WITH THIN ALGINATE HYDROGEL + FINE BUBBLES) */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                
                {/* ALGAE TANK 01 */}
                <div
                  id="biopod-algae-tank-01"
                  onClick={() => onSelectTank('01')}
                  onMouseEnter={() => setActiveHoverComponent('tank01')}
                  onMouseLeave={() => setActiveHoverComponent(null)}
                  className="bg-[#0C1E14] hover:bg-[#102B1D] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all rounded-xl p-2.5 flex flex-col justify-between cursor-pointer relative overflow-hidden group shadow-inner"
                  style={{
                    boxShadow: `0 0 16px rgba(105, 184, 47, ${ledGlowOpacity * 0.4})`,
                  }}
                >
                  {/* Subtle pulsing photobioreactor liquid glow */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0B4D20]/60 via-[#69B82F]/20 to-transparent pointer-events-none animate-algae-pulse"
                    style={{ opacity: ledGlowOpacity }}
                  ></div>

                  {/* Micro-hydrogel matrix grid background indicator */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#69B82F_1px,transparent_1px),linear-gradient(to_bottom,#69B82F_1px,transparent_1px)] [background-size:8px_8px]"></div>

                  {/* Rising fine micro-bubbles animation */}
                  {controls.airPump && (
                    <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none overflow-hidden flex justify-around opacity-85">
                      <div className={`w-1 h-1 rounded-full bg-white/90 ${bubbleSpeedClass}`} style={{ animationDelay: '0s' }}></div>
                      <div className={`w-1.5 h-1.5 rounded-full bg-white/80 ${bubbleSpeedClass}`} style={{ animationDelay: '0.4s' }}></div>
                      <div className={`w-1 h-1 rounded-full bg-white/95 ${bubbleSpeedClass}`} style={{ animationDelay: '0.8s' }}></div>
                      <div className={`w-1.5 h-1.5 rounded-full bg-white/70 ${bubbleSpeedClass}`} style={{ animationDelay: '1.2s' }}></div>
                      <div className={`w-1 h-1 rounded-full bg-white/90 ${bubbleSpeedClass}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#FAF8F2] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#69B82F]"></span>
                      ALGAE TANK 01
                    </span>
                    <Maximize2 className="w-3 h-3 text-[#69B82F] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Cylindrical visual representation with Hydrogel Label */}
                  <div className="relative z-10 rounded-lg bg-[#06170E]/85 border border-[#2B7344] p-1.5 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[8px] font-mono text-[#69B82F] uppercase tracking-wide bg-[#0B2E17] px-1 py-0.5 rounded border border-[#1E5C33] inline-block mb-1">
                        Thin Alginate Hydrogel + Algae
                      </div>
                      <div className="text-[9px] font-mono text-[#A8DDA2]">
                        Chlorella vulgaris
                      </div>
                    </div>
                    
                    <div className="mt-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono font-bold text-white">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-[8px] font-mono text-[#42B9D9] bg-[#0E242C] px-1 rounded">
                          Fine Bubbles
                        </span>
                      </div>
                      {/* Algae fluid fill level */}
                      <div className="w-full bg-[#0E2818] h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-[#69B82F] h-full transition-all duration-500"
                          style={{ width: `${currentPoint.algaeDensity}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ALGAE TANK 02 */}
                <div
                  id="biopod-algae-tank-02"
                  onClick={() => onSelectTank('02')}
                  onMouseEnter={() => setActiveHoverComponent('tank02')}
                  onMouseLeave={() => setActiveHoverComponent(null)}
                  className="bg-[#0C1E14] hover:bg-[#102B1D] border-2 border-[#1E5C33] hover:border-[#69B82F] transition-all rounded-xl p-2.5 flex flex-col justify-between cursor-pointer relative overflow-hidden group shadow-inner"
                  style={{
                    boxShadow: `0 0 16px rgba(105, 184, 47, ${ledGlowOpacity * 0.4})`,
                  }}
                >
                  {/* Subtle pulsing photobioreactor liquid glow */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0B4D20]/60 via-[#69B82F]/20 to-transparent pointer-events-none animate-algae-pulse"
                    style={{ opacity: ledGlowOpacity }}
                  ></div>

                  {/* Micro-hydrogel matrix grid background indicator */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#69B82F_1px,transparent_1px),linear-gradient(to_bottom,#69B82F_1px,transparent_1px)] [background-size:8px_8px]"></div>

                  {/* Rising fine micro-bubbles animation */}
                  {controls.airPump && (
                    <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none overflow-hidden flex justify-around opacity-85">
                      <div className={`w-1.5 h-1.5 rounded-full bg-white/80 ${bubbleSpeedClass}`} style={{ animationDelay: '0.3s' }}></div>
                      <div className={`w-1 h-1 rounded-full bg-white/95 ${bubbleSpeedClass}`} style={{ animationDelay: '0.7s' }}></div>
                      <div className={`w-1.5 h-1.5 rounded-full bg-white/70 ${bubbleSpeedClass}`} style={{ animationDelay: '1.1s' }}></div>
                      <div className={`w-1 h-1 rounded-full bg-white/90 ${bubbleSpeedClass}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-1 h-1 rounded-full bg-white/90 ${bubbleSpeedClass}`} style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#FAF8F2] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#69B82F]"></span>
                      ALGAE TANK 02
                    </span>
                    <Maximize2 className="w-3 h-3 text-[#69B82F] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Cylindrical visual representation with Hydrogel Label */}
                  <div className="relative z-10 rounded-lg bg-[#06170E]/85 border border-[#2B7344] p-1.5 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[8px] font-mono text-[#69B82F] uppercase tracking-wide bg-[#0B2E17] px-1 py-0.5 rounded border border-[#1E5C33] inline-block mb-1">
                        Thin Alginate Hydrogel + Algae
                      </div>
                      <div className="text-[9px] font-mono text-[#A8DDA2]">
                        Bio-Cascade Stage
                      </div>
                    </div>
                    
                    <div className="mt-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono font-bold text-white">
                          {currentPoint.algaeDensity}%
                        </span>
                        <span className="text-[8px] font-mono text-[#42B9D9] bg-[#0E242C] px-1 rounded">
                          Fine Bubbles
                        </span>
                      </div>
                      {/* Algae fluid fill level */}
                      <div className="w-full bg-[#0E2818] h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-[#69B82F] h-full transition-all duration-500"
                          style={{ width: `${currentPoint.algaeDensity}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AIR PUMP + FINE-BUBBLE DIFFUSION MANIFOLD */}
              <div className="flex items-center justify-between w-full max-w-sm px-2 py-1 bg-[#0E1B13] rounded-lg border border-[#1E3F27] text-[10px] font-mono text-[#8C9A8F]">
                <span className="text-[#42B9D9] flex items-center gap-1">
                  <Wind className="w-3 h-3" /> AIR PUMP (FINE BUBBLES)
                </span>
                <span className="text-[#69B82F] font-semibold">
                  {controls.airPump ? '● CERAMIC DIFFUSER ACTIVE' : '○ STANDBY'}
                </span>
              </div>

              {/* OUTPUT MANIFOLD CONVERGENCE */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#69B82F] bg-[#0E2818] px-4 py-1.5 rounded-full border border-[#1E5C33] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#69B82F]" />
                <span>CONVERGENCE → O₂ ENRICHED PURIFIED AIR STREAM</span>
              </div>
            </div>

            {/* Bottom Diagnostic Bar */}
            <div className="relative z-10 pt-3 border-t border-[#2C362F] flex items-center justify-between text-[11px] font-mono text-[#8C9A8F]">
              <span>Air Pump: {controls.airPump ? '● 2.4 L/min' : '○ STANDBY'}</span>
              <span>LED Array: {controls.ledIntensity}% (660nm Bio-Red)</span>
            </div>
          </div>

          {/* ================= RIGHT PANEL: BIOLOGICAL LOOP & OUTPUT ================= */}
          <div
            id="panel-biological-loop"
            className="lg:col-span-3 bg-[#080F0A] rounded-xl border border-[#1E3F27] p-4 sm:p-5 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3F27] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#69B82F] animate-ping"></div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-[#FAF8F2] uppercase">
                    BIOLOGICAL LOOP (CLEAN AIR)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#69B82F] bg-[#0E2818] px-1.5 py-0.5 rounded font-medium border border-[#1E5C33]">
                  OUTPUT
                </span>
              </div>

              <div className="space-y-3 font-mono">
                {/* Metric 1: SYSTEM HEALTH (Requested by User) */}
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F] mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-[#FAF8F2]">
                      <HeartPulse className="w-3.5 h-3.5 text-[#69B82F]" /> SYSTEM HEALTH
                    </span>
                    <span className="text-[9px] text-[#69B82F] bg-[#0E2818] px-1 py-0.2 rounded font-semibold">ALL SENSORS</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-[#69B82F]">
                      {currentPoint.systemHealth}%
                    </span>
                    <span className="text-xs font-bold text-[#69B82F] uppercase">
                      {currentPoint.systemHealth >= 95 ? 'EXCELLENT' : currentPoint.systemHealth >= 85 ? 'OPTIMAL' : 'ATTENTION'}
                    </span>
                  </div>
                  {/* Health Progress Bar */}
                  <div className="w-full bg-[#060D09] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#1E3F27]">
                    <div
                      className="bg-[#69B82F] h-full rounded-full transition-all duration-300"
                      style={{ width: `${currentPoint.systemHealth}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-[#8C9A8F] block mt-1 font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#69B82F]" /> Continuous Hardware Diagnostics
                  </span>
                </div>

                {/* Metric 2: Algae Density Meter */}
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F] mb-1">
                    <span className="font-medium text-[#FAF8F2]">ALGAE BIOMASS</span>
                    <span className="text-xs font-bold text-[#69B82F]">{currentPoint.algaeDensity}% HEALTHY</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#060D09] h-2 rounded-full overflow-hidden border border-[#1E3F27]">
                    <div
                      className="bg-[#69B82F] h-full rounded-full transition-all duration-300"
                      style={{ width: `${currentPoint.algaeDensity}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8C9A8F] mt-1 font-sans">
                    <span>Photosynthetic micro-culture</span>
                    <span className="text-[#69B82F] font-mono font-semibold">O₂: +{currentPoint.o2GeneratedLiters}L</span>
                  </div>
                </div>

                {/* Metric 3: Air Pump & LED Quick Status */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-[#0C1711] p-2 rounded-lg border border-[#1E3F27]">
                    <span className="text-[9px] text-[#8C9A8F] block mb-0.5">AIR SPARGING</span>
                    <span className="text-xs font-bold text-[#FAF8F2] block">
                      {controls.airPump ? '● 2.4 L/min' : '○ OFF'}
                    </span>
                  </div>
                  <div className="bg-[#0C1711] p-2 rounded-lg border border-[#1E3F27]">
                    <span className="text-[9px] text-[#8C9A8F] block mb-0.5">PAR LED LIGHT</span>
                    <span className="text-xs font-bold text-[#69B82F] block">
                      {controls.ledIntensity}% (660nm)
                    </span>
                  </div>
                </div>

                {/* Metric 4: CO2 Capture & O2 output */}
                <div className="bg-[#0C1711] p-2.5 rounded-lg border border-[#1E3F27]">
                  <div className="flex items-center justify-between text-xs text-[#8C9A8F]">
                    <span className="font-medium text-[#FAF8F2]">GAS EXCHANGE</span>
                    <span className="text-[10px] font-bold text-[#69B82F] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#69B82F]" /> ACTIVE
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-[#FAF8F2] font-bold flex items-baseline justify-between border-t border-[#1E3F27] pt-1">
                    <span className="text-[#8C9A8F] font-normal">O₂ GENERATED</span>
                    <span className="text-[#69B82F]">+{currentPoint.o2GeneratedLiters} L ({currentPoint.roomO2Pct}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean air output message */}
            <div className="mt-4 pt-2.5 border-t border-[#1E3F27] text-xs font-mono text-[#69B82F] flex items-center justify-between font-semibold">
              <span>Clean Oxygenated Air</span>
              <span>100% Recirculation</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

