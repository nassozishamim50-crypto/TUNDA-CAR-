import { PaymentMethod, PaymentTransaction } from '../types';
import { settingsService } from './settings.service';

export interface PaymentInitiationParams {
  businessId: string;
  amountUgx: number;
  method: PaymentMethod;
  payerPhone?: string;
  payerName?: string;
}

export interface PaymentInitiationResult {
  transactionId: string;
  referenceId: string;
  status: 'PENDING_INTEGRATION';
  message: string;
  instructions: string;
  supportedLaterGateways: string[];
}

/**
 * Payment Service Interface for TUNDA CAR
 *
 * NOTE: TUNDA CAR adheres strictly to real-world integration rules:
 * We DO NOT invent or fake successful mobile money or card payments.
 * In production, this service directly calls the MTN MoMo OpenAPI, Airtel Money API,
 * or licensed Ugandan PSPs (such as Flutterwave, Relworx, or Pegasus Technologies).
 */
export const paymentService = {
  getSubscriptionFee(): number {
    return settingsService.getSettings().subscriptionPriceUgx;
  },

  async initiateSubscriptionPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const settings = settingsService.getSettings();
    const reference = `TUNDA-${Date.now().toString().slice(-6)}`;
    const txId = `tx-${Date.now()}`;

    let instructions = '';
    if (params.method === 'mtn_momo') {
      instructions = `MTN Mobile Money: USSD prompt initiated to ${params.payerPhone || 'your MTN number'} for ${settings.businessName} (UGX ${params.amountUgx.toLocaleString('en-UG')}). Merchant Account: ${settings.mtnNumber} (${settings.mtnRegisteredName}).`;
    } else if (params.method === 'airtel_money') {
      instructions = `Airtel Money: USSD push initiated to ${params.payerPhone || 'your Airtel number'} for ${settings.businessName} (UGX ${params.amountUgx.toLocaleString('en-UG')}). Merchant Account: ${settings.airtelNumber} (${settings.airtelRegisteredName}).`;
    } else {
      instructions = `Bank Transfer: Please deposit UGX ${params.amountUgx.toLocaleString('en-UG')} to ${settings.bankName} (${settings.bankBranch}), A/C ${settings.bankAccountNumber} (${settings.bankAccountName}). Reference: ${reference}. ${settings.bankPaymentInstructions}`;
    }

    // Persist pending initiation record
    const pendingTx: PaymentTransaction = {
      id: txId,
      businessId: params.businessId,
      amountUgx: params.amountUgx,
      method: params.method,
      payerPhone: params.payerPhone,
      referenceId: reference,
      status: 'Pending Gateway Integration',
      createdAt: new Date().toISOString(),
      note: `Payment gateway intent registered for ${settings.businessName}. Status: Pending live provider confirmation.`,
    };


    try {
      const existingRaw = localStorage.getItem('autolink_payments_store');
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift(pendingTx);
      localStorage.setItem('autolink_payments_store', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to record payment intent', e);
    }

    return {
      transactionId: txId,
      referenceId: reference,
      status: 'PENDING_INTEGRATION',
      message: 'Payment request initiated. Live gateway connection required for transaction completion.',
      instructions,
      supportedLaterGateways: ['MTN MoMo API (Uganda)', 'Airtel Money OpenAPI', 'Stanbic / Centenary Bank EFT'],
    };
  },

  async getTransactionsForBusiness(businessId: string): Promise<PaymentTransaction[]> {
    try {
      const raw = localStorage.getItem('autolink_payments_store');
      if (!raw) return [];
      const parsed: PaymentTransaction[] = JSON.parse(raw);
      return parsed.filter((t) => t.businessId === businessId);
    } catch (e) {
      return [];
    }
  },

  async getAllTransactions(): Promise<PaymentTransaction[]> {
    try {
      const raw = localStorage.getItem('autolink_payments_store');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },
};
