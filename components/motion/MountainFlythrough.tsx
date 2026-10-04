'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Mountain, Compass } from 'lucide-react';

export function MountainFlythrough() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 1. Слой передних скал (разлетаются влево-вправо и приближаются в камеру)
  const leftRockX = useTransform(scrollYProgress, [0, 0.6], ['0%', '-80%']);
  const rightRockX = useTransform(scrollYProgress, [0, 0.6], ['0%', '80%']);
  const frontRocksScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.8]);
  const frontRocksOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1, 0]);

  // 2. Слой тумана и облаков (рассеивается при влёте)
  const mistScale = useTransform(scrollYProgress, [0, 0.7], [1, 3.5]);
  const mistOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 0]);

  // 3. Вершина Эльбруса (приближается из глубины)
  const summitScale = useTransform(scrollYProgress, [0.1, 0.85], [0.85, 1.25]);
  const summitY = useTransform(scrollYProgress, [0.1, 0.85], ['10%', '-5%']);

  // 4. Текстовые данные экспедиции (появляются из глубины в конце пролета)
  const hudOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const hudScale = useTransform(scrollYProgress, [0.55, 0.85], [0.85, 1]);
  const hudY = useTransform(scrollYProgress, [0.55, 0.85], [40, 0]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#050A10]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Фоновое звездное небо и глубокий градиент */}
        <div className="absolute inset-0 bg-radial from-slate-900/40 via-[#050A10] to-[#020508] pointer-events-none" />

        {/* СЛОЙ 3: ДАЛЬНИЙ ПЛАН — ПИК ЭЛЬБРУСА */}
        <motion.div
          style={{ scale: summitScale, y: summitY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
        >
          <div className="relative w-full max-w-5xl h-[280px] xs:h-[360px] sm:h-[480px] md:h-[600px] flex items-center justify-center">
            <img
              src="/images/elbrus-summit.webp"
              alt="Mt. Elbrus Summit 5642m"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              onError={(e) => {
                // Fallback to authentic Elbrus photo
                (e.target as HTMLImageElement).src = '/hero/stage_05_summit.webp';
              }}
            />
            {/* Амбиентное свечение над вершиной */}
            <div className="absolute -top-10 w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
          </div>
        </motion.div>

        {/* СЛОЙ 2: АТМОСФЕРНЫЙ ТУМАН */}
        <motion.div
          style={{ scale: mistScale, opacity: mistOpacity }}
          className="absolute inset-0 pointer-events-none bg-radial from-orange-500/10 via-transparent to-transparent blur-3xl will-change-transform"
        />

        {/* СЛОЙ 1: ПЕРЕДНИЕ СКАЛЫ УЩЕЛЬЯ (РАЗЛЕТАЮТСЯ В СТОРОНЫ) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-between">
          {/* Левая скала */}
          <motion.div
            style={{ x: leftRockX, scale: frontRocksScale, opacity: frontRocksOpacity }}
            className="w-1/2 h-full bg-gradient-to-r from-black via-[#060D18]/90 to-transparent flex items-center will-change-transform"
          >
            <div className="w-full h-full border-r border-white/[0.04] backdrop-blur-[2px]" />
          </motion.div>

          {/* Правая скала */}
          <motion.div
            style={{ x: rightRockX, scale: frontRocksScale, opacity: frontRocksOpacity }}
            className="w-1/2 h-full bg-gradient-to-l from-black via-[#060D18]/90 to-transparent flex items-center will-change-transform"
          >
            <div className="w-full h-full border-l border-white/[0.04] backdrop-blur-[2px]" />
          </motion.div>
        </div>

        {/* HUD ЭКРАН: ТЕЛЕМЕТРИЯ И ДАННЫЕ ВЕРШИНЫ (ВЫЛЕТАЮТ ПОСЛЕ ПРОХОЖДЕНИЯ СКАЛ) */}
        <motion.div
          style={{ opacity: hudOpacity, scale: hudScale, y: hudY }}
          className="relative z-30 flex flex-col items-center text-center px-4 max-w-2xl pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-mono tracking-widest text-orange-400 mb-4 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            SECTOR REACHED • 5,642 M
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-2xl">
            Pass The Clouds. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
              Claim The Summit.
            </span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
            Direct high-altitude access via the South Route & wild Northern traverse. Certified UIAGM / EMERCOM alpine guides.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="/expeditions"
              className="rounded-xl bg-[#C2410C] hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 shadow-[0_0_25px_rgba(194,65,12,0.4)]"
            >
              Book 2026 Ascent
            </a>
            <a
              href="/safety"
              className="rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors"
            >
              Safety Protocols
            </a>
          </div>
        </motion.div>

        {/* ИНДИКАТОР ПРОЛЁТА ВНИЗУ */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none opacity-60">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Scroll to Dive</span>
          <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-orange-400 rounded-full animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
}

export default MountainFlythrough;
