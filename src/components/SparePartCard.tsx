import React from 'react';
import { MapPin, ShieldCheck, MessageCircle, Phone, Mail, Wrench } from 'lucide-react';
import { SparePart } from '../types';
import { formatUgx, getWhatsAppLink, getPhoneLink } from '../utils/formatters';

interface SparePartCardProps {
  part: SparePart;
  onEnquire: (part: SparePart) => void;
  onFilterMake?: (make: string) => void;
}

export const SparePartCard: React.FC<SparePartCardProps> = ({ part, onEnquire, onFilterMake }) => {
  const whatsappMsg = `Hello ${part.sellerName}, I would like to buy "${part.title}" (${formatUgx(
    part.priceUgx
  )}) listed on TUNDA CAR. Is it in stock?`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Header */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={part.images[0] || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'}
          alt={part.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          <span className="bg-slate-900/90 backdrop-blur-xs text-amber-400 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            {part.category}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
              part.condition === 'Brand New'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {part.condition}
          </span>
        </div>

        {part.isVerified && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Supplier
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-lg font-black text-amber-600 tracking-tight">
              {formatUgx(part.priceUgx)}
            </span>
            <span className="text-xs text-slate-400 font-medium">UGX</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2" title={part.title}>
            {part.title}
          </h3>

          {/* Compatibility badge */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-2 text-xs text-amber-900 mb-2.5">
            <div className="font-semibold flex items-center gap-1 text-[11px] text-amber-800">
              <Wrench className="w-3 h-3 text-amber-600" />
              <span>Compatibility:</span>
            </div>
            <p className="line-clamp-1 font-medium text-slate-800">
              {part.vehicleMake} {part.vehicleModel} ({part.yearCompatibility})
            </p>
            {part.partNumber && (
              <span className="text-[10px] text-slate-500 block mt-0.5">
                OEM Part No: <span className="font-mono font-bold text-slate-700">{part.partNumber}</span>
              </span>
            )}
          </div>

          {/* Location & Seller */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1 truncate max-w-[50%]">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{part.location}</span>
            </div>
            <span className="truncate text-slate-700 font-medium max-w-[50%] text-right">
              {part.sellerName}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5">
          <a
            href={getWhatsAppLink(part.sellerWhatsapp, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
            title="WhatsApp Seller"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 fill-emerald-600 text-white" />
            <span className="truncate">WhatsApp</span>
          </a>

          <a
            href={getPhoneLink(part.sellerPhone)}
            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            title="Call Supplier"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-700" />
            <span className="truncate">Call</span>
          </a>

          <button
            onClick={() => onEnquire(part)}
            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
