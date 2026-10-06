import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, IndianRupee, Phone, MessageSquare, ShieldCheck, Video, Sparkles, Image, Check } from 'lucide-react';
import { ListingIntent, PropertyType } from '../types/property';

interface HeroSectionProps {
  activeIntent: ListingIntent | 'all';
  setActiveIntent: (intent: ListingIntent | 'all') => void;
  selectedLocality: string;
  setSelectedLocality: (locality: string) => void;
  selectedType: PropertyType | 'all';
  setSelectedType: (type: PropertyType | 'all') => void;
  selectedBudget: string;
  setSelectedBudget: (budget: string) => void;
  onSearch: () => void;
  onOpenSmartMatch: () => void;
  onOpenPostProperty: () => void;
}

const BACKGROUND_OPTIONS = [
  {
    id: 'vesu-luxury',
    name: 'Vesu High-Rise & Pool (Default)',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'pal-bungalow',
    name: 'Pal Luxury Villa & Private Lawn',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'tapi-skyline',
    name: 'Tapi Riverfront Evening View',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'vip-road-penthouse',
    name: 'VIP Road Modern Penthouse',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeIntent,
  setActiveIntent,
  selectedLocality,
  setSelectedLocality,
  selectedType,
  setSelectedType,
  selectedBudget,
  setSelectedBudget,
  onSearch,
  onOpenSmartMatch,
  onOpenPostProperty,
}) => {
  const [bgImageIndex, setBgImageIndex] = useState(() => {
    const saved = localStorage.getItem('homevanta_hero_bg_index');
    return saved !== null ? Number(saved) : 0;
  });
  const [customBgUrl, setCustomBgUrl] = useState(() => {
    return localStorage.getItem('homevanta_custom_bg_url') || '';
  });
  const [showBgSelector, setShowBgSelector] = useState(false);

  useEffect(() => {
    localStorage.setItem('homevanta_hero_bg_index', String(bgImageIndex));
  }, [bgImageIndex]);

  useEffect(() => {
    if (customBgUrl) {
      localStorage.setItem('homevanta_custom_bg_url', customBgUrl);
    }
  }, [customBgUrl]);

  const activeBg = customBgUrl.trim()
    ? customBgUrl.trim()
    : BACKGROUND_OPTIONS[bgImageIndex]?.url || BACKGROUND_OPTIONS[0].url;

  return (
    <section className="relative min-h-[580px] pt-12 pb-20 border-b border-stone-200 overflow-hidden flex flex-col justify-center">
      {/* Background Property Image with Smooth Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={activeBg}
          alt="Surat Luxury Real Estate Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-102 transition-all duration-700 ease-out"
          onError={(e) => {
            // High-aesthetic gradient fallback if URL fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Measured Contrast Scrim: darker at top/bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/70 to-stone-950/90 backdrop-blur-[1px]" />
      </div>

      {/* Floating Background Image Switcher in Top Right corner of Hero */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowBgSelector(!showBgSelector)}
            className="px-3 py-1.5 bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 text-stone-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Change background property photo"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Background Image</span>
          </button>

          {showBgSelector && (
            <div className="absolute right-0 top-10 w-72 bg-stone-900/95 backdrop-blur-md border border-stone-700 rounded-2xl p-3 shadow-2xl text-xs space-y-2.5 z-30">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 text-stone-300 font-bold">
                <span>Select Property Background</span>
                <button
                  onClick={() => setShowBgSelector(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                {BACKGROUND_OPTIONS.map((bg, idx) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setBgImageIndex(idx);
                      setCustomBgUrl('');
                      setShowBgSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      !customBgUrl && bgImageIndex === idx
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{bg.name}</span>
                    {!customBgUrl && bgImageIndex === idx && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800 space-y-1.5">
                <label className="text-[11px] text-stone-400 font-medium block">
                  Or Paste Custom Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/property.jpg"
                  value={customBgUrl}
                  onChange={(e) => setCustomBgUrl(e.target.value)}
                  className="w-full h-8 px-2.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white outline-none focus:border-amber-500"
                />
                {customBgUrl && (
                  <button
                    onClick={() => {
                      setCustomBgUrl('');
                      localStorage.removeItem('homevanta_custom_bg_url');
                    }}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Reset to default image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content on Top of Background */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Main Headline & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-400/40 rounded-full text-xs font-bold text-amber-300 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Surat’s Verified Property Network & Exclusive Listings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-display mb-4 text-balance drop-shadow-md">
            Find Your Perfect Property in Surat.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-200 max-w-2xl mx-auto font-normal drop-shadow-xs leading-relaxed">
            Direct access to verified apartments, luxury bungalows, and high-yield commercial spaces across Vesu, Pal, Adajan, and VIP Road. No fake listings.
          </p>
        </div>

        {/* Intent Switcher: Buy | Rent | Sell | New Projects directly underneath */}
        <div className="max-w-4xl mx-auto mb-5 flex justify-center">
          <div className="inline-flex p-1.5 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl">
            {(['all', 'Buy', 'Rent', 'New Project'] as const).map((intent) => (
              <button
                key={intent}
                onClick={() => setActiveIntent(intent)}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeIntent === intent
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {intent === 'all' ? 'All Properties' : intent}
              </button>
            ))}

            <button
              onClick={onOpenPostProperty}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-100 transition-colors cursor-pointer rounded-xl hover:bg-white/10"
            >
              Sell Property →
            </button>
          </div>
        </div>

        {/* Search Bar Elevated Container */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            {/* Locality Selector */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Surat Locality</span>
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Surat Localities</option>
                <option value="Vesu">Vesu (Elite VIP Corridor)</option>
                <option value="Pal">Pal (Villas & Riverfront)</option>
                <option value="Adajan">Adajan (Cultural Hub)</option>
                <option value="Althan">Althan (Fast Growth)</option>
                <option value="VIP Road">VIP Road (High Energy)</option>
                <option value="Piplod">Piplod (Malls & Dining)</option>
                <option value="Citylight">Citylight (Prime Legacy)</option>
                <option value="Katargam">Katargam (Diamond Belt)</option>
                <option value="Jahangirpura">Jahangirpura (Green & Quiet)</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>Property Type</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PropertyType | 'all')}
                className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Property Types</option>
                <option value="Apartment">Apartment (2 & 3 BHK)</option>
                <option value="Bungalow / Villa">Luxury Bungalow / Villa</option>
                <option value="Penthouse">Duplex Penthouse</option>
                <option value="Commercial">Commercial / Showroom</option>
              </select>
            </div>

            {/* Budget */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                <span>Budget Bracket</span>
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all cursor-pointer"
              >
                <option value="all">Any Budget</option>
                <option value="under50">Under ₹50 Lakhs</option>
                <option value="50to100">₹50 Lakhs – ₹1.0 Crore</option>
                <option value="100to200">₹1.0 Crore – ₹2.0 Crore</option>
                <option value="above200">Above ₹2.0 Crore</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={onSearch}
                className="w-full h-11 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-sm"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search Properties</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Helpers */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-800">Popular Searches:</span>
              <button
                onClick={() => { setSelectedLocality('Vesu'); onSearch(); }}
                className="hover:text-amber-800 hover:underline cursor-pointer"
              >
                3 BHK in Vesu
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => { setSelectedLocality('Pal'); setSelectedType('Bungalow / Villa'); onSearch(); }}
                className="hover:text-amber-800 hover:underline cursor-pointer"
              >
                Bungalows in Pal
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => { setSelectedLocality('VIP Road'); onSearch(); }}
                className="hover:text-amber-800 hover:underline cursor-pointer"
              >
                VIP Road High-Rise
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => { setSelectedLocality('Althan'); onSearch(); }}
                className="hover:text-amber-800 hover:underline cursor-pointer"
              >
                Althan Penthouses
              </button>
            </div>

            <button
              onClick={onOpenSmartMatch}
              className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Take Surat Smart Match Quiz →</span>
            </button>
          </div>
        </div>

        {/* Dedicated Sales Contact Highlight: Hardik Hingu — 8879719844 */}
        <div className="max-w-5xl mx-auto bg-stone-900/90 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-amber-600 text-white font-black flex items-center justify-center text-xl shrink-0 shadow-md">
              HH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Call for Property Buying & Selling: Hardik Hingu
                </h3>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  Surat Specialist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                Direct advisor for prime Surat investments, developer negotiations & legal title documentation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:+918879719844"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md whitespace-nowrap"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call 8879719844</span>
            </a>

            <a
              href="https://wa.me/918879719844?text=Hello%20Hardik%2C%20I%20am%20looking%20for%20property%20in%20Surat%20via%20HomeVanta.com.%20Please%20guide%20me."
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Pillar Highlights in Glassmorphic Cards */}
        <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
          <div className="flex items-start gap-3 p-4 bg-stone-900/70 backdrop-blur-md rounded-2xl border border-white/10 text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">100% RERA & Title Verified</h4>
              <p className="text-xs text-stone-300 leading-relaxed mt-0.5">No outdated or fake listings. Legal ownership audit performed before publishing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-stone-900/70 backdrop-blur-md rounded-2xl border border-white/10 text-white">
            <Video className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">HD Video & 360 Walkthroughs</h4>
              <p className="text-xs text-stone-300 leading-relaxed mt-0.5">Inspect room layouts, balcony views, and finishes from your screen before booking visits.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-stone-900/70 backdrop-blur-md rounded-2xl border border-white/10 text-white">
            <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Surat Locality Intelligence</h4>
              <p className="text-xs text-stone-300 leading-relaxed mt-0.5">Detailed distances to top schools, hospitals, BRTS lines, and upcoming Surat Metro hubs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
