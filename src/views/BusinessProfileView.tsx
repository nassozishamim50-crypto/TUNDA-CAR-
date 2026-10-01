import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Star,
  Globe,
  Mail,
  Navigation,
  Car,
  Wrench,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';
import { Business, Vehicle, SparePart } from '../types';
import { businessService } from '../services/business.service';
import { carsService } from '../services/cars.service';
import { sparePartsService } from '../services/spareParts.service';
import { VehicleCard } from '../components/VehicleCard';
import { SparePartCard } from '../components/SparePartCard';
import { getWhatsAppLink, getPhoneLink } from '../utils/formatters';

interface BusinessProfileViewProps {
  slug: string;
  onBack: () => void;
  onViewVehicle: (id: string) => void;
  onEnquire: (target: any) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  slug,
  onBack,
  onViewVehicle,
  onEnquire,
  savedIds,
  onToggleSave,
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'parts' | 'gallery' | 'reviews'>('overview');
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const b = await businessService.getBusinessBySlug(slug);
      if (b) {
        setBusiness(b);
        const [vList, pList] = await Promise.all([
          carsService.filterVehicles({ sellerId: b.id }),
          sparePartsService.filterParts({ sellerId: b.id }),
        ]);
        setVehicles(vList);
        setSpareParts(pList);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-3">Loading business profile...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">Business Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested automotive business profile could not be found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const whatsappMsg = `Hello ${business.name}, I am viewing your verified profile on TUNDA CAR and would like to make an enquiry.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Businesses Directory</span>
        </button>
      </div>

      {/* Cover & Brand Hero */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-72 bg-slate-950 overflow-hidden">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          {business.isVerified && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Automotive Business</span>
            </div>
          )}
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Logo and Identity */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-900 text-amber-400 text-[11px] font-black uppercase px-2.5 py-0.5 rounded">
                    {business.category}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{business.rating}</span>
                    <span className="text-slate-400 font-normal">({business.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {business.name}
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    {business.address}, {business.city} ({business.district} District)
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons: CALL, WHATSAPP, GET DIRECTIONS, SEND ENQUIRY */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={getWhatsAppLink(business.whatsapp, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WHATSAPP</span>
              </a>

              <a
                href={getPhoneLink(business.phone)}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>CALL</span>
              </a>

              <button
                onClick={() => setShowDirections(!showDirections)}
                className="py-2.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>GET DIRECTIONS</span>
              </button>

              <button
                onClick={() =>
                  onEnquire({
                    type: 'business',
                    id: business.id,
                    title: `Consultation with ${business.name}`,
                    businessId: business.id,
                    businessName: business.name,
                    phone: business.phone,
                    whatsapp: business.whatsapp,
                  })
                }
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Mail className="w-4 h-4" />
                <span>SEND ENQUIRY</span>
              </button>
            </div>
          </div>

          {/* Directions Drawer / Banner if triggered */}
          {showDirections && (
            <div className="my-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-sm">
                  <Navigation className="w-4 h-4 text-amber-600" /> Physical Location & Access
                </span>
                <button onClick={() => setShowDirections(false)} className="text-amber-800 font-semibold">
                  Close
                </button>
              </div>
              <p className="leading-relaxed">
                <strong>Address:</strong> {business.address}, {business.city}, Uganda.
              </p>
              <p className="text-slate-600">
                Opening Hours: <strong>{business.openingHours}</strong>
              </p>
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${business.name} ${business.address} ${business.city} Uganda`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-[11px]"
                >
                  <span>Open in Google Maps</span>
                  <Globe className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Navigation Tabs within Profile */}
          <div className="flex items-center gap-2 border-b border-slate-200 pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview & Services
            </button>

            {vehicles.length > 0 && (
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'vehicles'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Vehicles ({vehicles.length})</span>
              </button>
            )}

            {spareParts.length > 0 && (
              <button
                onClick={() => setActiveTab('parts')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'parts'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Spare Parts ({spareParts.length})</span>
              </button>
            )}

            {business.gallery.length > 0 && (
              <button
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo Gallery</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Reviews ({business.reviews.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description & Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-extrabold text-slate-900">About {business.name}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </div>

            {/* Services Checklist */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-extrabold text-slate-900">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {business.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Details Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Operating Hours & Contact</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Working Hours</span>
                    <span className="text-slate-500">{business.openingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Official Telephone</span>
                    <a href={getPhoneLink(business.phone)} className="text-amber-600 font-semibold">
                      {business.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Email Address</span>
                    <span className="text-slate-600">{business.email}</span>
                  </div>
                </div>

                {business.website && (
                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Website</span>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">Vehicles in Stock ({vehicles.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isSaved={savedIds.includes(v.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewVehicle}
                onEnquire={() =>
                  onEnquire({
                    type: 'vehicle',
                    id: v.id,
                    title: v.title,
                    businessId: business.id,
                    businessName: business.name,
                    phone: business.phone,
                    whatsapp: business.whatsapp,
                    price: v.priceUgx,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Spare Parts Tab */}
      {activeTab === 'parts' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">Spare Parts in Stock ({spareParts.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spareParts.map((p) => (
              <SparePartCard
                key={p.id}
                part={p}
                onEnquire={() =>
                  onEnquire({
                    type: 'spare_part',
                    id: p.id,
                    title: p.title,
                    businessId: business.id,
                    businessName: business.name,
                    phone: business.phone,
                    whatsapp: business.whatsapp,
                    price: p.priceUgx,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">Workshop & Facility Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {business.gallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Customer Reviews</h2>
              <p className="text-xs text-slate-500">Verified Ugandan customer experiences</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600">{business.rating}</span>
              <span className="text-xs text-slate-400 block">/ 5.0 Rating</span>
            </div>
          </div>

          <div className="space-y-4">
            {business.reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No customer reviews written yet.</p>
            ) : (
              business.reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{r.authorName}</span>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(r.rating) ? 'fill-amber-500' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
