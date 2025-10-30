'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalProgress } from '@/components/zkVisuals/TerminalTheme';
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
  onReset?: () => void;
}

export function QuestProgressTracker({ 
  currentStage, 
  completedStages, 
  badges, 
  onStageSelect,
  className = '',
  onReset
}: QuestProgressTrackerProps) {
  const progressPercent = Math.round((badges.length / 5) * 100);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border-2 border-cyan-500 bg-black/90 p-2 sm:p-4 font-mono w-full max-w-full ${className}`}>
      {/* Terminal Header */}
      <div className="border-b border-cyan-500/30 pb-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-cyan-400 flex-1 min-w-0">
            QUEST_PROGRESS [{badges.length}/5]
          </div>
          {onReset && (
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="font-mono text-[10px] px-2 py-1 border-2 border-gray-700 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                title="Reset quest progress"
              >
                [RESET]
              </button>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-xs flex-shrink-0 px-1"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isExpanded && (
        <div>
          <TerminalProgress value={badges.length} max={5} colorScheme="cyan" />
        </div>
      )}

      {/* Stage Navigation */}
      {isExpanded && (
        <div className="space-y-2">
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
        </div>
      )}
    </div>
  );
}
