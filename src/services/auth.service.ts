export type UserRole = 'visitor' | 'business_owner' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string;
  phone?: string;
}

const DEMO_BUSINESS_OWNER: AppUser = {
  id: 'usr-biz-pearl',
  email: 'director@pearlmotors.co.ug',
  name: 'Director (Pearl Motors Uganda)',
  role: 'business_owner',
  businessId: 'biz-1',
  phone: '+256701234567',
};

const DEMO_ADMIN: AppUser = {
  id: 'usr-admin-tundacar',
  email: 'admin@tundacar.ug',
  name: 'TUNDA CAR Admin',
  role: 'admin',
};

const AUTH_STORAGE_KEY = 'autolink_auth_user';

export const authService = {
  getCurrentUser(): AppUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    // Default to business owner for preview so dashboard is immediately inspectable
    return DEMO_BUSINESS_OWNER;
  },

  setCurrentUser(user: AppUser | null) {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  },

  switchToBusinessOwner(businessId: string = 'biz-1') {
    const user: AppUser = {
      ...DEMO_BUSINESS_OWNER,
      businessId,
    };
    this.setCurrentUser(user);
    return user;
  },

  switchToAdmin() {
    this.setCurrentUser(DEMO_ADMIN);
    return DEMO_ADMIN;
  },

  switchToVisitor() {
    this.setCurrentUser(null);
    return null;
  },

  /**
   * Supabase Integration Contract:
   * When linking Supabase, replace this file's internals with:
   *
   * import { createClient } from '@supabase/supabase-js';
   * export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
   * export const useAuth = () => { ... }
   */
};
