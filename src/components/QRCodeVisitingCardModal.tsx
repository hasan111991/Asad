import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Printer, 
  X, 
  CreditCard, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Copy,
  Building
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LeaderProfile, SiteSettings } from '../types';

interface QRCodeVisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LeaderProfile;
  settings: SiteSettings;
}

export const QRCodeVisitingCardModal: React.FC<QRCodeVisitingCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  settings
}) => {
  const { isUrdu } = useLanguage();
  const [qrType, setQrType] = useState<'website' | 'vcard' | 'complaint' | 'appointment'>('website');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const websiteUrl = window.location.origin;

  const getQRTargetText = () => {
    switch (qrType) {
      case 'complaint':
        return `${websiteUrl}/#portal`;
      case 'appointment':
        return `${websiteUrl}/#contact`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
TITLE:${profile.title}
ORG:Punjab Provincial Assembly; Pakistan Muslim League (N)
TEL;TYPE=WORK,VOICE:${profile.officialPhone}
EMAIL:${profile.officialEmail}
URL:${websiteUrl}
ADR;TYPE=WORK:;;${profile.officeAddress};Chichawatni;Punjab;;Pakistan
NOTE:Constituency PP-203 Chichawatni, District Sahiwal
END:VCARD`;
      case 'website':
      default:
        return websiteUrl;
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const text = getQRTargetText();

    // Generate high-resolution PNG Data URL
    QRCode.toDataURL(text, {
      width: 600,
      margin: 2,
      color: {
        dark: '#123B28',
        light: '#FFFFFF'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => console.error('QR generation error:', err));

    // Generate SVG string
    QRCode.toString(text, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#123B28',
        light: '#FFFFFF'
      }
    }).then(svg => {
      setQrSvgString(svg);
    }).catch(err => console.error('QR svg error:', err));
  }, [qrType, isOpen]);

  if (!isOpen) return null;

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `Ch-Asad-Hanif-${qrType}-QR.png`;
    link.click();
  };

  const downloadSVG = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ch-Asad-Hanif-${qrType}-QR.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#123B28] text-white px-6 py-4 flex items-center justify-between border-b border-[#C9A227]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087A43] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Official QR Code & Visiting Card Generator
              </h3>
              <p className="text-xs text-emerald-200">
                Generate high-resolution vector QR codes and printable visiting cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Cards</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F7F9F7] space-y-8">
          
          {/* Target Type Switcher */}
          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1">
              {[
                { id: 'website', label: 'Official Website' },
                { id: 'vcard', label: 'Digital vCard (Contact)' },
                { id: 'complaint', label: 'Complaint Portal' },
                { id: 'appointment', label: 'Appointment Booking' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setQrType(item.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    qrType === item.id
                      ? 'bg-[#087A43] text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code and Quick Downloads */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            
            {/* QR Canvas */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-900/10 shadow-lg">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Official QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-300">
                    Generating...
                  </div>
                )}
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 mt-2">
                Target: {qrType.toUpperCase()}
              </span>
            </div>

            {/* Action Tools */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#087A43] uppercase tracking-wider block mb-1">
                  High-Resolution Vector Export
                </span>
                <h4 className="text-xl font-black text-[#123B28]">
                  Print-Ready Vector & Raster QR Codes
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Suitable for printing on stationery, visiting cards, constituency flex banners, public service brochures, and office notices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={downloadPNG}
                  className="px-5 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res PNG (600 DPI)</span>
                </button>

                <button
                  onClick={downloadSVG}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Scalable SVG</span>
                </button>
              </div>
            </div>

          </div>

          {/* OFFICIAL VISITING CARD PREVIEW (FRONT & BACK) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-[#123B28]">
                  Official Visiting Card Layout (Front & Back)
                </h4>
                <p className="text-xs text-slate-500">
                  Standard 3.5" × 2" ratio format designed for official representative protocol
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD FRONT */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#123B28] via-[#0b281b] to-[#123B28] text-white p-6 aspect-[1.75/1] flex flex-col justify-between shadow-xl border-2 border-[#C9A227]/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full green-gradient-bg border-2 border-[#C9A227] flex items-center justify-center text-[10px] font-black text-[#C9A227]">
                      PML-N
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold block">
                        Pakistan Muslim League (N)
                      </span>
                      <span className="text-[9px] text-emerald-200">Provincial Assembly of Punjab</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#C9A227] font-bold">PP-203</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Chaudhry Asad Hanif Jutt
                  </h3>
                  <p className="text-xs text-[#C9A227] font-semibold">
                    Member of Provincial Assembly, Punjab
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    Constituency PP-203, Chichawatni (District Sahiwal)
                  </p>
                </div>

                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[9px] text-emerald-300">
                  <span>Secretariat: Railway Road, Chichawatni</span>
                  <span>chasadhanif.pk</span>
                </div>
              </div>

              {/* CARD BACK */}
              <div className="relative rounded-2xl overflow-hidden bg-white text-slate-800 p-6 aspect-[1.75/1] flex items-center justify-between shadow-xl border-2 border-slate-200">
                <div className="space-y-2.5 max-w-[55%] text-left rtl:text-right">
                  <div>
                    <span className="text-[9px] font-bold text-[#087A43] uppercase tracking-wider block">
                      Constituency Secretariat
                    </span>
                    <h4 className="text-xs font-black text-[#123B28]">Chichawatni, District Sahiwal</h4>
                  </div>

                  <div className="space-y-1 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#087A43] shrink-0" />
                      <span className="truncate">{profile.officialPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#087A43] shrink-0" />
                      <span className="truncate">{profile.officialEmail}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#087A43] shrink-0" />
                      <span className="font-bold text-[#087A43]">chasadhanif.pk</span>
                    </div>
                  </div>

                  <span className="text-[8px] text-slate-400 block pt-1">
                    Scan QR code for direct digital portal & grievance submission.
                  </span>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 p-1.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="Visiting card QR code"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
