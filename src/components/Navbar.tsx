import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Phone, 
  Layers, 
  Radio, 
  Image as ImageIcon,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isUrdu, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelUr: 'صفحہ اول' },
    { id: 'about', labelEn: 'About', labelUr: 'تعارف' },
    { id: 'constituency', labelEn: 'PP-203', labelUr: 'حلقہ پی پی 203' },
    { id: 'projects', labelEn: 'Projects', labelUr: 'منصوبے' },
    { id: 'map', labelEn: 'GIS Map', labelUr: 'ترقیاتی نقشہ' },
    { id: 'assembly', labelEn: 'Assembly', labelUr: 'اسمبلی' },
    { id: 'portal', labelEn: 'Public Portal', labelUr: 'عوامی پورٹل' },
    { id: 'notices', labelEn: 'Notices', labelUr: 'نوٹیفکیشنز' },
    { id: 'news', labelEn: 'News', labelUr: 'خبریں' },
    { id: 'gallery', labelEn: 'Gallery', labelUr: 'گیلری' },
    { id: 'contact', labelEn: 'Contact', labelUr: 'رابطہ' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#123B28] text-white border-b border-[#087A43]/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Identity */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 text-left rtl:text-right group focus:outline-none"
          >
            {/* PML-N Inspired Crest Motif */}
            <div className="w-12 h-12 rounded-full green-gradient-bg border-2 border-[#C9A227] flex items-center justify-center shadow-md shadow-emerald-950/40 relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <div className="text-center">
                <span className="text-xs font-serif font-black tracking-tighter text-[#C9A227] block leading-none">PML-N</span>
                <span className="text-[10px] text-white/90 font-mono tracking-widest block scale-90">★ ☪ ★</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#C9A227] transition-colors">
                  {isUrdu ? 'چوہدری اسد حنیف جٹ' : 'Ch Asad Hanif'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#087A43] border border-[#C9A227]/40 text-[#C9A227] font-semibold">
                  MPA
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                {isUrdu ? 'حلقہ پی پی 203، چیچہ وطنی، ضلع ساہیوال' : 'PP-203 Chichawatni • District Sahiwal'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#087A43] text-white shadow-sm border-b-2 border-[#C9A227]'
                      : 'text-emerald-100/90 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isUrdu ? link.labelUr : link.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Language Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-xs font-semibold text-[#C9A227] border border-[#C9A227]/40 transition-colors shadow-sm"
              title="Switch Language (Urdu / English)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-md bg-emerald-900 text-[#C9A227] text-xs font-bold border border-[#C9A227]/30"
            >
              {isUrdu ? 'EN' : 'اردو'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e2f20] border-t border-emerald-800/80 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left rtl:text-right transition-colors ${
                    isActive
                      ? 'bg-[#087A43] text-white font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C9A227]'
                      : 'text-emerald-100 hover:bg-white/5'
                  }`}
                >
                  {isUrdu ? link.labelUr : link.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
