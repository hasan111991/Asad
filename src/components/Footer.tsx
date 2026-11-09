import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ExternalLink,
  Heart,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeaderProfile, SiteSettings } from '../types';

interface FooterProps {
  profile: LeaderProfile;
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'data_protection' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, settings, onNavigate, onOpenLegal }) => {
  const { isUrdu } = useLanguage();

  return (
    <footer className="bg-[#123B28] text-emerald-100 border-t-2 border-[#C9A227]">
      
      {/* Top Banner Disclaimer */}
      <div className="bg-[#0b281b] border-b border-emerald-900/80 py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-[#C9A227] font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <p className="max-w-4xl">
            {isUrdu 
              ? 'دستبرداری: یہ چوہدری اسد حنیف جٹ (رکن صوبائی اسمبلی، حلقہ پی پی 203 چیچہ وطنی، ضلع ساہیوال) کی آفیشل عوامی و سیاسی پورٹل ہے اور یہ کسی سرکاری محکمہ کا پورٹل نہیں ہے۔' 
              : 'Official Notice: This is the official political representative profile and constituent service website of Chaudhry Asad Hanif Jutt (MPA PP-203 Chichawatni, District Sahiwal) and is not a government department or ministry portal.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Identity & Crest */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full green-gradient-bg border-2 border-[#C9A227] flex items-center justify-center shadow-md">
                <span className="text-xs font-serif font-black text-[#C9A227]">PML-N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isUrdu ? profile.fullNameUrdu : profile.fullName}
                </h3>
                <p className="text-xs text-[#C9A227] font-medium">
                  {isUrdu ? 'رکن صوبائی اسمبلی پنجاب (پی پی 203 چیچہ وطنی)' : 'Member of Provincial Assembly | PP-203 Chichawatni'}
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              {isUrdu 
                ? 'پاکستان مسلم لیگ (ن) کے پلیٹ فارم سے عوامی مسائل کے فوری حل، کسانوں کے حقوق اور شفاف ترقیاتی اقدامات کا پختہ عزم۔' 
                : 'Dedicated to empowering the rural and urban communities of Chichawatni through transparent oversight, civic facilitation, and legislative excellence.'}
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-emerald-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span className="truncate">{isUrdu ? 'چیچہ وطنی، ضلع ساہیوال، پنجاب' : 'Chichawatni, District Sahiwal, Punjab'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{profile.officialPhone}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
              {isUrdu ? 'اہم لنکس' : 'Navigation Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'صفحہ اول' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'سیاسی تعارف و سوانح' : 'About Chaudhry Asad Hanif'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('constituency')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'حلقہ پی پی 203 چیچہ وطنی' : 'Constituency PP-203 Profile'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'ترقیاتی منصوبے اور بجٹ' : 'Development Projects'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-[#C9A227] transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
                  {isUrdu ? 'حلقہ ترقیاتی نقشہ (GIS)' : 'Constituency Project Map (GIS)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notices')} className="hover:text-[#C9A227] transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {isUrdu ? 'عوامی نوٹسز اور گزٹ' : 'Public Notices & Circulars'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assembly')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'پنجاب اسمبلی کارکردگی' : 'Punjab Assembly Activities'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
              {isUrdu ? 'عوامی خدمات و میڈیا' : 'Public Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('portal')} className="text-[#C9A227] font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <span>★ {isUrdu ? 'عوامی شکایات پورٹل' : 'Citizen Grievance Redressal'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'خبریں و پریس بیانات' : 'News & Statements'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'تصویری گیلری' : 'Photo Gallery'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                  {isUrdu ? 'سیکرٹریٹ سے رابطہ' : 'Constituency Secretariat'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Party & Constitutional Tenet */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
              {isUrdu ? 'سیاسی جماعت' : 'Party Affiliation'}
            </h4>
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 space-y-2 text-xs">
              <span className="font-bold text-[#C9A227] block">PML-N</span>
              <p className="text-[11px] text-emerald-200/90 leading-tight">
                {isUrdu ? 'پاکستان مسلم لیگ (ن) — خدمت، دیانت اور ترقی' : 'Pakistan Muslim League (N) — Service, Integrity & Progress.'}
              </p>
            </div>
            <div className="text-[11px] text-emerald-400">
              <span>{isUrdu ? 'ڈسٹرکٹ ساہیوال، پنجاب' : 'District Sahiwal, Punjab'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <div>
            © {new Date().getFullYear()} {isUrdu ? 'چوہدری اسد حنیف جٹ — آفیشل پورٹل۔ جملہ حقوق محفوظ ہیں۔' : 'Chaudhry Asad Hanif Jutt – Official Portal. All Rights Reserved.'}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onOpenLegal && onOpenLegal('privacy')} 
              className="hover:text-[#C9A227] transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isUrdu ? 'رازداری پالیسی' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal && onOpenLegal('terms')} 
              className="hover:text-[#C9A227] transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isUrdu ? 'قواعد و ضوابط' : 'Terms of Use'}
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal && onOpenLegal('data_protection')} 
              className="hover:text-[#C9A227] transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isUrdu ? 'تحفظ ڈیٹا' : 'Data Protection'}
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal && onOpenLegal('disclaimer')} 
              className="hover:text-[#C9A227] transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isUrdu ? 'شکایات دستبرداری' : 'Complaint Disclaimer'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
