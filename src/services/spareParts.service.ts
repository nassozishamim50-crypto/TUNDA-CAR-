import { SparePart, SparePartCategory, SparePartCondition, UgandaLocation } from '../types';
import { SAMPLE_SPARE_PARTS } from '../data/sampleData';

const LOCAL_STORAGE_KEY = 'autolink_spare_parts_store';

function getStoredParts(): SparePart[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return SAMPLE_SPARE_PARTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_SPARE_PARTS;
  } catch (e) {
    return SAMPLE_SPARE_PARTS;
  }
}

function saveParts(parts: SparePart[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parts));
  } catch (e) {
    console.error('Failed to save spare parts store', e);
  }
}

export interface SparePartFilterParams {
  query?: string;
  category?: SparePartCategory | 'All Categories';
  vehicleMake?: string;
  vehicleModel?: string;
  condition?: SparePartCondition;
  location?: UgandaLocation | 'All Locations';
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}

export const sparePartsService = {
  async getAllParts(): Promise<SparePart[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredParts()), 30);
    });
  },

  async getPartById(id: string): Promise<SparePart | null> {
    const list = getStoredParts();
    return list.find((p) => p.id === id) || null;
  },

  async filterParts(params: SparePartFilterParams): Promise<SparePart[]> {
    let list = getStoredParts();

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.vehicleMake.toLowerCase().includes(q) ||
          p.vehicleModel.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.partNumber && p.partNumber.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All Categories') {
      list = list.filter((p) => p.category === params.category);
    }

    if (params.vehicleMake && params.vehicleMake !== 'All Makes') {
      list = list.filter((p) => p.vehicleMake.toLowerCase() === params.vehicleMake?.toLowerCase());
    }

    if (params.vehicleModel) {
      list = list.filter((p) => p.vehicleModel.toLowerCase().includes(params.vehicleModel!.toLowerCase()));
    }

    if (params.condition) {
      list = list.filter((p) => p.condition === params.condition);
    }

    if (params.location && params.location !== 'All Locations') {
      list = list.filter((p) => p.location === params.location);
    }

    if (params.minPrice) {
      list = list.filter((p) => p.priceUgx >= params.minPrice!);
    }

    if (params.maxPrice) {
      list = list.filter((p) => p.priceUgx <= params.maxPrice!);
    }

    if (params.sellerId) {
      list = list.filter((p) => p.sellerId === params.sellerId);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          list.sort((a, b) => a.priceUgx - b.priceUgx);
          break;
        case 'price_desc':
          list.sort((a, b) => b.priceUgx - a.priceUgx);
          break;
        case 'newest':
        default:
          list.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
          break;
      }
    }

    return list;
  },

  async addPart(partData: Omit<SparePart, 'id' | 'datePosted'>): Promise<SparePart> {
    const list = getStoredParts();
    const newPart: SparePart = {
      ...partData,
      id: `part-${Date.now()}`,
      datePosted: new Date().toISOString().split('T')[0],
    };
    list.unshift(newPart);
    saveParts(list);
    return newPart;
  },

  async deletePart(id: string): Promise<boolean> {
    const list = getStoredParts();
    const filtered = list.filter((p) => p.id !== id);
    saveParts(filtered);
    return true;
  },
};
