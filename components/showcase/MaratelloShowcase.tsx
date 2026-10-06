'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
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
  Radio,
  ExternalLink,
  Music,
  Play,
  Square,
  Disc,
  Headphones,
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

interface MusicArtist {
  id: string;
  artist: string;
  role: string;
  region: string;
  anthem: string;
  quote: string;
  albums: string[];
  accent: string;
  borderClass: string;
  glowClass: string;
  tags: string[];
}

const FAVORITE_GAMES: GameItem[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    genre: 'Dystopian Sci-Fi RPG',
    developer: 'CD PROJEKT RED',
    tagline: 'Найт-Сити, хром, импланты, киберпространство и интерфейсы Relic',
    badge: 'НЕОНОВЫЙ КИБЕРПАНК',
    accent: '#FCEE0A',
    borderClass: 'border-yellow-400/30 hover:border-yellow-400/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(250,204,21,0.12)]',
    quote: '"Never fade away. The city of dreams, the city of chrome."',
    tags: ['Night City', 'Ray Tracing', 'Sandevistan', 'Relic Neuro-Link'],
  },
  {
    id: 'lies-of-p',
    title: 'Lies of P',
    genre: 'Belle Époque Dark Souls-like',
    developer: 'Round8 / Neowiz',
    tagline: 'Викторианская готика Крата, сила Эрго и механические марионетки',
    badge: 'ГОТИЧЕСКИЙ СОУЛС-ЛАЙК',
    accent: '#38BDF8',
    borderClass: 'border-sky-400/30 hover:border-sky-400/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(56,189,248,0.12)]',
    quote: '"Lies make you human. How many lies will you weave to wake up?"',
    tags: ['Ergo Energy', 'Legion Arm', 'Victorian Krat', 'Puppet String'],
  },
  {
    id: 'ultrakill',
    title: 'ULTRAKILL',
    genre: 'Hyper-Kinetic Retro FPS',
    developer: 'Arsi "Hakita" Patala',
    tagline: 'Кровь как топливо, ад переполнен, ультраскоростная акробатика и стиль',
    badge: 'SSSTYLE СКОРОСТЬ',
    accent: '#EF4444',
    borderClass: 'border-red-500/30 hover:border-red-500/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(239,68,68,0.12)]',
    quote: '"MANKIND IS DEAD. BLOOD IS FUEL. HELL IS FULL."',
    tags: ['Coin Ricochet', 'Cyber Grind', 'Parry Mechanics', 'Frail Velocity'],
  },
  {
    id: 'doom',
    title: 'DOOM: The Dark Ages',
    genre: 'Dark Fantasy Brutal Warfare FPS',
    developer: 'id Software',
    tagline: 'Щит-пила, боевой цеп, древние боги, демоны и ярость тяжелого металла',
    badge: 'КОСМИЧЕСКИЙ ТЕМНЫЙ МЕТАЛЛ',
    accent: '#F97316',
    borderClass: 'border-orange-500/30 hover:border-orange-500/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(249,115,22,0.12)]',
    quote: '"Before the modern era, the Slayer fought with steel, wrath and saw."',
    tags: ['Shield Saw', 'Heavy Metal', 'Medieval Brutality', 'Cosmic Gods'],
  },
  {
    id: 'nier',
    title: 'NieR: Automata',
    genre: 'Philosophical Android Masterpiece',
    developer: 'PlatinumGames / Yoko Taro',
    tagline: '2B & 9S, меланхоличные скрипичные симфонии и элегантный bullet-hell',
    badge: 'ЭКЗИСТЕНЦИАЛЬНАЯ ДРАМА',
    accent: '#E2E8F0',
    borderClass: 'border-slate-300/30 hover:border-slate-100/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(226,232,240,0.12)]',
    quote: '"Everything that lives is designed to end. We are perpetually trapped in a never-ending spiral."',
    tags: ['Glory to Mankind', 'Yoko Taro', 'Keiichi Okabe', 'Ending E'],
  },
  {
    id: 'control',
    title: 'Control',
    genre: 'Brutalist Supernatural Action',
    developer: 'Remedy Entertainment',
    tagline: 'Старейший Дом трансформируется. Совет говорит через перевернутую пирамиду.',
    badge: 'ФБК // ДОПУСК ДИРЕКТОРА',
    accent: '#F43F5E',
    borderClass: 'border-rose-500/30 hover:border-rose-500/70',
    glowClass: 'hover:shadow-[0_10px_30px_rgba(244,63,94,0.12)]',
    quote: '"You are a worm through time. The thunder song distorts you. Happiness comes of the white pulses of the hammer."',
    tags: ['The Oldest House', 'Jesse Faden', 'The Board', 'Service Weapon', 'Object of Power', 'Hiss Resonance'],
  },
];

