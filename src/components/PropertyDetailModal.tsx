import React, { useState } from 'react';
import { Property } from '../types/property';
import { X, ShieldCheck, Video, Phone, MessageSquare, MapPin, IndianRupee, Calculator, Check, Building2, Calendar, Compass, Share2 } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenVideoTour: (property: Property) => void;
  onOpenEnquiry: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  isCompared: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenVideoTour,
  onOpenEnquiry,
  onToggleCompare,
  isCompared,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // EMI Calculator state
  const initialLoan = property ? Math.round(property.priceNumeric * 0.8) : 5000000;
  const [loanAmount, setLoanAmount] = useState(initialLoan);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  if (!property) return null;

  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const calculatedEMI = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  ) || 0;

  const currentImage = property.galleryImages[activeImageIndex] || property.coverImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md">
              {property.id}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-stone-900">{property.locality}</span>
              <span className="text-stone-300">·</span>
              <span>{property.subArea || 'Surat Prime'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(property)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                isCompared
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto grow space-y-8">
          {/* Main Hero Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {property.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Surat Verified Title & RERA
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-500">
                  {property.intent} · {property.propertyType}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                {property.title}
              </h2>
            </div>

            <div className="text-left lg:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display tabular-nums">
                {property.priceDisplay}
              </div>
              <div className="text-xs text-stone-500 font-medium tabular-nums">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft · Carpet: {property.carpetAreaSqFt} sq.ft
              </div>
            </div>
          </div>

          {/* Media & Gallery Area */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 bg-stone-900 rounded-2xl overflow-hidden group">
              <img
                src={currentImage}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {property.hasVideoTour && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => onOpenVideoTour(property)}
                    className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer text-sm"
                  >
                    <Video className="w-5 h-5" />
                    <span>Watch HD Video Tour Walkthrough ({property.videoDurationSec}s)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {property.galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1">Configuration</span>
              <span className="text-sm font-bold text-stone-900">
                {property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.propertyType}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1">Carpet Area</span>
              <span className="text-sm font-bold text-stone-900 tabular-nums">
                {property.carpetAreaSqFt} sq.ft ({property.superBuiltupSqFt} Super)
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1">Possession</span>
              <span className="text-sm font-bold text-stone-900">
                {property.possessionStatus}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block mb-1">Facing & Floor</span>
              <span className="text-sm font-bold text-stone-900">
                {property.facing || 'East'} · {property.floorNumber ? `Floor ${property.floorNumber}/${property.totalFloors}` : 'Ground'}
              </span>
            </div>
          </div>

          {/* RERA and Legal Status */}
          {property.reraId && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Gujarat RERA Registered</h4>
                  <p className="text-xs font-mono text-emerald-800 tabular-nums mt-0.5">{property.reraId}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                Title Deed Verified by Legal Cell
              </span>
            </div>
          )}

          {/* Description & Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-bold text-stone-900 mb-2.5">About This Property</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {property.description}
              </p>

              <h4 className="text-sm font-bold text-stone-900 mt-6 mb-3">Project Amenities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-stone-700">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locality Insights & Nearby Landmarks */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-stone-900">Surat Locality Insights</h3>
                <span className="text-xs font-semibold text-amber-700">{property.locality} Hub</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="font-bold text-stone-800 block mb-1">Top Schools Nearby</span>
                  <div className="text-stone-600 space-y-0.5">
                    {property.nearbyLandmarks.schools.map((s, i) => (
                      <p key={i}>• {s}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-stone-800 block mb-1">Hospitals & Healthcare</span>
                  <div className="text-stone-600 space-y-0.5">
                    {property.nearbyLandmarks.hospitals.map((h, i) => (
                      <p key={i}>• {h}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-stone-800 block mb-1">Transit & Connectivity</span>
                  <div className="text-stone-600 space-y-0.5">
                    {property.nearbyLandmarks.transit.map((t, i) => (
                      <p key={i}>• {t}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive EMI Calculator */}
          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/80">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-stone-900">
                Home Loan EMI Calculator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Loan Amount (80% Default)
                </label>
                <div className="text-sm font-bold text-stone-900 mb-2 tabular-nums">
                  ₹{(loanAmount / 100000).toFixed(1)} Lakhs
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={property.priceNumeric}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Interest Rate (% p.a.)
                </label>
                <div className="text-sm font-bold text-stone-900 mb-2 tabular-nums">
                  {interestRate}%
                </div>
                <input
                  type="range"
                  min={7.0}
                  max={12.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  Tenure (Years)
                </label>
                <div className="text-sm font-bold text-stone-900 mb-2 tabular-nums">
                  {tenureYears} Years
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between">
              <span className="text-xs text-stone-600">Estimated Monthly Installment:</span>
              <span className="text-xl font-extrabold text-amber-900 tabular-nums font-display">
                ₹{calculatedEMI.toLocaleString('en-IN')} / month
              </span>
            </div>
          </div>

          {/* Hardik Hingu Direct Sales Contact & Google Form Trigger */}
          <div className="bg-stone-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-400">Exclusive Surat Sales Advisor</span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-300">HomeVanta Certified</span>
              </div>
              <h4 className="text-xl font-black font-display text-white">
                Hardik Hingu — 8879719844
              </h4>
              <p className="text-xs text-stone-400 mt-1 max-w-lg">
                Connect directly for private negotiations, floor plans, physical site visit arrangements, and fast paperwork.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onOpenEnquiry(property)}
                className="w-full sm:w-auto px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                Inquire via Google Form
              </button>

              <a
                href="tel:+918879719844"
                className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-stone-100 text-stone-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Call 8879719844</span>
              </a>

              <a
                href={`https://wa.me/918879719844?text=Hi%20Hardik%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(${property.locality})%20on%20HomeVanta.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
