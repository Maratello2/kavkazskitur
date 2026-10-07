'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectCard3DProps {
  id: 'wonderwell' | 'kavkazskitur';
  title: string;
  domain: string;
  badge: string;
  category: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  ctaUrl: string;
  isExternal?: boolean;
  accentColor: 'cyan' | 'orange';
  onHover?: () => void;
  onLeave?: () => void;
}

/**
 * ProjectCard3D
 * Ultra-optimized 3D Tilt Card using direct DOM transforms (Zero React re-renders on mousemove)
 * and solid alpha backgrounds (Zero GPU backdrop-filter blur bottleneck).
 */
export default function ProjectCard3D({
  id,
  title,
  domain,
  badge,
  category,
  tagline,
  description,
  metrics,
  tags,
  ctaUrl,
  isExternal = false,
  accentColor,
  onHover,
  onLeave,
}: ProjectCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isCyan = accentColor === 'cyan';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 8;
    const rotY = ((x - centerX) / centerX) * 8;

    // Direct DOM transformation for silky 60 FPS without React re-render overhead
    card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1)`;

    if (glareRef.current) {
      const px = ((x / rect.width) * 100).toFixed(1);
      const py = ((y / rect.height) * 100).toFixed(1);
      glareRef.current.style.opacity = '0.15';
      glareRef.current.style.background = `radial-gradient(circle 300px at ${px}% ${py}%, ${
        isCyan ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 106, 0, 0.35)'
      }, transparent 80%)`;
    }
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.08s ease-out';
    }
    if (onHover) onHover();
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
    if (onLeave) onLeave();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        willChange: 'transform',
      }}
      className={`relative w-full rounded-3xl p-6 sm:p-8 bg-[#060C16] border shadow-2xl overflow-hidden flex flex-col justify-between group ${
        isCyan
          ? 'border-sky-500/20 hover:border-sky-400/50 hover:shadow-[0_15px_45px_rgba(0,240,255,0.12)]'
          : 'border-orange-500/20 hover:border-[#FF6A00]/50 hover:shadow-[0_15px_45px_rgba(255,106,0,0.12)]'
      }`}
    >
      {/* Specular Glare Follower (Direct DOM update) */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-200 mix-blend-screen opacity-0"
      />

      {/* Top Ambient Glow Pill */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-28 rounded-full blur-3xl pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity duration-300 ${
          isCyan ? 'bg-cyan-500' : 'bg-[#FF6A00]'
        }`}
      />

      {/* Header Info */}
      <div className="relative z-10 space-y-4">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isCyan ? 'bg-cyan-400' : 'bg-[#FF6A00]'
              }`}
            />
            <span
              className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border ${
                isCyan
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                  : 'bg-orange-950/60 text-orange-300 border-orange-500/30'
              }`}
            >
              {badge}
            </span>
          </div>

          <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">
            {category}
          </span>
        </div>

        {/* Project Title & Domain */}
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase group-hover:text-slate-100 transition-colors">
              {title}
            </h3>
            <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
              // {domain}
            </span>
          </div>
          <p className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 ${isCyan ? 'text-sky-300' : 'text-orange-400'}`}>
            {tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          {description}
        </p>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 pb-2 border-y border-white/[0.08]">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block truncate">
                {m.label}
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tech Stack Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action CTA */}
      <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
        {isExternal ? (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-lg active:scale-95 cursor-pointer ${
              isCyan
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-950/40'
                : 'bg-gradient-to-r from-[#FF6A00] to-orange-600 hover:from-orange-500 hover:to-orange-600 shadow-orange-950/40'
            }`}
          >
            <span>Launch {domain}</span>
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        ) : (
          <Link
            href={ctaUrl}
            className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-lg active:scale-95 cursor-pointer ${
              isCyan
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-950/40'
                : 'bg-gradient-to-r from-[#FF6A00] to-orange-600 hover:from-orange-500 hover:to-orange-600 shadow-orange-950/40'
            }`}
          >
            <span>Explore {domain}</span>
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  );
}
