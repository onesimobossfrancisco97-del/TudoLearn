import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Heart,
  Download,
  Sparkles,
  CreditCard,
  ExternalLink,
  Settings,
  Link2,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { PaymentConfig } from '../types';
import { getPaymentConfig, fetchRemotePaymentConfig } from '../utils/paymentConfig';
import { PaymentConfigModal } from './PaymentConfigModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
  isAlreadySuper?: boolean;
  /**
   * Only true when opened explicitly from the owner/management dashboard.
   * Regular users and students will NEVER see or access the "Edit Link" option.
   */
  isManagement?: boolean;
  onOpenVideoAd?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribeSuccess,
  isAlreadySuper: _isAlreadySuper = false,
  isManagement = false,
  onOpenVideoAd,
}) => {
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'lemonsqueezy' | 'card'>('lemonsqueezy');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => getPaymentConfig());

  useEffect(() => {
    setMounted(true);
    fetchRemotePaymentConfig().then((remote) => {
      if (remote) setPaymentConfig(remote);
    });
  }, []);

  if (!isOpen || !mounted) return null;

  const currentPaymentUrl =
    billingCycle === 'yearly'
      ? paymentConfig.yearlyPaymentUrl
      : paymentConfig.monthlyPaymentUrl;

  const handleSimulatedCheckout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    sound.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      sound.playLevelUp();
      confetti({
        particleCount: 160,
        spread: 90,
        colors: ['#2563EB', '#38BDF8', '#F59E0B', '#818CF8'],
      });
      setTimeout(() => {
        onSubscribeSuccess();
        onClose();
      }, 1600);
    }, 1000);
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in w-full h-full overflow-hidden">
      {/* Backdrop tap to dismiss */}
      <div
        className="absolute inset-0 -z-10 cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Compact Pop-up Bubble: Fits fully on mobile screens, X button ALWAYS visible */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white border-2 sm:border-3 border-blue-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-scale-up">
        {/* Fixed Header with ALWAYS VISIBLE high-contrast Exit Button */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-3.5 sm:p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-wide">Super TudoLearn</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                  PREMIUM
                </span>
              </div>
              <p className="text-[10px] text-blue-100 font-medium">Unlock full mastery & unlimited study</p>
            </div>
          </div>

          {/* Prominent High-Contrast Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="p-2 bg-black/25 hover:bg-black/45 active:scale-90 rounded-full text-white cursor-pointer transition-all border border-white/30 shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body (Strictly vertical downward scroll) */}
        <div className="p-3.5 sm:p-4.5 space-y-3 overflow-y-auto flex-1">
          {showSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Welcome to Super TudoLearn!</h4>
              <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
                Unlimited hearts and offline learning have been unlocked on your account.
              </p>
            </div>
          ) : (
            <>
              {/* Feature Highlights (Compact list) */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-2.5 space-y-1.5 text-xs text-slate-700 font-bold">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Unlock all 10 Levels in every course (Levels 3-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Earn official Level 5 & Level 10 Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span>Unlimited Hearts (Never run out during lessons)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Offline Mode (Learn anywhere with no Wi-Fi)</span>
                </div>
              </div>

              {/* Billing Cycle Options (Compact Cards) */}
              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Choose Plan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setBillingCycle('yearly');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      billingCycle === 'yearly'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      Save 50%
                    </span>
                    <div className="text-xs font-black text-slate-900">Annual Plan</div>
                    <div className="text-sm font-black text-blue-700 mt-0.5">
                      $4.99<span className="text-[10px] text-slate-500 font-bold">/mo</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">$59.99 billed yearly</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setBillingCycle('monthly');
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-black text-slate-900">Monthly Plan</div>
                    <div className="text-sm font-black text-blue-700 mt-0.5">
                      $9.99<span className="text-[10px] text-slate-500 font-bold">/mo</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">Cancel anytime</div>
                  </button>
                </div>
              </div>

              {/* Payment Methods (Compact Pills) */}
              {/* Payment Methods (Compact Pills) */}
              <div className="flex gap-1.5">
                {[
                  { id: 'lemonsqueezy', label: 'Lemon Squeezy Checkout' },
                  { id: 'card', label: 'Cards / Apple Pay' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod(pm.id as any);
                    }}
                    className={`flex-1 py-1.5 px-1 text-[11px] font-black rounded-xl border transition-all cursor-pointer text-center ${
                      paymentMethod === pm.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-extrabold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Clean Student-Facing Payment Badge (No Edit Link on user side) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-slate-800">Lemon Squeezy Checkout</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Accepts Cards, Apple Pay, Google Pay & PayPal
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                    256-Bit SSL
                  </span>
                </div>

                {/* ONLY show Edit Link if opened from the Management side */}
                {isManagement && (
                  <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Admin Controls:</span>
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="text-blue-600 font-black hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Settings className="w-3 h-3" />
                      <span>Edit Link (Management)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Watch Video Ad Commercial Trigger */}
              {onOpenVideoAd && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenVideoAd();
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 hover:bg-slate-900 text-amber-300 font-black text-xs rounded-xl border border-amber-400/40 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-300" />
                  <span>🎬 Watch Super TudoLearn Commercial Ad</span>
                </button>
              )}

              {/* Primary Call to Action */}
              <div className="space-y-1.5 pt-1">
                <a
                  href={currentPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 border-b-2 border-blue-900 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 no-underline"
                >
                  <span>
                    {billingCycle === 'yearly'
                      ? 'CHECKOUT YEARLY ($59.99/YR)'
                      : 'CHECKOUT MONTHLY ($9.99/MO)'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleSimulatedCheckout()}
                  disabled={isProcessing}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Activating...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Instant 7-Day Free Trial</span>
                    </>
                  )}
                </button>

                {/* Additional Direct Exit Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 text-slate-400 hover:text-slate-600 font-extrabold text-xs transition-colors cursor-pointer text-center"
                >
                  ✕ Maybe Later (Exit)
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 text-center">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Zero charge today. Cancel easily anytime in settings.</span>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-medium pt-0.5">
                Super TudoLearn • Founder of the App: <strong className="text-slate-700 font-black">Onesimo Boss Francisco</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Configuration Modal (Only accessible from management side) */}
      {isManagement && (
        <PaymentConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onConfigSaved={(updated) => setPaymentConfig(updated)}
        />
      )}
    </div>,
    document.body
  );
};
