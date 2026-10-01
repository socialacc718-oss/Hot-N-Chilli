import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuItem, MenuItemVariant } from '../data/menuData';
import { formatPrice } from '../utils/orderUtils';
import { getDishImage } from '../data/dishImages';
import { Plus, Minus, Heart } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenVariantModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, variant?: MenuItemVariant) => void;
  quantityInCart: number;
  onUpdateCartQuantity?: (item: MenuItem, delta: number) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onOpenVariantModal,
  onQuickAdd,
  quantityInCart,
  onUpdateCartQuantity,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const hasVariants = Boolean(item.variants && item.variants.length > 0);
  const hasOptions = hasVariants || item.hasCheeseAddon;

  const imageUrl = item.image || getDishImage(item.id, item.category);

  // Starting price
  const startingPrice = hasVariants
    ? Math.min(...(item.variants?.map((v) => v.price) || [item.price]))
    : item.price;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 450);

    if (hasOptions) {
      onOpenVariantModal(item);
    } else {
      onQuickAdd(item);
    }
  };

  return (
    <motion.div 
      onClick={() => hasOptions && onOpenVariantModal(item)}
      whileHover={{ 
        scale: 1.025, 
        y: -4,
        transition: { duration: 0.22, ease: "easeOut" }
      }}
      animate={isAddedAnim ? { 
        scale: [1, 1.055, 0.985, 1],
        transition: { duration: 0.4, ease: "easeInOut" }
      } : { scale: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col justify-between bg-stone-900 border border-stone-800/90 hover:border-red-600/50 rounded-3xl p-3 sm:p-4 transition-colors duration-300 hover:shadow-2xl hover:shadow-red-950/25 cursor-pointer will-change-transform"
    >
      <div>
        {/* Image Area with Heart & Floating Red Plus button */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950/60 mb-3 border border-stone-800/80">
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {item.popular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-stone-950 shadow-md">
                HOT
              </span>
            )}
            {item.isVegetarian && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
                Veg
              </span>
            )}
          </div>

          {/* Top Right Heart Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            aria-label="Save to wishlist"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md active:scale-90 transition-all z-10"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-red-600 text-red-600' : 'text-stone-600'
              }`}
            />
          </button>

          {/* Floating Red Circular Plus Button with motion scale */}
          <motion.button
            type="button"
            onClick={handleActionClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            animate={isAddedAnim ? { scale: [1, 1.25, 0.95, 1], rotate: [0, 15, -10, 0] } : {}}
            aria-label={`Add ${item.name}`}
            className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-black/60 transition-colors z-10 ring-2 ring-stone-900 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            {quantityInCart > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black flex items-center justify-center shadow-md">
                {quantityInCart}
              </span>
            )}
          </motion.button>
        </div>

        {/* Dish Title */}
        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
          {item.name}
        </h3>

        {/* Subtitle / Description */}
        <p className="text-[11px] sm:text-xs text-stone-400 uppercase tracking-tight line-clamp-2 mt-1 min-h-[2rem]">
          {item.description || 'FRESHLY COOKED TO ORDER WITH SPECIAL SPICES'}
        </p>
      </div>

      {/* Card Bottom: Price and In-Cart Quantity / Options */}
      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-sm sm:text-base font-black text-amber-400">
            {formatPrice(startingPrice)}
          </span>
          {hasVariants && (
            <span className="text-[10px] text-stone-400 block -mt-0.5">options available</span>
          )}
        </div>

        {quantityInCart > 0 && onUpdateCartQuantity && !hasOptions ? (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5"
          >
            <button
              onClick={() => onUpdateCartQuantity(item, -1)}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-stone-900 text-stone-300 hover:bg-red-600 hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-amber-400">
              {quantityInCart}
            </span>
            <button
              onClick={() => onUpdateCartQuantity(item, 1)}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-stone-900 text-stone-300 hover:bg-red-600 hover:text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-stone-400 group-hover:text-amber-400 uppercase tracking-wider transition-colors">
            {hasOptions ? 'Customize →' : '+ Add'}
          </span>
        )}
      </div>
    </motion.div>
  );
};
