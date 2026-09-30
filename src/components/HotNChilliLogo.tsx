import React from 'react';

interface HotNChilliLogoProps {
  className?: string;
  size?: number;
}

export const HotNChilliLogo: React.FC<HotNChilliLogoProps> = ({ className = '', size = 52 }) => {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Flame Gradients */}
          <linearGradient id="flameGradOuter" x1="200" y1="300" x2="200" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="40%" stopColor="#ea580c" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          <linearGradient id="flameGradInner" x1="200" y1="280" x2="200" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>

          {/* Chili Gradient */}
          <linearGradient id="chiliGrad" x1="100" y1="250" x2="330" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="35%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#4ade80" />
            <stop offset="90%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Chili Stem */}
          <linearGradient id="stemGrad" x1="300" y1="160" x2="330" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Circle Background */}
        <circle cx="200" cy="200" r="190" fill="#ffffff" stroke="#227d3c" strokeWidth="18" />

        {/* Inner subtle guide circle */}
        <circle cx="200" cy="200" r="172" fill="none" stroke="#227d3c" strokeWidth="2.5" opacity="0.4" />

        {/* --- Blazing Flame Layer (Background of Chili) --- */}
        <g filter="url(#shadow)">
          {/* Main big flame */}
          <path
            d="M 125 240 
               C 105 200, 115 150, 140 120 
               C 145 150, 160 170, 170 145 
               C 185 110, 195 70, 205 60 
               C 215 90, 230 130, 240 100 
               C 255 125, 275 145, 280 175 
               C 285 205, 275 235, 260 250 
               C 240 230, 245 200, 235 185 
               C 225 200, 220 225, 215 245 
               C 210 215, 190 195, 180 180 
               C 170 205, 160 230, 145 245 
               Z"
            fill="url(#flameGradOuter)"
          />

          {/* Inner core hot flame */}
          <path
            d="M 145 235 
               C 135 200, 145 165, 165 145 
               C 172 165, 180 175, 188 160 
               C 198 135, 205 95, 210 90 
               C 218 115, 228 140, 236 125 
               C 245 145, 258 165, 255 190 
               C 240 180, 238 200, 230 215 
               C 220 200, 205 185, 198 175 
               C 192 195, 185 215, 170 230 
               Z"
            fill="url(#flameGradInner)"
          />
        </g>

        {/* --- Green Chili Pepper (curved across the flame) --- */}
        <g filter="url(#shadow)">
          {/* Stem */}
          <path
            d="M 288 152 
               C 295 135, 308 118, 320 108 
               C 324 105, 328 108, 325 114 
               C 318 126, 305 142, 298 158 
               Z"
            fill="url(#stemGrad)"
          />
          {/* Stem Calyx Cap */}
          <path
            d="M 280 148 
               C 285 138, 298 142, 306 150 
               C 300 158, 292 162, 282 164 
               C 284 156, 281 152, 280 148 
               Z"
            fill="#15803d"
          />

          {/* Chili Body */}
          <path
            d="M 105 220 
               C 135 240, 175 258, 225 258 
               C 275 258, 305 220, 298 158 
               C 275 195, 240 220, 190 225 
               C 155 228, 125 220, 105 220 
               Z"
            fill="url(#chiliGrad)"
            stroke="#15803d"
            strokeWidth="3"
          />

          {/* Chili shine / highlight */}
          <path
            d="M 130 226 
               C 165 238, 210 242, 255 230 
               C 230 234, 185 232, 145 224 
               Z"
            fill="#ffffff"
            opacity="0.5"
          />
        </g>

        {/* --- Center Banner Plate for Text --- */}
        <g filter="url(#shadow)">
          <rect
            x="18"
            y="245"
            width="364"
            height="85"
            rx="6"
            fill="#ffffff"
            stroke="#227d3c"
            strokeWidth="12"
          />
          {/* Inner banner boundary line */}
          <rect
            x="26"
            y="253"
            width="348"
            height="69"
            rx="3"
            fill="#ffffff"
            stroke="#227d3c"
            strokeWidth="2"
            opacity="0.3"
          />
        </g>

        {/* --- "HOT 'N' CHILLI" Text in Banner --- */}
        <g>
          {/* "HOT" in bold red */}
          <text
            x="36"
            y="312"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontSize="64"
            fontWeight="900"
            fill="#dc2626"
            letterSpacing="-1"
          >
            HOT
          </text>

          {/* "'N'" in bold green */}
          <text
            x="184"
            y="310"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontSize="54"
            fontWeight="900"
            fill="#227d3c"
          >
            &apos;N&apos;
          </text>

          {/* "CHILLI" in bold green */}
          <text
            x="240"
            y="312"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontSize="62"
            fontWeight="900"
            fill="#227d3c"
            letterSpacing="-1"
          >
            CHILLI
          </text>
        </g>

        {/* --- "RESTAURANT" Curved Text Below Banner --- */}
        <path id="restaurantPath" d="M 90 350 Q 200 395 310 350" fill="none" />
        <text
          fontSize="30"
          fontFamily="'Arial Black', sans-serif"
          fontWeight="900"
          fill="#dc2626"
          letterSpacing="4"
        >
          <textPath href="#restaurantPath" startOffset="50%" textAnchor="middle">
            RESTAURANT
          </textPath>
        </text>
      </svg>
    </div>
  );
};
