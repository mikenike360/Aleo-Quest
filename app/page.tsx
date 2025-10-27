'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { TerminalWidget } from '@/components/TerminalWidget';
import { Terminal } from '@/components/Terminal';
import { BootSequence } from '@/components/BootSequence';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { TerminalPanel, TerminalText } from '@/components/zkVisuals/TerminalTheme';
import { useAppStore } from '@/lib/store';
import { learnSteps, getProgressPercent } from '@/lib/steps';
import { BookOpen, Eye, Gamepad2, ArrowRight, RotateCcw } from 'lucide-react';
import { trackPageview, trackEvent } from '@/lib/analytics';
import { useSoundManager } from '@/lib/audio';
import { AleoLogo } from '@/components/AleoLogo';
import { TerminalBreadcrumb } from '@/components/TerminalBreadcrumb';

export default function HomePage() {
  const [showResetDialog, setShowResetDialog] = useState(false);
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
            <div className="border-2 border-green-500/50 bg-black/90 rounded-t-lg">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border-b-2 border-green-500/30">
                <div className="flex gap-1">

                </div>
                <div className="flex-1 text-center">
                  <AleoLogo colorScheme="green" size="small" />
                  <TerminalBreadcrumb currentPage="home" colorScheme="green" />
                </div>
              </div>
              <div className="px-2 sm:px-4 py-2 font-mono text-xs text-gray-400 text-center">
                &gt; An educational journey through zero-knowledge_
              </div>
              {/* Action Buttons - under the title */}
              <div className="px-4 py-2 border-t border-green-500/20">
                <div className="flex justify-end gap-2">
                  {/* Mute Button */}
                  <button 
                    onClick={() => {
                      soundManager.toggleMute();
                      soundManager.playClickSound();
                    }}
                    className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                  >
                    [{isAudioMuted ? 'UNMUTE' : 'MUTE'}]
                  </button>

                  {/* Reset Button */}
                  {hasProgress && (
                    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                      <DialogTrigger asChild>
                        <button className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all">
                          [RESET]
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-black border-2 border-green-500 text-green-400 font-mono">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold text-green-400">[RESET ALL PROGRESS]</DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Are you sure you want to reset all your progress? This will clear all your badges and learning progress.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="my-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                          <p className="text-sm text-yellow-300">
                            Current progress: <strong>{badges.length} badges earned, {completedSteps.length}/{learnSteps.length} lessons complete</strong>
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowResetDialog(false)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            [CANCEL]
                          </Button>
                          <Button
                            variant="default"
                            onClick={handleResetAll}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            [RESET ALL]
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
            {/* Boot Sequence */}
            <BootSequence onComplete={handleBootComplete}>

            </BootSequence>

            {/* Interactive Command Prompt */}
            {bootComplete && <InteractiveTerminal />}

            {/* Features Section */}
            {bootComplete && (
              <div className="space-y-8">
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
                          {/* Terminal Header */}
                          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              </div>
                              <TerminalText colorScheme="cyan" variant="muted" className="text-xs font-mono">learn-terminal</TerminalText>
                            </div>
                            <TerminalText colorScheme="cyan" variant="accent" className="text-xs">[ACTIVE]</TerminalText>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <TerminalText colorScheme="cyan" variant="accent" className="text-xs">drwxr-xr-x</TerminalText>
                            <TerminalText colorScheme="cyan" variant="primary" className="text-sm font-bold">learn/</TerminalText>
                            <TerminalText colorScheme="cyan" variant="muted" className="text-xs">5 chapters</TerminalText>
                            <TerminalText colorScheme="cyan" variant="accent" className="text-xs">[EDUCATIONAL]</TerminalText>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">📚</div>
                              <div>
                                <h3 className="text-lg font-bold text-white mb-1">Narrative Lessons</h3>
                                <TerminalText colorScheme="cyan" variant="muted" className="text-sm">
                                  Step-by-step chapters explaining zero-knowledge concepts
                                </TerminalText>
                              </div>
                            </div>
                            <div className="border-t border-gray-700 pt-3">
                              <TerminalText colorScheme="cyan" variant="muted" className="text-xs">
                                <span className="text-gray-600">&gt;</span> learn/intro.md
                              </TerminalText>
                              <div className="mt-1">
                                <TerminalText colorScheme="cyan" variant="accent" className="text-xs">
                                  Perfect for: Understanding fundamentals
                                </TerminalText>
                              </div>
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
                          {/* Terminal Header */}
                          <div className="flex items-center justify-between border-b border-green-500/20 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              </div>
                              <TerminalText colorScheme="green" variant="muted" className="text-xs font-mono">quest-terminal</TerminalText>
                            </div>
                            <TerminalText colorScheme="green" variant="accent" className="text-xs">[ACTIVE]</TerminalText>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <TerminalText colorScheme="green" variant="accent" className="text-xs">drwxr-xr-x</TerminalText>
                            <TerminalText colorScheme="green" variant="primary" className="text-sm font-bold">quest/</TerminalText>
                            <TerminalText colorScheme="green" variant="muted" className="text-xs">5 stages</TerminalText>
                            <TerminalText colorScheme="green" variant="accent" className="text-xs">[GAMIFIED]</TerminalText>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">🎮</div>
                              <div>
                                <h3 className="text-lg font-bold text-white mb-1">Interactive Quest</h3>
                                <TerminalText colorScheme="green" variant="muted" className="text-sm">
                                  Hands-on challenges guiding you through 5 ZK stages
                                </TerminalText>
                              </div>
                            </div>
                            <div className="border-t border-gray-700 pt-3">
                              <TerminalText colorScheme="green" variant="muted" className="text-xs">
                                <span className="text-gray-600">&gt;</span> quest/start.zk
                              </TerminalText>
                              <div className="mt-1">
                                <TerminalText colorScheme="green" variant="accent" className="text-xs">
                                  Perfect for: Learning by doing
                                </TerminalText>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Terminal>
      </div>
    </div>
  );
}

