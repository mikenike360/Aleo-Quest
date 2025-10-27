'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundManager } from '@/lib/audio';
import { useAppStore } from '@/lib/store';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
  onCorrect?: () => void;
  stepId: string;
}

export function Quiz({ question, options, onCorrect, stepId }: QuizProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const soundManager = useSoundManager();
  const setQuizCompleted = useAppStore((state) => state.setQuizCompleted);
  const isCompleted = useAppStore((state) => state.quizCompletions[stepId] || false);

  const handleSelect = (optionId: string) => {
    if (isCompleted) return; // Prevent re-answering if already completed
    
    setSelectedId(optionId);
    setShowFeedback(true);
    
    const option = options.find((o) => o.id === optionId);
    if (option?.isCorrect) {
      soundManager.playSuccessSound();
      setQuizCompleted(stepId, true); // Mark quiz as completed
      if (onCorrect) {
        setTimeout(onCorrect, 1500);
      }
    } else {
      soundManager.playErrorSound();
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setShowFeedback(false);
  };

  const selectedOption = options.find((o) => o.id === selectedId);
  const letters = ['a', 'b', 'c', 'd', 'e'];

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-purple-500/30 bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-purple-500/5">
      {/* Terminal Header */}
      <div className="border-b border-purple-500/20 bg-gray-800/90 px-5 py-3">
        <div className="font-mono text-xs text-purple-400">
          quiz.zk
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {isCompleted && !showFeedback && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 mb-4">
            <div className="font-mono text-xs text-green-400">
              ✓ Quiz completed! You can proceed to the next lesson.
            </div>
          </div>
        )}
        
        <div className="font-mono text-sm text-gray-300 mb-4">
          <span className="text-gray-600">&gt;</span> {question}
        </div>
        
        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedId === option.id;
            const letter = letters[index] || index.toString();
            
            return (
              <button
                key={option.id}
                onClick={() => !showFeedback && handleSelect(option.id)}
                disabled={showFeedback}
                className={`w-full rounded-lg border p-4 text-left font-mono text-sm transition-all ${
                  isSelected
                    ? option.isCorrect
                      ? 'border-green-500/50 bg-green-500/10 text-green-300'
                      : 'border-red-500/50 bg-red-500/10 text-red-300'
                    : showFeedback
                    ? 'border-gray-700 bg-gray-800/30 text-gray-500 cursor-not-allowed'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer'
                }`}
              >
                <span className="text-gray-600">[{letter}]</span> {option.text}
                {isSelected && (
                  <span className="ml-2">
                    {option.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showFeedback && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className={`rounded-lg border p-4 ${
                selectedOption.isCorrect
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-red-500/50 bg-red-500/10'
              }`}>
                <div className="font-mono text-sm">
                  <div className={`mb-2 ${selectedOption.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="text-gray-600">&gt;</span> {selectedOption.isCorrect ? 'Correct!' : 'Not quite...'}
                  </div>
                  {selectedOption.explanation && (
                    <div className="text-xs text-gray-300 leading-relaxed">
                      {selectedOption.explanation}
                    </div>
                  )}
                </div>
              </div>
              {!selectedOption.isCorrect && (
                <button
                  onClick={handleReset}
                  className="mt-3 w-full font-mono text-xs text-gray-400 hover:text-purple-400 transition"
                >
                  [Try again]
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

