import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Search, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';

interface WhatsAppButtonProps {
  settings: SiteSettings;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings }) => {
  const { isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [trackingIdInput, setTrackingIdInput] = useState<string>('');

  if (!settings.whatsappEnabled) return null;

  // Clean WhatsApp phone number (strip spaces, dashes, plus)
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '') || '923000000000';

  const templates = [
    {
      id: 'general',
      labelEn: 'General Secretariat Inquiry',
      labelUr: 'عام دفتری معلومات',
      text: settings.whatsappDefaultMessage || 'Assalam-o-Alaikum, I am contacting Chaudhry Asad Hanif Jutt (MPA PP-203 Chichawatni) Secretariat.'
    },
    {
      id: 'complaint',
      labelEn: 'Track Existing Complaint',
      labelUr: 'درج شدہ شکایت کا فالو اپ',
      text: trackingIdInput.trim() 
        ? `Assalam-o-Alaikum, I want to inquire about the status of my complaint with Tracking ID: ${trackingIdInput.trim()} at the Chichawatni Secretariat.`
        : 'Assalam-o-Alaikum, I would like to inquire about my complaint status with MPA Chaudhry Asad Hanif Jutt Secretariat.'
    },
    {
      id: 'appointment',
      labelEn: 'Schedule Appointment',
      labelUr: 'ملاقات کا وقت لینا',
      text: settings.whatsappAppointmentTemplate || 'Assalam-o-Alaikum, I would like to request an appointment with MPA Chaudhry Asad Hanif Jutt at the Chichawatni Secretariat.'
    },
    {
      id: 'emergency',
      labelEn: 'Urgent Constituency Issue',
      labelUr: 'حلقے کا ہنگامی مسئلہ',
      text: 'Assalam-o-Alaikum, I am reporting an urgent civic issue in PP-203 Chichawatni (Roads/Water/Electricity/Health).'
    }
  ];

  const handleLaunchWhatsApp = () => {
    let finalMessage = customMessage.trim();
    if (!finalMessage) {
      const tmpl = templates.find(t => t.id === selectedTemplate);
      finalMessage = tmpl ? tmpl.text : templates[0].text;
    }

    const encoded = encodeURIComponent(finalMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none cursor-pointer"
          aria-label="Official WhatsApp Support"
          title="Contact Secretariat on WhatsApp"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-800 border-2 border-white"></span>
          </span>

          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Floating Popup Launcher */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 rtl:right-auto rtl:left-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200 animate-fadeIn">
          
          {/* Header */}
          <div className="bg-[#123B28] text-white p-4 flex items-center justify-between border-b border-[#C9A227]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'آفیشل واٹس ایپ ہیلپ ڈیسک' : 'Official Secretariat WhatsApp'}
                </h4>
                <span className="text-[11px] text-[#C9A227] block font-medium">
                  {isUrdu ? 'چوہدری اسد حنیف جٹ • پی پی 203' : 'Chaudhry Asad Hanif Jutt • PP-203'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F7F9F7]">
            <p className="text-xs text-slate-600">
              {isUrdu 
                ? 'واٹس ایپ کے ذریعے براہِ راست رابطہ کے لیے مطلوبہ کیٹیگری منتخب کریں:' 
                : 'Select an official inquiry template or write your custom message:'}
            </p>

            {/* Template Selector */}
            <div className="grid grid-cols-1 gap-1.5">
              {templates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setCustomMessage('');
                  }}
                  className={`text-left rtl:text-right px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedTemplate === tmpl.id
                      ? 'bg-emerald-50 text-[#087A43] border-[#087A43] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isUrdu ? tmpl.labelUr : tmpl.labelEn}
                </button>
              ))}
            </div>

            {/* Optional Tracking ID input if complaint template selected */}
            {selectedTemplate === 'complaint' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">
                  {isUrdu ? 'شکایت کی ٹریکنگ آئی ڈی (اختیاری):' : 'Enter Complaint Tracking ID (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. PP203-CMP-2026-7841"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono uppercase focus:ring-2 focus:ring-[#087A43] focus:outline-none"
                />
              </div>
            )}

            {/* Custom message box */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">
                {isUrdu ? 'پیغام کی تفصیل (ایڈٹ کریں):' : 'Message Preview:'}
              </label>
              <textarea
                rows={3}
                value={customMessage || (templates.find(t => t.id === selectedTemplate)?.text || '')}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#087A43] focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 leading-tight">
              {isUrdu 
                ? 'واٹس ایپ پر بھیجے گئے پیغامات دفتری اوقات میں پروٹوکول ڈیسک کے زیرِ نگرانی دیکھے جاتے ہیں۔' 
                : 'WhatsApp communication is monitored during official office hours by secretariat protocol staff.'}
            </p>

            {/* Send Button */}
            <button
              onClick={handleLaunchWhatsApp}
              className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'واٹس ایپ پر چیٹ شروع کریں' : 'Start WhatsApp Chat'}</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};
