import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Filter,
  ShieldCheck,
  MapPin,
  PlusCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  Business,
  BusinessCategory,
  BUSINESS_CATEGORIES,
  UgandaLocation,
  UGANDA_LOCATIONS,
} from '../types';
import { businessService, BusinessFilterParams } from '../services/business.service';
import { BusinessCard } from '../components/BusinessCard';
import { SAMPLE_DATA_NOTICE } from '../data/sampleData';

interface BusinessesViewProps {
  initialSearch?: string;
  initialCategory?: BusinessCategory | 'All Categories';
  onViewProfile: (slug: string) => void;
  onNavigate: (tab: string) => void;
}

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  initialSearch = '',
  initialCategory = 'All Categories',
  onViewProfile,
  onNavigate,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'All Categories'>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<UgandaLocation | 'All Locations'>('All Locations');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setQuery(initialSearch);
    }
    if (initialCategory && initialCategory !== 'All Categories') {
      setSelectedCategory(initialCategory);
    }
  }, [initialSearch, initialCategory]);

  const loadBusinesses = async () => {
    setLoading(true);
    const params: BusinessFilterParams = {
      query: query || undefined,
      category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
      location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
      verifiedOnly: verifiedOnly || undefined,
    };
    const res = await businessService.filterBusinesses(params);
    setBusinesses(res);
    setLoading(false);
  };

  useEffect(() => {
    loadBusinesses();
  }, [query, selectedCategory, selectedLocation, verifiedOnly]);

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setVerifiedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Uganda Automotive Business Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Find Trusted Garages, Dealerships & Auto Specialists
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Connect directly with verified mechanics, tyre dealers, battery distributors, bodywork workshops,
            and Japanese car bonded importers across Uganda.
          </p>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl text-center shrink-0 w-full sm:w-auto">
          <span className="text-[11px] text-amber-400 font-extrabold uppercase tracking-wider block">
            Automotive Business Owner?
          </span>
          <div className="text-lg font-black text-white my-1">UGX 100,000 / YEAR</div>
          <button
            onClick={() => onNavigate('list-your-business')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Your Business</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garage name, dealership, service or address..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="All Categories">All 14 Business Categories</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="All Locations">All Uganda Locations</option>
              {UGANDA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 px-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Only
              </span>
            </label>
          </div>
        </div>

        {/* Quick Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('All Categories')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'All Categories'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Businesses
          </button>
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Found <strong className="text-slate-900">{businesses.length}</strong> automotive businesses in
            Uganda
          </span>
          {(query || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations' || verifiedOnly) && (
            <button
              onClick={handleReset}
              className="text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-200 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No businesses match the current filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching your location to "All Uganda Locations" or unchecking verified only.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} onViewProfile={onViewProfile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
