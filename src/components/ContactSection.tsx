import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Calendar,
  Building
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sendContactMessage } from '../services/firestoreService';
import { LeaderProfile, SiteSettings } from '../types';

interface ContactSectionProps {
  profile: LeaderProfile;
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, settings }) => {
  const { isUrdu } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage(isUrdu ? 'براہِ کرم تمام لازمی خانے پُر کریں۔' : 'Please fill all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Contact error:', err);
      setErrorMessage(isUrdu ? 'پیغام بھیجنے میں مسئلہ پیش آیا۔' : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'عوامی سیکرٹریٹ' : 'Constituency Secretariat'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'دفتر چوہدری اسد حنیف جٹ سے رابطہ' : 'Contact Office & Secretariat'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'ملاقات کا وقت طے کرنے یا حلقہ پی پی 203 کے امور پر رابطہ کے لیے تشریف لائیں یا آن لائن پیغام ارسال کریں۔' 
              : 'Visit the public secretariat in Chichawatni or transmit a direct message to the administrative staff.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Office Information Cards & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#123B28] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#C9A227]/30 space-y-6">
              <h3 className="text-xl font-bold text-[#C9A227] flex items-center gap-2 border-b border-emerald-800 pb-4">
                <Building className="w-5 h-5 text-[#C9A227]" />
                <span>{isUrdu ? 'سیکرٹریٹ کی تفصیلات' : 'Secretariat Details'}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#087A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-emerald-300 block font-semibold text-xs">{isUrdu ? 'پتہ' : 'Office Location'}</span>
                    <span className="text-white leading-relaxed block mt-0.5">{isUrdu ? profile.officeAddressUrdu : profile.officeAddress}</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#087A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-emerald-300 block font-semibold text-xs">{isUrdu ? 'اوقاتِ کار' : 'Office Timings'}</span>
                    <span className="text-white block mt-0.5">{isUrdu ? profile.officeHoursUrdu : profile.officeHours}</span>
                    <span className="text-amber-300 text-xs block mt-1">{isUrdu ? 'کھلی کچہری: منگل اور جمعہ' : 'Public Darbar: Tuesdays & Fridays'}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#087A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-emerald-300 block font-semibold text-xs">{isUrdu ? 'فون / ہیلپ ڈیسک' : 'Official Phone / Helpdesk'}</span>
                    <span className="text-white font-mono block mt-0.5">{profile.officialPhone}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#087A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-emerald-300 block font-semibold text-xs">{isUrdu ? 'ای میل' : 'Official Email'}</span>
                    <span className="text-white font-mono block mt-0.5">{profile.officialEmail}</span>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-emerald-800">
                <span className="text-xs text-emerald-300 font-semibold block mb-2">{isUrdu ? 'آفیشل سوشل لنکس' : 'Official Social Channels'}</span>
                <div className="flex items-center gap-3">
                  <a 
                    href={settings.facebookUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-[#087A43] text-xs font-semibold text-white border border-emerald-700 transition-colors"
                  >
                    Facebook
                  </a>
                  <a 
                    href={settings.twitterUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-[#087A43] text-xs font-semibold text-white border border-emerald-700 transition-colors"
                  >
                    Twitter / X
                  </a>
                  <a 
                    href={settings.youtubeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-[#087A43] text-xs font-semibold text-white border border-emerald-700 transition-colors"
                  >
                    YouTube
                  </a>
                </div>
              </div>

            </div>

            {/* Interactive Location Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#123B28]">
                <span>{isUrdu ? 'گوگل میپس ریفرنس' : 'Chichawatni Map Reference'}</span>
                <span className="text-[#087A43] font-semibold">PP-203 Sahiwal</span>
              </div>
              <div className="w-full h-44 rounded-xl overflow-hidden relative bg-slate-200">
                <iframe
                  title="Chichawatni Location Map"
                  src="https://maps.google.com/maps?q=Chichawatni%20District%20Sahiwal%20Punjab&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {isUrdu ? 'مقام: گرینڈ ٹرنک روڈ (N-5) اور ریلوے روڈ جنکشن، چیچہ وطنی' : 'Strategic access via Grand Trunk Road N-5 & Railway Road junction, Chichawatni.'}
              </span>
            </div>

          </div>

          {/* Contact / Appointment Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#F7F9F7] rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
              
              <h3 className="text-xl font-bold text-[#123B28] mb-1">
                {isUrdu ? 'سیکرٹریٹ کو براہِ راست پیغام بھیجیں' : 'Send Direct Message to Secretariat'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {isUrdu ? 'ملاقات کی درخواست، تجاویز یا دفتری رابطے کے لیے فارم پُر کریں۔' : 'For scheduling appointments, media queries, or general constituent proposals.'}
              </p>

              {submitSuccess ? (
                <div className="text-center py-10 space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#087A43] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#123B28]">
                    {isUrdu ? 'پیغام کامیابی سے موصول ہو گیا ہے!' : 'Message Successfully Transmitted!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    {isUrdu 
                      ? 'چوہدری اسد حنیف جٹ کا دفتری عملہ جلد آپ کے دیے گئے نمبر پر رابطہ کرے گا۔' 
                      : 'The secretariat protocol desk will review your submission and contact you via your mobile number.'}
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2 rounded-xl bg-[#087A43] text-white text-xs font-bold"
                  >
                    {isUrdu ? 'ایک اور پیغام بھیجیں' : 'Send Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#123B28]">
                        {isUrdu ? 'پورا نام *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isUrdu ? 'مثال: چوہدری احمد' : 'e.g. Ahmad Khan'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#123B28]">
                        {isUrdu ? 'موبائل نمبر *' : 'Mobile Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-0000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#123B28]">
                        {isUrdu ? 'ای میل (اختیاری)' : 'Email Address (Optional)'}
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#123B28]">
                        {isUrdu ? 'پیغام کا موضوع *' : 'Subject of Inquiry *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isUrdu ? 'مثال: ملاقات کی درخواست' : 'e.g. Appointment Request'}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#123B28]">
                      {isUrdu ? 'پیغام کی تفصیل *' : 'Detailed Message *'}
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder={isUrdu ? 'اپنا پیغام یہاں لکھیں...' : 'Write your detailed message, constituent query, or delegation details...'}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087A43]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white font-bold text-sm shadow-md border border-[#C9A227]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? (isUrdu ? 'پیغام ارسال ہو رہا ہے...' : 'Transmitting Message...') : (isUrdu ? 'پیغام ارسال کریں' : 'Send Message to Office')}</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
