'use client';

import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { getProgressPercent, learnSteps } from '@/lib/steps';

interface ProgressBarProps {
  type?: 'overall' | 'learn';
}

export function ProgressBar({ type = 'overall' }: ProgressBarProps) {
  const completedSteps = useAppStore((state) => state.completedSteps);
  const badges = useAppStore((state) => state.badges);
  
  if (type === 'learn') {
    const progress = getProgressPercent(completedSteps);
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Learning Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    );
  }

  // Overall progress: Learn (6 steps) + Quest (5 badges) = 11 total
  const totalItems = learnSteps.length + 5; // 6 learn steps + 5 quest stages
  const completedItems = completedSteps.length + badges.length;
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>Overall Progress</span>
        <span>{overallProgress}%</span>
      </div>
      <Progress value={overallProgress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{completedSteps.length}/{learnSteps.length} lessons</span>
        <span>{badges.length}/5 quest stages</span>
      </div>
    </div>
  );
}

