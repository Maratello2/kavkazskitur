'use client';

import React, { useRef, useEffect, useState } from 'react';

export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable spotlight tracking on devices with a fine pointer (mouse/trackpad)
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(media.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    boxRef.current.style.setProperty('--mouse-x', `${x}px`);
    boxRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={boxRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300 hover:border-[#FF6A00]/40 hover:shadow-[0_0_25px_rgba(255,106,0,0.12)] ${className}`}
    >
      {canHover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 106, 0, 0.12), transparent 80%)',
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

export default SpotlightCard;
