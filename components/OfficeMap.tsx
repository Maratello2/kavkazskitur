'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function OfficeMap() {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMap(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Details & Contacts */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Headquarters & Office</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">We look forward to meeting you at our Nalchik base or assisting with any questions</p>
          <div className="w-12 h-0.5 bg-[#C85A32] mt-3" />
        </div>

        {/* Address */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#C85A32] shrink-0 mt-0.5">
            <MapPin className="w-5 h-5"/>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Office Address</div>
            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
              Gorkogo St., 74, Nalchik, Kabardino-Balkar Republic
            </div>
          </div>
        </div>

        {/* Phones */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#C85A32] shrink-0 mt-0.5">
            <Phone className="w-5 h-5"/>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Phone / WhatsApp</div>
            <a 
              href="tel:+79286914405" 
              className="text-[#C85A32] font-bold text-base sm:text-lg hover:underline transition-all block w-fit"
            >
              +7 (928) 691-44-05
            </a>
            <a 
              href="tel:+79380809494" 
              className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:text-[#C85A32] transition-colors block w-fit"
            >
              +7 (938) 080-94-94
            </a>
            <a 
              href="tel:+79640395669" 
              className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:text-[#C85A32] transition-colors block w-fit"
            >
              +7 (964) 039-56-69
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#C85A32] shrink-0 mt-0.5">
            <Mail className="w-5 h-5"/>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
            <a 
              href="mailto:info@kavkazskitur.com" 
              className="text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-[#C85A32] transition-colors font-medium"
            >
              info@kavkazskitur.com
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="https://wa.me/79286914405" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-2 w-full py-3.5 px-6 rounded-xl bg-[#C85A32] hover:bg-[#A84726] text-white font-medium text-center text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all"
        >
          Inquire via WhatsApp
        </a>
      </div>

      {/* Map iframe */}
      <div className="lg:col-span-7 w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 relative">
        {showMap ? (
          <iframe 
            title="KavKazSkiTur Office on Yandex Maps" 
            src="https://yandex.ru/map-widget/v1/?ll=43.607323%2C43.486037&mode=search&oid=159624669262&ol=biz&z=17.01" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen={true}
            loading="lazy"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 text-sm animate-pulse">
            Loading interactive map...
          </div>
        )}
      </div>
    </div>
  );
}
