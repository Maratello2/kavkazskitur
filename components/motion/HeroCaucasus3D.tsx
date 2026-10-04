'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight, Compass } from 'lucide-react';

interface ReveriePoint {
  id: string;
  altitude: string;
  name: string;
  caption: string;
  glowColor: string;
}

const REVERIE_POINTS: ReveriePoint[] = [
  {
    id: 'barrels',
    altitude: '3,800m',
    name: 'Barrels',
    caption: 'Sanctuary huts floating above a boundless ocean of morning clouds.',
    glowColor: 'rgba(232, 197, 165, 0.40)',
  },
  {
    id: 'pastukhov',
    altitude: '4,700m',
    name: 'Pastukhov',
    caption: 'Silent glacial firn beneath lilac twilight and whispering high winds.',
    glowColor: 'rgba(216, 131, 115, 0.40)',
  },
  {
    id: 'saddle',
    altitude: '5,300m',
    name: 'Saddle',
    caption: 'Serene cosmic stillness cradled between twin volcanic domes.',
    glowColor: 'rgba(184, 146, 255, 0.40)',
  },
  {
    id: 'summit',
    altitude: '5,642m',
    name: 'Summit',
    caption: 'The pinnacle of Europe, bathed in golden dawn reverie.',
    glowColor: 'rgba(251, 175, 140, 0.50)',
  },
];

export function HeroCaucasus3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(3); // Default to Summit
  const mouseParallaxRef = useRef({ x: 0, y: 0 });

  const activePoint = REVERIE_POINTS[activeIdx];

  // Zero-Lag Direct Ref Mouse Tracking (No React Re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseParallaxRef.current = { x: x * 18, y: y * 10 };
    containerRef.current.style.setProperty('--mouse-px', `${x * 18}px`);
    containerRef.current.style.setProperty('--mouse-py', `${y * 10}px`);
  };

  const handleMouseLeave = () => {
    mouseParallaxRef.current = { x: 0, y: 0 };
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-px', '0px');
      containerRef.current.style.setProperty('--mouse-py', '0px');
    }
  };

  // Canvas2D Floating Warm Dust / Sunlit Pollen Motes (45 motes)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.3) * 0.4,
      vy: -0.15 - Math.random() * 0.35,
      radius: Math.random() * 2.0 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.pulse += 0.025;
        const currentAlpha = p.baseAlpha * (0.65 + Math.sin(p.pulse) * 0.35);

        p.x += p.vx + mouseParallaxRef.current.x * 0.02;
        p.y += p.vy + mouseParallaxRef.current.y * 0.02;

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 238, 225, ${currentAlpha})`;
        ctx.shadowColor = 'rgba(232, 197, 165, 0.7)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100dvh-5rem)] flex flex-col justify-between overflow-hidden bg-[#060B12] select-none"
    >
      {/* =========================================================================
          1. FULL-BLEED CINEMATIC FPV MOUNTAIN AERIAL VIDEO
      ========================================================================= */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 z-0"
        src="/video/caucasus-flythrough.mp4"
      />

      {/* =========================================================================
          2. DREAMCORE COLOR TINT & AMBIENT GLOW (NO HARSH BLACK VOID)
      ========================================================================= */}
      {/* Dawn Multi-Tone Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E1730]/75 via-[#100D1C]/55 to-[#060B12] mix-blend-multiply pointer-events-none z-[1]" />

      {/* Seamless radial ambient lighting */}
      <div 
        className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-35 mix-blend-screen transition-all duration-1000 z-[1]"
        style={{
          background: activePoint.glowColor,
          transform: 'translate3d(calc(var(--mouse-px, 0px) * 1.5), calc(var(--mouse-py, 0px) * 1.5), 0)'
        }}
      />
      <div 
        className="absolute bottom-[5%] right-[10%] w-[550px] h-[550px] rounded-full pointer-events-none blur-[150px] opacity-30 mix-blend-screen transition-all duration-1000 z-[1]"
        style={{
          background: 'rgba(184, 146, 255, 0.30)',
          transform: 'translate3d(calc(var(--mouse-px, 0px) * -1), calc(var(--mouse-py, 0px) * -1), 0)'
        }}
      />

      {/* 35mm Analog Film Grain Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* =========================================================================
          3. FLOATING SUNLIT POLLEN / ICE DUST CANVAS
      ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />

      {/* =========================================================================
          4. DREAMCORE CONTENT LAYER (MAX-W-6XL CENTERED)
      ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-between flex-1 pointer-events-none">
        
        {/* Top Status Capsule */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E8C5A5]" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-light text-[#F3EBE5]">
              • REALM OF SILENCE • MT. ELBRUS 5,642M
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-serif italic text-[#E8C5A5]/90">
            <Compass className="w-3.5 h-3.5 text-[#E8C5A5]" />
            <span>Caucasus Alpine Sanctuary</span>
          </div>
        </div>

        {/* Central Headline & Poetic Caption */}
        <div className="max-w-2xl space-y-4 my-auto pointer-events-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic font-normal tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_25px_rgba(216,131,115,0.45)]">
            Where the Earth <br />
            <span className="not-italic font-sans font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6DA] to-[#E8C5A5]">
              touches the dream.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-light text-[#E8DCD4]/90 leading-relaxed max-w-xl">
            High-altitude ski touring, silent glaciers, and private sanctuaries poised above the clouds.
          </p>

          {/* Dynamic Active Whisper */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePoint.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="pt-1 text-xs sm:text-sm font-serif italic text-[#E8C5A5]"
            >
              <span>— {activePoint.caption}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================================================================
            5. FROSTED PILLS & REVERIE CTA BUTTONS
        ========================================================================= */}
        <div className="space-y-6 pt-4 border-t border-white/10 pointer-events-auto">
          
          {/* 4 Minimal Interactive Altitude Pearls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {REVERIE_POINTS.map((pt, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={pt.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-full backdrop-blur-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D88373]/35 via-[#E8C5A5]/35 to-[#D88373]/35 border border-white/50 shadow-[0_0_25px_rgba(232,197,165,0.35)] scale-[1.02]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white/80'
                  }`}
                >
                  <span className="font-light text-xs sm:text-sm tracking-wide text-white">
                    {pt.altitude}
                  </span>
                  <span className="font-serif italic text-xs text-[#E8C5A5] truncate ml-2">
                    {pt.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Reverie Lamp Button */}
              <a
                href={`https://wa.me/79280000000?text=I%20wish%20to%20begin%20the%20reverie%20on%20Mount%20Elbrus%20(${encodeURIComponent(activePoint.altitude)}%20-%20${encodeURIComponent(activePoint.name)})`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D88373] via-[#E8C5A5] to-[#D88373] hover:from-[#E28E7E] hover:to-[#EFCCA8] text-[#1B1832] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_10px_35px_rgba(216,131,115,0.45)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Begin the Reverie →</span>
              </a>

              {/* Secondary Routes Capsule */}
              <a
                href="#expeditions"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-light text-xs sm:text-sm backdrop-blur-xl transition hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore Routes</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E8C5A5]" />
              </a>
            </div>

            <div className="text-xs font-serif italic text-[#E8DCD4]/70">
              Where waking eyes turn celestial.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroCaucasus3D;
