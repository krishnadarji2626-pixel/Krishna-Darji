import React, { useState } from 'react';
import { SURAT_LOCALITIES } from '../data/suratLocalities';
import { MapPin, TrendingUp, Building2, Check, ArrowRight, Compass } from 'lucide-react';
import { LocalityInfo } from '../types/property';

interface SuratLocalityExplorerProps {
  onSelectLocality: (localityName: string) => void;
}

export const SuratLocalityExplorer: React.FC<SuratLocalityExplorerProps> = ({
  onSelectLocality,
}) => {
  const [selectedLocality, setSelectedLocality] = useState<LocalityInfo>(SURAT_LOCALITIES[0]);

  return (
    <section className="py-14 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>Surat-First Real Estate Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
              Explore Surat Localities & Micro-Markets
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Compare average price per square foot, annual price appreciation, social infrastructure, and lifestyle amenities across Surat's top sectors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span>Market Data Updated: October 2026</span>
          </div>
        </div>

        {/* Interactive Locality Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {SURAT_LOCALITIES.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocality(loc)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                selectedLocality.id === loc.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Selected Locality Spotlight Bento Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {selectedLocality.name}
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                  {selectedLocality.priceGrowthYOY}
                </span>
              </div>

              <p className="text-sm font-medium text-amber-800">
                {selectedLocality.tagline}
              </p>

              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedLocality.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
                  Key Infrastructure & Advantages
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {selectedLocality.keyHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro-market Metrics & Action */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Surat Market Benchmarks
                </span>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">Average Price / Sq.ft</span>
                  <div className="text-2xl font-black text-stone-900 tabular-nums font-display">
                    ₹{selectedLocality.avgPricePerSqFt.toLocaleString('en-IN')}
                    <span className="text-xs font-medium text-stone-500 ml-1">/sq.ft</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">Active Verified Listings</span>
                  <div className="text-xl font-bold text-stone-900 tabular-nums">
                    {selectedLocality.activeListingsCount} Properties
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Surat Advisor Note</span>
                  Hardik Hingu personally verifies title clearances and builder timelines in {selectedLocality.name}.
                </div>
              </div>

              <button
                onClick={() => onSelectLocality(selectedLocality.name)}
                className="w-full mt-6 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>View {selectedLocality.name} Properties</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Grid of all Localities */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SURAT_LOCALITIES.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onSelectLocality(loc.name)}
              className="bg-white p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                  {loc.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {loc.priceGrowthYOY}
                </span>
              </div>
              <div className="text-xs text-stone-500 tabular-nums">
                ₹{loc.avgPricePerSqFt.toLocaleString('en-IN')}/sq.ft
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
