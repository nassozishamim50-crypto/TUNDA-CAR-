import React from 'react';
import { MapPin, Gauge, Fuel, ShieldCheck, Heart, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Vehicle } from '../types';
import { formatUgx, formatMileage, getWhatsAppLink, getPhoneLink } from '../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSaved?: boolean;
  onToggleSave?: (vehicleId: string) => void;
  onViewDetails: (vehicleId: string) => void;
  onEnquire?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  onEnquire,
}) => {
  const whatsappMsg = `Hello ${vehicle.sellerName}, I am interested in your ${vehicle.year} ${vehicle.title} listed for ${formatUgx(vehicle.priceUgx)} on TUNDA CAR. Is it still available?`;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onViewDetails(vehicle.id)}
          loading="lazy"
        />

        {/* Condition Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-sm ${
              vehicle.condition === 'Foreign Used / In Bond'
                ? 'bg-blue-600 text-white'
                : vehicle.condition === 'Brand New'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {vehicle.condition}
          </span>
          {vehicle.isVerified && (
            <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Save / Bookmark Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(vehicle.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-amber-500 text-slate-950 scale-105'
                : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save vehicle'}
            aria-label="Save vehicle"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
          </button>
        )}

        {/* Year Pill */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-black px-2 py-0.5 rounded">
          {vehicle.year}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-lg font-black text-amber-600 tracking-tight">
              {formatUgx(vehicle.priceUgx)}
            </span>
            <span className="text-xs text-slate-400 font-medium">UGX</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(vehicle.id)}
            className="font-bold text-slate-900 text-sm hover:text-amber-600 cursor-pointer line-clamp-1 transition-colors"
            title={vehicle.title}
          >
            {vehicle.title}
          </h3>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-100 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formatMileage(vehicle.mileageKm)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="truncate bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                {vehicle.transmission}
              </span>
            </div>
          </div>

          {/* Location & Seller */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1 truncate max-w-[55%]">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate font-medium">{vehicle.location}</span>
            </div>
            <span className="truncate text-slate-600 font-semibold max-w-[45%] text-right">
              {vehicle.sellerName}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5">
          <a
            href={getWhatsAppLink(vehicle.sellerWhatsapp, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
            title="Chat with seller on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 fill-emerald-600 text-white" />
            <span className="truncate">WhatsApp</span>
          </a>

          <a
            href={getPhoneLink(vehicle.sellerPhone)}
            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            title="Call seller directly"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-700" />
            <span className="truncate">Call</span>
          </a>

          <button
            onClick={() => onViewDetails(vehicle.id)}
            className="flex items-center justify-center gap-0.5 py-2 px-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
