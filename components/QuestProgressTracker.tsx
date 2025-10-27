'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalText, TerminalProgress } from '@/components/zkVisuals/TerminalTheme';
import { type QuestStage } from '@/lib/store';

const stageOrder: QuestStage[] = ['locked-vault', 'truth-teller', 'hidden-key', 'private-marketplace', 'final-gate'];

const stageTitles: Record<QuestStage, string> = {
  'locked-vault': 'The Vault',
  'truth-teller': 'The Proof',
  'hidden-key': 'The Choice',
  'private-marketplace': 'The Market',
  'final-gate': 'The Final Gate',
  'completed': 'Quest Complete'
};

const stageColors = ['cyan', 'green', 'purple', 'yellow', 'mixed'];

interface QuestProgressTrackerProps {
  currentStage: QuestStage;
  completedStages: QuestStage[];
  badges: string[];
  onStageSelect: (stage: QuestStage) => void;
  className?: string;
}

export function QuestProgressTracker({ 
  currentStage, 
  completedStages, 
  badges, 
  onStageSelect,
  className = '' 
}: QuestProgressTrackerProps) {
  const progressPercent = Math.round((badges.length / 5) * 100);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`border-2 border-cyan-500 bg-black/90 p-4 font-mono ${className}`}>
      {/* Terminal Header */}
      <div className="border-b border-cyan-500/30 pb-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-cyan-400">
            ┌────────────────────────────────────┐
            <br />
            │ QUEST_PROGRESS [{badges.length}/5] │
            <br />
            └────────────────────────────────────┘
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-xs"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TerminalProgress value={badges.length} max={5} colorScheme="cyan" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Navigation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          {stageOrder.map((stage, index) => {
            const isCompleted = completedStages.includes(stage);
            const isCurrent = currentStage === stage;
            const isClickable = isCompleted;
            const colorScheme = stageColors[index] as any;
            
            return (
              <motion.button
                key={stage}
                onClick={() => isClickable && onStageSelect(stage)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                className={`
                  flex-1 p-2 border-2 font-mono text-xs transition-all
                  ${isCurrent 
                    ? `border-${colorScheme}-500 bg-${colorScheme}-500/20 text-${colorScheme}-400`
                    : isCompleted
                      ? `border-gray-600 bg-gray-800 text-gray-300 hover:border-${colorScheme}-500/50 hover:bg-${colorScheme}-500/10`
                      : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-xs">
                    [{stageTitles[stage]}]
                  </div>
                  <div className="font-bold mt-1">
                    {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-1">
          {stageOrder.map((stage, index) => {
            const isCompleted = completedStages.includes(stage);
            const isCurrent = currentStage === stage;
            const isClickable = isCompleted;
            const colorScheme = stageColors[index] as any;
            
            return (
              <motion.button
                key={stage}
                onClick={() => isClickable && onStageSelect(stage)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                className={`
                  w-full p-2 border-2 font-mono text-xs transition-all
                  ${isCurrent 
                    ? `border-${colorScheme}-500 bg-${colorScheme}-500/20 text-${colorScheme}-400`
                    : isCompleted
                      ? `border-gray-600 bg-gray-800 text-gray-300 hover:border-${colorScheme}-500/50 hover:bg-${colorScheme}-500/10`
                      : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      [{stageTitles[stage]}]
                    </span>
                    <span className="font-bold">
                      {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    [{index + 1}]
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
