import React, { useState } from 'react';
import { 
  Landmark, 
  FileText, 
  HelpCircle, 
  ScrollText, 
  Users2, 
  Volume2, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AssemblyActivity, AssemblyActivityType } from '../types';

interface AssemblySectionProps {
  activities: AssemblyActivity[];
}

export const AssemblySection: React.FC<AssemblySectionProps> = ({ activities }) => {
  const { isUrdu } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');

  const types: { id: string; labelEn: string; labelUr: string }[] = [
    { id: 'all', labelEn: 'All Parliamentary Proceedings', labelUr: 'تمام پارلیمانی کارروائی' },
    { id: 'Question Raised', labelEn: 'Questions & Call Attention', labelUr: 'اسمبلی سوالات و توجہ دلاؤ نوٹس' },
    { id: 'Bill & Resolution', labelEn: 'Bills & Resolutions', labelUr: 'قراردادیں و قانون سازی' },
    { id: 'Committee Participation', labelEn: 'Standing Committees', labelUr: 'قائمہ کمیٹیاں' },
    { id: 'Parliamentary Activity', labelEn: 'Floor Speeches', labelUr: 'اسمبلی تقاریر و اعلانات' }
  ];

  const filteredActivities = selectedType === 'all'
    ? activities
    : activities.filter(a => a.type === selectedType);

  const getActivityIcon = (type: AssemblyActivityType) => {
    switch (type) {
      case 'Question Raised':
        return <HelpCircle className="w-5 h-5 text-amber-600" />;
      case 'Bill & Resolution':
        return <ScrollText className="w-5 h-5 text-emerald-600" />;
      case 'Committee Participation':
        return <Users2 className="w-5 h-5 text-blue-600" />;
      case 'Parliamentary Activity':
      default:
        return <Volume2 className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <section className="py-16 bg-[#F7F9F7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {isUrdu ? 'صوبائی اسمبلی پنجاب میں نمائندگی' : 'Provincial Assembly of Punjab'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'پارلیمانی کارکردگی و قانون سازی' : 'Assembly Activities & Legislative Work'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'پنجاب اسمبلی میں اٹھائے گئے سوالات، کسانوں کے حقوق کے لیے پیش کی گئی قراردادیں اور قائمہ کمیٹیوں کی روداد۔' 
              : 'Verifiable record of debates, call-attention motions on water & farmer welfare, and legislative contributions.'}
          </p>
        </div>

        {/* Assembly Banner Graphic */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-10">
          <img
            src="./assets/images/punjab_assembly.jpg"
            alt="Punjab Provincial Assembly Chamber"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-56 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#123B28]/95 via-[#123B28]/80 to-transparent flex items-center p-6 sm:p-10">
            <div className="text-white max-w-xl space-y-2">
              <span className="px-3 py-1 rounded bg-[#087A43] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#C9A227]" />
                {isUrdu ? 'ایوانِ صوبائی اسمبلی پنجاب، لاہور' : 'Provincial Assembly of Punjab, Lahore'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                {isUrdu ? 'عوام کی آواز ایوانِ اقتدار میں' : 'Constituent Voice on the Assembly Floor'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {isUrdu 
                  ? 'چیچہ وطنی کے بنیادی مسائل بالخصوص کینال واٹر چوری، گندم کی امدادی قیمت اور دیہی سڑکوں کی فراہمی پر مسلسل نمائندگی۔' 
                  : 'Fulfilling democratic duty with regular session attendance, constructive motions, and departmental scrutiny.'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t.id
                  ? 'bg-[#123B28] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isUrdu ? t.labelUr : t.labelEn}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((act) => (
            <div 
              key={act.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#087A43] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {getActivityIcon(act.type)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#087A43]">
                      {isUrdu ? act.typeUrdu : act.type}
                    </span>
                    <span className="text-slate-400 text-xs mx-2">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {act.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {act.officialRecordRef && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      Ref: {act.officialRecordRef}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#087A43]" />
                    {isUrdu ? act.statusUrdu : act.status}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#123B28]">
                {isUrdu ? act.titleUrdu : act.title}
              </h3>

              <div className="text-xs font-medium text-slate-500">
                <span className="text-slate-400">{isUrdu ? 'اجلاس:' : 'Session:'}</span> {isUrdu ? act.sessionUrdu : act.session}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {isUrdu ? act.summaryUrdu : act.summary}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
