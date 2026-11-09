import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { testConnection } from './lib/firebase';
import { 
  getProfile, 
  getProjects, 
  getAssemblyActivities, 
  getNews, 
  getGallery, 
  getAllComplaints, 
  getContactMessages, 
  getSiteSettings,
  getPublicNotices,
  getSMSLogs,
  getAuditLogs
} from './services/firestoreService';
import { 
  LeaderProfile, 
  Project, 
  AssemblyActivity, 
  NewsItem, 
  GalleryMedia, 
  CitizenComplaint, 
  ContactMessage, 
  SiteSettings,
  PublicNotice,
  SMSLog,
  AuditLog
} from './types';
import { 
  initialProfile, 
  initialProjects, 
  initialAssemblyActivities, 
  initialNews, 
  initialGallery, 
  initialComplaints, 
  initialSettings,
  initialPublicNotices
} from './data/initialData';

import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ConstituencySection } from './components/ConstituencySection';
import { ProjectsSection } from './components/ProjectsSection';
import { ConstituencyMap } from './components/ConstituencyMap';
import { PublicNoticesSection } from './components/PublicNoticesSection';
import { AssemblySection } from './components/AssemblySection';
import { PublicServicePortal } from './components/PublicServicePortal';
import { NewsSection } from './components/NewsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { QRCodeVisitingCardModal } from './components/QRCodeVisitingCardModal';
import { LegalModal } from './components/LegalModal';
import { AdminPortal } from './admin/AdminPortal';

