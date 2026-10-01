import React from 'react';
import { Flame, MapPin, MessageCircle, Clock } from 'lucide-react';
import { RESTAURANT_INFO, CATEGORIES } from '../data/menuData';
import { HotNChilliLogo } from './HotNChilliLogo';

interface FooterProps {
  onSelectCategory: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-stone-950 border-t border-stone-850 text-stone-300 pt-12 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-stone-850">
          {/* Brand Info with Official Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <HotNChilliLogo size={52} className="shrink-0 drop-shadow-lg" />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-display">
                  HOT N CHILLI
                </h3>
                <p className="text-xs text-amber-500 font-bold">&ldquo;{RESTAURANT_INFO.tagline}&rdquo;</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              Serving the authentic taste of Pakistan with charcoal live BBQ, special clay handis, fresh chicken and mutton karahi, crispy broast, rolls and Chinese delicacies.
            </p>

            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  {RESTAURANT_INFO.address}{' '}
                  <a
                    href={RESTAURANT_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 font-semibold underline hover:text-amber-300 ml-1 inline-block"
                  >
                    (Google Maps)
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{RESTAURANT_INFO.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Complains */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <HotNChilliLogo size={20} className="shrink-0" />
              <span>Contact & Complaints</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Delivery & WhatsApp Orders
                </span>
                <a
                  href={`https://wa.me/923335964018`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{RESTAURANT_INFO.whatsappFormatted}</span>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Branch Landlines / Order Phone
                </span>
                <div className="flex items-center gap-3 font-bold text-stone-200">
                  <a href="tel:0515964018" className="hover:text-amber-400 transition-colors">
                    (051) 596 4018
                  </a>
                  <span>•</span>
                  <a href="tel:0515964019" className="hover:text-amber-400 transition-colors">
                    (051) 596 4019
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Head Office Complain No.
                </span>
                <a href="tel:03009299009" className="font-bold text-red-400 hover:text-red-300">
                  {RESTAURANT_INFO.headOffice}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Menu Categories */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 fill-orange-500" />
              <span>Menu Categories</span>
            </h4>

            <ul className="grid grid-cols-2 gap-1.5 text-xs text-stone-400">
              {CATEGORIES.slice(1, 9).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left truncate w-full"
                  >
                    • {cat.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-[11px] text-red-300 font-bold">
                🛵 Min Delivery: Rs. {RESTAURANT_INFO.minimumDeliveryOrder}/-
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright with Logo */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <HotNChilliLogo size={22} className="shrink-0" />
            <p>© {new Date().getFullYear()} HOT N CHILLI Restaurant. All rights reserved.</p>
          </div>
          <p className="flex items-center gap-1.5">
            <span>Prepared fresh with love & spice</span>
            <Flame className="w-3.5 h-3.5 text-red-500 fill-orange-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
