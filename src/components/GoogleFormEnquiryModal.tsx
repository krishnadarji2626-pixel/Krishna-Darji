import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Phone, MessageSquare, ExternalLink, ShieldCheck, Send, FileSpreadsheet, Sparkles } from 'lucide-react';
import { Property, ListingIntent, Enquiry } from '../types/property';

interface GoogleFormEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  onSaveEnquiry: (enquiry: Enquiry) => void;
  defaultIntent?: ListingIntent;
}

export const GoogleFormEnquiryModal: React.FC<GoogleFormEnquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  onSaveEnquiry,
  defaultIntent = 'Buy',
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState<ListingIntent>(defaultIntent);
  const [location, setLocation] = useState(property?.locality || 'Vesu, Surat');
  const [budget, setBudget] = useState(property ? property.priceDisplay : '₹75 Lakhs - ₹1.5 Cr');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [customGoogleFormUrl, setCustomGoogleFormUrl] = useState('');
  const [showUrlSettings, setShowUrlSettings] = useState(false);

  useEffect(() => {
    if (property) {
      setLocation(property.locality);
      setIntent(property.intent);
      setBudget(property.priceDisplay);
      setMessage(`Interested in ${property.title} (${property.locality}). Please arrange a site visit and share brochure.`);
    } else {
      setMessage('I am looking for property options in Surat. Please contact me with details.');
    }
    setIsSubmitted(false);
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Please enter your Name and Contact Number.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    const newEnquiry: Enquiry = {
      id: `ENQ-GF-${Date.now().toString().slice(-6)}`,
      date: dateFormatted,
      timestamp: Date.now(),
      customerName: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || 'Not Provided',
      propertyId: property?.id || 'GENERAL-SURAT',
      propertyTitle: property?.title || `General ${intent} Inquiry (${location})`,
      location: location || 'Surat',
      intent: intent,
      budget: budget,
      message: message.trim() || 'Interested in property consultation in Surat',
      status: 'New',
      preferredVisitDate: preferredDate || undefined,
      notes: `Received via Google Form Enquiry System. Seller to contact: Hardik Hingu (8879719844)`
    };

    onSaveEnquiry(newEnquiry);
    setSubmittedEnquiry(newEnquiry);
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Hardik Hingu, I just submitted an inquiry on HomeVanta.com!\n\n` +
    `👤 *Name*: ${name}\n` +
    `📞 *Phone*: ${mobile}\n` +
    `🏠 *Property*: ${property?.title || 'Property Consultation in Surat'}\n` +
    `📍 *Location*: ${location}\n` +
    `💰 *Budget*: ${budget}\n` +
    `📝 *Details*: ${message}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Google Form Signature Top Purple/Brand Bar */}
        <div className="h-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-600 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                Official Google Form Integration
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-xs font-semibold text-stone-600">HomeVanta Surat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-display">
              {property ? `Inquire About: ${property.title}` : 'Property Inquiry Form — Surat'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Fill in your details below. Your submission is recorded automatically to the CRM and routed directly to property specialist <strong>Hardik Hingu (8879719844)</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto grow">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property summary pill if attached */}
              {property && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500">Selected Property: </span>
                    <strong className="text-stone-900">{property.title}</strong>
                    <span className="text-stone-400 ml-2">({property.locality} · {property.priceDisplay})</span>
                  </div>
                  <span className="font-semibold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                    ID: {property.id}
                  </span>
                </div>
              )}

              {/* Name field (Required) */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-stone-500 mb-2">Please enter your legal name as on contact records</p>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition-all"
                />
              </div>

              {/* Contact Number field (Required) */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Contact Number / Mobile <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-stone-500 mb-2">Hardik Hingu will reach out to you on this phone number</p>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-11 pl-12 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition-all tabular-nums font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition-all"
                />
              </div>

              {/* Intent & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                  <label className="block text-sm font-bold text-stone-900 mb-1">
                    Requirement Type
                  </label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value as ListingIntent)}
                    className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 font-medium focus:ring-2 focus:ring-violet-600 outline-none cursor-pointer"
                  >
                    <option value="Buy">Buy Property in Surat</option>
                    <option value="Rent">Rent Property</option>
                    <option value="New Project">New Project Booking</option>
                  </select>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                  <label className="block text-sm font-bold text-stone-900 mb-1">
                    Preferred Surat Locality
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 font-medium focus:ring-2 focus:ring-violet-600 outline-none cursor-pointer"
                  >
                    <option value="Vesu">Vesu</option>
                    <option value="Pal">Pal</option>
                    <option value="Adajan">Adajan</option>
                    <option value="VIP Road">VIP Road</option>
                    <option value="Althan">Althan</option>
                    <option value="Piplod">Piplod</option>
                    <option value="Citylight">Citylight</option>
                    <option value="Katargam">Katargam</option>
                    <option value="Jahangirpura">Jahangirpura</option>
                    <option value="Dumas Road">Dumas Road</option>
                  </select>
                </div>
              </div>

              {/* Budget & Preferred Visit Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                  <label className="block text-sm font-bold text-stone-900 mb-1">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. ₹75 Lakhs - ₹1.2 Cr"
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
                  />
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                  <label className="block text-sm font-bold text-stone-900 mb-1">
                    Preferred Site Visit Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Message / Details */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <label className="block text-sm font-bold text-stone-900 mb-1">
                  Message / Requirements for Seller
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details like preferred floor, facing, payment plan, loan requirements..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-violet-600 outline-none transition-all resize-none"
                />
              </div>

              {/* Seller Contact Notice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-stone-800">
                    Assigned Property Seller/Advisor: <strong>Hardik Hingu</strong> (Mobile: <strong>8879719844</strong>)
                  </span>
                </div>
                <a
                  href="tel:+918879719844"
                  className="text-amber-800 hover:text-amber-950 font-bold underline whitespace-nowrap cursor-pointer"
                >
                  Call Directly
                </a>
              </div>

              {/* External Google Form Link Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowUrlSettings(!showUrlSettings)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{showUrlSettings ? 'Hide custom Google Form URL' : 'Have a custom external Google Form URL? Click here'}</span>
                </button>

                {showUrlSettings && (
                  <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-2">
                    <label className="font-semibold text-stone-700 block">External Google Form URL:</label>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      value={customGoogleFormUrl}
                      onChange={(e) => setCustomGoogleFormUrl(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-xs"
                    />
                    {customGoogleFormUrl && (
                      <a
                        href={customGoogleFormUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-violet-700 font-semibold hover:underline"
                      >
                        Open your Google Form in new tab <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 h-12 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Form & Send to Hardik Hingu</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 h-12 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-100 transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Submission Confirmation Screen */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 font-display">
                  Your Response Has Been Recorded!
                </h3>
                <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
                  Your property inquiry has been logged into the HomeVanta database and dispatched to property advisor <strong>Hardik Hingu</strong>.
                </p>
              </div>

              {/* Recorded Details Card */}
              {submittedEnquiry && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-1.5">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5 font-semibold text-stone-800">
                    <span>Enquiry ID:</span>
                    <span className="font-mono text-violet-700">{submittedEnquiry.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Applicant Name:</span>
                    <span className="font-medium text-stone-900">{submittedEnquiry.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Contact Number:</span>
                    <span className="font-medium text-stone-900 tabular-nums">{submittedEnquiry.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Property / Location:</span>
                    <span className="font-medium text-stone-900">{submittedEnquiry.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Estimated Budget:</span>
                    <span className="font-medium text-stone-900">{submittedEnquiry.budget}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Status:</span>
                    <span className="font-bold text-amber-700">New Lead (Saved in Admin Excel)</span>
                  </div>
                </div>
              )}

              {/* Immediate Seller Contact Actions */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-md mx-auto space-y-3">
                <div className="text-left">
                  <span className="text-xs font-bold text-amber-900 block">Next Step: Speak Directly with the Seller</span>
                  <p className="text-xs text-stone-600">Connect with Hardik Hingu right away to fast-track your inquiry or arrange an immediate site visit.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="tel:+918879719844"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 fill-current" />
                    <span>Call Hardik: 8879719844</span>
                  </a>

                  <a
                    href={`https://wa.me/918879719844?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer underline"
                >
                  Submit another response
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={onClose}
                  className="text-xs text-violet-700 hover:text-violet-900 font-bold cursor-pointer"
                >
                  Done & Back to Properties
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
