import React, { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  intensity?: number;
  interactive?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  intensity = 0.9,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Ethereal slow fluid aurora parameters
    let time = 0;

    const render = () => {
      time += 0.0035; // Slow atmospheric fluid movement
      ctx.clearRect(0, 0, width, height);

      // 1. Deep cosmic black/navy base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020508');
      bgGrad.addColorStop(0.4, '#04090E');
      bgGrad.addColorStop(0.7, '#03080A');
      bgGrad.addColorStop(1, '#020504');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Multi-layered soft organic aurora light waves
      const blobs = [
        // Emerald / BioPod Green
        {
          x: width * 0.25 + Math.sin(time * 0.7) * width * 0.12,
          y: height * 0.35 + Math.cos(time * 0.5) * height * 0.15,
          r: Math.min(width, height) * 0.65,
          color1: 'rgba(105, 184, 47, 0.14)',
          color2: 'rgba(16, 185, 129, 0.04)',
        },
        // Electric Cyan / Airflow Blue
        {
          x: width * 0.75 + Math.cos(time * 0.6) * width * 0.15,
          y: height * 0.25 + Math.sin(time * 0.8) * height * 0.12,
          r: Math.min(width, height) * 0.7,
          color1: 'rgba(56, 189, 248, 0.12)',
          color2: 'rgba(14, 165, 233, 0.03)',
        },
        // Deep Indigo / Royal Purple
        {
          x: width * 0.5 + Math.sin(time * 0.5 + 2) * width * 0.18,
          y: height * 0.65 + Math.cos(time * 0.7 + 1) * height * 0.14,
          r: Math.min(width, height) * 0.75,
          color1: 'rgba(99, 102, 241, 0.11)',
          color2: 'rgba(139, 92, 246, 0.02)',
        },
        // Subtle Rainbow / Warm Amber & Magenta Accent
        {
          x: width * 0.85 + Math.cos(time * 0.4) * width * 0.1,
          y: height * 0.8 + Math.sin(time * 0.6) * height * 0.12,
          r: Math.min(width, height) * 0.55,
          color1: 'rgba(217, 70, 239, 0.08)',
          color2: 'rgba(245, 158, 11, 0.03)',
        },
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      blobs.forEach((blob) => {
        const radGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        radGrad.addColorStop(0, blob.color1);
        radGrad.addColorStop(0.5, blob.color2);
        radGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{ opacity: intensity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block filter blur-[40px] sm:blur-[60px]"
      />

      {/* Subtle fine technical grid for engineering precision */}
      <div className="absolute inset-0 tech-grid opacity-20" />

      {/* Soft Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(2, 5, 8, 0.85) 100%)',
        }}
      />
    </div>
  );
};
