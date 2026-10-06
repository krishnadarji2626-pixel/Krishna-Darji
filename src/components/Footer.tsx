import React from 'react';
import { Building2, Phone, MessageSquare, FileSpreadsheet } from 'lucide-react';

interface FooterProps {
  onSelectLocality: (locality: string) => void;
  onOpenAdmin: () => void;
  onOpenSpecDoc: () => void;
  onOpenPostProperty: () => void;
  onOpenSmartMatch: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectLocality,
  onOpenAdmin,
  onOpenSpecDoc,
  onOpenPostProperty,
  onOpenSmartMatch,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Contact to Hardik Hingu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-display tracking-tight">
                HomeVanta
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Surat’s premier verified property ecosystem. Connecting discerning homebuyers, investors, and developers with 100% title-cleared real estate.
            </p>

            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Sales Advisor & Buying/Selling Enquiries
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:+918879719844"
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-stone-700 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Call Hardik: 8879719844</span>
                </a>

                <a
                  href="https://wa.me/918879719844?text=Hello%20Hardik%2C%20I%20have%20an%20enquiry%20regarding%20Surat%20property%20on%20HomeVanta.com."
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Surat Localities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Surat Micro-Markets
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Vesu', 'Pal', 'Adajan', 'VIP Road', 'Althan', 'Piplod', 'Citylight', 'Katargam'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => onSelectLocality(loc)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {loc} Properties
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform Features
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <button
                  onClick={onOpenPostProperty}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Post Property for Free (Sellers)
                </button>
              </div>
              <div>
                <button
                  onClick={onOpenSmartMatch}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Surat Smart Property Matcher
                </button>
              </div>
              <div>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Admin CRM & Excel Leads</span>
                </button>
              </div>
              <div>
                <button
                  onClick={onOpenSpecDoc}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Full Technical & Business Specification
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 HomeVanta.com. All Rights Reserved. Exclusively serving Surat real estate.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSpecDoc} className="hover:text-stone-300 transition-colors cursor-pointer">
              Website Specification
            </button>
            <span className="text-stone-700">·</span>
            <button onClick={onOpenAdmin} className="hover:text-stone-300 transition-colors cursor-pointer">
              Admin Excel Dashboard
            </button>
            <span className="text-stone-700">·</span>
            <a href="tel:+918879719844" className="text-stone-400 hover:text-white">
              Contact Hardik Hingu
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
