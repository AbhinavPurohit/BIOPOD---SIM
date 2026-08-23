import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  BioPodControls, 
  RoomConditions, 
  SimulationDataPoint, 
  SimulationPreset, 
  SystemCalibration 
} from './types';
import { 
  DEFAULT_PRESETS, 
  generateSimulationData, 
  calculateSimulationResult 
} from './utils/simulationEngine';
import { audioSynth } from './utils/audioSynthesizer';
import { Header } from './components/Header';
import { BioPodScrollHero } from './components/BioPodScrollHero';
import { BioPodHeroSection } from './components/BioPodHeroSection';
import { BioPodCoreVisualizer } from './components/BioPodCoreVisualizer';
import { LiveSimulationGraph } from './components/LiveSimulationGraph';
import { SimulationControls } from './components/SimulationControls';
import { AlgaeTankModal } from './components/AlgaeTankModal';
import { SimulationResultModal } from './components/SimulationResultModal';
import { SettingsModal } from './components/SettingsModal';
import { PrinciplesModal } from './components/PrinciplesModal';
import { AuroraBackground } from './components/AuroraBackground';

export default function App() {
  // Preset scenario selection
  const [currentPresetId, setCurrentPresetId] = useState<string>('living-room');

  // Room conditions
  const [room, setRoom] = useState<RoomConditions>(DEFAULT_PRESETS[0].room);
  const [initialRoom, setInitialRoom] = useState<RoomConditions>(DEFAULT_PRESETS[0].room);

  // BioPod controls
  const [controls, setControls] = useState<BioPodControls>(DEFAULT_PRESETS[0].controls);

  // Calibration settings
  const [calibration, setCalibration] = useState<SystemCalibration>({
    roomVolumeM3: 45,
    bioreactorVolumeLiters: 12,
    tempUnit: 'C',
    soundEnabled: false,
    soundVolume: 0.5,
  });

  // Simulation playback state
  const [currentMinute, setCurrentMinute] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(2);

  // Modals
  const [selectedTankModal, setSelectedTankModal] = useState<'01' | '02' | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showPrinciplesModal, setShowPrinciplesModal] = useState<boolean>(false);

  // Generate full 0..60 minute curve data
  const dataPoints = useMemo(() => {
    return generateSimulationData(initialRoom, controls, calibration);
  }, [initialRoom, controls, calibration]);

  const currentDataPoint: SimulationDataPoint = dataPoints[currentMinute] || dataPoints[0];

  // Simulation Timer Interval
  useEffect(() => {
    let interval: number | null = null;

    if (isSimulating) {
      const stepDurationMs = Math.max(80, 800 / simulationSpeed);
      interval = window.setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= 60) {
            setIsSimulating(false);
            setShowResultModal(true);
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#0B4D20', '#69B82F', '#42B9D9'],
              });
            } catch {
              // ignore
            }
            return 60;
          }
          return prev + 1;
        });
      }, stepDurationMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, simulationSpeed]);

  // Sync Hardware Acoustics
  useEffect(() => {
    audioSynth.updateAcoustics(controls.fanSpeed, controls.airPump, calibration.soundEnabled);
  }, [controls.fanSpeed, controls.airPump, calibration.soundEnabled]);

  // Handlers
  const handleSelectPreset = (preset: SimulationPreset) => {
    audioSynth.playClick();
    setCurrentPresetId(preset.id);
    setRoom({ ...preset.room });
    setInitialRoom({ ...preset.room });
    setControls({ ...preset.controls });
    setCurrentMinute(0);
    setIsSimulating(false);
  };

  const handleUpdateRoom = (newRoom: Partial<RoomConditions>) => {
    const updated = { ...room, ...newRoom };
    setRoom(updated);
    setInitialRoom(updated);
    setCurrentMinute(0);
    setIsSimulating(false);
  };

  const handleUpdateControls = (newControls: Partial<BioPodControls>) => {
    audioSynth.playClick();
    setControls((prev) => ({ ...prev, ...newControls }));
  };

  const handleRunSimulation = () => {
    audioSynth.playClick();
    if (currentMinute >= 60) {
      setCurrentMinute(0);
    }
    setIsSimulating(true);
  };

  const handleTogglePlay = () => {
    audioSynth.playClick();
    if (currentMinute >= 60) {
      setCurrentMinute(0);
      setIsSimulating(true);
    } else {
      setIsSimulating((prev) => !prev);
    }
  };

  const handleReset = () => {
    audioSynth.playClick();
    setIsSimulating(false);
    setCurrentMinute(0);
  };

  const handleSeekMinute = (min: number) => {
    setCurrentMinute(Math.max(0, Math.min(60, min)));
  };

  const handleToggleSound = () => {
    audioSynth.playClick();
    setCalibration((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const simulationResult = useMemo(() => {
    return calculateSimulationResult(dataPoints, calibration);
  }, [dataPoints, calibration]);

  return (
    <div className="min-h-screen bg-[#050806] text-[#FAF8F2] flex flex-col selection:bg-[#69B82F]/30 selection:text-[#69B82F] relative">
      {/* Dynamic Gemini-style flowing Aurora background */}
      <AuroraBackground intensity={0.9} interactive={true} />

      {/* 1. Header */}
      <Header
        currentPresetId={currentPresetId}
        presets={DEFAULT_PRESETS}
        onSelectPreset={handleSelectPreset}
        isSimulating={isSimulating}
        currentMinute={currentMinute}
        soundEnabled={calibration.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenInfo={() => setShowPrinciplesModal(true)}
      />

      {/* 2. Apple-Style Scroll-Driven Product Presentation Hero (Pinned 360vh) */}
      <BioPodScrollHero
        room={room}
        controls={controls}
        currentPoint={currentDataPoint}
        isSimulating={isSimulating}
        onTogglePower={handleTogglePlay}
        onSelectTank={(id) => setSelectedTankModal(id)}
        onOpenPrinciples={() => setShowPrinciplesModal(true)}
      />

      {/* 3. Main Body Container for Interactive Hardware & Simulation Suite */}
      <main className="relative z-10 flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-10">

        {/* 2.2 Deep Physical Architecture Visualizer (Input Air | Core Filtration Chamber | Biological Loop & Output) */}
        <div className="rounded-2xl overflow-hidden border border-[#1E2E22] bg-[#0E1410]/90 backdrop-blur-sm shadow-2xl">
          <BioPodCoreVisualizer
            room={room}
            controls={controls}
            currentPoint={currentDataPoint}
            isSimulating={isSimulating}
            tempUnit={calibration.tempUnit}
            onSelectTank={(id) => setSelectedTankModal(id)}
          />
        </div>

        {/* 2.3 Live Simulation Telemetry Graph (Full Width & Dynamic Curves) */}
        <div>
          <LiveSimulationGraph
            dataPoints={dataPoints}
            currentMinute={currentMinute}
            isSimulating={isSimulating}
            simulationSpeed={simulationSpeed}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            onSeekMinute={handleSeekMinute}
            onChangeSpeed={(spd) => setSimulationSpeed(spd)}
          />
        </div>

        {/* 2.4 Simulation Instrumentation Controls (Room Conditions & BioPod Controls) */}
        <div>
          <SimulationControls
            room={room}
            controls={controls}
            isSimulating={isSimulating}
            onUpdateRoom={handleUpdateRoom}
            onUpdateControls={handleUpdateControls}
            onRunSimulation={handleRunSimulation}
            onReset={handleReset}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#060907]/90 backdrop-blur-md border-t border-[#1E2B21] py-8 px-4 sm:px-8 lg:px-12 text-center font-mono text-xs text-[#7A887E]">
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#69B82F]"></span>
            <span className="font-bold text-[#FAF8F2]">BIOPOD IoT</span>
            <span>• Microalgae Photobioreactor Air Purification System v2.4</span>
          </div>
          <span className="text-[#A8DDA2]/60">
            Photosynthetic CO₂ Sequestration • High-Efficiency True HEPA H13 Filtration
          </span>
        </div>
      </footer>

      {/* Modals */}
      {selectedTankModal && (
        <AlgaeTankModal
          tankId={selectedTankModal}
          density={currentDataPoint.algaeDensity}
          ledIntensity={controls.ledIntensity}
          airPump={controls.airPump}
          onClose={() => setSelectedTankModal(null)}
          onUpdateLed={(val) => handleUpdateControls({ ledIntensity: val })}
          onUpdatePump={(val) => handleUpdateControls({ airPump: val })}
          onDoseNutrients={() => audioSynth.playClick()}
        />
      )}

      {showResultModal && (
        <SimulationResultModal
          result={simulationResult}
          dataPoints={dataPoints}
          onClose={() => setShowResultModal(false)}
          onRunAgain={() => {
            setShowResultModal(false);
            setCurrentMinute(0);
            setIsSimulating(true);
          }}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        calibration={calibration}
        onClose={() => setShowSettingsModal(false)}
        onUpdateCalibration={(newCal) => setCalibration((prev) => ({ ...prev, ...newCal }))}
      />

      <PrinciplesModal
        isOpen={showPrinciplesModal}
        onClose={() => setShowPrinciplesModal(false)}
      />
    </div>
  );
}
