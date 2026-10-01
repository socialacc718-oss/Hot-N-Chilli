import React, { useState } from 'react';
import { CartItem, CustomerDetails, OrderType, PlacedOrder } from '../types/order';
import { RESTAURANT_INFO } from '../data/menuData';
import { HotNChilliLogo } from './HotNChilliLogo';
import { formatPrice, generateOrderId, getWhatsAppUrl } from '../utils/orderUtils';
import { calculatePointsEarned } from '../types/loyalty';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  MessageCircle,
  ArrowRight,
  Info,
  Gift,
  Coins,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: PlacedOrder) => void;
  availableLoyaltyPoints: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  availableLoyaltyPoints,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerLandmark, setCustomerLandmark] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 2500 ? 0 : RESTAURANT_INFO.deliveryFee) : 0;
  
  // Loyalty redemption: 1 Point = Rs. 1 discount (capped up to 50% of subtotal or total points)
  const maxRedeemable = Math.min(availableLoyaltyPoints, Math.floor(subtotal * 0.5));
  const loyaltyDiscount = redeemPoints && maxRedeemable > 0 ? maxRedeemable : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - loyaltyDiscount);
  const pointsToEarn = calculatePointsEarned(grandTotal);

  const minOrderMet = orderType === 'takeaway' || subtotal >= RESTAURANT_INFO.minimumDeliveryOrder;
  const amountNeeded = RESTAURANT_INFO.minimumDeliveryOrder - subtotal;
  const minOrderPercent = Math.min(100, Math.round((subtotal / RESTAURANT_INFO.minimumDeliveryOrder) * 100));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items first.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid WhatsApp / contact phone number (e.g., 0333 1234567).');
      return;
    }

    if (orderType === 'delivery' && !customerAddress.trim()) {
      setErrorMessage('Please enter your complete delivery address.');
      return;
    }

    if (orderType === 'delivery' && !minOrderMet) {
      setErrorMessage(`Minimum order for delivery is Rs. ${RESTAURANT_INFO.minimumDeliveryOrder}/-. Please add Rs. ${amountNeeded}/- more items.`);
      return;
    }

    // Build order object
    const customer: CustomerDetails = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      landmark: customerLandmark.trim(),
      notes: customerNotes.trim(),
      orderType,
    };

    const newOrder: PlacedOrder = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      items: [...items],
      customer,
      subtotal,
      deliveryFee,
      loyaltyDiscount,
      pointsRedeemed: loyaltyDiscount,
      pointsEarned: pointsToEarn,
      grandTotal,
      whatsappUrl: '',
    };

    const waUrl = getWhatsAppUrl(newOrder);
    newOrder.whatsappUrl = waUrl;

    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }

    onOrderPlaced(newOrder);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative z-10 w-full max-w-full sm:max-w-md md:max-w-lg h-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col overflow-hidden text-stone-100"
        style={{ width: '100%' }}
      >
        {/* Header with Official Logo */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <HotNChilliLogo size={38} className="shrink-0 drop-shadow-md" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                HOT N CHILLI Cart
              </h2>
              <p className="text-xs text-stone-400">
                {items.length === 0 ? 'No items yet' : `${items.length} item(s) selected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded bg-stone-900 border border-stone-800 hover:border-red-800 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-600">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="max-w-xs space-y-1">
              <h3 className="text-base font-bold text-white">Your Cart is Empty</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Add delicious Karahi, Handi, BBQ, Karachi Broast, Rolls or Chinese items to place your order.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-lg"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-5">
            {/* Order Type Toggle */}
            <div className="bg-stone-950 p-1.5 rounded-2xl border border-stone-800 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  orderType === 'takeaway'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Takeaway / Pickup</span>
              </button>
            </div>

            {/* Minimum Delivery Notice */}
            {orderType === 'delivery' && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  minOrderMet
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-bold">
                  <span className="flex items-center gap-1.5">
                    {minOrderMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                    <span>
                      {minOrderMet
                        ? 'Minimum delivery requirement reached!'
                        : `Add ${formatPrice(amountNeeded)} more for delivery`}
                    </span>
                  </span>
                  <span className="text-[11px] font-black">{minOrderPercent}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      minOrderMet ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${minOrderPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Selected Items */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
                Selected Items ({items.length})
              </span>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800/90 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.menuItem.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.selectedVariant && (
                          <span className="text-[10px] font-semibold bg-red-950/70 text-red-300 px-2 py-0.5 rounded border border-red-800/40">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        {item.addCheese && (
                          <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                            +Extra Cheese
                          </span>
                        )}
                      </div>
                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-400 italic mt-1">
                          &ldquo;{item.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                    <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-950 text-stone-300 hover:bg-stone-800"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-amber-400">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-950 text-stone-300 hover:bg-stone-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-stone-400">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </div>
                      <div className="text-sm font-black text-white">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Loyalty Points Redemption Section */}
            {availableLoyaltyPoints > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Redeem Reward Points</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {availableLoyaltyPoints} Pts Available
                  </span>
                </div>
                <div
                  onClick={() => setRedeemPoints(!redeemPoints)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    redeemPoints
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        redeemPoints ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-600'
                      }`}
                    >
                      {redeemPoints && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">
                      Use {maxRedeemable} Points for Discount
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">
                    Save {formatPrice(maxRedeemable)}
                  </span>
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            <form onSubmit={handleCheckout} className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                  Delivery Details
                </span>
                <span className="text-[10px] text-stone-400">* Required</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-300 mb-1">
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0333 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
                />
              </div>

              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Complete Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat #, Street, Sector / Area, Jinnah Garden..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Mosque, Behind Main Market"
                      value={customerLandmark}
                      onChange={(e) => setCustomerLandmark(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-300 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kam mirch, extra sauce, call on arrival"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 shrink-0 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-200 font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-stone-200 font-bold">
                  {orderType === 'delivery'
                    ? deliveryFee > 0
                      ? formatPrice(deliveryFee)
                      : 'FREE'
                    : 'N/A (Takeaway)'}
                </span>
              </div>
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Loyalty Discount ({loyaltyDiscount} pts)</span>
                  <span>-{formatPrice(loyaltyDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-white pt-1.5 border-t border-stone-800">
                <span>Total Payable</span>
                <span className="text-amber-400 font-black">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Points Earn badge */}
            <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded-xl flex items-center justify-between">
              <span>You will earn on this order:</span>
              <span className="font-black text-amber-400">+{pointsToEarn} Reward Points</span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={orderType === 'delivery' && !minOrderMet}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-[0.98] cursor-pointer ${
                orderType === 'delivery' && !minOrderMet
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-950/60 ring-2 ring-emerald-500/40'
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
              <span>
                {orderType === 'delivery' && !minOrderMet
                  ? `Min Order Rs. ${RESTAURANT_INFO.minimumDeliveryOrder} Needed`
                  : 'Send Order Slip to WhatsApp 🔥'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Official Logo Branding Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
              <HotNChilliLogo size={18} />
              <span>HOT N CHILLI Kitchen Direct WhatsApp Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
