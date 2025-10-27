'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type QuestStage } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TerminalPanel, TerminalProgress, TerminalText, TerminalStatus, TerminalButton } from '@/components/zkVisuals';
import { Terminal } from '@/components/Terminal';
import { TerminalNarrator, TerminalPrompt } from '@/components/TerminalNarrator';
import { StoryQuest } from './StoryQuest';
import { QuestProgressTracker } from '@/components/QuestProgressTracker';
import { CharacterSheet } from '@/components/CharacterSheet';
import { useSoundManager } from '@/lib/audio';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { trackPageview, trackEvent } from '@/lib/analytics';
import { AleoLogo } from '@/components/AleoLogo';
import { TerminalBreadcrumb } from '@/components/TerminalBreadcrumb';

const stageOrder: QuestStage[] = ['locked-vault', 'truth-teller', 'hidden-key', 'private-marketplace', 'final-gate'];

const stageTitles: Record<QuestStage, string> = {
  'locked-vault': 'The Vault (Commitment)',
  'truth-teller': 'The Proof (Zero-Knowledge)',
  'hidden-key': 'The Choice (Selective Disclosure)',
  'private-marketplace': 'The Market (Private Payment)',
  'final-gate': 'The Final Gate (Composition)',
  'completed': 'Quest Complete'
};

function getStageTitle(stage: QuestStage): string {
  return stageTitles[stage] || stage;
}

function getTerminalColor(stage: QuestStage): 'blue' | 'purple' | 'green' | 'yellow' {
  return 'green';
}

const getStageCompletionMessage = (stage: QuestStage) => {
  const messages = {
    'locked-vault': "Vault Unlocked! You've learned commitment schemes.",
    'truth-teller': "Truth Revealed! Zero-knowledge proofs mastered.",
    'hidden-key': "Key Obtained! Selective disclosure understood.",
    'private-marketplace': "Market Access! Private payments learned.",
    'final-gate': "Gate Opened! Proof composition mastered.",
    'completed': "Quest Complete! All stages mastered."
  };
  return messages[stage] || "Stage completed!";
};

