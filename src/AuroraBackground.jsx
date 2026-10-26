import React from 'react';

/**
 * AuroraBackground
 * 
 * High-performance Emerald-Teal-Charcoal Ambient Canvas
 * Pure CSS GPU-accelerated mesh with subtle radial highlights.
 * Designed to provide an ultra-clean, modern backdrop with zero CPU/DOM lag.
 */
export default function AuroraBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none charcoal-emerald-mesh"
    >
      {/* Subtle Dynamic Ambient Corner Accents */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.08) 45%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate3d(0,0,0)'
        }}
      />

      <div 
        className="absolute top-[30%] -right-[15%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(6, 182, 212, 0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate3d(0,0,0)'
        }}
      />

      <div 
        className="absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
          transform: 'translate3d(0,0,0)'
        }}
      />

      {/* Subtle Micro-Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(20, 184, 166, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 184, 166, 0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
}
