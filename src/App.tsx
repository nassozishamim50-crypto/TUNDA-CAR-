import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CarsMarketplaceView } from './views/CarsMarketplaceView';
import { VehicleDetailView } from './views/VehicleDetailView';
import { SparePartsView } from './views/SparePartsView';
import { BusinessesView } from './views/BusinessesView';
import { BusinessProfileView } from './views/BusinessProfileView';
import { ListYourBusinessView } from './views/ListYourBusinessView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { EnquiryModal } from './components/EnquiryModal';
import { SavedModal } from './components/SavedModal';
import { Vehicle, SparePart, Business, UgandaLocation } from './types';
import { carsService } from './services/cars.service';
import { businessService } from './services/business.service';
import { authService, UserRole } from './services/auth.service';
import { SettingsProvider, useSettings } from './context/SettingsContext';

function AppContent() {
  const { settings } = useSettings();

  // Navigation State - parse initial URL or default to 'home'
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/admin/settings')) return 'admin-settings';
      if (path.includes('/admin')) return 'admin';
      if (path.includes('/cars')) return 'cars';
      if (path.includes('/spare-parts')) return 'spare-parts';
      if (path.includes('/businesses')) return 'businesses';
      if (path.includes('/list-your-business')) return 'list-your-business';
    }
    return 'home';
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string | null>(null);

  // Search parameters forwarded from Hero / filters
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [initialSearchLocation, setInitialSearchLocation] = useState<UgandaLocation | 'All Locations'>('All Locations');
  const [initialSearchCategory, setInitialSearchCategory] = useState<string>('All Categories');

  // Shared Data
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [verifiedBusinesses, setVerifiedBusinesses] = useState<Business[]>([]);

  // Saved items state
  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('autolink_saved_vehicles');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVehiclesList, setSavedVehiclesList] = useState<Vehicle[]>([]);

  // User Role & Context (defaults to business_owner; can switch to admin)
  const [userRole, setUserRole] = useState<UserRole>('business_owner');

  // Direct Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryTarget, setEnquiryTarget] = useState<any>(null);

  // Initial load
  useEffect(() => {
    async function init() {
      const [feat, bizs] = await Promise.all([
        carsService.getFeaturedVehicles(),
        businessService.getAllBusinesses(),
      ]);
      setFeaturedVehicles(feat);
      setVerifiedBusinesses(bizs.filter((b) => b.isVerified));
    }
    init();
  }, []);

  // Update saved vehicles list when saved ids change
  useEffect(() => {
    try {
      localStorage.setItem('autolink_saved_vehicles', JSON.stringify(savedVehicleIds));
    } catch (e) {}

    async function loadSavedObjects() {
      const allVehs = await carsService.getAllVehicles();
      setSavedVehiclesList(allVehs.filter((v) => savedVehicleIds.includes(v.id)));
    }
    loadSavedObjects();
  }, [savedVehicleIds]);

  const toggleSaveVehicle = (vehicleId: string) => {
    setSavedVehicleIds((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  // SEO & Page Title updates based on current tab and dynamic settings
  useEffect(() => {
    let title = `${settings.businessName} – Find Cars, Spare Parts & Trusted Auto Businesses`;
    let metaDesc = `Discover vehicles, genuine spare parts, and verified automotive businesses across Uganda with ${settings.businessName}. Connect directly via WhatsApp and Phone.`;

    if (currentTab === 'cars') {
      title = `Cars for Sale in Uganda – Bonds, Japanese & Used Vehicles | ${settings.businessName}`;
      metaDesc = 'Browse verified vehicles for sale in Kampala, Wakiso, Mbarara and Uganda. Compare prices in UGX.';
    } else if (currentTab === 'spare-parts') {
      title = `Genuine Spare Parts in Uganda – Engine, Brakes, Suspension | ${settings.businessName}`;
      metaDesc = 'Find genuine Toyota, Nissan, Subaru, and German car spare parts from verified Kisekka Market and Kampala importers.';
    } else if (currentTab === 'businesses') {
      title = `Uganda Automotive Business Directory – Garages, Dealerships & Mechanics`;
      metaDesc = 'Directory of verified car dealerships, garages, tyre dealers, and auto electricians across Uganda.';
    } else if (currentTab === 'list-your-business') {
      title = `List Your Automotive Business – ${settings.subscriptionName} | ${settings.businessName}`;
      metaDesc = `Get your dealership, garage, or spare parts store found by thousands of Ugandan motorists. ${settings.subscriptionDescription}`;
    } else if (currentTab === 'dashboard') {
      title = `Business Dashboard – ${settings.businessName} Merchant Portal`;
    } else if (currentTab === 'admin') {
      title = `Operations & Moderation Hub – ${settings.businessName}`;
    } else if (currentTab === 'admin-settings') {
      title = `Admin Global Settings (/admin/settings) – ${settings.businessName}`;
    }

    document.title = title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', metaDesc);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, selectedVehicleId, selectedBusinessSlug, settings]);

  // Navigation handlers
  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'cars') {
      if (param) {
        setInitialSearchQuery(param);
      } else {
        setInitialSearchQuery('');
      }
      setCurrentTab('cars');
    } else if (tab === 'spare-parts') {
      if (param) {
        setInitialSearchQuery(param);
        setInitialSearchCategory(param);
      } else {
        setInitialSearchQuery('');
        setInitialSearchCategory('All Categories');
      }
      setCurrentTab('spare-parts');
    } else if (tab === 'businesses') {
      if (param) {
        setInitialSearchQuery(param);
        setInitialSearchCategory(param);
      } else {
        setInitialSearchQuery('');
        setInitialSearchCategory('All Categories');
      }
      setCurrentTab('businesses');
    } else {
      setCurrentTab(tab);
    }
  };

  const handleHeroSearchSubmit = (
    query: string,
    location: UgandaLocation | 'All Locations'
  ) => {
    setInitialSearchQuery(query);
    setInitialSearchLocation(location);
    setCurrentTab('cars');
  };

  const handleViewVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentTab('car-detail');
  };

  const handleViewBusiness = (slugOrId: string) => {
    const biz = verifiedBusinesses.find((b) => b.id === slugOrId || b.slug === slugOrId);
    setSelectedBusinessSlug(biz ? biz.slug : slugOrId);
    setCurrentTab('business-profile');
  };

  const handleEnquire = (target: any) => {
    setEnquiryTarget(target);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-16 md:pb-0">
      {/* Top Main Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        savedCount={savedVehicleIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        userRole={userRole}
        onChangeRole={(r) => {
          setUserRole(r);
          if (r === 'admin') setCurrentTab('admin');
          if (r === 'business_owner') setCurrentTab('dashboard');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            featuredVehicles={featuredVehicles}
            verifiedBusinesses={verifiedBusinesses}
            onNavigate={handleNavigate}
            onViewVehicle={handleViewVehicle}
            onViewBusiness={handleViewBusiness}
            onEnquireVehicle={(v) =>
              handleEnquire({
                type: 'vehicle',
                id: v.id,
                title: v.title,
                businessId: v.sellerId,
                businessName: v.sellerName,
                phone: v.sellerPhone,
                whatsapp: v.sellerWhatsapp,
                price: v.priceUgx,
              })
            }
            savedIds={savedVehicleIds}
            onToggleSave={toggleSaveVehicle}
            onSearchSubmit={handleHeroSearchSubmit}
          />
        )}

        {currentTab === 'cars' && (
          <CarsMarketplaceView
            initialSearch={initialSearchQuery}
            initialLocation={initialSearchLocation}
            onViewDetails={handleViewVehicle}
            onEnquireVehicle={(v) =>
              handleEnquire({
                type: 'vehicle',
                id: v.id,
                title: v.title,
                businessId: v.sellerId,
                businessName: v.sellerName,
                phone: v.sellerPhone,
                whatsapp: v.sellerWhatsapp,
                price: v.priceUgx,
              })
            }
            savedIds={savedVehicleIds}
            onToggleSave={toggleSaveVehicle}
          />
        )}

        {currentTab === 'car-detail' && selectedVehicleId && (
          <VehicleDetailWrapper
            vehicleId={selectedVehicleId}
            onBack={() => setCurrentTab('cars')}
            onEnquire={(v) =>
              handleEnquire({
                type: 'vehicle',
                id: v.id,
                title: v.title,
                businessId: v.sellerId,
                businessName: v.sellerName,
                phone: v.sellerPhone,
                whatsapp: v.sellerWhatsapp,
                price: v.priceUgx,
              })
            }
            onViewBusiness={handleViewBusiness}
            isSaved={savedVehicleIds.includes(selectedVehicleId)}
            onToggleSave={toggleSaveVehicle}
          />
        )}

        {currentTab === 'spare-parts' && (
          <SparePartsView
            initialSearch={initialSearchQuery}
            initialCategory={initialSearchCategory as any}
            onEnquire={(p) =>
              handleEnquire({
                type: 'spare_part',
                id: p.id,
                title: p.title,
                businessId: p.sellerId,
                businessName: p.sellerName,
                phone: p.sellerPhone,
                whatsapp: p.sellerWhatsapp,
                price: p.priceUgx,
              })
            }
          />
        )}

        {currentTab === 'businesses' && (
          <BusinessesView
            initialSearch={initialSearchQuery}
            initialCategory={initialSearchCategory as any}
            onViewProfile={handleViewBusiness}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'business-profile' && selectedBusinessSlug && (
          <BusinessProfileView
            slug={selectedBusinessSlug}
            onBack={() => setCurrentTab('businesses')}
            onViewVehicle={handleViewVehicle}
            onEnquire={handleEnquire}
            savedIds={savedVehicleIds}
            onToggleSave={toggleSaveVehicle}
          />
        )}

        {currentTab === 'list-your-business' && (
          <ListYourBusinessView
            onSuccess={(newSlug) => {
              setSelectedBusinessSlug(newSlug);
              setCurrentTab('business-profile');
            }}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            businessId="biz-1"
            onViewBusinessPublic={handleViewBusiness}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView onNavigateToSettings={() => setCurrentTab('admin-settings')} />
        )}

        {currentTab === 'admin-settings' && (
          <AdminSettingsView
            userRole={userRole}
            onSwitchToAdmin={() => setUserRole('admin')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar (Home, Cars, Parts, Businesses, Account) */}
      <MobileNav currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Direct Customer Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        target={enquiryTarget}
      />

      {/* Saved Items Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedVehicles={savedVehiclesList}
        onRemoveSaved={toggleSaveVehicle}
        onViewVehicle={handleViewVehicle}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

// Helper wrapper to fetch vehicle asynchronously for VehicleDetailView
function VehicleDetailWrapper({
  vehicleId,
  onBack,
  onEnquire,
  onViewBusiness,
  isSaved,
  onToggleSave,
}: {
  vehicleId: string;
  onBack: () => void;
  onEnquire: (vehicle: Vehicle) => void;
  onViewBusiness: (sellerId: string) => void;
  isSaved: boolean;
  onToggleSave: (vehicleId: string) => void;
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    carsService.getVehicleById(vehicleId).then(setVehicle);
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-2">Loading vehicle specifications...</p>
      </div>
    );
  }

  return (
    <VehicleDetailView
      vehicle={vehicle}
      onBack={onBack}
      onEnquire={onEnquire}
      onViewBusiness={onViewBusiness}
      isSaved={isSaved}
      onToggleSave={onToggleSave}
    />
  );
}