function AppContent() {
  const { isUrdu } = useLanguage();

  // Route path tracker for URL separation (/ vs /admin/*) with GitHub Pages subdirectory and hash support
  const checkIsAdmin = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('/admin') || hash.includes('/admin') || hash.startsWith('#admin');
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdmin);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdmin());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToHome = () => {
    const path = window.location.pathname;
    const adminIndex = path.indexOf('/admin');
    const basePath = adminIndex !== -1 ? path.substring(0, adminIndex) || '/' : path;
    try {
      window.history.pushState({}, '', basePath);
    } catch (_) {}
    window.location.hash = '';
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'data_protection' | 'disclaimer' | null>(null);

  // Live persistent state
  const [profile, setProfile] = useState<LeaderProfile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activities, setActivities] = useState<AssemblyActivity[]>(initialAssemblyActivities);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [gallery, setGallery] = useState<GalleryMedia[]>(initialGallery);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(initialComplaints);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [notices, setNotices] = useState<PublicNotice[]>(initialPublicNotices);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [
        pData, 
        projData, 
        actData, 
        newsData, 
        galData, 
        cmpData, 
        msgData, 
        setData,
        noticesData,
        smsData,
        auditData
      ] = await Promise.all([
        getProfile(),
        getProjects(),
        getAssemblyActivities(),
        getNews(),
        getGallery(),
        getAllComplaints(),
        getContactMessages(),
        getSiteSettings(),
        getPublicNotices(),
        getSMSLogs(),
        getAuditLogs()
      ]);

      if (pData) setProfile(pData);
      if (projData && projData.length > 0) setProjects(projData);
      if (actData && actData.length > 0) setActivities(actData);
      if (newsData && newsData.length > 0) setNews(newsData);
      if (galData && galData.length > 0) setGallery(galData);
      if (cmpData && cmpData.length > 0) setComplaints(cmpData);
      if (msgData) setContactMessages(msgData);
      if (setData) setSettings(setData);
      if (noticesData && noticesData.length > 0) setNotices(noticesData);
      if (smsData && smsData.length > 0) setSmsLogs(smsData);
      if (auditData && auditData.length > 0) setAuditLogs(auditData);
    } catch (e) {
      console.warn('Error loading dynamic database, displaying verified constituency baseline:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    loadData();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // SEPARATE PRIVATE ADMIN PORTAL (/admin/*)
  // Completely isolated from the public website layout.
  // -------------------------------------------------------------
  if (isAdminRoute) {
    return (
      <>
        <AdminPortal
          profile={profile}
          projects={projects}
          activities={activities}
          news={news}
          gallery={gallery}
          complaints={complaints}
          contactMessages={contactMessages}
          notices={notices}
          smsLogs={smsLogs}
          auditLogs={auditLogs}
          settings={settings}
          onRefreshData={loadData}
          onOpenMonthlyReport={() => setIsMonthlyReportOpen(true)}
          onOpenQRGenerator={() => setIsQRModalOpen(true)}
          onNavigateHome={navigateToHome}
        />

        {/* Admin Accessible Monthly Public Service Report Modal */}
        <MonthlyReportModal
          isOpen={isMonthlyReportOpen}
          onClose={() => setIsMonthlyReportOpen(false)}
          profile={profile}
          projects={projects}
          complaints={complaints}
          activities={activities}
          notices={notices}
        />

        {/* Admin Accessible Official Visiting Card & QR Code Generator */}
        <QRCodeVisitingCardModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          profile={profile}
          settings={settings}
        />
      </>
    );
  }

  // -------------------------------------------------------------
  // PUBLIC WEBSITE (/)
  // Completely free of any Admin Login or Dashboard references.
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col bg-[#F7F9F7] text-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Top Announcement Bar */}
      <AnnouncementBanner settings={settings} />

      {/* Main Public Navigation (No admin links) */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero 
              profile={profile} 
              projects={projects} 
              complaints={complaints}
              onNavigate={handleTabChange} 
            />

            {/* Quick Public Grievance Featurette */}
            <div className="bg-emerald-900 text-white py-10 px-4">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block mb-1">
                    {isUrdu ? 'عوامی خدمت — پی پی 203 چیچہ وطنی' : 'Public Grievance Redressal • PP-203'}
                  </span>
                  <h3 className="text-2xl font-bold">
                    {isUrdu ? 'کیا آپ کے علاقے میں سڑک، پانی یا بجلی کا مسئلہ ہے؟' : 'Facing civic, water, road or electricity issues in PP-203?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
                    {isUrdu 
                      ? 'چوہدری اسد حنیف جٹ کے عوامی پورٹل پر براہِ راست اپنی شکایت درج کروائیں اور ٹریکنگ کوڈ کے ذریعے پیش رفت معلوم کریں۔' 
                      : 'File a formal grievance directly with the MPA secretariat. Track official departmental action in real-time.'}
                  </p>
                </div>
                <button
                  onClick={() => handleTabChange('portal')}
                  className="px-6 py-3 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs sm:text-sm border border-[#C9A227] shadow-lg shrink-0 cursor-pointer"
                >
                  {isUrdu ? 'شکایت درج کریں / ٹریک کریں' : 'Submit or Track Complaint'}
                </button>
              </div>
            </div>

            <AboutSection 
              profile={profile} 
              onNavigate={handleTabChange} 
            />

            <ConstituencySection 
              projects={projects} 
              onViewProjects={() => handleTabChange('projects')} 
            />

            {/* Development Projects Section */}
            <ProjectsSection projects={projects} />

            {/* Interactive GIS Project Map (Module 5) */}
            <section className="py-12 bg-emerald-950/5 border-y border-emerald-900/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ConstituencyMap projects={projects} />
              </div>
            </section>

            {/* Downloadable Public Notices & Circulars (Module 4) */}
            <PublicNoticesSection notices={notices} />

            <AssemblySection activities={activities} />

            <PublicServicePortal />

            <NewsSection news={news} />

            <GallerySection gallery={gallery} />

            <ContactSection profile={profile} settings={settings} />
          </>
        )}

        {activeTab === 'about' && (
          <AboutSection profile={profile} onNavigate={handleTabChange} />
        )}

        {activeTab === 'constituency' && (
          <ConstituencySection projects={projects} onViewProjects={() => handleTabChange('projects')} />
        )}

        {activeTab === 'projects' && (
          <>
            <ProjectsSection projects={projects} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <ConstituencyMap projects={projects} />
            </div>
          </>
        )}

        {activeTab === 'map' && (
          <div className="py-10 bg-[#F7F9F7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ConstituencyMap projects={projects} />
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="py-8 bg-[#F7F9F7]">
            <PublicNoticesSection notices={notices} />
          </div>
        )}

        {activeTab === 'assembly' && (
          <AssemblySection activities={activities} />
        )}

        {activeTab === 'portal' && (
          <PublicServicePortal />
        )}

        {activeTab === 'news' && (
          <NewsSection news={news} />
        )}

        {activeTab === 'gallery' && (
          <GallerySection gallery={gallery} />
        )}

        {activeTab === 'contact' && (
          <ContactSection profile={profile} settings={settings} />
        )}
      </main>

      {/* Public Footer (No admin links) */}
      <Footer 
        profile={profile} 
        settings={settings} 
        onNavigate={handleTabChange} 
        onOpenLegal={(tab) => setLegalModalTab(tab)} 
      />

      {/* Floating WhatsApp Office Widget */}
      <WhatsAppButton settings={settings} />

      {/* Privacy Policy & Legal Notice Modal */}
      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
