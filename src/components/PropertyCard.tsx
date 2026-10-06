import React from 'react';
import { Property } from '../types/property';
import { ShieldCheck, Video, Phone, Check, Scale, Eye, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
  onOpenVideoTour: (property: Property) => void;
  onOpenEnquiry: (property: Property) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  onOpenVideoTour,
  onOpenEnquiry,
  isCompared,
  onToggleCompare,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Media Container with 4:3 aspect ratio */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        {/* Cover image with fallback */}
        <img
          src={property.coverImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          onError={(e) => {
            // High-aesthetic fallback container
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add(
                'bg-gradient-to-br',
                'from-stone-800',
                'to-stone-900',
                'flex',
                'items-center',
                'justify-center'
              );
            }
          }}
        />

        {/* Top Badges Bar: Verified Badge & Video Tour Button */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {property.isVerified ? (
            <div className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/90 text-white backdrop-blur-md rounded-md text-[11px] font-semibold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Title & RERA</span>
            </div>
          ) : <div />}

          {property.hasVideoTour && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideoTour(property);
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white backdrop-blur-md rounded-md text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Tour</span>
            </button>
          )}
        </div>

        {/* Compare Checkbox Button on bottom-right of image */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isCompared
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-stone-800 hover:bg-white'
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Compared</span>
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5 text-stone-500" />
                <span>Compare</span>
              </>
            )}
          </button>
        </div>

        {/* Listing Intent Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-md">
            {property.intent} · {property.propertyType}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col grow justify-between">
        <div>
          {/* Price & Area Highlight */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-display tabular-nums">
              {property.priceDisplay}
            </span>
            <span className="text-xs text-stone-500 font-medium tabular-nums">
              ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-base font-bold text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer mb-1.5"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
            <span className="font-semibold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600 inline" />
              {property.locality}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{property.carpetAreaSqFt} sq.ft carpet</span>
            {property.bedrooms > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{property.bedrooms} BHK</span>
              </>
            )}
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenEnquiry(property)}
            className="flex-1 py-2 px-3 bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
          >
            Enquiry / Google Form
          </button>

          <a
            href="tel:+918879719844"
            className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Call Hardik Hingu: 8879719844"
          >
            <Phone className="w-3 h-3 text-emerald-400 fill-current" />
            <span className="hidden sm:inline">Call Hardik</span>
          </a>

          <button
            onClick={() => onSelectProperty(property)}
            className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="View Full Specifications"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
