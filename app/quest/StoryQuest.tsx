'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TerminalNarrator, TerminalPrompt } from '@/components/TerminalNarrator';
import { ASCIIAnimator } from '@/components/ASCIIAnimator';
import { KeyboardChoice } from '@/components/KeyboardChoice';
import { TerminalInput } from '@/components/TerminalInput';
import { TerminalScroll } from '@/components/TerminalScroll';
import { QuestImage } from '@/components/QuestImage';
import { PropertySelector } from '@/components/PropertySelector';
import { RangeProofInput } from '@/components/RangeProofInput';
import { CoinPayment } from '@/components/CoinPayment';
import ProofCombiner from '@/components/ProofCombiner';
import { SecretSealer } from '@/components/SecretSealer';
import { StageBackdrop } from '@/components/StageBackdrop';
import { QuestTerminal } from '@/components/QuestTerminal';
import { questStories, type StoryBeat } from '@/lib/quest-story';
import { useAppStore } from '@/lib/store';
import { trackEvent } from '@/lib/analytics';
import { useSoundManager } from '@/lib/audio';

interface StoryQuestProps {
  stage: string;
  onComplete: (data?: any) => void;
}

export function StoryQuest({ stage, onComplete }: StoryQuestProps) {
  const story = questStories[stage as keyof typeof questStories];
  const [beatIndex, setBeatIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [triggerText, setTriggerText] = useState<string | undefined>(undefined);
  const [triggeredForCurrentBeat, setTriggeredForCurrentBeat] = useState(false);
  const [currentNPC, setCurrentNPC] = useState<string | null>(null);

  // Store state for quest interactions
  const { questInteractions, setQuestInteractions } = useAppStore();
  const soundManager = useSoundManager();

  if (!story) return null;

  const currentBeat = story.beats[beatIndex];
  const isLastBeat = beatIndex >= story.beats.length - 1;

  // Update NPC when beat changes
  useEffect(() => {
    if (currentBeat.type === 'npc' && currentBeat.npcName) {
      setCurrentNPC(currentBeat.npcName);
    } else if (currentBeat.type === 'narration' && beatIndex === 0) {
      // Clear NPC at the start of new narration beats
      setCurrentNPC(null);
    }
  }, [currentBeat, beatIndex]);

  const handleNarrationComplete = () => {
    setShowPrompt(true);
  };

  const handleNarrationTrigger = () => {
    if (!triggeredForCurrentBeat) {
      setShowImage(true);
      setTriggeredForCurrentBeat(true);
    }
  };



  const handleContinue = () => {
    if (isLastBeat) {
      // Pass appropriate data based on stage type
      let completionData: any = undefined;
      
      if (stage === 'locked-vault') {
        completionData = questInteractions.userSecret ? { secret: questInteractions.userSecret } : undefined;
      } else if (stage === 'truth-teller') {
        completionData = { selectedProperties: questInteractions.selectedProperties };
      } else if (stage === 'hidden-key') {
        completionData = { userAge: questInteractions.userAge };
      } else if (stage === 'private-marketplace') {
        completionData = { paymentAmount: questInteractions.paymentAmount };
      } else if (stage === 'final-gate') {
        completionData = { combinedProofs: questInteractions.combinedProofs };
      }
      
      soundManager.playSuccessSound();
      onComplete(completionData);
    } else {
      setBeatIndex(beatIndex + 1);
      setShowPrompt(false);
      setFeedback(null);
      setAnimationComplete(false);
      setShowImage(false);
      setTriggerText(undefined);
      setTriggeredForCurrentBeat(false);
    }
  };

  const handleAnimationComplete = () => {
    console.log('Animation completed, setting animationComplete to true');
    setAnimationComplete(true);
    setShowPrompt(true);
  };

  // Fallback timeout for animation completion
  useEffect(() => {
    if (currentBeat.type === 'animation') {
      if (currentBeat.animation) {
        // Text animation - calculate duration based on frames
        const expectedDuration = (currentBeat.animation.length - 1) * 500 + 800; // frames * frameRate + pauseOnComplete
        const timeout = setTimeout(() => {
          console.log('Animation timeout fallback triggered');
          setAnimationComplete(true);
          setShowPrompt(true);
        }, expectedDuration + 1000); // Add 1 second buffer
        
        return () => clearTimeout(timeout);
      } else {
        // No animation content - show prompt immediately
        setShowPrompt(true);
      }
    }
  }, [currentBeat]);

  const handleChoice = (key: string) => {
    const choice = currentBeat.choices?.find(c => c.key === key);
    if (!choice) return;

    if (choice.correct === false) {
      setFeedback(choice.feedback || 'Try again!');
      trackEvent('quest_wrong_answer', { stage, choice: key });
      // Don't advance - let them try again
    } else {
      setFeedback(choice.feedback || 'Correct!');
      trackEvent('quest_correct_answer', { stage, choice: key });
      setTimeout(handleContinue, 1500);
    }
  };

  const handleInput = (value: string) => {
    setInputValue(value);
    // Store the secret in quest interactions for Stage 1
    if (stage === 'locked-vault') {
      setQuestInteractions({ userSecret: value });
    }
    handleContinue();
  };

  const handleSecretSealed = (secret: string) => {
    setQuestInteractions({ userSecret: secret });
    handleContinue();
  };

  // New handlers for interactive beat types
  const handlePropertySelection = (selectedIds: string[]) => {
    setQuestInteractions({ selectedProperties: selectedIds });
    handleContinue();
  };

  const handleRangeProofGenerated = (age: number) => {
    setQuestInteractions({ userAge: age });
    handleContinue();
  };

  const handleCoinPaymentComplete = (paymentAmount: number) => {
    setQuestInteractions({ paymentAmount });
    handleContinue();
  };

  const handleProofCombinationComplete = (combinedProofs: string[]) => {
    setQuestInteractions({ combinedProofs });
    handleContinue();
  };

  return (
    <div className="relative">
      {/* Stage backdrop with NPC overlay */}
      <StageBackdrop 
        stage={stage} 
        npcName={currentNPC}
        backdropOpacity={0.2} // Better visibility while maintaining readability
        npcOpacity={0.8}
      />
      
      {/* Content on top */}
      <TerminalScroll>
        <div className="relative z-10 space-y-6 flex flex-col p-4">
          {/* Content in terminal window */}
          <QuestTerminal>
        {/* Render current beat */}
        {currentBeat.type === 'narration' && (
          <div className="flex-1">
            <TerminalNarrator
              lines={Array.isArray(currentBeat.content) ? currentBeat.content : [currentBeat.content || '']}
              onComplete={handleNarrationComplete}
              onTrigger={handleNarrationTrigger}
            />
          </div>
        )}

        {currentBeat.type === 'npc' && (
          <div className="flex-1">
            <div className="space-y-1 font-mono text-sm">
              <div className="text-green-400 font-bold">
                <span className="text-gray-600">&gt;</span> {currentBeat.npcName}:
              </div>
            </div>
            <TerminalNarrator
              lines={Array.isArray(currentBeat.content) ? currentBeat.content : [currentBeat.content || '']}
              color="text-green-400"
              onComplete={handleNarrationComplete}
              onTrigger={handleNarrationTrigger}
            />
          </div>
        )}

        {currentBeat.type === 'choice' && (
          <>
            {typeof currentBeat.content === 'string' && (
              <div className="font-mono text-sm text-gray-400 mb-2">
                <span className="text-gray-600">&gt;</span> {currentBeat.content}
              </div>
            )}
            <KeyboardChoice
              choices={currentBeat.choices || []}
              onSelect={handleChoice}
            />
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-mono text-sm p-3 rounded-lg border ${
                  feedback.includes('Correct') || feedback.includes('Excellent')
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-yellow-500/50 bg-yellow-500/10 text-green-400'
                }`}
              >
                <span className="text-gray-600">&gt;</span> {feedback}
              </motion.div>
            )}
          </>
        )}

        {currentBeat.type === 'input' && (
          <>
            {typeof currentBeat.content === 'string' && (
              <div className="font-mono text-sm text-gray-400 mb-4">
                <span className="text-gray-600">&gt;</span> {currentBeat.content}
              </div>
            )}
            <TerminalInput
              placeholder={currentBeat.inputPrompt || 'Enter your secret...'}
              onSubmit={handleInput}
              minLength={currentBeat.inputMinLength || 6}
            />
          </>
        )}

        {currentBeat.type === 'animation' && (
          <>
            {currentBeat.content && (
              <div className="font-mono text-sm text-gray-400 mb-4">
                {Array.isArray(currentBeat.content) ? (
                  currentBeat.content.map((line, index) => (
                    <div key={index}>
                      <span className="text-gray-600">&gt;</span> {line}
                    </div>
                  ))
                ) : (
                  <div>
                    <span className="text-gray-600">&gt;</span> {currentBeat.content}
                  </div>
                )}
              </div>
            )}
            
            {/* Text animation */}
            {currentBeat.animation ? (
              <>
                {!animationComplete ? (
                  <ASCIIAnimator
                    frames={currentBeat.animation}
                    frameRate={500}
                    onComplete={handleAnimationComplete}
                    pauseOnComplete={800}
                  />
                ) : (
                  <div className="font-mono text-sm text-green-400 mb-4">
                    <span className="text-gray-600">&gt;</span> Animation complete!
                  </div>
                )}
              </>
            ) : (
              <div className="font-mono text-sm text-green-400 mb-4">
                <span className="text-gray-600">&gt;</span> Processing...
              </div>
            )}
          </>
        )}

        {currentBeat.type === 'success' && (
          <>
            <div className="flex-1">
              <TerminalNarrator
                lines={Array.isArray(currentBeat.content) ? currentBeat.content : [currentBeat.content || '']}
                color="text-green-400"
                onComplete={handleNarrationComplete}
                onTrigger={handleNarrationTrigger}
              />
            </div>
            
          </>
        )}

        {/* New interactive beat types */}
        {currentBeat.type === 'secret-sealer' && (
          <div className="flex-1">
            <SecretSealer
              prompt={currentBeat.inputPrompt || 'What is your secret?'}
              minLength={currentBeat.inputMinLength || 6}
              onSecretSealed={handleSecretSealed}
            />
          </div>
        )}

        {currentBeat.type === 'property-selector' && (
          <div className="flex-1">
            <PropertySelector
              maskedSecret={questInteractions.userSecret ? '******' : '******'}
              propertyOptions={currentBeat.propertyOptions || []}
              onSelectionChange={() => {}}
              onSubmit={handlePropertySelection}
            />
          </div>
        )}

        {currentBeat.type === 'range-proof-input' && (
          <div className="flex-1">
            <RangeProofInput
              prompt={currentBeat.inputPrompt || 'Enter your age (this will remain private)'}
              config={currentBeat.rangeProofConfig || { min: 1, max: 120, threshold: 18 }}
              onProofGenerated={handleRangeProofGenerated}
            />
          </div>
        )}

        {currentBeat.type === 'coin-payment' && (
          <div className="flex-1">
            <CoinPayment
              config={currentBeat.coinPaymentConfig || { totalGold: 500, requiredAmount: 100 }}
              onPaymentComplete={handleCoinPaymentComplete}
            />
          </div>
        )}

        {currentBeat.type === 'proof-combiner' && (
          <div className="flex-1">
            <ProofCombiner
              proofsTocombine={currentBeat.proofsTocombine || ['vault-commitment', 'length-proof', 'age-range-proof', 'payment-proof']}
              onCombinationComplete={handleProofCombinationComplete}
            />
          </div>
        )}
          </QuestTerminal>
        
          {/* Continue prompt - always at bottom center */}
          {showPrompt && (
            <div className="flex justify-center mt-auto pt-4">
              <TerminalPrompt 
                text={isLastBeat ? "[Press ENTER or CLICK to complete stage]" : "[Press ENTER or CLICK to continue]"} 
                onContinue={handleContinue} 
              />
            </div>
          )}
        </div>
      </TerminalScroll>
    </div>
  );
}