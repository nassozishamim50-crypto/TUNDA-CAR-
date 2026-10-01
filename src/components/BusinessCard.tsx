import React from 'react';
import { MapPin, ShieldCheck, Star, MessageCircle, Phone, ArrowRight, Clock } from 'lucide-react';
import { Business } from '../types';
import { getWhatsAppLink, getPhoneLink } from '../utils/formatters';

interface BusinessCardProps {
  business: Business;
  onViewProfile: (slug: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onViewProfile }) => {
  const whatsappMsg = `Hello ${business.name}, I found your automotive profile on TUNDA CAR and would like to enquire about your services.`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover and Logo */}
      <div className="relative h-28 bg-slate-900 overflow-hidden">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Verification badge */}
        {business.isVerified && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Business
          </div>
        )}

        {/* Category tag */}
        <div className="absolute bottom-2.5 left-20 bg-slate-900/90 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/20">
          {business.category}
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 pt-0 pb-4 flex-1 flex flex-col justify-between relative">
        {/* Floating Logo */}
        <div className="-mt-8 mb-2 flex items-end justify-between">
          <div className="w-16 h-16 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden shrink-0">
            <img
              src={business.logo}
              alt={business.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-800 border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{business.rating}</span>
            <span className="text-slate-400 text-[10px]">({business.reviewsCount})</span>
          </div>
        </div>

        <div>
          {/* Title & Tagline */}
          <h3
            onClick={() => onViewProfile(business.slug)}
            className="font-bold text-slate-900 text-base hover:text-amber-600 cursor-pointer transition-colors"
          >
            {business.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 my-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {business.city}, {business.district} ({business.address})
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
            {business.description}
          </p>

          {/* Opening Hours */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{business.openingHours}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <a
              href={getWhatsAppLink(business.whatsapp, whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
              <span>WhatsApp</span>
            </a>

            <a
              href={getPhoneLink(business.phone)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-700" />
              <span>Call</span>
            </a>
          </div>

          <button
            onClick={() => onViewProfile(business.slug)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-amber-600 text-white transition-colors"
            title="View Full Profile"
            aria-label="View Full Profile"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
