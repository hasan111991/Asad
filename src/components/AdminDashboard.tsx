import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Building, 
  Landmark, 
  Newspaper, 
  Image as ImageIcon, 
  Inbox, 
  Settings, 
  Database,
  RefreshCw,
  ExternalLink,
  Save,
  MessageSquare,
  Lock,
  MessageCircle,
  Smartphone,
  QrCode,
  FileCheck2,
  MapPin,
  BarChart3,
  Activity,
  Shield,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  updateProfile, 
  createProject, 
  updateProject,
  deleteProject, 
  createAssemblyActivity, 
  deleteAssemblyActivity, 
  createNewsItem, 
  deleteNewsItem, 
  updateComplaintStatus, 
  updateSiteSettings,
  createPublicNotice,
  deletePublicNotice,
  seedInitialDatabase
} from '../services/firestoreService';
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
  ProjectCategory,
  ProjectStatus,
  ComplaintStatus,
  NoticeCategory
} from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
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
  onOpenQRGenerator
}) => {
  const { isAdmin, currentUser, loginWithGoogle, loginAsDemoAdmin, logout, isDemoAdmin } = useAuth();
  const { isUrdu } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    | 'overview' 
    | 'complaints' 
    | 'projects' 
    | 'map_editor' 
    | 'notices' 
    | 'whatsapp' 
    | 'sms' 
    | 'analytics' 
    | 'news' 
    | 'assembly' 
    | 'profile' 
    | 'messages' 
    | 'audit' 
    | 'settings'
  >('overview');

  // Status messages
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState<LeaderProfile>({ ...profile });

  // Settings Form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    titleUrdu: '',
    category: 'Roads and Infrastructure' as ProjectCategory,
    location: 'Chichawatni, PP-203',
    description: '',
    status: 'In Progress' as ProjectStatus,
    department: 'C&W Department Punjab',
    budget: 'PKR 100 Million',
    startDate: '2026',
    completionDate: '2027',
    imageUrl: '/src/assets/images/chichawatni_scene_1794225848060.jpg',
    fundingType: 'Government-Funded' as const,
    progressPercent: 50,
    latitude: 30.5333,
    longitude: 72.7000
  });

  // New Notice Form state
  const [newNotice, setNewNotice] = useState({
    title: '',
    titleUrdu: '',
    category: 'Public Announcements' as NoticeCategory,
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

  // Complaint action state
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [complaintStatusInput, setComplaintStatusInput] = useState<ComplaintStatus>('Under Review');
  const [complaintRemarksInput, setComplaintRemarksInput] = useState('');
  const [departmentReferredInput, setDepartmentReferredInput] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const showError = (err: string) => {
    setActionError(err);
    setTimeout(() => setActionError(null), 4000);
  };

  // Seed DB handler
  const handleSeed = async () => {
    setIsProcessing(true);
    try {
      await seedInitialDatabase();
      showNotification('Initial verified baseline seeded successfully into Firestore!');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error seeding database');
    } finally {
      setIsProcessing(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updateProfile(profileForm);
      showNotification('Profile updated successfully!');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error updating profile');
    } finally {
      setIsProcessing(false);
    }
  };

  // Settings Save (WhatsApp, SMS, GA4, Announcement)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updateSiteSettings(settingsForm);
      showNotification('Settings and integration parameters updated successfully!');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error updating settings');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    setIsProcessing(true);
    try {
      await createProject({
        ...newProject,
        titleUrdu: newProject.titleUrdu || newProject.title,
        categoryUrdu: newProject.category,
        locationUrdu: newProject.location,
        descriptionUrdu: newProject.description,
        statusUrdu: newProject.status,
        departmentUrdu: newProject.department,
        fundingTypeUrdu: newProject.fundingType
      });
      showNotification('Project created and added to GIS map!');
      setNewProject({
        title: '',
        titleUrdu: '',
        category: 'Roads and Infrastructure',
        location: 'Chichawatni, PP-203',
        description: '',
        status: 'In Progress',
        department: 'C&W Department Punjab',
        budget: 'PKR 100 Million',
        startDate: '2026',
        completionDate: '2027',
        imageUrl: '/src/assets/images/chichawatni_scene_1794225848060.jpg',
        fundingType: 'Government-Funded',
        progressPercent: 50,
        latitude: 30.5333,
        longitude: 72.7000
      });
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error creating project');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setIsProcessing(true);
    try {
      await deleteProject(id);
      showNotification('Project deleted');
      onRefreshData();
    } catch (e: any) {
      showError(e?.message || 'Error deleting project');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add Notice
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim()) return;
    setIsProcessing(true);
    try {
      await createPublicNotice({
        ...newNotice,
        titleUrdu: newNotice.titleUrdu || newNotice.title,
        categoryUrdu: newNotice.category,
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

  // Complaint Update (triggers SMS and Audit log)
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

  // Stats calculation
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Received' || c.status === 'Under Review').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-[#123B28] text-white px-6 py-4 flex items-center justify-between border-b border-[#C9A227]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Chaudhry Asad Hanif Jutt – Official Admin CMS</h2>
                {isDemoAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-black">
                    Demo Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">
                PP-203 Chichawatni Constituency Representative Portal Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Action: Monthly Report Modal */}
            <button
              onClick={onOpenMonthlyReport}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-bold text-white border border-emerald-600 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Monthly Report</span>
            </button>

            {/* Quick Action: QR Code Generator */}
            <button
              onClick={onOpenQRGenerator}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C9A227] hover:bg-amber-500 text-xs font-bold text-[#123B28] transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Cards</span>
            </button>

            {isAdmin ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Alert Toasts */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Main Body */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#087A43] flex items-center justify-center mx-auto border border-emerald-200">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#123B28]">Admin Authentication</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log in with your authorized administrator Google account (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">hasanaamir815@gmail.com</code>) or activate preview demo mode to evaluate CMS functionality.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => loginWithGoogle()}
                className="w-full py-3 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>Sign in with Google</span>
              </button>

              <button
                onClick={() => loginAsDemoAdmin('Super Admin')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer"
              >
                <span>Enter as Demo Administrator</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'complaints' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  <span>Public Complaints</span>
                </div>
                {pendingComplaints > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-extrabold">
                    {pendingComplaints}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'notices' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Public Notices ({notices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'whatsapp' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Office Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('sms')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'sms' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>SMS Notifications & Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'projects' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Manage Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('map_editor')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'map_editor' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Constituency GIS Map</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'analytics' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Google Analytics 4</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'news' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>News & Media</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Leader Profile & Bio</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'audit' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Audit Logs ({auditLogs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left rtl:text-right transition-colors cursor-pointer ${
                  activeTab === 'settings' ? 'bg-[#087A43] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Portal Settings</span>
              </button>

              <div className="pt-3 mt-auto border-t border-slate-200 space-y-2">
                <button
                  onClick={onOpenQRGenerator}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Visiting Card QR</span>
                </button>

                <button
                  onClick={handleSeed}
                  disabled={isProcessing}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#087A43] border border-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Seed Firestore Data</span>
                </button>
              </div>

            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#123B28]">PP-203 Executive Secretariat Dashboard</h3>
                      <p className="text-xs text-slate-500">Live operational metrics and citizen engagement analytics</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenMonthlyReport}
                        className="px-3 py-1.5 rounded-lg bg-[#087A43] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Generate Monthly Report</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-xs text-slate-600 block">Total Projects</span>
                      <span className="text-2xl font-black text-[#087A43] block mt-1">{projects.length}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">{completedProjects} Completed • {inProgressProjects} Ongoing</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-xs text-slate-600 block">Citizen Complaints</span>
                      <span className="text-2xl font-black text-amber-700 block mt-1">{complaints.length}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">{pendingComplaints} Pending • {resolvedComplaints} Resolved</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                      <span className="text-xs text-slate-600 block">Public Notices</span>
                      <span className="text-2xl font-black text-blue-700 block mt-1">{notices.length}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Active Gazetted Orders</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                      <span className="text-xs text-slate-600 block">SMS Notifications</span>
                      <span className="text-2xl font-black text-purple-700 block mt-1">{smsLogs.length}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Citizen Status Dispatches</span>
                    </div>
                  </div>

                  {/* Integration Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">WhatsApp Desk</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${settings.whatsappEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {settings.whatsappEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block truncate">{settings.whatsappNumber}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">SMS Gateway</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {settings.smsProvider}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block">Sender ID: {settings.smsSenderId}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Google Analytics 4</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${settings.gaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {settings.gaEnabled ? 'Active' : 'Off'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block font-mono">{settings.gaMeasurementId}</span>
                    </div>
                  </div>

                </div>
              )}

              {/* PUBLIC NOTICES TAB */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Downloadable Public Notices Manager</h3>
                    <p className="text-xs text-slate-500">Gazette circulars, public hearing announcements, and department orders</p>
                  </div>

                  <form onSubmit={handleAddNotice} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-[#123B28] flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#087A43]" />
                      <span>Gazette New Public Notice</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Notice Title (English)</label>
                        <input
                          type="text"
                          required
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                          placeholder="e.g. Canal Desilting Operation Schedule"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Notice Title (Urdu)</label>
                        <input
                          type="text"
                          value={newNotice.titleUrdu}
                          onChange={(e) => setNewNotice({ ...newNotice, titleUrdu: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-urdu"
                          placeholder="اردو میں عنوان"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                        <select
                          value={newNotice.category}
                          onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        >
                          <option value="Public Announcements">Public Announcements</option>
                          <option value="Development Updates">Development Updates</option>
                          <option value="Office Notifications">Office Notifications</option>
                          <option value="Public Meetings">Public Meetings</option>
                          <option value="Important Documents">Important Documents</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Publication Date</label>
                        <input
                          type="text"
                          value={newNotice.publishDate}
                          onChange={(e) => setNewNotice({ ...newNotice, publishDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Official Reference #</label>
                        <input
                          type="text"
                          value={newNotice.officialRef}
                          onChange={(e) => setNewNotice({ ...newNotice, officialRef: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Description & Orders</label>
                      <textarea
                        rows={3}
                        required
                        value={newNotice.description}
                        onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-[#087A43] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Publish Notice Document
                    </button>
                  </form>

                  {/* Notices Table */}
                  <div className="space-y-3">
                    {notices.map(n => (
                      <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#087A43]">
                              {n.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{n.officialRef}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#123B28] mt-1">{n.title}</h4>
                          <span className="text-xs text-slate-500">{n.publishDate} • {n.fileSize}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* WHATSAPP SETTINGS TAB */}
              {activeTab === 'whatsapp' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28] flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      <span>WhatsApp Office Integration</span>
                    </h3>
                    <p className="text-xs text-slate-500">Configure the floating contact button, default number, and message templates</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <input
                      type="checkbox"
                      id="whatsappEnabled"
                      checked={settingsForm.whatsappEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-[#087A43]"
                    />
                    <label htmlFor="whatsappEnabled" className="text-xs font-bold text-slate-800">
                      Enable Floating WhatsApp Support Widget on Website
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Official WhatsApp Phone Number</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                        placeholder="+923000000000"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">Include country code (+92 for Pakistan).</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Default Greeting Template</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappDefaultMessage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDefaultMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Complaint Inquiry Template (supports tracking ID)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.whatsappComplaintTemplate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappComplaintTemplate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Appointment Inquiry Template</label>
                    <textarea
                      rows={2}
                      value={settingsForm.whatsappAppointmentTemplate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappAppointmentTemplate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#087A43] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save WhatsApp Settings</span>
                  </button>
                </form>
              )}

              {/* SMS NOTIFICATIONS & LOGS TAB */}
              {activeTab === 'sms' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28] flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#087A43]" />
                      <span>SMS Gateway Settings & Delivery Logs</span>
                    </h3>
                    <p className="text-xs text-slate-500">Configure citizen SMS triggers and inspect delivery logs</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="smsEnabled"
                        checked={settingsForm.smsEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smsEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#087A43]"
                      />
                      <label htmlFor="smsEnabled" className="text-xs font-bold text-slate-800">
                        Enable Automated SMS Notifications on Complaint Status Changes
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Provider Engine</label>
                        <select
                          value={settingsForm.smsProvider}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smsProvider: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        >
                          <option value="simulated">Simulated / Internal Logger (Safe Preview)</option>
                          <option value="twilio">Twilio Cloud Gateway</option>
                          <option value="zong_portal">Zong Corporate Portal</option>
                          <option value="jazz_business">Jazz Business SMS</option>
                          <option value="custom_http">Custom HTTP Gateway</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Sender Masking / ID</label>
                        <input
                          type="text"
                          value={settingsForm.smsSenderId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smsSenderId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                          placeholder="e.g. PP203-MPA"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">API Key / Secret Token</label>
                        <input
                          type="password"
                          value={settingsForm.smsApiKey || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smsApiKey: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>

                    {settingsForm.smsProvider !== 'simulated' && !settingsForm.smsApiKey && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Configuration Notice: Live API key is not entered. Messages will fallback to simulated audit logging.</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">SMS Template: Complaint Received</label>
                      <input
                        type="text"
                        value={settingsForm.smsTemplateReceived}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smsTemplateReceived: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-[#087A43] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Save SMS Configuration
                    </button>
                  </form>

                  {/* SMS Delivery Logs */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[#123B28]">Recent Outgoing SMS Logs</h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                          <tr>
                            <th className="p-2.5">Time</th>
                            <th className="p-2.5">Ref ID</th>
                            <th className="p-2.5">Recipient Phone</th>
                            <th className="p-2.5">Message Content</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {smsLogs.map(log => (
                            <tr key={log.id}>
                              <td className="p-2.5 text-slate-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-2.5 font-mono font-bold text-[#087A43] whitespace-nowrap">{log.trackingId}</td>
                              <td className="p-2.5 font-mono text-slate-600">{log.recipientPhone}</td>
                              <td className="p-2.5 text-slate-700 max-w-xs truncate">{log.message}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* GIS MAP COORDINATES TAB */}
              {activeTab === 'map_editor' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Constituency Project GIS Map Coordinates</h3>
                    <p className="text-xs text-slate-500">Edit latitude and longitude coordinates for PP-203 Chichawatni development projects</p>
                  </div>

                  <div className="space-y-3">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#087A43]">
                              {proj.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#123B28] mt-1">{proj.title}</h4>
                            <span className="text-xs text-slate-500">{proj.location}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{proj.budget}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block">Latitude (°N)</label>
                            <input
                              type="number"
                              step="0.0001"
                              defaultValue={proj.latitude || 30.5333}
                              onBlur={(e) => updateProject(proj.id, { latitude: parseFloat(e.target.value) })}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block">Longitude (°E)</label>
                            <input
                              type="number"
                              step="0.0001"
                              defaultValue={proj.longitude || 72.7000}
                              onBlur={(e) => updateProject(proj.id, { longitude: parseFloat(e.target.value) })}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* WEBSITE ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28] flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#087A43]" />
                      <span>Google Analytics 4 & Visitor Trends</span>
                    </h3>
                    <p className="text-xs text-slate-500">Privacy-compliant visitor counts and conversion tracking</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="gaEnabled"
                        checked={settingsForm.gaEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gaEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#087A43]"
                      />
                      <label htmlFor="gaEnabled" className="text-xs font-bold text-slate-800">
                        Enable Google Analytics 4 Script Tag
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">GA4 Measurement ID</label>
                        <input
                          type="text"
                          value={settingsForm.gaMeasurementId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, gaMeasurementId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-[#087A43] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Update GA4 Configuration
                    </button>
                  </form>

                  {/* Analytics Metrics Preview Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-400 block font-semibold">Today's Visitors</span>
                      <span className="text-2xl font-black text-[#123B28] mt-1 block">412</span>
                      <span className="text-[11px] text-emerald-600 font-bold block mt-1">+14% vs yesterday</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-400 block font-semibold">Weekly Pageviews</span>
                      <span className="text-2xl font-black text-[#087A43] mt-1 block">3,890</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Average 2.4 min/session</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-400 block font-semibold">Mobile Traffic Ratio</span>
                      <span className="text-2xl font-black text-blue-700 mt-1 block">78.5%</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Android & iOS devices</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-400 block font-semibold">Key Portal Actions</span>
                      <span className="text-2xl font-black text-amber-700 mt-1 block">142</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Grievances & downloads</span>
                    </div>
                  </div>

                  {/* Popular Pages Bar Chart */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Most Visited Sections in PP-203</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Public Service Portal (Complaints & Tracking)</span>
                          <span className="text-[#087A43]">42%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-[#087A43] w-[42%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Development Projects & GIS Map</span>
                          <span className="text-blue-600">28%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 w-[28%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Public Notices & Gazetted Orders</span>
                          <span className="text-purple-600">16%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-purple-600 w-[16%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>About MPA Profile & Assembly Debates</span>
                          <span className="text-amber-600">14%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-amber-600 w-[14%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* AUDIT LOGS TAB */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Administrative Audit Ledger</h3>
                    <p className="text-xs text-slate-500">Immutable record of administrative actions, data edits, and citizen status notifications</p>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.map(al => (
                      <div key={al.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                            {al.action}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(al.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{al.details}</p>
                        <span className="text-[11px] text-slate-400 block">Admin: {al.adminEmail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPLAINTS TAB */}
              {activeTab === 'complaints' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Citizen Complaints Redressal</h3>
                    <p className="text-xs text-slate-500">Update status, forward to departments, and publish official remarks</p>
                  </div>

                  {/* Complaint Edit Box */}
                  {selectedComplaint && (
                    <form onSubmit={handleUpdateComplaint} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#123B28]">
                          Update Complaint: {selectedComplaint.trackingId} ({selectedComplaint.citizenName})
                        </h4>
                        <button type="button" onClick={() => setSelectedComplaint(null)} className="text-slate-500 text-xs">Cancel</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                          <select
                            value={complaintStatusInput}
                            onChange={(e) => setComplaintStatusInput(e.target.value as ComplaintStatus)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                          >
                            <option value="Received">Received</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Referred to Department">Referred to Department</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Department</label>
                          <input
                            type="text"
                            placeholder="e.g. Municipal Committee / MEPCO / PHE"
                            value={departmentReferredInput}
                            onChange={(e) => setDepartmentReferredInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Official Remarks (Visible on Citizen Tracking)</label>
                        <textarea
                          rows={3}
                          value={complaintRemarksInput}
                          onChange={(e) => setComplaintRemarksInput(e.target.value)}
                          placeholder="Action taken by secretariat..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        ></textarea>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                        <span>📱 An automated SMS notification will be dispatched to <strong>{selectedComplaint.phone}</strong> upon saving.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-xl bg-[#087A43] text-white text-xs font-bold cursor-pointer"
                      >
                        Save Action & Trigger SMS
                      </button>
                    </form>
                  )}

                  {/* Complaints Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Citizen</th>
                          <th className="p-3">Area</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {complaints.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-[#087A43]">{c.trackingId}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-800 block">{c.citizenName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                            </td>
                            <td className="p-3">{c.area}</td>
                            <td className="p-3">{c.category}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                                {c.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setComplaintStatusInput(c.status);
                                  setComplaintRemarksInput(c.adminRemarks || '');
                                  setDepartmentReferredInput(c.departmentReferred || '');
                                }}
                                className="px-3 py-1 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white font-bold text-[11px] cursor-pointer"
                              >
                                Review & Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Manage Development Projects</h3>
                    <p className="text-xs text-slate-500">Add, modify, or remove constituency development schemes</p>
                  </div>

                  <form onSubmit={handleAddProject} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-[#123B28] flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#087A43]" />
                      <span>Add New Project</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Project Name (English)</label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Project Name (Urdu)</label>
                        <input
                          type="text"
                          value={newProject.titleUrdu}
                          onChange={(e) => setNewProject({ ...newProject, titleUrdu: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-urdu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                        <select
                          value={newProject.category}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value as ProjectCategory })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        >
                          <option value="Roads and Infrastructure">Roads and Infrastructure</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Clean Drinking Water">Clean Drinking Water</option>
                          <option value="Education">Education</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Public Facilities">Public Facilities</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                        <select
                          value={newProject.status}
                          onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        >
                          <option value="Proposed">Proposed</option>
                          <option value="Approved">Approved</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Budget</label>
                        <input
                          type="text"
                          value={newProject.budget}
                          onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl bg-[#087A43] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Publish Project
                    </button>
                  </form>

                  <div className="space-y-3">
                    {projects.map(p => (
                      <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-[#123B28]">{p.title}</h4>
                          <span className="text-xs text-slate-500">{p.category} • {p.status} • {p.budget}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Manage Leader Profile & Secretariat</h3>
                    <p className="text-xs text-slate-500">Edit official biography, constituency address, and public notices</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (Urdu)</label>
                      <input
                        type="text"
                        value={profileForm.fullNameUrdu}
                        onChange={(e) => setProfileForm({ ...profileForm, fullNameUrdu: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-urdu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Biography (English)</label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Biography (Urdu)</label>
                    <textarea
                      rows={4}
                      value={profileForm.bioUrdu}
                      onChange={(e) => setProfileForm({ ...profileForm, bioUrdu: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-urdu"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#087A43] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </form>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Portal & Banner Settings</h3>
                    <p className="text-xs text-slate-500">Configure top notification banner and helpline</p>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="announcementActive"
                      checked={settingsForm.announcementActive}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#087A43]"
                    />
                    <label htmlFor="announcementActive" className="text-xs font-bold text-slate-800">
                      Show Announcement Banner on Top of Website
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Banner Text (English)</label>
                    <input
                      type="text"
                      value={settingsForm.announcement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Banner Text (Urdu)</label>
                    <input
                      type="text"
                      value={settingsForm.announcementUrdu}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementUrdu: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-urdu"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={settingsForm.helplinePhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, helplinePhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#087A43] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </form>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B28]">Contact Inquiries</h3>
                    <p className="text-xs text-slate-500">Citizen messages and appointment inquiries</p>
                  </div>

                  {contactMessages.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <p className="text-slate-500 text-xs">No direct inquiries received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contactMessages.map(msg => (
                        <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#123B28]">{msg.name} ({msg.phone})</span>
                            <span className="text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xs font-bold text-[#087A43]">{msg.subject}</h4>
                          <p className="text-xs text-slate-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
