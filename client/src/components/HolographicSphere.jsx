import React, { useRef, useEffect } from 'react';

/**
 * 3D Holographic Neural Sphere
 * High-performance Fibonacci-sphere rendering on HTML5 Canvas
 * Features: 3D perspective projection, dynamic neural web lines,
 * dual orbital rings with revolving photon beads, mouse inertia,
 * and real-time forensic scanning waves.
 */
export default function HolographicSphere({ 
  mode = 0, 
  isScanning = false, 
  size = 520,
  onSphereClick
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const rotationRef = useRef({ x: 0.2, y: 0.3, vx: 0.003, vy: 0.006 });
  const scanProgressRef = useRef(0);

  // Palette definitions for the 4 operating modes
  const THEME_PALETTES = [
    {
      // 01: Visual Forensics (Cyan & Electric Sapphire)
      primary: '#00f2fe',
      secondary: '#4facfe',
      accent: '#38bdf8',
      glow: 'rgba(0, 242, 254, 0.4)',
      coreAura: 'rgba(56, 189, 248, 0.15)',
      lineColor: 'rgba(56, 189, 248, 0.18)',
    },
    {
      // 02: Biometric Pulse (Quantum Violet & Magenta)
      primary: '#c084fc',
      secondary: '#a855f7',
      accent: '#f472b6',
      glow: 'rgba(168, 85, 247, 0.4)',
      coreAura: 'rgba(192, 132, 252, 0.15)',
      lineColor: 'rgba(216, 180, 254, 0.18)',
    },
    {
      // 03: Indic Regional NLP (Neon Jade & Emerald)
      primary: '#34d399',
      secondary: '#10b981',
      accent: '#2dd4bf',
      glow: 'rgba(16, 185, 129, 0.4)',
      coreAura: 'rgba(52, 211, 153, 0.15)',
      lineColor: 'rgba(45, 212, 191, 0.18)',
    },
    {
      // 04: Deepfake Security (Solar Amber & Flare Crimson)
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#f87171',
      glow: 'rgba(245, 158, 11, 0.45)',
      coreAura: 'rgba(251, 191, 36, 0.15)',
      lineColor: 'rgba(251, 191, 36, 0.2)',
    }
  ];

  const currentPalette = THEME_PALETTES[mode % THEME_PALETTES.length];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Pre-generate Fibonacci Sphere points
    const pointCount = 220;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle (~2.3999 rad)

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2; // y in [-1, 1]
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      // Node pulse offset
      points.push({
        x, y, z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        baseSize: 1.6 + Math.random() * 1.8,
      });
    }

    // Pre-generate orbital rings (2 tilted rings)
    const ring1Points = [];
    const ring2Points = [];
    const ringSegments = 64;

    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      const r = 1.35;
      
      // Ring 1 (tilted 35 deg around X, 20 deg around Z)
      const r1x = Math.cos(angle) * r;
      const r1y = Math.sin(angle) * r * Math.cos(0.6);
      const r1z = Math.sin(angle) * r * Math.sin(0.6);
      ring1Points.push({ x: r1x, y: r1y, z: r1z });

      // Ring 2 (tilted -45 deg around X, -30 deg around Z)
      const r2x = Math.cos(angle) * (r * 1.15);
      const r2y = Math.sin(angle) * (r * 1.15) * Math.cos(-0.8);
      const r2z = Math.sin(angle) * (r * 1.15) * Math.sin(-0.8);
      ring2Points.push({ x: r2x, y: r2y, z: r2z });
    }

    let photonAngle1 = 0;
    let photonAngle2 = Math.PI;

    // Handle high-DPI displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const sphereRadius = size * 0.35;
      const fov = 400;

      // Update rotation with mouse inertia
      const mouse = mouseRef.current;
      const rot = rotationRef.current;

      if (mouse.isHovered) {
        rot.vx += (mouse.targetX * 0.0004 - rot.vx) * 0.08;
        rot.vy += (mouse.targetY * 0.0004 - rot.vy) * 0.08;
      } else {
        rot.vx += (0.003 - rot.vx) * 0.02;
        rot.vy += (0.006 - rot.vy) * 0.02;
      }

      rot.x += rot.vx;
      rot.y += rot.vy;

      // Scanning wave animation
      if (isScanning) {
        scanProgressRef.current = (scanProgressRef.current + 0.018) % 2;
      } else {
        scanProgressRef.current = -1;
      }
      const scanY = scanProgressRef.current - 1; // Sweeps from -1 to 1

      // ── Draw Central Energy Glow ──
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius * 1.2);
      coreGrad.addColorStop(0, currentPalette.coreAura);
      coreGrad.addColorStop(0.5, currentPalette.coreAura.replace('0.15', '0.04'));
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Rotation helper functions
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);

      const project = (x, y, z, scale = sphereRadius) => {
        // Rotate around Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const pScale = fov / (fov + z2 * scale);
        const px = cx + x1 * scale * pScale;
        const py = cy + y2 * scale * pScale;

        return { px, py, pz: z2, pScale, rawY: y };
      };

      // ── Project Sphere Points ──
      const projectedPoints = points.map((p, idx) => {
        const pulse = Math.sin(time * 2 + p.phase) * 0.08;
        const effectiveR = (1 + pulse);
        const proj = project(p.x * effectiveR, p.y * effectiveR, p.z * effectiveR);
        return {
          ...proj,
          baseSize: p.baseSize,
          origY: p.y,
          index: idx,
        };
      });

      // Sort points back-to-front for proper depth rendering
      projectedPoints.sort((a, b) => a.pz - b.pz);

      // ── Draw Neural Mesh Connecting Lines (Front facing only) ──
      ctx.lineWidth = 0.8;
      const frontPoints = projectedPoints.filter(p => p.pz > -0.25);
      const maxConnectDist = 48;

      for (let i = 0; i < frontPoints.length; i++) {
        const p1 = frontPoints[i];
        let connections = 0;
        for (let j = i + 1; j < frontPoints.length && connections < 3; j++) {
          const p2 = frontPoints[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            connections++;
            const alpha = (1 - dist / maxConnectDist) * (p1.pz + 0.5) * 0.35;
            ctx.strokeStyle = currentPalette.lineColor.replace(/[\d.]+\)$/, `${Math.max(0, Math.min(alpha, 0.45))})`);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // ── Draw Tilted Orbital Ring 1 ──
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= ringSegments; i++) {
        const pt = ring1Points[i % ringSegments];
        const proj = project(pt.x, pt.y, pt.z);
        if (first) {
          ctx.moveTo(proj.px, proj.py);
          first = false;
        } else {
          ctx.lineTo(proj.px, proj.py);
        }
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Draw Tilted Orbital Ring 2 ──
      ctx.beginPath();
      first = true;
      for (let i = 0; i <= ringSegments; i++) {
        const pt = ring2Points[i % ringSegments];
        const proj = project(pt.x, pt.y, pt.z);
        if (first) {
          ctx.moveTo(proj.px, proj.py);
          first = false;
        } else {
          ctx.lineTo(proj.px, proj.py);
        }
      }
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.14)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Orbiting Photon Beads on Ring 1 ──
      photonAngle1 += 0.025;
      photonAngle2 -= 0.018;
      const photon1X = Math.cos(photonAngle1) * 1.35;
      const photon1Y = Math.sin(photonAngle1) * 1.35 * Math.cos(0.6);
      const photon1Z = Math.sin(photonAngle1) * 1.35 * Math.sin(0.6);
      const photonProj1 = project(photon1X, photon1Y, photon1Z);

      ctx.save();
      ctx.shadowColor = currentPalette.accent;
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(photonProj1.px, photonProj1.py, 3.2 * photonProj1.pScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Orbiting Photon Beads on Ring 2 ──
      const photon2X = Math.cos(photonAngle2) * (1.35 * 1.15);
      const photon2Y = Math.sin(photonAngle2) * (1.35 * 1.15) * Math.cos(-0.8);
      const photon2Z = Math.sin(photonAngle2) * (1.35 * 1.15) * Math.sin(-0.8);
      const photonProj2 = project(photon2X, photon2Y, photon2Z);

      ctx.save();
      ctx.shadowColor = currentPalette.primary;
      ctx.shadowBlur = 10;
      ctx.fillStyle = currentPalette.primary;
      ctx.beginPath();
      ctx.arc(photonProj2.px, photonProj2.py, 2.8 * photonProj2.pScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Draw Scanning Wave Overlay ──
      if (isScanning && scanY >= -1 && scanY <= 1) {
        const scanScreenY = cy + scanY * sphereRadius * cosX;
        const scanWidth = sphereRadius * Math.sqrt(Math.max(0, 1 - scanY * scanY)) * 2.2;
        
        ctx.save();
        const scanGrad = ctx.createLinearGradient(cx - scanWidth / 2, scanScreenY, cx + scanWidth / 2, scanScreenY);
        scanGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        scanGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
        scanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.ellipse(cx, scanScreenY, scanWidth / 2, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── Draw Sphere Nodes ──
      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const depthAlpha = Math.max(0.12, (pt.pz + 1) / 2);
        const isNearScan = isScanning && Math.abs(pt.origY - scanY) < 0.15;

        const nodeRadius = (pt.baseSize * pt.pScale) * (isNearScan ? 2.2 : 1.0);
        
        ctx.save();
        if (pt.pz > 0.4 || isNearScan) {
          ctx.shadowColor = isNearScan ? '#ffffff' : currentPalette.accent;
          ctx.shadowBlur = isNearScan ? 14 : 8;
        }

        ctx.fillStyle = isNearScan 
          ? '#ffffff' 
          : pt.pz > 0.2 
            ? currentPalette.primary 
            : currentPalette.secondary;
        
        ctx.globalAlpha = isNearScan ? 1.0 : depthAlpha;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Mouse movement handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseRef.current.targetX = (clientX - size / 2);
      mouseRef.current.targetY = (clientY - size / 2);
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode, isScanning, size, currentPalette]);

  return (
    <div 
      onClick={onSphereClick}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{
          display: 'block',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
