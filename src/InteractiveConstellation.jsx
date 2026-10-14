import React, { useEffect, useRef } from 'react';

/**
 * InteractiveConstellation
 * High-performance HTML5 Canvas dynamic particle network / constellation background.
 * - Interactive: Reacts to mouse move, connects particles with nodes and cursor.
 * - Gentle ambient motion with subtle glowing nodes.
 * - Self-adjusts to window resize and clean disposal on unmount.
 */
export default function InteractiveConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (null when outside)
    const mouse = {
      x: null,
      y: null,
      radius: 140, // interaction proximity
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle Configuration with enriched cosmic spectrum
    let particles = [];
    const particleColors = [
      'rgba(56, 189, 248, 0.85)',  // Electric Cyan/Sky
      'rgba(129, 140, 248, 0.85)', // Cosmic Indigo
      'rgba(192, 132, 252, 0.85)', // Starlight Violet
      'rgba(244, 114, 182, 0.80)', // Nebula Pink
      'rgba(52, 211, 153, 0.75)',  // Aurora Emerald
      'rgba(255, 255, 255, 0.90)', // Bright Star White
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Subtle organic float speed
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2.4 + 1.2;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.baseAlpha = Math.random() * 0.5 + 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently off boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Subtle mouse repulsion/attraction field
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Gentle push away
            this.x -= (dx / distance) * force * 1.5;
            this.y -= (dy / distance) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      // Calculate responsive particle count based on screen area
      const count = Math.min(120, Math.floor((width * height) / 11500));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Connection threshold distance
    const maxDistance = 135;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle cosmic nebula glows in the background
      const nebula1 = ctx.createRadialGradient(width * 0.25, height * 0.3, 20, width * 0.25, height * 0.3, width * 0.5);
      nebula1.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      nebula1.addColorStop(0.5, 'rgba(147, 51, 234, 0.05)');
      nebula1.addColorStop(1, 'rgba(10, 15, 30, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 30, width * 0.8, height * 0.7, width * 0.45);
      nebula2.addColorStop(0, 'rgba(56, 189, 248, 0.10)');
      nebula2.addColorStop(0.6, 'rgba(236, 72, 153, 0.04)');
      nebula2.addColorStop(1, 'rgba(10, 15, 30, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Connect particles to each other
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Connect particles to mouse cursor when close
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.55;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-0"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
