import React, { useState, useEffect } from 'react';
import {
  Building2,
  Car,
  Wrench,
  Mail,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import {
  Business,
  Vehicle,
  SparePart,
  CustomerEnquiry,
  PaymentMethod,
  PaymentTransaction,
  VEHICLE_BODY_TYPES,
  SPARE_PART_CATEGORIES,
  UGANDA_LOCATIONS,
} from '../types';
import { businessService } from '../services/business.service';
import { carsService } from '../services/cars.service';
import { sparePartsService } from '../services/spareParts.service';
import { enquiryService } from '../services/enquiry.service';
import { paymentService, PaymentInitiationResult } from '../services/payment.service';
import { formatUgx, getWhatsAppLink, getPhoneLink } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';

interface DashboardViewProps {
  businessId?: string;
  onViewBusinessPublic: (slug: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  businessId = 'biz-1',
  onViewBusinessPublic,
}) => {
  const { settings } = useSettings();
  const [business, setBusiness] = useState<Business | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'parts' | 'enquiries' | 'subscription' | 'edit'>('overview');

  // Modals for adding items
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddPartModal, setShowAddPartModal] = useState(false);

  // New vehicle form state
  const [newVehTitle, setNewVehTitle] = useState('');
  const [newVehMake, setNewVehMake] = useState('Toyota');
  const [newVehModel, setNewVehModel] = useState('');
  const [newVehYear, setNewVehYear] = useState(2018);
  const [newVehPrice, setNewVehPrice] = useState(45000000);
  const [newVehMileage, setNewVehMileage] = useState(65000);
  const [newVehFuel, setNewVehFuel] = useState<'Petrol' | 'Diesel' | 'Hybrid'>('Petrol');
  const [newVehTrans, setNewVehTrans] = useState<'Automatic' | 'Manual'>('Automatic');
  const [newVehBody, setNewVehBody] = useState<any>('SUV');
  const [newVehCond, setNewVehCond] = useState<any>('Foreign Used / In Bond');
  const [newVehDesc, setNewVehDesc] = useState('');

  // New spare part form state
  const [newPartTitle, setNewPartTitle] = useState('');
  const [newPartCategory, setNewPartCategory] = useState<any>('Brake Parts');
  const [newPartMake, setNewPartMake] = useState('Toyota');
  const [newPartModel, setNewPartModel] = useState('');
  const [newPartYear, setNewPartYear] = useState('2010 - 2020');
  const [newPartPrice, setNewPartPrice] = useState(250000);
  const [newPartCond, setNewPartCond] = useState<any>('Brand New');
  const [newPartDesc, setNewPartDesc] = useState('');

  // Subscription payment initiation state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [payerPhone, setPayerPhone] = useState('+256 772 123 456');
  const [paymentResult, setPaymentResult] = useState<PaymentInitiationResult | null>(null);

  const loadData = async () => {
    const b = await businessService.getBusinessById(businessId);
    if (b) {
      setBusiness(b);
      const [vList, pList, eList, tList] = await Promise.all([
        carsService.filterVehicles({ sellerId: b.id }),
        sparePartsService.filterParts({ sellerId: b.id }),
        enquiryService.getEnquiriesForBusiness(b.id),
        paymentService.getTransactionsForBusiness(b.id),
      ]);
      setVehicles(vList);
      setSpareParts(pList);
      setEnquiries(eList);
      setTransactions(tList);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading merchant profile...
      </div>
    );
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    await carsService.addVehicle({
      title: newVehTitle || `${newVehYear} ${newVehMake} ${newVehModel}`,
      make: newVehMake,
      model: newVehModel,
      year: Number(newVehYear),
      priceUgx: Number(newVehPrice),
      mileageKm: Number(newVehMileage),
      fuelType: newVehFuel,
      transmission: newVehTrans,
      bodyType: newVehBody,
      condition: newVehCond,
      location: business.city,
      addressDetail: business.address,
      sellerId: business.id,
      sellerName: business.name,
      sellerType: 'Dealership',
      sellerPhone: business.phone,
      sellerWhatsapp: business.whatsapp,
      isVerified: business.isVerified,
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      ],
      description: newVehDesc || `Clean unit inspected by ${business.name}.`,
      engineSizeCc: 2000,
      features: ['Air Conditioning', 'Power Steering', 'Central Locking', 'Radio/CD'],
      color: 'Silver Metallic',
    });

    setShowAddVehicleModal(false);
    loadData();
  };

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    await sparePartsService.addPart({
      title: newPartTitle,
      category: newPartCategory,
      vehicleMake: newPartMake,
      vehicleModel: newPartModel,
      yearCompatibility: newPartYear,
      condition: newPartCond,
      priceUgx: Number(newPartPrice),
      location: business.city,
      sellerId: business.id,
      sellerName: business.name,
      sellerPhone: business.phone,
      sellerWhatsapp: business.whatsapp,
      isVerified: business.isVerified,
      images: [
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      ],
      description: newPartDesc || `Genuine replacement item in stock at ${business.name}.`,
      inStock: true,
    });

    setShowAddPartModal(false);
    loadData();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to remove this vehicle listing?')) {
      await carsService.deleteVehicle(id);
      loadData();
    }
  };

  const handleDeletePart = async (id: string) => {
    if (confirm('Are you sure you want to remove this spare part?')) {
      await sparePartsService.deletePart(id);
      loadData();
    }
  };

  const handleInitiateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await paymentService.initiateSubscriptionPayment({
      businessId: business.id,
      amountUgx: settings.subscriptionPriceUgx,
      method: selectedPaymentMethod,
      payerPhone,
    });
    setPaymentResult(result);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Merchant Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={business.logo}
            alt={business.name}
            className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{business.name}</h1>
              {business.isVerified && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Category: <strong className="text-slate-200">{business.category}</strong> • {business.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onViewBusinessPublic(business.slug)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>View Public Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={() => setShowAddPartModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Spare Part</span>
          </button>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Listing Subscription Status:
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded ${
                  business.subscriptionStatus === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {business.subscriptionStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Package: <strong>{settings.subscriptionName}</strong> ({formatUgx(settings.subscriptionPriceUgx)} / {settings.subscriptionPeriodMonths === 12 ? 'Year' : `${settings.subscriptionPeriodMonths} Months`}) • Current Expiry:{' '}
              <strong>{business.subscriptionExpiry}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('subscription')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
        >
          Manage Subscription & Billing
        </button>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'vehicles'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Vehicle Listings ({vehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'parts'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Spare Parts ({spareParts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Customer Enquiries ({enquiries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'subscription'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Subscription & Billing</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Active Vehicles</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{vehicles.length}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Spare Parts</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{spareParts.length}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Customer Enquiries</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{enquiries.length}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Customer Rating</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{business.rating} / 5.0</div>
            </div>
          </div>

          {/* Recent Enquiries snippet */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Recent Customer Leads</h2>
              <button
                onClick={() => setActiveTab('enquiries')}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                View all leads
              </button>
            </div>

            {enquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No customer enquiries received yet.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.slice(0, 3).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{enq.customerName}</span> •{' '}
                      <span className="text-slate-500">{enq.customerPhone}</span>
                      <p className="text-slate-600 mt-0.5 font-medium">{enq.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Listing: {enq.listingTitle || 'General Consultation'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={getWhatsAppLink(enq.customerPhone, `Hello ${enq.customerName}, regarding your TUNDA CAR enquiry:`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
                        title="Chat back on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      </a>
                      <a
                        href={getPhoneLink(enq.customerPhone)}
                        className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 font-bold"
                        title="Call customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Your Vehicle Inventory</h2>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={v.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover bg-slate-100" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{v.title}</h3>
                    <p className="text-xs font-black text-amber-600">{formatUgx(v.priceUgx)}</p>
                    <span className="text-[10px] text-slate-400">
                      {v.year} • {v.fuelType} • {v.mileageKm.toLocaleString()} km
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Spare Parts */}
      {activeTab === 'parts' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Your Spare Parts Catalog</h2>
            <button
              onClick={() => setShowAddPartModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spare Part</span>
            </button>
          </div>

          <div className="space-y-3">
            {spareParts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover bg-slate-100" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{p.title}</h3>
                    <p className="text-xs font-black text-amber-600">{formatUgx(p.priceUgx)}</p>
                    <span className="text-[10px] text-slate-400">
                      {p.category} • {p.vehicleMake} {p.vehicleModel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeletePart(p.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete part"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">All Customer Enquiries</h2>
          <div className="space-y-3">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{enq.customerName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(enq.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">{enq.message}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Phone: {enq.customerPhone}</span>
                  <div className="flex gap-2">
                    <a
                      href={getWhatsAppLink(enq.customerPhone, `Hello ${enq.customerName}, regarding your TUNDA CAR enquiry:`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={getPhoneLink(enq.customerPhone)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subscription & Billing */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Manage Subscription</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Plan: <strong>{settings.subscriptionName}</strong> ({formatUgx(settings.subscriptionPriceUgx)} / {settings.subscriptionPeriodMonths === 12 ? 'Year' : `${settings.subscriptionPeriodMonths} Months`})
            </p>
          </div>

          {/* Payment gateway notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Real Payment Gateway Integration Note
            </span>
            <p>
              {settings.businessName || 'TUNDA CAR'} does NOT simulate fake payment completions. When paying with MTN Mobile Money,
              Airtel Money, or Bank Transfer, transactions remain in a pending state until authorized by the
              corresponding Ugandan telecom or banking gateway API.
            </p>
          </div>

          {/* Recipient Account Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {settings.enableMtnMomo && (
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <span className="font-bold text-amber-900 block">MTN Mobile Money Recipient</span>
                <p className="text-slate-900 font-mono font-bold">{settings.mtnNumber}</p>
                <p className="text-[11px] text-slate-600">{settings.mtnRegisteredName}</p>
              </div>
            )}
            {settings.enableAirtelMoney && (
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                <span className="font-bold text-rose-900 block">Airtel Money Recipient</span>
                <p className="text-slate-900 font-mono font-bold">{settings.airtelNumber}</p>
                <p className="text-[11px] text-slate-600">{settings.airtelRegisteredName}</p>
              </div>
            )}
            {settings.enableBankTransfer && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">{settings.bankName}</span>
                <p className="text-slate-900 font-mono font-bold">{settings.bankAccountNumber}</p>
                <p className="text-[11px] text-slate-600">{settings.bankAccountName} ({settings.bankBranch})</p>
              </div>
            )}
          </div>

          {paymentResult ? (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                Payment Request Initiated
              </span>
              <p className="text-sm font-semibold">{paymentResult.message}</p>
              <div className="bg-slate-800 p-3 rounded-xl text-xs text-slate-300 font-mono">
                {paymentResult.instructions}
              </div>
              <p className="text-xs text-slate-400">Reference: {paymentResult.referenceId}</p>
              <button
                onClick={() => setPaymentResult(null)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg mt-2"
              >
                Initiate Another Payment
              </button>
            </div>
          ) : (
            <form onSubmit={handleInitiateSubscription} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {settings.enableMtnMomo && (
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('mtn_momo')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        selectedPaymentMethod === 'mtn_momo'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      MTN MoMo
                    </button>
                  )}
                  {settings.enableAirtelMoney && (
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('airtel_money')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        selectedPaymentMethod === 'airtel_money'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Airtel Money
                    </button>
                  )}
                  {settings.enableBankTransfer && (
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        selectedPaymentMethod === 'bank_transfer'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Bank Transfer
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payer Mobile Number / Billing Phone
                </label>
                <input
                  type="tel"
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="+256 772..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20"
              >
                Initiate {formatUgx(settings.subscriptionPriceUgx)} Payment
              </button>
            </form>
          )}

          {/* Prior payment log */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-xs text-slate-700 mb-2">Billing & Payment Intent Logs</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400">No recorded payment requests.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{t.referenceId}</span> •{' '}
                      <span className="uppercase text-[10px] text-slate-500 font-semibold">{t.method}</span>
                      <p className="text-[11px] text-slate-500">{t.note}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-600">{formatUgx(t.amountUgx)}</span>
                      <span className="block text-[10px] text-amber-700 font-bold">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900">Add New Vehicle Listing</h2>
            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Make</label>
                <input
                  type="text"
                  required
                  value={newVehMake}
                  onChange={(e) => setNewVehMake(e.target.value)}
                  placeholder="e.g. Toyota"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={newVehModel}
                  onChange={(e) => setNewVehModel(e.target.value)}
                  placeholder="e.g. Harrier / Prado / Premio"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={newVehYear}
                    onChange={(e) => setNewVehYear(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (UGX)</label>
                  <input
                    type="number"
                    required
                    value={newVehPrice}
                    onChange={(e) => setNewVehPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    required
                    value={newVehMileage}
                    onChange={(e) => setNewVehMileage(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Body Type</label>
                  <select
                    value={newVehBody}
                    onChange={(e) => setNewVehBody(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {VEHICLE_BODY_TYPES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newVehDesc}
                  onChange={(e) => setNewVehDesc(e.target.value)}
                  placeholder="Specs, extras, auction sheet rating..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="w-1/3 py-2.5 rounded-lg border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 font-black text-slate-950"
                >
                  Publish Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Spare Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900">Add Spare Part Listing</h2>
            <form onSubmit={handleAddPart} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Part Title</label>
                <input
                  type="text"
                  required
                  value={newPartTitle}
                  onChange={(e) => setNewPartTitle(e.target.value)}
                  placeholder="e.g. Front Shock Absorbers (Pair)"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {SPARE_PART_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (UGX)</label>
                  <input
                    type="number"
                    required
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compatible Make</label>
                  <input
                    type="text"
                    required
                    value={newPartMake}
                    onChange={(e) => setNewPartMake(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compatible Model</label>
                  <input
                    type="text"
                    required
                    value={newPartModel}
                    onChange={(e) => setNewPartModel(e.target.value)}
                    placeholder="e.g. Harrier / Premio"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Year Range</label>
                <input
                  type="text"
                  value={newPartYear}
                  onChange={(e) => setNewPartYear(e.target.value)}
                  placeholder="e.g. 2013 - 2021"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="w-1/3 py-2.5 rounded-lg border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 font-black text-slate-950"
                >
                  Publish Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
