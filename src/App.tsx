import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, CATEGORIES, MenuItem, MenuItemVariant, RESTAURANT_INFO } from './data/menuData';
import { CartItem, PlacedOrder } from './types/order';
import { LoyaltyAccount, getLoyaltyAccount, saveLoyaltyAccount, getTier } from './types/loyalty';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuItemCard } from './components/MenuItemCard';
import { VariantModal } from './components/VariantModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSlipModal } from './components/OrderSlipModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { Footer } from './components/Footer';
import { Search, Flame, Sparkles, Filter, CheckCircle2, ChevronRight, Gift } from 'lucide-react';

export default function App() {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hnc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Loyalty Program Account state
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount>(() => getLoyaltyAccount());
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const menuSectionRef = useRef<HTMLDivElement>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hnc_cart', JSON.stringify(cart));
    } catch {
      // Ignored
    }
  }, [cart]);

  // Cart totals
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Trigger quick toast
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2500);
  };

  // Add to cart handler
  const handleAddToCart = (
    item: MenuItem,
    variant: MenuItemVariant | undefined,
    addCheese: boolean,
    quantity: number,
    instructions: string
  ) => {
    const unitPrice = (variant ? variant.price : item.price) + (addCheese ? 100 : 0);
    const cartItemId = `${item.id}-${variant?.name || 'base'}-${addCheese ? 'cheese' : 'no_cheese'}-${instructions || ''}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItem: item,
          selectedVariant: variant,
          addCheese,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          specialInstructions: instructions,
        };
        return [...prev, newItem];
      }
    });

    triggerToast(`Added ${item.name} (${quantity}x) to Cart!`);
  };

  const handleQuickAdd = (item: MenuItem, variant?: MenuItemVariant) => {
    handleAddToCart(item, variant, false, 1, '');
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleCardQuantityUpdate = (item: MenuItem, delta: number) => {
    const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
    if (cartItem) {
      handleUpdateCartQuantity(cartItem.id, delta);
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // When order is placed: process loyalty points earned & redeemed
  const handleOrderPlaced = (order: PlacedOrder) => {
    setIsCartOpen(false);
    setPlacedOrder(order);

    // Update loyalty points
    setLoyaltyAccount((prev) => {
      let currentPoints = prev.points;
      const transactions = [...prev.transactions];

      // If points were redeemed
      if (order.pointsRedeemed && order.pointsRedeemed > 0) {
        currentPoints = Math.max(0, currentPoints - order.pointsRedeemed);
        transactions.unshift({
          id: `txn-red-${Date.now()}`,
          date: new Date().toISOString(),
          orderId: order.orderId,
          type: 'redeemed',
          points: order.pointsRedeemed,
          description: `Redeemed on Order #${order.orderId}`,
        });
      }

      // Points earned on current order
      if (order.pointsEarned && order.pointsEarned > 0) {
        currentPoints += order.pointsEarned;
        transactions.unshift({
          id: `txn-earn-${Date.now()}`,
          date: new Date().toISOString(),
          orderId: order.orderId,
          type: 'earned',
          points: order.pointsEarned,
          description: `Earned from Order #${order.orderId}`,
        });
      }

      const updated: LoyaltyAccount = {
        ...prev,
        points: currentPoints,
        phoneNumber: order.customer.phone || prev.phoneNumber,
        customerName: order.customer.name || prev.customerName,
        tier: getTier(currentPoints),
        transactions,
      };

      saveLoyaltyAccount(updated);
      return updated;
    });

    triggerToast(`Order #${order.orderId} Placed! Slip sent to WhatsApp.`);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MENU_ITEMS.length };
    MENU_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (vegOnly && !item.isVegetarian) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, vegOnly]);

  const groupedSections = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim() !== '') {
      return null;
    }

    return CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
      const items = filteredItems.filter((i) => i.category === cat.id);
      return {
        category: cat,
        items,
      };
    }).filter((section) => section.items.length > 0);
  }, [selectedCategory, searchQuery, filteredItems]);

  const scrollToMenu = () => {
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-red-600 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Toast popup */}
      {showToast && (
        <aside
          aria-label="Notification"
          className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center gap-2 animate-bounce"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{showToast}</span>
        </aside>
      )}

      {/* Main Navbar with Official Logo & Loyalty Points */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) setSelectedCategory('all');
        }}
        loyaltyPoints={loyaltyAccount.points}
        onOpenLoyalty={() => setIsLoyaltyModalOpen(true)}
      />

      {/* Hero Banner (WhatsApp button moved to floating position as requested) */}
      <HeroBanner
        onExploreMenu={scrollToMenu}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        onOpenLoyalty={() => setIsLoyaltyModalOpen(true)}
      />

      {/* Category Navigation Bar */}
      <div ref={menuSectionRef}>
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setSearchQuery('');
          }}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Menu Area */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filters and search info bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500 fill-orange-500" />
              <span>
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory === 'all'
                  ? 'Complete Restaurant Menu'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Showing {filteredItems.length} dishes • Authentic taste & live cooked
            </p>
          </div>

          {/* Quick Veg Filter Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300 ring-1 ring-emerald-500/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>🌱 Veg Only</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-stone-900/40 border border-stone-800/80 rounded-3xl max-w-md mx-auto">
            <Search className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No items found</h3>
            <p className="text-xs text-stone-400 mb-4">
              Try searching for &ldquo;Karahi&rdquo;, &ldquo;Handi&rdquo;, &ldquo;Broast&rdquo; or &ldquo;Platter&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegOnly(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : groupedSections ? (
          /* Grouped by categories when "All Items" selected - 2 cols on mobile, 3 on tablet, 4 on desktop */
          <div className="space-y-12">
            {groupedSections.map((section) => (
              <section key={section.category.id} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-red-600 to-amber-500" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
                        {section.category.name}
                      </h3>
                      {section.category.badge && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          {section.category.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(section.category.id);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Only</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {section.items.map((item) => {
                    const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
                    const qtyInCart = cartItem ? cartItem.quantity : 0;
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onOpenVariantModal={setVariantModalItem}
                        onQuickAdd={handleQuickAdd}
                        quantityInCart={qtyInCart}
                        onUpdateCartQuantity={handleCardQuantityUpdate}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Flat 2-column mobile, 4-column PC grid when single category or search is active */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
              const qtyInCart = cartItem ? cartItem.quantity : 0;
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onOpenVariantModal={setVariantModalItem}
                  onQuickAdd={handleQuickAdd}
                  quantityInCart={qtyInCart}
                  onUpdateCartQuantity={handleCardQuantityUpdate}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for mobile */}
      <FloatingCartBar
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Floating WhatsApp and Call Action Buttons (Stacked on bottom right as shown in screenshot) */}
      <FloatingContactButtons />

      {/* Cart Drawer with Loyalty Points Redemption */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        availableLoyaltyPoints={loyaltyAccount.points}
      />

      {/* Variant & Size Selection Modal */}
      <VariantModal
        item={variantModalItem}
        isOpen={Boolean(variantModalItem)}
        onClose={() => setVariantModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Instant Digital Order Slip Modal */}
      <OrderSlipModal
        order={placedOrder}
        isOpen={Boolean(placedOrder)}
        onClose={() => setPlacedOrder(null)}
      />

      {/* Customer Loyalty Club Modal */}
      <LoyaltyModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        account={loyaltyAccount}
        onUpdateAccount={setLoyaltyAccount}
      />

      {/* Footer */}
      <Footer onSelectCategory={setSelectedCategory} />
    </div>
  );
}
