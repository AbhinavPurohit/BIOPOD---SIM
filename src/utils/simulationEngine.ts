import { BioPodControls, RoomConditions, SimulationDataPoint, SimulationPreset, SimulationResult, SystemCalibration, UpgradedPerformanceMetrics } from '../types';

export const UPGRADED_PERFORMANCE_METRICS: UpgradedPerformanceMetrics = {
  photosynthesisPct: 50, // +45–55%
  co2CapturePct: 58, // +50–65%
  o2GenerationPct: 50, // +45–55%
  gasTransferPct: 52, // +45–60%
  overallBioLoopPct: 80, // ~80% headline composite improvement
  label: 'SIMULATED / TARGET PERFORMANCE',
  caveat: '+55% and ~80% are presented as simulated targets based on immobilized alginate hydrogel and fine-bubble ceramic sparging models, not experimentally validated claims. Dual-tank hackathon hardware will supply measured empirical benchmarks.',
};

/**
 * Calculates US EPA AQI from PM2.5 concentration in µg/m³
 */
export function calculatePM25AQI(pm25: number): { aqi: number; label: string; color: string } {
  const c = Math.max(0, pm25);
  let aqi = 0;
  let label = 'GOOD';
  let color = '#0B4D20'; // BioPod green

  if (c <= 12.0) {
    aqi = Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
    label = 'GOOD';
    color = '#0B4D20';
  } else if (c <= 35.4) {
    aqi = Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
    label = 'MODERATE';
    color = '#E4B83D';
  } else if (c <= 55.4) {
    aqi = Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
    label = 'UNHEALTHY SENSITIVE';
    color = '#E67E22';
  } else if (c <= 150.4) {
    aqi = Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
    label = 'UNHEALTHY';
    color = '#C0392B';
  } else {
    aqi = Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
    label = 'VERY UNHEALTHY';
    color = '#8E44AD';
  }

  return { aqi: Math.min(500, Math.max(1, aqi)), label, color };
}

/**
 * Calculates approximate PM2.5 in µg/m³ from an EPA AQI value
 */
export function calculateAQItoPM25(aqi: number): number {
  const index = Math.max(1, Math.min(500, aqi));
  if (index <= 50) {
    return Number(((index / 50) * 12.0).toFixed(1));
  } else if (index <= 100) {
    return Number((12.1 + ((index - 51) / (100 - 51)) * (35.4 - 12.1)).toFixed(1));
  } else if (index <= 150) {
    return Number((35.5 + ((index - 101) / (150 - 101)) * (55.4 - 35.5)).toFixed(1));
  } else if (index <= 200) {
    return Number((55.5 + ((index - 151) / (200 - 151)) * (150.4 - 55.5)).toFixed(1));
  } else if (index <= 300) {
    return Number((150.5 + ((index - 201) / (300 - 201)) * (250.4 - 150.5)).toFixed(1));
  } else {
    return Number((250.5 + ((index - 301) / (500 - 301)) * (500.0 - 250.5)).toFixed(1));
  }
}

/**
 * Generates exact minute-by-minute simulation curve from t = 0 to 60 minutes
 */
