import React from 'react';
import { getGuides } from '@/lib/data';
import { getImageUrl } from '@/lib/imageUrl';
import {
  Award,
  Mountain,
  ShieldCheck,
  Compass,
  Clock,
  User,
  MessageCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Mountain Guides Team | KavKazSkiTur',
  description:
    'Our certified mountain guides: Russian Mountaineering Federation (FAR) accreditation, EMERCOM rescue certification, and professional Caucasus alpine instructors.',
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-[#C85A32] mb-4">
            <Award className="w-4 h-4" /> Alpine Route Experts
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            KavKazSkiTur Mountain Guides
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            In the high mountains, personnel defines everything. Each of our guides is an active alpinist with formal FAR certification, trained in mountain rescue, and dedicated to your safety and summit success.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.length > 0 ? (
            guides.map((guide) => {
              const waText = encodeURIComponent(
                `Hello! I would like to consult regarding an expedition with guide ${guide.name}.`
              );
              const waUrl = `https://wa.me/79286914405?text=${waText}`;
              const hasPhoto = Boolean(guide.photo_url && !guide.photo_url.endsWith('.svg') && !guide.photo_url.includes('placeholder'));

              return (
                <div
                  key={guide.id}
                  className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 hover:border-orange-500/40 rounded-3xl overflow-hidden shadow-lg dark:shadow-none transition-all duration-300 flex flex-col group"
                >
                  {/* Photo or Placeholder */}
                  <div className="h-80 sm:h-96 relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                    {hasPhoto ? (
                      <img
                        src={getImageUrl(guide.photo_url)}
                        alt={guide.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <User className="w-16 h-16 text-slate-400" />
                        <span className="text-xs text-slate-400 mt-2 font-medium">Photo incoming</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Role & Name */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#C85A32] text-white text-[11px] font-extrabold uppercase tracking-wider mb-1.5 shadow-md">
                        {guide.role || 'Lead Mountain Guide'}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {guide.name}
                      </h3>
                    </div>
                  </div>

                  {/* Info & Metrics */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Experience</span>
                          <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                            <Clock size={15} className="text-[#C85A32]" />
                            {guide.years ? `${guide.years} years` : '10+ years'}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Ascents</span>
                          <span className="text-base font-extrabold text-[#C85A32] flex items-center gap-1.5 mt-0.5">
                            <Mountain size={15} />
                            {guide.ascents ? `${guide.ascents}+` : '50+'}
                          </span>
                        </div>
                      </div>

                      {/* Certification */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                          <span>FAR & EMERCOM Certified</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Qualifications: Mountain Instructor, Wilderness First Aid (WFA) International Certification.
                        </p>
                      </div>

                      {guide.favorite && (
                        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Compass size={15} className="text-[#C85A32] shrink-0 mt-0.5" />
                          <span>
                            Favorite Region: <strong className="text-slate-900 dark:text-white">{guide.favorite}</strong>
                          </span>
                        </div>
                      )}

                      {guide.bio && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {guide.bio}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl bg-orange-500/10 hover:bg-[#C85A32] text-[#C85A32] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={15} />
                        <span>Consult with Guide</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-16 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-white/5 p-8 max-w-md mx-auto">
              <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-300 text-base font-bold">
                Guide roster is being finalized for the 2026 season.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
