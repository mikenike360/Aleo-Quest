'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ color = 'bg-cyan-500', size = 'md' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`rounded-full ${color} ${sizeClasses[size]}`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

interface ScanningLineProps {
  duration?: number;
}

export function ScanningLine({ duration = 2 }: ScanningLineProps) {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-800">
      <motion.div
        className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        animate={{ x: ['-100%', '300%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

