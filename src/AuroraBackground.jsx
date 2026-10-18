import React from 'react';

/**
 * AuroraBackground
 * 
 * Global Aurora Ambient Mesh Glow with Frosted Glassmorphism
 * 1. Base Canvas: Deep Midnight Slate (#070A0F) with overflow-hidden fixed positioning behind all pages
 * 2. Dynamic Orbs: Emerald (#064E3B/40%), Midnight Blue/Cyan (#0E3B5C/35%), and Ambient Teal (#0A2520/30%)
 *    with 60fps GPU acceleration (translate3d, will-change: transform) and 120px Gaussian blur
 * 3. Overlay: Subtle, faint grid/topographic micro-texture (opacity 0.04)
 */
export default function AuroraBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-[#070A0F]"
      style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
    >
      {/* Dynamic Aurora Orb 1: Deep Emerald Green (#064E3B / 40%) */}
      <div 
        className="aurora-orb aurora-orb-emerald absolute -top-[10%] -left-[10%] w-[650px] h-[650px] sm:w-[850px] sm:h-[850px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(6, 78, 59, 0.40) 0%, rgba(6, 78, 59, 0.16) 50%, transparent 75%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Dynamic Aurora Orb 2: Deep Midnight Blue / Cyan (#0E3B5C / 35%) */}
      <div 
        className="aurora-orb aurora-orb-blue absolute top-[20%] -right-[15%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(14, 59, 92, 0.35) 0%, rgba(14, 59, 92, 0.14) 50%, transparent 75%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Dynamic Aurora Orb 3: Deep Institutional Teal Ambient Glow */}
      <div 
        className="aurora-orb aurora-orb-teal absolute -bottom-[15%] left-[15%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(13, 40, 33, 0.35) 0%, rgba(10, 25, 47, 0.15) 55%, transparent 80%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Topographic Micro-Texture Overlay (Faint grid pattern opacity 0.04) */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 64px 64px, 64px 64px'
        }}
      />
    </div>
  );
}
