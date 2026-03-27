/**
 * OMD Tactical Logo Component
 * Crosshair/reticle design - targeting market intelligence
 * Gemini design integration: tactical aesthetic with pulsing center
 */

export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: size, minHeight: size }}
      className="tactical-logo"
    >
      <defs>
        <style>{`
          @keyframes logo-pulse {
            0%, 100% { opacity: 1; r: 5px; }
            50% { opacity: 0.6; r: 7px; }
          }
          .logo-center-dot {
            animation: logo-pulse 2s infinite;
          }
        `}</style>
      </defs>

      {/* Outer dashed circle (faded) */}
      <circle cx="50" cy="50" r="45" stroke="#D4A853" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />

      {/* Middle circle (semi-visible) */}
      <circle cx="50" cy="50" r="30" stroke="#D4A853" strokeWidth="2" opacity="0.6" />

      {/* Crosshair lines */}
      <path d="M50 20V35M50 65V80M20 50H35M65 50H80" stroke="#D4A853" strokeWidth="3" strokeLinecap="round" />

      {/* Pulsing center dot */}
      <circle cx="50" cy="50" r="5" fill="#D4A853" className="logo-center-dot" />
    </svg>
  );
}
