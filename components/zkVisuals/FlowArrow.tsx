'use client';

import { motion } from 'framer-motion';

interface FlowArrowProps {
  direction: 'left' | 'right' | 'up' | 'down';
  isActive?: boolean;
  delay?: number;
  duration?: number;
  color?: string;
  label?: string;
}

export function FlowArrow({ 
  direction, 
  isActive = false, 
  delay = 0,
  duration = 1,
  color = '#3B82F6',
  label 
}: FlowArrowProps) {
  const getArrowPath = () => {
    const size = 24;
    switch (direction) {
      case 'right':
        return `M 0 0 L ${size} ${size/2} L 0 ${size} Z`;
      case 'left':
        return `M ${size} 0 L 0 ${size/2} L ${size} ${size} Z`;
      case 'up':
        return `M 0 ${size} L ${size/2} 0 L ${size} ${size} Z`;
      case 'down':
        return `M 0 0 L ${size/2} ${size} L ${size} 0 Z`;
      default:
        return `M 0 0 L ${size} ${size/2} L 0 ${size} Z`;
    }
  };

  const getTransform = () => {
    switch (direction) {
      case 'right':
        return { rotate: 0 };
      case 'left':
        return { rotate: 180 };
      case 'up':
        return { rotate: -90 };
      case 'down':
        return { rotate: 90 };
      default:
        return { rotate: 0 };
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.8
      }}
      transition={{ 
        duration: 0.3,
        delay,
        ease: 'easeOut'
      }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color }}
        animate={{
          x: direction === 'right' ? [0, 4, 0] : 
             direction === 'left' ? [0, -4, 0] :
             direction === 'up' ? [0, 0, -4] :
             direction === 'down' ? [0, 0, 4] : [0, 0, 0],
        }}
        transition={{
          duration: duration,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        <motion.path
          d={getArrowPath()}
          fill="currentColor"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ 
            duration: 0.5,
            delay: delay + 0.2,
            ease: 'easeOut'
          }}
        />
      </motion.svg>
      
      {label && (
        <motion.div
          className="font-mono text-xs text-gray-400 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isActive ? 1 : 0.3,
            y: 0
          }}
          transition={{ 
            duration: 0.3,
            delay: delay + 0.4
          }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}

// Predefined flow configurations
export const FLOW_PATTERNS = {
  PROOF_BUILDER: [
    { direction: 'right' as const, label: 'Commitment', delay: 0 },
    { direction: 'right' as const, label: 'Predicate', delay: 0.5 },
    { direction: 'right' as const, label: 'Circuit', delay: 1.0 },
    { direction: 'right' as const, label: 'Result', delay: 1.5 }
  ],
  PROOF_COMBINER: [
    { direction: 'right' as const, label: 'Vault', delay: 0 },
    { direction: 'down' as const, label: 'Length', delay: 0.2 },
    { direction: 'down' as const, label: 'Age', delay: 0.4 },
    { direction: 'right' as const, label: 'Payment', delay: 0.6 },
    { direction: 'right' as const, label: 'Combined', delay: 1.0 }
  ],
  PAYMENT_FLOW: [
    { direction: 'down' as const, label: 'Wallet', delay: 0 },
    { direction: 'right' as const, label: 'Payment', delay: 0.3 },
    { direction: 'down' as const, label: 'Merchant', delay: 0.6 }
  ]
} as const;
