'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundManager } from '@/lib/audio';
import { 
  SuccessParticles, 
  PRIVACY_LEVELS,
  TerminalPanel,
  TerminalInput,
  TerminalButton,
  TerminalText,
  TerminalStatus,
  ASCII_ART,
  type TerminalColorScheme
} from '@/components/zkVisuals';

interface SecretSealerProps {
  prompt: string;
  minLength: number;
  onSecretSealed: (secret: string) => void;
}

export function SecretSealer({ prompt, minLength, onSecretSealed }: SecretSealerProps) {
  const [secret, setSecret] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [isReadyToSeal, setIsReadyToSeal] = useState(false);
  const [vaultRotation, setVaultRotation] = useState(0);
  const [runeProgress, setRuneProgress] = useState(0);
  const soundManager = useSoundManager();
  const [magicalAura, setMagicalAura] = useState(false);
  const [selectedRunes, setSelectedRunes] = useState<string[]>([]);
  const vaultRef = useRef<HTMLDivElement>(null);

  const isValid = secret.length >= minLength;
  const canSeal = isValid && !isSealing && !isSealed;
  const canContinue = isValid && !isSealing && !isSealed && !isReadyToSeal;

  // Terminal symbols that appear as you type
  const terminalSymbols = ['#', '*', '+', '>', '<', '|', '-', '=', '@', '%'];

  const handleContinue = () => {
    if (!canContinue) return;
    setIsReadyToSeal(true);
  };

  const handleSealSecret = async () => {
    if (!canSeal) return;
    
    setIsSealing(true);
    setMagicalAura(true);
    
    // Animate vault rotation and rune activation
    for (let i = 0; i < 360; i += 10) {
      setVaultRotation(i);
      setRuneProgress(i / 3.6); // Convert to percentage
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setIsSealing(false);
    setIsSealed(true);
    soundManager.playSuccessSound();
    setMagicalAura(false);
  };

  const handleContinueToNextStage = () => {
    onSecretSealed(secret);
  };

  const handleSecretChange = (value: string) => {
    if (!isSealed) {
      setSecret(value);
      setIsReadyToSeal(false); // Reset ready state when secret changes
      
      // Generate terminal symbols based on input
      const newSymbols = [];
      for (let i = 0; i < Math.min(value.length, 10); i++) {
        newSymbols.push(terminalSymbols[i % terminalSymbols.length]);
      }
      setSelectedRunes(newSymbols);
    }
  };

  const getDisclosureLevel = () => {
    if (!secret) return PRIVACY_LEVELS.VAULT_COMMITMENT;
    if (secret.length < minLength) return PRIVACY_LEVELS.MODERATE_DISCLOSURE;
    return PRIVACY_LEVELS.VAULT_COMMITMENT; // Sealed secret has perfect privacy
  };

  return (
    <div className="space-y-3">
      {/* Compact Vault Commit Interface */}
      <TerminalPanel colorScheme="cyan" title="VAULT_COMMIT">
        <div className="space-y-3">
          {/* Inline Vault and Input */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Smaller vault icon */}
            <motion.div
              ref={vaultRef}
              className="relative w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-lg flex items-center justify-center cursor-pointer bg-black flex-shrink-0"
              style={{ 
                transform: `rotate(${vaultRotation}deg)`,
                borderColor: magicalAura ? '#22D3EE' : isSealed ? '#10B981' : '#06B6D4'
              }}
              animate={{
                boxShadow: magicalAura 
                  ? ['0 0 30px #22D3EE', '0 0 60px #22D3EE', '0 0 30px #22D3EE']
                  : isSealed 
                    ? ['0 0 20px #10B981', '0 0 40px #10B981', '0 0 20px #10B981']
                    : ['0 0 10px #06B6D4', '0 0 20px #06B6D4', '0 0 10px #06B6D4']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Terminal symbols around the vault */}
              <div className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-100">
                {selectedRunes.map((symbol, index) => {
                  const angle = (index * 360) / selectedRunes.length;
                  // Responsive radius: Mobile: 48px box uses ~15px radius, Desktop: 64px box uses ~20px radius
                  const radius = 20;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute font-mono text-xs"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        color: '#22D3EE'
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {symbol}
                    </motion.div>
                  );
                })}
              </div>

              {/* ASCII Vault */}
              <div className="font-mono text-xs text-center" style={{ color: '#06B6D4' }}>
                🔒
              </div>
              
              {/* Lock status */}
              <motion.div 
                className="absolute -top-1 -right-1 font-mono text-xs px-1 py-0.5 rounded border text-xs"
                style={{ 
                  backgroundColor: isSealed ? '#10B981' : '#EF4444',
                  color: '#FFFFFF',
                  borderColor: isSealed ? '#10B981' : '#EF4444'
                }}
                animate={isSealing ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isSealing ? Infinity : 0 }}
              >
                {isSealed ? '✓' : '○'}
              </motion.div>

              {/* Terminal aura effect */}
              {magicalAura && (
                <motion.div
                  className="absolute inset-0 border-2 rounded-lg"
                  style={{ borderColor: '#22D3EE' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0.6 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.div>

            {/* Input field */}
            <div className="flex-1 w-full min-w-0">
              <TerminalInput
                value={secret}
                onChange={handleSecretChange}
                disabled={isSealing || isSealed}
                placeholder="Enter secret phrase..."
                colorScheme="cyan"
                prompt=">"
                className="w-full"
              />
            </div>
          </div>

          {/* Status - Inline */}
          <div className="flex items-center space-x-4 text-xs">
            <TerminalText 
              colorScheme="cyan" 
              variant={secret.length >= minLength ? "success" : "muted"} 
              className="text-xs"
            >
              LENGTH: {secret.length}/{minLength}
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="muted" className="text-xs">
              STATUS: {isSealed ? 'COMMITTED' : 'READY'}
            </TerminalText>
          </div>

          {/* Progress indicator - Compact */}
          {isSealing && (
            <div className="space-y-2">
              <TerminalText colorScheme="cyan" variant="accent" className="text-xs">
                PROCESSING: {Math.round(runeProgress)}%
              </TerminalText>
              <div className="w-full bg-gray-800 rounded-full h-1 border">
                <motion.div
                  className="h-1 rounded-full"
                  style={{ backgroundColor: '#06B6D4' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${runeProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Validation Feedback - Inline */}
          {secret.length > 0 && !isReadyToSeal && (
            <TerminalStatus 
              status={isValid ? "ok" : "error"}
              className="text-sm"
            >
              {isValid 
                ? `Secret strength: ${secret.length} characters`
                : `Required: ${minLength - secret.length} more characters`
              }
            </TerminalStatus>
          )}

          {/* Secret Confirmation - Compact */}
          {isReadyToSeal && (
            <div className="p-3 border rounded bg-gray-900" style={{ borderColor: '#06B6D4' }}>
              <div className="space-y-2">
                <TerminalText colorScheme="cyan" variant="accent" className="text-sm font-bold">
                  SECRET READY FOR COMMIT
                </TerminalText>
                
                <div className="bg-black p-2 rounded border" style={{ borderColor: '#06B6D4' }}>
                  <TerminalText colorScheme="cyan" variant="primary" className="text-sm">
                    "{secret}"
                  </TerminalText>
                  <TerminalText colorScheme="cyan" variant="muted" className="text-xs">
                    STRENGTH: {secret.length} characters
                  </TerminalText>
                </div>
              </div>
            </div>
          )}

          {/* Sealed Result - Compact */}
          {isSealed && (
            <div className="space-y-2">
              <TerminalStatus status="ok" className="text-base font-bold">
                Secret committed to vault successfully
              </TerminalStatus>
              <TerminalText colorScheme="cyan" variant="muted" className="text-sm">
                Hash: {secret.split('').map(() => '#').join('')}
              </TerminalText>
              <SuccessParticles />
            </div>
          )}
        </div>
      </TerminalPanel>

      {/* Horizontal Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isSealed && (
          <TerminalButton
            onClick={isReadyToSeal ? handleSealSecret : handleContinue}
            disabled={!canSeal && !canContinue}
            colorScheme="cyan"
            command={isReadyToSeal ? "seal_secret --commit" : "continue"}
            className="flex-1 py-3 text-base"
          >
            {isSealing 
              ? 'PROCESSING...' 
              : isReadyToSeal 
                ? 'COMMIT TO VAULT'
                : 'CONTINUE'
            }
          </TerminalButton>
        )}
        
        {isSealed && (
          <TerminalButton
            onClick={handleContinueToNextStage}
            colorScheme="cyan"
            command="continue_quest"
            className="flex-1 py-3 text-base"
          >
            CONTINUE TO PROOF STAGE →
          </TerminalButton>
        )}
      </div>
    </div>
  );
}
