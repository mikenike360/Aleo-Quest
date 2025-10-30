'use client';

import { motion } from 'framer-motion';
import { useSoundManager } from '@/lib/audio';
import { useAppStore } from '@/lib/store';
import { CRTEffect } from './CRTEffect';

interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  glow?: 'blue' | 'purple' | 'green' | 'yellow';
  showCRT?: boolean;
}

export function Terminal({ title = 'aleo-quest.sh', children, glow = 'green', showCRT = true }: TerminalProps) {
  const glowColors = {
    blue: 'border-blue-600 shadow-blue-500/50 hover:shadow-blue-500/70',
    purple: 'border-purple-600 shadow-purple-500/50 hover:shadow-purple-500/70',
    green: 'border-green-600 shadow-green-500/50 hover:shadow-green-500/70',
    yellow: 'border-yellow-600 shadow-yellow-500/50 hover:shadow-yellow-500/70',
  };

  const headerColors = {
    blue: 'border-blue-600 bg-blue-900/20 text-blue-400',
    purple: 'border-purple-600 bg-purple-900/20 text-purple-400',
    green: 'border-green-600 bg-green-900/20 text-green-400',
    yellow: 'border-yellow-600 bg-yellow-900/20 text-yellow-400',
  };

  const soundManager = useSoundManager();
  const isAudioMuted = useAppStore((state) => state.isAudioMuted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border-2 bg-black/95 shadow-2xl transition-all ${glowColors[glow]}`}
    >
      {/* Terminal Header */}
      <div className={`flex items-center justify-between border-b-2 px-4 py-3 ${headerColors[glow]}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 font-mono text-xs">
            <span className="text-red-400">[✕]</span>
            <span className="text-yellow-400">[−]</span>
            <span className="text-green-400">[□]</span>
          </div>
          <span className="ml-3 font-mono text-sm tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.toggleMute();
              soundManager.playClickSound?.();
            }}
            className="font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10"
          >
            [{isAudioMuted ? 'UNMUTE' : 'MUTE'}]
          </button>
          <div className="text-xs font-mono">[ONLINE]</div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="relative p-6 bg-black/80">
        {showCRT && <CRTEffect />}
        <div className="relative z-20">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

interface CommandLineProps {
  children: React.ReactNode;
  prompt?: string;
}

export function CommandLine({ children, prompt = '$' }: CommandLineProps) {
  return (
    <div className="flex items-start gap-2 font-mono text-sm">
      <span className="text-green-400">{prompt}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface AsciiArtProps {
  art: string;
  color?: string;
}

export function AsciiArt({ art, color = 'text-cyan-400' }: AsciiArtProps) {
  return (
    <pre className={`font-mono text-xs leading-tight ${color}`}>
      {art}
    </pre>
  );
}

