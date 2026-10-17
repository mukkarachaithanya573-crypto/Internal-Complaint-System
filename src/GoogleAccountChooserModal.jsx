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
      setAccounts(DEFAULT_ACCOUNTS);
    }
  }, [suggestedEmail, isOpen]);

  if (!isOpen) return null;

  const handlePickAccount = (account) => {
    setSelectedEmail(account.email);
    // Persist to local accounts list
    try {
      const existing = accounts.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
      const updated = [account, ...existing];
      localStorage.setItem('rgukt_google_accounts', JSON.stringify(updated));
    } catch (e) {}

    setTimeout(() => {
      onSelectAccount({
        email: account.email,
        name: account.name || account.email.split('@')[0],
        photoURL: account.avatar || null
      });
      onClose();
    }, 200);
  };

  const handleAddNewAccount = (e) => {
    e?.preventDefault();
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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl shadow-cyan-950/50 overflow-hidden my-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header Accent */}
        <div className="p-5 sm:p-6 pb-3 text-center relative border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
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
          <p className="text-xs text-slate-400 mt-0.5">
            to continue to <strong className="text-cyan-300">Internal Complaint System (RGUKT)</strong>
          </p>
        </div>

        {/* ACCOUNT LIST */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2">
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
                        ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {acc.avatar ? (
                        <img 
                          src={acc.avatar} 
                          alt={acc.name} 
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                          {acc.initial || acc.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-white truncate">{acc.name}</p>
                          {acc.badge && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                              {acc.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{acc.email}</p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* USE ANOTHER ACCOUNT BUTTON */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full p-3 rounded-2xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-900/40 hover:bg-slate-850 text-left transition-all flex items-center gap-3 cursor-pointer text-slate-300 hover:text-white"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                  <Plus className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold">Use another Google account</p>
                  <p className="text-[10.5px] text-slate-400">Sign in with any @gmail.com or @rgukt.ac.in ID</p>
                </div>
              </button>
            </>
          ) : (
            /* ADD ANOTHER ACCOUNT FORM */
            <form onSubmit={handleAddNewAccount} className="space-y-3.5 py-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Google or College Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. mukkarachaithanya573@gmail.com or r240493@rguktrkv.ac.in"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Your Full Name <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mukkara Chaithanya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  Continue with this Account
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setErrorMsg(''); }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* GOOGLE PRIVACY FOOTER */}
        <div className="p-3.5 bg-slate-950/70 border-t border-slate-800 text-[10px] text-slate-400 text-center leading-relaxed">
          <span>To continue, Google will share your name and email with Internal Complaint System.</span>
        </div>
      </div>
    </div>
  );
}