export default function QuestPage() {
  const questStage = useAppStore((state) => state.questStage);
  const questData = useAppStore((state) => state.questData);
  const completedQuestStages = useAppStore((state) => state.completedQuestStages);
  const badges = useAppStore((state) => state.badges);
  const setQuestStage = useAppStore((state) => state.setQuestStage);
  const setQuestData = useAppStore((state) => state.setQuestData);
  const completeQuestStage = useAppStore((state) => state.completeQuestStage);
  const addBadge = useAppStore((state) => state.addBadge);
  const resetQuest = useAppStore((state) => state.resetQuest);

  const [initialized, setInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStageTransition, setShowStageTransition] = useState(false);
  const [nextStage, setNextStage] = useState<QuestStage | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);

  const soundManager = useSoundManager();
  const isAudioMuted = useAppStore((state) => state.isAudioMuted);

  useEffect(() => {
    trackPageview('/quest');
  }, []);

  useEffect(() => {
    if (questStage && questStage !== 'completed') {
      soundManager.playQuestAmbient(questStage);
    }
  }, [questStage, soundManager]);


  const handleInitializeClick = () => {
    if (!initialized) {
      setInitialized(true);
      trackEvent('quest_initialized');
    }
  };

  useEffect(() => {
    if (showStageTransition) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleAdvanceToNextStage();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showStageTransition]);

  const handleReset = () => {
    resetQuest();
    setShowResetDialog(false);
    trackEvent('quest_reset');
  };

  const handleAdvanceToNextStage = () => {
    if (nextStage) {
      setQuestStage(nextStage);
      setShowStageTransition(false);
      setNextStage(null);
    }
  };

  const handleStageComplete = async (data?: any) => {
    setIsProcessing(true);
    
    // Store quest data if provided
    if (data) {
      setQuestData(data);
    }
    
    // Mark current stage as completed
    completeQuestStage(questStage);
    
    // Add appropriate badge
    const badgeMap: Record<QuestStage, string> = {
      'locked-vault': 'Vault Keeper',
      'truth-teller': 'Proof Guardian', 
      'hidden-key': 'Key Master',
      'private-marketplace': 'Market Merchant',
      'final-gate': 'Gate Keeper',
      'completed': 'Quest Master'
    };
    
    if (badgeMap[questStage]) {
      addBadge(badgeMap[questStage]);
      soundManager.playLevelUpSound();
    }
    
    // Determine next stage
    const currentIndex = stageOrder.indexOf(questStage);
    const nextStageIndex = currentIndex + 1;
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (nextStageIndex < stageOrder.length) {
        // More stages to go
        const nextStage = stageOrder[nextStageIndex];
        setNextStage(nextStage);
        soundManager.playTransitionSound();
        setShowStageTransition(true);
      } else {
        // Quest complete
        setQuestStage('completed');
      }
    }, 1500);
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Terminal title="aleo-quest" glow="green" showCRT>
          <div className="space-y-6">


            {/* Header - Terminal Title Bar Style */}
            <div className="border-2 border-green-500/50 bg-black/90 rounded-t-lg">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border-b-2 border-green-500/30">
                <div className="flex gap-1">

                </div>
                <div className="flex-1 text-center">
                  <AleoLogo colorScheme="green" size="small" />
                  <TerminalBreadcrumb currentPage="quest" colorScheme="green" />
                </div>
              </div>
              <div className="px-2 sm:px-4 py-2 font-mono text-xs text-gray-400 text-center">
                &gt; An educational journey through zero-knowledge_
              </div>
              {/* Action Buttons - under the title */}
              <div className="px-4 py-2 border-t border-green-500/20">
                <div className="flex justify-end gap-2">
                  {/* Mute Button */}
                  <button 
                    onClick={() => {
                      soundManager.toggleMute();
                      soundManager.playClickSound();
                    }}
                    className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                  >
                    [{isAudioMuted ? 'UNMUTE' : 'MUTE'}]
                  </button>

                  {/* Reset Button */}
                  <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                    <DialogTrigger asChild>
                      <button className="font-mono text-xs px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all">
                        [RESET]
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-2 border-green-500 text-green-400 font-mono">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-green-400">[RESET QUEST]</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Are you sure you want to reset your quest progress? This will clear all your badges and start over.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowResetDialog(false)} className="border-green-500 text-green-400 hover:bg-green-500/10 font-mono">
                          [CANCEL]
                        </Button>
                        <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white font-mono">
                          [RESET QUEST]
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Quest Progress Tracker */}
            <QuestProgressTracker 
              currentStage={questStage}
              completedStages={completedQuestStages}
              badges={badges}
              onStageSelect={setQuestStage}
            />

            {/* Badges Display - Terminal Style */}
            {badges.length > 0 && (
              <div className="border-2 border-green-500 bg-black/90 p-4">
                <div className="font-mono text-sm text-green-400 mb-3">
                  ┌─ EARNED BADGES ─┐
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge}
                      className="border-2 border-green-400 bg-green-500/10 px-3 py-1 text-xs font-mono text-green-400"
                    >
                      [{badge}]
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Character Sheet */}
            {showCharacterSheet && (
              <CharacterSheet 
                currentStage={questStage}
                badges={badges}
                completedStages={completedQuestStages}
              />
            )}

            {/* Content */}
            {!initialized ? (
              <div className="space-y-4">
                <TerminalPanel title="INITIALIZATION REQUIRED">
                  <TerminalText className="text-center">

                    <div className="flex justify-center">
                      <TerminalButton 
                        onClick={handleInitializeClick}
                        className="px-8 py-4 text-lg"
                      >
                        START ALEO QUEST
                      </TerminalButton>
                    </div>
                  </TerminalText>
                </TerminalPanel>
              </div>
            ) : isProcessing ? (
              <div className="space-y-4">
                <TerminalPanel title="PROCESSING...">
                  <TerminalProgress value={50} max={100} />
                  <TerminalText>
                    <p className="text-gray-300">
                      Processing your proof... This may take a moment.
                    </p>
                  </TerminalText>
                </TerminalPanel>
              </div>
            ) : showStageTransition ? (
              <div className="space-y-4">
                <TerminalPanel title="STAGE TRANSITION">
                  <TerminalText>
                    <div className="text-center space-y-4">
                      <p className="text-green-400 text-lg font-bold">
                        {getStageCompletionMessage(questStage)}
                      </p>
                      <p className="text-gray-300">
                        Quest Progress: {Math.round((badges.length / 5) * 100)}% ({badges.length}/5 stages)
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        Press ENTER or click to continue...
                      </p>
                      <TerminalButton onClick={handleAdvanceToNextStage}>
                        ADVANCE TO {getStageTitle(nextStage!).toUpperCase()}
                      </TerminalButton>
                    </div>
                  </TerminalText>
                </TerminalPanel>
              </div>
            ) : questStage === 'completed' ? (
              <div className="space-y-4">
                <TerminalPanel >
                  <div className="text-center space-y-6">
                    <motion.img
                      src="/aleo-quest-images/quest_complete.png"
                      alt="Quest Complete"
                      className="w-full max-w-[576px] h-auto object-contain mx-auto"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <TerminalButton onClick={() => setQuestStage('locked-vault')}>
                        RESTART QUEST
                      </TerminalButton>
                      <TerminalButton onClick={() => setShowResetDialog(true)}>
                        RESET PROGRESS
                      </TerminalButton>
                    </div>
                  </div>
                </TerminalPanel>
              </div>
            ) : (
              <StoryQuest 
                stage={questStage}
                onComplete={handleStageComplete}
              />
            )}

            {/* Audio */}
            {/* QuestAudio removed - using SoundManager for ambient music */}
          </div>
        </Terminal>
      </div>
    </div>
  );
}