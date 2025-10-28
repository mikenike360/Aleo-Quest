'use client';

export function CRTEffect() {
  return (
    <>
      {/* Scanline effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
        }}
      />
      
      {/* Flicker overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          animation: 'crt-flicker 5s infinite, crt-brightness 3s ease-in-out infinite',
        }}
      />
      
      {/* Subtle vignette */}
      <div 
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
      
      {/* Phosphor glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        }}
      />
    </>
  );
}

