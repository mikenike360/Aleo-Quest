'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalNarratorProps {
  lines: string[];
  speed?: number;
  onComplete?: () => void;
  onHalfway?: () => void;
  onTrigger?: () => void;
  triggerText?: string;
  color?: string;
  showCursor?: boolean;
}

export function TerminalNarrator({ 
  lines, 
  speed = 30,
  onComplete,
  onHalfway,
  onTrigger,
  triggerText,
  color = 'text-green-400',
  showCursor = true
}: TerminalNarratorProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [halfwayTriggered, setHalfwayTriggered] = useState(false);
  const [triggerTriggered, setTriggerTriggered] = useState(false);

  // Reset trigger state when triggerText changes (new beat)
  useEffect(() => {
    setTriggerTriggered(false);
  }, [triggerText]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      if (!completed) {
        setCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }
      return;
    }

    const currentLine = lines[currentLineIndex];
    
    // Check if we're halfway through all text
    const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
    const currentTotalChars = lines.slice(0, currentLineIndex).reduce((acc, line) => acc + line.length, 0) + charIndex;
    
    if (!halfwayTriggered && onHalfway && currentTotalChars >= totalChars / 2) {
      setHalfwayTriggered(true);
      onHalfway();
    }
    
    // Check if trigger text has been reached
    const currentFullText = lines.slice(0, currentLineIndex).join(' ') + ' ' + currentText;
    if (!triggerTriggered && onTrigger && triggerText && currentFullText.toLowerCase().includes(triggerText.toLowerCase())) {
      setTriggerTriggered(true);
      onTrigger();
    }
    
    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentLine.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Line complete, move to next after small delay
      const timeout = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentText('');
        setCharIndex(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, charIndex, lines, speed, onComplete, onHalfway, onTrigger, triggerText, completed, halfwayTriggered, triggerTriggered]);

  return (
    <div className="space-y-1 font-mono text-sm">
      {lines.slice(0, currentLineIndex).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={color}
        >
          <span className="text-gray-600 mr-2">&gt;</span>
          {line}
        </motion.div>
      ))}
      {currentLineIndex < lines.length && (
        <div className={color}>
          <span className="text-gray-600 mr-2">&gt;</span>
          {currentText}
          {showCursor && charIndex < lines[currentLineIndex].length && (
            <span className="animate-pulse">_</span>
          )}
        </div>
      )}
    </div>
  );
}

interface TerminalPromptProps {
  text: string;
  onContinue?: () => void;
  requireEnter?: boolean;
}

export function TerminalPrompt({ text, onContinue, requireEnter = true }: TerminalPromptProps) {
  useEffect(() => {
    if (!requireEnter && onContinue) {
      const timeout = setTimeout(onContinue, 2000);
      return () => clearTimeout(timeout);
    }

    if (requireEnter && onContinue) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          onContinue();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [onContinue, requireEnter]);

  const handleClick = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="mt-4 text-center font-mono text-xs text-gray-500 cursor-pointer select-none"
      onClick={handleClick}
    >
      {text}
    </motion.div>
  );
}

