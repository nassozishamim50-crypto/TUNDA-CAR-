export type UgandaLocation =
  | 'Kampala'
  | 'Wakiso'
  | 'Entebbe'
  | 'Mukono'
  | 'Jinja'
  | 'Mbarara'
  | 'Mbale'
  | 'Gulu'
  | 'Masaka'
  | 'Fort Portal'
  | 'Other Uganda locations';

export const UGANDA_LOCATIONS: UgandaLocation[] = [
  'Kampala',
  'Wakiso',
  'Entebbe',
  'Mukono',
  'Jinja',
  'Mbarara',
  'Mbale',
  'Gulu',
  'Masaka',
  'Fort Portal',
  'Other Uganda locations',
];

export type VehicleBodyType =
  | 'SUV'
  | 'Sedan'
  | 'Hatchback'
  | 'Pickup'
  | 'Van'
  | 'Minibus'
  | 'Truck'
  | 'Motorcycle';

export const VEHICLE_BODY_TYPES: VehicleBodyType[] = [
  'SUV',
  'Sedan',
  'Hatchback',
  'Pickup',
  'Van',
  'Minibus',
  'Truck',
  'Motorcycle',
];

export type VehicleCondition = 'Brand New' | 'Foreign Used / In Bond' | 'Ugandan Used';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual';

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  priceUgx: number;
  mileageKm: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: VehicleBodyType;
  condition: VehicleCondition;
  location: UgandaLocation;
  addressDetail?: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'Dealership' | 'Importer' | 'Individual' | 'Broker' | 'Used Car Dealer';
  sellerPhone: string;
  sellerWhatsapp: string;
  isVerified: boolean;
  images: string[];
  description: string;
  engineSizeCc: number;
  features: string[];
  color: string;
  datePosted: string;
  isFeatured?: boolean;
}

export type SparePartCategory =
  | 'Engine Parts'
  | 'Brake Parts'
  | 'Suspension'
  | 'Electrical'
  | 'Body Parts'
  | 'Lights'
  | 'Batteries'
  | 'Tyres'
  | 'Filters'
  | 'Accessories';

export const SPARE_PART_CATEGORIES: SparePartCategory[] = [
  'Engine Parts',
  'Brake Parts',
  'Suspension',
  'Electrical',
  'Body Parts',
  'Lights',
  'Batteries',
  'Tyres',
  'Filters',
  'Accessories',
];

export type SparePartCondition = 'Brand New' | 'OEM Used / Tested' | 'Refurbished';

export interface SparePart {
  id: string;
  title: string;
  category: SparePartCategory;
  vehicleMake: string;
  vehicleModel: string;
  yearCompatibility: string;
  partNumber?: string;
  condition: SparePartCondition;
  priceUgx: number;
  location: UgandaLocation;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  isVerified: boolean;
  images: string[];
  description: string;
  inStock: boolean;
  datePosted: string;
}

export type BusinessCategory =
  | 'Car Dealership'
  | 'Used Car Dealer'
  | 'Car Importer'
  | 'Spare Parts'
  | 'Garage'
  | 'Mechanic'
  | 'Tyre Dealer'
  | 'Battery Dealer'
  | 'Car Accessories'
  | 'Auto Electrical'
  | 'Body Repair'
  | 'Car Rental'
  | 'Towing'
  | 'Car Wash';

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  'Car Dealership',
  'Used Car Dealer',
  'Car Importer',
  'Spare Parts',
  'Garage',
  'Mechanic',
  'Tyre Dealer',
  'Battery Dealer',
  'Car Accessories',
  'Auto Electrical',
  'Body Repair',
  'Car Rental',
  'Towing',
  'Car Wash',
];

export type SubscriptionStatus = 'Pending' | 'Active' | 'Expired' | 'Cancelled';

export interface BusinessReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category: BusinessCategory;
  district: string;
  city: UgandaLocation;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  logo: string;
  coverImage: string;
  description: string;
  openingHours: string;
  isVerified: boolean;
  verificationBadgeDate?: string;
  rating: number;
  reviewsCount: number;
  services: string[];
  gallery: string[];
  reviews: BusinessReview[];
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry: string;
  createdAt: string;
}

export interface CustomerEnquiry {
  id: string;
  businessId: string;
  listingType: 'vehicle' | 'spare_part' | 'business';
  listingId?: string;
  listingTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'bank_transfer';

export interface PaymentTransaction {
  id: string;
  businessId: string;
  amountUgx: number;
  method: PaymentMethod;
  payerPhone?: string;
  referenceId: string;
  status: 'Pending Gateway Integration' | 'Manual Verification Required';
  createdAt: string;
  note: string;
}

export interface AdminSettings {
  id: string; // 'global_settings'
  
  // Business Contact
  businessName: string;
  mainPhone: string;
  whatsappNumber: string;
  emailAddress: string;
  physicalAddress: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  businessHours: string;

  // Payment Info - Mobile Money
  mtnNumber: string;
  mtnRegisteredName: string;
  airtelNumber: string;
  airtelRegisteredName: string;

  // Payment Info - Bank
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankPaymentInstructions: string;

  // Subscription Settings
  subscriptionPriceUgx: number;
  subscriptionPeriodMonths: number;
  subscriptionName: string;
  subscriptionDescription: string;

  // Payment Methods Enablement
  enableMtnMomo: boolean;
  enableAirtelMoney: boolean;
  enableBankTransfer: boolean;
  enableOnlineGateway: boolean;

  // Audit metadata
  created_at: string;
  updated_at: string;
  updated_by: string;
}

