'use client';

import { motion } from 'framer-motion';

interface PrivacyMeterProps {
  disclosureLevel: number; // 0-100, where 0 = completely private, 100 = fully revealed
  label?: string;
  showDetails?: boolean;
}

export function PrivacyMeter({ disclosureLevel, label = "Privacy Level", showDetails = false }: PrivacyMeterProps) {
  const getColor = (level: number) => {
    if (level <= 20) return '#10B981'; // green - very private
    if (level <= 40) return '#3B82F6'; // blue - private
    if (level <= 60) return '#EAB308'; // yellow - moderate disclosure
    if (level <= 80) return '#F59E0B'; // orange - high disclosure
    return '#EF4444'; // red - very high disclosure
  };

  const getStatus = (level: number) => {
    if (level <= 20) return 'Excellent Privacy';
    if (level <= 40) return 'Good Privacy';
    if (level <= 60) return 'Moderate Disclosure';
    if (level <= 80) return 'High Disclosure';
    return 'Very High Disclosure';
  };

  const color = getColor(disclosureLevel);
  const status = getStatus(disclosureLevel);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-gray-400">{label}</span>
        <span className="font-mono text-xs text-gray-500">{disclosureLevel}%</span>
      </div>
      
      <div className="relative">
        {/* Background bar */}
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
          
          {/* Active fill */}
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${disclosureLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        
        {/* Privacy zones */}
        <div className="flex justify-between mt-1">
          <span className="font-mono text-xs text-green-400">Private</span>
          <span className="font-mono text-xs text-yellow-400">Moderate</span>
          <span className="font-mono text-xs text-red-400">Revealed</span>
        </div>
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-2 rounded-lg border text-center`}
        style={{ 
          borderColor: color,
          backgroundColor: `${color}10`
        }}
      >
        <div className="font-mono text-sm" style={{ color }}>
          {status}
        </div>
      </motion.div>

      {/* Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 space-y-1"
        >
          <div>• Lower values = better privacy</div>
          <div>• Higher values = more information revealed</div>
          <div>• Aim for minimal disclosure</div>
        </motion.div>
      )}
    </div>
  );
}

// Predefined privacy levels for common scenarios
export const PRIVACY_LEVELS = {
  VAULT_COMMITMENT: 0,      // Sealed secret - no information revealed
  LENGTH_CHECK: 5,          // Only reveals length ≥ 6, not the actual value
  AGE_RANGE: 10,            // Only reveals age ≥ 18, not exact age
  PAYMENT_PROOF: 15,        // Only reveals can afford, not balance
  MINIMAL_DISCLOSURE: 20,   // Good privacy practice
  MODERATE_DISCLOSURE: 50,  // Some information leaked
  HIGH_DISCLOSURE: 80,      // Significant information revealed
  FULL_DISCLOSURE: 100      // Everything revealed
} as const;
