import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Navigation,
  ZoomIn,
  Building2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Project, ProjectCategory, ProjectStatus } from '../types';

interface ConstituencyMapProps {
  projects: Project[];
}

export const ConstituencyMap: React.FC<ConstituencyMapProps> = ({ projects }) => {
  const { isUrdu } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Default center: Chichawatni City (District Sahiwal)
  const defaultCenter: [number, number] = [30.5333, 72.7000];

  const categories = [
    { id: 'all', labelEn: 'All Sectors', labelUr: 'تمام شعبہ جات' },
    { id: 'Roads and Infrastructure', labelEn: 'Roads', labelUr: 'سڑکیں' },
    { id: 'Healthcare', labelEn: 'Healthcare', labelUr: 'صحت' },
    { id: 'Clean Drinking Water', labelEn: 'Water Plants', labelUr: 'پانی' },
    { id: 'Education', labelEn: 'Education', labelUr: 'تعلیم' },
    { id: 'Electricity', labelEn: 'Electricity', labelUr: 'بجلی' },
    { id: 'Sanitation', labelEn: 'Sanitation', labelUr: 'سیوریج' },
    { id: 'Public Facilities', labelEn: 'Public Facilities', labelUr: 'عوامی سہولیات' }
  ];

  const statuses = [
    { id: 'all', labelEn: 'All Statuses', labelUr: 'تمام مراحل' },
    { id: 'In Progress', labelEn: 'In Progress', labelUr: 'جاری ہے' },
    { id: 'Completed', labelEn: 'Completed', labelUr: 'مکمل شدہ' },
    { id: 'Approved', labelEn: 'Approved', labelUr: 'منظور شدہ' },
    { id: 'Proposed', labelEn: 'Proposed', labelUr: 'مجوزہ' }
  ];

  // Filter projects with coordinates
  const filteredProjects = projects.filter(p => {
    if (!p.latitude || !p.longitude) return false;
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredProjects.forEach(proj => {
      if (!proj.latitude || !proj.longitude) return;

      // Color based on status
      let pinColor = '#087A43'; // Completed
      if (proj.status === 'In Progress') pinColor = '#2563EB'; // Blue
      if (proj.status === 'Approved') pinColor = '#C9A227'; // Gold
      if (proj.status === 'Proposed') pinColor = '#64748B'; // Slate

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${pinColor}; 
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white;
            font-size: 13px;
            cursor: pointer;
            transform: translate(-14px, -14px);
          ">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([proj.latitude, proj.longitude], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 2px;">
          <strong style="color: #123B28; font-size: 13px; display: block; margin-bottom: 4px;">
            ${isUrdu ? proj.titleUrdu : proj.title}
          </strong>
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${pinColor}20; color: ${pinColor}; margin-bottom: 6px;">
            ${isUrdu ? proj.statusUrdu : proj.status}
          </span>
          <p style="color: #475569; margin: 4px 0; font-size: 11px; line-height: 1.4;">
            ${isUrdu ? proj.locationUrdu : proj.location}
          </p>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 6px; font-size: 10px; color: #64748b;">
            Budget: <strong style="color: #123B28;">${proj.budget}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setActiveProject(proj);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredProjects, isUrdu]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(defaultCenter, 12);
    }
  };

  return (
    <section className="py-16 bg-[#F7F9F7] border-b border-slate-200" id="map-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087A43] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {isUrdu ? 'جغرافیائی ترقیاتی نقشہ' : 'Geographic GIS Tracking'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B28] mt-3">
            {isUrdu ? 'حلقہ پی پی 203 ترقیاتی پروجیکٹ میپ' : 'PP-203 Constituency Development Map'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isUrdu 
              ? 'تحصیل چیچہ وطنی، نہری چکس اور دیہی علاقوں میں جاری و مکمل شدہ منصوبوں کی لائیو لوکیشن اور پیش رفت۔' 
              : 'Interactive OpenStreetMap pinpointing verified road networks, water filtration plants, and hospital upgrades across PP-203.'}
          </p>
        </div>

        {/* Map Container Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#087A43] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isUrdu ? c.labelUr : c.labelEn}
                </button>
              ))}
            </div>

            {/* Status & Recenter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 focus:outline-none"
              >
                {statuses.map(s => (
                  <option key={s.id} value={s.id}>{isUrdu ? s.labelUr : s.labelEn}</option>
                ))}
              </select>

              <button
                onClick={handleRecenter}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#123B28] text-[#C9A227] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                title="Recenter Map to Chichawatni"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'مرکز پر واپس' : 'Recenter'}</span>
              </button>
            </div>

          </div>

          {/* Map View & Active Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Map Canvas */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 relative min-h-[420px] shadow-inner">
              <div ref={mapContainerRef} className="w-full h-[450px] z-10"></div>
              
              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1">
                <span className="font-bold text-[#123B28] block mb-1">
                  {isUrdu ? 'نشانی رنگ:' : 'Status Legend:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#087A43]"></span>
                  <span>{isUrdu ? 'مکمل شدہ' : 'Completed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#2563EB]"></span>
                  <span>{isUrdu ? 'جاری ہے' : 'In Progress'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#C9A227]"></span>
                  <span>{isUrdu ? 'منظور شدہ' : 'Approved'}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Active Project Card */}
            <div className="lg:col-span-4 bg-[#F7F9F7] rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
              {activeProject ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={activeProject.imageUrl}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#123B28] text-white">
                        {isUrdu ? activeProject.categoryUrdu : activeProject.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#087A43]">
                      {isUrdu ? activeProject.statusUrdu : activeProject.status}
                    </span>
                    <h4 className="text-sm font-bold text-[#123B28] mt-1.5 leading-snug">
                      {isUrdu ? activeProject.titleUrdu : activeProject.title}
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                      {isUrdu ? activeProject.locationUrdu : activeProject.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {isUrdu ? activeProject.descriptionUrdu : activeProject.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'بجٹ تخمینہ:' : 'Budget:'}</span>
                      <strong className="text-[#087A43]">{activeProject.budget}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'نگران محکمہ:' : 'Department:'}</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">{isUrdu ? activeProject.departmentUrdu : activeProject.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'تکمیل:' : 'Completion:'}</span>
                      <span className="font-medium text-slate-700">{activeProject.completionDate}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center my-auto py-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#087A43] flex items-center justify-center mx-auto border border-emerald-200">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#123B28]">
                    {isUrdu ? 'نقشے پر کسی بھی مارکر پر کلک کریں' : 'Click Any Map Location Pin'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {isUrdu 
                      ? 'منصوبے کا بجٹ، تصویری جھلک اور پیش رفت کی تفصیلات دیکھنے کے لیے نقشے کے نشانات پر کلک کریں۔' 
                      : 'Select a project pin to inspect on-site progress, executing departments, and verified budgets in PP-203.'}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 text-center">
                <span className="text-[11px] text-slate-400">
                  {isUrdu ? 'حلقہ پی پی 203، چیچہ وطنی، ضلع ساہیوال' : 'PP-203 Chichawatni • OpenStreetMap GIS'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
