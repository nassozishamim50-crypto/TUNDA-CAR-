import { Business, BusinessCategory, UgandaLocation } from '../types';
import { SAMPLE_BUSINESSES } from '../data/sampleData';

const LOCAL_STORAGE_KEY = 'autolink_businesses_store';

function getStoredBusinesses(): Business[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return SAMPLE_BUSINESSES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_BUSINESSES;
  } catch (e) {
    return SAMPLE_BUSINESSES;
  }
}

function saveBusinesses(businesses: Business[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businesses));
  } catch (e) {
    console.error('Failed to save businesses store', e);
  }
}

export interface BusinessFilterParams {
  query?: string;
  category?: BusinessCategory | 'All Categories';
  location?: UgandaLocation | 'All Locations';
  verifiedOnly?: boolean;
}

export const businessService = {
  async getAllBusinesses(): Promise<Business[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredBusinesses()), 30);
    });
  },

  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const list = getStoredBusinesses();
    return list.find((b) => b.slug === slug) || null;
  },

  async getBusinessById(id: string): Promise<Business | null> {
    const list = getStoredBusinesses();
    return list.find((b) => b.id === id) || null;
  },

  async filterBusinesses(params: BusinessFilterParams): Promise<Business[]> {
    let list = getStoredBusinesses();

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.district.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All Categories') {
      list = list.filter((b) => b.category === params.category);
    }

    if (params.location && params.location !== 'All Locations') {
      list = list.filter((b) => b.city === params.location);
    }

    if (params.verifiedOnly) {
      list = list.filter((b) => b.isVerified);
    }

    return list;
  },

  async registerBusiness(data: {
    name: string;
    category: BusinessCategory;
    district: string;
    city: UgandaLocation;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    website?: string;
    description: string;
    services: string[];
    logo?: string;
    coverImage?: string;
    openingHours?: string;
  }): Promise<Business> {
    const list = getStoredBusinesses();
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      tagline: `${data.category} in ${data.city}`,
      category: data.category,
      district: data.district,
      city: data.city,
      address: data.address,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      website: data.website || '',
      logo:
        data.logo ||
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80',
      coverImage:
        data.coverImage ||
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      description: data.description,
      openingHours: data.openingHours || 'Mon - Sat: 8:00 AM - 6:00 PM',
      isVerified: false, // Verification performed after administrative check
      rating: 5.0,
      reviewsCount: 0,
      services: data.services.length > 0 ? data.services : ['Customer Consultations', 'Automotive Services'],
      gallery: [],
      reviews: [],
      subscriptionStatus: 'Pending', // Awaiting UGX 100,000 payment confirmation
      subscriptionExpiry: oneYearFromNow.toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    list.unshift(newBusiness);
    saveBusinesses(list);
    return newBusiness;
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
    const list = getStoredBusinesses();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    saveBusinesses(list);
    return list[idx];
  },
};
