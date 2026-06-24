'use client';

import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const MAX_LINK_DISTANCE = 130;
const MOUSE_REPEL_RADIUS = 100;
const MOUSE_REPEL_STRENGTH = 0.3;
const PARALLAX_SCROLL_FACTOR = 0.08;
const PARALLAX_MOUSE_FACTOR = 0.015;

function particleCount(width: number): number {
  if (width < 640) return 40;
  if (width < 1024) return 70;
  return 100;
}

export function ParticleParallax() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;
    let parallaxOffsetY = 0;
    let parallaxOffsetX = 0;

    function initParticles() {
      const count = prefersReduced ? 20 : particleCount(width);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + 'px';
      canvas!.style.height = height + 'px';
      ctx!.scale(dpr, dpr);
      initParticles();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      const ox = parallaxOffsetX;
      const oy = parallaxOffsetY;

      // Draw links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pa = particles[i];
          const pb = particles[j];
          const dx = pa.x + ox - (pb.x + ox);
          const dy = pa.y + oy - (pb.y + oy);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK_DISTANCE) {
            const alpha = (1 - dist / MAX_LINK_DISTANCE) * 0.35;
            // lerp colour between cyan and electric blue based on position
            const t = (pa.x / width + pb.x / width) / 2;
            const r = Math.round(0 + t * 0);
            const g = Math.round(229 - t * 93);   // 229 → 136
            const b = Math.round(160 + t * 95);   // 160 → 255
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.moveTo(pa.x + ox, pa.y + oy);
            ctx!.lineTo(pb.x + ox, pb.y + oy);
            ctx!.stroke();
          }
        }
      }

      // Draw nodes
      for (const p of particles) {
        const t = p.x / width;
        const r = 0;
        const g = Math.round(229 - t * 93);
        const b = Math.round(160 + t * 95);
        ctx!.beginPath();
        ctx!.arc(p.x + ox, p.y + oy, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx!.fill();
      }
    }

    function update() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (!prefersReduced) {
          // Mouse repulsion
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
            const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
            p.vx += (dx / dist) * force * MOUSE_REPEL_STRENGTH;
            p.vy += (dy / dist) * force * MOUSE_REPEL_STRENGTH;
          }

          // Dampen velocity
          p.vx *= 0.99;
          p.vy *= 0.99;

          // Maintain min speed
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed < 0.1) {
            p.vx = (Math.random() - 0.5) * 0.4;
            p.vy = (Math.random() - 0.5) * 0.4;
          }
        }
      }
    }

    function loop() {
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      parallaxOffsetX = ((e.clientX / window.innerWidth) - 0.5) * width * PARALLAX_MOUSE_FACTOR;
    }

    function onScroll() {
      parallaxOffsetY = -window.scrollY * PARALLAX_SCROLL_FACTOR;
    }

    resize();
    window.addEventListener('resize', resize);

    if (!prefersReduced) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('scroll', onScroll, { passive: true });
      loop();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <Canvas ref={canvasRef} aria-hidden="true" />;
}
