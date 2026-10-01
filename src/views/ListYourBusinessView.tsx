import React, { useState } from 'react';
import {
  CheckCircle2,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Sparkles,
  ShieldCheck,
  Send,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  BusinessCategory,
  BUSINESS_CATEGORIES,
  UgandaLocation,
  UGANDA_LOCATIONS,
} from '../types';
import { businessService } from '../services/business.service';
import { useSettings } from '../context/SettingsContext';
import { formatUgx } from '../utils/formatters';

interface ListYourBusinessViewProps {
  onSuccess: (newBusinessSlug: string) => void;
  onNavigateToDashboard: () => void;
}

const BENEFITS = [
  'Professional business profile on Uganda’s dedicated auto directory',
  'High search visibility on Google and TUNDA CAR marketplace',
  'Verified listing badge after compliance approval',
  'Direct customer enquiries through WhatsApp with pre-filled messages',
  'One-click direct phone calls from buyers',
  'Business showcase photos and workshop gallery',
  'Unlimited vehicle listings with detailed specifications',
  'Spare-parts catalog with part number & compatibility filters',
  'Interactive location address and Google Maps routing',
  'Centralized customer enquiries inbox',
];

export const ListYourBusinessView: React.FC<ListYourBusinessViewProps> = ({
  onSuccess,
  onNavigateToDashboard,
}) => {
  const { settings } = useSettings();

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+256 ');
  const [whatsapp, setWhatsapp] = useState('+256 ');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Car Dealership');
  const [district, setDistrict] = useState('Kampala');
  const [city, setCity] = useState<UgandaLocation>('Kampala');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [servicesInput, setServicesInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const servicesArray = servicesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await businessService.registerBusiness({
        name: businessName.trim(),
        category,
        district: district.trim(),
        city,
        address: address.trim() || `${district}, Uganda`,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        website: website.trim() || undefined,
        description: description.trim() || `${businessName} provides ${category} services in ${city}, Uganda.`,
        services: servicesArray,
      });

      setRegisteredSuccess(created.slug);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Business Partner Program</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Get Your Automotive Business Found by Customers Across Uganda
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Join Uganda's leading network of car dealerships, bonded warehouses, spare parts suppliers,
          and auto repair garages.
        </p>

        {/* Pricing Pill */}
        <div className="inline-block bg-slate-950 p-4 rounded-2xl border border-slate-800 mt-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            {settings.subscriptionName}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight mt-1">
            {formatUgx(settings.subscriptionPriceUgx)}{' '}
            <span className="text-sm font-semibold text-slate-300">
              / {settings.subscriptionPeriodMonths === 12 ? 'YEAR' : `${settings.subscriptionPeriodMonths} MONTHS`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {settings.subscriptionDescription}
          </span>
        </div>
      </div>

      {registeredSuccess ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Business Registration Submitted!</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Congratulations! Your automotive business profile has been initialized in our system. Next, your
            account is queued for administrative verification and subscription activation.
          </p>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
            <span className="font-bold block text-sm">Next Steps:</span>
            <p>1. Administrative team verifies registration credentials.</p>
            <p>
              2. Subscription status: <strong>Pending {formatUgx(settings.subscriptionPriceUgx)} activation</strong>.
            </p>
            <p>3. You can now access your dashboard to add vehicles, spare parts, and view enquiries.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onSuccess(registeredSuccess)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              View Public Business Profile
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
            >
              Open Business Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Left Column: Benefits Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <span>What's Included:</span>
              </h2>

              <ul className="space-y-3.5 text-xs text-slate-700">
                {BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl text-[11px] text-slate-600 space-y-2">
                <span className="font-bold text-slate-800 block">Subscription Payment Methods:</span>
                <p>
                  Supports MTN Mobile Money, Airtel Money, and local Bank Transfer. Real-world gateway
                  verification applies.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
            >
              <h2 className="text-xl font-black text-slate-900">Business Registration Form</h2>

              {/* Business Name & Owner Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Spearhead Auto Motors"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Owner / Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Sarah Nalubega"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 701 234 567"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+256 701 234 567"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Email & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@yourcompany.ug"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City and District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {UGANDA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Kampala, Wakiso, Mukono"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physical Address / Plot / Street
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 24 Jinja Road, Nakawa / Kisekka Market Shop B12"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Services offered */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Services Offered <span className="text-slate-400 font-normal">(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="e.g. Engine Overhauls, Diagnostics, Wheel Alignment, Car Wash, Battery Health Test"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Description & Value Proposition
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell Ugandan motorists and buyers about your garage, warranty terms, Japanese import ties, or genuine parts warranty..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Website & Social Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Website <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Social Media / Facebook Page
                  </label>
                  <input
                    type="text"
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(e.target.value)}
                    placeholder="e.g. @AutoMotorsUg"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Registering...' : `REGISTER & ACTIVATE (${formatUgx(settings.subscriptionPriceUgx)} / ${settings.subscriptionPeriodMonths === 12 ? 'YR' : `${settings.subscriptionPeriodMonths}M`})`}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
