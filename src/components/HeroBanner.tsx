import React from 'react';
import { Flame, Sparkles, Clock, ShieldCheck, Gift } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroBannerProps {
  onExploreMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenLoyalty: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMenu,
  onOpenCart,
  cartCount,
  onOpenLoyalty,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border-b border-stone-800">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-700/50 text-red-300 text-xs font-semibold tracking-wide shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 fill-red-500 animate-pulse" />
              <span>Sizzling Hot • Live BBQ • Authentic Handi</span>
              <span className="hidden sm:inline text-red-500">•</span>
              <span className="hidden sm:inline text-amber-300">Min Order Rs. {RESTAURANT_INFO.minimumDeliveryOrder}/-</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-display leading-tight">
                HOT N CHILLI <br />
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  RESTAURANT
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-amber-400 font-bold italic tracking-wide">
                &ldquo;{RESTAURANT_INFO.tagline}&rdquo;
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Order your favorite Pakistani Desi Handi, Special Karahi, Charcoal Live BBQ, Karachi Broast, Chinese & Rolls online. 
              <strong className="text-stone-100 font-semibold"> Order kartay hi instant WhatsApp digital slip generate ho kar kitchen ko send ho jaye gi!</strong>
            </p>

            {/* Action Buttons: WhatsApp button removed from here as requested and placed as floating button on bottom-right */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-950/70 hover:shadow-red-900/50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>View Full Menu & Order</span>
              </button>

              <button
                onClick={onOpenLoyalty}
                className="px-5 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm sm:text-base transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Rewards Club (Earn Points)</span>
              </button>

              {cartCount > 0 && (
                <button
                  onClick={onOpenCart}
                  className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm active:scale-95 transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <span>Open Cart ({cartCount})</span>
                </button>
              )}
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto lg:mx-0 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">100% Halal</div>
                  <div className="text-[10px] text-stone-400">Fresh Flavours</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-left">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Instant Slip</div>
                  <div className="text-[10px] text-stone-400">Auto WhatsApp</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-left">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Fast Delivery</div>
                  <div className="text-[10px] text-stone-400">12 PM - 2 AM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-stone-800 p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-red-400 tracking-wider uppercase">
                    Customer Loyalty & Rewards
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">
                  HOT CLUB
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs text-stone-300">
                <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Earn Points On Every Order</span>
                    <span className="text-[11px] text-stone-400">Har Rs. 20 ke order par 1 Reward Point milta hai</span>
                  </div>
                  <span className="text-sm font-black text-amber-400 shrink-0">5% Value</span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Redeem Cash Discounts</span>
                    <span className="text-[11px] text-stone-400">1 Point = Rs. 1 Instant discount at checkout</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400 shrink-0">1 Pt = Rs. 1</span>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-amber-950/40 border border-amber-600/30 flex items-center justify-between">
                  <div>
                    <span className="font-black text-amber-300 block">Welcome Gift: 150 Points</span>
                    <span className="text-[11px] text-stone-400">Naye customers ke liye 150 points bilkul muft</span>
                  </div>
                  <button
                    onClick={onOpenLoyalty}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-colors cursor-pointer"
                  >
                    Check Balance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
