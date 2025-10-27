'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ZKCircuit, 
  proofBuilderCircuit, 
  PRIVACY_LEVELS,
  ProofBadge,
  SuccessParticles,
  TerminalPanel,
  TerminalButton,
  TerminalText,
  TerminalStatus,
  ASCII_ART
} from '@/components/zkVisuals';

interface PropertyOption {
  id: string;
  label: string;
  correct?: boolean;
}

interface PropertySelectorProps {
  maskedSecret: string;
  propertyOptions: PropertyOption[];
  onSelectionChange: (selectedIds: string[]) => void;
  onSubmit: (selectedIds: string[]) => void;
}

type ProofStep = 'commitment' | 'selection' | 'circuit' | 'result';

export function PropertySelector({ 
  maskedSecret, 
  propertyOptions, 
  onSelectionChange, 
  onSubmit 
}: PropertySelectorProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ProofStep>('selection');
  const [circuitStep, setCircuitStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handlePropertyToggle = (propertyId: string) => {
    const newSelection = selectedProperties.includes(propertyId)
      ? selectedProperties.filter(id => id !== propertyId)
      : [...selectedProperties, propertyId];
    
    setSelectedProperties(newSelection);
    onSelectionChange(newSelection);
  };

  const handleGenerateProof = () => {
    if (selectedProperties.length === 0) return;
    
    setCurrentStep('circuit');
    
    // Animate circuit steps
    const steps = [1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCircuitStep(step);
      }, index * 600);
    });
    
    // Show result after circuit completes
    setTimeout(() => {
      setCurrentStep('result');
      setShowResult(true);
    }, steps.length * 600 + 1000);
  };

  const handleComplete = () => {
    onSubmit(selectedProperties);
  };

  const isOverSharing = selectedProperties.length > 1;
  const hasCorrectSelection = selectedProperties.some(id => 
    propertyOptions.find(opt => opt.id === id)?.correct
  );

  const getDisclosureLevel = () => {
    if (selectedProperties.length === 0) return PRIVACY_LEVELS.VAULT_COMMITMENT;
    if (hasCorrectSelection && selectedProperties.length === 1) return PRIVACY_LEVELS.LENGTH_CHECK;
    if (isOverSharing) return PRIVACY_LEVELS.HIGH_DISCLOSURE;
    return PRIVACY_LEVELS.MODERATE_DISCLOSURE;
  };

  return (
    <div className="space-y-3">
      {/* Compact Property Selection */}
      <TerminalPanel colorScheme="green" title="PROPERTY_PROOF">
        <div className="space-y-3">
          {/* Selection Phase */}
          {currentStep === 'selection' && (
            <>
              {/* Commitment Badge - Inline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ProofBadge 
                    type="vault" 
                    label="Commitment" 
                    description="From Stage 1"
                    isVerified={true}
                    size="sm"
                  />
                  <TerminalText colorScheme="green" variant="primary" className="text-sm">
                    {maskedSecret}
                  </TerminalText>
                </div>
                <TerminalStatus status="ok" className="text-xs">
                  Ready
                </TerminalStatus>
              </div>

              {/* Property Selection - Compact */}
              <div className="space-y-3">
                <TerminalText colorScheme="green" variant="accent" className="text-sm">
                  SELECT_PROPERTY: Choose ONE property
                </TerminalText>
                
                <div className="space-y-2">
                  {propertyOptions.map((option) => {
                    const isSelected = selectedProperties.includes(option.id);
                    const isCorrect = option.correct;
                    
                    return (
                      <motion.div
                        key={option.id}
                        className={`
                          flex items-center space-x-3 p-3 sm:p-2 rounded border-2 cursor-pointer transition-all font-mono text-sm min-h-[44px]
                          ${isSelected 
                            ? isCorrect 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                          }
                        `}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handlePropertyToggle(option.id)}
                      >
                        <div className={`
                          w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center font-mono text-xs flex-shrink-0
                          ${isSelected 
                            ? isCorrect 
                              ? 'border-green-400 bg-green-400 text-black' 
                              : 'border-yellow-400 bg-yellow-400 text-black'
                            : 'border-gray-500 text-gray-500'
                          }
                        `}>
                          {isSelected ? 'X' : '[ ]'}
                        </div>
                        <TerminalText 
                          colorScheme="green" 
                          variant={isSelected ? (isCorrect ? "success" : "warning") : "muted"}
                          className="flex-1"
                        >
                          {option.label}
                        </TerminalText>
                        {isSelected && (
                          <TerminalText colorScheme="green" variant={isCorrect ? "success" : "warning"} className="text-xs">
                            {/* {isCorrect ? ASCII_ART.ok : '[WARN]'} */}
                          </TerminalText>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>


              {/* Feedback - Inline */}
              {selectedProperties.length > 0 && (
                <TerminalStatus 
                  status={isOverSharing ? "error" : hasCorrectSelection ? "ok" : "warning"}
                  className="text-sm"
                >
                  {isOverSharing 
                    ? 'Over-sharing detected! Share only what\'s necessary.'
                    : hasCorrectSelection
                      ? 'Perfect! Proving exactly what Guardian needs.'
                      : 'Selection Invalid.'
                  }
                </TerminalStatus>
              )}

              {/* Action Button */}
              <TerminalButton
                onClick={handleGenerateProof}
                disabled={selectedProperties.length === 0}
                colorScheme="green"
                command={selectedProperties.length > 0 ? "generate_proof --zk" : "select_property"}
                className="w-full py-3 text-base"
              >
                {selectedProperties.length > 0 ? 'GENERATE ZERO-KNOWLEDGE PROOF' : 'SELECT PROPERTY FIRST'}
              </TerminalButton>
            </>
          )}

          {/* Circuit Visualization - Transform in same panel */}
          {currentStep === 'circuit' && (
            <div className="space-y-3">
              <TerminalText colorScheme="green" variant="accent" className="text-sm">
                CIRCUIT_EXECUTION: Generating proof...
              </TerminalText>
              
              <div className="bg-black border border-green-500 rounded p-3">
                <div className="font-mono text-xs text-green-400 mb-2">
                  <pre>{ASCII_ART.circuit}</pre>
                </div>
                <ZKCircuit
                  nodes={proofBuilderCircuit.nodes}
                  connections={proofBuilderCircuit.connections}
                  activeStep={circuitStep}
                />
              </div>
              
              <div className="text-center">
                <TerminalText colorScheme="green" variant="accent" className="text-sm">
                  {circuitStep === 0 && 'STATUS: Preparing circuit...'}
                  {circuitStep === 1 && 'STATUS: Processing commitment...'}
                  {circuitStep === 2 && 'STATUS: Applying predicate...'}
                  {circuitStep === 3 && 'STATUS: Running ZK circuit...'}
                  {circuitStep === 4 && 'STATUS: Generating proof...'}
                </TerminalText>
              </div>
            </div>
          )}

          {/* Result - Transform in same panel */}
          {currentStep === 'result' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ProofBadge 
                    type="length" 
                    label="Length Proof" 
                    description="Generated successfully"
                    isVerified={true}
                    size="sm"
                  />
                  <TerminalStatus status="ok" className="text-base font-bold">
                    Proof generated successfully
                  </TerminalStatus>
                </div>
                <TerminalText colorScheme="green" variant="success" className="text-sm">
                  Length ≥ 6 characters = TRUE
                </TerminalText>
              </div>

              <div className="bg-black border border-green-500 rounded p-3">
                <TerminalText colorScheme="green" variant="muted" className="text-xs block mb-1">
                  GUARDIAN_KNOWLEDGE:
                </TerminalText>
                <div className="font-mono text-xs space-y-1">
                  <TerminalText colorScheme="green" variant="success" className="block">
                    ✓ Secret has ≥ 6 characters
                  </TerminalText>
                  <TerminalText colorScheme="green" variant="muted" className="block">
                    ✗ Secret content (hidden)
                  </TerminalText>
                  <TerminalText colorScheme="green" variant="muted" className="block">
                    ✗ Exact character count
                  </TerminalText>
                </div>
              </div>
              
              {/* Success particles */}
              {showResult && <SuccessParticles />}
            </div>
          )}
        </div>
      </TerminalPanel>

      {/* Continue Button - Separate from panel */}
      {currentStep === 'result' && (
        <TerminalButton
          onClick={handleComplete}
          colorScheme="green"
          command="continue_quest"
          className="w-full py-3 text-base"
        >
          CONTINUE TO CHOICE STAGE →
        </TerminalButton>
      )}
    </div>
  );
}