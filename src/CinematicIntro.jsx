import React, { useEffect, useRef, useState } from 'react';

export default function CinematicIntro({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing core systems');
  const [isDone, setIsDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const canvasRef = useRef(null);
  const tiltRef = useRef(null);

  const steps = [
    [0, 'Initializing core systems'],
    [25, 'Loading plumbing module'],
    [50, 'Loading furniture module'],
    [75, 'Loading electrical module'],
    [96, 'System ready']
  ];

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  useEffect(() => {
    // 1. Drifting silver dust / embers on Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let animationFrameId;

    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = canvas.width = window.innerWidth * d;
      H = canvas.height = window.innerHeight * d;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.8 + 0.4,
        v: Math.random() * 0.0004 + 0.00008,
        a: Math.random() * Math.PI * 2
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const dpr = window.devicePixelRatio || 1;
      for (const p of particles) {
        p.y -= p.v;
        p.a += 0.02;
        if (p.y < 0) {
          p.y = 1;
          p.x = Math.random();
        }
        ctx.globalAlpha = 0.25 + 0.35 * Math.sin(p.a) ** 2;
        ctx.fillStyle = '#bfe6ff';
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * dpr, 0, 7);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    // 2. 3D Parallax Tilt
    const handlePointerMove = (e) => {
      if (!tiltRef.current) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      tiltRef.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // 3. Tick Loader - Exactly 3 seconds (3000ms) animation
    const t0 = performance.now();
    const DURATION_MS = 3000;
    const ease = (t) => 1 - Math.pow(1 - t, 2.5);
    let tickFrameId;
    let finished = false;

    const tick = (now) => {
      const elapsed = now - t0;
      const t = Math.max(0, Math.min(elapsed / DURATION_MS, 1));
      const p = ease(t) * 100;
      setProgress(Math.floor(p));

      for (const [v, m] of steps) {
        if (p >= v) setStatusText(m);
      }

      if (t >= 1 && !finished) {
        finished = true;
        setProgress(100);
        setStatusText('System ready');
        setIsDone(true);
        return;
      }
      tickFrameId = requestAnimationFrame(tick);
    };
    tickFrameId = requestAnimationFrame(tick);

    // Keyboard support: Enter key
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(tickFrameId);
    };
  }, []);

  return (
    <div
      id="cinematic-intro"
      className={`${isDone ? 'done' : ''} ${isExiting ? 'exiting' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        color: '#d5dbe5',
        overflow: 'hidden',
        fontFamily: "'Orbitron', 'Segoe UI', Arial, sans-serif"
      }}
    >
      <style>{`
        #cinematic-intro {
          --silver: #d5dbe5;
          --ice: #7dd3fc;
        }
        #cinematic-intro.exiting {
          opacity: 0;
          transition: opacity 0.4s ease-out;
          pointer-events: none;
        }
        #cinematic-intro canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        #cinematic-intro #vig {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 35%, #000 100%);
        }
        #cinematic-intro #grain {
          position: absolute;
          inset: -50%;
          pointer-events: none;
          opacity: 0.07;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          animation: cinematic-grain .6s steps(6) infinite;
        }
        @keyframes cinematic-grain {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-5%, 3%); }
          40% { transform: translate(4%, -4%); }
          60% { transform: translate(-3%, -2%); }
          80% { transform: translate(5%, 4%); }
          100% { transform: translate(0, 0); }
        }

        #cinematic-intro #stage {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5vmin;
          transition: opacity .8s 1.1s;
        }
        #cinematic-intro.done #stage {
          opacity: 0;
          pointer-events: none;
        }
        #cinematic-intro #wrap {
          position: relative;
          width: min(62vmin, 500px);
          aspect-ratio: 1;
          animation: cinematic-float 6s ease-in-out infinite;
        }
        @keyframes cinematic-float {
          50% { transform: translateY(-8px); }
        }
        #cinematic-intro #tilt {
          position: absolute;
          inset: 0;
          transition: transform .15s ease-out;
          transform-style: preserve-3d;
        }
        #cinematic-intro #glow {
          position: absolute;
          inset: -25%;
          background: radial-gradient(circle, rgba(125,211,252,.35), rgba(80,120,200,.12) 45%, transparent 70%);
          opacity: 0;
          animation: cinematic-glowIn 2s .6s forwards, cinematic-breathe 3.5s 2.6s ease-in-out infinite;
        }
        @keyframes cinematic-glowIn {
          to { opacity: 1; }
        }
        @keyframes cinematic-breathe {
          50% { opacity: .55; transform: scale(1.08); }
        }
        #cinematic-intro #logo {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          animation: cinematic-logoIn 2.4s .8s cubic-bezier(.16, 1, .3, 1) both;
          box-shadow: 0 0 45px rgba(56, 189, 248, 0.55), 0 0 90px rgba(99, 102, 241, 0.35);
        }
        #cinematic-intro #logo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: 50%;
        }
        @keyframes cinematic-logoIn {
          0% { opacity: 0; transform: scale(1.4); filter: blur(26px) brightness(0); }
          55% { opacity: 1; filter: blur(4px) brightness(1.7); }
          100% { opacity: 1; transform: scale(1); filter: none; }
        }
        #cinematic-intro #shine {
          position: absolute;
          inset: 3%;
          border-radius: 50%;
          mix-blend-mode: overlay;
          background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%);
          background-size: 300% 100%;
          background-position: 130% 0;
          animation: cinematic-shine 1.6s 2.7s ease-in-out, cinematic-shine 1.6s 6s ease-in-out infinite;
        }
        @keyframes cinematic-shine {
          to { background-position: -30% 0; }
        }
        #cinematic-intro #ring {
          position: absolute;
          inset: -3%;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0 55%, rgba(56, 189, 248, 0.85) 85%, #fff 100%);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
          filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.85));
          opacity: 0;
          animation: cinematic-ringIn 1s .4s forwards, cinematic-spin 2.6s linear infinite;
        }
        @keyframes cinematic-ringIn {
          to { opacity: 1; }
        }
        @keyframes cinematic-spin {
          to { transform: rotate(360deg); }
        }
        #cinematic-intro #streak {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 150vw;
          height: 2px;
          margin-top: -1px;
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
          background: linear-gradient(90deg, transparent, #38bdf8, #fff, #38bdf8, transparent);
          box-shadow: 0 0 25px 4px rgba(56, 189, 248, 0.85);
          animation: cinematic-streak 1.6s 2.3s ease-out;
        }
        @keyframes cinematic-streak {
          0% { transform: translateX(-50%) scaleX(0); opacity: 0; }
          35% { transform: translateX(-50%) scaleX(1); opacity: 1; }
          100% { transform: translateX(-50%) scaleX(1.2); opacity: 0; }
        }

        #cinematic-intro #hud {
          width: min(78vw, 460px);
          text-align: center;
          opacity: 0;
          animation: cinematic-fadeUp 1s 1.2s forwards;
        }
        @keyframes cinematic-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
        #cinematic-intro #status {
          font-size: clamp(11px, 2.8vw, 14px);
          letter-spacing: .32em;
          text-transform: uppercase;
          color: #ffffff;
          font-weight: 900;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.9), 0 2px 4px rgba(0, 0, 0, 0.9);
          min-height: 1.4em;
        }
        #cinematic-intro #track {
          margin: 12px 0 8px;
          height: 4px;
          background: rgba(255,255,255,.2);
          border-radius: 4px;
          overflow: visible;
          position: relative;
        }
        #cinematic-intro #bar {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #38bdf8, #fff);
          box-shadow: 0 0 14px var(--ice);
          position: relative;
          transition: width 0.08s linear;
        }
        #cinematic-intro #bar::after {
          content: "";
          position: absolute;
          right: -4px;
          top: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 16px 5px var(--ice);
        }
        #cinematic-intro #pct {
          font-size: clamp(16px, 4.2vw, 24px);
          font-weight: 900;
          letter-spacing: .2em;
          color: #ffffff;
          text-shadow: 0 0 16px rgba(56, 189, 248, 0.95), 0 2px 4px rgba(0, 0, 0, 0.9);
        }

        #cinematic-intro.done #logo {
          animation: cinematic-zoom 0.5s cubic-bezier(.7, 0, .9, .4) forwards;
        }
        @keyframes cinematic-zoom {
          to { transform: scale(5); opacity: 0; filter: blur(4px) brightness(1.8); }
        }
        #cinematic-intro.done #hud,
        #cinematic-intro.done #ring {
          opacity: 0;
          transition: opacity .25s;
          animation: none;
        }
        #cinematic-intro #flash {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle, #fff, #bfe6ff 40%, transparent 75%);
          opacity: 0;
        }
        #cinematic-intro.done #flash {
          animation: cinematic-flash 0.5s ease-out;
        }
        @keyframes cinematic-flash {
          0% { opacity: 0; }
          40% { opacity: .9; }
          100% { opacity: 0; }
        }

        #cinematic-intro .lb {
          position: absolute;
          left: 0;
          right: 0;
          background: #000;
          z-index: 5;
          height: 7vh;
          transition: height 1.3s 1s cubic-bezier(.7, 0, .2, 1);
        }
        #cinematic-intro .lb.t {
          top: 0;
          animation: cinematic-open 1.4s cubic-bezier(.7, 0, .2, 1) both;
        }
        #cinematic-intro .lb.b {
          bottom: 0;
          animation: cinematic-open 1.4s cubic-bezier(.7, 0, .2, 1) both;
        }
        @keyframes cinematic-open {
          from { height: 50vh; }
          to { height: 7vh; }
        }
        #cinematic-intro.done .lb {
          height: 0;
          animation: none;
        }

        #cinematic-intro #site {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          padding: 24px;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 45%, #0c1626, #000 75%);
        }
        #cinematic-intro.done #site {
          opacity: 1;
          pointer-events: auto;
          transition: opacity 0.6s 0.2s ease-out;
        }
        #cinematic-intro #site small {
          letter-spacing: .35em;
          font-size: clamp(12px, 2.6vw, 15px);
          color: #ffffff;
          font-weight: 900;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(56, 189, 248, 0.6);
        }
        #cinematic-intro #site h1 {
          font-size: clamp(22px, 5.5vw, 42px);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: .2em;
          text-shadow: 0 0 35px rgba(255,255,255,0.9), 0 0 60px rgba(56,189,248,0.85);
        }
        #cinematic-intro.done #site h1 {
          animation: cinematic-title 1.2s 0.2s cubic-bezier(.16, 1, .3, 1) both;
        }
        @keyframes cinematic-title {
          from { letter-spacing: .5em; opacity: 0; filter: blur(8px); }
          to { letter-spacing: .2em; opacity: 1; filter: none; }
        }
        #cinematic-intro #enter {
          font: inherit;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: .35em;
          color: #000000;
          background: #ffffff;
          border: 2px solid #ffffff;
          padding: 14px 40px;
          cursor: pointer;
          transition: .3s;
          border-radius: 8px;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 45px rgba(56, 189, 248, 0.7);
        }
        #cinematic-intro #enter:hover {
          background: #38bdf8;
          color: #000;
          border-color: #38bdf8;
          box-shadow: 0 0 40px #38bdf8;
          transform: scale(1.06);
        }
      `}</style>

      {/* Background particle canvas */}
      <canvas ref={canvasRef} id="fx" />

      {/* Dark vignette filter */}
      <div id="vig" />

      {/* Centered Logo Stage with 3D Tilt, Ring & Streak */}
      <div id="stage">
        <div id="streak" />
        <div id="wrap">
          <div id="glow" />
          <div ref={tiltRef} id="tilt">
            <div id="logo">
              <img
                alt="INTERNAL COMPLAINT SYSTEM"
                src="/logo.png?v=original"
              />
              <div id="shine" />
            </div>
            <div id="ring" />
          </div>
        </div>
        <div style={{
          marginTop: '18px',
          textAlign: 'center',
          fontSize: '15px',
          fontWeight: 900,
          letterSpacing: '3.5px',
          color: '#ffffff',
          textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(56, 189, 248, 1), 0 0 40px rgba(56, 189, 248, 0.8), 0 2px 6px rgba(0,0,0,0.9)'
        }}>
          INTERNAL COMPLAINT SYSTEM (ICS)
        </div>
        <div id="hud">
          <div id="status">{statusText}</div>
          <div id="track">
            <div id="bar" style={{ width: `${progress}%` }} />
          </div>
          <div id="pct">{progress}%</div>
        </div>
      </div>

      {/* Final Portal / Welcome Landing Screen */}
      <div id="site">
        <small style={{ color: '#ffffff', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 15px rgba(56, 189, 248, 0.8)' }}>
          RAJIV GANDHI UNIVERSITY OF KNOWLEDGE TECHNOLOGIES
        </small>
        <div style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '4.5px', color: '#38bdf8', margin: '4px 0 6px', textShadow: '0 0 25px rgba(56, 189, 248, 1), 0 2px 4px rgba(0,0,0,0.9)' }}>
          RK VALLEY
        </div>
        <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '4px', color: '#7dd3fc', textShadow: '0 0 16px rgba(56, 189, 248, 1)' }}>
          [ ICS CENTRAL REDRESSAL ]
        </div>
        <h1 className="cinematic-portal-title" style={{ color: '#ffffff', fontWeight: 900, letterSpacing: '0.2em', textShadow: '0 0 35px rgba(255,255,255,1), 0 0 65px rgba(56,189,248,0.95), 0 2px 10px rgba(0,0,0,0.95)' }}>
          WELCOME TO INTERNAL COMPLAINT SYSTEM (ICS)
        </h1>
        <button id="enter" onClick={handleEnter} style={{ fontWeight: 900 }}>
          ENTER
        </button>
      </div>

      {/* Cinematic Flash & Letterbox Bars */}
      <div id="flash" />
      <div className="lb t" />
      <div className="lb b" />
      <div id="grain" />
    </div>
  );
}
