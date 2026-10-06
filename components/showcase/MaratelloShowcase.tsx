'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Send,
  Github,
  Sparkles,
  Mountain,
  Code2,
  Cpu,
  Layers,
  ArrowUpRight,
  Activity,
  Zap,
  Gamepad2,
  Swords,
  Skull,
  Flame,
  Radio,
  ExternalLink,
} from 'lucide-react';
import ThreeCanvasBackground from './ThreeCanvasBackground';
import ProjectCard3D from './ProjectCard3D';

interface GameItem {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  developer: string;
  accent: string;
  borderClass: string;
  glowClass: string;
  badge: string;
  quote: string;
  tags: string[];
}

const FAVORITE_GAMES: GameItem[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    genre: 'Dystopian Sci-Fi RPG',
    developer: 'CD PROJEKT RED',
    tagline: 'Night City, Chrome, High-Tech Low-Life & Relic Interfaces',
    badge: 'NEON DYSTOPIA',
    accent: '#FCEE0A',
    borderClass: 'border-yellow-400/30 hover:border-yellow-400/70',
    glowClass: 'shadow-yellow-500/10 hover:shadow-yellow-500/25',
    quote: '"Never fade away. The city of dreams, the city of chrome."',
    tags: ['Night City', 'Ray Tracing', 'Sandevistan', 'Relic Neuro-Link'],
  },
  {
    id: 'lies-of-p',
    title: 'Lies of P',
    genre: 'Belle Époque Dark Souls-like',
    developer: 'Round8 / Neowiz',
    tagline: 'Krat Gothic Architecture, Ergo Power & Mechanical Puppets',
    badge: 'GOTHIC SOULS-LIKE',
    accent: '#38BDF8',
    borderClass: 'border-sky-400/30 hover:border-sky-400/70',
    glowClass: 'shadow-sky-500/10 hover:shadow-sky-500/25',
    quote: '"Lies make you human. How many lies will you weave to wake up?"',
    tags: ['Ergo Energy', 'Legion Arm', 'Victorian Krat', 'Puppet String'],
  },
  {
    id: 'ultrakill',
    title: 'ULTRAKILL',
    genre: 'Hyper-Kinetic Retro FPS',
    developer: 'Arsi "Hakita" Patala',
    tagline: 'Blood is Fuel, Hell is Full, Relentless SSStyle Velocity',
    badge: 'SSSTYLE VELOCITY',
    accent: '#EF4444',
    borderClass: 'border-red-500/30 hover:border-red-500/70',
    glowClass: 'shadow-red-500/10 hover:shadow-red-500/25',
    quote: '"MANKIND IS DEAD. BLOOD IS FUEL. HELL IS FULL."',
    tags: ['Coin Ricochet', 'Cyber Grind', 'Parry Mechanics', 'Frail Velocity'],
  },
  {
    id: 'doom',
    title: 'DOOM: The Dark Ages',
    genre: 'Medieval Cosmic Warfare FPS',
    developer: 'id Software',
    tagline: 'Shield Saw, Flail of Torment, Gods, Demons & Heavy Metal Fury',
    badge: 'COSMIC HELLFIRE',
    accent: '#F97316',
    borderClass: 'border-orange-500/30 hover:border-orange-500/70',
    glowClass: 'shadow-orange-500/10 hover:shadow-orange-500/25',
    quote: '"Before the modern era, the Slayer fought with steel, wrath and saw."',
    tags: ['Shield Saw', 'Heavy Metal', 'Medieval Brutality', 'Cosmic Gods'],
  },
  {
    id: 'nier',
    title: 'NieR: Automata',
    genre: 'Philosophical Android Masterpiece',
    developer: 'PlatinumGames / Yoko Taro',
    tagline: '2B & 9S, Melancholic Violin Symphonies & Bullet-Hell Elegance',
    badge: 'EXISTENTIAL OPERA',
    accent: '#E2E8F0',
    borderClass: 'border-slate-300/30 hover:border-slate-100/70',
    glowClass: 'shadow-slate-400/10 hover:shadow-slate-400/25',
    quote: '"Everything that lives is designed to end. We are perpetually trapped in a never-ending spiral."',
    tags: ['Glory to Mankind', 'Yoko Taro', 'Keiichi Okabe', 'Ending E'],
  },
];

