'use client';

import { motion } from 'framer-motion';

interface ProofBadgeProps {
  type: 'vault' | 'length' | 'age' | 'payment' | 'combined';
  label: string;
  description?: string;
  isVerified?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProofBadge({ 
  type, 
  label, 
  description, 
  isVerified = false, 
  isActive = false,
  size = 'md'
}: ProofBadgeProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'vault':
        return {
          color: '#8B5CF6', // purple
          bgColor: '#8B5CF610',
          borderColor: '#8B5CF650',
          icon: '🔒',
          name: 'Vault Commitment'
        };
      case 'length':
        return {
          color: '#3B82F6', // blue
          bgColor: '#3B82F610',
          borderColor: '#3B82F650',
          icon: '📏',
          name: 'Length Proof'
        };
      case 'age':
        return {
          color: '#EAB308', // yellow
          bgColor: '#EAB30810',
          borderColor: '#EAB30850',
          icon: '🎂',
          name: 'Age Range Proof'
        };
      case 'payment':
        return {
          color: '#10B981', // green
          bgColor: '#10B98110',
          borderColor: '#10B98150',
          icon: '💰',
          name: 'Payment Proof'
        };
      case 'combined':
        return {
          color: '#06B6D4', // cyan
          bgColor: '#06B6D410',
          borderColor: '#06B6D450',
          icon: '🔮',
          name: 'Combined Proof'
        };
      default:
        return {
          color: '#6B7280', // gray
          bgColor: '#6B728010',
          borderColor: '#6B728050',
          icon: '❓',
          name: 'Unknown Proof'
        };
    }
  };

  const config = getTypeConfig(type);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <motion.div
      className={`
        rounded-lg border-2 font-mono font-medium transition-all
        ${sizeClasses[size]}
        ${isActive 
          ? `border-${config.color.replace('#', '')} bg-${config.color.replace('#', '')}10 shadow-lg shadow-${config.color.replace('#', '')}30`
          : `border-gray-600 bg-gray-800/30`
        }
        ${isVerified ? 'ring-2 ring-green-500/50' : ''}
      `}
      style={{
        borderColor: isActive ? config.color : undefined,
        backgroundColor: isActive ? config.bgColor : undefined,
        color: isActive ? config.color : '#9CA3AF'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isActive ? 1.05 : 1,
        opacity: isActive ? 1 : 0.8
      }}
    >
      <div className="flex items-center space-x-2">
        <motion.span
          className="text-lg"
          animate={{ 
            rotate: isVerified ? 360 : 0,
            scale: isActive ? 1.2 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          {config.icon}
        </motion.span>
        
        <div className="flex-1">
          <div className="font-bold">{label}</div>
          {description && (
            <div className="text-xs opacity-75 mt-1">
              {description}
            </div>
          )}
        </div>

        {isVerified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400"
          >
            ✓
          </motion.div>
        )}
      </div>

      {/* Glow effect for active badges */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${config.color}20 0%, transparent 70%)`
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
}

// Predefined proof badges for common use cases
export const PROOF_BADGES = {
  VAULT_COMMITMENT: {
    type: 'vault' as const,
    label: 'Vault Commitment',
    description: 'Sealed secret proof'
  },
  LENGTH_PROOF: {
    type: 'length' as const,
    label: 'Length Proof',
    description: 'Length ≥ 6 characters'
  },
  AGE_RANGE_PROOF: {
    type: 'age' as const,
    label: 'Age Range Proof',
    description: 'Age ≥ 18 verification'
  },
  PAYMENT_PROOF: {
    type: 'payment' as const,
    label: 'Payment Proof',
    description: 'Private payment valid'
  },
  COMBINED_PROOF: {
    type: 'combined' as const,
    label: 'Combined Proof',
    description: 'All proofs unified'
  }
} as const;
