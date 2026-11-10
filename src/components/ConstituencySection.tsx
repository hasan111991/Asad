import React, { useState } from 'react';
import { 
  MapPin, 
  Landmark, 
  Hospital, 
  GraduationCap, 
  Droplet, 
  Wheat, 
  Activity, 
  Shield, 
  Compass,
  Building2,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Project } from '../types';

interface ConstituencySectionProps {
  projects: Project[];
  onViewProjects: () => void;
}

export const ConstituencySection: React.FC<ConstituencySectionProps> = ({ projects, onViewProjects }) => {
  const { isUrdu } = useLanguage();
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState<string>('all');

  const facilities = [
    {
      id: 'f-1',
      nameEn: 'Tehsil Headquarter (THQ) Hospital Chichawatni',
      nameUr: 'تحصیل ہیڈکوارٹر (THQ) ہسپتال چیچہ وطنی',
      type: 'healthcare',
      typeLabelEn: 'Healthcare',
      typeLabelUr: 'طبی مرکز',
      locationEn: 'Hospital Road, Chichawatni City',
      locationUr: 'ہسپتال روڈ، چیچہ وطنی شہر',
      detailsEn: '100+ beds, 24/7 emergency unit, dialysis facility, maternal and child healthcare.',
      detailsUr: '100 سے زائد بیڈز، چوبیس گھنٹے ایمرجنسی، ڈائیلاسز یونٹ اور زچہ بچہ وارڈ۔'
    },
    {
      id: 'f-2',
      nameEn: 'Government Associate College for Boys Chichawatni',
      nameUr: 'گورنمنٹ ایسوسی ایٹ کالج برائے طلبہ چیچہ وطنی',
      type: 'education',
      typeLabelEn: 'Education',
      typeLabelUr: 'تعلیمی ادارہ',
      locationEn: 'College Road, Chichawatni',
      locationUr: 'کالج روڈ، چیچہ وطنی',
      detailsEn: 'Premier public undergraduate institution with science, humanities, and IT streams.',
      detailsUr: 'بی ایس اور انٹرمیڈیٹ سطح پر سائنس، کمپیوٹر اور آرٹس کی تدریس کا مرکزی سرکاری ادارہ۔'
    },
    {
      id: 'f-3',
      nameEn: 'Government Associate College for Women Chichawatni',
      nameUr: 'گورنمنٹ ایسوسی ایٹ کالج برائے طالبات چیچہ وطنی',
      type: 'education',
      typeLabelEn: 'Education',
      typeLabelUr: 'تعلیمی ادارہ',
      locationEn: 'Near Stadium, Chichawatni',
      locationUr: 'نزد اسٹیڈیم، چیچہ وطنی',
      detailsEn: 'Higher educational degree programs serving thousands of female students across PP-203.',
      detailsUr: 'حلقہ پی پی 203 کی طالبات کے لیے بی ایس آنرز اور ہائر سیکنڈری تعلیم کا مرکزی کالج۔'
    },
    {
      id: 'f-4',
      nameEn: 'Municipal Committee & Public Facilitation Secretariat',
      nameUr: 'میونسپل کمیٹی و عوامی سہولت مرکز چیچہ وطنی',
      type: 'civic',
      typeLabelEn: 'Civic Body',
      typeLabelUr: 'میونسپل ادارہ',
      locationEn: 'Circular Road, Chichawatni',
      locationUr: 'سرکلر روڈ، چیچہ وطنی',
      detailsEn: 'Birth/death certification, sanitation dispatch, commercial licensing, and building permits.',
      detailsUr: 'شہری ریکارڈ، پیدائش و اموات سرٹیفکیٹ، صفائی کا عملہ اور شہری سہولیات کا انتظام۔'
    },
    {
      id: 'f-5',
      nameEn: 'Rural Health Center (RHC) Kassowal',
      nameUr: 'رورل ہیلتھ سنٹر (RHC) کسووال',
      type: 'healthcare',
      typeLabelEn: 'Healthcare',
      typeLabelUr: 'طبی مرکز',
      locationEn: 'Main Kassowal Bazar, PP-203',
      locationUr: 'مین کسووال بازار، پی پی 203',
      detailsEn: 'Primary clinical care, ambulance dispatch, immunization center for surrounding chaks.',
      detailsUr: 'بنیادی طبی نگہداشت، ایمبولینس سروس اور قریبی دیہات کے لیے ویکسینیشن سنٹر۔'
    },
    {
      id: 'f-6',
      nameEn: 'High-Capacity RO Water Filtration Plant Network',
      nameUr: 'ہائی کیپیسٹی آر او فلٹریشن پلانٹ نیٹ ورک (14 دیہی چکس)',
      type: 'water',
      typeLabelEn: 'Drinking Water',
      typeLabelUr: 'پینے کا پانی',
      locationEn: 'Chak 110/7-R, 35/14-L, 5/11-L and adjacent UCs',
      locationUr: 'چک 110/7-R، 35/14-L، 5/11-L اور ملحقہ یو سیز',
      detailsEn: 'Automated reverse osmosis filtration delivering WHO-standard sweet drinking water.',
      detailsUr: 'عالمی معیار کے مطابق محفوظ اور میٹھے پانی کی روزانہ فراہمی۔'
    }
  ];

  const filteredFacilities = selectedFacilityCategory === 'all'
    ? facilities
    : facilities.filter(f => f.type === selectedFacilityCategory);

  return (
    <section className="py-16 bg-[#F7F9F7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {isUrdu ? 'حلقہ بندی و جغرافیہ' : 'Constituency Geography & Profile'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'حلقہ پی پی 203، چیچہ وطنی (ضلع ساہیوال)' : 'Constituency PP-203 Chichawatni (District Sahiwal)'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'چیچہ وطنی، لوئر باری دوآب نہر کا خطہ، ہڑپہ تہذیب کے قریب واقع پاکستان کا زرخیز زرعی اور صنعتی مرکز۔' 
              : 'An agricultural powerhouse along the Lower Bari Doab Canal in Sahiwal District, rich in history, cotton farming, and thriving commerce.'}
          </p>
        </div>

        {/* Overview Banner Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12 border-2 border-emerald-900/10">
          <img
            src="./assets/images/chichawatni_scene.jpg"
            alt="Chichawatni PP-203 Landscape"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123B28] via-[#123B28]/70 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-3xl space-y-2">
              <span className="px-3 py-1 rounded-md bg-[#C9A227] text-[#123B28] font-black text-xs uppercase tracking-wider inline-block">
                PP-203 Sahiwal-VI
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold">
                {isUrdu ? 'تحصیل چیچہ وطنی: محنتی کسانوں اور تجارتی راستوں کا گڑھ' : 'Chichawatni: Heartland of Agriculture and Civic Enterprise'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {isUrdu 
                  ? 'ضلع ساہیوال کی مغربی تحصیل جو جی ٹی روڈ (N-5) پر واقع ہے۔ یہاں کے گندم، کپاس، مکئی اور باغات ملکی معیشت میں کلیدی کردار ادا کرتے ہیں۔' 
                  : 'Located on the historic Grand Trunk Road (N-5) in western Sahiwal district, renowned for bumper cotton, citrus, wheat yields, and strategic transport connectivity to Faisalabad and Multan.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Key Geographic Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#087A43] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#123B28]">{isUrdu ? 'انتخابی حلقہ' : 'Assembly Seat'}</h4>
            <span className="text-xl font-extrabold text-[#087A43] block mt-1">PP-203</span>
            <span className="text-xs text-slate-500 mt-1 block">
              {isUrdu ? 'صوبائی اسمبلی پنجاب (ساہیوال-VI)' : 'Provincial Assembly of Punjab'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#C9A227] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#123B28]">{isUrdu ? 'تخمینہ آبادی و ووٹرز' : 'Population & Voters'}</h4>
            <span className="text-xl font-extrabold text-[#123B28] block mt-1">380,000+</span>
            <span className="text-xs text-slate-500 mt-1 block">
              {isUrdu ? 'شہری وارڈز اور دیہی یونین کونسلز' : 'Constituents across Rural UCs & Urban Wards'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Droplet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#123B28]">{isUrdu ? 'آبپاشی و کینال سسٹم' : 'Canal Irrigation'}</h4>
            <span className="text-xl font-extrabold text-blue-700 block mt-1">LBDC Canal</span>
            <span className="text-xs text-slate-500 mt-1 block">
              {isUrdu ? 'لوئر باری دوآب کینال ڈسٹری بیوٹریز' : 'Lower Bari Doab Canal Distributaries'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-3">
              <Wheat className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#123B28]">{isUrdu ? 'اہم زرعی اجناس' : 'Major Crops'}</h4>
            <span className="text-xl font-extrabold text-[#123B28] block mt-1">Cotton & Wheat</span>
            <span className="text-xs text-slate-500 mt-1 block">
              {isUrdu ? 'کپاس، گندم، مکئی اور کینو کے باغات' : 'Cotton, Wheat, Maize, Citrus Orchards'}
            </span>
          </div>

        </div>

        {/* Public Facilities Directory */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#123B28] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#087A43]" />
                <span>{isUrdu ? 'حلقہ پی پی 203 کی اہم عوامی سہولیات' : 'Key Public Facilities in PP-203'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isUrdu ? 'ہسپتال، کالجز، بلدیاتی ادارے اور واٹر فلٹریشن پلانٹس' : 'Hospitals, colleges, administrative centers, and clean water plants'}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', labelEn: 'All Facilities', labelUr: 'تمام سہولیات' },
                { id: 'healthcare', labelEn: 'Healthcare', labelUr: 'صحت' },
                { id: 'education', labelEn: 'Education', labelUr: 'تعلیم' },
                { id: 'water', labelEn: 'Water Plants', labelUr: 'فلٹریشن پلانٹس' },
                { id: 'civic', labelEn: 'Civic Offices', labelUr: 'بلدیاتی دفاتر' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFacilityCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedFacilityCategory === cat.id
                      ? 'bg-[#087A43] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isUrdu ? cat.labelUr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFacilities.map(f => (
              <div 
                key={f.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#087A43] hover:shadow-md transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#087A43]/10 text-[#087A43]">
                    {isUrdu ? f.typeLabelUr : f.typeLabelEn}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                    Chichawatni
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#123B28] leading-snug">
                  {isUrdu ? f.nameUr : f.nameEn}
                </h4>

                <p className="text-xs text-slate-600">
                  {isUrdu ? f.detailsUr : f.detailsEn}
                </p>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-medium text-[#123B28]">{isUrdu ? 'مقام:' : 'Location:'}</span> {isUrdu ? f.locationUr : f.locationEn}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-600">
              {isUrdu 
                ? 'حلقہ پی پی 203 میں جاری تمام تر ترقیاتی کاموں کا تفصیلی پورٹ فولیو ملاحظہ فرمائیں۔' 
                : 'Explore verified status, budgets, and engineering timelines of all active constituency projects.'}
            </span>
            <button
              onClick={onViewProjects}
              className="px-5 py-2.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs shadow-md border border-[#C9A227]/40 transition-colors"
            >
              {isUrdu ? 'ترقیاتی منصوبے دیکھیں' : 'View Development Projects'}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
