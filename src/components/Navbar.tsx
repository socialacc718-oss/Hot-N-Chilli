import React, { useState } from 'react';
import { ShoppingBag, MapPin, Phone, MessageCircle, Search, X, Gift, Coins } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { HotNChilliLogo } from './HotNChilliLogo';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loyaltyPoints: number;
  onOpenLoyalty: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  loyaltyPoints,
  onOpenLoyalty,
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 shadow-lg">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white text-xs py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap scrollbar-none text-[11px] sm:text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <span>🔥 Minimum Delivery Order: <strong>Rs. {RESTAURANT_INFO.minimumDeliveryOrder}/-</strong></span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <button
              onClick={onOpenLoyalty}
              className="flex items-center gap-1 bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-black text-[10px] hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <Gift className="w-3 h-3" />
              <span>Rewards: {loyaltyPoints} Pts</span>
            </button>
            <span className="hidden md:inline text-white/60">|</span>
            <span className="hidden md:inline text-white/90">{RESTAURANT_INFO.openingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Official Hot N Chilli Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <HotNChilliLogo size={50} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-wider text-white uppercase drop-shadow-sm font-display leading-tight">
                  HOT N CHILLI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-500 tracking-wide leading-tight">
                {RESTAURANT_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search Karahi, Handi, BBQ, Biryani, Rolls, Broast..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500/80 rounded-full pl-10 pr-9 py-2 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Loyalty Rewards Button */}
            <button
              onClick={onOpenLoyalty}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all cursor-pointer"
              title="View Loyalty Points & Rewards"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Club:</span>
              <span>{loyaltyPoints} pts</span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search items"
              className="md:hidden p-2 text-stone-300 hover:text-white hover:bg-stone-900 rounded-lg border border-stone-800"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Location Link */}
            <a
              href={RESTAURANT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-300 transition-colors"
              title="Google Maps Location"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="truncate max-w-[120px]">Jinnah Garden</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold shadow-lg shadow-red-950/60 active:scale-95 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-red-200 uppercase font-bold tracking-wider leading-none">
                  Cart
                </div>
                <div className="text-xs font-bold leading-tight">
                  {cartTotal > 0 ? `Rs. ${cartTotal.toLocaleString()}` : '0 Items'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search input expander */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search food, karahi, handi, rolls..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl pl-10 pr-9 py-2 text-sm text-stone-100 placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