export function generateSimulationData(
  room: RoomConditions,
  controls: BioPodControls,
  calibration: SystemCalibration
): SimulationDataPoint[] {
  const points: SimulationDataPoint[] = [];
  const V = calibration.roomVolumeM3 || 45; // m³

  // Direct user-driven hardware controls
  const effectiveFan = Math.max(10, Math.min(100, controls.fanSpeed));
  const effectiveLed = Math.max(10, Math.min(100, controls.ledIntensity));
  const effectivePump = controls.airPump;

  // Airflow rate in m³/min (Fan % 20..100 maps to 1.2 .. 4.5 m³/min)
  const airflowM3PerMin = (0.8 + (effectiveFan / 100) * 3.7);

  // PM2.5 HEPA clean air delivery rate (CADR) efficiency ~ 99.7%
  const hepaEfficiency = 0.997;
  const naturalSettlingRatePerMin = 0.003; // natural deposition
  const pmRemovalFractionPerMin = ((airflowM3PerMin * hepaEfficiency) / V) + naturalSettlingRatePerMin;

  // Algae Photosynthesis Bio-kinetic coefficient
  // Light factor directly proportional to LED illumination irradiance (0.1 to 1.0)
  const lightFactor = effectiveLed / 100;
  
  // Temperature factor (optimum 24-27°C)
  const tempOptimal = 25.5;
  const tempDeviation = Math.abs(room.temperature - tempOptimal);
  const tempFactor = Math.max(0.4, 1.0 - (tempDeviation * 0.04));

  // Aeration / sparging factor
  const isUpgraded = controls.architecture !== 'STANDARD';
  const aerationMultiplier = isUpgraded ? (1 + UPGRADED_PERFORMANCE_METRICS.gasTransferPct / 100) : 1.0;
  const bioCaptureMultiplier = isUpgraded ? (1 + UPGRADED_PERFORMANCE_METRICS.co2CapturePct / 100) : 1.0;
  const o2Multiplier = isUpgraded ? (1 + UPGRADED_PERFORMANCE_METRICS.o2GenerationPct / 100) : 1.0;

  // Sparging factor: active bubbling provides maximum interfacial contact; passive diffusion is 12%
  const aerationFactor = (effectivePump ? 1.0 : 0.12) * aerationMultiplier;

  // Bio-uptake rate of CO2 per pass through the photobioreactor
  // Scaled directly by LED illumination intensity, temperature, and aeration sparging
  const bioEfficiencyBase = 0.42 * bioCaptureMultiplier;
  const effectiveBioEfficiency = bioEfficiencyBase * lightFactor * tempFactor * aerationFactor;
  
  // CO2 removal fraction per min (algae scrub + room air exchange)
  const co2RemovalFractionPerMin = (airflowM3PerMin * effectiveBioEfficiency) / V;

  // Outdoor baseline equilibrium floor (fresh ambient background air)
  const co2Baseline = 420;
  const pm25Baseline = 5;

  // Baseline standard ambient O2 is 20.946% (209,460 ppm)
  const BASELINE_O2_PCT = 20.946;

  // Photosynthetic Quotient (PQ = moles O2 evolved / moles CO2 fixed)
  const PHOTOSYNTHETIC_QUOTIENT = 1.15;

  let currentCo2 = room.co2;
  let currentPm25 = room.pm25;
  // Algae culture optical density directly powered and sustained by LED illumination (20% -> 55%, 100% -> 90%)
  let algaeDensity = 45 + (effectiveLed / 100) * 45;
  let cumulativeO2Liters = 0;
  let totalCo2RemovedPpm = 0;

  const numOccupants = room.occupants !== undefined ? room.occupants : 2;
  // Human metabolic exhalation rate: ~0.32 Liters pure CO2 / min per person
  const occupantCo2GenerationPpmPerMin = (numOccupants * 320) / V;

  for (let min = 0; min <= 60; min++) {
    if (min > 0) {
      // Delta PM2.5 calculation
      const pmDelta = (currentPm25 - pm25Baseline) * pmRemovalFractionPerMin;
      currentPm25 = Math.max(pm25Baseline, currentPm25 - pmDelta);

      // Delta CO2 calculation (BioPod capture vs occupant continuous generation)
      const co2CaptureDelta = (currentCo2 - co2Baseline) * co2RemovalFractionPerMin;
      const netCo2Delta = co2CaptureDelta - occupantCo2GenerationPpmPerMin;
      currentCo2 = Math.max(co2Baseline, currentCo2 - netCo2Delta);
      totalCo2RemovedPpm += co2CaptureDelta;

      // Algae biological growth from carbon fixation (directly proportional to LED illumination and CO2 feed)
      if (effectivePump) {
        const growthIncrement = 0.12 * (currentCo2 / 1000) * (effectiveLed / 100);
        algaeDensity = Math.min(98, algaeDensity + growthIncrement);
      }

      // Oxygen generation equation:
      // Volume of pure CO2 fixed (Liters) = co2CaptureDelta (ppm) * 10^-6 * (V * 1000 L) = co2CaptureDelta * V * 10^-3 L.
      // Pure O2 gas evolved (Liters) = Delta V_CO2 * Photosynthetic Quotient (1.15) * o2Multiplier
      const o2DeltaLiters = co2CaptureDelta * (V / 1000) * PHOTOSYNTHETIC_QUOTIENT * o2Multiplier;
      cumulativeO2Liters += o2DeltaLiters;
    }

    const aqiData = calculatePM25AQI(currentPm25);

    // Dynamic fan RPM estimation
    const fanRpm = Math.round(800 + (effectiveFan / 100) * 1600);

    // System Health calculation (healthy 90-100%, slight drop if filters overloaded or zero pump)
    let healthScore = 98;
    if (!effectivePump) healthScore -= 4;
    if (effectiveFan > 95) healthScore -= 1;
    if (algaeDensity < 50) healthScore -= 5;

    // Room O2 concentration enrichment (ppm and percentage)
    // Enrichment in ppm = (cumulative O2 Liters / Room Air Liters) * 1,000,000
    const o2EnrichmentPpm = Math.round((cumulativeO2Liters / (V * 1000)) * 1000000);
    const roomO2Pct = Number((BASELINE_O2_PCT + o2EnrichmentPpm / 10000).toFixed(3));

    points.push({
      minute: min,
      roomCo2: Math.round(currentCo2),
      roomPm25: Number(currentPm25.toFixed(1)),
      roomTemp: Number((room.temperature - (min * 0.015)).toFixed(1)),
      roomHumidity: Math.round(room.humidity + Math.sin(min / 10) * 1.5),
      aqi: aqiData.aqi,
      algaeDensity: Math.round(algaeDensity),
      o2GeneratedLiters: Number(cumulativeO2Liters.toFixed(2)),
      o2EnrichmentPpm,
      roomO2Pct,
      co2RemovedPpm: Math.round(totalCo2RemovedPpm),
      systemHealth: Math.max(75, Math.min(100, healthScore)),
      fanRpm,
    });
  }

  return points;
}

