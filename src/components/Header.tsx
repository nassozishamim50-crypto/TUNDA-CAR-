import React, { useState } from 'react';
import {
  Car,
  Wrench,
  Building2,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Bookmark,
  Menu,
  X,
  PhoneCall,
  Settings,
} from 'lucide-react';
import { UserRole } from '../services/auth.service';
import { useSettings } from '../context/SettingsContext';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  savedCount,
  onOpenSaved,
  userRole,
  onChangeRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();

  const handleNav = (tab: string, param?: string) => {
    onNavigate(tab, param);
    setMobileMenuOpen(false);
  };

  const formattedKPrice = `${(settings.subscriptionPriceUgx / 1000).toFixed(0)}k/yr`;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top micro bar for Uganda info & Role Switcher */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {settings.businessName}
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Uganda's Premier Automotive Marketplace (UGX)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Mode:</span>
            <select
              value={userRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-slate-900 border border-slate-700 text-amber-400 text-xs rounded px-2 py-0.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              title="Switch role to inspect different system areas"
            >
              <option value="business_owner">Business Owner (Pearl Motors)</option>
              <option value="visitor">Buyer / Visitor</option>
              <option value="admin">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tagline */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {settings.businessName || 'TUNDA CAR'}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  UG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block tracking-wide">
                Find Cars • Find Parts • Find Trusted Auto Businesses
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                currentTab === 'home'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('cars')}
              className={`px-3 py-2 text-sm font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                currentTab === 'cars'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-4 h-4 text-amber-400" />
              Cars
            </button>
            <button
              onClick={() => handleNav('spare-parts')}
              className={`px-3 py-2 text-sm font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                currentTab === 'spare-parts'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              Spare Parts
            </button>
            <button
              onClick={() => handleNav('businesses')}
              className={`px-3 py-2 text-sm font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                currentTab === 'businesses'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              Businesses
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Saved items */}
            <button
              onClick={onOpenSaved}
              className="relative p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Saved Vehicles & Parts"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Business Portal / Dashboard */}
            {userRole === 'business_owner' ? (
              <button
                onClick={() => handleNav('dashboard')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
            ) : userRole === 'admin' ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleNav('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                    currentTab === 'admin'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={() => handleNav('admin-settings')}
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                    currentTab === 'admin-settings'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                  }`}
                  title="Admin Global Settings"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden xl:inline">Settings</span>
                </button>
              </div>
            ) : null}

            {/* List Your Business Button (Dynamic Price CTA) */}
            <button
              onClick={() => handleNav('list-your-business')}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Business</span>
              <span className="bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-black">
                {formattedKPrice}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentTab === 'home' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('cars')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentTab === 'cars' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              Vehicles & Cars
            </span>
            <span className="text-xs text-slate-400">Marketplace</span>
          </button>
          <button
            onClick={() => handleNav('spare-parts')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentTab === 'spare-parts' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Spare Parts
            </span>
            <span className="text-xs text-slate-400">Categories</span>
          </button>
          <button
            onClick={() => handleNav('businesses')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentTab === 'businesses' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Auto Businesses & Garages
            </span>
            <span className="text-xs text-slate-400">Directory</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNav('list-your-business')}
              className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Business — {settings.subscriptionName}</span>
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Business Owner Dashboard</span>
            </button>

            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Admin Moderation</span>
                </button>
                <button
                  onClick={() => handleNav('admin-settings')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Settings (Contact & Payments)</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

