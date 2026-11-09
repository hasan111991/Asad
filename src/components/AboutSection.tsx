import React from 'react';
import { 
  User, 
  GraduationCap, 
  Flag, 
  Landmark, 
  MapPin, 
  Calendar, 
  HeartHandshake, 
  Target,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeaderProfile } from '../types';

interface AboutSectionProps {
  profile: LeaderProfile;
  onNavigate: (tab: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, onNavigate }) => {
  const { isUrdu } = useLanguage();

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'سوانح و سیاسی خدمات' : 'Profile & Public Service'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'چوہدری اسد حنیف جٹ کا تعارف' : 'About Chaudhry Asad Hanif Jutt'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'پاکستان مسلم لیگ (ن) کے پلیٹ فارم سے عوامی حقوق، زرعی خوشحالی اور پائیدار ترقی کا شفاف مشن۔' 
              : 'A transparent political mission dedicated to civic representation, farmer welfare, and constituency development for PP-203 Chichawatni.'}
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Biography Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Bio Card */}
            <div className="bg-[#F7F9F7] rounded-2xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-emerald-900/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#087A43] text-white flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#123B28]">
                    {isUrdu ? 'تعارف اور پس منظر' : 'Biography & Public Life'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isUrdu ? 'سیاسی و سماجی خدمات کا جائزہ' : 'Political and social journey'}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {isUrdu ? profile.bioUrdu : profile.bio}
              </p>
            </div>

            {/* Political Journey Card */}
            <div className="bg-[#F7F9F7] rounded-2xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-emerald-900/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A227] text-[#123B28] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#123B28]">
                    {isUrdu ? 'سیاسی سفر اور عوامی خدمت' : 'Political Journey & Grassroots Service'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isUrdu ? 'تحصیل چیچہ وطنی میں عوامی رابطہ' : 'Grassroots constituent engagement'}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {isUrdu ? profile.politicalJourneyUrdu : profile.politicalJourney}
              </p>
            </div>

            {/* 4 Pillars of Vision */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#123B28] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#087A43]" />
                <span>{isUrdu ? 'بنیادی ترجیحات برائے حلقہ پی پی 203' : 'Core Priorities for PP-203 Chichawatni'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#087A43] transition-colors">
                  <span className="text-xs font-bold text-[#087A43] block mb-1">01. {isUrdu ? 'زرعی خوشحالی' : 'Agricultural Welfare'}</span>
                  <p className="text-xs text-slate-600">
                    {isUrdu ? 'لوئر باری دوآب نہر کی ٹیل پر کسانوں کے لیے پانی کی منصفانہ تقسیم اور کھاد و بیج پر سبسڈی۔' : 'Equitable canal water rights for tail-end farmers and reliable tubewell electricity supply.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#087A43] transition-colors">
                  <span className="text-xs font-bold text-[#087A43] block mb-1">02. {isUrdu ? 'بنیادی صحت اور ہسپتال' : 'Healthcare Upgrades'}</span>
                  <p className="text-xs text-slate-600">
                    {isUrdu ? 'ٹی ایچ کیو ہسپتال چیچہ وطنی میں ٹراما سینٹر اور دیہی بی ایچ یوز میں لیڈی ڈاکٹرز کی فراہمی۔' : 'Modern trauma center at THQ Hospital and 24/7 staff across all rural Basic Health Units.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#087A43] transition-colors">
                  <span className="text-xs font-bold text-[#087A43] block mb-1">03. {isUrdu ? 'پینے کا صاف پانی' : 'Clean Drinking Water'}</span>
                  <p className="text-xs text-slate-600">
                    {isUrdu ? 'زیرِ زمین آلودہ پانی سے بچاؤ کے لیے ہر یونین کونسل میں آر او فلٹریشن پلانٹس کی تنصیب۔' : 'Reverse Osmosis filtration plants in every rural Union Council to combat salinity and arsenic.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#087A43] transition-colors">
                  <span className="text-xs font-bold text-[#087A43] block mb-1">04. {isUrdu ? 'مربوط روڈ نیٹ ورک' : 'Road Infrastructure'}</span>
                  <p className="text-xs text-slate-600">
                    {isUrdu ? 'چیچہ وطنی تا کمالیہ شاہراہ کی کشادگی اور دیہی چکوں کو مرکزی جی ٹی روڈ سے ملانا۔' : 'Dual carriage highway connecting Chichawatni with Kamalia, reducing freight transport costs.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar At-a-Glance Factsheet */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#123B28] text-white rounded-2xl p-6 shadow-xl border border-[#C9A227]/30 space-y-5">
              <h3 className="text-base font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-800 pb-3">
                <FileCheck2 className="w-5 h-5 text-[#C9A227]" />
                <span>{isUrdu ? 'سرکاری کوائف نامہ' : 'Assembly & Official Profile'}</span>
              </h3>

              <div className="space-y-4 text-xs">
                
                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'مکمل نام' : 'Full Name'}</span>
                  <span className="text-white font-bold text-sm">{isUrdu ? profile.fullNameUrdu : profile.fullName}</span>
                </div>

                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'سیاسی وابستگی' : 'Political Party'}</span>
                  <span className="text-[#C9A227] font-bold text-sm">{isUrdu ? profile.partyUrdu : profile.party}</span>
                </div>

                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'انتخابی حلقہ' : 'Constituency'}</span>
                  <span className="text-white font-medium">{isUrdu ? profile.constituencyUrdu : profile.constituency}</span>
                </div>

                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'تعلیم' : 'Education'}</span>
                  <span className="text-white font-medium">{isUrdu ? profile.educationUrdu : profile.education}</span>
                </div>

                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'پارلیمانی ذمہ داری' : 'Assembly Tenure'}</span>
                  <span className="text-white font-medium">{isUrdu ? profile.assemblyTenureUrdu : profile.assemblyTenure}</span>
                </div>

                <div className="pt-2 border-t border-emerald-800">
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'عوامی سیکرٹریٹ' : 'Public Secretariat'}</span>
                  <span className="text-white font-medium block mt-0.5">{isUrdu ? profile.officeAddressUrdu : profile.officeAddress}</span>
                </div>

                <div>
                  <span className="text-emerald-300 block text-[11px] font-semibold uppercase">{isUrdu ? 'ملاقات کے اوقات' : 'Visiting Hours'}</span>
                  <span className="text-white font-medium block mt-0.5">{isUrdu ? profile.officeHoursUrdu : profile.officeHours}</span>
                </div>

              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#C9A227]/40 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{isUrdu ? 'سیکرٹریٹ میں وقت لیں' : 'Schedule Appointment'}</span>
                </button>
              </div>

            </div>

            {/* Official Verification Notice Card */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">{isUrdu ? 'شفافیت اور قانونی نوٹس:' : 'Transparency & Legal Notice:'}</span>
              {isUrdu 
                ? 'اس ویب سائٹ پر درج تمام ذاتی و سیاسی تفصیلات انتخابی حلقے اور عوامی رابطہ کی شفافیت کے لیے ہیں۔ کسی بھی تبدیلی کے لیے ایڈمن پینل سے رابطہ کیا جا سکتا ہے۔' 
                : 'All biographical and parliamentary records on this portal are managed for constituent transparency. Official records are synchronized with Election Commission and Assembly secretariat files.'}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
