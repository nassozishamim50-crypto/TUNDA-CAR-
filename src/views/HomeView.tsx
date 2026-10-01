import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Car,
  Wrench,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  CircleDot,
  BatteryCharging,
  Disc,
  Lightbulb,
  Radio,
  Sliders,
  Settings,
} from 'lucide-react';
import { Vehicle, SparePart, Business, UgandaLocation, UGANDA_LOCATIONS } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { BusinessCard } from '../components/BusinessCard';
import { SAMPLE_DATA_NOTICE } from '../data/sampleData';
import { useSettings } from '../context/SettingsContext';
import { formatUgx } from '../utils/formatters';

interface HomeViewProps {
  featuredVehicles: Vehicle[];
  verifiedBusinesses: Business[];
  onNavigate: (tab: string, param?: string) => void;
  onViewVehicle: (id: string) => void;
  onViewBusiness: (slug: string) => void;
  onEnquireVehicle: (vehicle: Vehicle) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSearchSubmit: (query: string, location: UgandaLocation | 'All Locations', categoryType?: string) => void;
}

const SPARE_PART_CATEGORIES_WITH_ICONS = [
  { name: 'Engine Parts', icon: Settings, count: '1,420+ parts' },
  { name: 'Brake Parts', icon: Disc, count: '890+ parts' },
  { name: 'Suspension', icon: Sliders, count: '740+ parts' },
  { name: 'Electrical', icon: Radio, count: '610+ parts' },
  { name: 'Body Parts', icon: Layers, count: '1,120+ parts' },
  { name: 'Lights', icon: Lightbulb, count: '520+ parts' },
  { name: 'Batteries', icon: BatteryCharging, count: '380+ parts' },
  { name: 'Tyres', icon: CircleDot, count: '950+ parts' },
  { name: 'Filters', icon: Cpu, count: '410+ parts' },
  { name: 'Accessories', icon: Sparkles, count: '1,800+ parts' },
];

const POPULAR_SEARCH_TAGS = [
  { label: 'Toyota', tab: 'cars', param: 'Toyota' },
  { label: 'Nissan', tab: 'cars', param: 'Nissan' },
  { label: 'Mercedes-Benz', tab: 'cars', param: 'Mercedes-Benz' },
  { label: 'BMW', tab: 'cars', param: 'BMW' },
  { label: 'Subaru', tab: 'cars', param: 'Subaru' },
  { label: 'Honda', tab: 'cars', param: 'Honda' },
  { label: 'Toyota Spare Parts', tab: 'spare-parts', param: 'Toyota' },
  { label: 'Car Batteries', tab: 'spare-parts', param: 'Batteries' },
  { label: 'Tyres', tab: 'spare-parts', param: 'Tyres' },
  { label: 'Garages', tab: 'businesses', param: 'Garage' },
];

