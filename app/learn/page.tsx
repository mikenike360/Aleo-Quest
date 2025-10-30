'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { TerminalWidget } from '@/components/TerminalWidget';
import { Terminal } from '@/components/Terminal';
import { AleoLogo } from '@/components/AleoLogo';
import { TerminalBreadcrumb } from '@/components/TerminalBreadcrumb';
import { useAppStore } from '@/lib/store';
import { learnSteps, getProgressPercent } from '@/lib/steps';
import { CheckCircle, Lock, Circle, RotateCcw } from 'lucide-react';
import { trackPageview, trackEvent } from '@/lib/analytics';
import { useSoundManager } from '@/lib/audio';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';

export default function LearnPage() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const soundManager = useSoundManager();
  const isAudioMuted = useAppStore((state) => state.isAudioMuted);
  
  useEffect(() => {
    trackPageview('/learn');
  }, []);

  // Hydrate store
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  const completedSteps = useAppStore((state) => state.completedSteps);
  const currentStep = useAppStore((state) => state.learnStep);
  const quizCompletions = useAppStore((state) => state.quizCompletions);
  const resetLearn = useAppStore((state) => state.resetLearn);

  const handleReset = () => {
    resetLearn();
    setShowResetDialog(false);
    trackEvent('learn_reset');
  };

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    
    const stepIndex = learnSteps.findIndex((s) => s.id === stepId);
    const currentIndex = learnSteps.findIndex((s) => s.id === currentStep);
    
    // Check if this step is available based on previous quiz completion
    if (stepIndex > 0) {
      const previousStep = learnSteps[stepIndex - 1];
      if (previousStep.hasQuiz && !quizCompletions[previousStep.id]) {
        return 'locked';
      }
    }
    
    if (stepIndex <= currentIndex + 1) return 'available';
    return 'locked';
  };

  const progressPercent = getProgressPercent(completedSteps);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Terminal title="aleo-learn" glow="green" showCRT={true}>
          <div className="space-y-6">
            {/* Header - Terminal Title Bar Style */}
            <div className="border-2 border-green-500/50 bg-black/90 rounded-t-lg">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border-b-2 border-green-500/30">
                <div className="flex gap-1">

                </div>
                <div className="flex-1 text-center">
                  <AleoLogo colorScheme="green" size="small" />
                  <TerminalBreadcrumb currentPage="learn" colorScheme="green" />
                </div>
                <div className="ml-auto pr-2"></div>
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
            </div>

            {/* Learn Status */}
            <div className="space-y-2 font-mono text-sm">
              <div className="text-cyan-400">
                <span className="text-gray-600">&gt;</span> {learnSteps.length} lessons in knowledge base
              </div>
              {completedSteps.length > 0 && (
                <div className="text-green-400">
                  <span className="text-gray-600">&gt;</span> {completedSteps.length} completed ✓
                </div>
              )}
            </div>

            {/* Progress Widget */}
            <TerminalWidget title="learn $ status" colorScheme="green">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div />
                  {completedSteps.length > 0 && (
                    <button 
                      onClick={() => setShowResetDialog(true)}
                      className="font-mono text-[10px] px-2 py-1 border-2 border-gray-700 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                    >
                      [RESET]
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-green-400">Progress</span>
                  <span className="text-green-300 font-bold">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2.5 bg-gray-800 [&>div]:bg-green-500" />
                <div className="flex items-center justify-between font-mono text-xs text-green-400/70">
                  <span>{completedSteps.length} of {learnSteps.length} complete</span>
                  {progressPercent === 100 && (
                    <span className="text-green-400">✓ All done!</span>
                  )}
                </div>
              </div>
            </TerminalWidget>

            {/* Reset Dialog (opened from Learn Status box) */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogContent className="bg-black border-2 border-green-500 text-green-400 font-mono">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-green-400">[RESET LEARNING]</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Are you sure you want to reset your learning progress? This will clear all your completed lessons and start over.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                    className="border-green-500 text-green-400 hover:bg-green-500/10 font-mono"
                  >
                    [CANCEL]
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white font-mono"
                  >
                    [RESET LEARNING]
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Steps Grid */}
            <div className="grid gap-4">
              {learnSteps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';
                const isAvailable = status === 'available';
                const isLocked = status === 'locked';

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`transition-all ${
                      isCompleted 
                        ? 'border-green-500/50 bg-green-500/5' 
                        : isCurrent 
                        ? 'border-cyan-500/50 bg-cyan-500/5' 
                        : isAvailable
                        ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        : 'border-gray-700 bg-gray-900/50 opacity-60'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <CardTitle className="text-lg">{step.title}</CardTitle>
                              <CardDescription className="text-sm">
                                {step.summary}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                      
                            {isCompleted && (
                              <span className="font-mono text-xs px-2 py-1 border border-green-500/50 bg-green-500/10 text-green-400 rounded">
                                [COMPLETE]
                              </span>
                            )}
                            {isCurrent && (
                              <span className="font-mono text-xs px-2 py-1 border border-green-500/50 bg-green-500/20 text-green-300 rounded">
                                [CURRENT]
                              </span>
                            )}
                            {isLocked && (
                              <span className="font-mono text-xs px-2 py-1 border border-gray-600 bg-gray-800/50 text-gray-500 rounded">
                                [LOCKED]
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Step {step.order} of {learnSteps.length}
                          </div>
                          {isAvailable && (
                            <Link href={`/learn/${step.id}`}>
                              <button 
                                onClick={() => soundManager.playClickSound()}
                                className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                              >
                                [START LESSON]
                              </button>
                            </Link>
                          )}
                          {isCurrent && (
                            <Link href={`/learn/${step.id}`}>
                              <button 
                                onClick={() => soundManager.playClickSound()}
                                className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                              >
                                [CONTINUE]
                              </button>
                            </Link>
                          )}
                          {isCompleted && (
                            <Link href={`/learn/${step.id}`}>
                              <button 
                                onClick={() => soundManager.playClickSound()}
                                className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
                              >
                                [REVIEW]
                              </button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Next Steps */}
            {progressPercent > 0 && (
              <TerminalWidget title="learn $ next" colorScheme="green">
                <div className="text-center space-y-4">
                  <div className="font-mono text-sm text-gray-400">
                    <span className="text-gray-600">&gt;</span> Ready for hands-on practice?
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/quest">
                      <button 
                        onClick={() => soundManager.playClickSound()}
                        className="rounded-lg border border-green-600/50 bg-green-600/10 px-6 py-3 font-mono text-sm text-green-300 transition hover:bg-green-600/20"
                      >
                        🎮 Start Quest
                      </button>
                    </Link>
                  </div>
                </div>
              </TerminalWidget>
            )}
          </div>
        </Terminal>
      </div>
    </div>
  );
}