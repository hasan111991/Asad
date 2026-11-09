import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isUrdu: boolean;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ur: string }> = {
  // Navigation
  'nav.home': { en: 'Home', ur: 'صفحہ اول' },
  'nav.about': { en: 'About MPA', ur: 'تعارف و سوانح' },
  'nav.constituency': { en: 'PP-203 Chichawatni', ur: 'حلقہ پی پی 203 چیچہ وطنی' },
  'nav.projects': { en: 'Development Projects', ur: 'ترقیاتی منصوبے' },
  'nav.assembly': { en: 'Assembly Activities', ur: 'اسمبلی کارکردگی' },
  'nav.publicService': { en: 'Public Service Portal', ur: 'عوامی شکایات پورٹل' },
  'nav.news': { en: 'News & Media', ur: 'خبریں و بیانات' },
  'nav.gallery': { en: 'Gallery', ur: 'تصویری گیلری' },
  'nav.contact': { en: 'Contact Office', ur: 'رابطہ دفتر' },
  'nav.adminPortal': { en: 'Admin Portal', ur: 'ایڈمن پورٹل' },

  // Hero Section
  'hero.title': { en: 'Chaudhry Asad Hanif Jutt', ur: 'چوہدری اسد حنیف جٹ' },
  'hero.subtitle': { en: 'Member of Provincial Assembly | PP-203 Chichawatni', ur: 'رکن صوبائی اسمبلی پنجاب | پی پی 203 چیچہ وطنی' },
  'hero.party': { en: 'Pakistan Muslim League (N)', ur: 'پاکستان مسلم لیگ (ن)' },
  'hero.intro': { 
    en: 'Welcome to the official website of Chaudhry Asad Hanif Jutt. Explore his public profile, assembly activities, constituency development information and public service initiatives.', 
    ur: 'چوہدری اسد حنیف جٹ کی آفیشل ویب سائٹ پر خوش آمدید۔ ان کے عوامی پروفائل، اسمبلی کارکردگی، حلقہ پی پی 203 کے ترقیاتی منصوبوں اور عوامی خدمت کے اقدامات کا جائزہ لیں۔' 
  },
  'hero.verifiedNotice': {
    en: 'Official Representative Portal • District Sahiwal, Punjab (Subject to official verification)',
    ur: 'عوامی نمائندہ پورٹل • ضلع ساہیوال، پنجاب (حتمی سرکاری تصدیق کے تحت)'
  },
  'hero.btnAbout': { en: 'About Profile', ur: 'تعارف دیکھیں' },
  'hero.btnPortal': { en: 'Citizen Service Portal', ur: 'عوامی پورٹل / شکایت درج کریں' },
  'hero.btnContact': { en: 'Contact Office', ur: 'دفتر سے رابطہ' },

  // Stats
  'stats.projects': { en: 'Development Projects', ur: 'ترقیاتی منصوبے' },
  'stats.completed': { en: 'Completed Works', ur: 'مکمل شدہ کام' },
  'stats.complaints': { en: 'Complaints Processed', ur: 'حل طلب عوامی شکایات' },
  'stats.assembly': { en: 'Assembly Sessions', ur: 'اسمبلی اجلاس حاضری' },

  // Disclaimer
  'disclaimer.official': {
    en: 'Disclaimer: This is the official political representative website of Chaudhry Asad Hanif Jutt (MPA PP-203 Chichawatni) and is not a government department or official ministry portal.',
    ur: 'دستبرداری: یہ چوہدری اسد حنیف جٹ (رکن صوبائی اسمبلی پی پی 203 چیچہ وطنی) کی آفیشل سیاسی و عوامی ویب سائٹ ہے، یہ کوئی سرکاری محکمہ جاتی پورٹل نہیں ہے۔'
  },

  // Complaint portal
  'portal.title': { en: 'Public Complaint & Request Management', ur: 'عوامی شکایات اور درخواستوں کا نظام' },
  'portal.subtitle': { 
    en: 'Direct digital service for the residents of PP-203 Chichawatni. Submit your issues and track them with a secure tracking ID.', 
    ur: 'حلقہ پی پی 203 چیچہ وطنی کے معزز شہریوں کے لیے براہِ راست ڈیجیٹل سروس۔ اپنا مسئلہ درج کریں اور ٹریکنگ آئی ڈی کے ذریعے پیش رفت معلوم کریں۔' 
  },
  'portal.submitTab': { en: 'Submit New Complaint', ur: 'نئی شکایت درج کروائیں' },
  'portal.trackTab': { en: 'Track Existing Complaint', ur: 'شکایت کی پیش رفت معلوم کریں' },
  'portal.name': { en: 'Full Name', ur: 'شہری کا پورا نام' },
  'portal.phone': { en: 'Mobile / WhatsApp Number', ur: 'موبائل / واٹس ایپ نمبر' },
  'portal.district': { en: 'District', ur: 'ضلع' },
  'portal.tehsil': { en: 'Tehsil', ur: 'تحصیل' },
  'portal.area': { en: 'Area / Village / Ward / Union Council', ur: 'علاقہ / گاؤں / چک / وارڈ / یونین کونسل' },
  'portal.category': { en: 'Category of Problem', ur: 'مسئلے کی کیٹیگری' },
  'portal.description': { en: 'Detailed Description of Concern', ur: 'مسئلے کی تفصیل اور مقام کی وضاحت' },
  'portal.submitBtn': { en: 'Submit Complaint', ur: 'شکایت جمع کروائیں' },
  'portal.trackBtn': { en: 'Track Status', ur: 'سٹیٹس چیک کریں' },
  'portal.trackingInput': { en: 'Enter Tracking ID (e.g. PP203-CMP-...)', ur: 'ٹریکنگ آئی ڈی درج کریں' },

  // Projects
  'projects.title': { en: 'PP-203 Constituency Development Projects', ur: 'حلقہ پی پی 203 کے ترقیاتی منصوبے' },
  'projects.subtitle': { 
    en: 'Transparent overview of road infrastructure, clean water, healthcare, sanitation, and school enhancements.', 
    ur: 'سڑکوں کی تعمیر، صاف پانی کی فراہمی، بنیادی صحت، نکاسی آب اور اسکولوں کی اپ گریڈیشن کے منصوبوں کی شفاف تفصیلات۔' 
  },
  'projects.all': { en: 'All Categories', ur: 'تمام کیٹیگریز' },

  // Assembly
  'assembly.title': { en: 'Punjab Provincial Assembly Activities', ur: 'صوبائی اسمبلی پنجاب میں پارلیمانی کارکردگی' },
  'assembly.subtitle': { 
    en: 'Legislative proceedings, questions raised on constituency issues, resolutions, and parliamentary commitments.', 
    ur: 'قانون سازی، حلقے کے عوامی مسائل پر اٹھائے گئے سوالات، قراردادیں اور پارلیمانی امور۔' 
  },

  // News
  'news.title': { en: 'News, Statements & Press Releases', ur: 'تازہ ترین خبریں، بیانات اور پریس ریلیز' },
  'news.readMore': { en: 'Read Full Statement', ur: 'مکمل تفصیل پڑھیں' },

  // Contact
  'contact.title': { en: 'Constituency & Public Office', ur: 'عوامی رابطہ دفتر چیچہ وطنی' },
  'contact.subtitle': { 
    en: 'Visit the public secretariat or send a direct inquiry for scheduling appointments and constituency concerns.', 
    ur: 'عوامی سیکرٹریٹ تشریف لائیں یا ملاقات کے اوقات اور حلقے کے مسائل کے لیے آن لائن پیغام بھیجیں۔' 
  },
  'contact.sendBtn': { en: 'Send Message', ur: 'پیغام ارسال کریں' },

  // Footer
  'footer.quickLinks': { en: 'Quick Navigation', ur: 'اہم لنکس' },
  'footer.rights': { en: 'All Rights Reserved. Official Portal of Chaudhry Asad Hanif Jutt.', ur: 'تمام جملہ حقوق محفوظ ہیں۔ آفیشل پورٹل چوہدری اسد حنیف جٹ۔' },
  'footer.powered': { en: 'Public Information & Citizen Service System', ur: 'عوامی آگاہی و خدمتِ خلق پورٹل' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    if (language === 'ur') {
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isUrdu: language === 'ur', t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
