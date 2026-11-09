import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Coins, 
  Briefcase, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  X,
  BadgeCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Project, ProjectCategory, ProjectStatus } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const { isUrdu } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories: { id: string; labelEn: string; labelUr: string }[] = [
    { id: 'all', labelEn: 'All Categories', labelUr: 'تمام کیٹیگریز' },
    { id: 'Roads and Infrastructure', labelEn: 'Roads & Infrastructure', labelUr: 'سڑکیں اور بنیادی ڈھانچہ' },
    { id: 'Healthcare', labelEn: 'Healthcare', labelUr: 'صحت و ہسپتال' },
    { id: 'Clean Drinking Water', labelEn: 'Clean Water', labelUr: 'پینے کا صاف پانی' },
    { id: 'Education', labelEn: 'Education', labelUr: 'تعلیم و تدریس' },
    { id: 'Electricity', labelEn: 'Electricity', labelUr: 'بجلی و توانائی' },
    { id: 'Sanitation', labelEn: 'Sanitation & Sewerage', labelUr: 'سیوریج و نکاسی آب' },
    { id: 'Public Facilities', labelEn: 'Public Facilities', labelUr: 'عوامی سہولیات و پارکس' }
  ];

  const statuses: { id: string; labelEn: string; labelUr: string }[] = [
    { id: 'all', labelEn: 'All Statuses', labelUr: 'تمام مراحل' },
    { id: 'Completed', labelEn: 'Completed', labelUr: 'مکمل شدہ' },
    { id: 'In Progress', labelEn: 'In Progress', labelUr: 'جاری ہے' },
    { id: 'Approved', labelEn: 'Approved', labelUr: 'منظور شدہ' },
    { id: 'Proposed', labelEn: 'Proposed', labelUr: 'مجوزہ' }
  ];

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      p.title.toLowerCase().includes(q) || 
      p.titleUrdu.includes(q) ||
      p.location.toLowerCase().includes(q) || 
      p.department.toLowerCase().includes(q);
    return matchesCat && matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: ProjectStatus, statusUrdu: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isUrdu ? statusUrdu : status}
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            {isUrdu ? statusUrdu : status}
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <BadgeCheck className="w-3.5 h-3.5" />
            {isUrdu ? statusUrdu : status}
          </span>
        );
      case 'Proposed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="w-3.5 h-3.5" />
            {isUrdu ? statusUrdu : status}
          </span>
        );
    }
  };

  const getFundingBadge = (fundingType: string, fundingTypeUrdu: string) => {
    if (fundingType === 'MPA Initiative') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A227]/20 text-[#88690e] border border-[#C9A227]/40">
          ★ {isUrdu ? fundingTypeUrdu : fundingType}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
        {isUrdu ? fundingTypeUrdu : fundingType}
      </span>
    );
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'شفاف ترقیاتی پورٹ فولیو' : 'Development Portfolio'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'حلقہ پی پی 203 کے ترقیاتی منصوبے' : 'PP-203 Constituency Development Projects'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'سڑکوں کی تعمیر، ہسپتالوں کی اپ گریڈیشن، پینے کے صاف پانی اور نکاسی آب کے جاری و مکمل منصوبوں کی مصدقہ تفصیلات۔' 
              : 'Verified monitoring of road infrastructure, clean water plants, healthcare, and education uplift in Chichawatni.'}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#F7F9F7] p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isUrdu ? 'منصوبہ کا نام، مقام یا محکمہ تلاش کریں...' : 'Search projects by name, location, or department...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
              />
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {statuses.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedStatus === st.id
                      ? 'bg-[#123B28] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {isUrdu ? st.labelUr : st.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-200/80">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#087A43] text-white shadow-sm font-bold'
                    : 'bg-white text-slate-600 hover:text-black border border-slate-200'
                }`}
              >
                {isUrdu ? cat.labelUr : cat.labelEn}
              </button>
            ))}
          </div>

        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">
              {isUrdu ? 'کوئی منصوبہ موصول نہیں ہوا' : 'No development projects match your filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(proj => (
              <div 
                key={proj.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#087A43] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                      {getStatusBadge(proj.status, proj.statusUrdu)}
                      {getFundingBadge(proj.fundingType, proj.fundingTypeUrdu)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#087A43] shrink-0" />
                      <span className="truncate">{isUrdu ? proj.locationUrdu : proj.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#123B28] group-hover:text-[#087A43] transition-colors line-clamp-2">
                      {isUrdu ? proj.titleUrdu : proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {isUrdu ? proj.descriptionUrdu : proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>{isUrdu ? 'کام کی پیش رفت' : 'Completion Progress'}</span>
                        <span className="text-[#087A43]">{proj.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#087A43] to-[#C9A227] rounded-full transition-all duration-1000"
                          style={{ width: `${proj.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-3">
                    <div>
                      <span className="block text-slate-400">{isUrdu ? 'بجٹ تخمینہ' : 'Budget'}</span>
                      <span className="font-bold text-[#123B28] truncate block">{proj.budget}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">{isUrdu ? 'نگران محکمہ' : 'Department'}</span>
                      <span className="font-medium text-[#123B28] truncate block">{isUrdu ? proj.departmentUrdu : proj.department}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModalProject(proj)}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#087A43] hover:text-white text-[#123B28] text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUrdu ? 'مکمل تفصیلات اور اسٹیٹس' : 'View Full Details & Status'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden bg-slate-900">
              <img
                src={activeModalProject.imageUrl}
                alt={activeModalProject.title}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
                {getStatusBadge(activeModalProject.status, activeModalProject.statusUrdu)}
                {getFundingBadge(activeModalProject.fundingType, activeModalProject.fundingTypeUrdu)}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div>
                <span className="text-xs font-bold text-[#087A43] uppercase tracking-wider block mb-1">
                  {isUrdu ? activeModalProject.categoryUrdu : activeModalProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#123B28]">
                  {isUrdu ? activeModalProject.titleUrdu : activeModalProject.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <MapPin className="w-4 h-4 text-[#087A43]" />
                  <span>{isUrdu ? activeModalProject.locationUrdu : activeModalProject.location}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {isUrdu ? activeModalProject.descriptionUrdu : activeModalProject.description}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="text-slate-400 block">{isUrdu ? 'بجٹ' : 'Verified Budget'}</span>
                  <span className="font-bold text-[#087A43] text-sm">{activeModalProject.budget}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block">{isUrdu ? 'آغاز کی تاریخ' : 'Start Date'}</span>
                  <span className="font-semibold text-slate-800">{activeModalProject.startDate}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block">{isUrdu ? 'تکمیل کی متوقع تاریخ' : 'Estimated Completion'}</span>
                  <span className="font-semibold text-slate-800">{activeModalProject.completionDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>{isUrdu ? 'نگران محکمہ:' : 'Executing Department:'} <strong className="text-slate-700">{isUrdu ? activeModalProject.departmentUrdu : activeModalProject.department}</strong></span>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition-colors"
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
