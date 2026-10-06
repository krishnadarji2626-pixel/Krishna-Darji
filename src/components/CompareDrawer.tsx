import React from 'react';
import { Property } from '../types/property';
import { X, Scale, Trash2, Check, Phone, ShieldCheck } from 'lucide-react';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onOpenEnquiry: (property: Property) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  comparedProperties,
  onRemoveProperty,
  onOpenEnquiry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 font-display">
                Compare Surat Properties
              </h2>
              <p className="text-xs text-stone-500">
                Comparing {comparedProperties.length} of 3 properties side by side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6 overflow-x-auto grow">
          {comparedProperties.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-3">
              <Scale className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-medium">No properties selected for comparison yet.</p>
              <p className="text-xs text-stone-400">
                Click "Compare" on any property card to view specs side-by-side.
              </p>
            </div>
          ) : (
            <div className="min-w-[680px]">
              {/* Properties Grid Header */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-stone-200">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider self-end">
                  Feature / Specification
                </div>

                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="relative space-y-2">
                    <button
                      onClick={() => onRemoveProperty(prop.id)}
                      className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-md transition-colors shadow-2xs cursor-pointer z-10"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                      <img
                        src={prop.coverImage}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1" title={prop.title}>
                      {prop.title}
                    </h4>

                    <div className="text-base font-extrabold text-stone-900 font-display tabular-nums">
                      {prop.priceDisplay}
                    </div>

                    <div className="flex gap-1 pt-1">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenEnquiry(prop);
                        }}
                        className="flex-1 py-1.5 px-2 bg-violet-700 hover:bg-violet-800 text-white rounded text-[11px] font-bold cursor-pointer"
                      >
                        Enquire
                      </button>
                      <a
                        href="tel:+918879719844"
                        className="p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded flex items-center justify-center cursor-pointer"
                        title="Call Hardik Hingu"
                      >
                        <Phone className="w-3 h-3 text-emerald-400 fill-current" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row Specs */}
              <div className="divide-y divide-stone-100 text-xs">
                {/* Locality */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Surat Locality</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="font-bold text-stone-900">{p.locality}</span>
                  ))}
                </div>

                {/* Price / sq.ft */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Price per sq.ft</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="font-mono text-stone-800 tabular-nums">
                      ₹{p.pricePerSqFt.toLocaleString('en-IN')}
                    </span>
                  ))}
                </div>

                {/* Carpet Area */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Carpet Area</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="font-bold text-stone-800 tabular-nums">
                      {p.carpetAreaSqFt} sq.ft
                    </span>
                  ))}
                </div>

                {/* Bedrooms & Baths */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Configuration</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="text-stone-800">
                      {p.bedrooms > 0 ? `${p.bedrooms} BHK / ${p.bathrooms} Bath` : p.propertyType}
                    </span>
                  ))}
                </div>

                {/* Possession */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Possession Status</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="text-stone-800">{p.possessionStatus}</span>
                  ))}
                </div>

                {/* RERA Certified */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">RERA Verified</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{p.reraId ? 'Verified' : 'In Review'}</span>
                    </div>
                  ))}
                </div>

                {/* Video Tour */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Video Tour</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="text-stone-800">
                      {p.hasVideoTour ? 'Available (HD 4K)' : 'Photos Only'}
                    </span>
                  ))}
                </div>

                {/* Amenities Count */}
                <div className="grid grid-cols-4 gap-4 py-3">
                  <span className="font-semibold text-stone-600">Amenities Count</span>
                  {comparedProperties.map((p) => (
                    <span key={p.id} className="text-stone-800">
                      {p.amenities.length} Verified Amenities
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
