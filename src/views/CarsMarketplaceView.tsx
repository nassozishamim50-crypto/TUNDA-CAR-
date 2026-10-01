import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Car,
  ChevronDown,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import {
  Vehicle,
  UgandaLocation,
  UGANDA_LOCATIONS,
  VehicleBodyType,
  VEHICLE_BODY_TYPES,
  VehicleCondition,
  FuelType,
  TransmissionType,
} from '../types';
import { carsService, VehicleFilterParams } from '../services/cars.service';
import { VehicleCard } from '../components/VehicleCard';
import { SAMPLE_DATA_NOTICE } from '../data/sampleData';

interface CarsMarketplaceViewProps {
  initialSearch?: string;
  initialLocation?: UgandaLocation | 'All Locations';
  onViewDetails: (vehicleId: string) => void;
  onEnquireVehicle: (vehicle: Vehicle) => void;
  savedIds: string[];
  onToggleSave: (vehicleId: string) => void;
}

const CAR_MAKES = [
  'All Makes',
  'Toyota',
  'Subaru',
  'Mercedes-Benz',
  'Nissan',
  'Honda',
  'BMW',
  'Land Rover',
  'Mitsubishi',
  'Volkswagen',
  'Mazda',
  'Ford',
  'Isuzu',
];

const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS: TransmissionType[] = ['Automatic', 'Manual'];
const CONDITIONS: VehicleCondition[] = ['Brand New', 'Foreign Used / In Bond', 'Ugandan Used'];

