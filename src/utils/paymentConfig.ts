import { PaymentConfig } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PAYMENT_CONFIG_KEY = 'tudolearn_payment_config_v2';

export const LEMONSQUEEZY_MONTHLY_URL =
  'https://tudolearnc.lemonsqueezy.com/checkout/buy/a83a32e9-4993-4960-95be-356aa71ba2be';
export const LEMONSQUEEZY_YEARLY_URL =
  'https://tudolearnc.lemonsqueezy.com/checkout/buy/0b5522e6-c1f1-4d9e-b993-3671d72aff45';

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  provider: 'lemonsqueezy',
  yearlyPaymentUrl: LEMONSQUEEZY_YEARLY_URL,
  monthlyPaymentUrl: LEMONSQUEEZY_MONTHLY_URL,
  directRedirectEnabled: true,
  currency: 'USD',
};

export function getPaymentConfig(): PaymentConfig {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_CONFIG;
  try {
    const raw = localStorage.getItem(PAYMENT_CONFIG_KEY);
    if (!raw) {
      // Also check v1 and migrate if needed
      const oldRaw = localStorage.getItem('tudolearn_payment_config_v1');
      if (oldRaw) {
        try {
          const old = JSON.parse(oldRaw);
          if (
            old.yearlyPaymentUrl &&
            !old.yearlyPaymentUrl.includes('test_tudolearn') &&
            !old.yearlyPaymentUrl.includes('stripe.com/test')
          ) {
            return { ...DEFAULT_PAYMENT_CONFIG, ...old };
          }
        } catch {
          // ignore
        }
      }
      return DEFAULT_PAYMENT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    // If empty or test links, update to default Lemon Squeezy URLs
    if (
      !parsed.yearlyPaymentUrl ||
      parsed.yearlyPaymentUrl.includes('test_tudolearn') ||
      parsed.yearlyPaymentUrl.includes('buy.stripe.com/test')
    ) {
      parsed.yearlyPaymentUrl = DEFAULT_PAYMENT_CONFIG.yearlyPaymentUrl;
    }
    if (
      !parsed.monthlyPaymentUrl ||
      parsed.monthlyPaymentUrl.includes('test_tudolearn') ||
      parsed.monthlyPaymentUrl.includes('buy.stripe.com/test')
    ) {
      parsed.monthlyPaymentUrl = DEFAULT_PAYMENT_CONFIG.monthlyPaymentUrl;
    }
    return { ...DEFAULT_PAYMENT_CONFIG, ...parsed };
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
      const data = snap.data() as PaymentConfig;
      // If remote has valid URLs, return them; otherwise return defaults
      if (
        data.yearlyPaymentUrl &&
        !data.yearlyPaymentUrl.includes('test_tudolearn') &&
        data.monthlyPaymentUrl &&
        !data.monthlyPaymentUrl.includes('test_tudolearn')
      ) {
        return data;
      }
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
