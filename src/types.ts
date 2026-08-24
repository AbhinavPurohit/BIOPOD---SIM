export interface RoomConditions {
  co2: number; // ppm (500 - 2000)
  pm25: number; // µg/m³ (0 - 250)
  temperature: number; // °C (18 - 36)
  humidity: number; // % (30 - 90)
  occupants: number; // number of people (1 - 12)
}

export type OperatingMode = 'ECO' | 'AUTO' | 'BOOST' | 'MANUAL';
export type BioPodArchitecture = 'STANDARD' | 'UPGRADED';

export interface BioPodControls {
  fanSpeed: number; // % (20 - 100)
  ledIntensity: number; // % (20 - 100)
  airPump: boolean;
  mode: OperatingMode;
  architecture?: BioPodArchitecture; // STANDARD (100% baseline) or UPGRADED (Hydrogel + Fine Bubble)
}

export interface UpgradedPerformanceMetrics {
  photosynthesisPct: number; // e.g. +50% (range 45-55)
  co2CapturePct: number; // e.g. +58% (range 50-65)
  o2GenerationPct: number; // e.g. +50% (range 45-55)
  gasTransferPct: number; // e.g. +52% (range 45-60)
  overallBioLoopPct: number; // e.g. +80% (~80% headline composite)
  label: string; // 'SIMULATED / TARGET PERFORMANCE'
  caveat: string;
}

export interface TankDetails {
  id: '01' | '02';
  name: string;
  species: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
  density: number; // % (40 - 100)
  ph: number; // e.g. 7.1
  temperature: number; // °C
  dissolvedO2: number; // mg/L
  dissolvedCO2: number; // mg/L
  nutrientLevel: number; // %
  aerationRate: number; // L/min
  ledWavelength: string; // e.g. "660nm / 450nm"
  co2UptakeRate: number; // g/hr
}

export interface SimulationDataPoint {
  minute: number;
  roomCo2: number;
  roomPm25: number;
  roomTemp: number;
  roomHumidity: number;
  aqi: number;
  algaeDensity: number;
  o2GeneratedLiters: number;
  o2EnrichmentPpm: number;
  roomO2Pct: number;
  co2RemovedPpm: number;
  systemHealth: number;
  fanRpm: number;
}

export interface SimulationResult {
  initialCo2: number;
  finalCo2: number;
  initialPm25: number;
  finalPm25: number;
  initialAlgae: number;
  finalAlgae: number;
  initialHealth: number;
  finalHealth: number;
  totalCo2SequesteredGrams: number;
  totalPm25FilteredMg: number;
  totalO2ProducedLiters: number;
  cognitiveFocusBoostPct: number;
  aqiImprovement: { from: number; to: number; fromLabel: string; toLabel: string };
}

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  room: RoomConditions;
  controls: BioPodControls;
}

export interface SystemCalibration {
  roomVolumeM3: number; // default 45 m³ (standard 18m² room)
  bioreactorVolumeLiters: number; // default 12 L
  tempUnit: 'C' | 'F';
}