export const CarsMarketplaceView: React.FC<CarsMarketplaceViewProps> = ({
  initialSearch = '',
  initialLocation = 'All Locations',
  onViewDetails,
  onEnquireVehicle,
  savedIds,
  onToggleSave,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(initialSearch);
  const [selectedMake, setSelectedMake] = useState<string>('All Makes');
  const [model, setModel] = useState<string>('');
  const [selectedBodyType, setSelectedBodyType] = useState<VehicleBodyType | 'All Types'>('All Types');
  const [selectedCondition, setSelectedCondition] = useState<VehicleCondition | 'All Conditions'>('All Conditions');
  const [selectedLocation, setSelectedLocation] = useState<UgandaLocation | 'All Locations'>(initialLocation);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | 'All'>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(300000000);
  const [minYear, setMinYear] = useState<number>(2005);
  const [maxMileage, setMaxMileage] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'year_desc'>('newest');

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setQuery(initialSearch);
    }
    if (initialLocation && initialLocation !== 'All Locations') {
      setSelectedLocation(initialLocation);
    }
  }, [initialSearch, initialLocation]);

  const loadVehicles = async () => {
    setLoading(true);
    const filterParams: VehicleFilterParams = {
      query: query || undefined,
      make: selectedMake !== 'All Makes' ? selectedMake : undefined,
      model: model || undefined,
      bodyType: selectedBodyType !== 'All Types' ? selectedBodyType : undefined,
      condition: selectedCondition !== 'All Conditions' ? selectedCondition : undefined,
      location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
      fuelType: selectedFuel !== 'All' ? selectedFuel : undefined,
      transmission: selectedTransmission !== 'All' ? selectedTransmission : undefined,
      maxPrice: maxPrice < 300000000 ? maxPrice : undefined,
      minYear: minYear > 2005 ? minYear : undefined,
      maxMileage: maxMileage < 150000 ? maxMileage : undefined,
      sortBy,
    };

    const res = await carsService.filterVehicles(filterParams);
    setVehicles(res);
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles();
  }, [
    query,
    selectedMake,
    model,
    selectedBodyType,
    selectedCondition,
    selectedLocation,
    selectedFuel,
    selectedTransmission,
    maxPrice,
    minYear,
    maxMileage,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedMake('All Makes');
    setModel('');
    setSelectedBodyType('All Types');
    setSelectedCondition('All Conditions');
    setSelectedLocation('All Locations');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setMaxPrice(300000000);
    setMinYear(2005);
    setMaxMileage(150000);
    setSortBy('newest');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (selectedMake !== 'All Makes') count++;
    if (model) count++;
    if (selectedBodyType !== 'All Types') count++;
    if (selectedCondition !== 'All Conditions') count++;
    if (selectedLocation !== 'All Locations') count++;
    if (selectedFuel !== 'All') count++;
    if (selectedTransmission !== 'All') count++;
    if (maxPrice < 300000000) count++;
    if (minYear > 2005) count++;
    if (maxMileage < 150000) count++;
    return count;
  }, [
    query,
    selectedMake,
    model,
    selectedBodyType,
    selectedCondition,
    selectedLocation,
    selectedFuel,
    selectedTransmission,
    maxPrice,
    minYear,
    maxMileage,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sample Data Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Development Marketplace Preview:</span> {SAMPLE_DATA_NOTICE}{' '}
          All listings feature realistic Ugandan market prices in UGX and direct WhatsApp/Call links.
        </div>
      </div>

      {/* Header & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Car className="w-7 h-7 text-amber-500" />
              <span>Vehicles & Cars for Sale in Uganda</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse Japanese imports, Ugandan used cars, bonds, and luxury European SUVs
            </p>
          </div>

          {/* Quick Body Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => setSelectedBodyType('All Types')}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedBodyType === 'All Types'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Body Types
            </button>
            {VEHICLE_BODY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBodyType(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedBodyType === type
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input and Filter Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search make, model, e.g. Harrier, Prado, Forester, Premio..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white cursor-pointer"
            >
              <option value="All Locations">All Locations</option>
              {UGANDA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="mileage_asc">Lowest Mileage</option>
                <option value="year_desc">Latest Year</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-white flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFilterCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Desktop Sidebar Filters + Vehicle Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <h2 className="font-extrabold text-sm text-slate-900">Refine Search</h2>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>

          {/* Make Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Make</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-white cursor-pointer"
            >
              {CAR_MAKES.map((mk) => (
                <option key={mk} value={mk}>
                  {mk}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Condition</label>
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
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

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-slate-700">Max Price (UGX)</label>
              <span className="font-black text-amber-600">
                {maxPrice >= 300000000 ? 'Any Price' : `${(maxPrice / 1000000).toFixed(0)}M UGX`}
              </span>
            </div>
            <input
              type="range"
              min={20000000}
              max={300000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Min Year */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-slate-700">Min Year</label>
              <span className="font-black text-slate-700">{minYear}</span>
            </div>
            <input
              type="range"
              min={2005}
              max={2024}
              step={1}
              value={minYear}
              onChange={(e) => setMinYear(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="All">All</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="All">All</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Vehicle Grid & Result Stats */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{vehicles.length}</strong> vehicles in Uganda
            </span>
            {activeFilterCount > 0 && (
              <span className="text-amber-600 font-bold hidden sm:inline">
                {activeFilterCount} active filters applied
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-200 h-72 rounded-xl"></div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Car className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No vehicles match your search criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, choosing "All Makes", or clearing location filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  isSaved={savedIds.includes(v.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewDetails}
                  onEnquire={onEnquireVehicle}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Filter Vehicles</span>
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Make</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  {CAR_MAKES.map((mk) => (
                    <option key={mk} value={mk}>
                      {mk}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="All Conditions">All Conditions</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Max Price: {maxPrice >= 300000000 ? 'Any' : `${(maxPrice / 1000000).toFixed(0)}M UGX`}
                </label>
                <input
                  type="range"
                  min={20000000}
                  max={300000000}
                  step={5000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Min Year: {minYear}</label>
                <input
                  type="range"
                  min={2005}
                  max={2024}
                  step={1}
                  value={minYear}
                  onChange={(e) => setMinYear(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 font-black text-slate-950"
                >
                  Show Results ({vehicles.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
