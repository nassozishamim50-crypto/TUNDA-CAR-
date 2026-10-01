import React from 'react';
import { Car, Phone, Mail, MapPin, ShieldCheck, Heart, Globe, Clock } from 'lucide-react';
import { UGANDA_LOCATIONS } from '../types';
import { useSettings } from '../context/SettingsContext';
import { formatUgx } from '../utils/formatters';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-14 pb-20 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-slate-950">
                <Car className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                {settings.businessName}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Uganda's premier automotive ecosystem connecting motorists, car buyers, and fleet
              owners with verified dealerships, genuine spare-parts importers, trusted garages,
              and automotive mechanics across Uganda.
            </p>
            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.physicalAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Customer Care: <a href={`tel:${settings.mainPhone}`} className="hover:text-emerald-300 font-semibold">{settings.mainPhone}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span><a href={`mailto:${settings.emailAddress}`} className="hover:text-amber-300">{settings.emailAddress}</a></span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
            </div>

            {/* Social Links */}
            {(settings.facebookUrl || settings.instagramUrl || settings.tiktokUrl || settings.googleMapsUrl) && (
              <div className="flex items-center gap-3 pt-1 text-xs font-bold text-amber-400">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                    Facebook
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                    Instagram
                  </a>
                )}
                {settings.tiktokUrl && (
                  <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                    TikTok
                  </a>
                )}
                {settings.googleMapsUrl && (
                  <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Maps</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Vehicles & Cars for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spare-parts')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Genuine Spare Parts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('businesses')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Automotive Businesses Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('list-your-business')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  List Your Business ({formatUgx(settings.subscriptionPriceUgx)}/yr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Business Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs">Auto Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('businesses', 'Car Dealership')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Car Dealerships & Bonds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('businesses', 'Garage')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Garages & Diagnostics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('businesses', 'Spare Parts')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Japanese & German Spares
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('businesses', 'Tyre Dealer')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Tyres & 4x4 Offroad Fitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('businesses', 'Battery Dealer')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Car Batteries & Diagnostics
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs">Locations</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {UGANDA_LOCATIONS.slice(0, 8).map((loc) => (
                <button
                  key={loc}
                  onClick={() => onNavigate('cars', loc)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded border border-slate-800 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
            <div className="pt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Ugandan Automotive Hubs
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer on sample preview & transparent architecture */}
        <div className="border-t border-slate-900 pt-6 pb-2 text-xs text-slate-400 text-center space-y-1">
          <p>
            © {new Date().getFullYear()} {settings.businessName || 'TUNDA CAR'}. Tagline: Find Cars. Find Parts. Find Trusted
            Auto Businesses.
          </p>
          <p className="text-slate-400 text-[11px]">
            Notice: Sample demo dataset is displayed for development preview. {settings.businessName || 'TUNDA CAR'} enforces
            strict verified business listings with live contacts via WhatsApp and telephone.
          </p>
        </div>
      </div>
    </footer>
  );
};
