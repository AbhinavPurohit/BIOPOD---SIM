import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Wind, 
  Sun, 
  Droplets, 
  Flame, 
  Zap, 
  Check, 
  RefreshCw,
  Power,
  Users,
  Gauge
} from 'lucide-react';
import { BioPodControls, OperatingMode, RoomConditions } from '../types';
import { calculatePM25AQI, calculateAQItoPM25 } from '../utils/simulationEngine';

interface SimulationControlsProps {
  room: RoomConditions;
  controls: BioPodControls;
  isSimulating: boolean;
  onUpdateRoom: (newRoom: Partial<RoomConditions>) => void;
  onUpdateControls: (newControls: Partial<BioPodControls>) => void;
  onRunSimulation: () => void;
  onReset: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  room,
  controls,
  isSimulating,
  onUpdateRoom,
  onUpdateControls,
  onRunSimulation,
  onReset,
}) => {
  const modes: OperatingMode[] = ['ECO', 'AUTO', 'BOOST'];
  const numOccupants = room.occupants !== undefined ? room.occupants : 2;
  const aqiInfo = calculatePM25AQI(room.pm25);

  const handleAqiChange = (newAqi: number) => {
    const calculatedPm25 = calculateAQItoPM25(newAqi);
    onUpdateRoom({ pm25: calculatedPm25 });
  };

  return (
    <div
      id="panel-simulation-controls"
      className="w-full bg-[#0C140F] rounded-2xl border border-[#1E3F27] p-4 sm:p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E3F27] mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#69B82F]" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-[#FAF8F2] uppercase">
            SIMULATION INSTRUMENTATION CONTROLS
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#A8DDA2]/70">
          Hardware Actuator PID Tuning
        </span>
      </div>

      {/* Grid: ROOM CONDITIONS vs BIOPOD CONTROL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ================= LEFT COLUMN: ROOM CONDITIONS ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E3F27]">
            <span className="w-2 h-2 rounded-full bg-[#E67E22]"></span>
            <h4 className="text-xs font-mono font-bold text-[#FAF8F2] uppercase tracking-wider">
              ROOM CONDITIONS (ENVIRONMENT)
            </h4>
          </div>

          {/* Occupants Control */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#69B82F]" /> NUMBER OF OCCUPANTS
              </span>
              <span className="font-bold text-[#69B82F] text-sm">
                {numOccupants} {numOccupants === 1 ? 'Person' : 'People'}
              </span>
            </div>
            <input
              id="slider-room-occupants"
              type="range"
              min="1"
              max="12"
              step="1"
              value={numOccupants}
              onChange={(e) => onUpdateRoom({ occupants: Number(e.target.value) })}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8C9A8F] mt-1.5">
              <span>1 (Single)</span>
              <span className="text-[#69B82F] font-semibold">Exhalation Load: +{(numOccupants * 0.32).toFixed(2)} L/min CO₂</span>
              <span>12 (Packed Room)</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 4, 8, 12].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onUpdateRoom({ occupants: n })}
                  className={`flex-1 py-1 text-[10px] font-mono font-bold rounded border transition-all cursor-pointer ${
                    numOccupants === n
                      ? 'bg-[#1E5C33] text-white border-[#69B82F]'
                      : 'bg-[#0C1711] text-[#8C9A8F] border-[#1E3F27] hover:bg-[#14261B]'
                  }`}
                >
                  {n}P
                </button>
              ))}
            </div>
          </div>

          {/* Slider 1: CO2 */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#E67E22]" /> INITIAL CO₂ CONCENTRATION
              </span>
              <span className="font-bold text-[#69B82F] text-sm">
                {room.co2} <span className="text-xs font-normal">ppm</span>
              </span>
            </div>
            <input
              id="slider-room-co2"
              type="range"
              min="500"
              max="2000"
              step="25"
              value={room.co2}
              onChange={(e) => onUpdateRoom({ co2: Number(e.target.value) })}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8C9A8F] mt-1">
              <span>500 ppm (Fresh Outdoor)</span>
              <span>1000 ppm (Fatigue)</span>
              <span>2000 ppm (Hazardous)</span>
            </div>
          </div>

          {/* AQI Variable Control */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#69B82F]" /> AQI
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded font-mono border"
                  style={{
                    backgroundColor: `${aqiInfo.color}25`,
                    color: aqiInfo.color,
                    borderColor: `${aqiInfo.color}60`,
                  }}
                >
                  {aqiInfo.label}
                </span>
                <span className="font-bold text-[#69B82F] text-sm">
                  {aqiInfo.aqi} <span className="text-xs font-normal">AQI</span>
                </span>
              </div>
            </div>
            <input
              id="slider-room-aqi"
              type="range"
              min="10"
              max="300"
              step="1"
              value={aqiInfo.aqi}
              onChange={(e) => handleAqiChange(Number(e.target.value))}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8C9A8F] mt-1">
              <span>50 (Good)</span>
              <span>100 (Moderate)</span>
              <span>150 (Unhealthy)</span>
              <span>200+ (Hazardous)</span>
            </div>
            {/* Quick selection chips for standard AQI states */}
            <div className="flex gap-1.5 mt-2">
              {[
                { val: 45, label: '45 (Good)' },
                { val: 85, label: '85 (Moderate)' },
                { val: 156, label: '156 (Unhealthy)' },
                { val: 220, label: '220 (Very Unhealthy)' },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => handleAqiChange(chip.val)}
                  className={`flex-1 py-1 text-[9.5px] font-mono font-medium rounded border transition-all cursor-pointer ${
                    Math.abs(aqiInfo.aqi - chip.val) <= 5
                      ? 'bg-[#1E5C33] text-white border-[#69B82F]'
                      : 'bg-[#0C1711] text-[#8C9A8F] border-[#1E3F27] hover:bg-[#14261B]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 2: PM2.5 (Synchronized) */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#42B9D9]" /> PM2.5 PARTICULATE DUST
              </span>
              <span className="font-bold text-[#69B82F] text-sm">
                {room.pm25} <span className="text-xs font-normal">µg/m³</span>
              </span>
            </div>
            <input
              id="slider-room-pm25"
              type="range"
              min="0"
              max="200"
              step="1"
              value={room.pm25}
              onChange={(e) => onUpdateRoom({ pm25: Number(e.target.value) })}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8C9A8F] mt-1">
              <span>0 µg/m³ (Clean Room)</span>
              <span>35 µg/m³ (Moderate)</span>
              <span>150+ µg/m³ (Smog)</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: BIOPOD CONTROL ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E3F27]">
            <span className="w-2 h-2 rounded-full bg-[#69B82F]"></span>
            <h4 className="text-xs font-mono font-bold text-[#FAF8F2] uppercase tracking-wider">
              BIOPOD HARDWARE CONTROL
            </h4>
          </div>

          {/* Fan Speed Slider */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#69B82F]" /> FAN SPEED
              </span>
              <span className="font-bold text-[#69B82F] text-sm">{controls.fanSpeed}%</span>
            </div>
            <input
              id="slider-fan-speed"
              type="range"
              min="20"
              max="100"
              step="5"
              value={controls.fanSpeed}
              onChange={(e) => onUpdateControls({ fanSpeed: Number(e.target.value) })}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8C9A8F] mt-1">
              <span>20% (Quiet 22dB)</span>
              <span>65% (Balanced Auto)</span>
              <span>100% (Turbo Boost)</span>
            </div>
          </div>

          {/* LED Intensity Slider */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="font-semibold text-[#FAF8F2] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#E4B83D]" /> LED ILLUMINATION
              </span>
              <span className="font-bold text-[#69B82F] text-sm">{controls.ledIntensity}%</span>
            </div>
            <input
              id="slider-led-intensity"
              type="range"
              min="20"
              max="100"
              step="5"
              value={controls.ledIntensity}
              onChange={(e) => onUpdateControls({ ledIntensity: Number(e.target.value) })}
              className="w-full accent-[#69B82F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8C9A8F] mt-1">
              <span>20% (Maintenance)</span>
              <span>80% (High Photosynthesis)</span>
              <span>100% (Peak Flux)</span>
            </div>
          </div>

          {/* Air Pump Toggle */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-semibold text-[#FAF8F2] block">
                BIOREACTOR AIR PUMP (SPARGING)
              </span>
              <span className="text-[11px] font-mono text-[#8C9A8F]">
                Micro-bubble gas-liquid mass transfer
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#060D09] p-1 rounded-lg border border-[#1E3F27]">
              <button
                id="airpump-on-btn"
                onClick={() => onUpdateControls({ airPump: true })}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                  controls.airPump
                    ? 'bg-[#1E5C33] text-white shadow-xs'
                    : 'text-[#8C9A8F] hover:text-[#FAF8F2]'
                }`}
              >
                ON
              </button>
              <button
                id="airpump-off-btn"
                onClick={() => onUpdateControls({ airPump: false })}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                  !controls.airPump
                    ? 'bg-[#C0392B] text-white shadow-xs'
                    : 'text-[#8C9A8F] hover:text-[#FAF8F2]'
                }`}
              >
                OFF
              </button>
            </div>
          </div>

          {/* Operating Mode Buttons */}
          <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
            <div className="flex justify-between items-center mb-2 text-xs font-mono font-semibold text-[#FAF8F2]">
              <span>OPERATING MODE</span>
              <span className="text-[11px] font-normal text-[#8C9A8F]">
                Preset Algorithm Profile
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  id={`mode-${m.toLowerCase()}-btn`}
                  onClick={() => {
                    if (m === 'ECO') {
                      onUpdateControls({ mode: 'ECO', fanSpeed: 35, ledIntensity: 40, airPump: true });
                    } else if (m === 'BOOST') {
                      onUpdateControls({ mode: 'BOOST', fanSpeed: 100, ledIntensity: 100, airPump: true });
                    } else {
                      onUpdateControls({ mode: 'AUTO', fanSpeed: 70, ledIntensity: 80, airPump: true });
                    }
                  }}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                    controls.mode === m
                      ? 'bg-[#1E5C33] text-[#FAF8F2] border-[#69B82F] shadow-xs ring-1 ring-[#69B82F]'
                      : 'bg-[#0C1711] text-[#8C9A8F] border-[#1E3F27] hover:bg-[#14261B]'
                  }`}
                >
                  [ {m} ]
                </button>
              ))}
            </div>
          </div>

          {/* Temperature & Humidity Section in Right Column (Directly Below Operating Mode) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="font-semibold text-[#FAF8F2]">TEMP</span>
                <span className="font-bold text-[#69B82F] text-xs">{room.temperature}°C</span>
              </div>
              <input
                id="slider-room-temp"
                type="range"
                min="18"
                max="34"
                step="1"
                value={room.temperature}
                onChange={(e) => onUpdateRoom({ temperature: Number(e.target.value) })}
                className="w-full accent-[#69B82F] cursor-pointer"
              />
            </div>
            <div className="bg-[#080F0A] p-3.5 rounded-xl border border-[#1E3F27]">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="font-semibold text-[#FAF8F2]">HUMIDITY</span>
                <span className="font-bold text-[#69B82F] text-xs">{room.humidity}%</span>
              </div>
              <input
                id="slider-room-humidity"
                type="range"
                min="30"
                max="85"
                step="5"
                value={room.humidity}
                onChange={(e) => onUpdateRoom({ humidity: Number(e.target.value) })}
                className="w-full accent-[#69B82F] cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Action Command Row: RUN SIMULATION & RESET */}
      <div className="mt-8 pt-5 border-t border-[#1E3F27] flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="main-run-simulation-btn"
          onClick={onRunSimulation}
          className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-xl bg-[#69B82F] hover:bg-[#78CC38] active:scale-[0.99] text-[#070B08] font-mono font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current text-[#070B08]" />
          <span>{isSimulating ? 'SIMULATION IN PROGRESS...' : 'RUN SIMULATION'}</span>
        </button>

        <button
          id="main-reset-btn"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#080F0A] hover:bg-[#0E1B13] active:scale-[0.99] text-[#FAF8F2] font-mono font-semibold text-sm border border-[#1E3F27] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#8C9A8F]" />
          <span>RESET TO INITIAL</span>
        </button>
      </div>
    </div>
  );
};