/**
 * Computes comparative before/after metrics for the 60-minute benchmark
 */
export function calculateSimulationResult(
  points: SimulationDataPoint[],
  calibration: SystemCalibration
): SimulationResult {
  const first = points[0];
  const last = points[points.length - 1];
  const V = calibration.roomVolumeM3 || 45;

  const initialCo2 = first.roomCo2;
  const finalCo2 = last.roomCo2;
  const initialPm25 = first.roomPm25;
  const finalPm25 = last.roomPm25;

  const co2DiffPpm = Math.max(0, initialCo2 - finalCo2);
  // Conversion of ppm in room volume V (m³) to grams of CO2:
  // 1 ppm CO2 in 1 m³ at 25°C is approx 1.8 mg.
  const totalCo2SequesteredGrams = Number(((co2DiffPpm * V * 1.8) / 1000).toFixed(1));

  // PM2.5 in µg/m³ converted to mg
  const pmDiffUg = Math.max(0, initialPm25 - finalPm25);
  const totalPm25FilteredMg = Number(((pmDiffUg * V) / 1000).toFixed(2));

  // Cognitive focus improvement based on Harvard CO2 indoor air studies
  // Higher CO2 (>1000 ppm) reduces decision-making & cognitive scores by 15-30%
  const cognitiveFocusBoostPct = Math.round(
    Math.min(35, Math.max(5, ((initialCo2 - finalCo2) / initialCo2) * 45 + ((initialPm25 - finalPm25) / (initialPm25 || 1)) * 12))
  );

  const initialAqi = calculatePM25AQI(initialPm25);
  const finalAqi = calculatePM25AQI(finalPm25);

  return {
    initialCo2,
    finalCo2,
    initialPm25,
    finalPm25,
    initialAlgae: first.algaeDensity,
    finalAlgae: last.algaeDensity,
    initialHealth: first.systemHealth,
    finalHealth: last.systemHealth,
    totalCo2SequesteredGrams,
    totalPm25FilteredMg,
    totalO2ProducedLiters: last.o2GeneratedLiters,
    cognitiveFocusBoostPct,
    aqiImprovement: {
      from: initialAqi.aqi,
      to: finalAqi.aqi,
      fromLabel: initialAqi.label,
      toLabel: finalAqi.label,
    },
  };
}

export const DEFAULT_PRESETS: SimulationPreset[] = [
  {
    id: 'living-room',
    name: 'Living Room (4 occupants)',
    description: 'Active family gathering space with 4 occupants and elevated ambient CO₂ (1150 ppm).',
    room: { co2: 1150, pm25: 65, temperature: 25, humidity: 55, occupants: 4 },
    controls: { fanSpeed: 75, ledIntensity: 85, airPump: true, mode: 'AUTO' },
  },
  {
    id: 'bedroom',
    name: 'Bedroom (2 occupants)',
    description: 'Overnight resting environment with 2 occupants requiring quiet, restorative air recycling.',
    room: { co2: 920, pm25: 35, temperature: 21, humidity: 48, occupants: 2 },
    controls: { fanSpeed: 40, ledIntensity: 50, airPump: true, mode: 'ECO' },
  },
  {
    id: 'home-office',
    name: 'Home Studio (1 occupant)',
    description: 'High-focus productivity space requiring optimal oxygenation and minimal cognitive fatigue.',
    room: { co2: 800, pm25: 25, temperature: 23, humidity: 50, occupants: 1 },
    controls: { fanSpeed: 60, ledIntensity: 80, airPump: true, mode: 'AUTO' },
  },
];

