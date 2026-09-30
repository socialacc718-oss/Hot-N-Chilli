import React, { useRef } from 'react';
import { CATEGORIES } from '../data/menuData';
import { 
  Flame, 
  Utensils, 
  Soup, 
  Sparkles, 
  Drumstick, 
  Wheat, 
  UtensilsCrossed, 
  Sandwich, 
  CookingPot, 
  Fish, 
  Pizza, 
  Salad, 
  CupSoda, 
  ChevronLeft, 
  ChevronRight,
  CircleDot
} from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-red-400'}`;
    switch (iconName) {
      case 'Flame': return <Flame className={iconClass} />;
      case 'Soup': return <Soup className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Drumstick': return <Drumstick className={iconClass} />;
      case 'Wheat': return <Wheat className={iconClass} />;
      case 'Wrap': return <UtensilsCrossed className={iconClass} />;
      case 'Sandwich': return <Sandwich className={iconClass} />;
      case 'CookingPot': return <CookingPot className={iconClass} />;
      case 'Fish': return <Fish className={iconClass} />;
      case 'Pizza': return <Pizza className={iconClass} />;
      case 'Salad': return <Salad className={iconClass} />;
      case 'CupSoda': return <CupSoda className={iconClass} />;
      default: return <Utensils className={iconClass} />;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-md py-2.5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative flex items-center">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll categories left"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 mr-1.5 transition-all shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 scale-[1.02]'
                    : 'bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800/90 border border-stone-800/90 hover:border-stone-700'
                }`}
              >
                {getIcon(cat.icon, isSelected)}
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-stone-950/60 text-amber-300'
                        : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700 group-hover:text-stone-200'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {cat.badge && (
                  <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-amber-400 text-stone-950' : 'bg-red-950 text-red-400 border border-red-800/40'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll categories right"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 ml-1.5 transition-all shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
