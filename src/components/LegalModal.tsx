import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'data_protection' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const { isUrdu } = useLanguage();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'data_protection' | 'disclaimer'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#123B28] text-white px-6 py-4 flex items-center justify-between border-b border-[#C9A227]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Legal Compliance & Citizen Privacy Architecture
              </h3>
              <p className="text-xs text-emerald-200">
                Official Portal of Chaudhry Asad Hanif Jutt (MPA PP-203 Chichawatni)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1 shrink-0">
          {[
            { id: 'privacy', labelEn: 'Privacy Policy', labelUr: 'پرائیویسی پالیسی' },
            { id: 'terms', labelEn: 'Terms of Use', labelUr: 'استعمال کے قواعد و ضوابط' },
            { id: 'data_protection', labelEn: 'Data Protection Notice', labelUr: 'ڈیٹا کا تحفظ' },
            { id: 'disclaimer', labelEn: 'Complaint Submission Disclaimer', labelUr: 'شکایت پورٹل دستبرداری' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#087A43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black hover:bg-white/60'
              }`}
            >
              {isUrdu ? tab.labelUr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#F7F9F7]">
          
          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-lg font-black text-[#123B28] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#087A43]" />
                <span>1. Citizen Privacy Policy</span>
              </h4>

              <p>
                The office of Chaudhry Asad Hanif Jutt (Member of Provincial Assembly, Punjab, PP-203 Chichawatni) is strictly committed to protecting the personal privacy and confidentiality of citizens who interact with this public representative portal.
              </p>

              <h5 className="font-bold text-slate-900 pt-2">Zero Public PII Exposure Guarantee:</h5>
              <p>
                We do not publicly disclose, sell, or commercialize any Personally Identifiable Information (PII). A citizen's name, mobile number, residential address, village/chak details, and exact complaint descriptions are never indexed by public search engines or listed publicly on the website.
              </p>

              <h5 className="font-bold text-slate-900 pt-2">Information Collected:</h5>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Voluntary contact details (name, phone number) submitted for grievance handling or appointments.</li>
                <li>Geographic classification (district, tehsil, union council, ward) necessary to forward issues to municipal or provincial departments.</li>
                <li>Anonymous analytics aggregates (browser type, device category, page views) with all IP anonymization enabled.</li>
              </ul>

              <h5 className="font-bold text-slate-900 pt-2">Data Retention:</h5>
              <p>
                Grievance records are maintained securely in Cloud Firestore for the duration of the representative term to ensure unresolved issues remain actionable during parliamentary sessions. Citizens may request deletion of resolved records by writing directly to the secretariat protocol desk.
              </p>
            </div>
          )}

          {/* TERMS OF USE */}
          {activeTab === 'terms' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-lg font-black text-[#123B28] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#087A43]" />
                <span>2. Official Terms of Public Use</span>
              </h4>

              <p>
                By accessing this portal, users agree to the following terms and principles of fair civic engagement:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Authorized Representative Portal:</strong> This website serves as the direct digital outreach secretariat for Chaudhry Asad Hanif Jutt in his capacity as MPA for PP-203. It facilitates public petitioning and legislative accountability.
                </li>
                <li>
                  <strong>Respectful Communication:</strong> Submissions containing profane, defamatory, malicious, or abusive language will be rejected without forwarding to government departments.
                </li>
                <li>
                  <strong>No Fee Requirement:</strong> Grievance submission and digital tracking through this portal are completely free of charge. No representative or staff member is authorized to seek financial consideration for processing complaints.
                </li>
                <li>
                  <strong>Authentic Information:</strong> Citizens are requested to provide accurate mobile contact numbers and factual geographic descriptions to enable field verification by municipal inspectors.
                </li>
              </ul>
            </div>
          )}

          {/* DATA PROTECTION NOTICE */}
          {activeTab === 'data_protection' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-lg font-black text-[#123B28] flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-[#087A43]" />
                <span>3. Data Protection & Security Architecture</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-[#087A43] block">Firestore ABAC Rules</span>
                  <p className="text-xs text-slate-600">
                    Database collections enforce strict Zero-Trust Attribute-Based Access Control. List queries for complaint records are restricted solely to authenticated administrative accounts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-[#087A43] block">Audit Logging</span>
                  <p className="text-xs text-slate-600">
                    Every administrative modification—including complaint status updates, departmental referrals, and notice publications—is cryptographically recorded in an immutable audit ledger.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-[#087A43] block">Encrypted Transmission</span>
                  <p className="text-xs text-slate-600">
                    All communications between citizen browsers and Firebase Cloud servers utilize 256-bit TLS/SSL encryption.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-[#087A43] block">Privacy-Safe Analytics</span>
                  <p className="text-xs text-slate-600">
                    Google Analytics 4 is implemented without tracking citizen identity, complaint content, or telephone credentials.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COMPLAINT SUBMISSION DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-lg font-black text-[#123B28] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>4. Public Grievance Submission Disclaimer</span>
              </h4>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-2">
                <span className="font-bold block text-sm">Non-Governmental Secretariat Disclaimer:</span>
                <p>
                  This portal functions as a constituent assistance conduit established by Chaudhry Asad Hanif Jutt (MPA PP-203). It is not an executive police control room or a judicial tribunal.
                </p>
                <p>
                  Issues submitted here are reviewed by protocol officers and forwarded through official legislative referral letters to relevant government executing departments (such as C&W, MEPCO, Public Health Engineering, and District Police Sahiwal).
                </p>
                <p>
                  For immediate emergency situations (such as active fires, criminal life threats, or acute medical ambulance dispatch), citizens must contact official emergency numbers (15, 1122) immediately.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#087A43] text-white font-bold text-xs hover:bg-[#066135] transition-colors cursor-pointer"
          >
            {isUrdu ? 'سمجھ لیا اور بند کریں' : 'I Understand & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
