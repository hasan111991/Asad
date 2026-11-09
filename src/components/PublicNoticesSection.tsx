import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Search, 
  Tag, 
  Eye, 
  X, 
  Printer, 
  ShieldCheck, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PublicNotice, NoticeCategory } from '../types';

interface PublicNoticesSectionProps {
  notices: PublicNotice[];
}

export const PublicNoticesSection: React.FC<PublicNoticesSectionProps> = ({ notices }) => {
  const { isUrdu } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNoticeModal, setActiveNoticeModal] = useState<PublicNotice | null>(null);

  const categories: { id: string; labelEn: string; labelUr: string }[] = [
    { id: 'all', labelEn: 'All Public Notices', labelUr: 'تمام نوٹیفکیشنز' },
    { id: 'Public Announcements', labelEn: 'Public Announcements', labelUr: 'عوامی اعلانات' },
    { id: 'Development Updates', labelEn: 'Development Updates', labelUr: 'ترقیاتی احکامات' },
    { id: 'Office Notifications', labelEn: 'Office Notifications', labelUr: 'دفتری احکامات' },
    { id: 'Public Meetings', labelEn: 'Public Meetings', labelUr: 'کھلی کچہریاں' },
    { id: 'Important Documents', labelEn: 'Important Documents', labelUr: 'اہم دستاویزات' }
  ];

  const filteredNotices = notices.filter(n => {
    if (!n.isPublished) return false;
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      n.title.toLowerCase().includes(q) || 
      n.titleUrdu.includes(q) ||
      (n.officialRef && n.officialRef.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleDownloadNotice = (notice: PublicNotice) => {
    // Generate clean downloadable official text/pdf representation
    const textContent = `
CHAUDHRY ASAD HANIF JUTT
Member of Provincial Assembly, Punjab (PP-203 Chichawatni)
Pakistan Muslim League (N)
-------------------------------------------------------------
OFFICIAL PUBLIC NOTICE / GAZETTED CIRCULAR
Reference: ${notice.officialRef || 'MPA/PP203/NOT/OFFICIAL'}
Date: ${notice.publishDate}
Category: ${notice.category}

TITLE: ${notice.title}
URDU TITLE: ${notice.titleUrdu}

DESCRIPTION & DIRECTIVES:
${notice.description}

-------------------------------------------------------------
Official Secretariat: Railway Road / Bypass, Chichawatni, District Sahiwal, Punjab
Verified Digital Dispatch: chasadhanif.pk
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${notice.fileName || 'Public-Notice-PP203'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200" id="notices-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'سرکاری نوٹیفکیشنز و اعلانات' : 'Gazetted Circulars & Orders'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'عوامی نوٹیفکیشنز اور ڈاؤن لوڈ ایبل دستاویزات' : 'Downloadable Public Notices & Circulars'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'چوہدری اسد حنیف جٹ سیکرٹریٹ کے باضابطہ احکامات، نہری بھل صفائی، ہسپتال ڈائیلاسز شیڈول اور عوامی اعلانات۔' 
              : 'Transparent access to official constituency circulars, hearing schedules, and departmental directives.'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#F7F9F7] p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isUrdu ? 'نوٹیفکیشن کا عنوان یا ریفرنس تلاش کریں...' : 'Search notices by title, keyword, or reference number...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-200/80">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#087A43] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:text-black border border-slate-200'
                }`}
              >
                {isUrdu ? cat.labelUr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Cards Grid */}
        {filteredNotices.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">
              {isUrdu ? 'کوئی نوٹیفکیشن موصول نہیں ہوا' : 'No public notices found matching your criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map(notice => (
              <div 
                key={notice.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#087A43] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#087A43]">
                      {isUrdu ? notice.categoryUrdu : notice.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                      {notice.publishDate}
                    </span>
                  </div>

                  <div>
                    {notice.officialRef && (
                      <span className="text-[11px] font-mono text-slate-400 block mb-1">
                        Ref: {notice.officialRef}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#123B28] hover:text-[#087A43] transition-colors leading-snug">
                      {isUrdu ? notice.titleUrdu : notice.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {isUrdu ? notice.descriptionUrdu : notice.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px]">
                      {notice.fileType || 'PDF'}
                    </span>
                    <span>{notice.fileSize || '650 KB'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNoticeModal(notice)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'دیکھیں' : 'Preview'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadNotice(notice)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'ڈاؤن لوڈ' : 'Download'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Notice Reader Lightbox Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-[#123B28] text-white p-6 flex items-center justify-between border-b border-[#C9A227]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isUrdu ? 'سرکاری نوٹیفکیشن ملاحظہ فرمائیں' : 'Official Notice Document Viewer'}
                  </h3>
                  <span className="text-xs text-emerald-200 font-mono">
                    {activeNoticeModal.officialRef || 'PP-203 Gazetted Order'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Gazette Document Paper */}
            <div className="p-6 sm:p-10 space-y-6 bg-slate-50">
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                
                {/* Official Crest Header */}
                <div className="text-center border-b-2 border-slate-200 pb-5 space-y-1">
                  <span className="text-xs font-serif font-black tracking-widest text-[#087A43] uppercase block">
                    Pakistan Muslim League (N)
                  </span>
                  <h4 className="text-lg font-extrabold text-[#123B28]">
                    Office of Chaudhry Asad Hanif Jutt
                  </h4>
                  <p className="text-xs text-slate-500">
                    Member of Provincial Assembly, Punjab | PP-203 Chichawatni (District Sahiwal)
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Date: {activeNoticeModal.publishDate}</span>
                    <span>Ref: {activeNoticeModal.officialRef || 'MPA/PP203/NOT/2026'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#087A43] uppercase">
                      {activeNoticeModal.category}
                    </span>
                    <h3 className="text-xl font-bold text-[#123B28] mt-2">
                      {isUrdu ? activeNoticeModal.titleUrdu : activeNoticeModal.title}
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {isUrdu ? activeNoticeModal.descriptionUrdu : activeNoticeModal.description}
                  </div>
                </div>

                {/* Sign-off Seal */}
                <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span>Verified Constituent Notice</span>
                    <span className="block">Chichawatni Secretariat Desk</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#123B28] block">Chaudhry Asad Hanif Jutt</span>
                    <span className="text-[10px] text-slate-500 block">MPA PP-203 Chichawatni</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isUrdu ? 'پرنٹ کریں' : 'Print Gazette Notice'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadNotice(activeNoticeModal)}
                    className="px-5 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isUrdu ? 'دستاویز ڈاؤن لوڈ کریں' : 'Download Document'}</span>
                  </button>

                  <button
                    onClick={() => setActiveNoticeModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    {isUrdu ? 'بند کریں' : 'Close'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
