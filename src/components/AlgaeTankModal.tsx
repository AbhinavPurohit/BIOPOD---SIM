import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Leaf } from 'lucide-react';

interface AlgaeTankModalProps {
  tankId: '01' | '02' | null;
  density?: number;
  ledIntensity?: number;
  airPump?: boolean;
  onClose: () => void;
  onUpdateLed?: (val: number) => void;
  onUpdatePump?: (val: boolean) => void;
  onDoseNutrients?: () => void;
}

export const AlgaeTankModal: React.FC<AlgaeTankModalProps> = ({
  tankId,
  density = 80,
  ledIntensity = 85,
  airPump = true,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Canvas Particle Bubbling and Algae Physics
  useEffect(() => {
    if (!tankId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = 180);
    const height = (canvas.height = 220);

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

    const bubbles: Bubble[] = Array.from({ length: airPump ? 30 : 6 }, () => ({
      x: Math.random() * (width - 24) + 12,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.5,
      speed: 0.8 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
    }));

    const cells: AlgaeCell[] = Array.from({ length: Math.round((density || 80) * 0.7) }, () => ({
      x: Math.random() * (width - 16) + 8,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: 0.4 + Math.random() * 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Liquid base color background
      const lightFactor = (ledIntensity || 85) / 100;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `rgba(11, 77, 32, 0.95)`);
      grad.addColorStop(0.5, `rgba(105, 184, 47, ${0.4 + lightFactor * 0.4})`);
      grad.addColorStop(1, `rgba(9, 45, 22, 0.98)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Hydrogel matrix lattice
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

      // Algae cells
      cells.forEach((cell) => {
        cell.x += cell.vx;
        cell.y += cell.vy;
        if (cell.x < 10 || cell.x > width - 10) cell.vx *= -1;
        if (cell.y < 10 || cell.y > height - 10) cell.vy *= -1;

        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 221, 162, ${cell.alpha})`;
        ctx.fill();
      });

      // Rising fine micro-bubbles
      if (airPump) {
        bubbles.forEach((b) => {
          b.y -= b.speed;
          b.wobble += b.wobbleSpeed;
          b.x += Math.sin(b.wobble) * 0.4;

          if (b.y < 8) {
            b.y = height - 10;
            b.x = Math.random() * (width - 24) + 12;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();
        });
      }

      // Ceramic Micro-Porous Diffuser at base
      ctx.fillStyle = '#1E2420';
      ctx.fillRect(width / 2 - 35, height - 12, 70, 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tankId, density, ledIntensity, airPump]);

  if (!tankId) return null;

  const tankName = tankId === '01' ? 'ALGAE TANK 01 — PRIMARY FIXATION' : 'ALGAE TANK 02 — BIO-CASCADE';
  const tankSubtitle = tankId === '01' ? 'Chlorella vulgaris Liquid Suspension' : 'Thin Alginate Hydrogel Matrix';

  const tankExplanation = tankId === '01'
    ? 'Tank 01 serves as the primary biological carbon capture stage, housing a high-density liquid culture of Chlorella vulgaris microalgae illuminated by optimized 660nm/450nm photosynthetic LEDs. As indoor room air is drawn into the base through fine micro-bubble spargers, the active microalgae rapidly absorb high-concentration dissolved carbon dioxide (CO₂) and convert it directly into clean, bio-synthesized oxygen (O₂) through natural photosynthesis, neutralizing stale indoor air before it circulates into the secondary polishing stage.'
    : 'Tank 02 acts as the secondary cascade and biological polishing stage, utilizing a specialized thin alginate hydrogel matrix with immobilized microalgae to maximize gas-liquid contact time and surface interaction. It captures residual carbon traces, volatile organic compounds (VOCs), and fine metabolic byproducts that pass through the primary chamber, stabilizing culture pH and ensuring a continuous, balanced release of pure oxygen and revitalized air back into the living space.';

  return (
    <div
      id="modal-algae-tank-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-algae-tank-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F2] border-2 border-[#1E5C33] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#0B4D20] text-[#FAF8F2] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#69B82F] animate-pulse"></span>
            <div>
              <h3 className="font-mono font-bold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2">
                {tankName}
              </h3>
              <p className="text-xs text-[#A8DDA2] font-mono mt-0.5">{tankSubtitle}</p>
            </div>
          </div>
          <button
            id="close-tank-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#092D16] hover:bg-[#103D1F] text-[#FAF8F2] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Cylinder + 1-Paragraph Explanation */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Live Photobioreactor Column */}
            <div className="shrink-0 relative rounded-xl border-3 border-[#171A18] bg-[#0E1B13] p-1 shadow-inner overflow-hidden flex flex-col items-center">
              <div className="absolute top-2 text-[11px] font-mono font-bold text-[#FAF8F2] bg-black/70 px-2.5 py-0.5 rounded-full z-10">
                BOROSILICATE COLUMN
              </div>
              <canvas
                ref={canvasRef}
                className="rounded-lg w-[140px] h-[170px]"
              />
              <div className="absolute bottom-2 text-[11px] font-mono font-bold text-[#69B82F] bg-black/75 px-2.5 py-0.5 rounded-full z-10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#69B82F] animate-pulse"></span>
                Active Culture
              </div>
            </div>

            {/* 1-Paragraph Explanation */}
            <div className="flex-1 bg-[#F4F1EA] p-4 sm:p-4.5 rounded-xl border border-[#DDD8CD] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B4D20] uppercase tracking-wider">
                {tankId === '01' ? <Leaf className="w-3.5 h-3.5 text-[#69B82F]" /> : <Sparkles className="w-3.5 h-3.5 text-[#69B82F]" />}
                Chamber Overview
              </div>
              <p className="text-xs sm:text-sm text-[#2E3B33] font-sans leading-relaxed">
                {tankExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EFECE2] px-5 py-3.5 border-t border-[#D8D4C8] flex justify-end">
          <button
            id="close-tank-modal-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0B4D20] hover:bg-[#083D19] text-[#FAF8F2] font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            [ CLOSE INSPECTION ]
          </button>
        </div>
      </div>
    </div>
  );
};

