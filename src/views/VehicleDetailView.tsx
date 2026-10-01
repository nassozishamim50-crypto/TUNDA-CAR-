import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Fuel,
  ShieldCheck,
  Heart,
  Phone,
  MessageCircle,
  Mail,
  Share2,
  Calendar,
  CheckCircle,
  Building2,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatUgx, formatMileage, getWhatsAppLink, getPhoneLink } from '../utils/formatters';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  onBack: () => void;
  onEnquire: (vehicle: Vehicle) => void;
  onViewBusiness: (sellerId: string) => void;
  isSaved: boolean;
  onToggleSave: (vehicleId: string) => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  onBack,
  onEnquire,
  onViewBusiness,
  isSaved,
  onToggleSave,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const whatsappMessage = `Hello ${vehicle.sellerName}, I am interested in your ${vehicle.year} ${vehicle.title} priced at ${formatUgx(
    vehicle.priceUgx
  )} listed on TUNDA CAR. Can you provide more details?`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${vehicle.year} ${vehicle.title} - TUNDA CAR`,
          text: `Check out this ${vehicle.title} in ${vehicle.location} on TUNDA CAR`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vehicles</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-amber-600 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Share this listing"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => onToggleSave(vehicle.id)}
            className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isSaved
                ? 'bg-amber-500 border-amber-500 text-slate-950'
                : 'bg-white border-slate-200 text-slate-700 hover:text-amber-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Specs vs Action & Seller Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Gallery, Key Specs, Description, Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-3">
            <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden shadow-inner">
              <img
                src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded">
                  {vehicle.condition}
                </span>
                {vehicle.isVerified && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Inspection
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header (Mobile and Desktop) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {vehicle.make} • {vehicle.year}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{vehicle.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{vehicle.location}</span>
                  {vehicle.addressDetail && <span>• {vehicle.addressDetail}</span>}
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Price in Uganda</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                  {formatUgx(vehicle.priceUgx)}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Taxes / Bond Duty Included</span>
              </div>
            </div>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Mileage</span>
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <span>{formatMileage(vehicle.mileageKm)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Year</span>
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>{vehicle.year}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Fuel</span>
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Fuel className="w-4 h-4 text-amber-500" />
                  <span>{vehicle.fuelType}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Transmission</span>
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>{vehicle.transmission}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Engine Capacity</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                  {vehicle.engineSizeCc} cc
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Body Type</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">{vehicle.bodyType}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Exterior Color</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">{vehicle.color}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold block">Condition</span>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">{vehicle.condition}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500" />
              <span>Seller's Description</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Features Checklist */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-black text-base text-slate-900">Key Vehicle Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {vehicle.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Contact Seller Card, Instant Actions, Safety Tips */}
        <div className="space-y-6">
          {/* Action CTAs Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 sticky top-20">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase">Seller / Dealership</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">{vehicle.sellerName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{vehicle.location}</span>
                {vehicle.isVerified && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 ml-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="space-y-2.5">
              <a
                href={getWhatsAppLink(vehicle.sellerWhatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>WHATSAPP SELLER</span>
              </a>

              <a
                href={getPhoneLink(vehicle.sellerPhone)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>CALL SELLER</span>
              </a>

              <button
                onClick={() => onEnquire(vehicle)}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <Mail className="w-4 h-4" />
                <span>SEND ENQUIRY</span>
              </button>

              <button
                onClick={() => onToggleSave(vehicle.id)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'text-amber-500 fill-amber-500' : ''}`} />
                <span>{isSaved ? 'SAVED TO MY LIST' : 'SAVE VEHICLE'}</span>
              </button>
            </div>

            {/* View Full Business Profile Link */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onViewBusiness(vehicle.sellerId)}
                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-amber-600 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <span>View Seller Profile & Inventory</span>
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Safety & Buying Guidelines */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800 block">Ugandan Car Buyer Safety Tip:</span>
              <p>
                Always verify the URA digital logbook and have an independent mechanic inspect the chassis and engine
                prior to making cash payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
