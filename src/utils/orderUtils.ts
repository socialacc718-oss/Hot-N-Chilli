import { CartItem, CustomerDetails, PlacedOrder } from '../types/order';
import { RESTAURANT_INFO } from '../data/menuData';

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HNC-${timestamp}${random}`.slice(0, 11);
}

export function buildWhatsAppSlip(order: PlacedOrder): string {
  const dateStr = new Date(order.createdAt).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const itemsList = order.items
    .map((item, idx) => {
      let desc = `${idx + 1}. *${item.menuItem.name}*`;
      if (item.selectedVariant) {
        desc += ` [${item.selectedVariant.name}]`;
      }
      if (item.addCheese) {
        desc += ` (+Extra Cheese)`;
      }
      desc += `\n   ↳ Qty: *${item.quantity}* × ${formatPrice(item.unitPrice)} = *${formatPrice(item.totalPrice)}*`;
      if (item.specialInstructions) {
        desc += `\n   Note: _${item.specialInstructions}_`;
      }
      return desc;
    })
    .join('\n');

  const slip = `🔥 *HOT N CHILLI - ONLINE ORDER SLIP* 🔥
"Taste you want!"
━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* ${order.orderId}
⏰ *Time:* ${dateStr}
📦 *Order Type:* ${order.customer.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Takeaway / Pickup'}

👤 *CUSTOMER DETAILS:*
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}
${
  order.customer.orderType === 'delivery'
    ? `• Address: ${order.customer.address}${order.customer.landmark ? `\n• Landmark: ${order.customer.landmark}` : ''}`
    : '• Pickup from Branch: Main Naval Road, Jinnah Garden Gate 2'
}
${order.customer.notes ? `• Special Instructions: ${order.customer.notes}` : ''}

🛒 *ORDERED ITEMS:*
━━━━━━━━━━━━━━━━━━━━━━━━
${itemsList}
━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatPrice(order.subtotal)}
🛵 *Delivery Fee:* ${order.customer.orderType === 'delivery' ? (order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'FREE') : 'N/A'}
${order.loyaltyDiscount && order.loyaltyDiscount > 0 ? `🎁 *Loyalty Discount (${order.pointsRedeemed} pts):* -${formatPrice(order.loyaltyDiscount)}\n` : ''}💳 *GRAND TOTAL: ${formatPrice(order.grandTotal)}*
━━━━━━━━━━━━━━━━━━━━━━━━
${order.pointsEarned ? `⭐ *Reward Points Earned on this Order:* +${order.pointsEarned} PTS\n━━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}📍 *Branch Address:* ${RESTAURANT_INFO.address}
📞 *Helpline / WhatsApp:* ${RESTAURANT_INFO.whatsappFormatted}

_Please confirm my order as soon as possible. Thank you!_`;

  return slip;
}

export function getWhatsAppUrl(order: PlacedOrder): string {
  const text = buildWhatsAppSlip(order);
  const cleanNumber = '923335964018';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
