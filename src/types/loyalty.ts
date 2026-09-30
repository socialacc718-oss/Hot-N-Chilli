export interface LoyaltyTransaction {
  id: string;
  date: string;
  orderId?: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  description: string;
}

export interface LoyaltyAccount {
  phoneNumber?: string;
  customerName?: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum VIP';
  transactions: LoyaltyTransaction[];
}

const STORAGE_KEY = 'hnc_loyalty_account';

export function getLoyaltyAccount(): LoyaltyAccount {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore error
  }

  // Default initial account with 150 welcome bonus points!
  const defaultAccount: LoyaltyAccount = {
    points: 150,
    tier: 'Bronze',
    transactions: [
      {
        id: 'txn-welcome',
        date: new Date().toISOString(),
        type: 'bonus',
        points: 150,
        description: 'Welcome Bonus: 150 Points Gift from HOT N CHILLI! 🎉',
      },
    ],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccount));
  } catch {
    // Ignore error
  }

  return defaultAccount;
}

export function saveLoyaltyAccount(account: LoyaltyAccount): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    // Ignore
  }
}

export function calculatePointsEarned(amount: number): number {
  // 1 point for every Rs. 20 spent
  return Math.floor(amount / 20);
}

export function getTier(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum VIP' {
  if (points >= 1500) return 'Platinum VIP';
  if (points >= 800) return 'Gold';
  if (points >= 300) return 'Silver';
  return 'Bronze';
}