export default function MaratelloShowcase() {
  const [activeProject, setActiveProject] = useState<'all' | 'wonderwell' | 'kavkazskitur'>('all');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [fps, setFps] = useState(60);
  const [timeStr, setTimeStr] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'MARATELLO LABS // OS v2.6.4 INITIALIZED',
    'WebGL 2.0 Spatial Engine: ACTIVE (60 FPS)',
    'Flagships Loaded: Wonderwell.ru & KavKazSkiTur.com',
    'Gaming Matrix: 5 Influences Synced (Cyberpunk, Lies of P, Ultrakill, DOOM, NieR)',
    'Type "help" or click quick chips below to explore commands.',
  ]);

  // Audio synthesizer via native Web Audio API (zero external assets)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq = 660, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // FPS Counter & Clock
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);

    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' MSK'
      );
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(clockInterval);
    };
  }, []);

  const handleCopyTelegram = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('@directorbabok');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = '@directorbabok';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = '@directorbabok';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopiedTg(true);
    playChime(880, 'triangle', 0.18);
    setTimeout(() => setCopiedTg(false), 2200);
  };

  const handleCopyDiscord = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('maratello');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = 'maratello';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = 'maratello';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopiedDiscord(true);
    playChime(920, 'triangle', 0.18);
    setTimeout(() => setCopiedDiscord(false), 2200);
  };

  const handleTerminalSubmit = (cmd?: string) => {
    const input = (cmd || terminalInput).trim().toLowerCase();
    if (!input) return;

    playChime(540, 'sine', 0.1);

    const newLogs = [...terminalLogs, `> ${input}`];

    switch (input) {
      case 'help':
        newLogs.push(
          'Available commands:',
          '  • wonderwell  - Details about Wonderwell.ru ecosystem',
          '  • kavkaz      - Details about KavKazSkiTur platform',
          '  • games       - Favorite aesthetic game inspirations',
          '  • stack       - Technical engineering stack matrix',
          '  • whoami      - Creator credentials and mission',
          '  • contact     - Direct communications channels',
          '  • clear       - Flush terminal history'
        );
        break;
      case 'wonderwell':
        newLogs.push(
          'WONDERWELL.RU: Digital product agency & tech ecosystem.',
          'Specialization: High-conversion web applications, custom platforms, Telegram bot automations.',
          'Live URL: https://wonderwell.ru'
        );
        setActiveProject('wonderwell');
        break;
      case 'kavkaz':
      case 'kavkazskitur':
        newLogs.push(
          'KAVKAZSKITUR: High-altitude expedition & mountaineering platform.',
          'Architecture: Next.js 15, Three.js 3D flythrough, 47 pre-rendered static routes.',
          'Local Portal: Available at root URL /'
        );
        setActiveProject('kavkazskitur');
        break;
      case 'games':
        newLogs.push(
          'CORE GAMING & AESTHETIC INSPIRATIONS:',
          '  [1] Cyberpunk 2077       - Dystopian Night City & Chrome Futurism',
          '  [2] Lies of P            - Krat Gothic Steampunk & Ergo Souls-like',
          '  [3] ULTRAKILL            - Blood is Fuel, SSStyle Hyper-Velocity',
          '  [4] DOOM: The Dark Ages  - Heavy Metal Shield-Saw Cosmic Warfare',
          '  [5] NieR: Automata       - Glory to Mankind, Android Existential Elegance'
        );
        break;
      case 'stack':
        newLogs.push(
          'CORE STACK:',
          '  - Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Motion',
          '  - 3D/Graphics: Three.js, WebGL, GLSL Shaders, Procedural Meshes',
          '  - Backend: Node.js, Python, PostgreSQL, Prisma, Redis',
          '  - DevOps: Docker, Linux, CI/CD, Edge Vercel & VPS deployments'
        );
        break;
      case 'whoami':
        newLogs.push(
          'MARATELLO: Digital Architect, Creative Developer, Builder.',
          'Crafting high-impact digital experiences with zero compromise on speed, aesthetics, and reliability.'
        );
        break;
      case 'contact':
        newLogs.push(
          'DIRECT CHANNELS:',
          '  - Telegram: https://t.me/directorbabok (@directorbabok)',
          '  - Discord:  maratello',
          '  - GitHub:   https://github.com/Maratello2',
          '  - WhatsApp: +7 (928) 082-84-13'
        );
        break;
      case 'clear':
        setTerminalLogs(['TERMINAL CLEARED // MARATELLO LABS']);
        setTerminalInput('');
        return;
      default:
        newLogs.push(`Command "${input}" not recognized. Type "help" for command manifest.`);
    }

    setTerminalLogs(newLogs.slice(-15));
    setTerminalInput('');
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#04070D] text-slate-100 font-sans selection:bg-[#FF6A00]/30 selection:text-white overflow-x-hidden">
      {/* 1. 3D WebGL Canvas Layer */}
      <ThreeCanvasBackground activeProject={activeProject} />

      {/* 2. Precision Ambient Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial from-transparent via-[#04070D]/50 to-[#04070D]" />

      {/* 4. Top Telemetry HUD Bar */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Identity Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-black font-mono text-sm text-[#FF6A00] shadow-lg">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
                MARATELLO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 tracking-widest uppercase block">
              DIGITAL ARCHITECT // CREATIVE DEV
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-slate-300">
            <span className="text-[#FF6A00] font-bold">TIME:</span>
            <span>{timeStr || '12:00:00 MSK'}</span>
          </div>

          {/* FPS */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">FPS:</span>
            <span className="text-cyan-300 font-bold">{fps}</span>
          </div>

          {/* Sound Synthesizer Switcher */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playChime(750, 'sine', 0.15);
            }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/50'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Synthesized Audio ON' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          {/* Return to Expedition Platform */}
          <Link
            href="/"
            onClick={() => playChime(440, 'sine', 0.1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95 cursor-pointer"
          >
            <Mountain size={13} className="text-[#FF6A00]" />
            <span className="hidden xs:inline">KavKazSkiTur</span>
            <ArrowUpRight size={13} className="text-slate-400" />
          </Link>
        </div>
      </header>

      {/* 5. Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-20 space-y-16 sm:space-y-24">
        {/* Top Hero Statement */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          {/* Status Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-ping" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300">
              Interactive Digital Card • 2026 Portfolio
            </span>
          </div>

          {/* Kinetic Display Title */}
          <h1 className="text-4xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.95] drop-shadow-2xl">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MARATELLO
            </span>
          </h1>

          {/* Core Philosophy Paragraph */}
          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Digital architect & creative technologist crafting{' '}
            <span className="text-cyan-300 font-medium">high-performance web systems</span>,{' '}
            <span className="text-[#FF6A00] font-medium">spatial 3D experiences</span>, and{' '}
            bulletproof digital products.
          </p>

          {/* Direct Contacts Action Matrix */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            {/* Telegram Copy */}
            <button
              type="button"
              onClick={handleCopyTelegram}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.1] text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer shadow-md"
            >
              {copiedTg ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-sky-400" />}
              <span>{copiedTg ? 'COPIED TG!' : 'TG: @DIRECTORBABOK'}</span>
            </button>

            {/* Direct Telegram Chat */}
            <a
              href="https://t.me/directorbabok"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playChime(700, 'sine', 0.1)}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-sky-300 border border-[#0088cc]/40 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Send size={14} />
              <span>TELEGRAM CHAT</span>
            </a>

            {/* Discord Copy */}
            <button
              type="button"
              onClick={handleCopyDiscord}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 text-[#9ba5ff] hover:text-white border border-[#5865F2]/30 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {copiedDiscord ? <Check size={14} className="text-emerald-400" /> : <Radio size={14} className="text-[#5865F2]" />}
              <span>{copiedDiscord ? 'COPIED DISCORD!' : 'DISCORD: MARATELLO'}</span>
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/Maratello2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playChime(600, 'sine', 0.1)}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Github size={14} />
              <span>GITHUB: @MARATELLO2</span>
            </a>
          </div>
        </section>

        {/* 6. Dual Flagship Projects Section */}
        <section className="space-y-8">
          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6A00]" />
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Flagship Creations
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Two benchmark platforms representing commercial product engineering & spatial web
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              {(['all', 'wonderwell', 'kavkazskitur'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveProject(filter);
                    playChime(filter === 'wonderwell' ? 800 : filter === 'kavkazskitur' ? 500 : 650, 'sine', 0.1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    activeProject === filter
                      ? 'bg-white/10 text-white shadow-sm border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'All (2)' : filter === 'wonderwell' ? 'Wonderwell' : 'KavkazSkiTur'}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Perspective Tilt Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Wonderwell.ru */}
            {(activeProject === 'all' || activeProject === 'wonderwell') && (
              <ProjectCard3D
                id="wonderwell"
                title="WONDERWELL"
                domain="wonderwell.ru"
                badge="Digital Studio & Ecosystem"
                category="WEB ARCHITECTURE // CREATIVE PRODUCTION"
                tagline="Elite Digital Studio & Custom Product Engineering"
                description="High-end web development company and technology ecosystem. Creating high-conversion digital experiences, bespoke animations, generative UI, Telegram bots, and scalable enterprise architectures."
                metrics={[
                  { label: 'LIGHTHOUSE', value: '100 / 100' },
                  { label: 'DELIVERY', value: 'FULL-CYCLE' },
                  { label: 'TECH', value: 'NEXT 15 + AI' },
                ]}
                tags={['Next.js', 'React', 'TypeScript', 'Tailwind', 'Telegram Bot API', 'PostgreSQL', 'Framer Motion']}
                ctaUrl="https://wonderwell.ru"
                isExternal={true}
                accentColor="cyan"
                onHover={() => playChime(720, 'sine', 0.08)}
              />
            )}

            {/* Card 2: KavKazSkiTur.com */}
            {(activeProject === 'all' || activeProject === 'kavkazskitur') && (
              <ProjectCard3D
                id="kavkazskitur"
                title="KAVKAZSKITUR"
                domain="kavkazskitur.com"
                badge="High-Altitude Alpine Platform"
                category="SPATIAL WEBGL // EXPEDITION TELEMETRY"
                tagline="Mount Elbrus & Caucasus Expeditions Infrastructure"
                description="Comprehensive commercial mountaineering platform built with Next.js 15 and Three.js. Features 3D mountain flythroughs, interactive altitude charts, Garabashi Barrels refuge booking, and 152-FZ compliance."
                metrics={[
                  { label: 'PAGES', value: '48 STATIC' },
                  { label: 'RENDER', value: '60 FPS 3D' },
                  { label: 'LEADS', value: 'WHATSAPP' },
                ]}
                tags={['Three.js', 'WebGL', 'Next.js 15 SSG', 'Leaflet', 'Prisma ORM', 'Alpine Luxury UI']}
                ctaUrl="/"
                isExternal={false}
                accentColor="orange"
                onHover={() => playChime(520, 'sine', 0.08)}
              />
            )}
          </div>
        </section>

        {/* 7. Favorite Games & Aesthetic Matrix */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-5 h-5 text-[#FF6A00]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Aesthetic Radar &amp; Core Gaming Influences
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-light">
                  Dark Gothic, Kinetic Cyberpunk, High-Velocity Warfare &amp; Melancholic Existentialism
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              CURATED LIST // 5 MASTERPIECES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAVORITE_GAMES.map((game) => (
              <div
                key={game.id}
                onMouseEnter={() => playChime(game.id === 'ultrakill' ? 880 : 640, 'triangle', 0.06)}
                className={`rounded-2xl p-5 sm:p-6 bg-[#060B14]/90 border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.015] flex flex-col justify-between group ${game.borderClass} ${game.glowClass}`}
              >
                <div className="space-y-3">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                      {game.badge}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {game.developer}
                    </span>
                  </div>

                  {/* Title & Genre */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight group-hover:text-slate-100 transition-colors">
                      {game.title}
                    </h3>
                    <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                      {game.genre}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {game.tagline}
                  </p>

                  {/* Quote */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] font-serif italic text-xs text-slate-300 leading-snug">
                    {game.quote}
                  </div>
                </div>

                {/* Chips */}
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-1.5 flex-wrap">
                  {game.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Engineering Disciplines & Tech Radar */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Engineering Disciplines & Tech Radar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
              <Code2 className="w-5 h-5 text-cyan-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">3D & Spatial Web</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Three.js, WebGL shaders, camera flythroughs, procedural particle dynamics, ACES Filmic tonemapping.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all">
              <Zap className="w-5 h-5 text-[#FF6A00] mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Next.js 15 Core</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                App Router, Server Components, SSG static pre-generation, Tailwind CSS v4, zero-lag Web Vitals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <Layers className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Systems & Backend</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                PostgreSQL, Prisma, Python, Redis, secure authentication, 152-FZ data handling, REST & GraphQL.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 transition-all">
              <Sparkles className="w-5 h-5 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Micro-Interaction Craft</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Emil Kowalski spring physics, Vercel obsidian discipline, anti-slop editorial design systems.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Interactive Command Terminal */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">
                Interactive Systems Terminal
              </h2>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase">
              CLI CONSOLE // BASH EMULATOR
            </span>
          </div>

          <div className="rounded-2xl bg-[#050A12]/95 border border-white/10 p-4 sm:p-6 font-mono text-xs shadow-2xl space-y-4 backdrop-blur-md">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 text-[10px] pl-2">maratello@hyperion:~/showcase</span>
              </div>
              <button
                type="button"
                onClick={() => handleTerminalSubmit('clear')}
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
              >
                CLEAR [CLS]
              </button>
            </div>

            {/* Log Stream */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto text-slate-300 font-mono scrollbar-thin">
              {terminalLogs.map((log, i) => (
                <div key={i} className={log.startsWith('>') ? 'text-[#FF6A00] font-bold' : ''}>
                  {log}
                </div>
              ))}
            </div>

            {/* Quick Interactive Command Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] uppercase text-slate-400 mr-1">Chips:</span>
              {['help', 'wonderwell', 'kavkaz', 'games', 'stack', 'whoami', 'contact'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleTerminalSubmit(cmd)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-[10px] font-mono text-cyan-300 transition-all cursor-pointer"
                >
                  ${cmd}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTerminalSubmit();
              }}
              className="flex items-center gap-2 pt-2"
            >
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type command (e.g. help, games, contact)..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-slate-200 transition-colors cursor-pointer"
              >
                EXEC
              </button>
            </form>
          </div>
        </section>

        {/* 10. Direct Contact & Footer */}
        <footer className="pt-8 pb-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-xs text-slate-400 font-mono">
              &copy; 2026 MARATELLO. PROPRIETARY DIGITAL SHOWCASE.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Featuring Wonderwell.ru &amp; KavKazSkiTur.com
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <a
              href="https://t.me/directorbabok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
            >
              TG: @DIRECTORBABOK
            </a>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={handleCopyDiscord}
              className="text-xs font-mono font-bold text-[#9ba5ff] hover:text-white transition-colors cursor-pointer"
            >
              DISCORD: MARATELLO
            </button>
            <span className="text-white/20">•</span>
            <a
              href="https://github.com/Maratello2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
            >
              GITHUB
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://wonderwell.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              WONDERWELL.RU
            </a>
            <span className="text-white/20">•</span>
            <Link
              href="/"
              className="text-xs font-mono font-bold text-[#FF6A00] hover:text-orange-400 transition-colors"
            >
              KAVKAZSKITUR.COM
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
