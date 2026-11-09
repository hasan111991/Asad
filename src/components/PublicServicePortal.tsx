import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Copy, 
  Check, 
  HelpCircle,
  Building,
  Phone,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitComplaint, trackComplaintByTrackingId } from '../services/firestoreService';
import { CitizenComplaint, ComplaintCategory, ComplaintStatus } from '../types';

export const PublicServicePortal: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form State
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Sahiwal');
  const [tehsil, setTehsil] = useState('Chichawatni');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Roads & Infrastructure');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ trackingId: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tracking State
  const [trackIdInput, setTrackIdInput] = useState('');
  const [trackPhoneInput, setTrackPhoneInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedComplaint, setTrackedComplaint] = useState<CitizenComplaint | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Generate Unique ID
  const generateTrackingId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `PP203-CMP-2026-${randomDigits}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!citizenName.trim() || !phone.trim() || !area.trim() || !description.trim()) {
      setFormError(isUrdu ? 'برائے مہربانی تمام مطلوبہ خانے پُر کریں۔' : 'Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    const trackingId = generateTrackingId();

    try {
      await submitComplaint({
        trackingId,
        citizenName: citizenName.trim(),
        phone: phone.trim(),
        district: district.trim(),
        tehsil: tehsil.trim(),
        area: area.trim(),
        category,
        description: description.trim(),
        status: 'Received',
        adminRemarks: isUrdu ? 'شکایت پورٹل پر موصول ہو گئی ہے۔ دفتر جلد جائزہ لے گا۔' : 'Complaint received. Queued for secretariat scrutiny.'
      });

      setSubmissionSuccess({ trackingId });
      // Clear form
      setCitizenName('');
      setPhone('');
      setArea('');
      setDescription('');
    } catch (err: any) {
      console.error('Submission error:', err);
      setFormError(isUrdu ? 'شکایت جمع کرتے وقت مسئلہ پیش آیا۔ براہِ کرم دوبارہ کوشش کریں۔' : 'Error submitting complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(null);
    setTrackedComplaint(null);

    if (!trackIdInput.trim()) {
      setTrackingError(isUrdu ? 'برائے مہربانی ٹریکنگ آئی ڈی درج کریں۔' : 'Please enter your tracking ID.');
      return;
    }

    setIsTracking(true);
    try {
      const res = await trackComplaintByTrackingId(trackIdInput.trim(), trackPhoneInput.trim());
      if (res) {
        setTrackedComplaint(res);
      } else {
        setTrackingError(isUrdu 
          ? 'اس ٹریکنگ آئی ڈی کا کوئی ریکارڈ نہیں ملا۔ براہ کرم درست آئی ڈی درج کریں۔' 
          : 'No complaint found matching this tracking ID. Please verify your reference number.');
      }
    } catch (err: any) {
      console.error('Tracking query error:', err);
      setTrackingError(isUrdu ? 'ریکارڈ تلاش کرنے میں دشواری پیش آئی۔' : 'Unable to query record at this time.');
    } finally {
      setIsTracking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusStepperIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Received': return 0;
      case 'Under Review': return 1;
      case 'Referred to Department': return 2;
      case 'Resolved': return 3;
      case 'Closed': return 4;
      default: return 0;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'عوامی خدمت و شکایات سیل' : 'Public Grievance Redressal'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'عوامی پورٹل برائے حلقہ پی پی 203 چیچہ وطنی' : 'Public Service Complaint & Request Portal'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'چیچہ وطنی اور دیہی چکس کے شہری اپنے مسائل براہِ راست چوہدری اسد حنیف جٹ کے عوامی سیکرٹریٹ کو ارسال کریں۔' 
              : 'Submit civic, road, water, electricity, or healthcare grievances directly to the MPA secretariat with real-time tracking.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#F7F9F7] p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => { setActiveTab('submit'); setSubmissionSuccess(null); }}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-[#087A43] text-white shadow-md'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {isUrdu ? 'نئی شکایت درج کریں' : 'Submit New Complaint'}
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-[#087A43] text-white shadow-md'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {isUrdu ? 'شکایت کا اسٹیٹس چیک کریں' : 'Track Existing Complaint'}
            </button>
          </div>
        </div>

        {/* SUBMISSION FORM TAB */}
        {activeTab === 'submit' && (
          <div className="bg-[#F7F9F7] rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            
            {submissionSuccess ? (
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#087A43] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#123B28]">
                    {isUrdu ? 'آپ کی شکایت کامیابی سے درج ہو گئی ہے!' : 'Complaint Successfully Registered!'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto">
                    {isUrdu 
                      ? 'چوہدری اسد حنیف جٹ کے عوامی سیکرٹریٹ کا شکایات سیل آپ کی درخواست کا جائزہ لے کر متعلقہ محکمے سے رابطہ کرے گا۔' 
                      : 'Your issue has been logged into the PP-203 secretariat database. Save your tracking ID to monitor official actions.'}
                  </p>
                </div>

                {/* Tracking ID Box */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-white border-2 border-dashed border-[#087A43] flex items-center justify-between gap-3 shadow-sm">
                  <div className="text-left rtl:text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {isUrdu ? 'آپ کی ٹریکنگ آئی ڈی' : 'Your Official Tracking ID'}
                    </span>
                    <span className="text-lg font-mono font-black text-[#087A43]">
                      {submissionSuccess.trackingId}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(submissionSuccess.trackingId)}
                    className="p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#087A43] border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId ? (isUrdu ? 'کاپی ہو گئی' : 'Copied!') : (isUrdu ? 'کاپی کریں' : 'Copy ID')}</span>
                  </button>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setTrackIdInput(submissionSuccess.trackingId);
                      setActiveTab('track');
                      setSubmissionSuccess(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#087A43] text-white font-bold text-xs shadow-md transition-colors"
                  >
                    {isUrdu ? 'اسٹیٹس ٹریک کریں' : 'Track This Complaint Now'}
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="px-6 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    {isUrdu ? 'ایک اور شکایت درج کریں' : 'Submit Another Complaint'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {formError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'شہری کا پورا نام *' : 'Citizen Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isUrdu ? 'مثال: محمد طارق' : 'e.g. Muhammad Tariq'}
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'موبائل نمبر (واٹس ایپ) *' : 'Mobile / WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'ضلع' : 'District'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={district}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-sm text-slate-600 cursor-not-allowed font-medium"
                    />
                  </div>

                  {/* Tehsil */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'تحصیل' : 'Tehsil'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={tehsil}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-sm text-slate-600 cursor-not-allowed font-medium"
                    />
                  </div>

                  {/* Area / Ward */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'علاقہ / چک نمبر / وارڈ *' : 'Area / Chak / Ward *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isUrdu ? 'مثال: چک 110/7-R یا وارڈ 4' : 'e.g. Chak 110/7-R or Ward 4'}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#123B28]">
                    {isUrdu ? 'مسئلے کی کیٹیگری *' : 'Category of Complaint *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                  >
                    <option value="Roads & Infrastructure">{isUrdu ? 'سڑکیں اور انفراسٹرکچر' : 'Roads & Infrastructure'}</option>
                    <option value="Water Supply">{isUrdu ? 'پینے کا صاف پانی اور فلٹریشن' : 'Water Supply'}</option>
                    <option value="Electricity">{isUrdu ? 'بجلی اور ٹرانسفارمر مسائل' : 'Electricity'}</option>
                    <option value="Education Concerns">{isUrdu ? 'سرکاری اسکول و کالج کے مسائل' : 'Education Concerns'}</option>
                    <option value="Healthcare Facilities">{isUrdu ? 'ہسپتال، ادویات اور بی ایچ یو' : 'Healthcare Facilities'}</option>
                    <option value="Sanitation & Sewerage">{isUrdu ? 'نکاسی آب اور سیوریج' : 'Sanitation & Sewerage'}</option>
                    <option value="Other Public Service">{isUrdu ? 'دیگر عوامی مسائل' : 'Other Public Service'}</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#123B28]">
                    {isUrdu ? 'مسئلے کی تفصیلی وضاحت اور مقام *' : 'Detailed Description of Concern *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={isUrdu ? 'مسئلے کی مکمل تفصیل لکھیں کہ یہ کب سے ہے اور کس جگہ واقع ہے...' : 'Provide complete details about the location, nature of problem, and how many citizens are affected...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                  ></textarea>
                </div>

                {/* Privacy Assurance Notice */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#087A43] shrink-0 mt-0.5" />
                  <p>
                    {isUrdu 
                      ? 'رازداری کی ضمانت: آپ کا نام اور رابطہ نمبر صرف چوہدری اسد حنیف جٹ کے دفتر کے پاس محفوظ رہے گا اور کبھی پبلک نہیں کیا جائے گا۔' 
                      : 'Citizen Privacy Guarantee: Your personal mobile number and identity remain confidential within the representative secretariat and will never be displayed publicly.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-sm shadow-lg shadow-emerald-900/30 border border-[#C9A227]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (isUrdu ? 'شکایت درج ہو رہی ہے...' : 'Submitting Complaint...') : (isUrdu ? 'شکایت جمع کروائیں اور ٹریکنگ آئی ڈی حاصل کریں' : 'Submit Complaint & Generate Tracking ID')}</span>
                </button>

              </form>
            )}

          </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === 'track' && (
          <div className="bg-[#F7F9F7] rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8">
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="text-xs font-bold text-[#123B28] block mb-1">
                    {isUrdu ? 'ٹریکنگ آئی ڈی درج کریں *' : 'Enter Complaint Tracking ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PP203-CMP-2026-7841"
                    value={trackIdInput}
                    onChange={(e) => setTrackIdInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                  />
                </div>

                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="submit"
                    disabled={isTracking}
                    className="w-full py-3 rounded-xl bg-[#123B28] hover:bg-[#087A43] text-[#C9A227] font-bold text-xs sm:text-sm border border-[#C9A227]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-4 h-4 text-[#C9A227]" />
                    <span>{isTracking ? (isUrdu ? 'تلاش جاری ہے...' : 'Searching...') : (isUrdu ? 'ریکارڈ دیکھیں' : 'Track Record')}</span>
                  </button>
                </div>
              </div>

              {/* Sample IDs Quick Fill hint */}
              <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                <span>{isUrdu ? 'تجربہ کے لیے سیمپل آئی ڈیز پر کلک کریں:' : 'Demo Tracking IDs for testing:'}</span>
                {['PP203-CMP-2026-7841', 'PP203-CMP-2026-9214', 'PP203-CMP-2026-4482'].map(demoId => (
                  <button
                    key={demoId}
                    type="button"
                    onClick={() => { setTrackIdInput(demoId); }}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-300 hover:border-[#087A43] text-[#087A43] font-bold cursor-pointer"
                  >
                    {demoId}
                  </button>
                ))}
              </div>
            </form>

            {trackingError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackedComplaint && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {isUrdu ? 'ٹریکنگ ریفرنس' : 'Tracking Reference'}
                    </span>
                    <span className="text-xl font-mono font-black text-[#087A43]">
                      {trackedComplaint.trackingId}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-500 block">{isUrdu ? 'درج کروانے کی تاریخ' : 'Date Submitted'}</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(trackedComplaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Visual Status Progress Stepper */}
                <div className="py-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {isUrdu ? 'شکایت کا موجودہ مرحلہ' : 'Complaint Processing Status'}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { key: 'Received', labelEn: 'Received', labelUr: 'موصول' },
                      { key: 'Under Review', labelEn: 'Under Review', labelUr: 'زیرِ جائزہ' },
                      { key: 'Referred to Department', labelEn: 'Referred', labelUr: 'متعلقہ محکمہ' },
                      { key: 'Resolved', labelEn: 'Resolved', labelUr: 'حل شدہ' },
                      { key: 'Closed', labelEn: 'Closed', labelUr: 'فائل بند' }
                    ].map((step, idx) => {
                      const currentIdx = getStatusStepperIndex(trackedComplaint.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div 
                          key={step.key}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-[#087A43] text-white border-[#087A43] shadow-md font-bold'
                              : isCompleted
                              ? 'bg-emerald-50 text-[#087A43] border-emerald-200 font-semibold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <span className="text-[11px] block">{isUrdu ? step.labelUr : step.labelEn}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 block font-medium">{isUrdu ? 'شہری کی معلومات (محفوظ)' : 'Citizen (Protected)'}</span>
                    <span className="font-bold text-slate-800 text-sm block">{trackedComplaint.citizenName}</span>
                    <span className="text-slate-500 block">{trackedComplaint.area}, {trackedComplaint.tehsil}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 block font-medium">{isUrdu ? 'مسئلے کی نوعیت' : 'Category'}</span>
                    <span className="font-bold text-[#087A43] text-sm block">{trackedComplaint.category}</span>
                    <span className="text-slate-500 block">Tehsil Chichawatni (PP-203)</span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">{isUrdu ? 'مسئلے کی تفصیل:' : 'Complaint Details:'}</span>
                  {trackedComplaint.description}
                </div>

                {/* Official Action & Remarks */}
                <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#123B28]">
                    <Building className="w-4 h-4 text-[#087A43]" />
                    <span>{isUrdu ? 'چوہدری اسد حنیف جٹ سیکرٹریٹ کی کارروائی:' : 'Official Action by MPA Secretariat:'}</span>
                  </div>

                  {trackedComplaint.departmentReferred && (
                    <div className="text-xs text-slate-700">
                      <strong>{isUrdu ? 'متعلقہ محکمہ:' : 'Department Assigned:'}</strong> {trackedComplaint.departmentReferred}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {trackedComplaint.adminRemarks || (isUrdu ? 'شکایت پر کارروائی جاری ہے۔' : 'Action in progress by constituent service staff.')}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
