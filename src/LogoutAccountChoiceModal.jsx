import React from 'react';
import { LogOut, UserCheck, Users, RotateCcw, X, Shield, ArrowRight } from 'lucide-react';

/**
 * LogoutAccountChoiceModal
 * 
 * Prompts the user upon logout:
 * "Do you like to login with another account or same account?"
 * Carries forward accordingly:
 *  - Same account: Preserves current identifier for quick 1-tap re-entry
 *  - Another account: Completely clears session storage & saved user tokens for a clean sign-in
 */
export default function LogoutAccountChoiceModal({
  isOpen,
  currentUser,
  onSelectSameAccount,
  onSelectAnotherAccount,
  onCancel
}) {
  if (!isOpen) return null;

  const displayName = currentUser?.fullName || currentUser?.name || 'Campus Resident';
  const displayId = currentUser?.idNo || currentUser?.staffId || currentUser?.collegeEmail || currentUser?.email || 'Active Account';
  const isDept = currentUser?.userTab === 'department' || currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF';
  const roleLabel = isDept ? 'Faculty / Department' : 'Student Resident';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md portal-modal-overlay animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onCancel) {
          onCancel();
        }
      }}
    >
      <div 
        className="w-full max-w-md bg-[#111319] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] portal-modal-drawer flex flex-col font-sans relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe-Indicator Pill */}
        <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto my-2 md:hidden shrink-0" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Top Header Row with Close Icon */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] p-1.5 flex items-center justify-center shadow-inner">
              <img 
                src="/logo.png?v=original" 
                alt="RGUKT Crest" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Account Logout
              </h2>
              <span className="text-[10.5px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Session Control
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/[0.06]"
            title="Cancel and stay logged in"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Question */}
        <div className="mt-4 mb-3 relative z-10">
          <p className="text-sm font-semibold text-zinc-100 leading-snug">
            Do you like to log in with another account or the same account?
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Choose how you would like to proceed with your next login session.
          </p>
        </div>

        {/* Current Active Account Profile Card */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm shrink-0 overflow-hidden">
            {currentUser?.profilePic ? (
              <img 
                src={currentUser.profilePic} 
                alt={displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span>{(displayName[0] || 'U').toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-white truncate block">
              {displayName}
            </span>
            <span className="text-[11px] text-zinc-400 truncate block font-mono">
              {displayId}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            {roleLabel}
          </span>
        </div>

        {/* Choice Options Stack */}
        <div className="space-y-2.5 relative z-10">
          {/* OPTION 1: Same Account */}
          <button
            type="button"
            onClick={onSelectSameAccount}
            className="w-full p-3.5 rounded-2xl bg-[#161922] hover:bg-[#1C212D] border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all cursor-pointer group flex items-center gap-3.5 shadow-sm active:scale-[0.99] min-h-[48px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Log in with Same Account
                </span>
                <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Quick Re-entry
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
                Pre-fill credentials for <strong className="text-zinc-200">{displayId}</strong> so you can sign in directly.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* OPTION 2: Another Account */}
          <button
            type="button"
            onClick={onSelectAnotherAccount}
            className="w-full p-3.5 rounded-2xl bg-[#161922] hover:bg-[#1C212D] border border-white/[0.08] hover:border-cyan-500/50 text-left transition-all cursor-pointer group flex items-center gap-3.5 shadow-sm active:scale-[0.99] min-h-[48px]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Log in with Another Account
                </span>
                <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  Switch User
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
                Clear saved session & open a clean login screen for another Student ID or Google SSO.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>

        {/* Footer Cancel Action */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] text-center relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg min-h-[40px]"
          >
            Cancel & Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
