'use client';

import { motion } from 'framer-motion';

interface QuestTerminalProps {
  children: React.ReactNode;
  className?: string;
}

export function QuestTerminal({ children, className = '' }: QuestTerminalProps) {
  return (
    <div className={`w-full max-w-2xl mx-auto bg-black/95 border-2 border-green-600 rounded-lg shadow-2xl ${className}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
      {/* Retro terminal header */}
      <div className="flex items-center justify-between p-2 border-b-2 border-green-600 bg-green-900/20 rounded-t-lg">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-lg"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg"></div>
        </div>
        <div className="text-xs text-green-400 font-mono tracking-wider">ALEO_QUEST_TERMINAL</div>
        <div className="text-xs text-green-600 font-mono">[ONLINE]</div>
      </div>
      
      {/* Terminal content with fixed scanline effect */}
      <div className="relative p-4 space-y-4 bg-black/80 overflow-hidden">
        {/* Fixed scanline overlay - no transform to prevent bouncing */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="h-px bg-green-400 w-full" style={{
            background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
            animation: 'scanline-fixed 4s linear infinite'
          }}></div>
        </div>
        {children}
      </div>
    </div>
  );
}
