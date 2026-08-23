import React from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Wind, 
  Flame, 
  TreePine,
  Share2
} from 'lucide-react';
import { SimulationDataPoint, SimulationResult } from '../types';

interface SimulationResultModalProps {
  result: SimulationResult;
  dataPoints: SimulationDataPoint[];
  onClose: () => void;
  onRunAgain: () => void;
}

export const SimulationResultModal: React.FC<SimulationResultModalProps> = ({
  result,
  dataPoints,
  onClose,
  onRunAgain,
}) => {
  const exportCSV = () => {
    const headers = 'Minute,CO2_ppm,PM25_ug_m3,Temperature_C,Humidity_pct,AQI,AlgaeDensity_pct,O2_Generated_Liters,O2_Enrichment_ppm,Room_O2_pct\n';
    const rows = dataPoints
      .map(
        (d) =>
          `${d.minute},${d.roomCo2},${d.roomPm25},${d.roomTemp},${d.roomHumidity},${d.aqi},${d.algaeDensity},${d.o2GeneratedLiters},${d.o2EnrichmentPpm || 0},${d.roomO2Pct || 20.95}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BioPod_Simulation_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="modal-simulation-result-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-simulation-result-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F2] border-2 border-[#0B4D20] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#0B4D20] text-[#FAF8F2] p-6 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#69B82F]/20 border border-[#69B82F] text-[#69B82F] mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-mono font-bold tracking-wider uppercase">
            SIMULATION COMPLETE
          </h3>
          <p className="text-xs font-mono text-[#A8DDA2] mt-0.5">
            60 MINUTES CONTINUOUS FILTRATION & BIO-CAPTURE BENCHMARK
          </p>
        </div>

        {/* Core Results Grid matching wireframe */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 font-mono">
            {/* Metric 1: CO2 */}
            <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#DDD8CD]">
              <span className="text-xs text-[#5A635C] flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-[#E67E22]" /> CO₂ REDUCTION
              </span>
              <div className="text-lg font-bold text-[#171A18] mt-2 flex items-center gap-2">
                <span>{result.initialCo2}</span>
                <ArrowRight className="w-4 h-4 text-[#0B4D20]" />
                <span className="text-[#0B4D20]">{result.finalCo2} ppm</span>
              </div>
              <span className="text-[11px] text-[#0B4D20] font-semibold block mt-1">
                ↓ {Math.round(((result.initialCo2 - result.finalCo2) / result.initialCo2) * 100)}% absorbed ({result.totalCo2SequesteredGrams}g CO₂)
              </span>
            </div>

            {/* Metric 2: PM2.5 */}
            <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#DDD8CD]">
              <span className="text-xs text-[#5A635C] flex items-center gap-1.5 font-medium">
                <Wind className="w-3.5 h-3.5 text-[#42B9D9]" /> PM2.5 CLEANSE
              </span>
              <div className="text-lg font-bold text-[#171A18] mt-2 flex items-center gap-2">
                <span>{result.initialPm25}</span>
                <ArrowRight className="w-4 h-4 text-[#0B4D20]" />
                <span className="text-[#0B4D20]">{result.finalPm25} µg/m³</span>
              </div>
              <span className="text-[11px] text-[#0B4D20] font-semibold block mt-1">
                ↓ {Math.round(((result.initialPm25 - result.finalPm25) / Math.max(1, result.initialPm25)) * 100)}% particulate filtered
              </span>
            </div>

            {/* Metric 3: ALGAE DENSITY */}
            <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#DDD8CD]">
              <span className="text-xs text-[#5A635C] flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#69B82F]" /> ALGAE BIOMASS
              </span>
              <div className="text-lg font-bold text-[#171A18] mt-2 flex items-center gap-2">
                <span>{result.initialAlgae}%</span>
                <ArrowRight className="w-4 h-4 text-[#69B82F]" />
                <span className="text-[#69B82F]">{result.finalAlgae}%</span>
              </div>
              <span className="text-[11px] text-[#5A635C] block mt-1">
                Carbon fixation biomass growth
              </span>
            </div>

            {/* Metric 4: SYSTEM HEALTH */}
            <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#DDD8CD]">
              <span className="text-xs text-[#5A635C] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4D20]" /> SYSTEM HEALTH
              </span>
              <div className="text-lg font-bold text-[#171A18] mt-2 flex items-center gap-2">
                <span>{result.initialHealth}%</span>
                <ArrowRight className="w-4 h-4 text-[#0B4D20]" />
                <span className="text-[#0B4D20]">{result.finalHealth}%</span>
              </div>
              <span className="text-[11px] text-[#0B4D20] font-semibold block mt-1">
                EXCELLENT OPERATING BENCHMARK
              </span>
            </div>
          </div>

          {/* Cognitive & Biological Impact Card */}
          <div className="bg-[#EAF3EB] border border-[#BEDEC5] p-4 rounded-xl font-mono text-xs flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B4D20] text-white flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#171A18]">
                ESTIMATED COGNITIVE FOCUS BOOST: +{result.cognitiveFocusBoostPct}%
              </div>
              <p className="text-[#4E6654] font-sans text-xs mt-0.5">
                Harvard T.H. Chan environmental health models demonstrate that maintaining CO₂ below 850 ppm improves crisis response and cognitive processing speed by over 20%.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#EFECE2] p-4 border-t border-[#D8D4C8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="export-csv-btn"
            onClick={exportCSV}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#FAF8F2] hover:bg-[#FAF8F2]/80 text-[#171A18] font-mono text-xs border border-[#D5D0C3] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5A635C]" />
            EXPORT TELEMETRY (CSV)
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="run-again-btn"
              onClick={onRunAgain}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B4D20] hover:bg-[#083D19] text-[#FAF8F2] font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#69B82F]" />
              [ RUN AGAIN ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
