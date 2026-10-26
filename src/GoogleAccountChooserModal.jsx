import React, { useState, useEffect } from 'react';
import { X, User, Plus, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

const DEFAULT_ACCOUNTS = [
  {
    name: 'Mukkara Chaithanya',
    email: 'mukkarachaithanya573@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    initial: 'M',
    badge: 'Developer / Lead'
  },
  {
    name: 'RGUKT Student Resident',
    email: 'r240493@rguktrkv.ac.in',
    avatar: null,
    initial: 'R',
    badge: 'Official Campus Mail'
  }
];

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
  suggestedEmail = ''
}) {
  const [accounts, setAccounts] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem('rgukt_google_accounts');
      let loadedAccounts = savedRaw ? JSON.parse(savedRaw) : [];
      
      // Merge with default accounts if not already present
      const emailMap = new Set(loadedAccounts.map(a => a.email.toLowerCase()));
      
      DEFAULT_ACCOUNTS.forEach(def => {
        if (!emailMap.has(def.email.toLowerCase())) {
          loadedAccounts.push(def);
          emailMap.add(def.email.toLowerCase());
        }
      });

      // Merge previously authenticated Google user if available
      try {
        const cachedGoogle = localStorage.getItem('rgukt_google_auth_user');
        if (cachedGoogle) {
          const g = JSON.parse(cachedGoogle);
          if (g && g.email && !emailMap.has(g.email.toLowerCase())) {
            loadedAccounts.unshift({
              name: g.displayName || g.email.split('@')[0],
              email: g.email.toLowerCase(),
              avatar: g.photoURL || null,
              initial: (g.displayName || g.email).charAt(0).toUpperCase(),
              badge: 'Connected Google Account'
            });
            emailMap.add(g.email.toLowerCase());
          }
        }
      } catch (err) {}

      // Merge registered campus users
      try {
        const campusUsersRaw = localStorage.getItem('rgukt_campus_users');
        if (campusUsersRaw) {
          const campusUsers = JSON.parse(campusUsersRaw);
          if (Array.isArray(campusUsers)) {
            campusUsers.forEach(u => {
              const uEmail = (u.collegeEmail || u.email || '').toLowerCase().trim();
              if (uEmail && !emailMap.has(uEmail)) {
                loadedAccounts.push({
                  name: u.fullName || u.name || uEmail.split('@')[0],
                  email: uEmail,
                  avatar: u.profilePic || null,
                  initial: (u.fullName || u.name || uEmail).charAt(0).toUpperCase(),
                  badge: u.role === 'ADMIN' ? 'Administrator' : u.role === 'STAFF' ? 'Department Staff' : 'Registered Student'
                });
                emailMap.add(uEmail);
              }
            });
          }
        }
      } catch (err) {}

      if (suggestedEmail && !emailMap.has(suggestedEmail.toLowerCase())) {
        loadedAccounts.unshift({
          name: suggestedEmail.split('@')[0].toUpperCase(),
          email: suggestedEmail.toLowerCase(),
          avatar: null,
          initial: suggestedEmail.charAt(0).toUpperCase(),
          badge: 'Entered Email'
        });
      }

      setAccounts(loadedAccounts);
    } catch (e) {
      console.warn('Could not load google accounts:', e);
      setAccounts(DEFAULT_ACCOUNTS);
    }
  }, [suggestedEmail, isOpen]);

  if (!isOpen) return null;

  const handlePickAccount = (acc) => {
    setSelectedEmail(acc.email);
    
    // Remember this account for future rapid logins
    try {
      const savedRaw = localStorage.getItem('rgukt_google_accounts');
      let current = savedRaw ? JSON.parse(savedRaw) : [];
      if (!current.some(a => a.email.toLowerCase() === acc.email.toLowerCase())) {
        current.unshift(acc);
        localStorage.setItem('rgukt_google_accounts', JSON.stringify(current));
      }
    } catch (e) {}

    setTimeout(() => {
      onSelectAccount({
        displayName: acc.name,
        email: acc.email,
        photoURL: acc.avatar || null,
        uid: 'google-sim-' + btoa(acc.email).replace(/[^a-zA-Z0-9]/g, '')
      });
      onClose();
    }, 200);
  };

  const handleAddNewAccount = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = (newEmail || '').trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid Google or college email address.');
      return;
    }

    const cleanName = (newName || '').trim() || cleanEmail.split('@')[0];
    const newAcc = {
      name: cleanName,
      email: cleanEmail,
      avatar: null,
      initial: cleanName.charAt(0).toUpperCase(),
      badge: cleanEmail.includes('rgukt') ? 'RGUKT Account' : 'Google Account'
    };

    handlePickAccount(newAcc);
  };

  return (
    <div className="portal-modal-overlay fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="portal-modal-drawer relative w-full max-w-sm sm:max-w-md rounded-3xl bg-[#121820] border border-teal-500/20 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] overflow-hidden my-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Indicator Pill */}
        <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto my-2.5 md:hidden shrink-0 cursor-grab" />

        {/* Google Header Accent */}
        <div className="p-5 sm:p-6 pb-3 text-center relative border-b border-teal-500/15 bg-[#0E141B]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Official Google SVG Logo */}
          <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">Choose an account</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            to continue to <strong className="text-emerald-400">Internal Complaint System (RGUKT)</strong>
          </p>
        </div>

        {/* ACCOUNT LIST */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
          {!isAddingNew ? (
            <>
              {accounts.map((acc, idx) => {
                const isCurrent = selectedEmail === acc.email;
                return (
                  <button
                    key={acc.email || idx}
                    type="button"
                    onClick={() => handlePickAccount(acc)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                        : 'bg-[#0D1219] border-teal-500/15 hover:bg-[#161F28] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {acc.avatar ? (
                        <img 
                          src={acc.avatar} 
                          alt={acc.name} 
                          className="w-10 h-10 rounded-full border border-teal-500/30 object-cover shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                          {acc.initial || acc.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                          {acc.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                              {acc.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono truncate">{acc.email}</p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* USE ANOTHER ACCOUNT BUTTON */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full p-3 rounded-2xl border border-dashed border-teal-500/25 hover:border-emerald-400/60 bg-[#0D1219]/60 hover:bg-[#161F28] text-left transition-all flex items-center gap-3 cursor-pointer text-zinc-300 hover:text-white"
              >
                <div className="w-10 h-10 rounded-full bg-white/[0.04] text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
                  <Plus className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Use another Google account</p>
                  <p className="text-[10.5px] text-zinc-400">Sign in with any @gmail.com or @rgukt.ac.in ID</p>
                </div>
              </button>
            </>
          ) : (
            /* ADD ANOTHER ACCOUNT FORM */
            <form onSubmit={handleAddNewAccount} className="space-y-3.5 py-1">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Google or College Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. mukkarachaithanya573@gmail.com or r240493@rguktrkv.ac.in"
                  required
                  autoFocus
                  className="cyber-input w-full px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Your Full Name <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mukkara Chaithanya"
                  className="cyber-input w-full px-3.5 py-2.5 text-xs"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="cyber-btn-gradient flex-1 py-2.5 px-4 text-xs font-bold"
                >
                  Continue with this Account
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setErrorMsg(''); }}
                  className="cyber-btn-secondary py-2.5 px-3.5 text-xs"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* GOOGLE PRIVACY FOOTER */}
        <div className="p-3.5 bg-[#0E141B] border-t border-teal-500/15 text-[10px] text-zinc-400 text-center leading-relaxed">
          <span>To continue, Google will share your name and email with Internal Complaint System.</span>
        </div>
      </div>
    </div>
  );
}
