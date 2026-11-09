import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { StaffView } from './views/StaffView';
import { AccessDeniedView } from './views/AccessDeniedView';
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
  AuditLog,
  AdminRole,
  ProjectCategory,
  ProjectStatus,
  ComplaintStatus,
  NoticeCategory
} from '../types';
import { 
  updateProfile, 
  createProject, 
  updateProject, 
  deleteProject, 
  createNewsItem, 
  deleteNewsItem, 
  updateComplaintStatus, 
  updateSiteSettings, 
  createPublicNotice, 
  deletePublicNotice, 
  seedInitialDatabase 
} from '../services/firestoreService';
import { 
  Building, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Inbox, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Newspaper, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  Database, 
  RefreshCw, 
  MessageCircle, 
  Smartphone, 
  ShieldCheck, 
  Check, 
  Save, 
  Eye, 
  TrendingUp, 
  Send,
  Lock,
  ExternalLink
} from 'lucide-react';

interface AdminPortalProps {
  profile: LeaderProfile;
  projects: Project[];
  activities: AssemblyActivity[];
  news: NewsItem[];
  gallery: GalleryMedia[];
  complaints: CitizenComplaint[];
  contactMessages: ContactMessage[];
  notices: PublicNotice[];
  smsLogs: SMSLog[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onOpenMonthlyReport: () => void;
  onOpenQRGenerator: () => void;
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  profile,
  projects,
  activities,
  news,
  gallery,
  complaints,
  contactMessages,
  notices,
  smsLogs,
  auditLogs,
  settings,
  onRefreshData,
  onOpenMonthlyReport,
  onOpenQRGenerator,
  onNavigateHome
}) => {
  const { isAdmin, adminRole, isSuperAdmin, hasPermission, logout } = useAuth();
  const { isUrdu } = useLanguage();

  // Internal path routing (syncs with browser history)
  const getInitialPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      return path === '/admin' ? '/admin/dashboard' : path;
    }
    return '/admin/dashboard';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with browser URL
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentPath(path === '/admin' ? '/admin/dashboard' : path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 5000);
  };

  // -------------------------------------------------------------
  // STATE MANAGEMENT FOR ADMIN MODULES
  // -------------------------------------------------------------
  // Project Form
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    titleUrdu: '',
    category: 'Roads and Infrastructure',
    location: 'Chichawatni Urban Ward',
    locationUrdu: 'چیچہ وطنی اربن وارڈ',
    description: '',
    descriptionUrdu: '',
    status: 'In Progress',
    department: 'Communication & Works (C&W) Dept',
    budget: 'PKR 45.0 Million',
    startDate: 'March 2024',
    completionDate: 'December 2024',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800',
    fundingType: 'Government-Funded',
    progressPercent: 50,
    latitude: 30.5333,
    longitude: 72.7000
  });

  // Complaint Update
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [complaintStatusInput, setComplaintStatusInput] = useState<ComplaintStatus>('Received');
  const [complaintRemarksInput, setComplaintRemarksInput] = useState('');
  const [departmentReferredInput, setDepartmentReferredInput] = useState('');

  // News Form
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    title: '',
    titleUrdu: '',
    category: 'Latest Updates',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    content: '',
    contentUrdu: '',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    isFeatured: true
  });

  // Public Notice Form
  const [newNotice, setNewNotice] = useState<Partial<PublicNotice>>({
    title: '',
    titleUrdu: '',
    category: 'Public Announcements',
    publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    description: '',
    descriptionUrdu: '',
    fileUrl: '/docs/notices/public-notice.pdf',
    fileName: 'Constituent-Notice.pdf',
    fileSize: '450 KB',
    fileType: 'PDF',
    officialRef: 'MPA/PP203/NOT/' + new Date().getFullYear(),
    isPublished: true
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Profile Form
  const [profileForm, setProfileForm] = useState<LeaderProfile>(profile);
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, projectForm);
        showNotification('PP-203 Development project details and GIS coordinates updated!');
      } else {
        await createProject({
          ...projectForm,
          id: 'proj-' + Date.now(),
          titleUrdu: projectForm.titleUrdu || projectForm.title,
          categoryUrdu: projectForm.category,
          statusUrdu: projectForm.status,
          departmentUrdu: projectForm.department,
          fundingTypeUrdu: projectForm.fundingType,
          descriptionUrdu: projectForm.descriptionUrdu || projectForm.description,
          locationUrdu: projectForm.locationUrdu || projectForm.location
        } as Project);
        showNotification('New constituency infrastructure project registered!');
      }
      setIsAddingProject(false);
      setEditingProjectId(null);
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error saving project');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this development project?')) return;
    setIsProcessing(true);
    try {
      await deleteProject(id);
      showNotification('Project removed from PP-203 portfolio');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error deleting project');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setIsProcessing(true);
    try {
      await updateComplaintStatus(
        selectedComplaint.id,
        complaintStatusInput,
        complaintRemarksInput,
        departmentReferredInput,
        selectedComplaint.phone,
        selectedComplaint.trackingId
      );
      showNotification(`Complaint updated to "${complaintStatusInput}" and SMS logged!`);
      setSelectedComplaint(null);
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error updating complaint');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      showError('Please fill out notice title and description');
      return;
    }
    setIsProcessing(true);
    try {
      await createPublicNotice({
        title: newNotice.title,
        category: (newNotice.category || 'Public Announcements') as NoticeCategory,
        publishDate: newNotice.publishDate || new Date().toLocaleDateString('en-GB'),
        description: newNotice.description,
        fileUrl: newNotice.fileUrl || '/docs/notices/public-notice.pdf',
        fileName: newNotice.fileName || 'Official-Notice.pdf',
        fileSize: newNotice.fileSize || '380 KB',
        fileType: 'PDF',
        isPublished: true,
        titleUrdu: newNotice.titleUrdu || newNotice.title,
        categoryUrdu: newNotice.category || 'Public Announcements',
        descriptionUrdu: newNotice.descriptionUrdu || newNotice.description
      });
      showNotification('Public notice gazetted and published!');
      setNewNotice({
        title: '',
        titleUrdu: '',
        category: 'Public Announcements',
        publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        description: '',
        descriptionUrdu: '',
        fileUrl: '/docs/notices/public-notice.pdf',
        fileName: 'Constituent-Notice.pdf',
        fileSize: '450 KB',
        fileType: 'PDF',
        officialRef: 'MPA/PP203/NOT/' + new Date().getFullYear(),
        isPublished: true
      });
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error publishing notice');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Delete this gazetted public notice?')) return;
    setIsProcessing(true);
    try {
      await deletePublicNotice(id);
      showNotification('Notice removed from public listing');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error deleting notice');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updateSiteSettings(settingsForm);
      showNotification('Portal configuration, WhatsApp & SMS settings saved!');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error saving settings');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updateProfile(profileForm);
      showNotification('Leader biographical and official profile saved!');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error updating profile');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will seed/verify the baseline database records for PP-203. Continue?')) return;
    setIsProcessing(true);
    try {
      const res = await seedInitialDatabase();
      showNotification(`Database baseline verified successfully (${res.count} records)!`);
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error seeding database');
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // AUTHENTICATION GUARD
  // -------------------------------------------------------------
  // If not logged in, render the dedicated AdminLogin screen
  if (!isAdmin) {
    return (
      <AdminLogin
        onNavigateHome={onNavigateHome}
        onLoginSuccess={() => navigateTo('/admin/dashboard')}
      />
    );
  }

  // Calculate statistics
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Received' || c.status === 'Under Review').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <AdminLayout
      currentPath={currentPath}
      onNavigate={navigateTo}
      onOpenMonthlyReport={onOpenMonthlyReport}
      onOpenQRGenerator={onOpenQRGenerator}
      onNavigateHome={onNavigateHome}
    >
      {/* Toast banners */}
      {actionSuccess && (
        <div className="mb-4 p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="mb-4 p-3.5 bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 1. /admin/dashboard */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/dashboard' && (
        <div className="space-y-6">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#123B28] to-[#087A43] text-white p-6 rounded-3xl shadow-lg border border-[#C9A227]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider block mb-1">
                Constituency Operations Center
              </span>
              <h2 className="text-2xl font-black font-serif">
                PP-203 Chichawatni Secretariat
              </h2>
              <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                Real-time governance dashboard for monitoring citizen grievances, infrastructure developments, public notices, and assembly communications.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={onOpenMonthlyReport}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Monthly Report</span>
              </button>
              <button
                onClick={onOpenQRGenerator}
                className="px-3.5 py-2 rounded-xl bg-[#C9A227] hover:bg-amber-400 text-[#123B28] text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Visiting Cards</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Total Complaints</span>
                <Inbox className="w-4 h-4 text-[#087A43]" />
              </div>
              <div className="text-2xl font-black text-slate-900">{complaints.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {resolvedComplaints} Resolved • {pendingComplaints} Pending
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Development Projects</span>
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{projects.length}</div>
              <div className="text-[11px] text-blue-600 font-medium mt-1">
                {completedProjects} Finished • {inProgressProjects} Active
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Public Notices</span>
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{notices.length}</div>
              <div className="text-[11px] text-purple-600 font-medium mt-1">
                Gazetted circulars & announcements
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Citizen Messages</span>
                <Calendar className="w-4 h-4 text-[#C9A227]" />
              </div>
              <div className="text-2xl font-black text-slate-900">{contactMessages.length}</div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">
                Secretariat appointment inquiries
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Grievances (8 cols) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Citizen Grievances</h3>
                  <p className="text-xs text-slate-500">Live feed from Public Service Portal</p>
                </div>
                <button
                  onClick={() => navigateTo('/admin/complaints')}
                  className="text-xs font-bold text-[#087A43] hover:underline cursor-pointer"
                >
                  View All Complaints →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((c) => (
                  <div key={c.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#087A43]">{c.trackingId}</span>
                        <span className="text-xs font-bold text-slate-800">{c.citizenName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({c.area})</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{c.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'Referred to Department' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'Under Review' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status & Shortcuts (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087A43]" />
                  <span>Security & System Status</span>
                </h3>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Database:</span>
                    <span className="font-bold text-emerald-700">Firestore Connected</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Auth Provider:</span>
                    <span className="font-bold text-slate-800">Email/Password & Google</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Current Role:</span>
                    <span className="font-bold text-amber-700">{adminRole || 'Super Admin'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Audit Trail:</span>
                    <span className="font-bold text-slate-800">{auditLogs.length} Records</span>
                  </div>
                </div>

                <button
                  onClick={handleSeed}
                  disabled={isProcessing}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#087A43]" />
                  <span>Seed / Sync Initial Baseline</span>
                </button>
              </div>

              {/* Quick links to sections */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Shortcuts</h4>
                <button
                  onClick={() => navigateTo('/admin/projects')}
                  className="w-full text-left py-1.5 text-xs text-slate-700 hover:text-[#087A43] font-semibold flex items-center justify-between"
                >
                  <span>Manage Projects & Map</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigateTo('/admin/notices')}
                  className="w-full text-left py-1.5 text-xs text-slate-700 hover:text-[#087A43] font-semibold flex items-center justify-between"
                >
                  <span>Issue Public Notice</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigateTo('/admin/settings')}
                  className="w-full text-left py-1.5 text-xs text-slate-700 hover:text-[#087A43] font-semibold flex items-center justify-between"
                >
                  <span>Configure WhatsApp Office</span>
                  <span>→</span>
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => navigateTo('/admin/staff')}
                    className="w-full text-left py-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center justify-between"
                  >
                    <span>Manage Staff Accounts</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. /admin/projects */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/projects' && (
        !hasPermission(['Super Admin', 'Project Manager', 'Data Entry Operator']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Project Manager', 'Data Entry Operator']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#087A43]" />
                  <span>PP-203 Development Projects & GIS Location</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage constituency development works, allocate budgets, track completion, and set OpenStreetMap coordinates.
                </p>
              </div>

              {hasPermission(['Super Admin', 'Project Manager']) && (
                <button
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm({
                      title: '',
                      titleUrdu: '',
                      category: 'Roads and Infrastructure',
                      location: 'Chichawatni',
                      locationUrdu: 'چیچہ وطنی',
                      description: '',
                      descriptionUrdu: '',
                      status: 'In Progress',
                      department: 'Communication & Works (C&W) Dept',
                      budget: 'PKR 25.0 Million',
                      startDate: '2024',
                      completionDate: '2025',
                      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800',
                      fundingType: 'Government-Funded',
                      progressPercent: 30,
                      latitude: 30.5333,
                      longitude: 72.7000
                    });
                    setIsAddingProject(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold flex items-center gap-2 shadow cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#C9A227]" />
                  <span>Add New Development Project</span>
                </button>
              )}
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Sector</th>
                      <th className="py-3 px-4">Status & Progress</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">GIS Coordinates</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{p.title}</div>
                          <div className="text-[11px] text-slate-500 font-urdu">{p.titleUrdu}</div>
                          <div className="text-[11px] text-emerald-700 mt-0.5">{p.location}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{p.status}</div>
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                            <div className="bg-[#087A43] h-full" style={{ width: `${p.progressPercent}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-400">{p.progressPercent}% Completed</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {p.budget}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {p.latitude ? `${p.latitude.toFixed(4)}, ${p.longitude?.toFixed(4)}` : 'Not set'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {hasPermission(['Super Admin', 'Project Manager']) && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProjectId(p.id);
                                  setProjectForm(p);
                                  setIsAddingProject(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                title="Edit Project & Coordinates"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for Project Add / Edit */}
            {isAddingProject && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-bold text-slate-800">
                      {editingProjectId ? 'Edit PP-203 Project & Coordinates' : 'New PP-203 Development Project'}
                    </h3>
                    <button onClick={() => setIsAddingProject(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-xl">×</button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Project Title (English)</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 font-urdu">پروجیکٹ کا نام (Urdu)</label>
                        <input
                          type="text"
                          value={projectForm.titleUrdu || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, titleUrdu: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-urdu text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Sector / Category</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        >
                          <option value="Roads and Infrastructure">Roads & Infrastructure</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Clean Drinking Water">Clean Drinking Water</option>
                          <option value="Education">Education</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Public Facilities">Public Facilities</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Current Status</label>
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Approved">Approved</option>
                          <option value="Completed">Completed</option>
                          <option value="Proposed">Proposed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Progress Percentage (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={projectForm.progressPercent ?? 0}
                          onChange={(e) => setProjectForm({ ...projectForm, progressPercent: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Location / Union Council</label>
                        <input
                          type="text"
                          required
                          value={projectForm.location || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Budget Allocation</label>
                        <input
                          type="text"
                          required
                          value={projectForm.budget || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* GIS Coordinates */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#087A43]" />
                        <span>Interactive Leaflet Map Coordinates (PP-203 Chichawatni)</span>
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-slate-600 mb-0.5">Latitude (e.g. 30.5333)</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={projectForm.latitude ?? 30.5333}
                            onChange={(e) => setProjectForm({ ...projectForm, latitude: parseFloat(e.target.value) })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-slate-600 mb-0.5">Longitude (e.g. 72.7000)</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={projectForm.longitude ?? 72.7000}
                            onChange={(e) => setProjectForm({ ...projectForm, longitude: parseFloat(e.target.value) })}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={projectForm.description || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingProject(false)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-5 py-2 bg-[#087A43] hover:bg-[#066135] text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-4 h-4 text-[#C9A227]" />
                        <span>Save Project</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 3. /admin/complaints */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/complaints' && (
        !hasPermission(['Super Admin', 'Office Manager', 'Data Entry Operator']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Office Manager', 'Data Entry Operator']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-[#087A43]" />
                  <span>Citizen Complaints Triage & Automated SMS Dispatch</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Review grievances filed by constituents, refer to departments, update progress, and automatically send official SMS alerts.
                </p>
              </div>
              <div className="text-xs font-bold text-[#087A43] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {complaints.length} Total Registered
              </div>
            </div>

            {/* Complaints list */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Citizen & Contact</th>
                      <th className="py-3 px-4">Area & Category</th>
                      <th className="py-3 px-4">Issue Description</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Triage Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#087A43]">
                          {c.trackingId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{c.citizenName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-700">{c.category}</div>
                          <div className="text-[11px] text-slate-400">{c.area}, Chichawatni</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                          {c.description}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                            c.status === 'Referred to Department' ? 'bg-blue-100 text-blue-800' :
                            c.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setComplaintStatusInput(c.status);
                              setComplaintRemarksInput(c.adminRemarks || '');
                              setDepartmentReferredInput(c.departmentReferred || '');
                            }}
                            className="px-3 py-1 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Triage & SMS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Triage Modal */}
            {selectedComplaint && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Process Complaint: {selectedComplaint.trackingId}
                      </h3>
                      <p className="text-xs text-slate-500">Citizen: {selectedComplaint.citizenName} ({selectedComplaint.phone})</p>
                    </div>
                    <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer">×</button>
                  </div>

                  <form onSubmit={handleUpdateComplaint} className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                      <p className="font-bold text-slate-700 mb-1">Citizen Statement:</p>
                      <p className="text-[11px] leading-relaxed">{selectedComplaint.description}</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Grievance Status</label>
                      <select
                        value={complaintStatusInput}
                        onChange={(e) => setComplaintStatusInput(e.target.value as ComplaintStatus)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="Received">Received</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Referred to Department">Referred to Department</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Referral Department (if applicable)</label>
                      <input
                        type="text"
                        placeholder="e.g. WAPDA / FESCO / TMA Chichawatni / C&W / Health Dept"
                        value={departmentReferredInput}
                        onChange={(e) => setDepartmentReferredInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Secretariat Remarks</label>
                      <textarea
                        rows={3}
                        placeholder="Enter official resolution details or action taken..."
                        value={complaintRemarksInput}
                        onChange={(e) => setComplaintRemarksInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-[11px]">
                      <Smartphone className="w-4 h-4 text-[#087A43] shrink-0" />
                      <span>Saving status automatically logs and dispatches an official SMS to the citizen's phone ({selectedComplaint.phone}).</span>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(null)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-5 py-2 bg-[#087A43] hover:bg-[#066135] text-white font-bold rounded-xl shadow"
                      >
                        {isProcessing ? 'Updating...' : 'Update & Send SMS'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 4. /admin/notices */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/notices' && (
        !hasPermission(['Super Admin', 'Office Manager', 'Media Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Office Manager', 'Media Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#087A43]" />
                  <span>Public Notices & Gazetted Circulars</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Publish official notifications, development updates, meeting announcements, and downloadable PDF circulars for the constituency.
                </p>
              </div>
            </div>

            {/* Form to issue notice */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#087A43]" />
                <span>Issue & Gazette New Public Notice</span>
              </h3>
              <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Notice Title (English)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Schedule of Open Kachehri at Kassowal"
                      value={newNotice.title || ''}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 font-urdu">عنوان نوٹیفکیشن (Urdu)</label>
                    <input
                      type="text"
                      placeholder="کسووال میں کھلی کچہری کا شیڈول"
                      value={newNotice.titleUrdu || ''}
                      onChange={(e) => setNewNotice({ ...newNotice, titleUrdu: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-urdu text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newNotice.category}
                      onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as NoticeCategory })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Public Announcements">Public Announcements</option>
                      <option value="Development Updates">Development Updates</option>
                      <option value="Office Notifications">Office Notifications</option>
                      <option value="Public Meetings">Public Meetings</option>
                      <option value="Important Documents">Important Documents</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Publication Date</label>
                    <input
                      type="text"
                      value={newNotice.publishDate || ''}
                      onChange={(e) => setNewNotice({ ...newNotice, publishDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Document File Name</label>
                    <input
                      type="text"
                      value={newNotice.fileName || ''}
                      onChange={(e) => setNewNotice({ ...newNotice, fileName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notice Description & Circular Text</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter full text of the announcement or gazette circular..."
                    value={newNotice.description || ''}
                    onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-[#087A43] hover:bg-[#066135] text-white font-bold rounded-xl shadow cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C9A227]" />
                  <span>Publish & Gazette to Portal</span>
                </button>
              </form>
            </div>

            {/* List of Notices */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              <div className="p-4 bg-slate-50 font-bold text-slate-700 text-xs">
                Active Public Notices ({notices.length})
              </div>
              {notices.map((n) => (
                <div key={n.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{n.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                        {n.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-urdu mt-0.5">{n.titleUrdu}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Published: {n.publishDate} • File: {n.fileName} ({n.fileSize})
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNotice(n.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 5. /admin/appointments */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/appointments' && (
        !hasPermission(['Super Admin', 'Office Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Office Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#087A43]" />
                <span>Constituency Inquiries & Appointment Requests</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Citizen submissions received through the official secretariat contact form.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Citizen Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contactMessages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">No citizen messages received yet.</td>
                      </tr>
                    ) : (
                      contactMessages.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-800">{m.name}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{m.phone} {m.email && `• ${m.email}`}</td>
                          <td className="py-3 px-4 font-semibold text-[#087A43]">{m.subject}</td>
                          <td className="py-3 px-4 max-w-sm truncate text-slate-600">{m.message}</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : 'Recent'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 6. /admin/news */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/news' && (
        !hasPermission(['Super Admin', 'Media Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Media Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#087A43]" />
                  <span>News & Official Statements</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage press releases, media statements, and public engagement news.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 7. /admin/gallery */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/gallery' && (
        !hasPermission(['Super Admin', 'Media Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Media Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#087A43]" />
                <span>Photo & Video Gallery Media</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Visual documentation of constituency visits and assembly proceedings.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <img src={g.mediaUrl} alt={g.title} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <div className="font-bold text-xs text-slate-800 truncate">{g.title}</div>
                    <div className="text-[10px] text-slate-400">{g.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 8. /admin/analytics */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/analytics' && (
        !hasPermission(['Super Admin', 'Office Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Office Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#087A43]" />
                <span>Constituency Portal Analytics (Google Analytics 4)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Privacy-preserving citizen engagement metrics and traffic trends.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Estimated Monthly Visitors</span>
                <span className="text-3xl font-black text-[#087A43]">14,280</span>
                <span className="text-[11px] text-emerald-600 block mt-1">↑ 24% vs previous month</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Public Service Portal Hits</span>
                <span className="text-3xl font-black text-blue-600">8,950</span>
                <span className="text-[11px] text-blue-600 block mt-1">Complaint filing & tracking views</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Notice Downloads</span>
                <span className="text-3xl font-black text-purple-600">1,840</span>
                <span className="text-[11px] text-purple-600 block mt-1">Official circular PDF downloads</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">GA4 Measurement Configuration</h3>
              <p className="text-xs text-slate-500">
                To link your official Google Analytics 4 property, enter your Measurement ID below:
              </p>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={settingsForm.gaMeasurementId || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, gaMeasurementId: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-[#087A43] text-white rounded-xl text-xs font-bold"
                >
                  Save ID
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 9. /admin/settings */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/settings' && (
        !hasPermission(['Super Admin', 'Office Manager']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin', 'Office Manager']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#087A43]" />
                <span>Portal, WhatsApp Office & SMS Gateway Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure official communications, emergency telephone lines, and banner tickers.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              
              {/* WhatsApp Office */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Office Floating Button</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Official Number (International Format)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="wa-enabled"
                      checked={settingsForm.whatsappEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappEnabled: e.target.checked })}
                      className="w-4 h-4 text-[#087A43] rounded"
                    />
                    <label htmlFor="wa-enabled" className="font-bold text-slate-700">Enable Floating WhatsApp Contact Widget on Website</label>
                  </div>
                </div>
              </div>

              {/* SMS Gateway */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#087A43]" />
                  <span>Citizen SMS Notification Gateway</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMS Sender Mask / Header</label>
                    <input
                      type="text"
                      value={settingsForm.smsSenderId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smsSenderId: e.target.value })}
                      placeholder="e.g. ASAD-HANIF"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMS Gateway Provider</label>
                    <select
                      value={settingsForm.smsProvider}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smsProvider: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="simulated">Simulated / Internal SMS Logger</option>
                      <option value="custom_http">Custom Telecom HTTP Gateway</option>
                      <option value="zong_portal">Zong Business Portal</option>
                      <option value="jazz_business">Jazz Business SMS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Top Announcement Banner</h3>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Announcement Text (English)</label>
                  <input
                    type="text"
                    value={settingsForm.announcement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-urdu">اعلانیہ متن (Urdu)</label>
                  <input
                    type="text"
                    value={settingsForm.announcementUrdu || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementUrdu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-urdu text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-[#087A43] hover:bg-[#066135] text-white font-bold rounded-xl shadow cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#C9A227]" />
                <span>Save All Settings</span>
              </button>
            </form>
          </div>
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 10. /admin/staff */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/staff' && (
        !hasPermission(['Super Admin']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <StaffView />
        )
      )}

      {/* ----------------------------------------------------------- */}
      {/* 11. /admin/audit */}
      {/* ----------------------------------------------------------- */}
      {currentPath === '/admin/audit' && (
        !hasPermission(['Super Admin']) ? (
          <AccessDeniedView
            currentRole={adminRole}
            requiredRoles={['Super Admin']}
            onNavigateDashboard={() => navigateTo('/admin/dashboard')}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#087A43]" />
                <span>Administrative Audit Trail & Security Logs</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Immutable record of staff actions, status updates, logins, and project edits.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Staff Email</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#087A43]">{log.action}</td>
                        <td className="py-3 px-4 text-slate-700">{log.adminEmail}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-md truncate font-sans">{log.details}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

    </AdminLayout>
  );
};
