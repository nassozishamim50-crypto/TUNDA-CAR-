import React, { useState, useEffect } from 'react';
import {
  Save,
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Globe,
  CreditCard,
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Lock,
  Calendar,
  Share2,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { AdminSettings } from '../types';
import { formatUgx } from '../utils/formatters';
import { UserRole } from '../services/auth.service';

interface AdminSettingsViewProps {
  userRole: UserRole;
  onSwitchToAdmin?: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  userRole,
  onSwitchToAdmin,
}) => {
  const { settings, updateSettings, refreshSettings } = useSettings();

  // Local form state
  const [formData, setFormData] = useState<AdminSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'contact' | 'payment' | 'subscription' | 'methods' | 'preview'>('contact');

  // Sync if settings update externally
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Security Gate
  if (userRole !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Restricted Access: Administrators Only</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The Global Configuration & Settings console contains sensitive administrative parameters.
          Normal customers and business owners cannot access or modify these records.
        </p>

        {onSwitchToAdmin && (
          <div className="pt-4">
            <button
              onClick={onSwitchToAdmin}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Simulate Admin Login
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleChange = (field: keyof AdminSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrors({});

    const res = await updateSettings(formData, 'Administrator (admin@tundacar.ug)');
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Settings successfully saved and synchronized across TUNDA CAR!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (res.errors) {
      setErrors(res.errors);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset form fields to last saved database state?')) {
      setFormData(settings);
      setErrors({});
      setSuccessMessage(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Admin-Only Global Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            System Configuration & Payment Control
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Centralized settings store. Updates made here automatically propagate across the website,
            footer, public business registration, merchant subscription invoices, and contact channels.
          </p>
        </div>

        {/* Audit metadata pill */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1 sm:text-right shrink-0">
          <div className="text-slate-300 font-bold flex items-center sm:justify-end gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Last Updated:</span>
          </div>
          <div className="text-amber-400 font-mono text-xs">
            {new Date(formData.updated_at).toLocaleString()}
          </div>
          <div className="text-slate-500">By: {formData.updated_by}</div>
        </div>
      </div>

      {/* Security Guidance Note */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black text-rose-900 block">Security & Credential Isolation Policy:</span>
          <p className="leading-relaxed">
            TUNDA CAR never collects, displays, or stores mobile-money PINs or banking passwords.
            API secret tokens for telecom aggregators (e.g. Flutterwave, MTN MoMo OpenAPI, Airtel Developer)
            must strictly reside in secure server-side environment variables (`.env`) and never be exposed in client code.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-4 flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* General Form Error if any */}
      {errors.general && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl p-4 flex items-center gap-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Main Settings Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSection === 'contact'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Business Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('payment')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSection === 'payment'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('subscription')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSection === 'subscription'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Subscription Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('methods')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSection === 'methods'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Payment Methods Toggle</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('preview')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeSection === 'preview'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Customer Preview</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: BUSINESS CONTACT */}
        {activeSection === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>Business Contact Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official contact channels displayed on the homepage, footer, email templates, and direction cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Business Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.businessName ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  } focus:outline-none focus:border-amber-500`}
                />
                {errors.businessName && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.businessName}</span>
                )}
              </div>

              {/* Main Phone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Main Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mainPhone}
                  onChange={(e) => handleChange('mainPhone', e.target.value)}
                  placeholder="+256 700 000 000"
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.mainPhone ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  } focus:outline-none focus:border-amber-500`}
                />
                {errors.mainPhone && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.mainPhone}</span>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp Support Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="+256 701 234 567"
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.whatsappNumber ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  } focus:outline-none focus:border-amber-500`}
                />
                {errors.whatsappNumber && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.whatsappNumber}</span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Support Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.emailAddress}
                  onChange={(e) => handleChange('emailAddress', e.target.value)}
                  placeholder="support@tundacar.ug"
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.emailAddress ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  } focus:outline-none focus:border-amber-500`}
                />
                {errors.emailAddress && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.emailAddress}</span>
                )}
              </div>

              {/* Physical Address */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Physical Office Address
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress}
                  onChange={(e) => handleChange('physicalAddress', e.target.value)}
                  placeholder="Plot 42 Jinja Road, Nakawa, Kampala, Uganda"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Google Maps URL */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Google Maps URL / Coordinates Link
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Business Hours */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Official Business Hours
                </label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => handleChange('businessHours', e.target.value)}
                  placeholder="Mon - Sat: 8:00 AM - 6:00 PM | Sun: Closed"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/tundacar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/tundacar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">TikTok URL</label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@tundacar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PAYMENT INFORMATION */}
        {activeSection === 'payment' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Payment Information (Deposit Accounts)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official billing recipient accounts provided to dealerships and merchants when paying for listings.
              </p>
            </div>

            {/* Mobile Money Sub-Section */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span>Mobile Money Recipient Accounts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* MTN MoMo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    MTN Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mtnNumber}
                    onChange={(e) => handleChange('mtnNumber', e.target.value)}
                    placeholder="+256 788 123 456"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    MTN Registered Name
                  </label>
                  <input
                    type="text"
                    value={formData.mtnRegisteredName}
                    onChange={(e) => handleChange('mtnRegisteredName', e.target.value)}
                    placeholder="TUNDA CAR LTD"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                {/* Airtel Money */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Airtel Money Number
                  </label>
                  <input
                    type="tel"
                    value={formData.airtelNumber}
                    onChange={(e) => handleChange('airtelNumber', e.target.value)}
                    placeholder="+256 755 123 456"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Airtel Registered Name
                  </label>
                  <input
                    type="text"
                    value={formData.airtelRegisteredName}
                    onChange={(e) => handleChange('airtelRegisteredName', e.target.value)}
                    placeholder="TUNDA CAR SMC LTD"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer Sub-Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>Commercial Bank Account Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Stanbic Bank Uganda"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={formData.bankBranch}
                    onChange={(e) => handleChange('bankBranch', e.target.value)}
                    placeholder="Forest Mall Branch, Lugogo, Kampala"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={formData.bankAccountName}
                    onChange={(e) => handleChange('bankAccountName', e.target.value)}
                    placeholder="TUNDA CAR COMMERCIAL AC"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                    placeholder="9030012345678"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Payment Instructions & Narration Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bankPaymentInstructions}
                    onChange={(e) => handleChange('bankPaymentInstructions', e.target.value)}
                    placeholder="Include your Business Name or TUNDA CAR Reference ID as the payment reference or deposit narration."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SUBSCRIPTION PRICING */}
        {activeSection === 'subscription' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span>Subscription Plan & Pricing</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the listing fee for Ugandan automotive businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Annual Subscription Price (UGX) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">UGX</span>
                  <input
                    type="number"
                    step="5000"
                    min="10000"
                    required
                    value={formData.subscriptionPriceUgx}
                    onChange={(e) => handleChange('subscriptionPriceUgx', Number(e.target.value))}
                    className="w-full pl-14 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 font-black text-sm"
                  />
                </div>
                {errors.subscriptionPriceUgx && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.subscriptionPriceUgx}</span>
                )}
                <span className="text-[11px] text-slate-400 block mt-1">
                  Formatted: {formatUgx(formData.subscriptionPriceUgx)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Subscription Duration (Months) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  required
                  value={formData.subscriptionPeriodMonths}
                  onChange={(e) => handleChange('subscriptionPeriodMonths', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 font-bold"
                />
                {errors.subscriptionPeriodMonths && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.subscriptionPeriodMonths}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Subscription Package Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.subscriptionName}
                  onChange={(e) => handleChange('subscriptionName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Package Description & Benefits Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.subscriptionDescription}
                  onChange={(e) => handleChange('subscriptionDescription', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: PAYMENT METHODS ENABLEMENT */}
        {activeSection === 'methods' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-500" />
                <span>Payment Methods Gateways Enablement</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle which payment channels are visible and accepted on the billing checkout screens.
              </p>
            </div>

            <div className="space-y-4">
              {/* MTN MoMo Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">MTN Mobile Money</h4>
                  <p className="text-[11px] text-slate-500">
                    Accept merchant USSD pushes & direct payments to {formData.mtnNumber} ({formData.mtnRegisteredName})
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableMtnMomo}
                    onChange={(e) => handleChange('enableMtnMomo', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Airtel Money Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Airtel Money</h4>
                  <p className="text-[11px] text-slate-500">
                    Accept payments to {formData.airtelNumber} ({formData.airtelRegisteredName})
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableAirtelMoney}
                    onChange={(e) => handleChange('enableAirtelMoney', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Bank Transfer Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bank Transfer / Cash Deposit</h4>
                  <p className="text-[11px] text-slate-500">
                    Direct EFT or bank counter slip deposit into {formData.bankName}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableBankTransfer}
                    onChange={(e) => handleChange('enableBankTransfer', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Online Payment Gateway Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Online Payment Gateway</h4>
                  <p className="text-[11px] text-slate-500">
                    Visa, Mastercard, & Automated Telecom PSP web checkout
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableOnlineGateway}
                    onChange={(e) => handleChange('enableOnlineGateway', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: LIVE PUBLIC PREVIEW */}
        {activeSection === 'preview' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-500" />
                <span>Live Public Preview of Configured Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify exactly how customers and merchants see your updated business contact and payment details.
              </p>
            </div>

            {/* Preview 1: Footer Preview Card */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                1. Footer & Platform Contact Preview
              </span>
              <div className="p-5 rounded-2xl bg-slate-950 text-slate-300 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base">{formData.businessName}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                    UG
                  </span>
                </div>
                <p className="text-slate-400">{formData.physicalAddress}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Customer Care: {formData.mainPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>WhatsApp Support: {formData.whatsappNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Email: {formData.emailAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Hours: {formData.businessHours}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-900 text-[11px] text-amber-400 font-bold">
                  {formData.facebookUrl && <a href={formData.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}
                  {formData.instagramUrl && <a href={formData.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>}
                  {formData.tiktokUrl && <a href={formData.tiktokUrl} target="_blank" rel="noreferrer">TikTok</a>}
                  {formData.googleMapsUrl && <a href={formData.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps</a>}
                </div>
              </div>
            </div>

            {/* Preview 2: Subscription Card Preview */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                2. Subscription Card Preview (List Your Business Page)
              </span>
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 max-w-md space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2.5 py-0.5 rounded">
                  {formData.subscriptionName}
                </span>
                <div className="text-3xl font-black text-amber-950 tracking-tight">
                  {formatUgx(formData.subscriptionPriceUgx)}{' '}
                  <span className="text-xs font-semibold text-slate-600">
                    / {formData.subscriptionPeriodMonths} Months
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {formData.subscriptionDescription}
                </p>
              </div>
            </div>

            {/* Preview 3: Merchant Billing Instructions Preview */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                3. Merchant Billing Checkout Instructions Preview
              </span>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <span className="font-bold text-slate-900 block text-sm">
                  Active Payment Gateways:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.enableMtnMomo && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-black text-amber-700 block">MTN Mobile Money</span>
                      <p className="text-slate-600 font-mono font-bold">{formData.mtnNumber}</p>
                      <p className="text-[11px] text-slate-500">{formData.mtnRegisteredName}</p>
                    </div>
                  )}

                  {formData.enableAirtelMoney && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-black text-rose-700 block">Airtel Money</span>
                      <p className="text-slate-600 font-mono font-bold">{formData.airtelNumber}</p>
                      <p className="text-[11px] text-slate-500">{formData.airtelRegisteredName}</p>
                    </div>
                  )}

                  {formData.enableBankTransfer && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 sm:col-span-2 space-y-1">
                      <span className="font-black text-slate-800 block">
                        Bank: {formData.bankName} ({formData.bankBranch})
                      </span>
                      <p className="text-slate-700 font-medium">A/C Name: {formData.bankAccountName}</p>
                      <p className="text-slate-900 font-mono font-bold">A/C Number: {formData.bankAccountNumber}</p>
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        {formData.bankPaymentInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Action Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-16 md:bottom-4 z-30">
          <div className="text-xs text-slate-500">
            {Object.keys(errors).length > 0 ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Please resolve form errors before saving
              </span>
            ) : (
              <span>Save changes to write configuration to persistent storage.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
