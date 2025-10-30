'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TerminalWidget } from '@/components/TerminalWidget';
import { Terminal } from '@/components/Terminal';
import { BootSequence } from '@/components/BootSequence';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { TerminalPanel, TerminalText } from '@/components/zkVisuals/TerminalTheme';
import { useAppStore } from '@/lib/store';
import { learnSteps, getProgressPercent } from '@/lib/steps';
import { BookOpen, Eye, Gamepad2, ArrowRight } from 'lucide-react';
import { trackPageview, trackEvent } from '@/lib/analytics';
import { useSoundManager } from '@/lib/audio';
import { AleoLogo } from '@/components/AleoLogo';
import { TerminalBreadcrumb } from '@/components/TerminalBreadcrumb';

export default function HomePage() {
  const [bootComplete, setBootComplete] = useState(false);
  const soundManager = useSoundManager();
  const isAudioMuted = useAppStore((state) => state.isAudioMuted);
  
  useEffect(() => {
    trackPageview('/');
  }, []);

  // Hydrate Zustand store on client
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  const badges = useAppStore((state) => state.badges);
  const completedSteps = useAppStore((state) => state.completedSteps);
  const reset = useAppStore((state) => state.reset);

  const hasProgress = badges.length > 0 || completedSteps.length > 0;
  const progressPercent = getProgressPercent(completedSteps);
  const questProgress = Math.round((badges.length / 5) * 100);

  const handleResetAll = () => {
    reset();
    setShowResetDialog(false);
    soundManager.playClickSound();
    trackEvent('reset_all');
  };

  const handleBootComplete = () => {
    setBootComplete(true);
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Terminal title="aleo-quest-main" glow="green" showCRT={true}>
          <div className="space-y-8">
            {/* Header - Terminal Title Bar Style */}
            {bootComplete && (
              <motion.div 
                className="border-2 border-green-500/50 bg-black/90 rounded-t-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2 px-0 sm:px-3 py-2 border-b-2 border-green-500/30">
                  <div className="flex gap-1">

                  </div>
                  <div className="flex-1 text-center">
                    <AleoLogo colorScheme="green" size="small" />
                    <TerminalBreadcrumb currentPage="" colorScheme="green" />
                  </div>
                  <div className="ml-auto pr-2">
                    <button 
                      onClick={() => {
                        soundManager.toggleMute();
                        soundManager.playClickSound();
                      }}
                      className="font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                    >
                      [{isAudioMuted ? 'UNMUTE' : 'MUTE'}]
                    </button>
                  </div>
                </div>
                <div className="px-2 sm:px-4 py-2 font-mono text-xs text-gray-400 text-center">
                  &gt; An educational journey through zero-knowledge_
                </div>
                {/* Action Buttons - under the title */}
                <div className="px-4 py-2 border-t border-green-500/20">
                  <div className="flex justify-between items-center gap-4">
                    {/* Interactive Terminal - Left side */}
                    <div className="flex-1 min-w-0">
                      <InteractiveTerminal />
                    </div>
                    
                    {/* Buttons - Right side (none now) */}
                    <div className="flex gap-2 shrink-0" />
                  </div>
                </div>
              </motion.div>
            )}
            {/* Boot Sequence */}
            {!bootComplete && (
              <motion.div
                key="boot-sequence"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <BootSequence onComplete={handleBootComplete}>

                </BootSequence>
              </motion.div>
            )}

            {/* Features Section */}
            {bootComplete && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                {/* Section divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                  <div className="font-mono text-xs text-cyan-400 px-4 py-1 border border-cyan-500/30 bg-cyan-500/5 rounded">
                    AVAILABLE_EXPERIENCES
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                </div>

                {/* ASCII Logo Header */}
                {/* <div className="p-6 border border-cyan-500/30 bg-cyan-500/5 rounded-lg">
                  <div className="text-center">
                    <AleoLogo colorScheme="green" size="small" />
                    <div className="mt-2 text-xs text-gray-400 font-mono">
                      &gt; Story-driven journey through zero-knowledge_
                    </div>
                  </div>
                </div> */}

                {/* Features Grid */}
                <div className="flex justify-center">
                  <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    <Link href="/learn">
                      <div 
                        onClick={() => soundManager.playClickSound()}
                        className="h-full p-6 border border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm rounded-lg cursor-pointer hover:brightness-110 hover:border-cyan-500/50 transition-all shadow-lg shadow-cyan-500/5"
                      >
                        <div className="space-y-4">
                          {/* Terminal Header - Keep */}
                          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1.5 font-mono text-xs">
                                <span className="text-red-400">[✕]</span>
                                <span className="text-yellow-400">[−]</span>
                                <span className="text-green-400">[□]</span>
                              </div>
                              <TerminalText colorScheme="cyan" variant="muted" className="text-xs font-mono">learn-terminal</TerminalText>
                            </div>
                            <TerminalText colorScheme="cyan" variant="accent" className="text-xs">[ACTIVE]</TerminalText>
                          </div>
                          
                          {/* Content */}
                          <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">📚</div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">Learn Zero-Knowledge</h3>
                              <TerminalText colorScheme="cyan" variant="muted" className="text-sm">
                                Step-by-step chapters explaining ZK concepts
                              </TerminalText>
                            </div>
                          </div>
                          
                          {/* CTA Button */}
                          <div className="flex justify-end">
                            <div className="font-mono text-sm px-4 py-2 border-2 border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all">
                              [START LEARNING →]
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <Link href="/quest">
                      <div 
                        onClick={() => soundManager.playClickSound()}
                        className="h-full p-6 border border-green-500/30 bg-gray-900/80 backdrop-blur-sm rounded-lg cursor-pointer hover:brightness-110 hover:border-green-500/50 transition-all shadow-lg shadow-green-500/5"
                      >
                        <div className="space-y-4">
                          {/* Terminal Header - Keep */}
                          <div className="flex items-center justify-between border-b border-green-500/20 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1.5 font-mono text-xs">
                                <span className="text-red-400">[✕]</span>
                                <span className="text-yellow-400">[−]</span>
                                <span className="text-green-400">[□]</span>
                              </div>
                              <TerminalText colorScheme="green" variant="muted" className="text-xs font-mono">quest-terminal</TerminalText>
                            </div>
                            <TerminalText colorScheme="green" variant="accent" className="text-xs">[ACTIVE]</TerminalText>
                          </div>
                          
                          {/* Content */}
                          <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">🎮</div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">Interactive Quest</h3>
                              <TerminalText colorScheme="green" variant="muted" className="text-sm">
                                Hands-on challenges through 5 ZK stages
                              </TerminalText>
                            </div>
                          </div>
                          
                          {/* CTA Button */}
                          <div className="flex justify-end">
                            <div className="font-mono text-sm px-4 py-2 border-2 border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-all">
                              [BEGIN QUEST →]
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Terminal>
      </div>
    </div>
  );
}