const POPULAR_LOCATION_CARDS = [
  {
    city: 'Kampala',
    count: '3,840+ Listings',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    description: 'Central hub, Nakawa bonds, Kisekka spares & Industrial Area garages',
  },
  {
    city: 'Wakiso',
    count: '1,210+ Listings',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    description: 'Nansana, Kira, Entebbe Road express corridor workshops',
  },
  {
    city: 'Entebbe',
    count: '640+ Listings',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    description: 'Expressway towing, car rental, and coastal auto hubs',
  },
  {
    city: 'Mukono',
    count: '480+ Listings',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    description: 'Commercial fleet repairs, Jinja road dealers',
  },
  {
    city: 'Jinja',
    count: '590+ Listings',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    description: 'Eastern Uganda auto service centers & heavy trucks',
  },
  {
    city: 'Mbarara',
    count: '780+ Listings',
    image: 'https://images.unsplash.com/photo-1590362891988-f778047831d6?auto=format&fit=crop&w=600&q=80',
    description: 'Western Uganda commercial vehicle and used car yards',
  },
  {
    city: 'Mbale',
    count: '340+ Listings',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    description: 'Mount Elgon regional mechanics and spare parts depots',
  },
  {
    city: 'Gulu',
    count: '410+ Listings',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80',
    description: 'Northern Uganda 4x4 pickups, NGO fleets & workshops',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  featuredVehicles,
  verifiedBusinesses,
  onNavigate,
  onViewVehicle,
  onViewBusiness,
  onEnquireVehicle,
  savedIds,
  onToggleSave,
  onSearchSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<UgandaLocation | 'All Locations'>('All Locations');
  const [searchCategory, setSearchCategory] = useState<'all' | 'cars' | 'parts' | 'businesses'>('all');
  const { settings } = useSettings();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCategory === 'cars') {
      onNavigate('cars', searchTerm);
    } else if (searchCategory === 'parts') {
      onNavigate('spare-parts', searchTerm);
    } else if (searchCategory === 'businesses') {
      onNavigate('businesses', searchTerm);
    } else {
      onSearchSubmit(searchTerm, selectedLocation);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Sample Data Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-900 font-medium">
        <span className="font-bold">TUNDA CAR Live Beta:</span> {SAMPLE_DATA_NOTICE}
      </div>

      {/* Hero Section */}
      <section className="relative -mt-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle automotive background pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Uganda's Most Trusted Automotive Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Find Cars, Spare Parts & Automotive Services in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Uganda</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Discover vehicles, spare parts and trusted automotive businesses near you.
          </p>

          {/* Large Search Component */}
          <div className="mt-8 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl max-w-4xl mx-auto text-slate-900">
            {/* Category tabs above input */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 text-xs font-bold text-white">
              <button
                type="button"
                onClick={() => setSearchCategory('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  searchCategory === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                All Marketplace
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('cars')}
                className={`px-3 py-1 rounded-md transition-all ${
                  searchCategory === 'cars'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                Vehicles
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('parts')}
                className={`px-3 py-1 rounded-md transition-all ${
                  searchCategory === 'parts'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                Spare Parts
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('businesses')}
                className={`px-3 py-1 rounded-md transition-all ${
                  searchCategory === 'businesses'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                Garages & Dealers
              </button>
            </div>

            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-xl p-2 shadow-inner flex flex-col md:flex-row items-center gap-2"
            >
              {/* Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search cars, spare parts, dealers or businesses..."
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Location Selector */}
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-200">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value as any)}
                  className="w-full text-xs sm:text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer font-medium"
                >
                  <option value="All Locations">All Uganda Locations</option>
                  {UGANDA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 shrink-0"
              >
                <span>SEARCH</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Searches Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Popular Searches
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => onNavigate(tag.tab, tag.param)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-semibold text-xs border border-slate-200/80 transition-all hover:scale-105"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Car className="w-4 h-4" />
              <span>Verified Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Cars
            </h2>
          </div>
          <button
            onClick={() => onNavigate('cars')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>View All Cars</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.slice(0, 4).map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSaved={savedIds.includes(vehicle.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewVehicle}
              onEnquire={onEnquireVehicle}
            />
          ))}
        </div>
      </section>

      {/* Spare Parts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4" />
              <span>Direct Importers & Stockists</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Spare Parts Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('spare-parts')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>Browse All Parts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {SPARE_PART_CATEGORIES_WITH_ICONS.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onNavigate('spare-parts', cat.name)}
                className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-amber-500 text-slate-700 group-hover:text-slate-950 flex items-center justify-center transition-colors mb-3">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Automotive Businesses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Auto Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verified Automotive Businesses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('businesses')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>View All Businesses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedBusinesses.slice(0, 3).map((biz) => (
            <BusinessCard key={biz.id} business={biz} onViewProfile={onViewBusiness} />
          ))}
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Countrywide Reach</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Popular Locations
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {POPULAR_LOCATION_CARDS.map((item) => (
            <div
              key={item.city}
              onClick={() => onNavigate('cars', item.city)}
              className="group relative h-44 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={item.image}
                alt={item.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  {item.count}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                  {item.city}
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1 hidden sm:block">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why TUNDA CAR? */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            The TUNDA CAR Advantage
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1 mb-3">
            Why TUNDA CAR?
          </h2>
          <p className="text-slate-400 text-sm">
            Built specifically to solve automotive search, trust, and part verification across Uganda with TUNDA CAR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-bold text-sm text-white">All Auto Businesses in One Place</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dealerships, importers, Kisekka spare parts dealers, garages, tyre centers, and mechanics under one roof.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Search Vehicles & Spare Parts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find Japanese & European vehicles, engine parts, brake systems, tyres, and batteries with exact compatibility.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-bold text-sm text-white">Contact Businesses Directly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant WhatsApp messaging and direct telephone calls. Zero intermediary commissions or hidden charges.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              4
            </div>
            <h3 className="font-bold text-sm text-white">Discover Businesses Near You</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter by your exact district or town — Kampala, Wakiso, Jinja, Mbarara, Gulu, and across Uganda.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              5
            </div>
            <h3 className="font-bold text-sm text-white">Compare Available Listings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare prices in UGX, inspected mileage, warranty terms, and customer reviews before making a commitment.
            </p>
          </div>
        </div>
      </section>

      {/* LIST YOUR BUSINESS CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="bg-slate-950 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                For Automotive Businesses & Garages
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Get Your Automotive Business Found
              </h2>
              <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
                Connect with thousands of Ugandan motorists, car buyers, and fleet managers searching for
                vehicles, genuine parts, and reliable garage services daily.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 justify-center md:justify-start text-xs font-bold text-slate-950">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  Direct WhatsApp enquiries
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  Verified badge
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  Vehicles & parts listings
                </span>
              </div>
            </div>

            <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl text-center w-full md:w-80 shrink-0">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                {settings.subscriptionName}
              </span>
              <div className="my-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                  {formatUgx(settings.subscriptionPriceUgx)}
                </span>
                <span className="text-xs text-slate-400 block font-semibold mt-1">
                  / {settings.subscriptionPeriodMonths === 12 ? 'YEAR' : `${settings.subscriptionPeriodMonths} MONTHS`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-6 line-clamp-2">
                {settings.subscriptionDescription}
              </p>
              <button
                onClick={() => onNavigate('list-your-business')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                LIST YOUR BUSINESS
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
