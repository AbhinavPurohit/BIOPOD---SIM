import React from 'react';
import { Settings, BookOpen } from 'lucide-react';
import { SimulationPreset } from '../types';

interface HeaderProps {
  currentPresetId: string;
  presets: SimulationPreset[];
  onSelectPreset: (preset: SimulationPreset) => void;
  isSimulating: boolean;
  currentMinute: number;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPresetId,
  presets,
  onSelectPreset,
  isSimulating,
  currentMinute,
  onOpenSettings,
  onOpenInfo,
}) => {
  return (
    <header
      id="biopod-main-header"
      className="w-full bg-[#0C120E]/80 backdrop-blur-xl border-b border-[#1E2B21]/70 sticky top-0 z-30 px-4 sm:px-8 lg:px-12 py-3 shadow-lg transition-colors"
    >
      <div className="max-w-[1560px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: BioPod brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0B4D20] text-[#FAF8F2] flex items-center justify-center font-black text-xl shadow-md border border-[#1E5C33]">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#FAF8F2] flex items-center gap-1.5 font-mono">
                BIOPOD
                <span className="text-[10px] font-mono font-bold uppercase bg-[#0B2E17] text-[#69B82F] px-2 py-0.5 rounded-full border border-[#1E5C33]">
                  v2.4 IoT
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#8C9A8F] font-medium tracking-wide">
              Breathe better. <span className="text-[#69B82F] font-semibold">Think sharper.</span>
            </p>
          </div>
        </div>

        {/* Center: Live Simulation Status Indicator */}
        <div className="flex items-center gap-2.5 bg-[#060A08] px-3.5 py-1.5 rounded-lg border border-[#1E2E22] shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isSimulating ? 'bg-[#69B82F]' : 'bg-[#0B4D20]'
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSimulating ? 'bg-[#69B82F]' : 'bg-[#69B82F]'
                }`}
              ></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-[#69B82F] uppercase">
              {isSimulating ? `SIMULATING (${currentMinute}m / 60m)` : 'SYSTEM ONLINE'}
            </span>
          </div>
          <span className="text-[#2C3E31]">|</span>
          <span className="text-[11px] font-mono text-[#A8DDA2]/70">
            CORE PHOTOBIOREACTOR ACTIVE
          </span>
        </div>

        {/* Right: Quick actions & settings */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="relative">
            <select
              id="preset-scenario-selector"
              aria-label="Preset Environment Scenarios"
              value={currentPresetId}
              onChange={(e) => {
                const found = presets.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="text-xs font-mono bg-[#141C16] hover:bg-[#1A251D] text-[#FAF8F2] border border-[#2B3E30] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#69B82F]"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-[#141C16] text-[#FAF8F2]">
                  Preset: {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Technical Specs & Principles Modal */}
          <button
            id="open-info-btn"
            onClick={onOpenInfo}
            title="BioPod Flow Science & Diagram"
            className="p-2 rounded-lg bg-[#141C16] hover:bg-[#1A251D] border border-[#2B3E30] text-[#FAF8F2] text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#69B82F]" />
            <span className="hidden md:inline text-xs font-mono">Principles</span>
          </button>

          {/* System Settings Modal */}
          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            title="Engineering Calibration Settings"
            className="p-2 rounded-lg bg-[#141C16] hover:bg-[#1A251D] border border-[#2B3E30] text-[#FAF8F2] text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#8C9A8F] hover:text-[#FAF8F2]" />
            <span className="hidden md:inline text-xs font-mono">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
