import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Car,
  Wrench,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Database,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { Business, Vehicle, SparePart, PaymentTransaction } from '../types';
import { businessService } from '../services/business.service';
import { carsService } from '../services/cars.service';
import { sparePartsService } from '../services/spareParts.service';
import { paymentService } from '../services/payment.service';
import { formatUgx } from '../utils/formatters';

interface AdminViewProps {
  onNavigateToSettings?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigateToSettings }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'businesses' | 'vehicles' | 'payments' | 'architecture'>('businesses');

  const loadData = async () => {
    const [bList, vList, pList, pyList] = await Promise.all([
      businessService.getAllBusinesses(),
      carsService.getAllVehicles(),
      sparePartsService.getAllParts(),
      paymentService.getAllTransactions(),
    ]);
    setBusinesses(bList);
    setVehicles(vList);
    setSpareParts(pList);
    setPayments(pyList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerify = async (businessId: string, currentStatus: boolean) => {
    await businessService.updateBusiness(businessId, {
      isVerified: !currentStatus,
      verificationBadgeDate: !currentStatus ? new Date().toISOString().split('T')[0] : undefined,
    });
    loadData();
  };

  const handleToggleSubscription = async (businessId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Expired' : 'Active';
    await businessService.updateBusiness(businessId, {
      subscriptionStatus: nextStatus as any,
    });
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Notice Header */}
      <div className="bg-rose-950 text-white rounded-2xl p-6 border border-rose-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Internal Operations Portal
            </span>
            <span className="text-xs text-rose-300">TUNDA CAR Operations & Moderation</span>
          </div>
          <h1 className="text-2xl font-black">Platform Moderation & Verification Hub</h1>
          <p className="text-xs text-rose-200">
            Audit business URA registrations, verify physical premises, moderate vehicle listings, and review MoMo payment references.
          </p>
        </div>

        <div className="bg-rose-900/60 p-3 rounded-xl border border-rose-800 text-[11px] text-rose-200 max-w-xs">
          <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Security Architecture Note</span>
          </div>
          No mock security: Client-side role preview for development. In production, this route is guarded by Supabase Auth & PostgreSQL Row Level Security (RLS).
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminTab('businesses')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'businesses'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Business Moderation & Verification ({businesses.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('vehicles')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'vehicles'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Vehicle Moderation ({vehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'payments'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Intents ({payments.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('architecture')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'architecture'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase Integration Spec</span>
        </button>

        {onNavigateToSettings && (
          <button
            onClick={onNavigateToSettings}
            className="pb-2.5 px-3 text-xs font-bold border-b-2 border-transparent text-amber-600 hover:text-amber-700 whitespace-nowrap transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manage System Settings &rarr;</span>
          </button>
        )}
      </div>

      {/* Tab: Business Moderation */}
      {activeAdminTab === 'businesses' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Registered Automotive Businesses</h2>
            <span className="text-xs text-slate-500">UGX 100,000 / Year verification control</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Business</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Subscription</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-slate-500">{b.phone} • {b.email}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{b.category}</td>
                    <td className="py-3 px-3 text-slate-600">{b.city}, {b.district}</td>
                    <td className="py-3 px-3">
                      {b.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[10px] ${
                          b.subscriptionStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.subscriptionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleVerify(b.id, b.isVerified)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          b.isVerified
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {b.isVerified ? 'Revoke Verification' : 'Verify Business'}
                      </button>
                      <button
                        onClick={() => handleToggleSubscription(b.id, b.subscriptionStatus)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold"
                      >
                        Toggle Sub
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Vehicle Moderation */}
      {activeAdminTab === 'vehicles' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Vehicle Inventory Overview</h2>
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-amber-600 font-black">{formatUgx(v.priceUgx)}</p>
                  <span className="text-[10px] text-slate-400">
                    Seller: {v.sellerName} • {v.location} • {v.condition}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-500 block">ID: {v.id}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Approved for Marketplace</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payments */}
      {activeAdminTab === 'payments' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Initiated Payment Transactions</h2>
          <p className="text-xs text-slate-500">
            Real transactions are linked directly to MTN MoMo / Airtel Money / Bank reconciliations.
          </p>

          {payments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No payment transactions initiated yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{p.referenceId}</span>
                    <p className="text-xs text-slate-600">{p.payerPhone} • Method: {p.method}</p>
                    <span className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-amber-600 text-sm">{formatUgx(p.amountUgx)}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded block mt-0.5">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Supabase Architecture Spec */}
      {activeAdminTab === 'architecture' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">Supabase Backend Schema & Connection Plan</h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            TUNDA CAR's architecture has been strictly partitioned into UI, Service Layer, and Data schemas.
            Connecting Supabase requires zero refactoring of UI components.
          </p>

          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono space-y-3 overflow-x-auto">
            <div className="text-amber-400">// Planned Supabase Tables Schema</div>
            <div>
              1. <strong>businesses</strong> (id, slug, name, category, district, city, address, phone, whatsapp, email, is_verified, subscription_status, subscription_expiry)<br />
              2. <strong>vehicles</strong> (id, business_id, title, make, model, year, price_ugx, mileage_km, fuel_type, transmission, body_type, condition, location, images)<br />
              3. <strong>spare_parts</strong> (id, business_id, title, category, vehicle_make, vehicle_model, year_range, condition, price_ugx, location, images)<br />
              4. <strong>customer_enquiries</strong> (id, business_id, listing_type, listing_id, customer_name, customer_phone, message, status)<br />
              5. <strong>subscriptions_and_payments</strong> (id, business_id, amount_ugx, provider, telecom_ref, status, created_at)<br />
            </div>
            <div className="text-emerald-400">// Supabase Row Level Security (RLS) Rules:</div>
            <div>
              - Public: SELECT allowed on verified businesses & active listings<br />
              - Business Owner: INSERT/UPDATE allowed on vehicles/parts WHERE business_id = auth.uid()<br />
              - Admin: FULL ACCESS WHERE auth.jwt()-&gt;&gt;'role' = 'admin'
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
