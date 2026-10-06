import React from 'react';
import { Phone, Building2, SlidersHorizontal, Scale, ShieldCheck, PlusCircle, User, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'all' | 'Buy' | 'Rent' | 'New Project' | 'localities';
  setActiveTab: (tab: 'all' | 'Buy' | 'Rent' | 'New Project' | 'localities') => void;
  onOpenCompare: () => void;
  compareCount: number;
  onOpenSmartMatch: () => void;
  onOpenPostProperty: () => void;
  onOpenAdmin: () => void;
  onOpenSpecDoc: () => void;
  currentUser?: { name: string; mobile: string } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCompare,
  compareCount,
  onOpenSmartMatch,
  onOpenPostProperty,
  onOpenAdmin,
  onOpenSpecDoc,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top emergency/direct sales notification banner */}
      <div className="bg-stone-900 text-stone-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-stone-200">Surat Premier Real Estate Portal</span>
            <span className="text-stone-400 hidden sm:inline">·</span>
            <span className="text-stone-300 hidden sm:inline">100% Title Verified Properties & Direct Builder Allocations</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSpecDoc}
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              View Full Platform Specification
            </button>
            <span className="text-stone-500">|</span>
            <a
              href="tel:+918879719844"
              className="flex items-center gap-1.5 text-stone-100 hover:text-emerald-400 transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hardik Hingu: 8879719844</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single clean text element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('all')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 group-hover:bg-stone-800 transition-colors shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900 font-display">
                HomeVanta
              </span>
              <span className="text-xs font-semibold text-amber-600 block leading-none">
                SURAT
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single line */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('Buy')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'Buy'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            Buy
          </button>

          <button
            onClick={() => setActiveTab('Rent')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'Rent'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            Rent
          </button>

          <button
            onClick={() => setActiveTab('New Project')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'New Project'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            New Projects
          </button>

          <button
            onClick={() => setActiveTab('localities')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'localities'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            Surat Localities
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('video-tours-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 hover:text-stone-900 transition-colors py-1 cursor-pointer text-stone-700"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Video Tours</span>
          </button>

          <button
            onClick={onOpenSmartMatch}
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors py-1 cursor-pointer text-stone-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Matcher</span>
          </button>

          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors py-1 relative cursor-pointer text-stone-700"
          >
            <Scale className="w-3.5 h-3.5 text-stone-500" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & User Profile */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-stone-100 border border-stone-200 rounded-xl text-xs">
              <div className="flex items-center gap-1 font-semibold text-stone-800">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
                title="Sign out / Switch user"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-amber-100/80 hover:bg-amber-200/80 rounded-lg transition-colors cursor-pointer border border-amber-200"
            >
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Login</span>
            </button>
          )}

          <button
            onClick={onOpenPostProperty}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Post Property</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title="Admin CRM & Excel Leads Database"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Admin CRM</span>
          </button>

          <a
            href="tel:+918879719844"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Call Hardik</span>
          </a>
        </div>
      </div>
    </header>
  );
};
