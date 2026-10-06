import React, { useState } from 'react';
import { Building2, Phone, ShieldCheck, Sparkles, ArrowRight, User, Lock, CheckCircle2 } from 'lucide-react';
import { Enquiry } from '../types/property';

interface LoginScreenProps {
  isOpen: boolean;
  onLogin: (user: { name: string; mobile: string; intent?: string }) => void;
  onGuestContinue?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  isOpen,
  onLogin,
  onGuestContinue,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [intent, setIntent] = useState<'Buy' | 'Rent' | 'Sell' | 'New Project'>('Buy');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanMobile = mobile.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanMobile || cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    onLogin({
      name: cleanName,
      mobile: cleanMobile,
      intent: intent,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      {/* Background Architectural Watermark / Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-25 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="Surat Luxury Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-stone-950/70" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-600 via-stone-800 to-amber-600" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Brand & Welcome Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 mx-auto shadow-md mb-1">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <span className="text-2xl font-black text-stone-900 font-display tracking-tight">
                HomeVanta
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                SURAT
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
              Welcome to Surat's Verified Real Estate Portal
            </h2>

            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Please enter your name and contact number to access verified listings, video tours, and direct seller consultations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mobile Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs sm:text-sm font-semibold text-stone-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setMobile(onlyNums);
                    if (error) setError('');
                  }}
                  className="w-full h-11 pl-12 pr-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium tracking-wider focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all tabular-nums"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                We use your number to send verified property brochures and WhatsApp updates.
              </p>
            </div>

            {/* Requirement Interest */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Primary Goal in Surat
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'Buy', label: 'Buy' },
                  { key: 'Rent', label: 'Rent' },
                  { key: 'New Project', label: 'New Launch' },
                  { key: 'Sell', label: 'Sell / Post' }
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.key}
                    onClick={() => setIntent(opt.key as any)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      intent === opt.key
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg"
              >
                <span>Login & Explore Surat Properties</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              {onGuestContinue && (
                <button
                  type="button"
                  onClick={onGuestContinue}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors cursor-pointer"
                >
                  Skip for now, continue as guest →
                </button>
              )}
            </div>
          </form>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Gujarat RERA & Legal Title Verified properties</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Direct sales consultation with <strong>Hardik Hingu: 8879719844</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
