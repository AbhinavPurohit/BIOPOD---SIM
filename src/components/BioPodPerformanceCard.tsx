import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Wind, 
  Droplet, 
  Flame, 
  Activity, 
  Layers, 
  Cpu, 
  Info, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { BioPodArchitecture, BioPodControls, UpgradedPerformanceMetrics } from '../types';
import { UPGRADED_PERFORMANCE_METRICS } from '../utils/simulationEngine';

interface BioPodPerformanceCardProps {
  controls: BioPodControls;
  onUpdateArchitecture?: (arch: BioPodArchitecture) => void;
  onOpenPrinciplesModal?: () => void;
}

export const BioPodPerformanceCard: React.FC<BioPodPerformanceCardProps> = ({
  controls,
  onUpdateArchitecture,
  onOpenPrinciplesModal,
}) => {
  const [showEsp32Details, setShowEsp32Details] = useState(false);
  const architecture = controls.architecture || 'UPGRADED';
  const isUpgraded = architecture === 'UPGRADED';

  const metrics: UpgradedPerformanceMetrics = UPGRADED_PERFORMANCE_METRICS;

  return (
    <div
      id="biopod-performance-card-container"
      className="bg-[#FAF8F2] rounded-xl border-2 border-[#1E5C33] shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="bg-[#0B4D20] text-[#FAF8F2] px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#69B82F]" />
          <h3 className="font-mono font-bold text-xs sm:text-sm tracking-wider uppercase">
            BIOPOD PERFORMANCE
          </h3>
        </div>

        {/* System Architecture Selector Toggle */}
        <div className="flex items-center bg-[#092D16] p-0.5 rounded-lg border border-[#1E5C33] text-[11px] font-mono">
          <button
            id="btn-arch-standard"
            type="button"
            onClick={() => onUpdateArchitecture?.('STANDARD')}
            className={`px-2.5 py-1 rounded transition-all ${
              !isUpgraded
                ? 'bg-[#EFECE2] text-[#0B4D20] font-bold shadow-xs'
                : 'text-[#A8DDA2] hover:text-white'
            }`}
          >
            Standard (100% Baseline)
          </button>
          <button
            id="btn-arch-upgraded"
            type="button"
            onClick={() => onUpdateArchitecture?.('UPGRADED')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              isUpgraded
                ? 'bg-[#69B82F] text-[#092D16] font-bold shadow-xs'
                : 'text-[#A8DDA2] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Upgraded (Hydrogel + Fine Bubble)
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5">
        {/* Metric rows grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          
          {/* 1. Photosynthesis */}
          <div className="bg-[#F4F1EA] p-3 rounded-lg border border-[#DDD8CD] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5A635C] mb-1">
              <span className="flex items-center gap-1 font-semibold text-[#171A18]">
                <Leaf className="w-3.5 h-3.5 text-[#0B4D20]" /> Photosynthesis
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-[#0B4D20]">
                {isUpgraded ? `+${metrics.photosynthesisPct}%` : '100%'}
              </span>
              <span className="text-[10px] text-[#6A736C]">
                {isUpgraded ? '+45–55%' : 'Baseline'}
              </span>
            </div>
            <span className="text-[10px] text-[#5A635C] mt-1 font-sans">
              {isUpgraded ? 'Thin Alginate Matrix' : 'Free liquid culture'}
            </span>
          </div>

          {/* 2. CO2 Capture */}
          <div className="bg-[#F4F1EA] p-3 rounded-lg border border-[#DDD8CD] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5A635C] mb-1">
              <span className="flex items-center gap-1 font-semibold text-[#171A18]">
                <Flame className="w-3.5 h-3.5 text-[#E67E22]" /> CO₂ Capture
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-[#0B4D20]">
                {isUpgraded ? `+${metrics.co2CapturePct}%` : '100%'}
              </span>
              <span className="text-[10px] text-[#6A736C]">
                {isUpgraded ? '+50–65%' : 'Baseline'}
              </span>
            </div>
            <span className="text-[10px] text-[#5A635C] mt-1 font-sans">
              {isUpgraded ? 'Rapid HCO₃⁻ Fixation' : 'Standard sparging'}
            </span>
          </div>

          {/* 3. O2 Generation */}
          <div className="bg-[#F4F1EA] p-3 rounded-lg border border-[#DDD8CD] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5A635C] mb-1">
              <span className="flex items-center gap-1 font-semibold text-[#171A18]">
                <Wind className="w-3.5 h-3.5 text-[#42B9D9]" /> O₂ Generation
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-[#0B4D20]">
                {isUpgraded ? `+${metrics.o2GenerationPct}%` : '100%'}
              </span>
              <span className="text-[10px] text-[#6A736C]">
                {isUpgraded ? '+45–55%' : 'Baseline'}
              </span>
            </div>
            <span className="text-[10px] text-[#5A635C] mt-1 font-sans">
              {isUpgraded ? 'High e⁻ transport' : '1.15 PQ ratio'}
            </span>
          </div>

          {/* 4. Gas Transfer */}
          <div className="bg-[#F4F1EA] p-3 rounded-lg border border-[#DDD8CD] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5A635C] mb-1">
              <span className="flex items-center gap-1 font-semibold text-[#171A18]">
                <Droplet className="w-3.5 h-3.5 text-[#0B4D20]" /> Gas Transfer
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-[#0B4D20]">
                {isUpgraded ? `+${metrics.gasTransferPct}%` : '100%'}
              </span>
              <span className="text-[10px] text-[#6A736C]">
                {isUpgraded ? '+45–60%' : 'Baseline'}
              </span>
            </div>
            <span className="text-[10px] text-[#5A635C] mt-1 font-sans">
              {isUpgraded ? 'Fine-Bubble Diffuser' : 'Coarse bubbles'}
            </span>
          </div>
        </div>

        {/* Overall Biological Loop Highlight + Target Badge */}
        <div className="mt-4 pt-3.5 border-t border-[#DDD8CD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#EAF3EB] p-3.5 rounded-lg border border-[#C2E0C7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B4D20] text-white flex items-center justify-center font-mono font-bold text-base shrink-0">
              {isUpgraded ? `+${metrics.overallBioLoopPct}%` : '100%'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0B4D20] uppercase tracking-wider">
                  OVERALL BIOLOGICAL LOOP
                </span>
                <span className="text-xs font-bold text-[#0B4D20] font-mono">
                  {isUpgraded ? `+${metrics.overallBioLoopPct}% HEADLINE IMPROVEMENT` : '100% BASELINE LEVEL'}
                </span>
              </div>
              <p className="text-[11px] text-[#4A534C] font-sans mt-0.5">
                {isUpgraded 
                  ? 'Synergistic boost from immobilized hydrogel mass transfer + fine micro-bubble aeration.'
                  : 'Standard baseline without alginate immobilization matrix.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B4D20] text-[#FAF8F2] font-mono font-bold text-[11px] uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#69B82F] animate-pulse"></span>
              {metrics.label}
            </span>
            <span className="text-[10px] font-mono text-[#5A635C]">
              ESP32 Closed-Loop Dynamic Control
            </span>
          </div>
        </div>

        {/* Scientific Caveat / Prototype Note */}
        <div className="mt-3 bg-[#FAF8F2] p-2.5 rounded-lg border border-[#DDD8CD] flex items-start gap-2 text-[11px] font-mono text-[#5A635C]">
          <Info className="w-4 h-4 text-[#8C733E] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#8C733E]">SCIENTIFIC CAVEAT & PROTOTYPE BENCHMARK:</strong>{' '}
            <span>
              The values (+50% to +65%, ~80% composite) are presented as{' '}
              <strong className="text-[#171A18]">simulation targets</strong> based on published immobilized alginate hydrogel kinetic models and fine-bubble ceramic sparging dynamics. For the physical hackathon prototype, these numbers will eventually be calibrated against empirical sensor logs from Algae Tank 01 and Algae Tank 02.
            </span>
          </div>
        </div>

        {/* ESP32 Closed-Loop Optimization Breakdown Collapsible */}
        <div className="mt-3 pt-2 border-t border-[#DDD8CD] flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowEsp32Details(!showEsp32Details)}
            className="text-[#0B4D20] hover:underline flex items-center gap-1 font-semibold"
          >
            <Cpu className="w-3.5 h-3.5" />
            {showEsp32Details ? 'Hide ESP32 Optimization Parameters' : 'Inspect ESP32 Dynamic Optimization Loops'}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showEsp32Details ? 'rotate-90' : ''}`} />
          </button>

          {onOpenPrinciplesModal && (
            <button
              type="button"
              onClick={onOpenPrinciplesModal}
              className="text-[#5A635C] hover:text-[#171A18] hover:underline flex items-center gap-1"
            >
              Hardware Principles & Equations ↗
            </button>
          )}
        </div>

        {/* Expanded ESP32 Details */}
        {showEsp32Details && (
          <div className="mt-3 p-3.5 bg-[#F4F1EA] rounded-lg border border-[#DDD8CD] text-xs font-mono space-y-2 animate-in fade-in duration-200">
            <div className="font-bold text-[#171A18] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B4D20]"></span>
              ESP32 Closed-Loop Target Balance:
            </div>
            <p className="text-[11px] text-[#4A534C] font-sans leading-relaxed">
              The onboard ESP32 dynamically coordinates 5 biological and physical actuators in real-time to maintain the optimal balance between CO₂ availability, photon flux, mixing, pH buffer, and gas transfer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-[#FAF8F2] p-2 rounded border border-[#DDD8CD]">
                <strong className="text-[#0B4D20]">1. Fan Speed (CFM):</strong> Regulates intake dwell time through pre-filter + HEPA to ensure particle capture without bypassing.
              </div>
              <div className="bg-[#FAF8F2] p-2 rounded border border-[#DDD8CD]">
                <strong className="text-[#0B4D20]">2. LED Spectrum (PAR):</strong> 660nm deep red & 450nm royal blue modulation matched to Chlorella absorption peaks.
              </div>
              <div className="bg-[#FAF8F2] p-2 rounded border border-[#DDD8CD]">
                <strong className="text-[#0B4D20]">3. Air-Pump Fine Bubbles:</strong> Adjusts micro-bubble sparging to maximize gas interfacial area without hydrodynamic cell shear.
              </div>
              <div className="bg-[#FAF8F2] p-2 rounded border border-[#DDD8CD]">
                <strong className="text-[#0B4D20]">4. pH Regulation (7.0–7.4):</strong> Prevents culture acidification as CO₂ dissolves into carbonic acid.
              </div>
              <div className="bg-[#FAF8F2] p-2 rounded sm:col-span-2 border border-[#DDD8CD]">
                <strong className="text-[#0B4D20]">5. Algae Biomass Density:</strong> Optical density (OD680) monitoring prevents mutual shading while maximizing volumetric carbon fixation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
