'use client';

import React, { useState } from 'react';
import { Calendar, ExternalLink, MessageCircle, Mountain } from 'lucide-react';

export interface TelegramPost {
  text: string;
  photo?: string | null;
  link: string;
  date: string;
  img?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  title?: string | null;
}

interface TelegramFeedProps {
  initialPosts?: TelegramPost[];
}

function TelegramCard({ post }: { post: TelegramPost }) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = post.image || post.photo || post.imageUrl || post.img || '';
  const isFallback = !imgUrl || imgUrl.includes('elbrus') || imgError;

  const cleanText = post.text ? post.text.trim() : '';
  const previewText = cleanText.length > 180 ? cleanText.slice(0, 180) + '...' : cleanText;

  return (
    <article className="group bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-md dark:shadow-xl hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between">
      {/* 1. Header */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-slate-900 flex items-center justify-center border-b border-white/5">
        {isFallback ? (
          <div className="w-full aspect-[16/9] bg-[#1E392A] flex flex-col items-center justify-center p-6 border-b border-white/5 select-none">
            <Mountain className="h-10 w-10 text-[#C85A32]" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFEA]/80 mt-2">
              KavKazSkiTur
            </span>
          </div>
        ) : (
          <img
            src={imgUrl}
            alt="Telegram"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-sky-400 text-xs font-medium shadow-sm">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.03c-.13.58-.47.72-.96.45l-2.61-1.92-1.26 1.22c-.14.14-.26.26-.53.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.11L8.24 13.5l-2.58-.81c-.56-.17-.57-.56.12-.83l10.08-3.89c.47-.17.88.11.78.83z" />
          </svg>
          <span>Telegram</span>
        </div>
      </div>

      {/* 2. Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <Calendar size={13} className="text-slate-400" />
            <span>{post.date || 'Recent Update'}</span>
          </div>

          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal mb-5 whitespace-pre-line">
            {previewText}
          </p>
        </div>

        <a
          href={post.link || 'https://t.me/kavkazskitur22'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-[#0088cc]/15 dark:bg-white/5 dark:hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 transition-all duration-200 group/btn cursor-pointer"
        >
          <span>View on Telegram</span>
          <ExternalLink size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </article>
  );
}

export default function TelegramFeed({ initialPosts = [] }: TelegramFeedProps) {
  const [posts, setPosts] = React.useState<TelegramPost[]>(initialPosts);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialPosts.length === 0) {
      setIsLoading(true);
      fetch('/api/telegram')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            setPosts(data.posts);
          }
        })
        .catch((err) => console.warn('Telegram feed fetch error:', err))
        .finally(() => setIsLoading(false));
    }
  }, [initialPosts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <TelegramCard key={idx} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400">
            Follow our official Telegram channel{' '}
            <a
              href="https://t.me/kavkazskitur22"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0088cc] font-semibold hover:underline"
            >
              @kavkazskitur22
            </a>{' '}
            for daily mountain dispatches and live summit stories!
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <a
          href="https://t.me/kavkazskitur22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-all"
        >
          <MessageCircle size={18} />
          <span>Join Telegram Channel @kavkazskitur22</span>
        </a>
      </div>
    </div>
  );
}
