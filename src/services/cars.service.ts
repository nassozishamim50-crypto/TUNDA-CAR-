import { Vehicle, UgandaLocation, VehicleBodyType, VehicleCondition, FuelType, TransmissionType } from '../types';
import { SAMPLE_VEHICLES } from '../data/sampleData';

const LOCAL_STORAGE_KEY = 'autolink_vehicles_store';

function getStoredVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return SAMPLE_VEHICLES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_VEHICLES;
  } catch (e) {
    return SAMPLE_VEHICLES;
  }
}

function saveVehicles(vehicles: Vehicle[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (e) {
    console.error('Failed to save vehicles to local store', e);
  }
}

export interface VehicleFilterParams {
  query?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  bodyType?: VehicleBodyType;
  condition?: VehicleCondition;
  location?: UgandaLocation | 'All Locations';
  sellerId?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'year_desc';
}

export const carsService = {
  async getAllVehicles(): Promise<Vehicle[]> {
    // Simulated async call matching Supabase client signature:
    // const { data, error } = await supabase.from('vehicles').select('*');
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredVehicles()), 30);
    });
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const list = getStoredVehicles();
    return list.find((v) => v.id === id) || null;
  },

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const list = getStoredVehicles();
    return list.filter((v) => v.isFeatured);
  },

  async filterVehicles(params: VehicleFilterParams): Promise<Vehicle[]> {
    let list = getStoredVehicles();

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.sellerName.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    if (params.make && params.make !== 'All Makes') {
      list = list.filter((v) => v.make.toLowerCase() === params.make?.toLowerCase());
    }

    if (params.model) {
      list = list.filter((v) => v.model.toLowerCase().includes(params.model!.toLowerCase()));
    }

    if (params.minPrice) {
      list = list.filter((v) => v.priceUgx >= params.minPrice!);
    }

    if (params.maxPrice) {
      list = list.filter((v) => v.priceUgx <= params.maxPrice!);
    }

    if (params.minYear) {
      list = list.filter((v) => v.year >= params.minYear!);
    }

    if (params.maxYear) {
      list = list.filter((v) => v.year <= params.maxYear!);
    }

    if (params.maxMileage) {
      list = list.filter((v) => v.mileageKm <= params.maxMileage!);
    }

    if (params.fuelType) {
      list = list.filter((v) => v.fuelType === params.fuelType);
    }

    if (params.transmission) {
      list = list.filter((v) => v.transmission === params.transmission);
    }

    if (params.bodyType) {
      list = list.filter((v) => v.bodyType === params.bodyType);
    }

    if (params.condition) {
      list = list.filter((v) => v.condition === params.condition);
    }

    if (params.location && params.location !== 'All Locations') {
      list = list.filter((v) => v.location === params.location);
    }

    if (params.sellerId) {
      list = list.filter((v) => v.sellerId === params.sellerId);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          list.sort((a, b) => a.priceUgx - b.priceUgx);
          break;
        case 'price_desc':
          list.sort((a, b) => b.priceUgx - a.priceUgx);
          break;
        case 'mileage_asc':
          list.sort((a, b) => a.mileageKm - b.mileageKm);
          break;
        case 'year_desc':
          list.sort((a, b) => b.year - a.year);
          break;
        case 'newest':
        default:
          list.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
          break;
      }
    }

    return list;
  },

  async addVehicle(vehicleData: Omit<Vehicle, 'id' | 'datePosted'>): Promise<Vehicle> {
    const list = getStoredVehicles();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      datePosted: new Date().toISOString().split('T')[0],
    };
    list.unshift(newVehicle);
    saveVehicles(list);
    return newVehicle;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    const list = getStoredVehicles();
    const filtered = list.filter((v) => v.id !== id);
    saveVehicles(filtered);
    return true;
  },
};
