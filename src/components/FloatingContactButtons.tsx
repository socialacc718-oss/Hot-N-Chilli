import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const FloatingContactButtons: React.FC = () => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex flex-col items-center gap-3">
      {/* Green WhatsApp Round Button */}
      <a
        href={`https://wa.me/923335964018?text=${encodeURIComponent('Assalam-o-Alaikum! Mujhe Hot N Chilli se order krna hai.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/80 hover:scale-110 active:scale-95 transition-all ring-4 ring-emerald-500/20"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>

      {/* Red Call Round Button */}
      <a
        href={`tel:${RESTAURANT_INFO.whatsappNumber}`}
        aria-label="Call Restaurant"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-red-700 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-950/80 hover:scale-110 active:scale-95 transition-all ring-4 ring-red-700/20"
      >
        <Phone className="w-6 h-6 fill-white stroke-none" />
      </a>
    </div>
  );
};
