'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSoundManager } from '@/lib/audio';
import { 
  ZKCircuit, 
  proofCombinerCircuit, 
  ProofBadge,
  CelebrationParticles,
  TerminalPanel,
  TerminalButton,
  TerminalText,
  TerminalStatus,
  ASCII_ART
} from '@/components/zkVisuals';

interface Proof {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface ProofCombinerProps {
  proofsTocombine: string[];
  onCombinationComplete: (combinedProofs: string[]) => void;
}

const availableProofs: Proof[] = [
  {
    id: 'vault-commitment',
    name: 'Vault Commitment',
    color: 'purple',
    description: 'Sealed secret proof'
  },
  {
    id: 'length-proof',
    name: 'Length Proof',
    color: 'blue',
    description: 'Length ≥ 6 characters'
  },
  {
    id: 'age-range-proof',
    name: 'Age Range Proof',
    color: 'yellow',
    description: 'Age ≥ 18 verification'
  },
  {
    id: 'payment-proof',
    name: 'Payment Proof',
    color: 'green',
    description: 'Private payment verification'
  }
];

export default function ProofCombiner({ proofsTocombine, onCombinationComplete }: ProofCombinerProps) {
  const [availableProofList, setAvailableProofList] = useState<Proof[]>(availableProofs);
  const [combinedProofs, setCombinedProofs] = useState<Proof[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showCircuit, setShowCircuit] = useState(false);
  const [circuitStep, setCircuitStep] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const soundManager = useSoundManager();

  const handleProofClick = (proofId: string) => {
    if (isComplete) return;
    
    const proof = availableProofList.find(p => p.id === proofId);
    if (proof && !combinedProofs.find(p => p.id === proofId)) {
      setAvailableProofList(availableProofList.filter(p => p.id !== proofId));
      setCombinedProofs([...combinedProofs, proof]);
      soundManager.playDiscoverySound();
      
      // Check if all proofs are combined
      if (combinedProofs.length + 1 === availableProofs.length) {
        setIsComplete(true);
        setShowCircuit(true);
        soundManager.playSuccessSound();
        
        // Animate circuit steps - FASTER
        const steps = [1, 2, 3, 4, 5];
        steps.forEach((step, index) => {
          setTimeout(() => {
            setCircuitStep(step);
          }, index * 400); // Faster animation
        });
        
        // Show continue button after circuit animation
        setTimeout(() => {
          setShowContinueButton(true);
        }, steps.length * 400 + 500); // Faster
      }
    }
  };

  const handleContinueToNextStage = () => {
    onCombinationComplete(combinedProofs.map(p => p.id));
  };

  const getProofType = (id: string) => {
    switch (id) {
      case 'vault-commitment': return 'vault';
      case 'length-proof': return 'length';
      case 'age-range-proof': return 'age';
      case 'payment-proof': return 'payment';
      default: return 'vault';
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Proof Combiner - Transforms */}
      <TerminalPanel colorScheme="mixed" title="PROOF_COMBINER">
        <div className="space-y-3">
          {!showContinueButton ? (
            <>
              {/* Instructions */}
              <TerminalText colorScheme="mixed" variant="accent" className="text-sm">
                COMBINE_PROOFS: Click all 4 proofs to add them to the combination circle
              </TerminalText>
              
              {/* Compact Horizontal Layout */}
              <div className="flex items-center justify-between gap-4">
                {/* Available Proofs - Horizontal */}
                <div className="flex flex-wrap gap-1">
                  {availableProofList.map((proof) => (
                    <motion.div
                      key={proof.id}
                      onClick={() => handleProofClick(proof.id)}
                      className="flex items-center space-x-1 px-2 py-1 border border-blue-500 bg-blue-500/10 text-blue-400 cursor-pointer hover:border-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all font-mono text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xs">[P]</span>
                      <span>{proof.name}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Separator */}
                <TerminalText colorScheme="mixed" variant="muted" className="text-xs">
                  →
                </TerminalText>
                
                {/* Combination Circle - Compact */}
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-dashed border-purple-500 flex items-center justify-center bg-purple-500/5">
                    {combinedProofs.length === 0 ? (
                      <TerminalText colorScheme="mixed" variant="muted" className="text-xs text-center">
                        Click proofs
                      </TerminalText>
                    ) : (
                      <div className="grid grid-cols-2 gap-0.5">
                        {combinedProofs.map((proof, index) => (
                          <div
                            key={proof.id}
                            className="w-3 h-3 bg-purple-500 flex items-center justify-center text-xs font-mono text-white"
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress - Inline */}
              <div className="flex items-center justify-between text-xs">
                <TerminalText colorScheme="mixed" variant="muted">PROGRESS:</TerminalText>
                <TerminalText colorScheme="mixed" variant="accent">
                  {combinedProofs.length} / 4 proofs combined
                </TerminalText>
              </div>

              {/* Circuit Animation - Replace combination circle when active */}
              {showCircuit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <TerminalText colorScheme="mixed" variant="accent" className="text-sm text-center">
                    COMBINING_PROOFS: Circuit processing...
                  </TerminalText>
                  <div className="flex justify-center">
                    <ZKCircuit
                      circuit={proofCombinerCircuit}
                      step={circuitStep}
                      size="sm"
                    />
                  </div>
                  <div className="text-center">
                    <TerminalText colorScheme="mixed" variant="muted" className="text-xs">
                      Step {circuitStep} / 5
                    </TerminalText>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            /* Success State - Replace interactive content */
            <div className="space-y-3 text-center">
              <TerminalStatus status="success" className="text-center">
                ✓ ALL_PROOFS_COMBINED
              </TerminalStatus>
              <TerminalText colorScheme="mixed" variant="accent" className="text-center">
                Circuit verification complete! All proofs successfully combined.
              </TerminalText>
            </div>
          )}
        </div>
      </TerminalPanel>

      {/* Continue Button - Separate */}
      {showContinueButton && (
        <TerminalButton
          onClick={handleContinueToNextStage}
          colorScheme="mixed"
          command="continue_quest"
          className="w-full py-3 text-base"
        >
          CONTINUE TO COMPLETION →
        </TerminalButton>
      )}

      {/* Celebration Particles */}
      {isComplete && <CelebrationParticles />}
    </div>
  );
}