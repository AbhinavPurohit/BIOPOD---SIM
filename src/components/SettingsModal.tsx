import React from 'react';
import { X, Sliders, Volume2, HardDrive, Compass, Check } from 'lucide-react';
import { SystemCalibration } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  calibration: SystemCalibration;
  onClose: () => void;
  onUpdateCalibration: (newCal: Partial<SystemCalibration>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  calibration,
  onClose,
  onUpdateCalibration,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-settings-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-settings-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F2] border-2 border-[#D8D4C8] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#FAF8F2] border-b border-[#D8D4C8] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0B4D20]" />
            <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-[#171A18]">
              ENGINEERING CALIBRATION
            </h3>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EFECE2] text-[#5A635C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 font-mono text-xs">
          {/* Room Volume setting */}
          <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#DDD8CD]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[#171A18]">ROOM AIRSPACE VOLUME</span>
              <span className="font-bold text-[#0B4D20]">{calibration.roomVolumeM3} m³</span>
            </div>
            <input
              id="slider-room-volume"
              type="range"
              min="20"
              max="120"
              step="5"
              value={calibration.roomVolumeM3}
              onChange={(e) => onUpdateCalibration({ roomVolumeM3: Number(e.target.value) })}
              className="w-full accent-[#0B4D20] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6A736C] mt-1">
              <span>20 m³ (Small Office)</span>
              <span>45 m³ (Standard)</span>
              <span>120 m³ (Open Studio)</span>
            </div>
          </div>

          {/* Bioreactor Capacity */}
          <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#DDD8CD]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[#171A18]">BIOPOD TANK CAPACITY</span>
              <span className="font-bold text-[#0B4D20]">{calibration.bioreactorVolumeLiters} Liters</span>
            </div>
            <input
              id="slider-bioreactor-volume"
              type="range"
              min="6"
              max="30"
              step="2"
              value={calibration.bioreactorVolumeLiters}
              onChange={(e) => onUpdateCalibration({ bioreactorVolumeLiters: Number(e.target.value) })}
              className="w-full accent-[#0B4D20] cursor-pointer"
            />
            <span className="text-[10px] text-[#6A736C] block mt-1">
              Dual borosilicate column photobioreactor liquid volume
            </span>
          </div>

          {/* Temperature Unit */}
          <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#DDD8CD] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#171A18] block">TEMPERATURE SCALE</span>
              <span className="text-[10px] text-[#6A736C]">Sensor display units</span>
            </div>
            <div className="flex items-center gap-1 bg-[#E8E4D8] p-1 rounded-lg border border-[#D0CBBF]">
              <button
                id="temp-unit-c-btn"
                onClick={() => onUpdateCalibration({ tempUnit: 'C' })}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  calibration.tempUnit === 'C'
                    ? 'bg-[#0B4D20] text-white shadow-xs'
                    : 'text-[#6A736C]'
                }`}
              >
                °C
              </button>
              <button
                id="temp-unit-f-btn"
                onClick={() => onUpdateCalibration({ tempUnit: 'F' })}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  calibration.tempUnit === 'F'
                    ? 'bg-[#0B4D20] text-white shadow-xs'
                    : 'text-[#6A736C]'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Sound acoustics toggle */}
          <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#DDD8CD] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#171A18] block">HARDWARE ACOUSTICS</span>
              <span className="text-[10px] text-[#6A736C]">Web Audio fan & bubbling synthesizer</span>
            </div>
            <button
              id="settings-sound-toggle-btn"
              onClick={() => onUpdateCalibration({ soundEnabled: !calibration.soundEnabled })}
              className={`px-3 py-1.5 font-bold rounded-lg border transition-all ${
                calibration.soundEnabled
                  ? 'bg-[#0B4D20] text-white border-[#092D16]'
                  : 'bg-[#FAF8F2] text-[#6A736C] border-[#D0CBBF]'
              }`}
            >
              {calibration.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#EFECE2] p-4 border-t border-[#D8D4C8] flex justify-end">
          <button
            id="save-settings-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0B4D20] text-[#FAF8F2] font-mono font-bold text-xs hover:bg-[#083D19] transition-colors"
          >
            [ APPLY & CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
};