export const BIOPOD_EQUATIONS_REFERENCE = {
  photosynthesis: {
    chemicalEquation: '6 CO₂ + 6 H₂O + Photons (PAR 660/450nm) → C₆H₁₂O₆ + 6 O₂',
    pqRatio: 1.15,
    pqDescription: 'Photosynthetic Quotient (moles O₂ evolved per mole CO₂ sequestered)',
    lightKinetics: 'Monod-type light saturation: μ_I = I / (I + K_s) with K_s = 25%',
    thermalAffinity: 'Gaussian optimum around 25.5°C: μ_T = max(0.4, 1.0 - |T - 25.5| × 0.04)',
    gasLiquidTransfer: 'Sparging aeration factor: μ_A = 1.0 (Active) | 0.15 (Passive diffusion)',
  },
  hydrogelMatrixUpgrade: {
    technology: 'Thin Alginate Hydrogel Matrix + Immobilized Microalgae (Chlorella vulgaris)',
    aeration: 'Micro-Porous Fine-Bubble Ceramic Diffuser (100–300µm micro-bubbles)',
    photosynthesisBoost: '+50% (Target 45–55%) via high surface area light exposure without mutual cell shading',
    co2CaptureBoost: '+58% (Target 50–65%) via immobilized cellular matrix + rapid bicarbonate hydration',
    o2GenerationBoost: '+50% (Target 45–55%) matching enhanced photosynthetic electron transport rate',
    gasTransferBoost: '+52% (Target 45–60%) through high interfacial gas-liquid surface area (a = 600 m⁻¹)',
    overallBioLoop: '+80% headline composite improvement across the dual-tank biological system',
    targetLabel: 'SIMULATED / TARGET PERFORMANCE',
    caveat: 'Presented as a simulation target pending measured experimental validation on the hackathon dual-tank hardware prototype.',
  },
  esp32SmartOptimization: {
    controller: 'ESP32 Dual-Core Microcontroller with FreeRTOS Dynamic Control Loops',
    controls: [
      'Fan Speed: Dynamic intake airflow regulation (1.2–4.5 m³/min) balancing HEPA dwell time',
      'LED Intensity: Closed-loop PAR spectrum (660nm deep red + 450nm royal blue) preventing photoinhibition',
      'Air-Pump Rate: Fine-bubble sparging modulation to optimize k_L*a without cell shear damage',
      'pH Regulation: Dynamic monitoring (7.0–7.4 target) to maintain dissolved HCO₃⁻/CO₂ equilibrium',
      'Algae Density: Optical density (OD680) tracking to preserve optimal light penetration depth',
    ],
    goal: 'Maintain optimal real-time equilibrium between CO₂ availability, photon flux, convective mixing, pH buffer, and gas transfer.',
  },
  occupantsRespiration: {
    ashraeFormula: 'G_co2 = N_occ × 0.32 L/min per person (ASHRAE 62.1 at 1.2 met)',
    indoorLoadRate: 'ΔCO₂_gen (ppm/min) = (N_occ × 320) / V_room (m³)',
  },
  o2Generation: {
    volumetricFormula: 'ΔV_O2 (Liters) = ΔCO2 (ppm) × 10⁻⁶ × (V_room × 1000 L) × PQ (1.15)',
    enrichmentFormula: 'ΔO₂_enrichment (ppm) = (Cumulative O₂ Liters / Room Volume Liters) × 10⁶',
    roomPercentageFormula: 'Room O₂ (%) = 20.946% + (ΔO₂_enrichment_ppm / 10,000)',
  },
  cadrParticulate: {
    hepaModel: 'C_pm(t) = C_baseline + (C_0 - C_baseline) × exp(-[(Q_fan × η_hepa) / V_room + k_deposition] × t)',
    hepaEfficiency: 0.997,
  }
};