const FAVORITE_MUSIC: MusicArtist[] = [
  {
    id: '2pac',
    artist: '2Pac',
    role: 'West Coast Icon & Poet',
    region: 'California / Death Row',
    anthem: 'California Love // Changes // Ambitionz Az a Ridah',
    quote: '"Real eyes realize real lies."',
    albums: ['All Eyez on Me', 'Me Against the World', 'The Don Killuminati'],
    accent: '#EAB308',
    borderClass: 'border-yellow-500/30 hover:border-yellow-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(234,179,8,0.1)]',
    tags: ['Thug Life', 'Poetic Passion', 'G-Funk Rhythm'],
  },
  {
    id: 'biggie',
    artist: 'The Notorious B.I.G.',
    role: 'East Coast Flow King',
    region: 'Brooklyn, New York // Bad Boy',
    anthem: 'Juicy // Big Poppa // Hypnotize',
    quote: '"Stay far from timid, only make moves when your heart\'s in it."',
    albums: ['Ready to Die', 'Life After Death', 'Born Again'],
    accent: '#F97316',
    borderClass: 'border-orange-500/30 hover:border-orange-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(249,115,22,0.1)]',
    tags: ['King of NY', 'Timeless Delivery', 'Bed-Stuy Flow'],
  },
  {
    id: 'dr-dre',
    artist: 'Dr. Dre',
    role: 'G-Funk Master Architect',
    region: 'Compton, California // Aftermath',
    anthem: 'Still D.R.E. // The Next Episode // Nuthin\' but a \'G\' Thang',
    quote: '"Never let \'em see you sweat, bounce back like rubber."',
    albums: ['The Chronic', '2001', 'Compton'],
    accent: '#06B6D4',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(6,182,212,0.1)]',
    tags: ['G-Funk Piano', 'Precision Mixing', 'Aftermath Empire'],
  },
  {
    id: 'eminem',
    artist: 'Eminem',
    role: 'Detroit Lyrical Juggernaut',
    region: 'Detroit, Michigan // Shady Records',
    anthem: 'Lose Yourself // The Way I Am // Till I Collapse',
    quote: '"Look, if you had one shot, or one opportunity, to seize everything you ever wanted..."',
    albums: ['The Marshall Mathers LP', 'The Slim Shady LP', 'The Eminem Show'],
    accent: '#38BDF8',
    borderClass: 'border-sky-400/30 hover:border-sky-400/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(56,189,248,0.1)]',
    tags: ['Multi-syllable Rhymes', '8 Mile Spirit', 'Unmatched Speed'],
  },
  {
    id: 'outkast',
    artist: 'OutKast',
    role: 'Southern Hip-Hop Royalty',
    region: 'Atlanta, Georgia // Dungeon Family',
    anthem: 'Ms. Jackson // B.O.B. // ATLiens // Hey Ya!',
    quote: '"Ain\'t nobody dope as me, I\'m just so fresh, so clean."',
    albums: ['ATLiens', 'Aquemini', 'Stankonia'],
    accent: '#10B981',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(16,185,129,0.1)]',
    tags: ['André 3000', 'Big Boi', 'Afrofuturism & Funk'],
  },
  {
    id: 'mobb-deep',
    artist: 'Mobb Deep',
    role: 'Queensbridge Gritty Realism',
    region: 'Queens, New York // Loud Records',
    anthem: 'Shook Ones, Pt. II // Survival of the Fittest // Quiet Storm',
    quote: '"There\'s a war goin\' on outside no man is safe from."',
    albums: ['The Infamous', 'Hell on Earth', 'Murda Muzik'],
    accent: '#A855F7',
    borderClass: 'border-purple-500/30 hover:border-purple-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(168,85,247,0.1)]',
    tags: ['Havoc & Prodigy', 'Dark Grimy Snare', 'QB Concrete'],
  },
  {
    id: 'the-game',
    artist: 'The Game',
    role: 'West Coast Gangsta Revival',
    region: 'Compton, California // The Black Wall Street',
    anthem: 'Hate It or Love It // How We Do // Dreams',
    quote: '"Hate it or love it, the underdog\'s on top."',
    albums: ['The Documentary', 'Doctor\'s Advocate', 'The R.E.D. Album'],
    accent: '#EF4444',
    borderClass: 'border-red-500/30 hover:border-red-500/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(239,68,68,0.1)]',
    tags: ['Classic Compton', 'G-Unit Era', 'Heartfelt Delivery'],
  },
  {
    id: 'skee-lo',
    artist: 'Skee-Lo',
    role: 'Golden Era Funky Groove',
    region: 'Los Angeles, California',
    anthem: 'I Wish // Top of the Stairs',
    quote: '"I wish I was a little bit taller, I wish I was a baller..."',
    albums: ['I Wish', 'Fresh Ideas'],
    accent: '#F59E0B',
    borderClass: 'border-amber-400/30 hover:border-amber-400/70',
    glowClass: 'hover:shadow-[0_8px_25px_rgba(245,158,11,0.1)]',
    tags: ['90s Infectious Funk', 'Street Baller', 'Grammy Nominated'],
  },
];

