import React, { useState } from 'react';
import { Property } from '../types/property';
import { X, Sparkles, CheckCircle2, ArrowRight, Video, Phone, MapPin } from 'lucide-react';

interface SmartMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenEnquiry: (property: Property) => void;
}

export const SmartMatcherModal: React.FC<SmartMatcherModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  onOpenEnquiry,
}) => {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<'Buy' | 'Rent' | 'New Project'>('Buy');
  const [preferredLocality, setPreferredLocality] = useState('Vesu');
  const [budgetTier, setBudgetTier] = useState('mid'); // 'budget', 'mid', 'luxury', 'ultra'
  const [priority, setPriority] = useState('schools'); // 'schools', 'ready', 'bungalow', 'metro'
  const [matches, setMatches] = useState<Array<{ property: Property; score: number }>>([]);

  if (!isOpen) return null;

  const handleCalculateMatch = () => {
    const scored = properties.map((prop) => {
      let score = 65; // base score

      if (prop.intent === intent) score += 15;
      if (prop.locality.toLowerCase().includes(preferredLocality.toLowerCase())) score += 15;

      if (budgetTier === 'budget' && prop.priceNumeric <= 6000000) score += 10;
      if (budgetTier === 'mid' && prop.priceNumeric > 6000000 && prop.priceNumeric <= 15000000) score += 10;
      if (budgetTier === 'luxury' && prop.priceNumeric > 15000000) score += 10;

      if (priority === 'ready' && prop.possessionStatus === 'Ready to Move') score += 8;
      if (priority === 'bungalow' && prop.propertyType.includes('Bungalow')) score += 10;
      if (priority === 'schools' && prop.nearbyLandmarks.schools.length > 0) score += 6;

      return { property: prop, score: Math.min(score, 98) };
    });

    scored.sort((a, b) => b.score - a.score);
    setMatches(scored.slice(0, 3));
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 font-display">
                Surat Smart Property Matcher
              </h2>
              <p className="text-xs text-stone-500">
                Personalized AI-style matching based on your lifestyle & budget
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

        {/* Content */}
        <div className="p-6 overflow-y-auto grow">
          {step < 5 ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Step {step} of 4</span>
                <span className="font-semibold text-amber-700">{Math.round((step / 4) * 100)}% Completed</span>
              </div>
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">
                    What is your primary property requirement in Surat?
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: 'Buy', label: 'Buy a Residential Home (Apartment / Bungalow)', desc: 'For self-use or long-term family living' },
                      { key: 'New Project', label: 'Invest in Upcoming New Project', desc: 'Under-construction with high capital growth potential' },
                      { key: 'Rent', label: 'Executive Rental Property', desc: 'Fully furnished ready move-in for immediate tenancy' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setIntent(opt.key as any)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          intent === opt.key
                            ? 'bg-amber-50 border-amber-600 text-stone-900 ring-1 ring-amber-600'
                            : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                        }`}
                      >
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">
                    Which Surat locality do you prefer most?
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { name: 'Vesu', desc: 'Elite VIP corridor, near DPS' },
                      { name: 'Pal', desc: 'Riverfront villas & peace' },
                      { name: 'Adajan', desc: 'Vibrant center, near markets' },
                      { name: 'VIP Road', desc: 'High energy, luxury flats' },
                      { name: 'Althan', desc: 'Upcoming high-growth hub' },
                      { name: 'Piplod', desc: 'Malls, cafes & fine living' }
                    ].map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => setPreferredLocality(loc.name)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          preferredLocality === loc.name
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                            : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-stone-900">{loc.name}</div>
                        <div className="text-xs text-stone-500">{loc.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">
                    What is your approximate budget bracket?
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: 'budget', label: 'Under ₹75 Lakhs', desc: '2 & 2.5 BHK affordable residential homes' },
                      { key: 'mid', label: '₹75 Lakhs – ₹1.75 Crore', desc: '3 & 3.5 BHK spacious high-rise apartments' },
                      { key: 'luxury', label: 'Above ₹1.75 Crore', desc: 'Luxury bungalows, duplex penthouses, and prime commercial' }
                    ].map((tier) => (
                      <button
                        key={tier.key}
                        onClick={() => setBudgetTier(tier.key)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          budgetTier === tier.key
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                            : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-stone-900">{tier.label}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{tier.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">
                    What is your #1 non-negotiable priority?
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: 'schools', label: 'Near Top Schools', desc: 'DPS, GD Goenka, Fountainhead' },
                      { key: 'ready', label: 'Ready to Move', desc: 'Immediate registry & keys' },
                      { key: 'bungalow', label: 'Independent Bungalow', desc: 'Private lawn & no shared walls' },
                      { key: 'metro', label: 'Airport & Transit Link', desc: 'Close to VIP road & airport' }
                    ].map((pri) => (
                      <button
                        key={pri.key}
                        onClick={() => setPriority(pri.key)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          priority === pri.key
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                            : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-stone-900">{pri.label}</div>
                        <div className="text-xs text-stone-500">{pri.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    ← Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCalculateMatch}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Find My Matches</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Step */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Matches Found for Your Profile</span>
                  <span className="text-xs text-emerald-700">
                    Targeting {preferredLocality} · {intent} · Priority: {priority}
                  </span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-emerald-900 font-bold underline cursor-pointer"
                >
                  Retake Quiz
                </button>
              </div>

              <div className="space-y-3">
                {matches.map(({ property, score }) => (
                  <div
                    key={property.id}
                    className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-amber-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src={property.coverImage}
                          alt={property.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            {score}% Match
                          </span>
                          <span className="text-xs text-stone-500">{property.locality}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{property.title}</h4>
                        <div className="text-xs font-bold text-stone-800 tabular-nums font-display mt-0.5">
                          {property.priceDisplay} · {property.carpetAreaSqFt} sq.ft
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenEnquiry(property);
                        }}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Enquire
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProperty(property);
                        }}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call Hardik Hingu Banner */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-400">Want off-market listings in {preferredLocality}?</h4>
                  <p className="text-xs text-stone-400">Hardik Hingu holds private investor mandates not listed publicly.</p>
                </div>
                <a
                  href="tel:+918879719844"
                  className="px-3.5 py-2 bg-white text-stone-900 font-bold text-xs rounded-lg hover:bg-stone-100 flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-emerald-600 fill-current" />
                  <span>Call 8879719844</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
