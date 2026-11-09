import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  X, 
  Eye, 
  Maximize2,
  Calendar,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryMedia } from '../types';

interface GallerySectionProps {
  gallery: GalleryMedia[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const { isUrdu } = useLanguage();
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryMedia | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = [
    { id: 'all', labelEn: 'All Media', labelUr: 'تمام تصاویر' },
    { id: 'Constituency', labelEn: 'Constituency & Office', labelUr: 'حلقہ اور عوامی دفتر' },
    { id: 'Assembly', labelEn: 'Assembly Sessions', labelUr: 'پنجاب اسمبلی اجلاس' },
    { id: 'Development', labelEn: 'Development Works', labelUr: 'ترقیاتی منصوبے' },
    { id: 'Public Meetings', labelEn: 'Public Meetings', labelUr: 'عوامی کچہریاں' }
  ];

  const filteredMedia = selectedFilter === 'all'
    ? gallery
    : gallery.filter(g => g.category === selectedFilter);

  return (
    <section className="py-16 bg-[#F7F9F7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {isUrdu ? 'تصویری جھلکیاں' : 'Visual Gallery'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'تصاویر و ویڈیو گیلری' : 'Official Photo & Media Gallery'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'چوہدری اسد حنیف جٹ کی عوامی مصروفیات، پنجاب اسمبلی کارروائی اور حلقہ پی پی 203 کے ترقیاتی دوروں کی تصویری روداد۔' 
              : 'Photographic documentation of constituent gatherings, development sites, and assembly sessions.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === c.id
                  ? 'bg-[#087A43] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isUrdu ? c.labelUr : c.labelEn}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveMediaModal(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-2xl transition-all cursor-pointer aspect-[4/3]"
            >
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-white space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] uppercase font-bold text-[#C9A227] tracking-wider block">
                    {isUrdu ? item.categoryUrdu : item.category}
                  </span>
                  <h4 className="text-sm font-bold line-clamp-1">
                    {isUrdu ? item.titleUrdu : item.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {isUrdu ? item.captionUrdu : item.caption}
                  </p>
                </div>
              </div>

              {/* Mobile Always-visible Caption */}
              <div className="sm:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs font-bold truncate">
                {isUrdu ? item.titleUrdu : item.title}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-[#123B28] rounded-2xl overflow-hidden border border-[#C9A227]/40 shadow-2xl">
            
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={activeMediaModal.mediaUrl}
                alt={activeMediaModal.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 text-white space-y-2 bg-[#123B28]">
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span className="font-bold text-[#C9A227] uppercase">{isUrdu ? activeMediaModal.categoryUrdu : activeMediaModal.category}</span>
                <span>{activeMediaModal.date}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isUrdu ? activeMediaModal.titleUrdu : activeMediaModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {isUrdu ? activeMediaModal.captionUrdu : activeMediaModal.caption}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
