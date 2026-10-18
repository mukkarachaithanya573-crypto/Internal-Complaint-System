import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, ShieldAlert,
  Sparkles, Building2, Bell, Wifi, WifiOff, Users, ArrowRight, X,
  Clock, HelpCircle, Check, Eye, ShieldCheck, Mail, AlertTriangle,
  Layers, MapPin, Maximize2, Minimize2, Wrench, Zap, Droplet, Monitor,
  ChevronUp
} from 'lucide-react';

// Web Audio API Synthesizer for high-tech UI feedback and warp sounds across all playback speeds
function playUiSynthSound(type) {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!window._rguktAudioCtx || window._rguktAudioCtx.state === 'closed') {
      window._rguktAudioCtx = new AudioContextClass();
    }
    const ctx = window._rguktAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'turbo') {
      // 4x and 8x speed warp sweep (rich audible feedback even at maximum playback speeds)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'chapter') {
      // Pleasant double harmonic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.08); // G5
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'complete') {
      // Celebration triumph fanfare
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.62);
    }
  } catch (err) {
    // Non-blocking graceful fallback
  }
}

// CHAPTER DEFINITIONS FOR THE COMPREHENSIVE DEMO TOUR
const DEMO_CHAPTERS = [
  {
    id: 'auth_otp',
    title: '1. Identity & 2FA Webmail OTP',
    shortTitle: '2FA Auth',
    duration: 16, // seconds at 1x
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
    accentColor: '#38bdf8',
    turboAnnouncement: 'Chapter 1: Identity and Two-Factor Webmail Authentication!',
    subtitles: [
      'Welcome to RGUKT Hostel & Campus Complaint Management System.',
      'Students and staff authenticate securely using university credentials.',
      'Direct 2FA OTP verification is delivered instantly to student Webmail inbox.',
      'Department staff & wardens enjoy persistent 24-hour workday sessions.'
    ]
  },
  {
    id: 'location_picker',
    title: '2. Campus Location & Room Selector',
    shortTitle: 'Location',
    duration: 16,
    icon: MapPin,
    color: 'from-emerald-500 to-teal-500',
    accentColor: '#34d399',
    turboAnnouncement: 'Chapter 2: Hostel Dorm and Campus Location Selector!',
    subtitles: [
      'Pinpoint any maintenance issue across student dorms, academic halls, and labs.',
      'Select Hostel Blocks: Penna BH-1, BH-2, Krishna, Godavari, and Girls Hostels.',
      'Floor and room selection automatically hydrates resident details.',
      'Offline caching ensures dorm details remain selectable even without internet.'
    ]
  },
  {
    id: 'complaint_lodge',
    title: '3. Lodge Complaint & Anonymous Mode',
    shortTitle: 'Lodging',
    duration: 18,
    icon: Wrench,
    color: 'from-amber-500 to-orange-500',
    accentColor: '#fbbf24',
    turboAnnouncement: 'Chapter 3: Lodge Grievance and Anonymous Privacy Protection!',
    subtitles: [
      'Report issues across Electrical, Plumbing, Civil, IT Systems, and Mess.',
      'Attach live photo evidence with instant client-side preview & compression.',
      'Assign urgency: Low, Medium, High, or Urgent Priority with SLA tracking.',
      'Enable Identity Masking (Anonymous Mode) for sensitive issues to protect reporter privacy.'
    ]
  },
  {
    id: 'hostel_hierarchy',
    title: '4. 4-Tier Hostel Hierarchy Escalation',
    shortTitle: '4-Tier Escalation',
    duration: 22,
    icon: Layers,
    color: 'from-purple-500 to-indigo-500',
    accentColor: '#c084fc',
    turboAnnouncement: 'Chapter 4: Four-Tier Hierarchy Escalation from Warden to Director!',
    subtitles: [
      'The multi-tier governance automatically escalates unresolved hostel grievances.',
      'Stage 1: Hostel Warden conducts on-site review & dispatches technical staff.',
      'Stage 2: DSW & Department Staff execute repairs and electrical/plumbing works.',
      'Stage 3: Administrative Officer (AO) authorizes structural budgets and parts.',
      'Stage 4: Director Apex office resolves high-priority delays with statutory oversight.'
    ]
  },
  {
    id: 'icc_committee',
    title: '5. Statutory ICC Tri-Committee System',
    shortTitle: 'ICC Committee',
    duration: 20,
    icon: ShieldAlert,
    color: 'from-rose-500 to-pink-500',
    accentColor: '#fb7185',
    turboAnnouncement: 'Chapter 5: Statutory ICC Tri-Committee Protection System!',
    subtitles: [
      'Zero-tolerance statutory framework for campus safety and harassment prevention.',
      'Small Committee (3 Members): Presiding Officer + 2 Women Faculty for immediate action.',
      'Medium Committee (6 Members): Adds Legal Advisor, Student Rep, and NGO Member.',
      'Full Committee: Apex university panel with District Police Liaison for formal inquiries.',
      'Whistleblower protection and encrypted case proceedings guarantee full privacy.'
    ]
  },
  {
    id: 'tracker_notifications',
    title: '6. Live Tracker, Notifications & Offline Sync',
    shortTitle: 'Live Tracker',
    duration: 20,
    icon: Bell,
    color: 'from-cyan-500 to-blue-600',
    accentColor: '#22d3ee',
    turboAnnouncement: 'Chapter 6: Live Tracker, Instant Notifications and Offline Sync!',
    subtitles: [
      'Track complaints in real-time: Submitted -> Assigned -> In Progress -> Resolved.',
      'Instant EmailJS dispatches notify both student and authorities upon every stage change.',
      'Audio & toast alerts announce technician arrival and completion OTP generation.',
      'Offline PWA mode queues tickets locally and syncs automatically upon reconnecting!'
    ]
  }
];

