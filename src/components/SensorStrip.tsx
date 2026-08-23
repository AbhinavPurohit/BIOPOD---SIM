import React from 'react';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Activity, Wind, Flame, Droplets } from 'lucide-react';
import { SimulationDataPoint, RoomConditions } from '../types';

interface SensorStripProps {
  currentPoint: SimulationDataPoint;
  initialRoom: RoomConditions;
  tempUnit: 'C' | 'F';
}

export const SensorStrip: React.FC<SensorStripProps> = ({
  currentPoint,
  initialRoom,
  tempUnit,
}) => {
  // Delta calculations
  const co2DeltaPct = Math.round(((currentPoint.roomCo2 - initialRoom.co2) / initialRoom.co2) * 100);
  const pmDeltaPct = Math.round(
    ((currentPoint.roomPm25 - initialRoom.pm25) / Math.max(1, initialRoom.pm25)) * 100
  );

  const displayTemp =
    tempUnit === 'C'
      ? `${currentPoint.roomTemp}°C`
      : `${((currentPoint.roomTemp * 9) / 5 + 32).toFixed(1)}°F`;

  // AQI status badge
  let aqiBadge = 'GOOD';
  let aqiTextColor = 'text-[#0B4D20]';
  if (currentPoint.aqi > 150) {
    aqiBadge = 'UNHEALTHY';
    aqiTextColor = 'text-[#C0392B]';
  } else if (currentPoint.aqi > 100) {
    aqiBadge = 'MODERATE-HIGH';
    aqiTextColor = 'text-[#E67E22]';
  } else if (currentPoint.aqi > 50) {
    aqiBadge = 'MODERATE';
    aqiTextColor = 'text-[#D4A017]';
  }

  return (
    <div
      id="sensor-strip-rail"
      className="w-full bg-[#FAF8F2] border-y border-[#D8D4C8] shadow-xs"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#DCD7CB]">
        {/* Metric 1: CO2 */}
        <div id="sensor-metric-co2" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              CO₂ LEVEL
            </span>
            <span className="text-[10px] font-mono text-[#0B4D20] bg-[#E5EFE7] px-1 py-0.2 rounded">
              NDIR SENSOR
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#171A18]">
              {currentPoint.roomCo2}
            </span>
            <span className="text-xs font-mono text-[#6A736C]">ppm</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono font-medium">
            {co2DeltaPct <= 0 ? (
              <span className="text-[#0B4D20] flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {Math.abs(co2DeltaPct)}%
              </span>
            ) : (
              <span className="text-[#C0392B] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{co2DeltaPct}%
              </span>
            )}
            <span className="text-[#7D867F]">vs initial</span>
          </div>
        </div>

        {/* Metric 2: PM2.5 */}
        <div id="sensor-metric-pm25" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              PM2.5 DUST
            </span>
            <span className="text-[10px] font-mono text-[#42B9D9] bg-[#E6F6FA] px-1 py-0.2 rounded">
              LASER OPTICAL
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#171A18]">
              {currentPoint.roomPm25}
            </span>
            <span className="text-xs font-mono text-[#6A736C]">µg/m³</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono font-medium">
            {pmDeltaPct <= 0 ? (
              <span className="text-[#0B4D20] flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {Math.abs(pmDeltaPct)}%
              </span>
            ) : (
              <span className="text-[#C0392B] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{pmDeltaPct}%
              </span>
            )}
            <span className="text-[#7D867F]">vs initial</span>
          </div>
        </div>

        {/* Metric 3: AQI */}
        <div id="sensor-metric-aqi" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              AIR INDEX (AQI)
            </span>
            <span className="text-[10px] font-mono text-[#5A635C]">US EPA</span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#171A18]">
              {currentPoint.aqi}
            </span>
            <span className={`text-[11px] font-mono font-semibold ${aqiTextColor}`}>
              {aqiBadge}
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#6A736C]">
            {currentPoint.aqi <= 50 ? 'Optimal Cognitive Range' : 'Active Purification'}
          </div>
        </div>

        {/* Metric 4: TEMP */}
        <div id="sensor-metric-temp" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              TEMP / RH
            </span>
            <span className="text-[10px] font-mono text-[#5A635C]">BME688</span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#171A18]">
              {displayTemp}
            </span>
            <span className="text-xs font-mono text-[#6A736C]">
              / {currentPoint.roomHumidity}%
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#0B4D20] font-medium">
            COMFORTABLE NORMAL
          </div>
        </div>

        {/* Metric 5: ALGAE */}
        <div id="sensor-metric-algae" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              ALGAE BIOMASS
            </span>
            <span className="text-[10px] font-mono text-[#69B82F] bg-[#EEF8E7] px-1 py-0.2 rounded">
              CHLORELLA
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#171A18]">
              {currentPoint.algaeDensity}%
            </span>
            <span className="text-xs font-mono text-[#69B82F] font-semibold">HEALTHY</span>
          </div>
          <div className="text-[11px] font-mono text-[#6A736C]">
            O₂ Gen: +{currentPoint.o2GeneratedLiters} L
          </div>
        </div>

        {/* Metric 6: HEALTH */}
        <div id="sensor-metric-health" className="px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A635C]">
              SYSTEM HEALTH
            </span>
            <span className="text-[10px] font-mono text-[#0B4D20]">ALL SENSORS</span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#0B4D20]">
              {currentPoint.systemHealth}%
            </span>
            <span className="text-xs font-mono text-[#0B4D20] font-semibold">EXCELLENT</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#5A635C]">
            <CheckCircle2 className="w-3 h-3 text-[#0B4D20]" />
            Continuous Diagnostics
          </div>
        </div>
      </div>
    </div>
  );
};
