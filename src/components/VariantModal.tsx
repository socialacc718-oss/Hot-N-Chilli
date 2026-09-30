import React, { useState, useEffect } from 'react';
import { MenuItem, MenuItemVariant } from '../data/menuData';
import { formatPrice } from '../utils/orderUtils';
import { X, Plus, Minus, Check, Flame, MessageSquare } from 'lucide-react';

interface VariantModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    variant: MenuItemVariant | undefined,
    addCheese: boolean,
    quantity: number,
    instructions: string
  ) => void;
}

export const VariantModal: React.FC<VariantModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [addCheese, setAddCheese] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : undefined);
      setAddCheese(false);
      setQuantity(1);
      setInstructions('');
    }
  }, [item]);

  // Calculate unit and total price
  const basePrice = selectedVariant ? selectedVariant.price : item.price;
  const cheesePrice = addCheese ? 100 : 0;
  const unitPrice = basePrice + cheesePrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, selectedVariant, addCheese, quantity, instructions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-950 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                Customize Dish
              </span>
              {item.isVegetarian && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-800/40">
                  Veg
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {item.name}
            </h2>
            {item.description && (
              <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Variants Selection (if any) */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
                Select Size / Serving Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.variants.map((v) => {
                  const isChecked = selectedVariant?.name === v.name;
                  return (
                    <button
                      type="button"
                      key={v.name}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-red-950/50 border-red-500 text-white shadow-md shadow-red-950/40 ring-1 ring-red-500/50'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked ? 'border-red-500 bg-red-600' : 'border-stone-600'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-bold">{v.name}</span>
                      </div>
                      <span className="text-sm font-extrabold text-amber-400">
                        {formatPrice(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cheese Add-on (For burgers/sandwiches) */}
          {item.hasCheeseAddon && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5">
                Optional Add-on
              </label>
              <div
                onClick={() => setAddCheese(!addCheese)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  addCheese
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      addCheese ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-600'
                    }`}
                  >
                    {addCheese && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Add Extra Melted Cheese Slice</span>
                    <span className="text-xs text-stone-400">Delicious extra cheese inside</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-400">+Rs. 100</span>
              </div>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>Special Instructions for Kitchen (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kam mirch (mild spicy), extra sauce, crisp well, etc."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
                Quantity
              </span>
              <span className="text-xs text-stone-400">Total portions to order</span>
            </div>

            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-2xl p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-900 text-stone-300 hover:bg-stone-800 active:scale-95 transition-all"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-base font-black text-amber-400">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-900 text-stone-300 hover:bg-stone-800 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer: Total & Add Button */}
        <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase">
              Total Amount
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-2xl shadow-xl shadow-red-950/60 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
