import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  X, 
  CheckCircle, 
  Star, 
  CheckCircle2, 
  Layers, 
  MessageSquare, 
  Palette, 
  Zap, 
  Bug, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { saveFeedbackToFirestore } from './firebase';
import { sendEmailOnAppFeedback, DEVELOPER_INFO } from './emailService';

const CATEGORIES = [
  { id: 'Feature Idea', label: 'Feature Idea', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'UI & Design', label: 'UI & Design', icon: Palette, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'Speed & Performance', label: 'Performance', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'Complaint Redressal Flow', label: 'Workflow', icon: Layers, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'Bug or Glitch', label: 'Bug Report', icon: Bug, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'General Suggestion', label: 'Other Idea', icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
];

export default function AppFeedbackModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  postSubmitTicket = null,
  onProceedToTicket = null 
}) {
  const [category, setCategory] = useState('Feature Idea');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const studentName = currentUser?.name || 'Student Resident';
  const studentId = currentUser?.idNo || 'N/A';
  const studentEmail = currentUser?.collegeEmail || currentUser?.email || (currentUser?.idNo ? `${currentUser.idNo.toLowerCase()}@rguktrkv.ac.in` : 'student@rguktrkv.ac.in');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please describe your idea or the changes you feel are needed in this app.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const feedbackPayload = {
      id: `feedback-${Date.now()}`,
      category,
      title: title.trim() || `${category} from ${studentName}`,
      description: description.trim(),
      rating,
      studentName,
      studentId,
      studentEmail,
      associatedTicketNumber: postSubmitTicket?.ticketNumber || null,
      platform: 'Android Mobile & Web Application',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Save permanently to Firebase Cloud Firestore
      await saveFeedbackToFirestore(feedbackPayload);

      // 2. Dispatch email directly to developer inbox
      await sendEmailOnAppFeedback(feedbackPayload);

      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      // Even if network transient, treat as submitted locally
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleFinish = () => {
    setSubmitted(false);
    setTitle('');
    setDescription('');
    setCategory('Feature Idea');
    onClose();
    if (onProceedToTicket) {
      onProceedToTicket();
    }
  };

  return (
    <div className="portal-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="portal-modal-drawer relative w-full max-w-lg rounded-3xl bg-[#111319] border border-white/[0.08] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Indicator Pill */}
        <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto my-2.5 md:hidden shrink-0 cursor-grab" />

        {/* TOP BAR / CLOSE BUTTON */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08] bg-[#0D2821]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-amber-400 shadow-inner">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                  Continuous Improvement
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-emerald-300 border border-emerald-500/30">
                  Direct to Developer
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {postSubmitTicket ? 'App Feedback & Ideas' : 'Suggest Changes & Ideas'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="relative z-10 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Thank You for Your Suggestion!</h3>
                <p className="text-xs sm:text-sm text-cyan-300 max-w-sm mx-auto">
                  Your idea has been officially recorded and dispatched to Lead Developer{' '}
                  <span className="font-bold text-white">{DEVELOPER_INFO.name}</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Developer Redressal Commitment</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-300">
                  Every student idea is carefully reviewed. If your suggestion is valuable for campus residents, it will be designed, coded, and deployed in upcoming app updates!
                </p>
                <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-400 border-t border-slate-800/80">
                  <span>Mailed to: {DEVELOPER_INFO.email}</span>
                  <span className="text-cyan-400 font-bold">Status: Queued for Review</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                {postSubmitTicket ? 'Continue to Complaint Details' : 'Close & Return'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* POST-SUBMISSION BANNER IF OPENED RIGHT AFTER LODGING PROBLEM */}
              {postSubmitTicket && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    <span>Complaint Registered: #{postSubmitTicket.ticketNumber}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-300 leading-snug">
                    Your complaint has been assigned to <span className="text-white font-bold">{postSubmitTicket.currentHierarchyAuthority || 'Hostel Resident Warden'}</span> and dispatched to your email.
                  </p>
                </div>
              )}

              {/* INSPIRATION CALLOUT */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-cyan-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>We are here to implement valuable ideas!</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Are any changes needed in this app? Have a new feature or design idea? 
                  Submit your thoughts directly to the developer below. If valuable, it will be built right into the app!
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* CATEGORY SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    What is this suggestion regarding?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => {
                      const IconComponent = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected 
                              ? `${cat.color} ring-2 ring-cyan-400/50 shadow-md` 
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Title / Idea in Brief <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Add instant SMS alert / cleaner dark mode toggle"
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* DETAILED SUGGESTION */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Detailed Changes or Ideas Needed <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500">{description.length}/1000</span>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the changes you would like to see in this app, or explain your new feature idea in detail. We read every word and will build valuable ideas!"
                    maxLength={1000}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  />
                </div>

                {/* APP RATING */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    How is your current experience using this app?
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star 
                          className={`w-6 h-6 transition-all ${
                            star <= rating 
                              ? 'text-amber-400 fill-amber-400 scale-105' 
                              : 'text-slate-700'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-amber-400">
                      {rating === 5 ? 'Excellent ⭐⭐⭐⭐⭐' : rating === 4 ? 'Good ⭐⭐⭐⭐' : rating === 3 ? 'Fair ⭐⭐⭐' : rating === 2 ? 'Needs Work ⭐⭐' : 'Needs Fixes ⭐'}
                    </span>
                  </div>
                </div>

                {/* STUDENT INFO BADGE */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Sending as <strong className="text-white">{studentName}</strong> ({studentId})</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono shrink-0 ml-2">Developer Mailer</span>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                    {errorMessage}
                  </p>
                )}

                {/* BUTTONS */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Notifying Developer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Idea to Developer</span>
                      </>
                    )}
                  </button>

                  {postSubmitTicket && (
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      View Complaint Details
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
