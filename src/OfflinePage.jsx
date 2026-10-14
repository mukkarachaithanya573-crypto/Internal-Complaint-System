import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  Zap, 
  Droplet, 
  HeartPulse, 
  Building2,
  HardDriveDownload,
  ExternalLink
} from 'lucide-react';

/**
 * Enterprise-Grade Professional Offline Page for RGUKT RK Valley ICS Portal
 * Shown automatically when network connection drops or central server is unreachable.
 */
export default function OfflinePage({ onRetry, onDismiss, offlineQueueCount = 0 }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryStatus, setRetryStatus] = useState(null);

  const handleTestConnection = async () => {
    setIsRetrying(true);
    setRetryStatus(null);
    try {
      if (typeof onRetry === 'function') {
        const connected = await onRetry();
        if (connected) {
          setRetryStatus('connected');
          return;
        }
      }
      // Direct ping test fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('/version.json?t=' + Date.now(), { 
        method: 'HEAD', 
        cache: 'no-store',
        signal: controller.signal 
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        setRetryStatus('connected');
        if (typeof onDismiss === 'function') {
          setTimeout(onDismiss, 600);
        }
      } else {
        setRetryStatus('failed');
      }
    } catch (e) {
      setRetryStatus('failed');
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  return (
    <div className="min-h-screen cyber-canvas-bg text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Ambient Neon Background Glows */}
      <div className="ambient-neon-cyan w-96 h-96 -top-24 -left-24 opacity-60 pointer-events-none"></div>
      <div className="ambient-neon-purple w-96 h-96 top-1/3 -right-24 opacity-50 pointer-events-none"></div>
      <div className="ambient-neon-cyan w-80 h-80 -bottom-20 left-1/3 opacity-30 pointer-events-none"></div>

      {/* Top University Branding Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs tracking-tighter">
                RKV
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">RGUKT RK VALLEY</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  OFFLINE CONTINGENCY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Internal Complaint System (ICS) · Centralized Redressal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>No Internet Connection</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center items-center text-center relative z-10">
        
        {/* Pulsating Animated Disconnect Radar Graphic */}
        <div className="relative mb-8">
          {/* Animated concentric rings */}
          <div className="absolute inset-0 -m-6 rounded-full border border-rose-500/20 animate-ping pointer-events-none"></div>
          <div className="absolute inset-0 -m-12 rounded-full border border-amber-500/10 pointer-events-none"></div>
          
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/80 border-2 border-rose-500/50 shadow-2xl shadow-rose-950/60 flex items-center justify-center relative">
            <WifiOff className="w-14 h-14 text-rose-400 animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg">
              !
            </div>
          </div>
        </div>

        {/* Title & Explanatory Lead */}
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl leading-tight">
          Campus Network Connection Lost
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mt-3 leading-relaxed">
          Your device is currently disconnected from the internet or the RGUKT campus intranet gateway. 
          ICS is operating in <strong className="text-amber-300">Offline Contingency Mode</strong>.
        </p>

        {/* Connection Diagnostics Banner */}
        <div className="w-full max-w-xl mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-left flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">Offline Safeguard Active</p>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
              Any complaint you draft now is cached locally in your device outbox. 
              The moment campus network returns, your complaint will auto-dispatch without data loss.
            </p>
            {offlineQueueCount > 0 && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[11px] font-bold">
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>{offlineQueueCount} complaint(s) queued in local outbox waiting for sync</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Retry vs Continue in Offline Mode */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mt-6">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isRetrying}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Checking Network Gateway...' : 'Test Connection & Reconnect'}</span>
          </button>

          {typeof onDismiss === 'function' && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Work in Offline Mode</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Retry status toast feedback */}
        {retryStatus === 'failed' && (
          <p className="text-xs text-rose-400 font-semibold mt-3 animate-in fade-in flex items-center gap-1.5">
            <span>❌ Still offline. Please verify Wi-Fi/LAN connection and try again.</span>
          </p>
        )}
        {retryStatus === 'connected' && (
          <p className="text-xs text-emerald-400 font-semibold mt-3 animate-in fade-in flex items-center gap-1.5">
            <span>✅ Network connection detected! Reconnecting to central portal...</span>
          </p>
        )}

        {/* 3 Offline Capability Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12 text-left">
          <div className="cyber-card p-5 rounded-2xl space-y-2 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Outbox Auto-Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lodge complaints normally. All form submissions are saved locally and synced automatically the instant Wi-Fi/LAN returns.
            </p>
          </div>

          <div className="cyber-card p-5 rounded-2xl space-y-2 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Cached Local Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Previously opened tickets, hostel room numbers, QR codes, and grievance tracking remain accessible from device cache.
            </p>
          </div>

          <div className="cyber-card p-5 rounded-2xl space-y-2 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Zero Data Loss</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Photos, GPS locations, and descriptions remain intact in encrypted local browser storage until successfully acknowledged.
            </p>
          </div>
        </div>

        {/* Emergency Campus Contacts (Crucial when offline during outages/emergencies) */}
        <div className="w-full max-w-4xl mt-8 pt-8 border-t border-slate-800/80 text-left">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Urgent Offline Helplines & Wardens' Direct Contacts</span>
              </h3>
              <p className="text-xs text-slate-400">If you are facing an immediate physical or medical emergency while offline, contact duty staff directly:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a 
              href="tel:08588283600" 
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Hostel Chief Warden</p>
                <p className="text-xs font-bold text-white truncate">08588-283600</p>
                <p className="text-[10px] text-emerald-400 font-semibold">Penna / Kundu / Papagni</p>
              </div>
            </a>

            <a 
              href="tel:08588283601" 
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Campus Security</p>
                <p className="text-xs font-bold text-white truncate">08588-283601</p>
                <p className="text-[10px] text-blue-400 font-semibold">Main Gate & Emergency</p>
              </div>
            </a>

            <a 
              href="tel:08588283602" 
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Health Center & Ambulance</p>
                <p className="text-xs font-bold text-white truncate">08588-283602</p>
                <p className="text-[10px] text-rose-400 font-semibold">24/7 Medical Care</p>
              </div>
            </a>

            <a 
              href="tel:08588283604" 
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Electrical & Substation</p>
                <p className="text-xs font-bold text-white truncate">08588-283604</p>
                <p className="text-[10px] text-amber-400 font-semibold">Power Outages & Sparking</p>
              </div>
            </a>
          </div>
        </div>

      </main>

      {/* University Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-400">
        <p>Rajiv Gandhi University of Knowledge Technologies (RGUKT) · RK Valley Campus, Vempalli, AP 516330</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Automated Offline Resiliency · Central Maintenance & Infrastructure Services</p>
      </footer>
    </div>
  );
}
