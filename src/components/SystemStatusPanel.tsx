import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Fan, 
  Layers, 
  ShieldCheck, 
  Droplet, 
  Sun, 
  Activity,
  Workflow
} from 'lucide-react';
import { BioPodControls, SimulationDataPoint } from '../types';

interface SystemStatusPanelProps {
  controls: BioPodControls;
  currentPoint: SimulationDataPoint;
  onSelectTank: (tankId: '01' | '02') => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  controls,
  currentPoint,
  onSelectTank,
}) => {
  const fanText = controls.mode === 'AUTO' ? `${controls.fanSpeed}% AUTO` : `${controls.fanSpeed}% MANUAL`;
  const fanHealth = 'HEALTHY';
  const preFilterHealth = 'HEALTHY';
  const hepaHealth = 'HEALTHY';
  const tank01Health = currentPoint.algaeDensity > 50 ? 'HEALTHY' : 'ATTENTION';
  const tank02Health = currentPoint.algaeDensity > 50 ? 'HEALTHY' : 'ATTENTION';
  const pumpHealth = controls.airPump ? 'HEALTHY' : 'ATTENTION';

  // Status Indicator Component
  const StatusDot = ({ status }: { status: 'HEALTHY' | 'ATTENTION' | 'FAULT' }) => {
    if (status === 'HEALTHY') {
      return (
        <span className="flex items-center gap-1.5 text-[#0B4D20]">
          <span className="w-2 h-2 rounded-full bg-[#0B4D20]"></span>
        </span>
      );
    }
    if (status === 'ATTENTION') {
      return (
        <span className="flex items-center gap-1.5 text-[#E4B83D]">
          <span className="w-2 h-2 rounded-full bg-[#E4B83D]"></span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[#C0392B]">
        <span className="w-2 h-2 rounded-full bg-[#C0392B]"></span>
      </span>
    );
  };

  return (
    <div
      id="panel-system-status"
      className="w-full bg-[#FAF8F2] rounded-xl border border-[#D8D4C8] p-4 sm:p-6 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D4C8] mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0B4D20]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#171A18] uppercase">
              SYSTEM HARDWARE STATUS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#0B4D20] bg-[#E5EFE7] px-2 py-0.5 rounded font-semibold border border-[#BEDEC5]">
            ONLINE (POLLING 100ms)
          </span>
        </div>

        {/* Hardware Status Checklist */}
        <div className="space-y-2.5 font-mono text-xs">
          
          {/* FAN */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status={fanHealth} />
              <span className="text-[#171A18] font-medium">FAN (INTAKE)</span>
            </div>
            <span className="text-[#0B4D20] font-semibold">{fanText}</span>
          </div>

          {/* PRE-FILTER */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status={preFilterHealth} />
              <span className="text-[#171A18] font-medium">PRE-FILTER</span>
            </div>
            <span className="text-[#0B4D20] font-semibold">ACTIVE</span>
          </div>

          {/* HEPA */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status={hepaHealth} />
              <span className="text-[#171A18] font-medium">HEPA H13</span>
            </div>
            <span className="text-[#0B4D20] font-semibold">ACTIVE (99.97%)</span>
          </div>

          {/* ALGAE TANK 01 */}
          <div
            onClick={() => onSelectTank('01')}
            className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#EAF3EB] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <StatusDot status={tank01Health} />
              <span className="text-[#171A18] font-medium group-hover:text-[#0B4D20] flex items-center gap-1">
                ALGAE TANK 01
                <span className="text-[10px] text-[#5A635C] group-hover:underline">↗</span>
              </span>
            </div>
            <span className="text-[#0B4D20] font-semibold">ACTIVE ({currentPoint.algaeDensity}%)</span>
          </div>

          {/* ALGAE TANK 02 */}
          <div
            onClick={() => onSelectTank('02')}
            className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#EAF3EB] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <StatusDot status={tank02Health} />
              <span className="text-[#171A18] font-medium group-hover:text-[#0B4D20] flex items-center gap-1">
                ALGAE TANK 02
                <span className="text-[10px] text-[#5A635C] group-hover:underline">↗</span>
              </span>
            </div>
            <span className="text-[#0B4D20] font-semibold">ACTIVE ({currentPoint.algaeDensity}%)</span>
          </div>

          {/* AIR PUMP */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status={pumpHealth} />
              <span className="text-[#171A18] font-medium">AIR PUMP</span>
            </div>
            <span className={controls.airPump ? 'text-[#0B4D20] font-semibold' : 'text-[#E4B83D] font-semibold'}>
              {controls.airPump ? 'ON (SPARGING)' : 'PAUSED'}
            </span>
          </div>

          {/* LED */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status="HEALTHY" />
              <span className="text-[#171A18] font-medium">LED PAR ARRAY</span>
            </div>
            <span className="text-[#0B4D20] font-semibold">{controls.ledIntensity}%</span>
          </div>

          {/* DRAINAGE & NUTRIENTS */}
          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-[#F2EFE6] transition-colors">
            <div className="flex items-center gap-2">
              <StatusDot status="HEALTHY" />
              <span className="text-[#171A18] font-medium">DRAINAGE & NUTRIENTS</span>
            </div>
            <span className="text-[#0B4D20] font-semibold">READY</span>
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH BAR SECTION */}
      <div className="mt-5 pt-4 border-t border-[#D8D4C8]">
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
          <span className="font-bold text-[#171A18] uppercase tracking-wider">
            OVERALL SYSTEM HEALTH
          </span>
          <span className="font-bold text-[#0B4D20]">{currentPoint.systemHealth}%</span>
        </div>

        {/* Technical Progress Bar */}
        <div className="w-full bg-[#E5E1D5] h-3.5 rounded-lg overflow-hidden p-0.5 border border-[#D0CBBF]">
          <div
            className="bg-[#0B4D20] h-full rounded-md transition-all duration-300 relative"
            style={{ width: `${currentPoint.systemHealth}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#69B82F]/30 to-transparent"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-[#6A736C]">
          <span>● Green = Healthy</span>
          <span>● Amber = Attention</span>
          <span>● Red = Fault</span>
        </div>
      </div>
    </div>
  );
};
