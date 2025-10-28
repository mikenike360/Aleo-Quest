'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { learnSteps, getProgressPercent } from '@/lib/steps';
import type { LearnStep } from '@/lib/steps';

interface StepChromeProps {
  title: string;
  summary?: string;
  prevStep: LearnStep | null;
  nextStep: LearnStep | null;
  onNext?: () => void;
  onPrev?: () => void;
  children: React.ReactNode;
  slug?: string;
  canProceed?: boolean;
  hasQuiz?: boolean;
}

export function StepChrome({
  title,
  summary,
  prevStep,
  nextStep,
  onNext,
  onPrev,
  children,
  slug,
  canProceed = true,
  hasQuiz = false,
}: StepChromeProps) {
  const completedSteps = useAppStore((state) => state.completedSteps);
  const progressPercent = getProgressPercent(completedSteps);
  
  // Find current step number
  const currentStepIndex = learnSteps.findIndex(s => s.id === slug);
  const currentStepNumber = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  return (
    <div className="relative">
      {/* Background matrix effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(16, 185, 129, 0.1) 0px, transparent 1px, transparent 2px, rgba(16, 185, 129, 0.1) 3px),
                           repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0px, transparent 1px, transparent 2px, rgba(16, 185, 129, 0.1) 3px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto max-w-4xl px-4 py-8"
      >
        {/* Sticky Progress Bar Only */}
        <div className="sticky top-4 z-10 mb-10">
          <div className="overflow-hidden rounded-xl border border-green-500/30 bg-gray-900/95 backdrop-blur-xl shadow-xl">
            <div className="px-5 py-3 bg-gray-800/90">
              <div className="flex items-center justify-between mb-2">
                <Link 
                  href="/learn" 
                  className="font-mono text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  ← all lessons
                </Link>
                <div className="font-mono text-xs text-green-400">
                  {progressPercent}% complete
                </div>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-gray-800 [&>div]:bg-green-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 rounded-xl border border-gray-800/50 bg-gray-900/40 p-8 sm:p-10 backdrop-blur-sm">
          <header className="space-y-4 border-b border-gray-800/50 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {title}
            </h1>
            {summary && (
              <p className="text-lg text-gray-400 leading-relaxed">{summary}</p>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            {children}
          </div>
        </div>

        {/* Enhanced Terminal Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="overflow-hidden rounded-xl border border-green-500/30 bg-gray-900/95 backdrop-blur-sm shadow-lg">
            <div className="bg-gray-800/90 px-5 py-3 border-b border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs text-green-400">navigation</div>
                <div className="font-mono text-xs text-gray-500">
                  <span className="text-green-400">{currentStepNumber}</span>
                  <span className="mx-1.5 text-gray-700">/</span>
                  <span className="text-gray-400">{learnSteps.length}</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPrev}
                  disabled={!prevStep}
                  className="flex flex-col items-start gap-1 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-left transition-all hover:border-green-500/50 hover:bg-green-500/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:bg-gray-800/50"
                >
                  <div className="font-mono text-xs text-gray-500">← Previous</div>
                  <div className="text-sm text-gray-400 truncate w-full">
                    {prevStep ? prevStep.title : 'Start'}
                  </div>
                </button>

                <button
                  onClick={onNext}
                  disabled={!canProceed}
                  className={`flex flex-col items-end gap-1 rounded-lg border px-4 py-3 text-right transition-all ${
                    canProceed
                      ? 'border-green-600/50 bg-green-600/10 hover:bg-green-600/20 hover:border-green-500 cursor-pointer'
                      : 'border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`font-mono text-xs ${canProceed ? 'text-green-400' : 'text-gray-500'}`}>
                    {canProceed ? 'Next →' : '🔒 Locked'}
                  </div>
                  <div className={`text-sm truncate w-full ${canProceed ? 'text-green-300' : 'text-gray-500'}`}>
                    {canProceed
                      ? nextStep ? nextStep.title : 'Complete'
                      : 'Complete quiz to unlock'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Quiz completion message */}
        {hasQuiz && !canProceed && (
          <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <div className="font-mono text-sm text-yellow-400 font-bold mb-1">
                  Quiz Required
                </div>
                <div className="text-sm text-gray-300">
                  Answer the quiz question correctly to unlock the next lesson.
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

