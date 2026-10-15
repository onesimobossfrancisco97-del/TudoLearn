import React, { useState } from 'react';
import { X, Check, ExternalLink, Link2, Shield, Sparkles, Copy, Info } from 'lucide-react';
import { PaymentConfig } from '../types';
import { getPaymentConfig, savePaymentConfig, syncRemotePaymentConfig } from '../utils/paymentConfig';
import { sound } from '../utils/audio';

interface PaymentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: PaymentConfig) => void;
}

export const PaymentConfigModal: React.FC<PaymentConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<PaymentConfig>(() => getPaymentConfig());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelUp();
    savePaymentConfig(config);
    await syncRemotePaymentConfig(config);
    setSavedSuccess(true);
    if (onConfigSaved) onConfigSaved(config);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const copyToClipboard = (text: string, key: string) => {
    sound.playClick();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const returnSuccessUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?payment_success=true`
    : 'https://your-app-domain.com?payment_success=true';

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-indigo-500 overflow-hidden relative my-6 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Link2 className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-black text-lg">Payment Links & Checkout Config</h3>
              <p className="text-xs text-blue-100 font-semibold">
                Connect Stripe, Lemon Squeezy, or PayPal in seconds
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 bg-black/20 hover:bg-black/30 rounded-full text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-black animate-scale-up">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Payment links saved and synced to database successfully!
            </div>
          )}

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 tracking-wider mb-1.5">
              Payment Gateway / Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'stripe', label: 'Stripe Links', desc: 'Recommended' },
                { id: 'lemonsqueezy', label: 'Lemon Squeezy', desc: 'Global Merchant' },
                { id: 'paypal', label: 'PayPal / Other', desc: 'Direct URL' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setConfig({ ...config, provider: prov.id as any });
                  }}
                  className={`p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    config.provider === prov.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-300 font-black'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-bold'
                  }`}
                >
                  <div className="text-xs">{prov.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{prov.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Yearly Payment Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Annual / Yearly Plan Payment Link ($59.99/yr)
              </label>
              {config.yearlyPaymentUrl && (
                <a
                  href={config.yearlyPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                >
                  Test Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="url"
              value={config.yearlyPaymentUrl}
              onChange={(e) => setConfig({ ...config, yearlyPaymentUrl: e.target.value })}
              placeholder="https://tudolearnc.lemonsqueezy.com/checkout/buy/0b5522e6-c1f1-4d9e-b993-3671d72aff45"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-hidden text-xs font-mono text-slate-800"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Lemon Squeezy or Stripe checkout link for the Annual Super membership ($59.99/year).
            </p>
          </div>

          {/* Monthly Payment Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Monthly Plan Payment Link ($9.99/mo)
              </label>
              {config.monthlyPaymentUrl && (
                <a
                  href={config.monthlyPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                >
                  Test Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="url"
              value={config.monthlyPaymentUrl}
              onChange={(e) => setConfig({ ...config, monthlyPaymentUrl: e.target.value })}
              placeholder="https://tudolearnc.lemonsqueezy.com/checkout/buy/a83a32e9-4993-4960-95be-356aa71ba2be"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-hidden text-xs font-mono text-slate-800"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Lemon Squeezy or Stripe checkout link for the Monthly Super membership ($9.99/month).
            </p>
          </div>

          {/* Toggle Direct Redirect */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <div className="text-xs font-black text-slate-800">Direct Checkout Redirect</div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Open checkout link immediately when user taps "Subscribe"
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.directRedirectEnabled}
              onChange={(e) => setConfig({ ...config, directRedirectEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Setup Guide Callout */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 text-xs font-black">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Checkout Setup Information:</span>
            </div>
            <ol className="text-[11px] text-sky-800 font-medium space-y-1 list-decimal list-inside pl-1">
              <li>Configured with <strong>Lemon Squeezy</strong> checkout links for secure multi-currency payments.</li>
              <li>Customers can pay via Credit/Debit Cards, Apple Pay, Google Pay, and PayPal.</li>
              <li>Set Lemon Squeezy Redirect URL to the return URL below to activate Super features immediately after payment.</li>
            </ol>

            {/* Return URL copy box */}
            <div className="mt-2 pt-2 border-t border-sky-200/60">
              <div className="text-[10px] font-black uppercase text-sky-700 mb-1">
                Checkout Success / Return URL:
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-sky-300 p-2">
                <code className="text-[10px] text-slate-700 truncate flex-1 font-mono">
                  {returnSuccessUrl}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(returnSuccessUrl, 'returnUrl')}
                  className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-black rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedKey === 'returnUrl' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Save Payment Links
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
