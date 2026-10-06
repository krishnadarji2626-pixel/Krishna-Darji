import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download, Phone, ShieldCheck, MapPin, Database } from 'lucide-react';

interface SpecificationDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecificationDocModal: React.FC<SpecificationDocModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'screens' | 'excel' | 'admin' | 'sales'>('all');

  if (!isOpen) return null;

  const handleCopySpec = () => {
    navigator.clipboard.writeText(SPEC_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display tracking-tight text-white">
                HomeVanta.com — Complete System & Architecture Specification
              </h2>
              <p className="text-xs text-stone-400">
                Surat-First Real Estate Platform · Google Form / Excel Integration · Admin CRM Blueprint
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpec}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-stone-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Spec'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex gap-2 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'all', label: 'Complete Specification' },
            { id: 'screens', label: '1. Screens & UI/UX' },
            { id: 'excel', label: '2. Excel & Google Form Architecture' },
            { id: 'admin', label: '3. Admin Panel Details' },
            { id: 'sales', label: '4. Sales Routing: Hardik Hingu' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeSection === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grow text-stone-800 text-xs sm:text-sm leading-relaxed space-y-8 font-sans">
          {/* Section 1: Executive Summary */}
          {(activeSection === 'all' || activeSection === 'screens') && (
            <section className="space-y-3">
              <h3 className="text-lg font-black text-stone-900 border-b pb-1 font-display">
                1. Executive Summary & Brand Positioning
              </h3>
              <p>
                <strong>HomeVanta.com</strong> is positioned as a specialized, trust-first property marketplace operating exclusively for Surat, Gujarat. It solves the endemic problems of legacy aggregators: outdated listings, duplicate broker entries, missing title checks, and fragmented lead communication.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">Surat-First Localization</span>
                  Deep locality focus on Vesu, Pal, Adajan, VIP Road, Althan, Piplod, Katargam, and Citylight with micro-market pricing intelligence.
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">RERA & Title Verification</span>
                  Zero unverified listings. Strict document audit (Gujarat RERA, 7/12 extract, title clearance).
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">Unified Sales Representative</span>
                  Single point of contact for buyers and sellers: <strong>Hardik Hingu (8879719844)</strong>.
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Screen by Screen Specification */}
          {(activeSection === 'all' || activeSection === 'screens') && (
            <section className="space-y-4">
              <h3 className="text-lg font-black text-stone-900 border-b pb-1 font-display">
                2. Screen-by-Screen UI/UX Architecture
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900">Screen 1: Homepage & Search Engine</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-600">
                    <li>Hero Headline: “Find Your Perfect Property in Surat.”</li>
                    <li>Integrated Segmented Switcher: Buy | Rent | Sell | New Projects.</li>
                    <li>Search parameters: Surat locality dropdown, Property type, and Budget filter bracket.</li>
                    <li>Prominent Hardik Hingu sales hotline banner with 1-click Call and WhatsApp click-to-chat.</li>
                    <li>Real-time Surat market statistics (Avg. price per sq.ft, YoY growth).</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900">Screen 2: Property Listings & Video Discovery</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-600">
                    <li>Card format adhering to anti-slop rules (unboxed metadata with dot separators).</li>
                    <li>Top badges: "Verified Title & RERA" and "Video Tour" clickable triggers.</li>
                    <li>Compare checkbox toggle allowing buyers to compare up to 3 listings side-by-side.</li>
                    <li>Instant action triggers: "Inquire via Google Form" and direct "Call Hardik".</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900">Screen 3: Property Detail & Specification Modal</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-600">
                    <li>High-resolution photo gallery with responsive thumbnails.</li>
                    <li>Interactive Video Walkthrough player with chapter scrubber (Living Room, Kitchen, Master Bed, Balcony).</li>
                    <li>Detailed specification table: Carpet Area, Super Area, Facing, Floor, Possession date, RERA number.</li>
                    <li>Surat Locality Insights: Distances to leading schools (DPS, GD Goenka), hospitals, transit, and malls.</li>
                    <li>Interactive Loan EMI Calculator with dynamic monthly breakdown.</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900">Screen 4: Seller "Post Property" Wizard</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-600">
                    <li>Multi-step listing form for Surat property owners, builders, and verified brokers.</li>
                    <li>Fields: Intent, Property Type, Surat Locality, Price, Carpet Area, RERA ID, Owner contact details.</li>
                    <li>Toggle to request physical inspection for the Verified Badge.</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900">Screen 5: Multi-Property Side-by-Side Comparison</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-stone-600">
                    <li>Dynamic 3-column comparative matrix.</li>
                    <li>Rows: Price, Price/sq.ft, Carpet Area, BHK, Locality, Possession, RERA status, Video Tour availability.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Google Form & Excel Architecture */}
          {(activeSection === 'all' || activeSection === 'excel') && (
            <section className="space-y-3">
              <h3 className="text-lg font-black text-stone-900 border-b pb-1 font-display">
                3. Google Form & Excel / Sheets Database Architecture
              </h3>
              <p>
                Every enquiry submitted on HomeVanta.com is structured to integrate with Google Forms, Google Sheets, or Microsoft Excel via direct CSV synchronization.
              </p>

              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-amber-400 font-bold mb-2">Requested Excel / CSV Structure:</div>
                <div className="text-stone-300">
                  Date | Customer Name | Mobile | Email | Property | Location | Buy/Rent | Budget | Message | Status
                </div>
                <div className="text-stone-400 mt-2">
                  06-10-2026 | Example | 9876543210 | example@email.com | 3 BHK | Surat | Buy | ₹75 L | Interested | New
                </div>
              </div>

              <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl space-y-2">
                <span className="font-bold text-violet-950 block">Google Form Integration Protocol:</span>
                <p className="text-stone-700">
                  1. The buyer clicks <strong>"Inquire / Google Form"</strong> on any property or general search.<br />
                  2. A Google Form dialog renders with fields: Name (Required), Contact Number (Required), Email, Selected Property, Surat Locality, Budget, Requirements, and Site Visit Date.<br />
                  3. Upon clicking <strong>"Submit"</strong>, the entry is automatically saved to the persistent CRM database and instantly displays the direct call & pre-filled WhatsApp link to <strong>Hardik Hingu (8879719844)</strong>.<br />
                  4. Admins can export the full dataset at any moment as an Excel-ready `.CSV` file with UTF-8 BOM encoding.
                </p>
              </div>
            </section>
          )}

          {/* Section 4: Admin Panel Details */}
          {(activeSection === 'all' || activeSection === 'admin') && (
            <section className="space-y-3">
              <h3 className="text-lg font-black text-stone-900 border-b pb-1 font-display">
                4. Admin Panel & CRM Workflow Details
              </h3>
              <p>
                The administrative panel serves as a real-time command center for property transactions and inbound inquiries:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                  1. New Enquiries<br /><span className="text-[10px] font-normal">Immediate callback</span>
                </div>
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-900">
                  2. Contacted<br /><span className="text-[10px] font-normal">Details shared</span>
                </div>
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900">
                  3. Site Visit<br /><span className="text-[10px] font-normal">Property tour done</span>
                </div>
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900">
                  4. Interested<br /><span className="text-[10px] font-normal">Pricing negotiation</span>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                  5. Closed<br /><span className="text-[10px] font-normal">Registration done</span>
                </div>
              </div>

              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li><strong>One-Click Excel Download:</strong> Generates formatted spreadsheet with all historical leads.</li>
                <li><strong>Status Updaters:</strong> Dropdown to change lead status in real-time.</li>
                <li><strong>Direct Calling & WhatsApp Actions:</strong> Direct phone call and pre-formatted WhatsApp chat triggers for every row.</li>
                <li><strong>Manual Lead Entry:</strong> Record offline phone calls or walk-in buyers into the centralized database.</li>
              </ul>
            </section>
          )}

          {/* Section 5: Sales Workflow for Hardik Hingu */}
          {(activeSection === 'all' || activeSection === 'sales') && (
            <section className="space-y-3">
              <h3 className="text-lg font-black text-stone-900 border-b pb-1 font-display">
                5. Sales & Lead Routing Protocol: Hardik Hingu (8879719844)
              </h3>
              <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-400 font-bold">Designated Sales Officer & Mandate Holder</div>
                  <div className="text-lg font-bold">Hardik Hingu — +91 8879719844</div>
                  <div className="text-xs text-stone-400 mt-0.5">Surat City Commercial & Residential Mandates</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="tel:+918879719844"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Direct Line
                  </a>
                  <a
                    href="https://wa.me/918879719844"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white text-stone-900 rounded-lg text-xs font-bold"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="text-stone-600 space-y-1.5 text-xs">
                <p><strong>Routing Rules:</strong></p>
                <p>• Every button labeled "Call for Property Buying & Selling" connects to <code>tel:+918879719844</code>.</p>
                <p>• Submissions through Google Form generate formatted WhatsApp messages containing buyer name, phone, budget, and selected property directly to Hardik Hingu.</p>
                <p>• Hardik Hingu receives daily Excel digests exported from the Admin panel for lead pipeline tracking.</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 shrink-0">
          <span>HomeVanta.com Architectural Blueprint & Launch Specification v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-bold rounded-lg cursor-pointer hover:bg-stone-800"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};

const SPEC_TEXT = `HomeVanta.com — Complete System & Architecture Specification
Target City: Surat, Gujarat, India
Designated Sales Advisor: Hardik Hingu (Mobile: +91 8879719844)

1. CORE CONCEPT
- Surat-first property portal: Focus on Vesu, Pal, Adajan, VIP Road, Althan, Piplod, Katargam, Citylight.
- Verified Listings: Title deed, 7/12 extract, and Gujarat RERA validation.
- Interactive Video Tours: Simulated room walkthroughs.
- Smart Property Matcher: Quiz matching buyer requirements to listings.
- Compare Tool: Side-by-side comparison of 3 properties.
- Google Form Enquiry System: Name, mobile, email, property, budget, message.
- Admin CRM & Excel Database: Full pipeline (New -> Contacted -> Site Visit -> Interested -> Closed) with CSV export.
`;
