import { CustomerEnquiry } from '../types';

const ENQUIRIES_STORAGE_KEY = 'autolink_enquiries_store';

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'enq-1',
    businessId: 'biz-1',
    listingType: 'vehicle',
    listingId: 'veh-1',
    listingTitle: '2018 Toyota Harrier Elegance (Progress Edition)',
    customerName: 'Robert Kigozi',
    customerPhone: '+256702554433',
    customerEmail: 'rkigozi@outlook.com',
    message: 'Hello, is this Harrier still available at the Nakawa bond? Can I inspect it on Saturday morning?',
    status: 'New',
    createdAt: '2025-02-23T10:15:00Z',
  },
  {
    id: 'enq-2',
    businessId: 'biz-2',
    listingType: 'spare_part',
    listingId: 'part-1',
    listingTitle: 'Akebono Ceramic Front Brake Pads',
    customerName: 'Amina Nalule',
    customerPhone: '+256778119922',
    customerEmail: 'amina.nalule@gmail.com',
    message: 'Do you deliver to Entebbe? Can you confirm if this fits a 2016 RAV4?',
    status: 'Contacted',
    createdAt: '2025-02-22T14:40:00Z',
  },
];

function getStoredEnquiries(): CustomerEnquiry[] {
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) return INITIAL_ENQUIRIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ENQUIRIES;
  } catch (e) {
    return INITIAL_ENQUIRIES;
  }
}

function saveEnquiries(list: CustomerEnquiry[]) {
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save enquiries', e);
  }
}

export const enquiryService = {
  async submitEnquiry(data: Omit<CustomerEnquiry, 'id' | 'status' | 'createdAt'>): Promise<CustomerEnquiry> {
    const list = getStoredEnquiries();
    const newEnquiry: CustomerEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEnquiry);
    saveEnquiries(list);
    return newEnquiry;
  },

  async getEnquiriesForBusiness(businessId: string): Promise<CustomerEnquiry[]> {
    const list = getStoredEnquiries();
    return list.filter((e) => e.businessId === businessId);
  },

  async getAllEnquiries(): Promise<CustomerEnquiry[]> {
    return getStoredEnquiries();
  },

  async updateStatus(id: string, status: 'New' | 'Contacted' | 'Closed'): Promise<boolean> {
    const list = getStoredEnquiries();
    const item = list.find((e) => e.id === id);
    if (item) {
      item.status = status;
      saveEnquiries(list);
      return true;
    }
    return false;
  },
};
