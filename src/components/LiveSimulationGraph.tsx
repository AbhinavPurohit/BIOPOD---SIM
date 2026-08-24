import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  TrendingDown, 
  TrendingUp,
  Sparkles,
  Flame,
  Wind,
  Info,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Atom,
  Gauge
} from 'lucide-react';
import { SimulationDataPoint } from '../types';
import { BIOPOD_EQUATIONS_REFERENCE, calculatePM25AQI } from '../utils/simulationEngine';

type MetricTab = 'AQI' | 'CO2' | 'PM25' | 'ALGAE' | 'COMBINED';

interface LiveSimulationGraphProps {
  dataPoints: SimulationDataPoint[];
  currentMinute: number;
  isSimulating: boolean;
  simulationSpeed: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeekMinute: (minute: number) => void;
  onChangeSpeed: (speed: number) => void;
}

export const LiveSimulationGraph: React.FC<LiveSimulationGraphProps> = ({
  dataPoints,
  currentMinute,
  isSimulating,
  simulationSpeed,
  onTogglePlay,
  onReset,
  onSeekMinute,
  onChangeSpeed,
}) => {
  const [activeTab, setActiveTab] = useState<MetricTab>('AQI');
  const [hoveredMinute, setHoveredMinute] = useState<number | null>(null);
  const [showEquations, setShowEquations] = useState<boolean>(false);
  const [showO2Line, setShowO2Line] = useState<boolean>(true);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  const displayedMinute = hoveredMinute !== null ? hoveredMinute : currentMinute;
  const currentData = dataPoints[displayedMinute] || dataPoints[0];

  // SVG Chart Geometry (Enlarged for Full-Width Dashboard Canvas)
  const width = 1000;
  const height = 380;
  // If activeTab === 'CO2', we allocate right padding for the dual O2 axis ticks
  const padding = { 
    top: 32, 
    right: activeTab === 'CO2' ? 85 : 45, 
    bottom: 50, 
    left: 75 
  };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale calculations for Left Y-Axis (AQI, CO2 ppm, PM2.5, Algae)
  let minY = 0;
  let maxY = 200;
  let unit = 'AQI index';
  let title = 'AIR QUALITY INDEX (AQI) PROGRESSION CURVE';
  let primaryColor = '#69B82F'; // BioPod Vibrant Green

  if (activeTab === 'AQI') {
    const maxVal = Math.max(...dataPoints.map((d) => d.aqi));
    minY = 0;
    maxY = Math.max(50, Math.ceil((maxVal + 20) / 25) * 25);
    unit = 'AQI (EPA)';
    title = 'AIR QUALITY INDEX (AQI) PROGRESSION (US EPA STANDARD)';
    primaryColor = '#69B82F';
  } else if (activeTab === 'CO2') {
    const minVal = Math.min(...dataPoints.map((d) => d.roomCo2));
    const maxVal = Math.max(...dataPoints.map((d) => d.roomCo2));
    minY = Math.max(350, Math.floor((minVal - 50) / 100) * 100);
    maxY = Math.max(minY + 200, Math.ceil((maxVal + 50) / 100) * 100);
    unit = 'ppm (CO₂)';
    title = 'CO₂ CAPTURE & O₂ GENERATION (GAS EXCHANGE)';
    primaryColor = '#69B82F';
  } else if (activeTab === 'PM25') {
    const minVal = Math.min(...dataPoints.map((d) => d.roomPm25));
    const maxVal = Math.max(...dataPoints.map((d) => d.roomPm25));
    minY = 0;
    maxY = Math.max(50, Math.ceil(maxVal * 1.15));
    unit = 'µg/m³';
    title = 'PM2.5 AEROSOL FILTRATION CURVE (µg/m³)';
    primaryColor = '#42B9D9';
  } else if (activeTab === 'ALGAE') {
    const minVal = Math.min(...dataPoints.map((d) => d.algaeDensity));
    const maxVal = Math.max(...dataPoints.map((d) => d.algaeDensity));
    minY = Math.max(0, Math.floor((minVal - 10) / 10) * 10);
    maxY = Math.min(100, Math.ceil((maxVal + 10) / 10) * 10);
    if (maxY - minY < 30) {
      minY = Math.max(0, minY - 10);
      maxY = Math.min(100, maxY + 10);
    }
    unit = '% density';
    title = 'MICROALGAE BIOMASS GROWTH DENSITY (%)';
    primaryColor = '#69B82F';
  } else if (activeTab === 'COMBINED') {
    minY = 0;
    maxY = 100;
    unit = '% norm';
    title = 'NORMALIZED MULTI-STAGE EFFICIENCY (0-100%)';
    primaryColor = '#69B82F';
  }

  // Right Y-Axis Scale for O2 Liters Generated (when in CO2 tab)
  const maxO2LitersVal = Math.max(5, ...dataPoints.map((d) => d.o2GeneratedLiters));
  const minO2 = 0;
  const maxO2 = Math.ceil(maxO2LitersVal * 1.25); // e.g. 0 to 35 Liters

  // Coordinate conversions
  const getX = (min: number) => padding.left + (min / 60) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - minY) / (maxY - minY)) * graphHeight;
  const getYO2 = (o2Val: number) => padding.top + graphHeight - ((o2Val - minO2) / (maxO2 - minO2)) * graphHeight;

  // Generate SVG path string for general left-axis metrics
  const generatePath = (getValue: (d: SimulationDataPoint) => number) => {
    return dataPoints
      .map((d, index) => {
        const x = getX(d.minute);
        const y = getY(getValue(d));
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate SVG path string for Right-Axis O2 Liters curve
  const generateO2Path = () => {
    return dataPoints
      .map((d, index) => {
        const x = getX(d.minute);
        const y = getYO2(d.o2GeneratedLiters);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Main curve path
  let mainPath = '';
  if (activeTab === 'AQI') {
    mainPath = generatePath((d) => d.aqi);
  } else if (activeTab === 'CO2') {
    mainPath = generatePath((d) => d.roomCo2);
  } else if (activeTab === 'PM25') {
    mainPath = generatePath((d) => d.roomPm25);
  } else if (activeTab === 'ALGAE') {
    mainPath = generatePath((d) => d.algaeDensity);
  }

  const o2Path = generateO2Path();

  // Left Y-axis grid step ticks
  const yTicksCount = 5;
  const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
    const val = minY + (i / yTicksCount) * (maxY - minY);
    return Math.round(val);
  });

  // Right Y-axis (O2 Liters) step ticks
  const o2Ticks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
    const val = minO2 + (i / yTicksCount) * (maxO2 - minO2);
    return Number(val.toFixed(1));
  });

  // X-axis minute ticks: 0, 10, 20, 30, 40, 50, 60
  const xTicks = [0, 10, 20, 30, 40, 50, 60];

  // Mouse hover handler for SVG chart
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const svgX = (xPos / rect.width) * width;
    const minCalculated = Math.round(((svgX - padding.left) / graphWidth) * 60);
    const clampedMin = Math.max(0, Math.min(60, minCalculated));
    setHoveredMinute(clampedMin);
  };

  return (
    <div
      id="panel-live-simulation"
      className="w-full bg-[#0C140F] rounded-xl border-2 border-[#1E3F27] p-4 sm:p-6 flex flex-col justify-between shadow-2xl"
    >
      <div>
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#1E3324] mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#69B82F] animate-pulse"></span>
              <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#A8DDA2] uppercase">
                LIVE SIMULATION TELEMETRY
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF8F2] font-mono font-semibold mt-0.5">{title}</p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-[#060D09] p-1 rounded-lg border border-[#1E3F27]">
            <button
              id="tab-aqi"
              onClick={() => setActiveTab('AQI')}
              className={`px-3.5 py-1 text-[11px] font-mono font-bold rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'AQI'
                  ? 'bg-[#0B4D20] text-[#FAF8F2] shadow-xs border border-[#69B82F]/60'
                  : 'text-[#A8DDA2]/60 hover:text-[#FAF8F2]'
              }`}
            >
              <Gauge className="w-3 h-3 text-[#69B82F]" />
              <span>AQI</span>
            </button>
            <button
              id="tab-co2"
              onClick={() => setActiveTab('CO2')}
              className={`px-3.5 py-1 text-[11px] font-mono font-bold rounded transition-all flex items-center gap-1 ${
                activeTab === 'CO2'
                  ? 'bg-[#0B4D20] text-[#FAF8F2] shadow-xs border border-[#69B82F]/40'
                  : 'text-[#A8DDA2]/60 hover:text-[#FAF8F2]'
              }`}
            >
              <span>CO₂ & O₂</span>
            </button>
            <button
              id="tab-pm25"
              onClick={() => setActiveTab('PM25')}
              className={`px-3.5 py-1 text-[11px] font-mono font-bold rounded transition-all ${
                activeTab === 'PM25'
                  ? 'bg-[#42B9D9] text-[#060D09] font-bold shadow-xs'
                  : 'text-[#A8DDA2]/60 hover:text-[#FAF8F2]'
              }`}
            >
              PM2.5
            </button>
            <button
              id="tab-algae"
              onClick={() => setActiveTab('ALGAE')}
              className={`px-3.5 py-1 text-[11px] font-mono font-bold rounded transition-all ${
                activeTab === 'ALGAE'
                  ? 'bg-[#69B82F] text-[#060D09] shadow-xs'
                  : 'text-[#A8DDA2]/60 hover:text-[#FAF8F2]'
              }`}
            >
              ALGAE
            </button>
            <button
              id="tab-combined"
              onClick={() => setActiveTab('COMBINED')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded transition-all ${
                activeTab === 'COMBINED'
                  ? 'bg-[#E4B83D] text-[#060D09] shadow-xs'
                  : 'text-[#A8DDA2]/60 hover:text-[#FAF8F2]'
              }`}
            >
              ALL
            </button>
          </div>
        </div>

        {/* Current Point Quick Readout Banner (5-Column Wide Telemetry) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-3.5 bg-[#070E0A] p-3 rounded-lg border border-[#1E3F27] font-mono text-xs shadow-inner">
          <div>
            <span className="text-[#A8DDA2]/50 text-[10px] block">TIMELINE</span>
            <strong className="text-[#FAF8F2] text-sm">
              {displayedMinute}m <span className="text-xs font-normal text-[#A8DDA2]/40">/ 60m</span>
            </strong>
          </div>
          <div>
            <span className="text-[#A8DDA2]/50 text-[10px] block flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#69B82F]" /> AQI (EPA)
            </span>
            <strong className="text-[#69B82F] text-sm flex items-center gap-1.5">
              {currentData.aqi} 
              <span className="text-[9px] px-1 py-0.2 rounded font-semibold" style={{
                backgroundColor: `${calculatePM25AQI(currentData.roomPm25).color}25`,
                color: calculatePM25AQI(currentData.roomPm25).color
              }}>
                {calculatePM25AQI(currentData.roomPm25).label}
              </span>
            </strong>
          </div>
          <div>
            <span className="text-[#A8DDA2]/50 text-[10px] block flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#E67E22]" /> ROOM CO₂
            </span>
            <strong className="text-[#69B82F] text-sm">
              {currentData.roomCo2} <span className="text-xs font-normal">ppm</span>
            </strong>
          </div>
          <div>
            <span className="text-[#A8DDA2]/50 text-[10px] block flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#42B9D9]" /> PM2.5 PARTICULATE
            </span>
            <strong className="text-[#42B9D9] text-sm">
              {currentData.roomPm25} <span className="text-xs font-normal">µg/m³</span>
            </strong>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#A8DDA2]/50 text-[10px] block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#69B82F]" /> O₂ GENERATED
            </span>
            <strong className="text-[#FAF8F2] text-sm">
              +{currentData.o2GeneratedLiters} L <span className="text-[10px] font-normal text-[#69B82F]/70">({currentData.roomO2Pct}%)</span>
            </strong>
          </div>
        </div>

        {/* Interactive Legend for AQI */}
        {activeTab === 'AQI' && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 mb-2.5 bg-[#060D09] rounded-md border border-[#1E3F27] text-[10px] font-mono">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#69B82F] rounded-full inline-block"></span>
                <span className="text-[#FAF8F2] font-semibold">Live Room AQI Curve ↓</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold" style={{ backgroundColor: `${calculatePM25AQI(currentData.roomPm25).color}25`, color: calculatePM25AQI(currentData.roomPm25).color, border: `1px solid ${calculatePM25AQI(currentData.roomPm25).color}60` }}>
                  {currentData.aqi} AQI • {calculatePM25AQI(currentData.roomPm25).label}
                </span>
              </div>
            </div>
            <div className="text-[#A8DDA2]/60 text-[9px] font-sans">
              EPA Standard: ≤50 Good • 51-100 Moderate • 101-150 Unhealthy for Sensitive Groups
            </div>
          </div>
        )}

        {/* Dual-Curve Interactive Legend for CO2 & O2 */}
        {activeTab === 'CO2' && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 mb-2.5 bg-[#060D09] rounded-md border border-[#1E3F27] text-[10px] font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#69B82F] rounded-full inline-block"></span>
                <span className="text-[#FAF8F2] font-semibold">CO₂ Concentration (ppm) ↓</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#42B9D9] rounded-full inline-block"></span>
                <span className="text-[#42B9D9] font-semibold">O₂ Generated (+Liters) ↑</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="toggle-o2-curve-btn"
                onClick={() => setShowO2Line((prev) => !prev)}
                className={`px-2.5 py-0.5 rounded text-[10px] border transition-all ${
                  showO2Line
                    ? 'bg-[#0E2730] text-[#42B9D9] border-[#1D586B] font-bold'
                    : 'bg-[#060D09] text-[#A8DDA2]/40 border-[#1E3F27]'
                }`}
              >
                {showO2Line ? '● O₂ Curve Active' : '○ Show O₂'}
              </button>

              <button
                id="toggle-equations-btn"
                onClick={() => setShowEquations((prev) => !prev)}
                className="px-2.5 py-0.5 rounded text-[10px] bg-[#060D09] hover:bg-[#0B1E13] text-[#69B82F] border border-[#1E3F27] flex items-center gap-1 transition-all"
              >
                <FlaskConical className="w-3 h-3" />
                <span>Bio-Equations</span>
                {showEquations ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Bio-Equations Stoichiometric Reference Box */}
        {activeTab === 'CO2' && showEquations && (
          <div className="p-3 mb-3 bg-[#060D09] border border-[#1E5C33] rounded-lg text-[10px] font-mono space-y-2 animate-in fade-in duration-200 shadow-inner">
            <div className="flex items-center justify-between text-[#69B82F] font-bold border-b border-[#1E3324] pb-1">
              <span className="flex items-center gap-1">
                <Atom className="w-3.5 h-3.5" /> STOICHIOMETRIC REACTION & EQUATIONS
              </span>
              <span className="text-[#A8DDA2]/50 text-[9px]">PQ = 1.15 • Monod Kinetics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#FAF8F2]/80">
              <div className="bg-[#0B1610] p-2 rounded border border-[#1E3F27]">
                <strong className="text-[#69B82F] block mb-0.5">1. Photosynthetic Reaction</strong>
                <code className="text-[#42B9D9] text-[9px] block">
                  6 CO₂ + 6 H₂O + Light (660/450nm) → C₆H₁₂O₆ + 6 O₂
                </code>
                <p className="text-[9px] text-[#A8DDA2]/60 mt-1 font-sans">
                  1 mole CO₂ absorbed fixes ~1 mole carbon into microalgal biomass and produces ~1.15 moles pure O₂.
                </p>
              </div>

              <div className="bg-[#0B1610] p-2 rounded border border-[#1E3F27]">
                <strong className="text-[#42B9D9] block mb-0.5">2. Volumetric Oxygen Law</strong>
                <code className="text-[#E4B83D] text-[9px] block">
                  ΔV_O2 (L) = ΔCO₂ (ppm) × 10⁻⁶ × (V_room × 1000L) × 1.15
                </code>
                <p className="text-[9px] text-[#A8DDA2]/60 mt-1 font-sans">
                  At 25°C, 1 atm, molar volume = 24.45 L/mol. O₂ enrichment Δppm = (O₂ L / Room L) × 10⁶.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SVG Engineering Chart */}
        <div className="w-full bg-[#050C08] border-2 border-[#1E3F27] rounded-xl p-2 sm:p-3 overflow-x-auto relative shadow-2xl">
          <svg
            ref={chartSvgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[500px] select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredMinute(null)}
            onClick={() => {
              if (hoveredMinute !== null) {
                onSeekMinute(hoveredMinute);
              }
            }}
          >
            {/* SVG Filter & Gradient Definitions */}
            <defs>
              {/* Plot Backdrop Gradient */}
              <radialGradient id="plot-radial-glow" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#0E2818" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#06120B" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#030805" stopOpacity="1" />
              </radialGradient>

              {/* AQI Area Gradient */}
              <linearGradient id="aqi-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#69B82F" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#0B4D20" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#0B4D20" stopOpacity="0.0" />
              </linearGradient>

              {/* CO2 Area Gradient */}
              <linearGradient id="co2-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#69B82F" stopOpacity="0.32" />
                <stop offset="50%" stopColor="#0B4D20" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0B4D20" stopOpacity="0.0" />
              </linearGradient>

              {/* O2 Area Gradient */}
              <linearGradient id="o2-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42B9D9" stopOpacity="0.30" />
                <stop offset="70%" stopColor="#1E5C33" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0B4D20" stopOpacity="0.0" />
              </linearGradient>

              {/* PM2.5 Area Gradient */}
              <linearGradient id="pm25-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42B9D9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#42B9D9" stopOpacity="0.0" />
              </linearGradient>

              {/* Algae Density Area Gradient */}
              <linearGradient id="algae-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#69B82F" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#0B4D20" stopOpacity="0.0" />
              </linearGradient>

              {/* Fine Laboratory Grid Pattern */}
              <pattern id="lab-micro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(105, 184, 47, 0.05)" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Base Background Rect with Lab Grid */}
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              rx={8}
              fill="url(#plot-radial-glow)"
            />
            <rect
              x={padding.left}
              y={padding.top}
              width={graphWidth}
              height={graphHeight}
              fill="url(#lab-micro-grid)"
              opacity="0.9"
            />

            {/* EPA Clean Air Target Zone (< 50 AQI) */}
            {activeTab === 'AQI' && (
              <g>
                <rect
                  x={padding.left}
                  y={getY(Math.min(maxY, 50))}
                  width={graphWidth}
                  height={Math.max(0, getY(minY) - getY(Math.min(maxY, 50)))}
                  fill="rgba(11, 77, 32, 0.22)"
                  stroke="rgba(105, 184, 47, 0.3)"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                />
                <text
                  x={padding.left + 8}
                  y={getY(Math.min(maxY, 50)) + 14}
                  fill="#69B82F"
                  fontSize="9"
                  fontFamily="monospace"
                  opacity="0.9"
                >
                  ✓ EPA Good Air Standard (AQI ≤ 50)
                </text>
              </g>
            )}

            {/* Cognitive Optimal Baseline Zone Highlight (<800 ppm for CO2) */}
            {activeTab === 'CO2' && (
              <g>
                <rect
                  x={padding.left}
                  y={getY(Math.min(maxY, 800))}
                  width={graphWidth}
                  height={Math.max(0, getY(minY) - getY(Math.min(maxY, 800)))}
                  fill="rgba(11, 77, 32, 0.18)"
                  stroke="rgba(105, 184, 47, 0.2)"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                />
                <text
                  x={padding.left + 8}
                  y={getY(Math.min(maxY, 800)) + 14}
                  fill="#69B82F"
                  fontSize="9"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  ✓ Cognitive & Deep Focus Target (&lt; 800 ppm)
                </text>
              </g>
            )}

            {/* Background Grid Lines */}
            {yTicks.map((val, idx) => {
              const y = getY(val);
              const o2Val = o2Ticks[idx];
              return (
                <g key={`ytick-${val}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#1E3324"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {/* Left Y-axis text (CO2 ppm / PM2.5 / Algae) */}
                  <text
                    x={padding.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={activeTab === 'CO2' ? '#69B82F' : '#A8DDA2'}
                  >
                    {val}
                  </text>

                  {/* Right Y-axis text for O2 Liters (when in CO2 tab) */}
                  {activeTab === 'CO2' && showO2Line && (
                    <text
                      x={width - padding.right + 12}
                      y={y + 4}
                      textAnchor="start"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#42B9D9"
                    >
                      +{o2Val} L
                    </text>
                  )}
                </g>
              );
            })}

            {/* X-Axis Minute Grid Lines */}
            {xTicks.map((min) => {
              const x = getX(min);
              return (
                <g key={`xtick-${min}`}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#1E3324"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#A8DDA2"
                    opacity="0.7"
                  >
                    {min}m
                  </text>
                </g>
              );
            })}

            {/* Axes Lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#2B5B3B"
              strokeWidth="2"
            />
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#2B5B3B"
              strokeWidth="2"
            />
            {activeTab === 'CO2' && showO2Line && (
              <line
                x1={width - padding.right}
                y1={padding.top}
                x2={width - padding.right}
                y2={height - padding.bottom}
                stroke="#1D586B"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* Axis Titles */}
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              fill="#A8DDA2"
              opacity="0.8"
            >
              SIMULATION TIMELINE (MINUTES)
            </text>

            {/* Left Y Axis Label */}
            <text
              x={padding.left - 55}
              y={padding.top - 12}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              fill={activeTab === 'CO2' ? '#69B82F' : '#A8DDA2'}
            >
              {unit}
            </text>

            {/* Right Y Axis Label for O2 */}
            {activeTab === 'CO2' && showO2Line && (
              <text
                x={width - padding.right + 12}
                y={padding.top - 12}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#42B9D9"
              >
                O₂ Gen (L)
              </text>
            )}

            {/* Single Technical Left Curve (AQI, CO2, PM2.5, or Algae) */}
            {activeTab !== 'COMBINED' && (
              <>
                {/* Luminous Area Fill under curve */}
                <path
                  d={`${mainPath} L ${getX(60)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`}
                  fill={
                    activeTab === 'AQI'
                      ? 'url(#aqi-area-grad)'
                      : activeTab === 'CO2' 
                      ? 'url(#co2-area-grad)' 
                      : activeTab === 'PM25' 
                      ? 'url(#pm25-area-grad)' 
                      : 'url(#algae-area-grad)'
                  }
                />
                {/* Crisp engineering line with soft glow shadow */}
                <path
                  d={mainPath}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Secondary O2 Evolution Curve (when in CO2 Tab) */}
            {activeTab === 'CO2' && showO2Line && (
              <>
                <path
                  d={`${o2Path} L ${getX(60)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`}
                  fill="url(#o2-area-grad)"
                />
                <path
                  d={o2Path}
                  fill="none"
                  stroke="#42B9D9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* If Combined Tab: render CO2, PM2.5, and Algae together normalized */}
            {activeTab === 'COMBINED' && (
              <>
                {/* Normalized CO2 */}
                <path
                  d={generatePath((d) => (d.roomCo2 / (dataPoints[0].roomCo2 || 1)) * 100)}
                  fill="none"
                  stroke="#69B82F"
                  strokeWidth="2"
                />
                {/* Normalized O2 */}
                <path
                  d={generatePath((d) => Math.min(100, (d.o2GeneratedLiters / (dataPoints[60]?.o2GeneratedLiters || 1)) * 100))}
                  fill="none"
                  stroke="#42B9D9"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {/* Normalized PM2.5 */}
                <path
                  d={generatePath((d) => (d.roomPm25 / (dataPoints[0].roomPm25 || 1)) * 100)}
                  fill="none"
                  stroke="#E4B83D"
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Current Simulation Cursor Position Line */}
            <line
              x1={getX(currentMinute)}
              y1={padding.top}
              x2={getX(currentMinute)}
              y2={height - padding.bottom}
              stroke="#69B82F"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />

            {/* Current Simulation Marker Dot for Primary Left Metric */}
            <circle
              cx={getX(currentMinute)}
              cy={
                activeTab === 'AQI'
                  ? getY(dataPoints[currentMinute]?.aqi || dataPoints[0].aqi)
                  : activeTab === 'CO2'
                  ? getY(dataPoints[currentMinute]?.roomCo2 || dataPoints[0].roomCo2)
                  : activeTab === 'PM25'
                  ? getY(dataPoints[currentMinute]?.roomPm25 || dataPoints[0].roomPm25)
                  : getY(dataPoints[currentMinute]?.algaeDensity || dataPoints[0].algaeDensity)
              }
              r="4.5"
              fill={primaryColor}
              stroke="#171A18"
              strokeWidth="2"
            />

            {/* Current Simulation Marker Dot for O2 on Right Axis */}
            {activeTab === 'CO2' && showO2Line && (
              <circle
                cx={getX(currentMinute)}
                cy={getYO2(dataPoints[currentMinute]?.o2GeneratedLiters || 0)}
                r="4.5"
                fill="#42B9D9"
                stroke="#171A18"
                strokeWidth="2"
              />
            )}

            {/* Hover Crosshair & Dynamic Multi-metric Tooltip */}
            {hoveredMinute !== null && (
              <g>
                <line
                  x1={getX(hoveredMinute)}
                  y1={padding.top}
                  x2={getX(hoveredMinute)}
                  y2={height - padding.bottom}
                  stroke="#E4B83D"
                  strokeWidth="1"
                />
                {/* Hover Dot Left */}
                <circle
                  cx={getX(hoveredMinute)}
                  cy={
                    activeTab === 'AQI'
                      ? getY(dataPoints[hoveredMinute]?.aqi || 0)
                      : activeTab === 'CO2'
                      ? getY(dataPoints[hoveredMinute]?.roomCo2 || 0)
                      : activeTab === 'PM25'
                      ? getY(dataPoints[hoveredMinute]?.roomPm25 || 0)
                      : getY(dataPoints[hoveredMinute]?.algaeDensity || 0)
                  }
                  r="5"
                  fill="#69B82F"
                  stroke="#171A18"
                  strokeWidth="1.5"
                />
                {/* Hover Dot Right O2 */}
                {activeTab === 'CO2' && showO2Line && (
                  <circle
                    cx={getX(hoveredMinute)}
                    cy={getYO2(dataPoints[hoveredMinute]?.o2GeneratedLiters || 0)}
                    r="5"
                    fill="#42B9D9"
                    stroke="#171A18"
                    strokeWidth="1.5"
                  />
                )}

                {/* Floating Tooltip Pill */}
                <g transform={`translate(${Math.min(width - padding.right - 150, Math.max(padding.left + 10, getX(hoveredMinute) - 75))}, ${padding.top + 8})`}>
                  <rect
                    width="150"
                    height="52"
                    rx="6"
                    fill="#080F0A"
                    stroke="#1E3F27"
                    strokeWidth="1.5"
                    opacity="0.96"
                  />
                  <text x="8" y="14" fill="#FAF8F2" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    T = {hoveredMinute} min
                  </text>
                  {activeTab === 'AQI' ? (
                    <>
                      <text x="8" y="28" fill="#69B82F" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        AQI: {dataPoints[hoveredMinute]?.aqi} ({calculatePM25AQI(dataPoints[hoveredMinute]?.roomPm25).label})
                      </text>
                      <text x="8" y="42" fill="#42B9D9" fontSize="8.5" fontFamily="monospace">
                        PM2.5: {dataPoints[hoveredMinute]?.roomPm25}µg • CO₂: {dataPoints[hoveredMinute]?.roomCo2}ppm
                      </text>
                    </>
                  ) : (
                    <>
                      <text x="8" y="28" fill="#69B82F" fontSize="9" fontFamily="monospace">
                        CO₂: {dataPoints[hoveredMinute]?.roomCo2} ppm
                      </text>
                      <text x="8" y="42" fill="#42B9D9" fontSize="9" fontFamily="monospace">
                        O₂: +{dataPoints[hoveredMinute]?.o2GeneratedLiters} L ({dataPoints[hoveredMinute]?.roomO2Pct}%)
                      </text>
                    </>
                  )}
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Scrub & Playback Controls Toolbar */}
      <div className="mt-4 pt-3.5 border-t border-[#1E3324] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        {/* Play/Pause & Step Controls */}
        <div className="flex items-center gap-2">
          <button
            id="play-pause-graph-btn"
            onClick={onTogglePlay}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isSimulating
                ? 'bg-[#E4B83D] text-[#060D09]'
                : 'bg-[#69B82F] text-[#060D09] hover:brightness-110'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isSimulating ? 'PAUSE' : currentMinute >= 60 ? 'REPLAY' : 'PLAY'}
          </button>

          <button
            id="reset-sim-graph-btn"
            onClick={onReset}
            title="Reset to 0m"
            className="p-2 rounded-lg bg-[#060D09] hover:bg-[#0B1E13] border border-[#1E3F27] text-[#A8DDA2]/70 hover:text-[#FAF8F2] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            id="jump-end-btn"
            onClick={() => onSeekMinute(60)}
            title="Jump to 60m"
            className="p-2 rounded-lg bg-[#060D09] hover:bg-[#0B1E13] border border-[#1E3F27] text-[#A8DDA2]/70 hover:text-[#FAF8F2] transition-colors flex items-center gap-1 text-[11px]"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">60m</span>
          </button>
        </div>

        {/* Scrubbing slider */}
        <div className="flex-1 min-w-[160px] max-w-xs flex items-center gap-2">
          <span className="text-[10px] text-[#A8DDA2]/50 font-mono">0m</span>
          <input
            id="timeline-scrubber"
            type="range"
            min="0"
            max="60"
            value={currentMinute}
            onChange={(e) => onSeekMinute(Number(e.target.value))}
            className="w-full accent-[#69B82F] cursor-pointer bg-[#060D09]"
          />
          <span className="text-[10px] text-[#A8DDA2]/50 font-mono">60m</span>
        </div>

        {/* Playback Speed Multiplier */}
        <div className="flex items-center gap-1 bg-[#060D09] p-1 rounded-lg border border-[#1E3F27]">
          {[1, 2, 5, 10].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeed(spd)}
              className={`px-2.5 py-0.5 text-[11px] rounded transition-all ${
                simulationSpeed === spd
                  ? 'bg-[#69B82F] text-[#060D09] font-bold shadow-xs'
                  : 'text-[#A8DDA2]/50 hover:text-[#FAF8F2]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
