'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Choice {
  key: string;
  text: string;
  color?: string;
}

interface KeyboardChoiceProps {
  choices: Choice[];
  onSelect: (key: string) => void;
  prompt?: string;
  allowRetry?: boolean;
}

export function KeyboardChoice({ choices, onSelect, prompt = 'Choose:', allowRetry = true }: KeyboardChoiceProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isProcessing) return;
      
      const choice = choices.find(c => c.key === e.key);
      if (choice) {
        setSelectedKey(choice.key);
        setIsProcessing(true);
        // Small delay for visual feedback before callback
        setTimeout(() => {
          onSelect(choice.key);
          // Reset for retry if allowed
          if (allowRetry) {
            setTimeout(() => {
              setSelectedKey(null);
              setIsProcessing(false);
            }, 300);
          }
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [choices, onSelect, allowRetry, isProcessing]);

  return (
    <div className="my-4 space-y-3">
      <div className="font-mono text-sm text-gray-400">
        <span className="text-gray-600">&gt;</span> {prompt}
      </div>
      
      <div className="space-y-2">
        {choices.map((choice) => {
          const isSelected = selectedKey === choice.key;
          const isHovered = hoveredKey === choice.key;
          const baseColor = choice.color || 'text-cyan-400';
          
          return (
            <motion.button
              key={choice.key}
              onClick={() => {
                if (!isProcessing) {
                  setSelectedKey(choice.key);
                  setIsProcessing(true);
                  setTimeout(() => {
                    onSelect(choice.key);
                    // Reset for retry if allowed
                    if (allowRetry) {
                      setTimeout(() => {
                        setSelectedKey(null);
                        setIsProcessing(false);
                      }, 300);
                    }
                  }, 300);
                }
              }}
              onMouseEnter={() => setHoveredKey(choice.key)}
              onMouseLeave={() => setHoveredKey(null)}
              disabled={isProcessing && !allowRetry}
              whileHover={{ x: 4 }}
              className={`w-full text-left font-mono text-sm transition-colors ${
                isSelected 
                  ? 'text-green-400' 
                  : isHovered
                  ? baseColor
                  : 'text-gray-400'
              }`}
            >
              <span className="mr-3 text-gray-600">[{choice.key}]</span>
              {choice.text}
              {isSelected && <span className="ml-2 text-green-400">✓</span>}
              {isHovered && !isSelected && <span className="ml-2">&lt;</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

