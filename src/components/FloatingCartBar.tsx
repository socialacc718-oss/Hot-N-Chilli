import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/orderUtils';

interface FloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  if (cartCount === 0) return null;

  return (
    <aside
      aria-label="Floating cart action"
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden bg-gradient-to-t from-black via-stone-950/95 to-transparent pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full flex items-center justify-between bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white p-3.5 rounded-2xl shadow-2xl shadow-red-950 ring-2 ring-red-500/50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-950/40 flex items-center justify-center font-black text-amber-300 text-xs">
              {cartCount}
            </div>
            <div className="text-left">
              <span className="text-[10px] text-red-100 font-bold uppercase tracking-wider block leading-none">
                View Cart
              </span>
              <span className="text-sm font-black text-white leading-tight">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-950/30 px-3 py-1.5 rounded-xl font-bold text-xs text-amber-200">
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </aside>
  );
};
