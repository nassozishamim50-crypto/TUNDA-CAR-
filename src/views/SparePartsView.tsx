import React, { useState, useEffect } from 'react';
import {
  Search,
  Wrench,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import {
  SparePart,
  SparePartCategory,
  SPARE_PART_CATEGORIES,
  SparePartCondition,
  UgandaLocation,
  UGANDA_LOCATIONS,
} from '../types';
import { sparePartsService, SparePartFilterParams } from '../services/spareParts.service';
import { SparePartCard } from '../components/SparePartCard';
import { SAMPLE_DATA_NOTICE } from '../data/sampleData';

interface SparePartsViewProps {
  initialSearch?: string;
  initialCategory?: SparePartCategory | 'All Categories';
  onEnquire: (part: SparePart) => void;
}

const COMMON_MAKES = ['All Makes', 'Toyota', 'Nissan', 'Subaru', 'Mercedes-Benz', 'BMW', 'Honda', 'Mitsubishi'];
const CONDITIONS: SparePartCondition[] = ['Brand New', 'OEM Used / Tested', 'Refurbished'];

const EXAMPLE_SEARCHES = [
  'Toyota Premio brake pads',
  'Toyota Harrier headlights',
  'BMW X5 suspension',
  'Subaru Forester shock absorbers',
  'Land Cruiser Prado all terrain tyres',
  'Car battery 70Ah',
];

export const SparePartsView: React.FC<SparePartsViewProps> = ({
  initialSearch = '',
  initialCategory = 'All Categories',
  onEnquire,
}) => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<SparePartCategory | 'All Categories'>(initialCategory);
  const [selectedMake, setSelectedMake] = useState<string>('All Makes');
  const [model, setModel] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<SparePartCondition | 'All Conditions'>('All Conditions');
  const [selectedLocation, setSelectedLocation] = useState<UgandaLocation | 'All Locations'>('All Locations');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  useEffect(() => {
    if (initialSearch) {
      setQuery(initialSearch);
    }
    if (initialCategory && initialCategory !== 'All Categories') {
      setSelectedCategory(initialCategory);
    }
  }, [initialSearch, initialCategory]);

  const loadParts = async () => {
    setLoading(true);
    const params: SparePartFilterParams = {
      query: query || undefined,
      category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
      vehicleMake: selectedMake !== 'All Makes' ? selectedMake : undefined,
      vehicleModel: model || undefined,
      condition: selectedCondition !== 'All Conditions' ? selectedCondition : undefined,
      location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
      maxPrice: maxPrice < 3000000 ? maxPrice : undefined,
      sortBy,
    };
    const res = await sparePartsService.filterParts(params);
    setParts(res);
    setLoading(false);
  };

  useEffect(() => {
    loadParts();
  }, [query, selectedCategory, selectedMake, model, selectedCondition, selectedLocation, maxPrice, sortBy]);

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('All Categories');
    setSelectedMake('All Makes');
    setModel('');
    setSelectedCondition('All Conditions');
    setSelectedLocation('All Locations');
    setMaxPrice(3000000);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sample Data Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Spare Parts Catalog Preview:</span> {SAMPLE_DATA_NOTICE} Sourced
          from Kisekka Market suppliers, Katwe hubs, and authorized dealers across Uganda.
        </div>
      </div>

      {/* Main Header & Search */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-7 h-7 text-amber-500" />
            <span>Spare Parts Marketplace Uganda</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search genuine Japanese, German, and Korean spare parts by vehicle make, model, or part number
          </p>
        </div>

        {/* Quick Example Searches */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try:
          </span>
          {EXAMPLE_SEARCHES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-[11px] transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search part name, e.g. brake pads, headlights, suspension..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="All Categories">All Categories</option>
              {SPARE_PART_CATEGORIES.map((cat) => (
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

          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('All Categories')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'All Categories'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Parts
          </button>
          {SPARE_PART_CATEGORIES.map((cat) => (
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Filter Parts</span>
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Make</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
            >
              {COMMON_MAKES.map((mk) => (
                <option key={mk} value={mk}>
                  {mk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Model / Chassis</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Premio, Harrier, F15..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Condition</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === 'All Conditions'}
                  onChange={() => setSelectedCondition('All Conditions')}
                  className="accent-amber-500"
                />
                <span>All Conditions</span>
              </label>
              {CONDITIONS.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === c}
                    onChange={() => setSelectedCondition(c)}
                    className="accent-amber-500"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-slate-700">Max Price (UGX)</label>
              <span className="font-black text-amber-600">
                {maxPrice >= 3000000 ? 'Any' : `${(maxPrice / 1000).toLocaleString('en-UG')}k`}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={3000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{parts.length}</strong> spare parts available
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-200 h-64 rounded-xl"></div>
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No spare parts found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching by a broader vehicle make or checking another category.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map((p) => (
                <SparePartCard key={p.id} part={p} onEnquire={onEnquire} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
