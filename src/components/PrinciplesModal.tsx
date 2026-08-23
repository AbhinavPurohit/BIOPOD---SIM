import React from 'react';
import { 
  X, 
  BookOpen, 
  Wind, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Droplets, 
  CheckCircle2,
  Cpu,
  Gauge,
  Sliders,
  Sun,
  Activity,
  Zap
} from 'lucide-react';

interface PrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinciplesModal: React.FC<PrinciplesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-principles-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-principles-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F2] border-2 border-[#1E5C33] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
      >
        {/* Header */}
        <div className="bg-[#0B3A1A] text-[#FAF8F2] p-5 sm:p-6 flex items-center justify-between border-b border-[#1E5C33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#134D25] border border-[#257339] flex items-center justify-center text-[#69B82F] shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-[#FAF8F2]">
                BIOPOD ENGINEERING & BIOLOGICAL PRINCIPLES
              </h3>
              <p className="text-[11px] text-[#A8DDA2] font-mono">
                Multi-Stage Mechanical Filtration + Microalgae Photobioreactor
              </p>
            </div>
          </div>
          <button
            id="close-principles-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#092D16] hover:bg-[#103D1F] text-[#FAF8F2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto font-mono text-xs text-[#2A332C]">
          
          {/* Upgrade Comparison Benchmark */}
          <div className="bg-[#FAF8F2] p-4 rounded-2xl border-2 border-[#1E5C33] space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CD]">
              <span className="font-bold text-[#0B4D20] uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0B4D20]" />
                STANDARD VS. UPGRADED BIOPOD BENCHMARK
              </span>
              <span className="text-[10px] bg-[#0B4D20] text-white px-2.5 py-0.5 rounded-full font-bold">
                SIMULATED / TARGET PERFORMANCE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              <div className="bg-[#F4F1EA] p-2.5 rounded-xl border border-[#DDD8CD]">
                <span className="text-[10px] text-[#5A635C] block">Photosynthesis</span>
                <span className="font-bold text-[#0B4D20] text-sm">+50%</span>
                <span className="text-[9px] text-[#6A736C] block">(+45–55%)</span>
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded-xl border border-[#DDD8CD]">
                <span className="text-[10px] text-[#5A635C] block">CO₂ Capture</span>
                <span className="font-bold text-[#0B4D20] text-sm">+58%</span>
                <span className="text-[9px] text-[#6A736C] block">(+50–65%)</span>
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded-xl border border-[#DDD8CD]">
                <span className="text-[10px] text-[#5A635C] block">O₂ Generation</span>
                <span className="font-bold text-[#0B4D20] text-sm">+50%</span>
                <span className="text-[9px] text-[#6A736C] block">(+45–55%)</span>
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded-xl border border-[#DDD8CD]">
                <span className="text-[10px] text-[#5A635C] block">Gas Transfer</span>
                <span className="font-bold text-[#0B4D20] text-sm">+52%</span>
                <span className="text-[9px] text-[#6A736C] block">(+45–60%)</span>
              </div>
              <div className="bg-[#EAF3EB] p-2.5 rounded-xl border border-[#C2E0C7] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#0B4D20] block font-bold">Overall Loop</span>
                <span className="font-bold text-[#0B4D20] text-base">+80%</span>
                <span className="text-[9px] text-[#0B4D20] block font-semibold">Headline Gain</span>
              </div>
            </div>

            <p className="text-[10px] font-sans text-[#6A736C] leading-normal pt-1 italic">
              * Note: +55% and ~80% are presented as simulation targets based on immobilized alginate hydrogel and ceramic fine-bubble aeration kinetic models. A prototype will validate these values under live testing conditions.
            </p>
          </div>

          {/* Upgraded Hardware Flow Diagram */}
          <div className="bg-[#101712] text-white p-5 rounded-2xl border border-[#1E3F27] space-y-3.5 shadow-md">
            <div className="text-center font-bold text-[#69B82F] text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              BEST BIOPOD UPGRADE ARCHITECTURE
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center text-[11px]">
              <div className="bg-[#0B2418] text-[#42B9D9] px-4 py-1.5 rounded-full border border-[#1E4D34] font-bold">
                AIR IN (Dirty Ambient Room Air)
              </div>
              <span className="text-[#69B82F] font-bold">↓</span>
              <div className="bg-[#1C261F] px-4 py-1.5 rounded-xl border border-[#2F4234] w-56 font-bold text-[#FAF8F2]">
                FAN (Ultra-Quiet Brushless DC)
              </div>
              <span className="text-[#69B82F] font-bold">↓</span>
              <div className="bg-[#1C261F] px-4 py-1.5 rounded-xl border border-[#2F4234] w-56 font-bold text-[#E4B83D]">
                PRE-FILTER (&gt;10µm Coarse Mesh)
              </div>
              <span className="text-[#69B82F] font-bold">↓</span>
              <div className="bg-[#1C261F] px-4 py-1.5 rounded-xl border border-[#2F4234] w-56 font-bold text-[#42B9D9]">
                TRUE HEPA H13 (99.97% @ 0.1µm)
              </div>
              <span className="text-[#69B82F] font-bold">↓↓ Dual Split Flow ↓↓</span>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-1">
                <div className="bg-[#07190F] p-3 rounded-xl border border-[#1E5C33] text-left">
                  <div className="font-bold text-[#69B82F] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ALGAE TANK 01
                  </div>
                  <div className="text-[10px] text-[#A8DDA2] mt-1">• Thin Alginate Hydrogel</div>
                  <div className="text-[10px] text-[#A8DDA2]">• Immobilized Chlorella</div>
                  <div className="text-[9px] text-[#42B9D9] mt-1">↑ Fine-Bubble Aeration</div>
                </div>
                <div className="bg-[#07190F] p-3 rounded-xl border border-[#1E5C33] text-left">
                  <div className="font-bold text-[#69B82F] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ALGAE TANK 02
                  </div>
                  <div className="text-[10px] text-[#A8DDA2] mt-1">• Thin Alginate Hydrogel</div>
                  <div className="text-[10px] text-[#A8DDA2]">• Cascade Bio-Scrubbing</div>
                  <div className="text-[9px] text-[#42B9D9] mt-1">↑ Fine-Bubble Aeration</div>
                </div>
              </div>

              <div className="bg-[#0B2418] text-[#42B9D9] px-4 py-2 rounded-xl border border-[#1E4D34] mt-2 font-bold flex items-center gap-2 text-xs">
                <Wind className="w-4 h-4 text-[#69B82F]" />
                <span>AIR PUMP (Continuous micro-bubbles through ceramic spargers)</span>
              </div>
            </div>
          </div>

          {/* ESP32 Dynamic Closed-Loop Optimization — CLEAN MODERN UI CARD LAYOUT */}
          <div className="bg-[#FAF8F2] p-5 rounded-2xl border-2 border-[#1E5C33] space-y-4 shadow-sm">
            
            {/* Header Section with Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2DDD3]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#0B4D20] animate-pulse" />
                <h4 className="font-mono font-bold text-[#0E2014] text-sm flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#0B4D20]" />
                  <span>ESP32 Dynamic Closed-Loop Optimization</span>
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#E5EFE7] text-[#0B4D20] font-bold border border-[#C2DEC8] self-start sm:self-auto">
                REAL-TIME PID CONTROL
              </span>
            </div>

            <p className="text-[#4E5950] font-sans text-xs leading-relaxed">
              The onboard ESP32 micro-controller continuously samples laser optical sensors and adjusts 5 core parameters to maximize photosynthetic rate, carbon capture, and air purification:
            </p>

            {/* 5 Distinct Feature Cards with Rich Visual Icons and Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Card 1: Fan Speed */}
              <div className="bg-[#F3EFE6] p-3.5 rounded-xl border border-[#DDD6C8] hover:border-[#0B4D20] transition-colors space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-[#0B4D20] text-xs font-mono">
                  <Wind className="w-4 h-4 text-[#0B4D20] shrink-0" />
                  <span>1. Fan Speed (Airflow CFM)</span>
                </div>
                <p className="text-[11px] font-sans text-[#526055] leading-relaxed pl-6">
                  Modulates intake CFM to balance air throughput and optimal contact dwell time across the filtration matrix.
                </p>
              </div>

              {/* Card 2: LED Intensity */}
              <div className="bg-[#F3EFE6] p-3.5 rounded-xl border border-[#DDD6C8] hover:border-[#0B4D20] transition-colors space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-[#0B4D20] text-xs font-mono">
                  <Sun className="w-4 h-4 text-[#0B4D20] shrink-0" />
                  <span>2. LED Spectrum & Intensity</span>
                </div>
                <p className="text-[11px] font-sans text-[#526055] leading-relaxed pl-6">
                  Delivers precise 660nm deep-red PAR photons to optimize photosynthetic kinetics while preventing photoinhibition.
                </p>
              </div>

              {/* Card 3: Air-Pump Rate */}
              <div className="bg-[#F3EFE6] p-3.5 rounded-xl border border-[#DDD6C8] hover:border-[#0B4D20] transition-colors space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-[#0B4D20] text-xs font-mono">
                  <Droplets className="w-4 h-4 text-[#0B4D20] shrink-0" />
                  <span>3. Air-Pump & Sparger Rate</span>
                </div>
                <p className="text-[11px] font-sans text-[#526055] leading-relaxed pl-6">
                  Drives fine ceramic bubble aeration to maximize the interfacial gas-liquid transfer area ($K_L a$).
                </p>
              </div>

              {/* Card 4: pH Balance */}
              <div className="bg-[#F3EFE6] p-3.5 rounded-xl border border-[#DDD6C8] hover:border-[#0B4D20] transition-colors space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-[#0B4D20] text-xs font-mono">
                  <Activity className="w-4 h-4 text-[#0B4D20] shrink-0" />
                  <span>4. pH Buffer Equilibrium</span>
                </div>
                <p className="text-[11px] font-sans text-[#526055] leading-relaxed pl-6">
                  Maintains target 7.0–7.4 pH to ensure high dissolved inorganic carbon availability for the microalgae.
                </p>
              </div>

              {/* Card 5: Algae Density */}
              <div className="bg-[#F3EFE6] p-3.5 rounded-xl border border-[#DDD6C8] hover:border-[#0B4D20] transition-colors space-y-1 shadow-xs sm:col-span-2">
                <div className="flex items-center gap-2 font-bold text-[#0B4D20] text-xs font-mono">
                  <Zap className="w-4 h-4 text-[#0B4D20] shrink-0" />
                  <span>5. Algae Biomass & Optical Density (OD680)</span>
                </div>
                <p className="text-[11px] font-sans text-[#526055] leading-relaxed pl-6">
                  Monitors culture turbidity via infrared transmissive sensors to maintain optimal light penetration without mutual cell shading.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F2ECE0] p-4 border-t border-[#DDD8CD] flex justify-end">
          <button
            id="close-principles-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B4D20] hover:bg-[#083817] text-[#FAF8F2] font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            Close Scientific Overview
          </button>
        </div>

      </div>
    </div>
  );
};
