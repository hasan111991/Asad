import React from 'react';
import { Megaphone, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';

interface AnnouncementBannerProps {
  settings: SiteSettings;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ settings }) => {
  const { isUrdu } = useLanguage();

  if (!settings.announcementActive) return null;

  return (
    <div className="bg-[#123B28] text-white border-b border-[#C9A227]/30 text-xs md:text-sm py-2 px-4 shadow-inner relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-[#C9A227] text-[#123B28] font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
            <Megaphone className="w-3.5 h-3.5" />
            {isUrdu ? 'عوامی اطلاع' : 'Notice'}
          </span>
          <span className="truncate text-emerald-100 font-medium">
            {isUrdu ? settings.announcementUrdu : settings.announcement}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-xs">
          <a 
            href={`tel:${settings.helplinePhone}`}
            className="flex items-center gap-1.5 text-[#C9A227] hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-semibold">{isUrdu ? 'ہیلپ لائن' : 'Helpline'}: {settings.helplinePhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
