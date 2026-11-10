import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  FileSpreadsheet, 
  Building, 
  MessageSquare, 
  ArrowRight,
  Shield,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeaderProfile, Project, CitizenComplaint } from '../types';

interface HeroProps {
  profile: LeaderProfile;
  projects: Project[];
  complaints: CitizenComplaint[];
  onNavigate: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, projects, complaints, onNavigate }) => {
  const { isUrdu } = useLanguage();

  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const resolvedComplaintsCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#123B28] via-[#0b281b] to-[#F7F9F7] pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative Geometric and Light Background Accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#C9A227] blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#087A43] blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification & Transparency Badge */}
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A227]/40 text-[#C9A227] text-xs font-semibold shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{isUrdu ? profile.verifiedNoticeUrdu : profile.verifiedNotice}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-emerald-300 font-semibold text-sm tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></span>
                <span>{isUrdu ? profile.partyUrdu : profile.party}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {isUrdu ? profile.fullNameUrdu : profile.fullName}
              </h1>

              <div className="text-lg sm:text-xl md:text-2xl font-medium text-[#C9A227] flex items-center justify-center lg:justify-start rtl:lg:justify-end gap-2 flex-wrap">
                <span>{isUrdu ? profile.titleUrdu : profile.title}</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {isUrdu ? profile.bioUrdu : profile.bio}
            </p>

            {/* Constituency Location Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>{isUrdu ? profile.constituencyUrdu : profile.constituency}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('portal')}
                className="px-6 py-3.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white font-bold text-sm shadow-lg shadow-emerald-900/50 border border-[#C9A227] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>{isUrdu ? 'عوامی شکایت درج کریں' : 'Public Service Portal'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                {isUrdu ? 'سیاسی تعارف و سوانح' : 'About Profile'}
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-lg bg-[#123B28] hover:bg-[#0c291c] text-[#C9A227] font-semibold text-sm border border-[#C9A227]/40 transition-all cursor-pointer"
              >
                {isUrdu ? 'دفتر سے رابطہ' : 'Contact Office'}
              </button>
            </div>
          </div>

          {/* Leader Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Gold & Green Decorative Frames */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#087A43] via-[#C9A227] to-[#123B28] rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-[#123B28] border-2 border-[#C9A227]/60 shadow-2xl">
                <img
                  src={profile.photoUrl || './assets/images/chaudhry_asad_hanif_jutt.jpg'}
                  alt={isUrdu ? profile.fullNameUrdu : profile.fullName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = './assets/images/chaudhry_asad_hanif_jutt.jpg';
                  }}
                  className="w-full h-auto object-cover object-top aspect-[3/4] hover:scale-102 transition duration-700"
                />

                {/* Overlaid Editorial Card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-5 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {isUrdu ? profile.fullNameUrdu : profile.fullName}
                      </h3>
                      <p className="text-xs text-[#C9A227] font-medium">
                        {isUrdu ? 'رکن صوبائی اسمبلی (PP-203 چیچہ وطنی)' : 'MPA PP-203 Chichawatni'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#087A43] border border-[#C9A227] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#C9A227]" />
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-emerald-200">
                    <span>{isUrdu ? 'ضلع ساہیوال، پنجاب' : 'District Sahiwal, Punjab'}</span>
                    <span className="font-semibold text-white">{isUrdu ? 'پاکستان مسلم لیگ (ن)' : 'PML-N'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Live Public Stats Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-emerald-800/20 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#087A43]/10 text-[#087A43] flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-2xl font-black text-[#123B28]">{projects.length}</span>
              <span className="text-xs text-slate-600 font-medium">
                {isUrdu ? 'کل ترقیاتی منصوبے' : 'Total Projects'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-emerald-800/20 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C9A227]/15 text-[#9e7c15] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-2xl font-black text-[#123B28]">{completedProjectsCount}</span>
              <span className="text-xs text-slate-600 font-medium">
                {isUrdu ? 'مکمل شدہ کام' : 'Completed Projects'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-emerald-800/20 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#087A43]/10 text-[#087A43] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-2xl font-black text-[#123B28]">{resolvedComplaintsCount || 1}</span>
              <span className="text-xs text-slate-600 font-medium">
                {isUrdu ? 'حل شدہ عوامی شکایات' : 'Resolved Complaints'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-emerald-800/20 shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#123B28]/10 text-[#123B28] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-2xl font-black text-[#123B28]">44+</span>
              <span className="text-xs text-slate-600 font-medium">
                {isUrdu ? 'اسمبلی اجلاس حاضری' : 'Assembly Sessions'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