// Isolated FPS Badge component (Zero parent re-render overhead)
const IsolatedFpsBadge = memo(function IsolatedFpsBadge() {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060C16] border border-white/[0.08] font-mono text-xs">
      <Activity className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-slate-400">FPS:</span>
      <span className="text-cyan-300 font-bold">{fps}</span>
    </div>
  );
});

// Isolated Moscow Clock component (Zero parent re-render overhead)
const IsolatedMoscowClock = memo(function IsolatedMoscowClock() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' МСК'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060C16] border border-white/[0.08] font-mono text-xs text-slate-300">
      <span className="text-[#FF6A00] font-bold">ВРЕМЯ:</span>
      <span>{timeStr || '18:00:00 МСК'}</span>
    </div>
  );
});

export default function MaratelloShowcase() {
  const [activeProject, setActiveProject] = useState<'all' | 'wonderwell' | 'kavkazskitur'>('all');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPlayingBeat, setIsPlayingBeat] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'MARATELLO LABS // ЯДРО СИСТЕМЫ v2.7.0 ИНИЦИАЛИЗИРОВАНО',
    'Пространственный движок: КОСМИЧЕСКИЙ ЗВЕЗДНЫЙ ШЕЙДЕР (60 FPS СТАБИЛЬНО)',
    'Флагманы в памяти: Wonderwell.ru & KavKazSkiTur.com',
    'Игровая матрица: 6 Шедевров (Cyberpunk, Lies of P, Ultrakill, DOOM, NieR, Control)',
    'Музыкальный радар: 8 Легенд Олдскул Рэпа (2Pac, Biggie, Dre, Eminem, OutKast, Mobb Deep, Game, Skee-Lo)',
    'Введите "help" или нажмите на быстрые команды ниже.',
  ]);

  // Audio synthesizer via native Web Audio API (zero external assets)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const beatTimerRef = useRef<number | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };

  const playChime = (freq = 660, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Synthesize an authentic 90s Old-School Hip-Hop boom-bap drum groove
  const playDrumSound = (type: 'kick' | 'snare' | 'hihat') => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(130, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'snare') {
        const osc = ctx.createOscillator();
        const toneGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
        toneGain.gain.setValueAtTime(0.18, t);
        toneGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(toneGain);
        toneGain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);

        const bufferSize = Math.floor(ctx.sampleRate * 0.1);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
      } else if (type === 'hihat') {
        const bufferSize = Math.floor(ctx.sampleRate * 0.04);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.07, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
      }
    } catch {}
  };

  const toggleOldSchoolBeat = () => {
    if (isPlayingBeat) {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
      setIsPlayingBeat(false);
      return;
    }

    if (!soundEnabled) setSoundEnabled(true);
    setIsPlayingBeat(true);

    let step = 0;
    const intervalMs = Math.round((60000 / 92) / 4);

    beatTimerRef.current = window.setInterval(() => {
      if (step % 2 === 0) playDrumSound('hihat');
      if (step === 0 || step === 7 || step === 10) playDrumSound('kick');
      if (step === 4 || step === 12) playDrumSound('snare');
      step = (step + 1) % 16;
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    };
  }, []);

  const handleCopyTelegram = async () => {
    const text = '@directorbabok';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
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
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopiedTg(true);
    playChime(880, 'triangle', 0.15);
    setTimeout(() => setCopiedTg(false), 2200);
  };

  const handleCopyDiscord = async () => {
    const text = 'maratello';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
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
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopiedDiscord(true);
    playChime(920, 'triangle', 0.15);
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
          'Доступные команды:',
          '  • wonderwell  - Подробности об экосистеме Wonderwell.ru',
          '  • kavkaz      - Архитектура платформы KavKazSkiTur',
          '  • games       - Курируемая матрица 6 любимых игр',
          '  • music       - Олдскул рэп и легенды Золотой Эры Hip-Hop',
          '  • stack       - Инженерный технологический стек',
          '  • whoami      - Кто такой Maratello и принципы работы',
          '  • contact     - Прямые каналы для связи',
          '  • clear       - Очистить историю терминала'
        );
        break;
      case 'wonderwell':
        newLogs.push(
          'WONDERWELL.RU: Премиальная веб-студия и экосистема заказной разработки.',
          'Специализация: Высококонверсионные веб-приложения, авторские анимации, генеративный UI, Telegram-боты.',
          'Сайт: https://wonderwell.ru'
        );
        setActiveProject('wonderwell');
        break;
      case 'kavkaz':
      case 'kavkazskitur':
        newLogs.push(
          'KAVKAZSKITUR: Высокогорная платформа для экспедиций на Эльбрус и Кавказ.',
          'Архитектура: Next.js 15, Three.js 3D-облет, 48 статически скомпилированных страниц, бронирование «Бочек».',
          'Маршрут в системе: / (Главный портал)'
        );
        setActiveProject('kavkazskitur');
        break;
      case 'games':
        newLogs.push(
          'ЛЮБИМЫЕ ИГРЫ & ЭСТЕТИЧЕСКИЕ ВДОХНОВЕНИЯ (6 ШЕДЕВРОВ):',
          '  [1] Cyberpunk 2077       - Dystopian Night City & Chrome Futurism',
          '  [2] Lies of P            - Krat Gothic Steampunk & Ergo Souls-like',
          '  [3] ULTRAKILL            - Blood is Fuel, SSStyle Hyper-Velocity',
          '  [4] DOOM: The Dark Ages  - Heavy Metal Shield-Saw Cosmic Warfare',
          '  [5] NieR: Automata       - Glory to Mankind, Android Existential Elegance',
          '  [6] Control              - FBC Director, The Oldest House & Hiss Resonance'
        );
        break;
      case 'music':
      case 'rap':
        newLogs.push(
          'ОЛДСКУЛ РЭП & ЗОЛОТАЯ ЭРА HIP-HOP (8 ЛЕГЕНД):',
          '  • 2Pac              - All Eyez on Me, California Love ("Real eyes realize real lies.")',
          '  • The Notorious BIG - Ready to Die, Juicy ("Stay far from timid, only make moves when your heart\'s in it.")',
          '  • Dr. Dre           - The Chronic, 2001, G-Funk Architect ("Never let \'em see you sweat...")',
          '  • Eminem            - The Marshall Mathers LP, Lose Yourself ("Look, if you had one shot...")',
          '  • OutKast           - ATLiens, Ms. Jackson ("Ain\'t nobody dope as me, I\'m just so fresh...")',
          '  • Mobb Deep         - The Infamous, Shook Ones Pt. II ("There\'s a war goin\' on outside...")',
          '  • The Game          - The Documentary, Hate It or Love It ("Underdog\'s on top")',
          '  • Skee-Lo           - I Wish ("I wish I was a little bit taller, I wish I was a baller...")'
        );
        break;
      case 'stack':
        newLogs.push(
          'ИНЖЕНЕРНЫЙ СТЕК:',
          '  - Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Motion',
          '  - 3D/Графика: Three.js, WebGL 2.0, кастомные GLSL шейдеры звездного неба, 60 FPS',
          '  - Бэкенд: Node.js, Python, PostgreSQL, Prisma ORM, Redis',
          '  - Инфраструктура: Docker, Linux, CI/CD, Edge Vercel & VPS'
        );
        break;
      case 'whoami':
        newLogs.push(
          'MARATELLO: Цифровой архитектор, креативный разработчик и билдер.',
          'Создаю бескомпромиссные цифровые продукты с акцентом на скорость, эстетику и безотказную работу.'
        );
        break;
      case 'contact':
        newLogs.push(
          'ПРЯМЫЕ КОНТАКТЫ:',
          '  - Telegram: https://t.me/directorbabok (@directorbabok)',
          '  - Discord:  maratello',
          '  - GitHub:   https://github.com/Maratello2',
          '  - WhatsApp: +7 (928) 082-84-13'
        );
        break;
      case 'clear':
        setTerminalLogs(['ТЕРМИНАЛ ОЧИЩЕН // MARATELLO LABS']);
        setTerminalInput('');
        return;
      default:
        newLogs.push(`Команда "${input}" не распознана. Введите "help" для списка доступных команд.`);
    }

    setTerminalLogs(newLogs.slice(-18));
    setTerminalInput('');
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#020408] text-slate-100 font-sans selection:bg-[#FF6A00]/30 selection:text-white overflow-x-hidden">
      {/* 1. 3D WebGL Canvas Layer (Cosmic Black Starfield with Twinkling Stars) */}
      <ThreeCanvasBackground activeProject={activeProject} />

      {/* 2. Top Telemetry HUD Bar */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Identity Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#060C16] border border-white/10 flex items-center justify-center font-black font-mono text-sm text-[#FF6A00] shadow-lg">
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
              ЦИФРОВОЙ АРХИТЕКТОР // CREATIVE DEV
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Moscow Clock (Isolated Component) */}
          <IsolatedMoscowClock />

          {/* Real-time FPS (Isolated Component) */}
          <IsolatedFpsBadge />

          {/* Sound Synthesizer Switcher */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playChime(750, 'sine', 0.15);
              else if (isPlayingBeat) toggleOldSchoolBeat();
            }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/50'
                : 'bg-[#060C16] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Синтез звука активен' : 'Звук отключен'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline">{soundEnabled ? 'ЗВУК ВКЛ' : 'ЗВУК ВЫКЛ'}</span>
          </button>

          {/* Return to Expedition Platform */}
          <Link
            href="/"
            onClick={() => playChime(440, 'sine', 0.1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#060C16] hover:bg-white/[0.08] border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95 cursor-pointer"
          >
            <Mountain size={13} className="text-[#FF6A00]" />
            <span className="hidden xs:inline">KavKazSkiTur</span>
            <ArrowUpRight size={13} className="text-slate-400" />
          </Link>
        </div>
      </header>

      {/* 3. Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-20 space-y-16 sm:space-y-24">
        {/* Top Hero Statement */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          {/* Status Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#060C16] border border-white/[0.08] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-ping" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300">
              Интерактивная 3D-визитка • Портфолио 2026
            </span>
          </div>

          {/* Kinetic Display Title */}
          <h1 className="text-4xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.95] drop-shadow-2xl">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MARATELLO
            </span>
          </h1>

          {/* Core Philosophy Paragraph (Russian) */}
          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Цифровой архитектор и креативный разработчик. Проектирую{' '}
            <span className="text-cyan-300 font-medium">высокопроизводительные веб-системы</span>,{' '}
            <span className="text-[#FF6A00] font-medium">пространственный 3D WebGL</span> и{' '}
            надежные цифровые продукты без компромиссов.
          </p>

          {/* Direct Contacts Action Matrix */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            {/* Telegram Copy */}
            <button
              type="button"
              onClick={handleCopyTelegram}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#060C16] hover:bg-white/[0.08] active:scale-95 border border-white/[0.1] text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer shadow-md"
            >
              {copiedTg ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-sky-400" />}
              <span>{copiedTg ? 'СКОПИРОВАНО!' : 'TG: @DIRECTORBABOK'}</span>
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
              <span>НАПИСАТЬ В ТЕЛЕГРАМ</span>
            </a>

            {/* Discord Copy */}
            <button
              type="button"
              onClick={handleCopyDiscord}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 text-[#9ba5ff] hover:text-white border border-[#5865F2]/30 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {copiedDiscord ? <Check size={14} className="text-emerald-400" /> : <Radio size={14} className="text-[#5865F2]" />}
              <span>{copiedDiscord ? 'СКОПИРОВАНО!' : 'DISCORD: MARATELLO'}</span>
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/Maratello2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playChime(600, 'sine', 0.1)}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#060C16] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Github size={14} />
              <span>GITHUB: @MARATELLO2</span>
            </a>
          </div>
        </section>

        {/* 4. Dual Flagship Projects Section */}
        <section className="space-y-8">
          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6A00]" />
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Флагманские Проекты
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Две эталонные платформы: коммерческая продуктовая инженерия и пространственный веб
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#060C16] border border-white/[0.08]">
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
                  {filter === 'all' ? 'Все (2)' : filter === 'wonderwell' ? 'Wonderwell' : 'KavkazSkiTur'}
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
                badge="Цифровая Студия & Экосистема"
                category="ВЕБ-АРХИТЕКТУРА // CREATIVE PRODUCTION"
                tagline="Элитная веб-студия и заказная продуктовая разработка"
                description="Премиальная веб-студия и экосистема цифровых продуктов. Создание высококонверсионных веб-приложений, авторских анимаций, генеративного UI, Telegram-ботов и масштабируемых корпоративных платформ."
                metrics={[
                  { label: 'СКОРОСТЬ', value: '100 / 100' },
                  { label: 'ФОРМАТ', value: 'FULL-CYCLE' },
                  { label: 'СТЕК', value: 'NEXT 15 + AI' },
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
                badge="Высокогорная Платформа"
                category="SPATIAL WEBGL // ТЕЛЕМЕТРИЯ ЭКСПЕДИЦИЙ"
                tagline="Инфраструктура восхождений на Эльбрус и Кавказ"
                description="Комплексная коммерческая платформа для альпинизма и ски-туров на Next.js 15 и Three.js. 3D-облет маршрутов, интерактивные профили высот, бронирование приюта «Бочки» и соблюдение 152-ФЗ."
                metrics={[
                  { label: 'МАРШРУТЫ', value: '48 STATIC' },
                  { label: 'РЕНДЕР', value: '60 FPS 3D' },
                  { label: 'ЗАЯВКИ', value: 'WHATSAPP' },
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

        {/* 5. Favorite Games & Aesthetic Matrix (6 Games, Quotes Preserved, No backdrop-blur) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-5 h-5 text-[#FF6A00]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Эстетический Радар &amp; Игровые Вдохновения
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-light">
                  Темная готика, кинетический киберпанк, бешеный темп и экзистенциальный сай-фай
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              КУРИРУЕМЫЙ СПИСОК // 6 ШЕДЕВРОВ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAVORITE_GAMES.map((game) => (
              <div
                key={game.id}
                onMouseEnter={() => playChime(game.id === 'ultrakill' ? 880 : game.id === 'control' ? 760 : 640, 'triangle', 0.06)}
                className={`rounded-2xl p-5 sm:p-6 bg-[#060C16] border shadow-xl transition-all duration-200 hover:scale-[1.015] flex flex-col justify-between group ${game.borderClass} ${game.glowClass}`}
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

                  {/* Quote (Preserved in original form) */}
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

        {/* 6. Old-School Rap & Audio Deck Section (8 Hip-Hop Legends, No backdrop-blur) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Headphones className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Олдскул Рэп &amp; Золотая Эра Хип-Хопа
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-light">
                  West Coast G-Funk, жесткий Queensbridge реализм, лирический Детройт и южный грув
                </p>
              </div>
            </div>

            {/* Synthesized Boom-Bap Beat Player */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleOldSchoolBeat}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isPlayingBeat
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-950/60 animate-pulse'
                    : 'bg-[#060C16] border-white/10 text-slate-300 hover:text-white hover:border-amber-400/40'
                }`}
              >
                {isPlayingBeat ? <Square size={13} className="fill-amber-300 text-amber-300" /> : <Play size={13} className="fill-slate-300" />}
                <span>{isPlayingBeat ? 'СТОП БИТ // 92 BPM' : 'ВКЛЮЧИТЬ 90s БИТ'}</span>
              </button>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest hidden md:inline">
                8 ЛЕГЕНД
              </span>
            </div>
          </div>

          {/* 8 Rap Artist Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FAVORITE_MUSIC.map((music) => (
              <div
                key={music.id}
                onMouseEnter={() => playChime(music.id === '2pac' ? 520 : music.id === 'dr-dre' ? 680 : 600, 'sine', 0.08)}
                className={`rounded-2xl p-4 sm:p-5 bg-[#060C16] border shadow-xl transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between group ${music.borderClass} ${music.glowClass}`}
              >
                <div className="space-y-2.5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300">
                      {music.role}
                    </span>
                    <Disc className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-700" />
                  </div>

                  {/* Artist Name & Region */}
                  <div>
                    <h3 className="text-lg font-black uppercase text-white tracking-tight group-hover:text-amber-200 transition-colors">
                      {music.artist}
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                      {music.region}
                    </span>
                  </div>

                  {/* Anthems */}
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] font-mono text-amber-400 block font-semibold mb-0.5">
                      ХИТЫ:
                    </span>
                    <p className="text-[11px] text-slate-300 font-medium truncate">
                      {music.anthem}
                    </p>
                  </div>

                  {/* Quote (Preserved) */}
                  <div className="font-serif italic text-xs text-slate-300/90 leading-snug pt-1">
                    {music.quote}
                  </div>
                </div>

                {/* Bottom Album Chips */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center gap-1 flex-wrap">
                  {music.albums.slice(0, 2).map((alb) => (
                    <span
                      key={alb}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-400"
                    >
                      {alb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Engineering Disciplines & Tech Radar */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Инженерные Дисциплины &amp; Технологический Радар
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#060C16] border border-white/[0.08] hover:border-cyan-500/30 transition-all">
              <Code2 className="w-5 h-5 text-cyan-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">3D &amp; Пространственный Веб</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Three.js, WebGL 2.0 шейдеры, звездное небо, процедурные частицы, ACES Filmic tonemapping.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060C16] border border-white/[0.08] hover:border-orange-500/30 transition-all">
              <Zap className="w-5 h-5 text-[#FF6A00] mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Next.js 15 Архитектура</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                App Router, Server Components, SSG статическая генерация, Tailwind CSS v4, бескомпромиссная скорость.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060C16] border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <Layers className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Бэкенд &amp; Системы</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                PostgreSQL, Prisma ORM, Python, Redis, безопасная авторизация, соответствие 152-ФЗ, REST &amp; WebSocket.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#060C16] border border-white/[0.08] hover:border-purple-500/30 transition-all">
              <Sparkles className="w-5 h-5 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Микро-Взаимодействия &amp; Дизайн</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                Пружинная физика Эмиля Ковальски, минимализм обсидиановых палитр, дизайн-системы без шаблонов.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Interactive Command Terminal */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">
                Интерактивный Системный Терминал
              </h2>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase">
              CLI КОНСОЛЬ // BASH ЭМУЛЯТОР
            </span>
          </div>

          <div className="rounded-2xl bg-[#040810] border border-white/10 p-4 sm:p-6 font-mono text-xs shadow-2xl space-y-4">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 text-[10px] pl-2">maratello@cosmos:~/showcase</span>
              </div>
              <button
                type="button"
                onClick={() => handleTerminalSubmit('clear')}
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
              >
                ОЧИСТИТЬ [CLS]
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
              <span className="text-[10px] uppercase text-slate-400 mr-1">Команды:</span>
              {['help', 'wonderwell', 'kavkaz', 'games', 'music', 'stack', 'whoami', 'contact'].map((cmd) => (
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
                placeholder="введите команду (напр. help, games, music, contact)..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-slate-200 transition-colors cursor-pointer"
              >
                ВЫПОЛНИТЬ
              </button>
            </form>
          </div>
        </section>

        {/* 9. Direct Contact & Footer */}
        <footer className="pt-8 pb-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-xs text-slate-400 font-mono">
              &copy; 2026 MARATELLO. АВТОРСКАЯ ЦИФРОВАЯ ВИЗИТКА.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Презентация проектов Wonderwell.ru &amp; KavKazSkiTur.com
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