const TOTAL_DEMO_DURATION = DEMO_CHAPTERS.reduce((acc, c) => acc + c.duration, 0); // ~112 seconds
const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 4, 8];

export default function ProjectDemoVideoModal({
  isOpen,
  onClose,
  initialPrompt = true, // If true, shows the Yes/No prompt first
  onCompleteTour
}) {
  // Main phase: 'prompt_initial' | 'playing' | 'ended_ready_prompt' | 'replay_prompt'
  const [phase, setPhase] = useState(initialPrompt ? 'prompt_initial' : 'playing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState(DEMO_CHAPTERS[0].subtitles[0]);
  const [isSpeechActive, setIsSpeechActive] = useState(false);

  const containerRef = useRef(null);
  const animationTimerRef = useRef(null);
  const currentChapterSpokenRef = useRef(-1);
  const currentSentenceIdxRef = useRef(0);
  const activeUtteranceRef = useRef(null);
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Calculate current chapter based on currentTime
  let accumulatedTime = 0;
  let activeChapterIndex = 0;
  let activeChapter = DEMO_CHAPTERS[0];
  let chapterStartTime = 0;

  for (let i = 0; i < DEMO_CHAPTERS.length; i++) {
    const ch = DEMO_CHAPTERS[i];
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + ch.duration) {
      activeChapterIndex = i;
      activeChapter = ch;
      chapterStartTime = accumulatedTime;
      break;
    }
    accumulatedTime += ch.duration;
  }
  if (currentTime >= TOTAL_DEMO_DURATION) {
    activeChapterIndex = DEMO_CHAPTERS.length - 1;
    activeChapter = DEMO_CHAPTERS[activeChapterIndex];
  }

  // Robust function to speak a specific sentence and chain next on completion (NEVER cuts mid-sentence)
  const speakSentence = useCallback((text, sentenceIdx, chapterIdx, speed) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isMutedRef.current || !isPlayingRef.current || phaseRef.current !== 'playing') {
      window.speechSynthesis.cancel();
      setIsSpeechActive(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any stale previous utterance before speaking new
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Calculate effective speech rate clamped to browser capability (0.75 to 2.0 max)
      // Browsers clamp SpeechSynthesis rate to 2.0; going above 2.0 causes complete silence!
      let rate = 1.05;
      if (speed === 0.5) rate = 0.85;
      else if (speed === 1) rate = 1.05;
      else if (speed === 1.5) rate = 1.35;
      else if (speed === 2) rate = 1.65;
      else if (speed === 4) rate = 1.9;
      else if (speed === 8) rate = 2.0;

      utterance.rate = rate;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Pick natural or clear voice if available
      const voices = window.speechSynthesis.getVoices() || [];
      const bestVoice = voices.find(v => 
        (v.lang === 'en-US' || v.lang.startsWith('en')) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Enhanced'))
      ) || voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en'));
      if (bestVoice) utterance.voice = bestVoice;

      // Retain global reference so browser garbage collector does not terminate speech mid-sentence
      window.__rguktActiveSpeechUtterance = utterance;
      activeUtteranceRef.current = utterance;
      setIsSpeechActive(true);

      utterance.onstart = () => {
        setIsSpeechActive(true);
      };

      utterance.onend = () => {
        setIsSpeechActive(false);
        window.__rguktActiveSpeechUtterance = null;
        
        // If speed is smooth (< 4x), advance to next sentence in the chapter
        if (speed < 4 && isPlayingRef.current && phaseRef.current === 'playing' && !isMutedRef.current) {
          const nextIdx = sentenceIdx + 1;
          const chapter = DEMO_CHAPTERS[chapterIdx];
          if (chapter && nextIdx < chapter.subtitles.length) {
            currentSentenceIdxRef.current = nextIdx;
            const nextText = chapter.subtitles[nextIdx];
            setActiveSubtitle(nextText);
            speakSentence(nextText, nextIdx, chapterIdx, playbackSpeedRef.current);
          }
        }
      };

      utterance.onerror = () => {
        setIsSpeechActive(false);
        window.__rguktActiveSpeechUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeechActive(false);
    }
  }, []);

  // Trigger narration whenever chapter changes or playback starts
  const startChapterNarration = useCallback((chIdx, speed) => {
    const chapter = DEMO_CHAPTERS[chIdx];
    if (!chapter) return;

    // Play synth sound effect (warp for 4x/8x, harmonic chime for smooth speeds)
    playUiSynthSound(speed >= 4 ? 'turbo' : 'chapter');

    if (speed >= 4) {
      // 4X & 8X TURBO/HYPER MODE: speak the punchy turbo chapter announcement!
      const phrase = chapter.turboAnnouncement || chapter.title;
      setActiveSubtitle(phrase);
      currentSentenceIdxRef.current = 0;
      speakSentence(phrase, 0, chIdx, speed);
    } else {
      // 0.5x, 1x, 1.5x, 2x SMOOTH MODE: speak sequentially sentence by sentence
      currentSentenceIdxRef.current = 0;
      const firstSentence = chapter.subtitles[0];
      setActiveSubtitle(firstSentence);
      speakSentence(firstSentence, 0, chIdx, speed);
    }
  }, [speakSentence]);

  // Keep SpeechSynthesis alive on Chrome (resumes if browser pauses speech)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const keepAlive = setInterval(() => {
      if (isPlaying && phase === 'playing' && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 3000);
    return () => clearInterval(keepAlive);
  }, [isPlaying, phase]);

  // Watch active chapter transitions
  useEffect(() => {
    if (phase !== 'playing' || !isPlaying) return;
    if (activeChapterIndex !== currentChapterSpokenRef.current) {
      currentChapterSpokenRef.current = activeChapterIndex;
      startChapterNarration(activeChapterIndex, playbackSpeed);
    }
  }, [activeChapterIndex, phase, isPlaying, playbackSpeed, startChapterNarration]);

  // When playback speed changes mid-playback, re-anchor narration so the new speed is immediately audible
  useEffect(() => {
    if (phase === 'playing' && isPlaying) {
      startChapterNarration(activeChapterIndex, playbackSpeed);
    }
  }, [playbackSpeed, activeChapterIndex, isPlaying, phase, startChapterNarration]);

  // When mute state changes
  useEffect(() => {
    if (isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeechActive(false);
    } else if (phase === 'playing' && isPlaying) {
      startChapterNarration(activeChapterIndex, playbackSpeed);
    }
  }, [isMuted, activeChapterIndex, isPlaying, phase, playbackSpeed, startChapterNarration]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeechActive(false);
    };
  }, []);

  // Main playback timer loop
  useEffect(() => {
    if (phase !== 'playing' || !isPlaying) {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      return;
    }

    const intervalMs = 50; // update 20 times per second
    animationTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const deltaSec = (intervalMs / 1000) * playbackSpeed;
        const nextTime = prev + deltaSec;
        if (nextTime >= TOTAL_DEMO_DURATION) {
          clearInterval(animationTimerRef.current);
          setIsPlaying(false);
          setPhase('ended_ready_prompt');
          playUiSynthSound('complete');
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            try {
              const u = new SpeechSynthesisUtterance("Tour completed! Are you ready to explore the system?");
              u.rate = 1.1;
              u.pitch = 1.05;
              window.speechSynthesis.speak(u);
            } catch (e) {}
          }
          return TOTAL_DEMO_DURATION;
        }
        return nextTime;
      });
    }, intervalMs);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [phase, isPlaying, playbackSpeed]);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialPrompt) {
        setPhase('prompt_initial');
        setIsPlaying(false);
      } else {
        setPhase('playing');
        setIsPlaying(true);
        setCurrentTime(0);
        currentChapterSpokenRef.current = -1;
      }
    } else {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, initialPrompt]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Skip / Jump by seconds
  const handleSeek = (newTime) => {
    const clamped = Math.max(0, Math.min(newTime, TOTAL_DEMO_DURATION));
    setCurrentTime(clamped);
    currentChapterSpokenRef.current = -1;
  };

  // Jump to specific chapter
  const jumpToChapter = (chapterIdx) => {
    let t = 0;
    for (let i = 0; i < chapterIdx; i++) {
      t += DEMO_CHAPTERS[i].duration;
    }
    setCurrentTime(t);
    currentChapterSpokenRef.current = -1;
    if (!isPlaying) setIsPlaying(true);
  };

  // Format time (seconds -> mm:ss)
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Initial Prompt Responses
  const handleInitialYes = () => {
    try {
      localStorage.setItem('rgukt_demo_tour_prompted', 'true');
    } catch (e) {}
    setPhase('playing');
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleInitialNo = () => {
    try {
      localStorage.setItem('rgukt_demo_tour_prompted', 'true');
    } catch (e) {}
    if (onClose) onClose();
  };

  // Handle "Are you ready?" Responses (End of video)
  const handleReadyYes = () => {
    try {
      localStorage.setItem('rgukt_demo_tour_seen', 'true');
      localStorage.setItem('rgukt_demo_tour_prompted', 'true');
    } catch (e) {}
    if (onCompleteTour) onCompleteTour();
    if (onClose) onClose();
  };

  const handleReadyNo = () => {
    // If they select No, transition to asking if they want to play the video again
    setPhase('replay_prompt');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      try {
        const u = new SpeechSynthesisUtterance("Would you like to play the demo video again?");
        u.rate = 1.1;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  };

  // Handle "Play again?" Responses
  const handleReplayYes = () => {
    setPhase('playing');
    setCurrentTime(0);
    currentChapterSpokenRef.current = -1;
    setIsPlaying(true);
  };

  const handleReplayClose = () => {
    try {
      localStorage.setItem('rgukt_demo_tour_seen', 'true');
      localStorage.setItem('rgukt_demo_tour_prompted', 'true');
    } catch (e) {}
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="portal-modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. INITIAL PROMPT MODAL: "Would you like to watch a demo tour?" */}
      {/* ------------------------------------------------------------- */}
      {phase === 'prompt_initial' && (
        <div className="portal-modal-drawer w-full max-w-lg bg-[#111319] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl text-white text-center relative overflow-hidden backdrop-blur-2xl">
          {/* Mobile Swipe Indicator Pill */}
          <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto mb-3 md:hidden shrink-0 cursor-grab" />
          {/* Ambient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Crest / Play Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-xl shadow-cyan-500/30 flex items-center justify-center mb-5 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 fill-cyan-400 translate-x-0.5" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> First-Time Welcome Tour
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              Welcome to RGUKT Internal Complaint System
            </h3>

            <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-md">
              Would you like to watch a short demo tour of the project features? It covers hostel location selection, 4-tier hierarchy escalation, statutory ICC committees, and offline support.
            </p>

            {/* Quick feature summary pills */}
            <div className="grid grid-cols-2 gap-2 w-full my-6 text-left">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-100 block">2FA Webmail OTP</span>
                  <span className="text-[10px] text-slate-400">Secure student auth</span>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-100 block">4-Tier Escalation</span>
                  <span className="text-[10px] text-slate-400">Warden to Director</span>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-100 block">ICC Tri-Committee</span>
                  <span className="text-[10px] text-slate-400">3, 6 & Full panels</span>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-100 block">Offline PWA Sync</span>
                  <span className="text-[10px] text-slate-400">Outbox queueing</span>
                </div>
              </div>
            </div>

            {/* YES / NO ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleInitialYes}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Yes, Play Demo Video
              </button>

              <button
                type="button"
                onClick={handleInitialNo}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                No, Skip to App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN DEMO VIDEO PLAYER (Phase: 'playing')                   */}
      {/* ------------------------------------------------------------- */}
      {phase === 'playing' && (
        <div
          ref={containerRef}
          className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden relative"
          style={{ maxHeight: '92vh' }}
        >
          {/* Top Video Header Bar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 fill-cyan-400" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    RGUKT System Tour • {activeChapter.title}
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                    Chapter {activeChapterIndex + 1}/{DEMO_CHAPTERS.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Interactive simulated walkthrough with up to 8x playback speed
                </p>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(prev => !prev)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute voiceover narration' : 'Mute voiceover'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500/60 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Exit Demo Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chapter Quick Selector Navigation Bar */}
          <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {DEMO_CHAPTERS.map((ch, idx) => {
              const Icon = ch.icon;
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{ch.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* ----------------------------------------------------------- */}
          {/* VIDEO CANVAS / SCREEN STAGE (Simulated Crisp Interface Video)*/}
          {/* ----------------------------------------------------------- */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[340px] sm:min-h-[420px]">
            
            {/* Watermark Logo Crest */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/70 border border-slate-800/80 rounded-xl px-2.5 py-1.5 backdrop-blur-md">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-slate-950">
                R
              </div>
              <span className="text-[11px] font-black tracking-wider text-slate-300">RGUKT ICS DEMO</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Playback Speed Overlay Indicator when > 1x */}
            {playbackSpeed !== 1 && (
              <div className="absolute top-4 right-4 z-10 bg-amber-500/20 border border-amber-400/60 text-amber-300 rounded-xl px-2.5 py-1 text-xs font-black flex items-center gap-1 shadow-md animate-pulse">
                ⚡ {playbackSpeed}x SPEED
              </div>
            )}

            {/* DYNAMIC SCENE RENDERING BASED ON ACTIVE CHAPTER */}
            <div className="w-full max-w-3xl flex-1 flex flex-col justify-center items-center">
              
              {/* SCENE 1: AUTH & WEBMAIL OTP */}
              {activeChapterIndex === 0 && (
                <div className="w-full bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">RGUKT Unified Authentication</h4>
                        <span className="text-[10px] text-cyan-400 font-mono">r210108@rguktrkv.ac.in</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      2FA Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <label className="text-[11px] font-bold text-slate-300 block">Student Webmail ID</label>
                      <div className="px-3 py-2 bg-slate-900 rounded-lg border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center justify-between">
                        <span>R210108</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <label className="text-[11px] font-bold text-slate-300 block mt-2">One-Time Password (OTP)</label>
                      <div className="flex gap-2">
                        {['4', '8', '2', '9', '1', '6'].map((digit, i) => (
                          <div key={i} className="flex-1 h-9 rounded-lg bg-cyan-950/60 border border-cyan-400 text-white font-black text-sm flex items-center justify-center animate-pulse">
                            {digit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block mb-1">
                          Live Webmail Dispatch
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          OTP generated at <strong>{new Date().toLocaleTimeString()}</strong> and delivered directly to RGUKT student webmail.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 mt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Daily Workday Session Established</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 2: LOCATION & ROOM SELECTOR */}
              {activeChapterIndex === 1 && (
                <div className="w-full bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Interactive Campus Geolocation</h4>
                        <span className="text-[10px] text-emerald-400">Hostel & Academic Hub</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/40">
                      Block: Penna BH-1
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {['Penna BH-1 (Boys)', 'Krishna BH-2 (Boys)', 'Godavari BH-3', 'GH-1 to GH-4 (Girls)'].map((b, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border text-center transition-all ${i === 0 ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold shadow-md' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
                        <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                        <span className="text-[11px] block truncate">{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-sm">
                        108
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Selected: Floor 1 • Room 108</span>
                        <span className="text-[10px] text-slate-400">Auto-hydrated student resident assignment</span>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                      GPS Tagged
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 3: LODGE COMPLAINT & ANONYMOUS MODE */}
              {activeChapterIndex === 2 && (
                <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Lodge Maintenance Grievance</h4>
                        <span className="text-[10px] text-amber-400">Category: Electrical • Fan Regulator</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 animate-pulse">
                      Urgent Priority (24h SLA)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Evidence Photo Attachment</span>
                      <div className="h-20 rounded-lg bg-slate-900 border border-dashed border-cyan-500/50 flex items-center justify-center text-cyan-300 gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold">ceiling_fan_sparking.jpg</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-purple-400">Identity Masking</span>
                          <span className="w-8 h-4 rounded-full bg-purple-600 flex items-center px-0.5">
                            <span className="w-3 h-3 rounded-full bg-white ml-auto" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">
                          Mask student identity from public view. Name is encrypted, visible only to presiding hostel warden.
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-2">
                        Reporter: <span className="text-slate-200">Resident #R21****</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 4: 4-TIER HOSTEL HIERARCHY ESCALATION */}
              {activeChapterIndex === 3 && (
                <div className="w-full bg-slate-900/90 border border-purple-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">4-Tier Hostel Hierarchy Escalation Engine</h4>
                        <span className="text-[10px] text-purple-300">Automated SLA Escalation Protocol</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                      Tier 1 ➔ Tier 4
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {[
                      { stage: 'Stage 1', role: 'Hostel Warden', action: 'On-site Triage & Staff Assign', active: true, color: 'border-blue-400 bg-blue-950/40 text-blue-300' },
                      { stage: 'Stage 2', role: 'DSW & Tech Staff', action: 'Technical Execution & Parts', active: true, color: 'border-amber-400 bg-amber-950/40 text-amber-300' },
                      { stage: 'Stage 3', role: 'AO Office', action: 'Budget & Structural Approval', active: false, color: 'border-purple-400/50 bg-slate-950/50 text-purple-300' },
                      { stage: 'Stage 4', role: 'Director Apex', action: 'Statutory Resolution', active: false, color: 'border-rose-400/50 bg-slate-950/50 text-rose-300' }
                    ].map((tier, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border ${tier.color} transition-all`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase">{tier.stage}</span>
                          {tier.active && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">{tier.role}</h5>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{tier.action}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300">SLA Trigger: If Stage 1 is unresolved within 24 hours, system automatically escalates to Stage 2 (DSW).</span>
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold shrink-0">Auto-Escalate ON</span>
                  </div>
                </div>
              )}

              {/* SCENE 5: STATUTORY ICC TRI-COMMITTEE SYSTEM */}
              {activeChapterIndex === 4 && (
                <div className="w-full bg-slate-900/90 border border-rose-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Statutory ICC Tri-Committee System</h4>
                        <span className="text-[10px] text-rose-400">Gender Safety & Anti-Harassment Body</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                      Confidentiality Sealed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[10px] font-black uppercase text-cyan-400 mb-1">Small Committee (3)</div>
                      <p className="text-xs font-bold text-white">Presiding Officer + 2 Women Faculty</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Immediate preliminary hearing & safety measures.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40">
                      <div className="text-[10px] font-black uppercase text-purple-300 mb-1">Medium Committee (6)</div>
                      <p className="text-xs font-bold text-white">+ Legal Advisor & NGO Member</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Formal witness testimony & statement recording.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40">
                      <div className="text-[10px] font-black uppercase text-rose-300 mb-1">Full Apex Committee</div>
                      <p className="text-xs font-bold text-white">+ District Police Liaison</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Complete statutory inquiry & final executive report.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All case records are cryptographically secured and strictly restricted to the authorized ICC panel.</span>
                  </div>
                </div>
              )}

              {/* SCENE 6: LIVE TRACKER, NOTIFICATIONS & OFFLINE SYNC */}
              {activeChapterIndex === 5 && (
                <div className="w-full bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Live Tracking, Alerts & Offline Sync</h4>
                        <span className="text-[10px] text-cyan-400">Real-Time State Machine</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      PWA Offline Ready
                    </span>
                  </div>

                  {/* Tracker Progress Bar */}
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                      <span className="text-emerald-400">1. Lodged</span>
                      <span className="text-cyan-400">2. Assigned</span>
                      <span className="text-amber-400">3. In Progress</span>
                      <span className="text-slate-400">4. Resolved</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 w-3/4 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>Technician: Rajesh (Electrical Dept)</span>
                      <span className="text-amber-300 font-mono">OTP Verification Pending</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-xs">
                      <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">EmailJS Automated Receipts</span>
                        <span className="text-[10px] text-slate-300">Live emails dispatched on status updates</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs">
                      <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Offline Auto-Sync</span>
                        <span className="text-[10px] text-slate-300">Zero data loss if internet drops</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* SUBTITLES / CAPTIONS OVERLAY (Always readable with Animated Waveform Equalizer) */}
            <div className="w-full max-w-2xl mt-4 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl text-center shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                {/* Audio Waveform Equalizer */}
                {!isMuted && isSpeechActive ? (
                  <div className="flex items-end gap-1 h-3.5 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDuration: '400ms' }} />
                    <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-3" style={{ animationDuration: '600ms', animationDelay: '150ms' }} />
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-1.5" style={{ animationDuration: '350ms', animationDelay: '300ms' }} />
                    <span className="w-1 bg-blue-400 rounded-full animate-bounce h-2.5" style={{ animationDuration: '500ms', animationDelay: '200ms' }} />
                    <span className="text-[9px] font-mono font-black uppercase text-cyan-300 tracking-wider ml-1">
                      {playbackSpeed >= 4 ? `⚡ ${playbackSpeed}X TURBO AUDIO` : 'NARRATION ACTIVE'}
                    </span>
                  </div>
                ) : isMuted ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-[9px] font-bold text-rose-300">
                    <VolumeX className="w-3 h-3" />
                    <span>MUTED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-bold text-slate-400">
                    <span>{playbackSpeed >= 4 ? `⚡ ${playbackSpeed}X AUDIO ACTIVE` : 'AUDIO SYNCED'}</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 tracking-wide leading-relaxed animate-in fade-in duration-200">
                "{activeSubtitle || activeChapter.subtitles[0]}"
              </p>
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* VIDEO CONTROLS BAR WITH SPEED CONTROL AT BOTTOM RIGHT       */}
          {/* ----------------------------------------------------------- */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 shrink-0">
            
            {/* Timeline Progress Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold text-slate-400 w-11 text-right">
                {formatTime(currentTime)}
              </span>

              <div
                className="relative flex-1 h-2 rounded-full bg-slate-800 hover:h-3 transition-all cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
                  handleSeek(ratio * TOTAL_DEMO_DURATION);
                }}
              >
                {/* Buffered / Total */}
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full relative"
                  style={{ width: `${(currentTime / TOTAL_DEMO_DURATION) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg shadow-cyan-500/50 scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold text-slate-400 w-11">
                {formatTime(TOTAL_DEMO_DURATION)}
              </span>
            </div>

            {/* Bottom Row Controls: Play/Pause/Replay on Left, SPEED SELECTOR AT BOTTOM RIGHT */}
            <div className="flex items-center justify-between gap-3 pt-1">
              
              {/* Left Controls: Play / Pause, Restart */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(prev => !prev)}
                  className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSeek(0)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-1.5 ml-2">
                  <span className="text-xs font-bold text-slate-300">
                    {activeChapter.shortTitle}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[11px] text-slate-400">
                    Part {activeChapterIndex + 1} of {DEMO_CHAPTERS.length}
                  </span>
                </div>
              </div>

              {/* RIGHT CONTROLS: PLAYBACK SPEED IN BOTTOM RIGHT CORNER (UP TO 8X) */}
              <div className="relative flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 hidden xs:inline">
                  Speed:
                </span>

                {/* Direct quick-cycle to all speeds (0.5x, 1x, 2x, 4x Turbo, 8x Hyper) */}
                <div className="flex items-center gap-1">
                  {[0.5, 1, 2, 4, 8].map(s => {
                    const isSelected = playbackSpeed === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setPlaybackSpeed(s);
                          playUiSynthSound(s >= 4 ? 'turbo' : 'chapter');
                        }}
                        className={`px-2 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 ${
                          isSelected
                            ? s >= 4
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : s >= 4
                              ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                        title={
                          s === 4
                            ? "4x Turbo Speed (Crisp Voice & Warp Sound)"
                            : s === 8
                            ? "8x Hyper Speed (Max Speed with Voice & Synth)"
                            : `${s}x Speed`
                        }
                      >
                        {s >= 4 && <span>⚡</span>}
                        <span>{s}x</span>
                        {s === 8 && <span className="text-[8px] font-black uppercase ml-0.5">MAX</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Speed Selector Dropdown for full options */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSpeedMenu(prev => !prev)}
                    className="p-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-black text-xs flex items-center justify-center shadow-md cursor-pointer"
                    title="Open all speed options"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu for Speed Options (0.5x to 8x) */}
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-44 bg-slate-900 border border-cyan-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="px-2.5 py-1 text-[10px] font-black uppercase text-cyan-300 border-b border-slate-800 flex items-center justify-between">
                        <span>Playback Speed</span>
                        <span className="text-[9px] text-slate-400">Up to 8x</span>
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {SPEED_OPTIONS.map(speed => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                              playUiSynthSound(speed >= 4 ? 'turbo' : 'chapter');
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              playbackSpeed === speed
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {speed >= 4 ? '⚡' : '•'}
                              <span>{speed}x</span>
                              {speed === 4 && <span className="text-[9px] text-amber-300 font-bold">(Turbo)</span>}
                              {speed === 8 && <span className="text-[9px] text-rose-300 font-bold">(Hyper)</span>}
                            </span>
                            {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. POST-VIDEO PROMPT: "Are you ready?"                          */}
      {/* ------------------------------------------------------------- */}
      {phase === 'ended_ready_prompt' && (
        <div className="w-full max-w-md bg-slate-900/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-white text-center relative overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 mx-auto flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            Tour Complete
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Are you ready?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            You have viewed the complete overview of the RGUKT Internal Complaint System.
            Would you like to enter and explore the live application interface now?
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-6">
            <button
              type="button"
              onClick={handleReadyYes}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Yes, I'm Ready
            </button>

            <button
              type="button"
              onClick={handleReadyNo}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. REPLAY PROMPT: "Does it need to play the demo video again?"  */}
      {/* ------------------------------------------------------------- */}
      {phase === 'replay_prompt' && (
        <div className="w-full max-w-md bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 text-white text-center relative overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/50 mx-auto flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/20">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            Replay Option
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Play Demo Video Again?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Does it need to play the demo video again, or would you like to close and start using the app normally?
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-6">
            <button
              type="button"
              onClick={handleReplayYes}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Yes, Play Again
            </button>

            <button
              type="button"
              onClick={handleReplayClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
