import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Building, 
  Inbox, 
  FileText, 
  Calendar, 
  Newspaper, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  Users, 
  ShieldCheck, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Printer, 
  QrCode, 
  Bell, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminRole } from '../types';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenMonthlyReport: () => void;
  onOpenQRGenerator: () => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  onOpenMonthlyReport,
  onOpenQRGenerator,
  onNavigateHome,
  children
}) => {
  const { currentUser, adminRole, isSuperAdmin, logout, hasPermission } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    {
      id: '/admin/dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['Super Admin', 'Office Manager', 'Project Manager', 'Media Manager', 'Data Entry Operator'] as AdminRole[]
    },
    {
      id: '/admin/projects',
      label: 'PP-203 Projects & GIS',
      icon: Building,
      allowedRoles: ['Super Admin', 'Project Manager', 'Data Entry Operator'] as AdminRole[]
    },
    {
      id: '/admin/complaints',
      label: 'Citizen Grievances & SMS',
      icon: Inbox,
      allowedRoles: ['Super Admin', 'Office Manager', 'Data Entry Operator'] as AdminRole[]
    },
    {
      id: '/admin/notices',
      label: 'Public Notices & Gazettes',
      icon: FileText,
      allowedRoles: ['Super Admin', 'Office Manager', 'Media Manager'] as AdminRole[]
    },
    {
      id: '/admin/appointments',
      label: 'Appointments & Inquiries',
      icon: Calendar,
      allowedRoles: ['Super Admin', 'Office Manager'] as AdminRole[]
    },
    {
      id: '/admin/news',
      label: 'News & Press Statements',
      icon: Newspaper,
      allowedRoles: ['Super Admin', 'Media Manager'] as AdminRole[]
    },
    {
      id: '/admin/gallery',
      label: 'Photo & Video Gallery',
      icon: ImageIcon,
      allowedRoles: ['Super Admin', 'Media Manager'] as AdminRole[]
    },
    {
      id: '/admin/analytics',
      label: 'Portal Analytics (GA4)',
      icon: BarChart3,
      allowedRoles: ['Super Admin', 'Office Manager'] as AdminRole[]
    },
    {
      id: '/admin/settings',
      label: 'Portal & WhatsApp Settings',
      icon: Settings,
      allowedRoles: ['Super Admin', 'Office Manager'] as AdminRole[]
    },
    {
      id: '/admin/staff',
      label: 'Staff Accounts & RBAC',
      icon: Users,
      allowedRoles: ['Super Admin'] as AdminRole[]
    },
    {
      id: '/admin/audit',
      label: 'Security Audit Logs',
      icon: ShieldCheck,
      allowedRoles: ['Super Admin'] as AdminRole[]
    }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileSidebarOpen(false);
  };

  const getRoleBadgeStyle = (role: AdminRole | null) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-amber-400 text-black border-amber-300 font-black';
      case 'Office Manager':
        return 'bg-emerald-600 text-white border-emerald-400 font-bold';
      case 'Project Manager':
        return 'bg-blue-600 text-white border-blue-400 font-bold';
      case 'Media Manager':
        return 'bg-purple-600 text-white border-purple-400 font-bold';
      case 'Data Entry Operator':
        return 'bg-slate-600 text-white border-slate-400 font-medium';
      default:
        return 'bg-emerald-800 text-emerald-200 border-emerald-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col lg:flex-row text-slate-800 antialiased font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#123B28] text-white border-r border-emerald-950 shrink-0 select-none">
        
        {/* Brand / Logo */}
        <div className="p-5 border-b border-emerald-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center shadow-md shrink-0">
            <span className="font-serif font-black text-[#C9A227] text-xs">PML-N</span>
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-white leading-tight truncate">
              Chaudhry Asad Hanif
            </h1>
            <p className="text-[10px] text-[#C9A227] font-semibold tracking-wider uppercase truncate">
              MPA PP-203 Secretariat
            </p>
          </div>
        </div>

        {/* Current Staff Role Badge */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-emerald-300 font-medium">Logged in as:</span>
            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getRoleBadgeStyle(adminRole)}`}>
              {adminRole || 'Staff'}
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            {currentUser?.email || 'admin@chasadhanif.pk'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasAccess = hasPermission(item.allowedRoles);
            const isActive = currentPath === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#087A43] text-white shadow-md border-l-4 border-[#C9A227]'
                    : hasAccess
                    ? 'text-emerald-100/90 hover:bg-emerald-900/50 hover:text-white'
                    : 'text-emerald-300/40 hover:bg-emerald-950/30 cursor-not-allowed opacity-60'
                }`}
                title={!hasAccess ? `Requires: ${item.allowedRoles.join(', ')}` : item.label}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-emerald-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {!hasAccess && <Lock className="w-3 h-3 text-emerald-400/40 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-900/80 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 text-xs font-semibold border border-emerald-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-semibold border border-rose-800/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Constituency CMS</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <span className="text-emerald-900 font-bold capitalize">
                {currentPath.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Monthly Report Quick Action */}
            <button
              onClick={onOpenMonthlyReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#087A43] border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              title="Generate Monthly Public Service Gazette & Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Monthly Report</span>
            </button>

            {/* Visiting Card & QR */}
            <button
              onClick={onOpenQRGenerator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
              title="Generate Official Visiting Card & QR"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700" />
              <span>Card / QR</span>
            </button>

            {/* Role indicator badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087A43]" />
              <span>{adminRole || 'Super Admin'}</span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#123B28] text-white flex items-center justify-center font-bold text-xs border border-[#C9A227]">
                  {currentUser?.email ? currentUser.email[0].toUpperCase() : 'A'}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800 truncate">
                      {currentUser?.displayName || 'Secretariat Staff'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {currentUser?.email}
                    </p>
                    <div className="mt-1">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getRoleBadgeStyle(adminRole)}`}>
                        {adminRole || 'Staff'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenMonthlyReport();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#087A43]" />
                    <span>Print Monthly Report</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenQRGenerator();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Generate Visiting Card</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateHome();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Exit to Public Portal</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#123B28] text-white px-4 py-4 space-y-1 border-b border-emerald-900 shadow-xl">
            <div className="p-3 mb-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs">
              <div className="font-bold text-white truncate">{currentUser?.email}</div>
              <div className="text-[11px] text-[#C9A227] font-semibold uppercase">{adminRole || 'Staff'}</div>
            </div>

            {navItems.map((item) => {
              const hasAccess = hasPermission(item.allowedRoles);
              const isActive = currentPath === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#087A43] text-white shadow-md'
                      : hasAccess
                      ? 'text-emerald-100 hover:bg-emerald-900/60'
                      : 'text-emerald-400/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-300" />
                    <span>{item.label}</span>
                  </div>
                  {!hasAccess && <Lock className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-emerald-900/80 flex items-center gap-2">
              <button
                onClick={onNavigateHome}
                className="flex-1 py-2 rounded-xl bg-emerald-950/80 text-emerald-200 text-xs font-semibold text-center border border-emerald-800"
              >
                Public Site
              </button>
              <button
                onClick={logout}
                className="flex-1 py-2 rounded-xl bg-rose-950/60 text-rose-200 text-xs font-bold text-center border border-rose-800"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
};
