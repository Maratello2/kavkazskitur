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
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.22em] bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] mb-4">
            <Award className="w-3.5 h-3.5" /> Alpine Route Experts
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            KavKazSkiTur Mountain Guides
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans">
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
                  className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                >
                  {/* Photo or Placeholder */}
                  <div className="h-80 sm:h-96 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                    {hasPhoto ? (
                      <img
                        src={getImageUrl(guide.photo_url)}
                        alt={guide.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                        <User className="w-16 h-16 text-slate-500" />
                        <span className="text-xs text-slate-500 mt-2 font-medium font-mono">Photo incoming</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-transparent to-black/30 pointer-events-none" />

                    {/* Role & Name */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#FF6A00] text-white text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1.5 shadow-md">
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
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <span className="text-[11px] text-slate-400 block font-medium">Experience</span>
                          <span className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Clock size={15} className="text-[#FF6A00]" />
                            {guide.years ? `${guide.years} years` : '10+ years'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <span className="text-[11px] text-slate-400 block font-medium">Ascents</span>
                          <span className="text-base font-extrabold text-[#FF6A00] flex items-center gap-1.5 mt-0.5">
                            <Mountain size={15} />
                            {guide.ascents ? `${guide.ascents}+` : '50+'}
                          </span>
                        </div>
                      </div>

                      {/* Certification */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                          <span>FAR &amp; EMERCOM Certified</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Qualifications: Mountain Instructor, Wilderness First Aid (WFA) International Certification.
                        </p>
                      </div>

                      {guide.favorite && (
                        <div className="flex items-start gap-2 text-xs text-slate-300">
                          <Compass size={15} className="text-[#FF6A00] shrink-0 mt-0.5" />
                          <span>
                            Favorite Region: <strong className="text-white">{guide.favorite}</strong>
                          </span>
                        </div>
                      )}

                      {guide.bio && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {guide.bio}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="col-span-3 text-center py-16 bg-white/[0.02] rounded-2xl border border-white/[0.08] p-8 max-w-md mx-auto">
              <User className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-base font-bold">
                Guide roster is being finalized for the 2026 season.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
