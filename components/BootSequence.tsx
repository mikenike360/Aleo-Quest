'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandLine, AsciiArt } from '@/components/Terminal';
import { TypewriterText } from '@/components/TypewriterText';

interface BootStep {
  text: string;
  delay: number;
  showCursor?: boolean;
  status?: 'loading' | 'ok' | 'error';
}

const bootSteps: BootStep[] = [
  { text: 'Initializing Aleo Quest...', delay: 500, status: 'loading' },
  { text: 'Loading modules...', delay: 800, status: 'loading' },
  { text: 'Loading modules... [OK]', delay: 200, status: 'ok' },
  { text: 'Mounting /learn...', delay: 600, status: 'loading' },
  { text: 'Mounting /learn... [OK]', delay: 200, status: 'ok' },
  { text: 'Mounting /quest...', delay: 500, status: 'loading' },
  { text: 'Mounting /quest... [OK]', delay: 200, status: 'ok' },
  { text: 'Initializing zero-knowledge protocols...', delay: 800, status: 'loading' },
  { text: 'Initializing zero-knowledge protocols... [OK]', delay: 300, status: 'ok' },
  { text: 'System ready.', delay: 400, status: 'ok' },
];


interface BootSequenceProps {
  onComplete: () => void;
  children?: React.ReactNode;
}

export function BootSequence({ onComplete, children }: BootSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    if (currentStep < bootSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, bootSteps[currentStep].delay);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        setShowLogo(true);
        setTimeout(onComplete, 1000);
      }, 500);
    }
  }, [currentStep, onComplete]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ok': return '✓';
      case 'error': return '✗';
      case 'loading': return '...';
      default: return '';
    }
  };

  return (
    <div className="min-h-[300px] space-y-6">
      {/* Logo Section */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >

          </motion.div>
        )}
      </AnimatePresence>

      {/* Boot Steps */}
      <div className="space-y-2">
        <div className="font-mono text-sm text-cyan-400 mb-4">
          <span className="text-gray-600">&gt;</span> Booting Aleo Quest...
        </div>
        
        {bootSteps.slice(0, currentStep + 1).map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="font-mono text-sm text-gray-600">&gt;</span>
            <span className={`font-mono text-sm ${getStatusColor(step.status)}`}>
              {step.text}
            </span>
            {step.status === 'loading' && index === currentStep && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-yellow-400"
              >
                ...
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Children content (progress widget, etc.) */}
      {isComplete && children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
