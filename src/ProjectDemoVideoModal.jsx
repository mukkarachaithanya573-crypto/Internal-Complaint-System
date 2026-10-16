import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, ShieldAlert,
  Sparkles, Building2, Bell, Wifi, WifiOff, Users, ArrowRight, X,
  Clock, HelpCircle, Check, Eye, ShieldCheck, Mail, AlertTriangle,
  Layers, MapPin, Maximize2, Minimize2, Wrench, Zap, Droplet, Monitor
} from 'lucide-react';

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

  const containerRef = useRef(null);
  const animationTimerRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const lastSubtitleRef = useRef('');

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

  // Calculate current subtitle in active chapter
  const chapterElapsed = Math.max(0, currentTime - chapterStartTime);
  const subIndex = Math.min(
    Math.floor((chapterElapsed / (activeChapter.duration || 1)) * activeChapter.subtitles.length),
    activeChapter.subtitles.length - 1
  );
  const currentSubtitle = activeChapter.subtitles[subIndex] || activeChapter.subtitles[0];

  // Speech synthesis narration for currently playing subtitle
  useEffect(() => {
    if (phase !== 'playing' || !isPlaying || isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (currentSubtitle && currentSubtitle !== lastSubtitleRef.current) {
      lastSubtitleRef.current = currentSubtitle;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        try {
          const utterance = new SpeechSynthesisUtterance(currentSubtitle);
          // Scale voice rate with playback speed, capped at browser limit of 2.0x
          utterance.rate = Math.min(Math.max(playbackSpeed * 0.95, 0.75), 2.0);
          utterance.pitch = 1.05;
          utterance.lang = 'en-US';
          speechUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // Ignore speech synthesis failures on unsupported devices
        }
      }
    }
  }, [currentSubtitle, phase, isPlaying, isMuted, playbackSpeed]);

  // Clean up speech synthesis on unmount or phase change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
  };

  // Jump to specific chapter
  const jumpToChapter = (chapterIdx) => {
    let t = 0;
    for (let i = 0; i < chapterIdx; i++) {
      t += DEMO_CHAPTERS[i].duration;
    }
    setCurrentTime(t);
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
  };

  // Handle "Play again?" Responses
  const handleReplayYes = () => {
    setPhase('playing');
    setCurrentTime(0);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. INITIAL PROMPT MODAL: "Would you like to watch a demo tour?" */}
      {/* ------------------------------------------------------------- */}
      {phase === 'prompt_initial' && (
        <div className="w-full max-w-lg bg-slate-900/95 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 text-white text-center relative overflow-hidden backdrop-blur-2xl">
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

            {/* SUBTITLES / CAPTIONS OVERLAY (Always readable) */}
            <div className="w-full max-w-2xl mt-4 px-4 py-2.5 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl text-center shadow-lg">
              <p className="text-xs sm:text-sm font-semibold text-slate-100 tracking-wide leading-relaxed animate-in fade-in duration-200">
                "{currentSubtitle}"
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
              <div className="relative flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 hidden xs:inline">
                  Speed:
                </span>

                {/* Speed Selector Dropdown / Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSpeedMenu(prev => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-black text-xs tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-950/60 transition-all cursor-pointer"
                    title="Change playback speed (Up to 8x)"
                  >
                    <span className="text-[11px]">⚡</span>
                    <span>{playbackSpeed}x</span>
                  </button>

                  {/* Dropdown Menu for Speed Options (0.5x to 8x) */}
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 border border-cyan-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800">
                        Playback Speed
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {SPEED_OPTIONS.map(speed => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              playbackSpeed === speed
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span>{speed}x</span>
                            {speed === 8 && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                                MAX
                              </span>
                            )}
                            {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct quick-cycle to 2x or 8x for fast testing */}
                <div className="hidden md:flex items-center gap-1">
                  {[1, 2, 4, 8].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        playbackSpeed === s
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
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
