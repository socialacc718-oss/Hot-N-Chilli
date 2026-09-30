import { MenuItem, MenuItemVariant } from '../data/menuData';

export interface CartItem {
  id: string; // Unique cart item ID (combining item id + variant + addons)
  menuItem: MenuItem;
  selectedVariant?: MenuItemVariant;
  addCheese?: boolean; // For burgers/sandwiches
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export type OrderType = 'delivery' | 'takeaway';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  notes?: string;
  orderType: OrderType;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  deliveryFee: number;
  loyaltyDiscount?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
  grandTotal: number;
  whatsappUrl: string;
}
