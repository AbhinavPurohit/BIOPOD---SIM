import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Droplet, 
  Sun, 
  Wind, 
  Activity, 
  Flame, 
  Sparkles, 
  FlaskConical, 
  Check, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { TankDetails, BioPodControls } from '../types';

interface AlgaeTankModalProps {
  tankId: '01' | '02' | null;
  density: number;
  ledIntensity: number;
  airPump: boolean;
  onClose: () => void;
  onUpdateLed: (val: number) => void;
  onUpdatePump: (val: boolean) => void;
  onDoseNutrients: () => void;
}

export const AlgaeTankModal: React.FC<AlgaeTankModalProps> = ({
  tankId,
  density,
  ledIntensity,
  airPump,
  onClose,
  onUpdateLed,
  onUpdatePump,
  onDoseNutrients,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nutrientDosed, setNutrientDosed] = useState(false);
  const [localPh, setLocalPh] = useState(tankId === '01' ? 7.1 : 7.2);
  const [dissolvedO2, setDissolvedO2] = useState(8.4);

  // Live Canvas Particle Bubbling and Algae Physics
  useEffect(() => {
    if (!tankId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = 240);
    const height = (canvas.height = 320);

    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wobble: number;
      wobbleSpeed: number;
    }

    interface AlgaeCell {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }

    // Upgraded Fine-bubble diffuser generates smaller (0.8 - 2.0px), denser micro-bubbles
    const bubbles: Bubble[] = Array.from({ length: airPump ? 48 : 6 }, () => ({
      x: Math.random() * (width - 30) + 15,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.6, // Fine micro-bubbles
      speed: 0.9 + Math.random() * 1.8,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
    }));

    const cells: AlgaeCell[] = Array.from({ length: Math.round(density * 0.9) }, () => ({
      x: Math.random() * (width - 20) + 10,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.2, // Hydrogel immobilized cells have constrained motion
      vy: (Math.random() - 0.5) * 0.15,
      alpha: 0.4 + Math.random() * 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Liquid base color background
      const greenIntensity = Math.min(255, Math.floor(60 + (density / 100) * 140));
      const lightFactor = ledIntensity / 100;

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `rgba(11, 77, 32, 0.95)`);
      grad.addColorStop(0.5, `rgba(105, 184, 47, ${0.4 + lightFactor * 0.4})`);
      grad.addColorStop(1, `rgba(9, 45, 22, 0.98)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Thin Hydrogel Matrix mesh lattice
      ctx.strokeStyle = 'rgba(168, 221, 162, 0.18)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 8);
        ctx.lineTo(x, height - 8);
        ctx.stroke();
      }
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(width - 8, y);
        ctx.stroke();
      }

      // Glass inner highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // Draw algae cells (immobilized in alginate matrix beads)
      cells.forEach((cell) => {
        cell.x += cell.vx;
        cell.y += cell.vy;
        if (cell.x < 12 || cell.x > width - 12) cell.vx *= -1;
        if (cell.y < 12 || cell.y > height - 12) cell.vy *= -1;

        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 221, 162, ${cell.alpha})`;
        ctx.fill();
      });

      // Draw rising fine micro-bubbles if air pump is running
      if (airPump) {
        bubbles.forEach((b) => {
          b.y -= b.speed;
          b.wobble += b.wobbleSpeed;
          b.x += Math.sin(b.wobble) * 0.4;

          if (b.y < 8) {
            b.y = height - 12;
            b.x = Math.random() * (width - 30) + 15;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(66, 185, 217, 0.9)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      }

      // Ceramic Micro-Porous Diffuser at bottom
      ctx.fillStyle = '#1E2420';
      ctx.fillRect(width / 2 - 40, height - 14, 80, 10);
      ctx.fillStyle = '#42B9D9';
      for (let i = -35; i <= 35; i += 6) {
        ctx.fillRect(width / 2 + i - 0.5, height - 16, 1.5, 3);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tankId, density, ledIntensity, airPump]);

  const handleNutrientDosing = () => {
    setNutrientDosed(true);
    setLocalPh((prev) => Number((prev + 0.1).toFixed(2)));
    setDissolvedO2((prev) => Number((prev + 0.4).toFixed(1)));
    onDoseNutrients();
    setTimeout(() => setNutrientDosed(false), 3000);
  };

  if (!tankId) return null;

  const tankName = tankId === '01' ? 'ALGAE TANK 01 (PRIMARY FIXATION)' : 'ALGAE TANK 02 (BIO-CASCADE)';
  const cultureType = 'Thin Alginate Hydrogel Matrix + Immobilized Chlorella vulgaris';

  return (
    <div
      id="modal-algae-tank-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-algae-tank-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F2] border-2 border-[#1E5C33] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#0B4D20] text-[#FAF8F2] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#69B82F] animate-ping"></span>
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                {tankName}
                <span className="text-[10px] bg-[#092D16] text-[#69B82F] px-1.5 py-0.2 rounded border border-[#1E5C33]">
                  ● ONLINE
                </span>
              </h3>
              <p className="text-[11px] text-[#A8DDA2] font-mono">{cultureType}</p>
            </div>
          </div>
          <button
            id="close-tank-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#092D16] hover:bg-[#103D1F] text-[#FAF8F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Visual: Glass Photobioreactor Column */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            
            {/* Left: Interactive Canvas Cylinder */}
            <div className="relative rounded-2xl border-4 border-[#171A18] bg-[#0E1B13] p-1 shadow-inner overflow-hidden flex flex-col items-center">
              <div className="absolute top-2 text-[10px] font-mono text-[#FAF8F2]/70 bg-black/40 px-2 py-0.5 rounded-full z-10">
                BOROSILICATE COLUMN
              </div>
              <canvas
                ref={canvasRef}
                className="rounded-xl w-[180px] h-[240px]"
              />
              <div className="absolute bottom-2 text-[10px] font-mono text-[#69B82F] bg-black/60 px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69B82F] animate-pulse"></span>
                {airPump ? 'Sparging Active (2.4 L/m)' : 'Sparging Off'}
              </div>
            </div>

            {/* Right: Detailed Telemetry Grid */}
            <div className="flex-1 w-full space-y-2.5 font-mono text-xs">
              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">BIOMASS DENSITY</span>
                <span className="font-bold text-sm text-[#0B4D20]">{density}% (Hydrogel Matrix)</span>
              </div>

              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">CULTURE pH (ESP32)</span>
                <span className="font-bold text-sm text-[#171A18]">{localPh} (Optimal 7.0–7.4)</span>
              </div>

              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">GAS TRANSFER (K_L*a)</span>
                <span className="font-bold text-sm text-[#0B4D20]">+52% (Fine Bubbles)</span>
              </div>

              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">CO₂ CAPTURE RATE</span>
                <span className="font-bold text-sm text-[#0B4D20]">+58% Fixation (3.4 g/hr)</span>
              </div>

              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">DISSOLVED O₂</span>
                <span className="font-bold text-sm text-[#42B9D9]">{dissolvedO2} mg/L (+50% O₂)</span>
              </div>

              <div className="bg-[#F4F1EA] p-2.5 rounded-lg border border-[#DDD8CD] flex justify-between items-center">
                <span className="text-[#5A635C]">LED ILLUMINATION</span>
                <span className="font-bold text-sm text-[#E4B83D]">{ledIntensity}% (660nm/450nm)</span>
              </div>
            </div>
          </div>

          {/* Quick Actuator Adjustments */}
          <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#DDD8CD] space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#171A18] uppercase tracking-wider">
              TANK ACTUATOR OVERRIDES
            </h4>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Air Sparging Toggle */}
              <button
                id="tank-sparge-toggle"
                onClick={() => onUpdatePump(!airPump)}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                  airPump
                    ? 'bg-[#0B4D20] text-white border-[#092D16]'
                    : 'bg-[#FAF8F2] text-[#5A635C] border-[#D0CBBF]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                {airPump ? 'SPARGING PUMP: ON' : 'SPARGING PUMP: OFF'}
              </button>

              {/* Dose Nutrients (BG-11 Media) */}
              <button
                id="dose-nutrients-btn"
                onClick={handleNutrientDosing}
                disabled={nutrientDosed}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                  nutrientDosed
                    ? 'bg-[#69B82F] text-[#171A18] border-[#559E21]'
                    : 'bg-[#FAF8F2] hover:bg-[#EAE6DB] text-[#171A18] border-[#D0CBBF]'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#0B4D20]" />
                {nutrientDosed ? '✓ DOSED MEDIA (+BG11)' : 'DOSE NUTRIENTS'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EFECE2] p-4 border-t border-[#D8D4C8] flex justify-end">
          <button
            id="close-tank-modal-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0B4D20] text-[#FAF8F2] font-mono font-bold text-xs hover:bg-[#083D19] transition-colors"
          >
            [ CLOSE INSPECTION ]
          </button>
        </div>
      </div>
    </div>
  );
};
