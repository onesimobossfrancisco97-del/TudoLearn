import { PaymentConfig } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PAYMENT_CONFIG_KEY = 'tudolearn_payment_config_v1';

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  provider: 'stripe',
  yearlyPaymentUrl: 'https://buy.stripe.com/test_tudolearn_yearly',
  monthlyPaymentUrl: 'https://buy.stripe.com/test_tudolearn_monthly',
  directRedirectEnabled: true,
  currency: 'USD',
};

export function getPaymentConfig(): PaymentConfig {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_CONFIG;
  try {
    const raw = localStorage.getItem(PAYMENT_CONFIG_KEY);
    if (!raw) return DEFAULT_PAYMENT_CONFIG;
    return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function savePaymentConfig(config: PaymentConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PAYMENT_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save payment config locally:', err);
  }
}

export async function fetchRemotePaymentConfig(): Promise<PaymentConfig | null> {
  try {
    const docRef = doc(db, 'appSettings', 'paymentConfig');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PaymentConfig;
    }
  } catch (err) {
    console.warn('Could not fetch remote payment config:', err);
  }
  return null;
}

export async function syncRemotePaymentConfig(config: PaymentConfig): Promise<void> {
  try {
    const docRef = doc(db, 'appSettings', 'paymentConfig');
    await setDoc(docRef, { ...config, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Could not sync remote payment config:', err);
  }
}
