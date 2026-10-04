'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { TelegramPost } from './TelegramFeed';

const TelegramFeed = dynamic(() => import('./TelegramFeed'), {
  loading: () => <div className="h-64 rounded-2xl bg-slate-900/30 animate-pulse" />,
});

interface LazyTelegramSectionProps {
  initialPosts?: TelegramPost[];
}

export default function LazyTelegramSection({ initialPosts = [] }: LazyTelegramSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[300px]">
      {isVisible ? (
        <TelegramFeed initialPosts={initialPosts} />
      ) : (
        <div className="h-64 rounded-2xl bg-slate-900/30 animate-pulse" />
      )}
    </div>
  );
}
