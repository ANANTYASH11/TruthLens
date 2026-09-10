import React from 'react';

/**
 * CyberRingsBackground
 * Concentric geometric cybernetic arcs and radar rings inspired by
 * the Arthean / PYTIA 99designs showcase.
 * Features glowing vector arcs, gradient strokes, and tech notches.
 */
export default function CyberRingsBackground({ mode = 0 }) {
  // Gradients can shift subtly based on mode
  const gradientStops = [
    { start: '#00f2fe', mid: '#3b82f6', end: '#8b5cf6' }, // 01 Visual
    { start: '#c084fc', mid: '#a855f7', end: '#ec4899' }, // 02 Biometric
    { start: '#34d399', mid: '#10b981', end: '#06b6d4' }, // 03 Indic
    { start: '#fbbf24', mid: '#f59e0b', end: '#ef4444' }, // 04 Deepfake
  ][mode % 4];

  return (
    <div 
      style={{
        position: 'absolute',
        inset: '-60px -80px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '120%',
          height: '120%',
          opacity: 0.85,
          filter: 'drop-shadow(0 0 30px rgba(0, 242, 254, 0.15))',
        }}
      >
        <defs>
          <linearGradient id="cyberRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStops.start} stopOpacity="0.8" />
            <stop offset="50%" stopColor={gradientStops.mid} stopOpacity="0.5" />
            <stop offset="100%" stopColor={gradientStops.end} stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="cyberRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientStops.end} stopOpacity="0.6" />
            <stop offset="100%" stopColor={gradientStops.start} stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="cyberGlowCore" cx="35%" cy="50%" r="50%">
            <stop offset="0%" stopColor={gradientStops.start} stopOpacity="0.16" />
            <stop offset="60%" stopColor={gradientStops.end} stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient atmospheric glow */}
        <rect x="0" y="0" width="1200" height="800" fill="url(#cyberGlowCore)" />

        {/* Concentric Geometric Rings centered at (420, 400) where the sphere sits */}
        <g transform="translate(420, 400)">
          
          {/* Ring 1: Outer segmented ring */}
          <circle
            cx="0"
            cy="0"
            r="380"
            stroke="url(#cyberRingGrad1)"
            strokeWidth="1.5"
            strokeDasharray="18 12 120 16 80 24"
            opacity="0.45"
            style={{ animation: 'ringSlowRotate 90s linear infinite', transformOrigin: 'center' }}
          />

          {/* Ring 2: Thick accent arcs (reference design arc framing) */}
          <path
            d="M -310 -180 A 360 360 0 0 1 310 -180"
            stroke="url(#cyberRingGrad1)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 310 180 A 360 360 0 0 1 -310 180"
            stroke="url(#cyberRingGrad2)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Ring 3: Medium tech dashed ring */}
          <circle
            cx="0"
            cy="0"
            r="290"
            stroke="url(#cyberRingGrad2)"
            strokeWidth="1.8"
            strokeDasharray="4 8"
            opacity="0.35"
            style={{ animation: 'ringCounterRotate 60s linear infinite', transformOrigin: 'center' }}
          />

          {/* Ring 4: Solid inner precision ring with notches */}
          <circle
            cx="0"
            cy="0"
            r="230"
            stroke="url(#cyberRingGrad1)"
            strokeWidth="2"
            opacity="0.55"
          />

          {/* Precision Crosshair Tech Notches */}
          <line x1="-240" y1="0" x2="-220" y2="0" stroke={gradientStops.start} strokeWidth="3" opacity="0.8" />
          <line x1="220" y1="0" x2="240" y2="0" stroke={gradientStops.start} strokeWidth="3" opacity="0.8" />
          <line x1="0" y1="-240" x2="0" y2="-220" stroke={gradientStops.start} strokeWidth="3" opacity="0.8" />
          <line x1="0" y1="220" x2="0" y2="240" stroke={gradientStops.start} strokeWidth="3" opacity="0.8" />

          {/* Diagonal Framing Lines */}
          <line x1="-360" y1="-360" x2="-280" y2="-280" stroke="url(#cyberRingGrad1)" strokeWidth="1.5" opacity="0.3" />
          <line x1="280" y1="280" x2="360" y2="360" stroke="url(#cyberRingGrad1)" strokeWidth="1.5" opacity="0.3" />
          <line x1="-360" y1="360" x2="-280" y2="280" stroke="url(#cyberRingGrad2)" strokeWidth="1.5" opacity="0.3" />
          <line x1="280" y1="-280" x2="360" y2="-360" stroke="url(#cyberRingGrad2)" strokeWidth="1.5" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
