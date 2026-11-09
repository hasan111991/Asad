import React, { useState } from 'react';
import { 
  Calendar, 
  Tag, 
  ArrowRight, 
  FileText, 
  X, 
  Share2, 
  Check,
  Newspaper
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NewsItem, NewsCategory } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const { isUrdu } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories: { id: string; labelEn: string; labelUr: string }[] = [
    { id: 'all', labelEn: 'All Updates', labelUr: 'تمام خبریں' },
    { id: 'Constituency Visits', labelEn: 'Constituency Visits', labelUr: 'حلقے کے دورے' },
    { id: 'Public Meetings', labelEn: 'Public Meetings', labelUr: 'عوامی اجتماعات' },
    { id: 'Official Statements', labelEn: 'Official Statements', labelUr: 'سرکاری بیانات' },
    { id: 'Press Releases', labelEn: 'Press Releases', labelUr: 'پریس ریلیز' },
    { id: 'Assembly News', labelEn: 'Assembly News', labelUr: 'اسمبلی خبریں' }
  ];

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(n => n.category === selectedCategory);

  const featuredItem = news.find(n => n.isFeatured) || news[0];

  const handleShare = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: isUrdu ? item.titleUrdu : item.title,
        text: isUrdu ? item.summaryUrdu : item.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'پریس و اطلاعات' : 'Press & Media Secretariat'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'تازہ ترین خبریں، پریس ریلیز اور بیانات' : 'Latest News, Press Releases & Statements'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'چوہدری اسد حنیف جٹ کے حلقہ پی پی 203 کے دورے، عوامی کھلی کچہریاں اور سرکاری پریس پیغامات۔' 
              : 'Authorized media communications, field inspections, public meetings, and legislative updates.'}
          </p>
        </div>

        {/* Featured Story Spotlight */}
        {featuredItem && (
          <div className="mb-12 bg-[#F7F9F7] rounded-3xl overflow-hidden border border-slate-200 shadow-md group hover:border-[#087A43] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-7 h-72 sm:h-96 overflow-hidden relative">
                <img
                  src={featuredItem.imageUrl}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="px-3 py-1 rounded-md bg-[#C9A227] text-[#123B28] font-bold text-xs uppercase tracking-wider shadow">
                    ★ {isUrdu ? 'اہم ترین خبر' : 'Featured Story'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#087A43] font-bold text-[11px]">
                    {isUrdu ? featuredItem.categoryUrdu : featuredItem.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredItem.date}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#123B28] group-hover:text-[#087A43] transition-colors leading-snug">
                  {isUrdu ? featuredItem.titleUrdu : featuredItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {isUrdu ? featuredItem.summaryUrdu : featuredItem.summary}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveNewsModal(featuredItem)}
                    className="px-5 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isUrdu ? 'مکمل بیان پڑھیں' : 'Read Full Statement'}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#123B28] text-white shadow-md'
                  : 'bg-[#F7F9F7] text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isUrdu ? c.labelUr : c.labelEn}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#087A43] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-semibold text-[11px]">
                      {isUrdu ? item.categoryUrdu : item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{item.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#123B28] hover:text-[#087A43] transition-colors line-clamp-2">
                    {isUrdu ? item.titleUrdu : item.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {isUrdu ? item.summaryUrdu : item.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveNewsModal(item)}
                  className="text-xs font-bold text-[#087A43] hover:text-[#123B28] flex items-center gap-1 pt-3 cursor-pointer"
                >
                  <span>{isUrdu ? 'تفصیل دیکھیں' : 'Read More'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => handleShare(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mt-3"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* News Detail Lightbox Modal */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-900">
              <img
                src={activeNewsModal.imageUrl}
                alt={activeNewsModal.title}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setActiveNewsModal(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-[#087A43] font-bold">
                  {isUrdu ? activeNewsModal.categoryUrdu : activeNewsModal.category}
                </span>
                <span>•</span>
                <span>{activeNewsModal.date}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">Chichawatni, PP-203</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#123B28] leading-tight">
                {isUrdu ? activeNewsModal.titleUrdu : activeNewsModal.title}
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {isUrdu ? activeNewsModal.contentUrdu : activeNewsModal.content}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => handleShare(activeNewsModal)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? (isUrdu ? 'لنک کاپی ہو گیا!' : 'Link Copied!') : (isUrdu ? 'شیئر کریں' : 'Share Statement')}</span>
                </button>

                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="px-5 py-2 rounded-lg bg-[#087A43] text-white font-bold text-xs"
                >
                  {isUrdu ? 'بند کریں' : 'Close'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
