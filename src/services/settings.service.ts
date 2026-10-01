import { AdminSettings } from '../types';

const SETTINGS_STORAGE_KEY = 'autolink_admin_settings_store';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  id: 'global_settings',

  // Business Contact
  businessName: 'TUNDA CAR',
  mainPhone: '+256 700 000 000',
  whatsappNumber: '+256 701 234 567',
  emailAddress: 'support@tundacar.ug',
  physicalAddress: 'Plot 42 Jinja Road, Nakawa, Kampala, Uganda',
  googleMapsUrl: 'https://maps.google.com/?q=TUNDA+CAR+Nakawa+Kampala',
  facebookUrl: 'https://facebook.com/tundacar',
  instagramUrl: 'https://instagram.com/tundacar',
  tiktokUrl: 'https://tiktok.com/@tundacar',
  businessHours: 'Mon - Sat: 8:00 AM - 6:00 PM | Sun: Closed',

  // Payment Info - Mobile Money
  mtnNumber: '+256 788 123 456',
  mtnRegisteredName: 'TUNDA CAR LTD',
  airtelNumber: '+256 755 123 456',
  airtelRegisteredName: 'TUNDA CAR SMC LTD',

  // Payment Info - Bank
  bankName: 'Stanbic Bank Uganda',
  bankAccountName: 'TUNDA CAR COMMERCIAL AC',
  bankAccountNumber: '9030012345678',
  bankBranch: 'Forest Mall Branch, Lugogo, Kampala',
  bankPaymentInstructions:
    'Use your Business Name or TUNDA CAR Reference ID as the payment reference or deposit narration. Keep your receipt/SMS for priority verification.',

  // Subscription Settings
  subscriptionPriceUgx: 100000,
  subscriptionPeriodMonths: 12,
  subscriptionName: 'Verified Business Listing',
  subscriptionDescription:
    'Full 365-day verified automotive profile, directory ranking, direct customer phone and WhatsApp enquiries, and unlimited vehicle and spare parts catalogs.',

  // Payment Methods Enablement
  enableMtnMomo: true,
  enableAirtelMoney: true,
  enableBankTransfer: true,
  enableOnlineGateway: true,

  // Metadata
  created_at: '2025-01-01T08:00:00Z',
  updated_at: '2025-01-01T08:00:00Z',
  updated_by: 'SuperAdmin (system@tundacar.ug)',
};

type SettingsListener = (settings: AdminSettings) => void;
const listeners: Set<SettingsListener> = new Set();

export const settingsService = {
  getSettings(): AdminSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_ADMIN_SETTINGS;
      const parsed = JSON.parse(raw);
      if (
        parsed.businessName === 'AutoLink Uganda' ||
        parsed.businessName === 'AutoLink' ||
        parsed.businessName === '[CAR LINK - SHAM]' ||
        parsed.businessName === 'CAR LINK - SHAM'
      ) {
        parsed.businessName = 'TUNDA CAR';
        parsed.mtnRegisteredName = 'TUNDA CAR LTD';
        parsed.airtelRegisteredName = 'TUNDA CAR SMC LTD';
        parsed.bankAccountName = 'TUNDA CAR COMMERCIAL AC';
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_ADMIN_SETTINGS;
    }
  },

  async updateSettings(
    newSettings: Partial<AdminSettings>,
    adminUser: string = 'admin@tundacar.ug'
  ): Promise<{ success: boolean; settings?: AdminSettings; errors?: Record<string, string> }> {
    const current = this.getSettings();

    // Validation
    const errors: Record<string, string> = {};

    if (!newSettings.businessName || !newSettings.businessName.trim()) {
      errors.businessName = 'Business name is required.';
    }

    if (!newSettings.mainPhone || !newSettings.mainPhone.trim()) {
      errors.mainPhone = 'Main phone number is required.';
    } else if (!/^[+\d\s\-()]{7,20}$/.test(newSettings.mainPhone.trim())) {
      errors.mainPhone = 'Please enter a valid phone number (e.g. +256 700 000 000).';
    }

    if (!newSettings.whatsappNumber || !newSettings.whatsappNumber.trim()) {
      errors.whatsappNumber = 'WhatsApp number is required.';
    } else if (!/^[+\d\s\-()]{7,20}$/.test(newSettings.whatsappNumber.trim())) {
      errors.whatsappNumber = 'Please enter a valid WhatsApp number (e.g. +256 701 234 567).';
    }

    if (!newSettings.emailAddress || !newSettings.emailAddress.trim()) {
      errors.emailAddress = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSettings.emailAddress.trim())) {
      errors.emailAddress = 'Please enter a valid email address.';
    }

    if (newSettings.subscriptionPriceUgx !== undefined && newSettings.subscriptionPriceUgx <= 0) {
      errors.subscriptionPriceUgx = 'Subscription price must be greater than UGX 0.';
    }

    if (newSettings.subscriptionPeriodMonths !== undefined && newSettings.subscriptionPeriodMonths < 1) {
      errors.subscriptionPeriodMonths = 'Subscription period must be at least 1 month.';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const updated: AdminSettings = {
      ...current,
      ...newSettings,
      updated_at: new Date().toISOString(),
      updated_by: adminUser,
    };

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      listeners.forEach((listener) => listener(updated));
      return { success: true, settings: updated };
    } catch (e) {
      return {
        success: false,
        errors: { general: 'Failed to write settings to local storage database.' },
      };
    }
  },

  subscribe(listener: SettingsListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
