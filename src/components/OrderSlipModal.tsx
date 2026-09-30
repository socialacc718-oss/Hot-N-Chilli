import React from 'react';
import { PlacedOrder } from '../types/order';
import { RESTAURANT_INFO } from '../data/menuData';
import { formatPrice } from '../utils/orderUtils';
import { 
  X, 
  Printer, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Flame,
  Gift
} from 'lucide-react';
import { HotNChilliLogo } from './HotNChilliLogo';

interface OrderSlipModalProps {
  order: PlacedOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSlipModal: React.FC<OrderSlipModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-950 p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Order Confirmed!</h3>
              <p className="text-xs text-emerald-400 font-semibold">
                Slip Sent to WhatsApp ({RESTAURANT_INFO.whatsappFormatted})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          {/* Roman Urdu Confirmation */}
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 text-xs leading-relaxed">
            <p className="font-bold text-emerald-300">Shukriya, {order.customer.name}! 🎉</p>
            <p className="mt-0.5">
              Aap ki digital order slip generate ho chuki hai. Agar WhatsApp automatically open nahi hua toh neechay 
              <strong> &ldquo;Open WhatsApp Now&rdquo; </strong> button par click kar ke order slip kitchen counter ko send kar sakte hain.
            </p>
            {order.pointsEarned && order.pointsEarned > 0 ? (
              <p className="mt-1 font-bold text-amber-300 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                <span>Mubarak ho! Is order se aap ko +{order.pointsEarned} Loyalty Points mil gaye hain!</span>
              </p>
            ) : null}
          </div>

          {/* Thermal Bill Slip */}
          <div
            id="thermal-slip"
            className="bg-white text-stone-900 rounded-2xl p-4 sm:p-6 shadow-xl font-mono text-xs sm:text-sm border border-stone-300 space-y-4"
          >
            {/* Header with Logo */}
            <div className="text-center border-b-2 border-dashed border-stone-300 pb-4 space-y-1">
              <div className="flex justify-center mb-1">
                <HotNChilliLogo size={56} />
              </div>
              <div className="font-sans font-black text-xl text-stone-950 tracking-wider">
                HOT N CHILLI
              </div>
              <p className="text-xs font-serif italic text-stone-600">&ldquo;Taste you want!&rdquo;</p>
              <p className="text-[11px] text-stone-600 max-w-xs mx-auto leading-tight pt-1">
                {RESTAURANT_INFO.address}
              </p>
              <p className="text-[11px] font-bold text-stone-800">
                Helpline: {RESTAURANT_INFO.whatsappFormatted} | {RESTAURANT_INFO.phoneDisplay}
              </p>
            </div>

            {/* Order Meta */}
            <div className="flex justify-between items-center text-xs py-1 border-b border-dashed border-stone-200">
              <div>
                <span className="text-stone-500">Order ID: </span>
                <span className="font-bold font-sans text-red-600">{order.orderId}</span>
              </div>
              <div className="text-right text-stone-500">
                {new Date(order.createdAt).toLocaleDateString('en-PK')} •{' '}
                {new Date(order.createdAt).toLocaleTimeString('en-PK', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
              <div>
                <strong>Customer:</strong> {order.customer.name} ({order.customer.phone})
              </div>
              <div>
                <strong>Type:</strong>{' '}
                {order.customer.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Takeaway / Pickup'}
              </div>
              {order.customer.orderType === 'delivery' && (
                <div>
                  <strong>Address:</strong> {order.customer.address}
                  {order.customer.landmark && ` (Near ${order.customer.landmark})`}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div>
              <div className="grid grid-cols-12 font-bold text-[11px] uppercase border-b-2 border-stone-800 pb-1 mb-2 text-stone-700">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-xs py-1 border-b border-stone-100">
                    <div className="col-span-6 font-sans">
                      <div className="font-bold text-stone-900 leading-tight">
                        {item.menuItem.name}
                      </div>
                      <div className="text-[10px] text-stone-500 flex flex-wrap gap-1 mt-0.5">
                        {item.selectedVariant && (
                          <span className="bg-stone-200 px-1 rounded">{item.selectedVariant.name}</span>
                        )}
                        {item.addCheese && (
                          <span className="bg-amber-100 text-amber-800 px-1 rounded">+Cheese</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-bold">{item.quantity}</div>
                    <div className="col-span-2 text-right text-stone-600">
                      {formatPrice(item.unitPrice).replace('Rs. ', '')}
                    </div>
                    <div className="col-span-2 text-right font-bold text-stone-900">
                      {formatPrice(item.totalPrice).replace('Rs. ', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="border-t-2 border-dashed border-stone-300 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>
                  {order.customer.orderType === 'delivery'
                    ? order.deliveryFee > 0
                      ? formatPrice(order.deliveryFee)
                      : 'FREE'
                    : 'N/A'}
                </span>
              </div>
              {order.loyaltyDiscount && order.loyaltyDiscount > 0 ? (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Loyalty Points Discount:</span>
                  <span>-{formatPrice(order.loyaltyDiscount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-black border-t-2 border-stone-800 pt-2 text-stone-950">
                <span>GRAND TOTAL:</span>
                <span className="text-red-700">{formatPrice(order.grandTotal)}</span>
              </div>
              {order.pointsEarned ? (
                <div className="flex justify-between text-[11px] font-bold text-amber-800 bg-amber-50 p-1.5 rounded">
                  <span>Reward Points Earned:</span>
                  <span>+{order.pointsEarned} PTS</span>
                </div>
              ) : null}
            </div>

            <div className="text-center border-t border-dashed border-stone-300 pt-3 space-y-1">
              <p className="text-[11px] font-bold text-stone-800 uppercase">
                *** THANK YOU FOR ORDERING ***
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                HOT N CHILLI • Freshly Cooked • Authentic Flavours
              </p>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={order.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs sm:text-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open WhatsApp Now</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 px-4 rounded-xl border border-stone-700 transition-all text-xs sm:text-sm active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip / PDF</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <a
              href={`tel:${RESTAURANT_INFO.whatsappNumber}`}
              className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Branch: {RESTAURANT_INFO.phoneDisplay}</span>
            </a>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white underline font-semibold cursor-pointer"
            >
              Close & Order More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
