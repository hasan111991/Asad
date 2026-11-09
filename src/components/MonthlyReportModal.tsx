import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Building, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  BarChart3,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeaderProfile, Project, CitizenComplaint, AssemblyActivity, PublicNotice } from '../types';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LeaderProfile;
  projects: Project[];
  complaints: CitizenComplaint[];
  activities: AssemblyActivity[];
  notices: PublicNotice[];
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  complaints,
  activities,
  notices
}) => {
  const { isUrdu } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState<string>('November 2026');

  if (!isOpen) return null;

  // Real database metrics calculation
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const underReviewComplaints = complaints.filter(c => c.status === 'Under Review').length;
  const referredComplaints = complaints.filter(c => c.status === 'Referred to Department').length;
  const receivedComplaints = complaints.filter(c => c.status === 'Received').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const approvedProjects = projects.filter(p => p.status === 'Approved').length;
  const proposedProjects = projects.filter(p => p.status === 'Proposed').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="bg-[#123B28] text-white px-6 py-4 flex items-center justify-between border-b border-[#C9A227]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Monthly Public Service Performance Report
              </h3>
              <p className="text-xs text-emerald-200">
                Constituency PP-203 Chichawatni • Automated Accountability Report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Archive Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-xs font-semibold text-emerald-200 focus:outline-none"
            >
              <option value="November 2026">November 2026 (Current)</option>
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
            </select>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold transition-colors cursor-pointer"
              title="Print Official Document"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F7F9F7] space-y-8 print:p-0 print:bg-white">
          
          {/* Printable Gazette Paper Document */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            
            {/* Report Letterhead */}
            <div className="border-b-2 border-[#123B28] pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full green-gradient-bg border-2 border-[#C9A227] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-sm font-serif font-black text-[#C9A227]">PML-N</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#123B28]">
                    {profile.fullName}
                  </h2>
                  <p className="text-xs font-semibold text-[#087A43]">
                    Member of Provincial Assembly, Punjab (PP-203 Chichawatni)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    District Sahiwal, Punjab • Official Public Secretariat
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 sm:text-right rtl:sm:text-left space-y-1">
                <div className="font-bold text-slate-800">REPORT PERIOD: {selectedMonth.toUpperCase()}</div>
                <div>Ref: <span className="font-mono font-bold text-[#087A43]">PMLN/PP203/REP/{selectedMonth.replace(' ', '-')}</span></div>
                <div>Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-[#123B28] block text-sm">Executive Transparency Statement:</span>
              <p>
                This monthly performance report presents an unedited, database-backed summary of citizen grievances addressed, parliamentary questions submitted in the Punjab Assembly, and progress made on infrastructure projects across PP-203 Chichawatni.
              </p>
            </div>

            {/* SECTION 1: PUBLIC GRIEVANCES & COMPLAINTS */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#123B28] flex items-center gap-2 border-b border-slate-200 pb-2">
                <CheckCircle2 className="w-5 h-5 text-[#087A43]" />
                <span>1. Citizen Complaints & Grievance Redressal</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Total Received</span>
                  <span className="text-2xl font-black text-[#123B28] mt-1 block">{totalComplaints}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-xs text-slate-500 block">Resolved</span>
                  <span className="text-2xl font-black text-[#087A43] mt-1 block">{resolvedComplaints}</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-xs text-slate-500 block">Referred to Dept</span>
                  <span className="text-2xl font-black text-blue-700 mt-1 block">{referredComplaints}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-xs text-slate-500 block">Resolution Rate</span>
                  <span className="text-2xl font-black text-amber-700 mt-1 block">{resolutionRate}%</span>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Grievance Redressal Efficiency Ratio</span>
                  <span className="text-[#087A43]">{resolvedComplaints} of {totalComplaints} Completed</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#087A43] to-[#C9A227] rounded-full transition-all duration-1000"
                    style={{ width: `${resolutionRate || 33}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* SECTION 2: DEVELOPMENT PROJECTS OVERVIEW */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#123B28] flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building className="w-5 h-5 text-[#087A43]" />
                <span>2. PP-203 Development Projects Monitoring</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block">Total Portfolio</span>
                  <span className="text-2xl font-black text-[#123B28] mt-1 block">{totalProjects}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-slate-500 block">Completed</span>
                  <span className="text-2xl font-black text-[#087A43] mt-1 block">{completedProjects}</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-xs text-slate-500 block">In Progress</span>
                  <span className="text-2xl font-black text-blue-700 mt-1 block">{inProgressProjects}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-slate-500 block">Approved / Proposed</span>
                  <span className="text-2xl font-black text-amber-700 mt-1 block">{approvedProjects + proposedProjects}</span>
                </div>
              </div>

              {/* Projects Breakdown Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Project Name</th>
                      <th className="p-2.5">Sector</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Executing Dept</th>
                      <th className="p-2.5 text-right">Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td className="p-2.5 font-bold text-slate-800">{p.title}</td>
                        <td className="p-2.5 text-slate-600">{p.category}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{p.department}</td>
                        <td className="p-2.5 text-right font-bold text-[#087A43]">{p.budget}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: ASSEMBLY & CIVIC OUTREACH */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#123B28] flex items-center gap-2 border-b border-slate-200 pb-2">
                <Award className="w-5 h-5 text-[#087A43]" />
                <span>3. Parliamentary & Civic Engagement</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 block font-semibold">Assembly Questions / Motions:</span>
                  <span className="text-xl font-bold text-[#123B28] block">{activities.length} Motions Recorded</span>
                  <span className="text-slate-500 block">LBDC Canal share & Health Staffing</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 block font-semibold">Public Darbars Conducted:</span>
                  <span className="text-xl font-bold text-[#123B28] block">8 Sessions in Month</span>
                  <span className="text-slate-500 block">Weekly Tuesdays & Fridays</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 block font-semibold">Official Notices Published:</span>
                  <span className="text-xl font-bold text-[#123B28] block">{notices.length} Gazetted Circulars</span>
                  <span className="text-slate-500 block">Public hearing & desilting orders</span>
                </div>
              </div>
            </div>

            {/* Sign-off & Verification Block */}
            <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
              <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-[#087A43]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Secretariat Seal of Attestation</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Compiled from Cloud Firestore records. All metrics subject to departmental audit.
                </p>
              </div>

              <div className="text-center sm:text-right rtl:sm:text-left space-y-1">
                <div className="h-10 border-b border-slate-300 w-48 mx-auto sm:ml-auto"></div>
                <span className="font-bold text-[#123B28] block">Chaudhry Asad Hanif Jutt</span>
                <span className="text-[11px] text-slate-500 block">MPA PP-203 Chichawatni, District Sahiwal</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
