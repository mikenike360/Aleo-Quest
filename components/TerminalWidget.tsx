'use client';

import { motion } from 'framer-motion';

interface TerminalWidgetProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  colorScheme?: 'cyan' | 'green' | 'purple' | 'yellow';
}

export function TerminalWidget({ title, children, className = '', colorScheme = 'green' }: TerminalWidgetProps) {
  const colorClasses = {
    cyan: 'border-cyan-500/30 shadow-cyan-500/5 text-cyan-400',
    green: 'border-green-500/30 shadow-green-500/5 text-green-400',
    purple: 'border-purple-500/30 shadow-purple-500/5 text-purple-400',
    yellow: 'border-yellow-500/30 shadow-yellow-500/5 text-yellow-400',
  };

  const [borderClass, shadowClass, textClass] = colorClasses[colorScheme].split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-xl border bg-gray-900/80 backdrop-blur-sm shadow-lg ${borderClass} ${shadowClass} ${className}`}
    >
      {title && (
        <div className="border-b border-gray-800/90 px-5 py-3">
          <div className={`font-mono text-xs ${textClass}`}>
            {title}
          </div>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}

