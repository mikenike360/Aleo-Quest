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
import { InteractiveTerminal } from '@/components/InteractiveTerminal';

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
    
    // Cleanup: Stop ambient music when component unmounts or questStage changes
    return () => {
      soundManager.stopAmbient();
    };
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
              <div className="flex items-center gap-2 px-0 sm:px-3 py-2 border-b-2 border-green-500/30">
                <div className="flex gap-1">

                </div>
                <div className="flex-1 text-center">
                  <AleoLogo colorScheme="green" size="small" />
                  <TerminalBreadcrumb currentPage="quest" colorScheme="green" />
                </div>
                <div className="ml-auto pr-2">
                  <button 
                    onClick={() => {
                      soundManager.toggleMute();
                      soundManager.playClickSound();
                    }}
                    className="font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 border-2 border-gray-700 bg-black/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all"
                  >
                    [{isAudioMuted ? 'UNMUTE' : 'MUTE'}]
                  </button>
                </div>
              </div>
              <div className="px-2 sm:px-4 py-2 font-mono text-xs text-gray-400 text-center">
                &gt; An educational journey through zero-knowledge_
              </div>
              {/* Action Buttons - under the title */}
              <div className="px-4 py-2 border-t border-green-500/20">
                <div className="flex justify-between items-center gap-4">
                  {/* Interactive Terminal - Left side */}
                  <div className="flex-1 min-w-0">
                    <InteractiveTerminal />
                  </div>
                  
                  {/* Buttons - Right side */}
                  <div className="flex gap-2 shrink-0">
                    {/* Right-side actions (none now) */}
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Progress Tracker */}
            <QuestProgressTracker 
              currentStage={questStage}
              completedStages={completedQuestStages}
              badges={badges}
              onStageSelect={setQuestStage}
              onReset={() => setShowResetDialog(true)}
            />

            {/* Reset Dialog (opened from QuestProgressTracker onReset) */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
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
                <TerminalPanel title="INITIALIZATION_REQUIRED" colorScheme="green">
                  <TerminalText colorScheme="green" className="text-center">

                    <div className="flex justify-center">
                      <TerminalButton 
                        onClick={handleInitializeClick}
                        className="px-8 py-4 text-lg"
                        colorScheme="green"
                      >
                        START ALEO QUEST
                      </TerminalButton>
                    </div>
                  </TerminalText>
                </TerminalPanel>
              </div>
            ) : isProcessing ? (
              <div className="space-y-4">
                <TerminalPanel title="PROCESSING..." colorScheme="green">
                  <div className="space-y-4">
                    <TerminalProgress value={50} max={100} colorScheme="green" />
                    <TerminalText colorScheme="green">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">&gt;</span>
                        <p className="text-gray-300">
                          Processing your proof... This may take a moment.
                        </p>
                      </div>
                    </TerminalText>
                  </div>
                </TerminalPanel>
              </div>
            ) : showStageTransition ? (
              <div className="space-y-4">
                <TerminalPanel title="STAGE_COMPLETE" colorScheme="green">
                  <TerminalText colorScheme="green">
                    <div className="space-y-6">
                      {/* ASCII Success Banner */}
                      <div className="text-center font-mono text-green-400">
                        <pre className="text-xs leading-tight">
{`╔════════════════════════════════╗
║    STAGE COMPLETED ✓           ║
╚════════════════════════════════╝`}
                        </pre>
                      </div>
                      
                      {/* Status Message */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-green-400">&gt;</span>
                          <p className="text-green-400 text-lg font-bold">
                            {getStageCompletionMessage(questStage)}
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="text-green-400">&gt;</span>
                          <p className="text-gray-300">
                            Progress: {Math.round((badges.length / 5) * 100)}% | Stages: {badges.length}/5
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                          <span>[</span>
                          <div className="flex-1 h-2 bg-gray-800 rounded-sm overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-500"
                              style={{ width: `${Math.round((badges.length / 5) * 100)}%` }}
                            />
                          </div>
                          <span>]</span>
                        </div>
                      </div>
                      
                      {/* Action Prompt */}
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-4 font-mono">
                          Press ENTER or click to continue...
                        </p>
                        <TerminalButton 
                          onClick={handleAdvanceToNextStage}
                          colorScheme="green"
                        >
                          ADVANCE TO {getStageTitle(nextStage!).toUpperCase()} →
                        </TerminalButton>
                      </div>
                    </div>
                  </TerminalText>
                </TerminalPanel>
              </div>
            ) : questStage === 'completed' ? (
              <div className="space-y-4">
                <TerminalPanel colorScheme="green">
                  <div className="text-center space-y-6">
                    {/* ASCII Banner */}
                    <div className="font-mono text-green-400">
                      <pre className="text-sm leading-tight">
{`╔═══════════════════════════════════╗
║   QUEST COMPLETE - ALL STAGES ✓   ║
╚═══════════════════════════════════╝`}
                      </pre>
                    </div>
                    
                    <motion.img
                      src="/aleo-quest-images/quest_complete.png"
                      alt="Quest Complete"
                      className="w-full max-w-[576px] h-auto object-contain mx-auto"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <TerminalButton 
                        onClick={() => setQuestStage('locked-vault')}
                        colorScheme="green"
                      >
                        RESTART QUEST
                      </TerminalButton>
                      <TerminalButton 
                        onClick={() => setShowResetDialog(true)}
                        colorScheme="green"
                      >
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