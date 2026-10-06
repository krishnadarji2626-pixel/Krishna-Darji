import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { VideoTourModal } from './components/VideoTourModal';
import { GoogleFormEnquiryModal } from './components/GoogleFormEnquiryModal';
import { CompareDrawer } from './components/CompareDrawer';
import { SmartMatcherModal } from './components/SmartMatcherModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SpecificationDocModal } from './components/SpecificationDocModal';
import { SuratLocalityExplorer } from './components/SuratLocalityExplorer';
import { PropertyAnimationVideoSection } from './components/PropertyAnimationVideoSection';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';

import { SURAT_PROPERTIES } from './data/suratProperties';
import { INITIAL_ENQUIRIES } from './data/initialEnquiries';
import { Property, ListingIntent, PropertyType, Enquiry, LeadStatus } from './types/property';
import { Phone, MessageSquare, Plus, FileSpreadsheet, Scale, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const LOCAL_STORAGE_ENQUIRIES_KEY = 'homevanta_surat_enquiries_v1';
const LOCAL_STORAGE_PROPERTIES_KEY = 'homevanta_surat_properties_v1';

export default function App() {
  // Properties state (with persistent storage fallback)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SURAT_PROPERTIES;
  });

  // Enquiries state (with persistent storage fallback)
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ENQUIRIES;
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(enquiries));
    } catch (e) {
      console.error(e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  // Filters
  const [activeIntent, setActiveIntent] = useState<ListingIntent | 'all'>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'areaDesc'>('featured');

  // Compared Properties
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);

  // User Login Session state
  const [currentUser, setCurrentUser] = useState<{ name: string; mobile: string; intent?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('homevanta_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Open login screen by default if user is not logged in!
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState<boolean>(() => {
    return !localStorage.getItem('homevanta_user_session');
  });

  // Modals
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [selectedPropertyForVideoTour, setSelectedPropertyForVideoTour] = useState<Property | null>(null);
  const [selectedPropertyForEnquiry, setSelectedPropertyForEnquiry] = useState<Property | null>(null);
  const [isGoogleFormModalOpen, setIsGoogleFormModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSpecDocOpen, setIsSpecDocOpen] = useState(false);

  // Active top navigation tab
  const [activeNavTab, setActiveNavTab] = useState<'all' | 'Buy' | 'Rent' | 'New Project' | 'localities'>('all');

  // Sync activeIntent when nav tab changes
  const handleNavTabChange = (tab: 'all' | 'Buy' | 'Rent' | 'New Project' | 'localities') => {
    setActiveNavTab(tab);
    if (tab === 'localities') {
      const element = document.getElementById('localities-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveIntent(tab);
      const listings = document.getElementById('listings-section');
      if (listings) {
        listings.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Compare handlers
  const handleToggleCompare = (property: Property) => {
    setComparedPropertyIds((prev) => {
      if (prev.includes(property.id)) {
        return prev.filter((id) => id !== property.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 properties simultaneously.');
          return prev;
        }
        return [...prev, property.id];
      }
    });
  };

  const handleRemoveCompare = (propertyId: string) => {
    setComparedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Intent filter
      if (activeIntent !== 'all' && prop.intent !== activeIntent) {
        return false;
      }
      // Locality filter
      if (selectedLocality !== 'all' && !prop.locality.toLowerCase().includes(selectedLocality.toLowerCase())) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && prop.propertyType !== selectedType) {
        return false;
      }
      // Budget filter
      if (selectedBudget === 'under50' && prop.priceNumeric > 5000000) return false;
      if (selectedBudget === '50to100' && (prop.priceNumeric < 5000000 || prop.priceNumeric > 10000000)) return false;
      if (selectedBudget === '100to200' && (prop.priceNumeric < 10000000 || prop.priceNumeric > 20000000)) return false;
      if (selectedBudget === 'above200' && prop.priceNumeric < 20000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceNumeric - b.priceNumeric;
      if (sortBy === 'priceDesc') return b.priceNumeric - a.priceNumeric;
      if (sortBy === 'areaDesc') return b.carpetAreaSqFt - a.carpetAreaSqFt;
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, activeIntent, selectedLocality, selectedType, selectedBudget, sortBy]);

  const comparedPropertiesList = useMemo(() => {
    return properties.filter((p) => comparedPropertyIds.includes(p.id));
  }, [properties, comparedPropertyIds]);

  // Enquiry handling (adds to state & CRM database)
  const handleSaveEnquiry = (newEnquiry: Enquiry) => {
    setEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const handleUpdateStatus = (enquiryId: string, newStatus: LeadStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
  };

  const handleAddManualLead = (newLead: Enquiry) => {
    setEnquiries((prev) => [newLead, ...prev]);
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  const handleOpenGoogleFormEnquiry = (property?: Property) => {
    setSelectedPropertyForEnquiry(property || null);
    setIsGoogleFormModalOpen(true);
  };

  const handleLogin = (user: { name: string; mobile: string; intent?: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('homevanta_user_session', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setIsLoginScreenOpen(false);

    // Automatically record visitor registration into the Admin CRM Leads database
    const today = new Date();
    const dateFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    const newVisitorLead: Enquiry = {
      id: `ENQ-VISITOR-${Date.now().toString().slice(-5)}`,
      date: dateFormatted,
      timestamp: Date.now(),
      customerName: user.name,
      mobile: user.mobile,
      email: 'Logged in Visitor',
      propertyId: 'PORTAL-VISITOR',
      propertyTitle: `Website Visitor Access (${user.intent || 'Surat Properties'})`,
      location: 'Surat',
      intent: (user.intent as any) || 'Buy',
      budget: 'General Consultation',
      message: `Visitor logged into HomeVanta.com. Phone number submitted at login screen.`,
      status: 'New',
      notes: 'Captured via Homepage Login Gate'
    };

    setEnquiries((prev) => [newVisitorLead, ...prev]);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('homevanta_user_session');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsLoginScreenOpen(true);
  };

  const newLeadsCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={handleNavTabChange}
        onOpenCompare={() => setIsCompareOpen(true)}
        compareCount={comparedPropertyIds.length}
        onOpenSmartMatch={() => setIsSmartMatchOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSpecDoc={() => setIsSpecDocOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginScreenOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="grow">
        {/* Hero Section */}
        <HeroSection
          activeIntent={activeIntent}
          setActiveIntent={setActiveIntent}
          selectedLocality={selectedLocality}
          setSelectedLocality={setSelectedLocality}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          onSearch={() => {
            const el = document.getElementById('listings-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenSmartMatch={() => setIsSmartMatchOpen(true)}
          onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        />

        {/* Featured Property Animation Video Showcase */}
        <div id="video-tours-section">
          <PropertyAnimationVideoSection
            properties={properties}
            onSelectProperty={setSelectedPropertyForDetail}
            onOpenEnquiry={handleOpenGoogleFormEnquiry}
            onOpenVideoModal={setSelectedPropertyForVideoTour}
          />
        </div>

        {/* Listings Section */}
        <section id="listings-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header of listings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
                  {activeIntent === 'all' ? 'All Surat Properties' : `${activeIntent} in Surat`}
                </h2>
                <span className="text-xs font-semibold text-stone-500">
                  ({filteredProperties.length} verified listings)
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {selectedLocality !== 'all' ? `Filtered by ${selectedLocality} locality` : 'Covering all prime Surat sectors'}
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="areaDesc">Largest Carpet Area</option>
              </select>

              {(selectedLocality !== 'all' || selectedType !== 'all' || selectedBudget !== 'all' || activeIntent !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedLocality('all');
                    setSelectedType('all');
                    setSelectedBudget('all');
                    setActiveIntent('all');
                  }}
                  className="px-2.5 py-1.5 text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelectProperty={setSelectedPropertyForDetail}
                  onOpenVideoTour={setSelectedPropertyForVideoTour}
                  onOpenEnquiry={handleOpenGoogleFormEnquiry}
                  isCompared={comparedPropertyIds.includes(property.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <h3 className="text-lg font-bold text-stone-900">No properties matched this filter combination</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try expanding your budget bracket or reset the locality filter to explore all available Surat developments.
              </p>
              <button
                onClick={() => {
                  setSelectedLocality('all');
                  setSelectedType('all');
                  setSelectedBudget('all');
                  setActiveIntent('all');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Surat Locality Explorer Section */}
        <div id="localities-section">
          <SuratLocalityExplorer
            onSelectLocality={(locName) => {
              setSelectedLocality(locName);
              const el = document.getElementById('listings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Consultation & Hardik Hingu Banner */}
        <section className="py-14 bg-stone-900 text-white border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl border border-stone-700/80 p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-center lg:text-left">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Surat Real Estate Sales & Legal Support
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                  Have a specific Surat property in mind, or planning to sell?
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  Connect with <strong>Hardik Hingu (8879719844)</strong> for personalized portfolio advisory, builder direct allocations in Vesu and Pal, or fast legal verification of your property title.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
                <button
                  onClick={() => handleOpenGoogleFormEnquiry()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Send Inquiry via Google Form
                </button>

                <a
                  href="tel:+918879719844"
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call Hardik: 8879719844</span>
                </a>

                <a
                  href="https://wa.me/918879719844?text=Hi%20Hardik%2C%20I%20am%20looking%20for%20property%20consultation%20in%20Surat%20via%20HomeVanta.com."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Bars for Mobile & Desktop quick interactions */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Compare quick button if active */}
        {comparedPropertyIds.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Compare ({comparedPropertyIds.length})</span>
          </button>
        )}

        {/* Google Form Enquiry quick trigger */}
        <button
          onClick={() => handleOpenGoogleFormEnquiry()}
          className="px-4 py-2.5 bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
        >
          <span>Enquiry Form</span>
        </button>

        {/* Direct Call Hardik Hingu button */}
        <a
          href="tel:+918879719844"
          className="p-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border border-stone-700"
          title="Call Hardik Hingu: 8879719844"
        >
          <Phone className="w-4 h-4 text-emerald-400 fill-current" />
        </a>
      </div>

      {/* Footer */}
      <Footer
        onSelectLocality={(loc) => {
          setSelectedLocality(loc);
          const el = document.getElementById('listings-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSpecDoc={() => setIsSpecDocOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenSmartMatch={() => setIsSmartMatchOpen(true)}
      />

      {/* Modals */}
      <PropertyDetailModal
        property={selectedPropertyForDetail}
        onClose={() => setSelectedPropertyForDetail(null)}
        onOpenVideoTour={setSelectedPropertyForVideoTour}
        onOpenEnquiry={handleOpenGoogleFormEnquiry}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedPropertyForDetail ? comparedPropertyIds.includes(selectedPropertyForDetail.id) : false}
      />

      <VideoTourModal
        property={selectedPropertyForVideoTour}
        onClose={() => setSelectedPropertyForVideoTour(null)}
        onOpenEnquiry={handleOpenGoogleFormEnquiry}
      />

      <GoogleFormEnquiryModal
        isOpen={isGoogleFormModalOpen}
        onClose={() => setIsGoogleFormModalOpen(false)}
        property={selectedPropertyForEnquiry}
        onSaveEnquiry={handleSaveEnquiry}
        defaultIntent={activeIntent === 'all' ? 'Buy' : activeIntent}
      />

      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProperties={comparedPropertiesList}
        onRemoveProperty={handleRemoveCompare}
        onOpenEnquiry={handleOpenGoogleFormEnquiry}
      />

      <SmartMatcherModal
        isOpen={isSmartMatchOpen}
        onClose={() => setIsSmartMatchOpen(false)}
        properties={properties}
        onSelectProperty={setSelectedPropertyForDetail}
        onOpenEnquiry={handleOpenGoogleFormEnquiry}
      />

      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={() => setIsPostPropertyOpen(false)}
        onAddProperty={handleAddProperty}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        enquiries={enquiries}
        onUpdateStatus={handleUpdateStatus}
        onAddManualEnquiry={handleAddManualLead}
      />

      <SpecificationDocModal
        isOpen={isSpecDocOpen}
        onClose={() => setIsSpecDocOpen(false)}
      />

      {/* Visitor Login / Welcome Screen Gate */}
      <LoginScreen
        isOpen={isLoginScreenOpen}
        onLogin={handleLogin}
        onGuestContinue={() => setIsLoginScreenOpen(false)}
      />
    </div>
  );
}
