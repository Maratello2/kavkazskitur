'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // Maximum tilt angle in degrees (default: 10)
}

/**
 * Card3DTilt - Ultra-High-Performance 3D Perspective Tilt Card
 * 
 * Performance architecture:
 * 1. ZERO layout thrashing: getBoundingClientRect() cached once on mouseenter.
 * 2. ZERO React re-renders: Direct DOM mutations via style.transform and RAF.
 * 3. Frame-rate locked: Coordinates processed exclusively via requestAnimationFrame.
 * 4. Hardware-accelerated: transform-gpu + will-change-transform for composite-thread rendering.
 * 5. Touch-aware: Completely disabled on touch devices to ensure 0ms scroll latency.
 */
export function Card3DTilt({
  children,
  className = '',
  depth = 10,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable 3D tilt on devices with a fine pointer (mouse/trackpad)
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(media.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!canHover || !cardRef.current) return;
    // Cache bounding box once on enter, ZERO layout recalculation during mousemove
    rectRef.current = cardRef.current.getBoundingClientRect();
    cardRef.current.style.transition = 'transform 0.12s ease-out';
    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.25s ease-out';
      glareRef.current.style.opacity = '1';
    }
  }, [canHover]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHover || !cardRef.current) return;
      if (!rectRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafIdRef.current !== null) return; // Drop frame if already queued

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!cardRef.current || !rectRef.current) return;

        const rect = rectRef.current;
        const width = rect.width;
        const height = rect.height;

        const mouseX = Math.max(0, Math.min(width, clientX - rect.left));
        const mouseY = Math.max(0, Math.min(height, clientY - rect.top));

        const pctX = mouseX / width;
        const pctY = mouseY / height;

        // Subtle, high-end mountain expedition editorial tilt
        const rotX = ((pctY - 0.5) * -depth * 2).toFixed(2);
        const rotY = ((pctX - 0.5) * depth * 2).toFixed(2);

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`;

        // Integrated specular glare spotlight
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(255, 106, 0, 0.15), transparent 75%)`;
        }
      });
    },
    [canHover, depth]
  );

  const handleMouseLeave = useCallback(() => {
    if (!canHover || !cardRef.current) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    rectRef.current = null;

    // Smooth luxury return transition
    cardRef.current.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.35s ease-out';
      glareRef.current.style.opacity = '0';
    }
  }, [canHover]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Touch / Mobile Fallback: standard 60 FPS flat layout without 3D perspective overhead
  if (!canHover) {
    return (
      <div className={`h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full [perspective:1000px] ${className}`}
    >
      <div
        ref={cardRef}
        className="relative h-full flex flex-col rounded-2xl will-change-transform transform-gpu [transform-style:preserve-3d]"
      >
        {/* Specular glare layer */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 z-30 overflow-hidden mix-blend-screen"
        />
        {children}
      </div>
    </div>
  );
}

export default Card3DTilt;
