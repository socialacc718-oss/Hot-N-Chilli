import React, { useState } from 'react';
import { LoyaltyAccount, saveLoyaltyAccount, getTier } from '../types/loyalty';
import { 
  X, 
  Award, 
  Gift, 
  Flame, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';
import { formatPrice } from '../utils/orderUtils';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: LoyaltyAccount;
  onUpdateAccount: (account: LoyaltyAccount) => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
}) => {
  const [lookupPhone, setLookupPhone] = useState(account.phoneNumber || '');
  const [lookupMessage, setLookupMessage] = useState('');

  if (!isOpen) return null;

  const currentTier = getTier(account.points);

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) return;

    // Save phone to account
    const updated = {
      ...account,
      phoneNumber: lookupPhone.trim(),
    };
    saveLoyaltyAccount(updated);
    onUpdateAccount(updated);
    setLookupMessage(`Account linked to ${lookupPhone.trim()}! Points saved.`);
    setTimeout(() => setLookupMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-white">HOT N CHILLI Club</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  {currentTier}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium">Customer Loyalty & Rewards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Points Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-5 text-stone-950 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900/80">
                Available Reward Points
              </span>
              <Coins className="w-6 h-6 text-stone-950" />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-stone-950 font-display">
                {account.points}
              </span>
              <span className="text-lg font-black text-stone-900">PTS</span>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-950/20 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>Redemption Value:</span>
              <span className="text-sm font-black text-stone-950 bg-white/50 px-2 py-0.5 rounded-lg">
                {formatPrice(account.points)} Discount
              </span>
            </div>
          </div>

          {/* Quick Phone Linking Form */}
          <form onSubmit={handlePhoneLookup} className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300">
                Link Mobile / WhatsApp Number
              </label>
              {account.phoneNumber && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Linked
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="0333 1234567"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
            {lookupMessage && (
              <p className="text-[11px] text-emerald-400 font-semibold">{lookupMessage}</p>
            )}
          </form>

          {/* How Loyalty Works (Roman Urdu & English) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>How Points Work (Fawaid & Rules)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <span className="font-bold text-amber-300 block mb-1">🔥 1. Earn with Every Bite</span>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Har <strong>Rs. 20 ke order par 1 Reward Point</strong> milta hai (e.g. Rs. 2,000 order = 100 points!).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                <span className="font-bold text-emerald-400 block mb-1">💰 2. Instant Rupees Off</span>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  <strong>1 Point = Rs. 1 Cash Discount</strong>. Next order k checkout par points redeem kar ke direct discount hasil karein!
                </p>
              </div>
            </div>
          </div>

          {/* Points Transaction History */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
              Recent Points Activity
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {account.transactions.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No activity yet.</p>
              ) : (
                account.transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {txn.type === 'earned' || txn.type === 'bonus' ? (
                        <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-red-950 border border-red-700/60 text-red-400 flex items-center justify-center">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block leading-tight">
                          {txn.description}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(txn.date).toLocaleDateString('en-PK')}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-black ${
                        txn.type === 'redeemed' ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {txn.type === 'redeemed' ? `-${txn.points}` : `+${txn.points}`} PTS
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
