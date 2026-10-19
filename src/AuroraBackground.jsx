import React from 'react';

/**
 * AuroraBackground
 * 
 * Global Aurora Ambient Mesh Glow with Frosted Glassmorphism Canvas
 * Designed to match the reference image (media_1792389485520.jpg)
 * 1. Base Canvas: Deep Midnight Slate (#070A0F)
 * 2. Dynamic Orbs: Vibrant Emerald Green (#10B981) and Midnight Blue/Cyan (#06B6D4 / #2563EB)
 *    with 60fps GPU acceleration (translate3d, will-change: transform) and 100px Gaussian blur
 * 3. Elevation Mesh: Subtle topographic wireframe contour curves
 * 4. Micro-Texture: Topographic grid texture
 * 5. Ambient Sparkle Stars: 4-point diamond star accents (✦ and ✧)
 */
export default function AuroraBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#070A0F]"
      style={{ willChange: 'transform' }}
    >
      {/* Dynamic Aurora Orb 1: Vibrant Emerald Green (#10B981) */}
      <div 
        className="aurora-orb aurora-orb-emerald absolute -top-[5%] -left-[10%] w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] rounded-full blur-[90px] sm:blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.25) 40%, rgba(6, 78, 59, 0.12) 65%, transparent 75%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Dynamic Aurora Orb 2: Vibrant Midnight Blue / Cyan (#06B6D4 / #2563EB) */}
      <div 
        className="aurora-orb aurora-orb-blue absolute top-[25%] -right-[10%] w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full blur-[90px] sm:blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.38) 0%, rgba(37, 99, 235, 0.25) 45%, rgba(14, 59, 92, 0.12) 65%, transparent 80%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Dynamic Aurora Orb 3: Deep Institutional Teal Ambient Glow */}
      <div 
        className="aurora-orb aurora-orb-teal absolute -bottom-[10%] left-[20%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.18) 50%, transparent 75%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Subtle Topographic Elevation Contour Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d="M-100 200 C 150 100, 300 350, 600 250 C 900 150, 1100 300, 1400 200 C 1600 100, 1900 250, 2200 150" fill="none" stroke="url(#topoGrad)" strokeWidth="1" />
        <path d="M-100 260 C 180 160, 330 400, 630 310 C 930 220, 1130 360, 1430 260 C 1630 160, 1930 310, 2230 210" fill="none" stroke="url(#topoGrad)" strokeWidth="1" />
        <path d="M-100 320 C 210 220, 360 450, 660 370 C 960 290, 1160 420, 1460 320 C 1660 220, 1960 370, 2260 270" fill="none" stroke="url(#topoGrad)" strokeWidth="1" />
        <path d="M-100 700 C 200 600, 400 800, 800 680 C 1200 560, 1500 750, 1900 640 C 2100 580, 2300 700, 2500 620" fill="none" stroke="url(#topoGrad)" strokeWidth="1" />
        <path d="M-100 760 C 230 660, 430 850, 830 740 C 1230 630, 1530 810, 1930 700 C 2130 640, 2330 760, 2530 680" fill="none" stroke="url(#topoGrad)" strokeWidth="1" />
      </svg>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 64px 64px, 64px 64px'
        }}
      />

      {/* Subtle Ambient Sparkle Stars matching reference image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Bottom Right 4-Point Star Sparkle */}
        <div className="absolute bottom-16 right-12 text-emerald-300/70 opacity-90 animate-pulse pointer-events-none text-2xl select-none drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]">
          ✦
        </div>
        <div className="absolute bottom-10 right-28 text-cyan-200/60 opacity-70 pointer-events-none text-base select-none drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
          ✧
        </div>
        {/* Top Left Faint Sparkle */}
        <div className="absolute top-20 left-16 text-emerald-400/50 opacity-60 pointer-events-none text-sm select-none drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]">
          ✦
        </div>
      </div>
    </div>
  );
}
