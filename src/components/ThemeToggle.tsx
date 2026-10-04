'use client';

import React, { useEffect, useState, useRef } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextDark = e.target.checked;
    setIsDark(nextDark);

    if (labelRef.current) {
      labelRef.current.classList.remove('mnt-animating-night', 'mnt-animating-day');
      void labelRef.current.offsetWidth;
      labelRef.current.classList.add(nextDark ? 'mnt-animating-night' : 'mnt-animating-day');
      setTimeout(() => {
        if (labelRef.current) {
          labelRef.current.classList.remove('mnt-animating-night', 'mnt-animating-day');
        }
      }, 550);
    }

    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return <div className="mnt-theme-toggle" style={{ width: '68px', height: '32px' }} />;
  }

  return (
    <label ref={labelRef} className="mnt-theme-toggle" title="Toggle theme">
      <input
        type="checkbox"
        className="mnt-toggle-input"
        role="switch"
        aria-label="Toggle theme"
        checked={isDark}
        onChange={handleToggle}
      />
      <div className="mnt-track">
        {/* Stars (only visible at night) */}
        <div className="mnt-stars">
          <span className="mnt-star" style={{ top: '4px', left: '10px' }}></span>
          <span className="mnt-star" style={{ top: '8px', left: '24px' }}></span>
          <span className="mnt-star" style={{ top: '3px', left: '38px' }}></span>
          <span className="mnt-star" style={{ top: '14px', left: '45px' }}></span>
          <span className="mnt-star" style={{ top: '5px', left: '54px' }}></span>
          <span className="mnt-star" style={{ top: '12px', left: '18px' }}></span>
        </div>
        {/* Cloud (only visible at day) */}
        <div className="mnt-cloud">
          <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
            <path d="M18 10a4 4 0 0 0-7.7-1.4 3 3 0 0 0-4.3 2.4 3.5 3.5 0 0 0 .5 6.5h11a4 4 0 0 0 .5-7.5z" />
          </svg>
        </div>
        {/* Mountains (2 layers) */}
        <div className="mnt-mountains">
          {/* Back layer */}
          <svg className="mnt-mtn-back" viewBox="0 0 68 16" preserveAspectRatio="none">
            <path d="M0 16 L12 4 L24 16 L38 2 L54 16 L68 6 L68 16 Z" />
          </svg>
          {/* Front layer */}
          <svg className="mnt-mtn-front" viewBox="0 0 68 16" preserveAspectRatio="none">
            <path d="M0 16 L8 8 L18 16 L30 6 L44 16 L56 10 L68 16 Z" />
          </svg>
          {/* Snow caps (visible at night) */}
          <svg className="mnt-snow" viewBox="0 0 68 16" preserveAspectRatio="none">
            <path d="M12 4 L16 8 L8 8 Z M38 2 L42 6 L34 6 Z M30 6 L33 9 L27 9 Z M56 10 L58 12 L54 12 Z" fill="#FFFFFF" />
          </svg>
        </div>
        {/* Handle (Sun/Moon) */}
        <div className="mnt-handle will-change-transform transform-gpu translate-z-0">
          <div className="mnt-celestial-body">
            <div className="mnt-crater c1"></div>
            <div className="mnt-crater c2"></div>
          </div>
        </div>
      </div>
    </label>
  );
}

export default React.memo(ThemeToggle);
