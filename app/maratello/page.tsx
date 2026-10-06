import React from 'react';
import type { Metadata } from 'next';
import MaratelloShowcase from '@/components/showcase/MaratelloShowcase';

export const metadata: Metadata = {
  title: 'Maratello — Creative Technologist & Digital Architect | Wonderwell & KavKazSkiTur',
  description: 'Interactive 3D digital showcase and portfolio of Maratello. Featuring Wonderwell.ru digital ecosystem and KavKazSkiTur high-altitude alpine platform with real-time WebGL spatial dynamics.',
  openGraph: {
    title: 'Maratello — Creative Technologist & Digital Architect',
    description: 'Bespoke 3D WebGL showcase presenting Wonderwell.ru and KavKazSkiTur. Next.js 15, Three.js, and high-performance product engineering.',
  },
};

export default function MaratelloPage() {
  return <MaratelloShowcase />;
}
