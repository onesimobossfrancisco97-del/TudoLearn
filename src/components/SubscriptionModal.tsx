import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Heart, Download, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
  isAlreadySuper?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribeSuccess,
  isAlreadySuper = false,
}) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'paypal'>('card');
  const [cardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
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
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-blue-400 overflow-hidden relative my-6 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header with Royal Blue Gradient */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-sky-500 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2 border border-white/20">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            Super TudoLearn
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Supercharge Your Learning
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-1 max-w-xs mx-auto">
            Unlimited hearts, offline downloads, ad-free focus, and tailored AI mentoring.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Welcome to Super TudoLearn!</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Your 7-day free trial is now active. Enjoy limitless practice!
              </p>
            </div>
          ) : (
            <>
              {/* Feature Highlights */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: Heart, text: 'Unlimited Hearts — Never pause your study flow', color: 'text-rose-500' },
                  { icon: Zap, text: '100% Ad-Free uninterrupted learning', color: 'text-amber-500' },
                  { icon: Download, text: 'Offline Mode — Download lessons for flights and travel', color: 'text-blue-600' },
                  { icon: Sparkles, text: 'Unlimited Pip AI Tutor explanations & speech coaching', color: 'text-indigo-600' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-1.5 rounded-xl bg-slate-100">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Plan Switcher */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                    billingCycle === 'yearly'
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400 font-black'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                    SAVE 50%
                  </span>
                  <div className="text-xs font-black text-slate-500 uppercase">12 Months</div>
                  <div className="text-lg font-black text-slate-900">$4.99<span className="text-xs text-slate-500 font-semibold">/mo</span></div>
                  <div className="text-[10px] text-blue-700 font-bold">$59.99 billed annually</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400 font-black'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-black text-slate-500 uppercase">Monthly</div>
                  <div className="text-lg font-black text-slate-900">$9.99<span className="text-xs text-slate-500 font-semibold">/mo</span></div>
                  <div className="text-[10px] text-slate-500 font-bold">Cancel anytime</div>
                </button>
              </div>

              {/* Payment Methods */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'google_pay', label: 'Google Pay' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`flex-1 py-2 px-1 text-xs font-black rounded-xl border-2 transition-all cursor-pointer text-center ${
                      paymentMethod === pm.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-2 mb-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700">{cardNumber}</span>
                    <span className="text-xs font-bold text-slate-400">12/28</span>
                  </div>
                </div>
              )}

              {/* CTA Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-500/20 border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Activating Super TudoLearn...</span>
                ) : (
                  <>
                    <span>START 7-DAY FREE TRIAL</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 mt-3 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero charge today. Cancel easily anytime in settings.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
