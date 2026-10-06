import React, { useState } from 'react';
import { Enquiry, LeadStatus } from '../types/property';
import { exportEnquiriesToCSV } from '../utils/csvExport';
import {
  X,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  enquiries: Enquiry[];
  onUpdateStatus: (enquiryId: string, newStatus: LeadStatus) => void;
  onAddManualEnquiry: (enquiry: Enquiry) => void;
}

const PIPELINE_STAGES: LeadStatus[] = ['New', 'Contacted', 'Site Visit', 'Interested', 'Closed'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  enquiries,
  onUpdateStatus,
  onAddManualEnquiry,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | LeadStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New manual lead inputs
  const [newCustName, setNewCustName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProperty, setNewProperty] = useState('3 BHK Luxury Vesu');
  const [newLocality, setNewLocality] = useState('Vesu');
  const [newIntent, setNewIntent] = useState<'Buy' | 'Rent' | 'New Project'>('Buy');
  const [newBudget, setNewBudget] = useState('₹75 L - ₹1.2 Cr');
  const [newMessage, setNewMessage] = useState('Inquired directly via office phone call');

  if (!isOpen) return null;

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesFilter = selectedFilter === 'all' || enq.status === selectedFilter;
    const matchesQuery =
      enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.mobile.includes(searchQuery) ||
      enq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleExportCSV = () => {
    exportEnquiriesToCSV(enquiries);
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newMobile) {
      alert('Please enter customer name and mobile.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    const lead: Enquiry = {
      id: `ENQ-MANUAL-${Date.now().toString().slice(-5)}`,
      date: dateFormatted,
      timestamp: Date.now(),
      customerName: newCustName.trim(),
      mobile: newMobile.trim(),
      email: newEmail.trim() || 'Not Provided',
      propertyId: 'SURAT-OFFICE',
      propertyTitle: newProperty.trim(),
      location: newLocality,
      intent: newIntent,
      budget: newBudget.trim(),
      message: newMessage.trim(),
      status: 'New',
      notes: 'Manually entered by sales desk'
    };

    onAddManualEnquiry(lead);
    setShowAddLeadModal(false);
    setNewCustName('');
    setNewMobile('');
  };

  // Pipeline counts
  const countByStatus = (status: LeadStatus) =>
    enquiries.filter((e) => e.status === status).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black font-display tracking-tight text-white">
                  HomeVanta Admin CRM & Excel Database
                </h2>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Surat Desk Live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Assigned Sales Officer: <strong>Hardik Hingu</strong> (Mobile: <strong>8879719844</strong>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              title="Download Microsoft Excel / Google Sheets compatible CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export to Excel / CSV</span>
            </button>

            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Visual Counter Cards */}
        <div className="p-4 sm:p-6 bg-stone-50 border-b border-stone-200 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((st) => {
              const count = countByStatus(st);
              const isActive = selectedFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedFilter(isActive ? 'all' : st)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-amber-400 text-stone-800'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>{st}</span>
                    <span className="text-[10px] opacity-70">Stage</span>
                  </div>
                  <div className="text-2xl font-black font-display tabular-nums">
                    {count}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {st === 'New' && 'Requires 15m callback'}
                    {st === 'Contacted' && 'WhatsApp / Call made'}
                    {st === 'Site Visit' && 'Property tour set'}
                    {st === 'Interested' && 'Price negotiation'}
                    {st === 'Closed' && 'Registry / Advance paid'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Sub-Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search name, phone, or Surat area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 w-full sm:w-auto justify-end">
              <span>Showing {filteredEnquiries.length} of {enquiries.length} Enquiries</span>
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="font-bold text-amber-700 hover:underline cursor-pointer ml-2"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Excel Spreadsheet Table strictly matching user schema */}
        <div className="grow overflow-auto p-4 sm:p-6">
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-100/80 text-stone-700 border-b border-stone-200 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-3.5 whitespace-nowrap">Date</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Customer Name</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Mobile</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Email</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Property</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Location</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Buy/Rent</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Budget</th>
                    <th className="py-3 px-3.5 whitespace-nowrap min-w-[200px]">Message</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-stone-400">
                        No enquiries matching the filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-amber-50/40 transition-colors">
                        {/* Date */}
                        <td className="py-3 px-3.5 font-mono text-stone-600 tabular-nums whitespace-nowrap">
                          {enq.date}
                        </td>

                        {/* Customer Name */}
                        <td className="py-3 px-3.5 font-bold text-stone-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{enq.customerName}</span>
                          </div>
                        </td>

                        {/* Mobile */}
                        <td className="py-3 px-3.5 font-mono font-medium text-stone-800 tabular-nums whitespace-nowrap">
                          <a
                            href={`tel:+91${enq.mobile}`}
                            className="hover:text-amber-700 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-600 inline shrink-0" />
                            <span>{enq.mobile}</span>
                          </a>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-3.5 text-stone-500 whitespace-nowrap">
                          {enq.email}
                        </td>

                        {/* Property */}
                        <td className="py-3 px-3.5 font-medium text-stone-800 max-w-[220px] truncate" title={enq.propertyTitle}>
                          {enq.propertyTitle}
                        </td>

                        {/* Location */}
                        <td className="py-3 px-3.5 text-stone-700 whitespace-nowrap">
                          <span className="font-semibold">{enq.location}</span>
                        </td>

                        {/* Buy/Rent */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            {enq.intent}
                          </span>
                        </td>

                        {/* Budget */}
                        <td className="py-3 px-3.5 font-semibold text-stone-900 whitespace-nowrap tabular-nums">
                          {enq.budget}
                        </td>

                        {/* Message */}
                        <td className="py-3 px-3.5 text-stone-600 text-xs leading-snug">
                          <div className="line-clamp-2" title={enq.message}>
                            {enq.message}
                          </div>
                          {enq.notes && (
                            <div className="text-[10px] text-amber-800 mt-0.5 italic">
                              Note: {enq.notes}
                            </div>
                          )}
                        </td>

                        {/* Status Pipeline Selector */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <select
                            value={enq.status}
                            onChange={(e) => onUpdateStatus(enq.id, e.target.value as LeadStatus)}
                            className={`h-7 px-2 rounded-lg font-bold text-[11px] border cursor-pointer ${
                              enq.status === 'New'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : enq.status === 'Contacted'
                                ? 'bg-sky-100 text-sky-900 border-sky-300'
                                : enq.status === 'Site Visit'
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                : enq.status === 'Interested'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            <option value="New">● New</option>
                            <option value="Contacted">● Contacted</option>
                            <option value="Site Visit">● Site Visit</option>
                            <option value="Interested">● Interested</option>
                            <option value="Closed">● Closed</option>
                          </select>
                        </td>

                        {/* Actions: Call & WhatsApp */}
                        <td className="py-3 px-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:+91${enq.mobile}`}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                              title="Call Lead"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            </a>

                            <a
                              href={`https://wa.me/91${enq.mobile}?text=Hello%20${encodeURIComponent(enq.customerName)}%2C%20this%20is%20Hardik%20Hingu%20from%20HomeVanta.com%20regarding%20your%20inquiry%20for%20${encodeURIComponent(enq.propertyTitle)}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                              title="WhatsApp Lead"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info: Sales officer reminder */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Lead Routing Rule: All buyer & seller calls route to <strong>Hardik Hingu — 8879719844</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              Download Full Leads Spreadsheet (.CSV)
            </button>
          </div>
        </div>

        {/* Add Manual Lead Modal Sub-dialog */}
        {showAddLeadModal && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-stone-900">Add Direct Phone / Walk-in Lead</h3>
                <button onClick={() => setShowAddLeadModal(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Ketan Shah"
                    className="w-full h-9 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full h-9 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full h-9 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Surat Location</label>
                    <select
                      value={newLocality}
                      onChange={(e) => setNewLocality(e.target.value)}
                      className="w-full h-9 px-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="Vesu">Vesu</option>
                      <option value="Pal">Pal</option>
                      <option value="Adajan">Adajan</option>
                      <option value="VIP Road">VIP Road</option>
                      <option value="Althan">Althan</option>
                      <option value="Piplod">Piplod</option>
                      <option value="Citylight">Citylight</option>
                      <option value="Katargam">Katargam</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Intent</label>
                    <select
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value as any)}
                      className="w-full h-9 px-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="Buy">Buy</option>
                      <option value="Rent">Rent</option>
                      <option value="New Project">New Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Budget</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. ₹85 Lakhs"
                    className="w-full h-9 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Requirement Notes</label>
                  <textarea
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-10 bg-stone-900 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Save to Database
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="px-4 h-10 border border-stone-300 rounded-lg cursor-pointer text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
