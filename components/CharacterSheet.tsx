'use client';

import { motion } from 'framer-motion';
import { TerminalText } from '@/components/zkVisuals/TerminalTheme';
import { type QuestStage } from '@/lib/store';

interface CharacterStats {
  level: number;
  title: string;
  location: string;
  progress: number;
  skills: {
    commitments: number;
    proofs: number;
    privacy: number;
    payments: number;
    composition: number;
  };
  inventory: string[];
  badges: string[];
  experience: number;
}

interface CharacterSheetProps {
  currentStage: QuestStage;
  badges: string[];
  completedStages: QuestStage[];
  className?: string;
}

export function CharacterSheet({ currentStage, badges, completedStages, className = '' }: CharacterSheetProps) {
  // Calculate character stats
  const level = Math.max(1, Math.floor(badges.length / 2) + 1);
  const progress = Math.round((badges.length / 5) * 100);
  
  const titles: Record<string, string> = {
    'Vault Locked': 'Vault Master',
    'Truth Teller': 'Proof Sage', 
    'Key Finder': 'Privacy Guardian',
    'Merchant': 'Commerce Keeper',
    'ZK Master': 'Cryptographic Master'
  };
  
  const currentTitle = badges.length > 0 ? 
    titles[badges[badges.length - 1]] || 'ZK Apprentice' : 
    'ZK Apprentice';
    
  const stageNames: Record<QuestStage, string> = {
    'locked-vault': 'The Ancient Vault Chamber',
    'truth-teller': 'The Mathematical Proof Chamber',
    'hidden-key': 'The Three Doors Hall', 
    'private-marketplace': 'The Private Marketplace',
    'final-gate': 'The Final Gate',
    'completed': 'The Hall of Mastery'
  };

  // Calculate skill levels based on badges
  const skills = {
    commitments: badges.includes('Vault Locked') ? 80 : 0,
    proofs: badges.includes('Truth Teller') ? 80 : 0,
    privacy: badges.includes('Key Finder') ? 80 : 0,
    payments: badges.includes('Merchant') ? 80 : 0,
    composition: badges.includes('ZK Master') ? 80 : 0
  };

  // Generate inventory based on badges
  const inventory: string[] = [];
  if (badges.includes('Vault Locked')) {
    inventory.push('Commitment Hash - Seals secrets cryptographically');
  }
  if (badges.includes('Truth Teller')) {
    inventory.push('Proof Generator - Creates zero-knowledge proofs');
  }
  if (badges.includes('Key Finder')) {
    inventory.push('Privacy Lens - Reveals selective disclosure');
  }
  if (badges.includes('Merchant')) {
    inventory.push('Payment Proof - Validates transactions privately');
  }
  if (badges.includes('ZK Master')) {
    inventory.push('Proof Combiner - Merges multiple proofs');
  }

  const getSkillBar = (value: number) => {
    const filled = Math.floor(value / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const getSkillLevel = (value: number) => {
    if (value === 0) return 'Locked';
    if (value >= 80) return 'Expert';
    if (value >= 60) return 'Advanced';
    if (value >= 40) return 'Intermediate';
    return 'Novice';
  };

  const getSkillColor = (value: number) => {
    if (value === 0) return 'text-gray-600';
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-mono text-sm ${className}`}
    >
      <div className="border-2 border-cyan-500/30 bg-black p-4 rounded-lg">
        <TerminalText colorScheme="cyan" variant="accent" className="text-base block mb-4">
          ALEO QUEST CHARACTER SHEET
        </TerminalText>
        
        {/* Character Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Name: ZK Apprentice
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Level: {level}
            </TerminalText>
          </div>
          <div>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Title: {currentTitle}
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Location: {stageNames[currentStage]}
            </TerminalText>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <TerminalText colorScheme="cyan" variant="accent" className="block mb-2">
            PROGRESS
          </TerminalText>
          <div className="space-y-1">
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Overall: {getSkillBar(progress)} {progress}% ({badges.length}/5 stages)
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              Knowledge: {badges.length > 0 ? 'Intermediate' : 'Novice'}
            </TerminalText>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <TerminalText colorScheme="cyan" variant="accent" className="block mb-2">
            SKILLS
          </TerminalText>
          <div className="space-y-1">
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              • Cryptographic Commitments: {getSkillBar(skills.commitments)} [{getSkillLevel(skills.commitments)}]
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              • Zero-Knowledge Proofs: {getSkillBar(skills.proofs)} [{getSkillLevel(skills.proofs)}]
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              • Privacy Techniques: {getSkillBar(skills.privacy)} [{getSkillLevel(skills.privacy)}]
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              • Private Payments: {getSkillBar(skills.payments)} [{getSkillLevel(skills.payments)}]
            </TerminalText>
            <TerminalText colorScheme="cyan" variant="primary" className="block">
              • Proof Composition: {getSkillBar(skills.composition)} [{getSkillLevel(skills.composition)}]
            </TerminalText>
          </div>
        </div>

        {/* Inventory Section */}
        {inventory.length > 0 && (
          <div className="mb-4">
            <TerminalText colorScheme="cyan" variant="accent" className="block mb-2">
              INVENTORY (Learned Concepts)
            </TerminalText>
            <div className="space-y-1">
              {inventory.map((item, index) => (
                <TerminalText key={index} colorScheme="cyan" variant="primary" className="block">
                  • {item}
                </TerminalText>
              ))}
            </div>
          </div>
        )}

        {/* Badges Section */}
        <div>
          <TerminalText colorScheme="cyan" variant="accent" className="block mb-2">
            BADGES & ACHIEVEMENTS
          </TerminalText>
          <div className="space-y-1">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <TerminalText key={index} colorScheme="cyan" variant="primary" className="block">
                  ⭐ [{badge}] - Earned
                </TerminalText>
              ))
            ) : (
              <TerminalText colorScheme="cyan" variant="muted" className="block">
                No badges earned yet
              </TerminalText>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Simplified version for terminal display
export function CharacterSheetTerminal({ currentStage, badges }: { currentStage: QuestStage; badges: string[] }) {
  const level = Math.max(1, Math.floor(badges.length / 2) + 1);
  const progress = Math.round((badges.length / 5) * 100);
  
  const titles: Record<string, string> = {
    'Vault Locked': 'Vault Master',
    'Truth Teller': 'Proof Sage', 
    'Key Finder': 'Privacy Guardian',
    'Merchant': 'Commerce Keeper',
    'ZK Master': 'Cryptographic Master'
  };
  
  const currentTitle = badges.length > 0 ? 
    titles[badges[badges.length - 1]] || 'ZK Apprentice' : 
    'ZK Apprentice';
    
  const stageNames: Record<QuestStage, string> = {
    'locked-vault': 'The Ancient Vault Chamber',
    'truth-teller': 'The Mathematical Proof Chamber',
    'hidden-key': 'The Three Doors Hall', 
    'private-marketplace': 'The Private Marketplace',
    'final-gate': 'The Final Gate',
    'completed': 'The Hall of Mastery'
  };

  const getSkillBar = (hasBadge: boolean) => {
    return hasBadge ? '████████░░ Expert' : '░░░░░░░░░░ Locked';
  };

  return `┌─ ALEO QUEST CHARACTER SHEET ──────────────────────────────┐
│ Name: ZK Apprentice                  Level: ${level}
│ Title: ${currentTitle.padEnd(30)}
│ Location: ${stageNames[currentStage].padEnd(30)}
├───────────────────────────────────────────────────────────┤
│ PROGRESS
│ Overall: ${'█'.repeat(Math.floor(badges.length * 2))}${'░'.repeat(10 - Math.floor(badges.length * 2))} ${progress}% (${badges.length}/5 stages)
│ Knowledge: ${badges.length > 0 ? 'Intermediate' : 'Novice'}
├───────────────────────────────────────────────────────────┤
│ SKILLS
│ • Cryptographic Commitments: ${getSkillBar(badges.includes('Vault Locked'))}
│ • Zero-Knowledge Proofs: ${getSkillBar(badges.includes('Truth Teller'))}
│ • Privacy Techniques: ${getSkillBar(badges.includes('Key Finder'))}
│ • Private Payments: ${getSkillBar(badges.includes('Merchant'))}
│ • Proof Composition: ${getSkillBar(badges.includes('ZK Master'))}
├───────────────────────────────────────────────────────────┤
│ BADGES & ACHIEVEMENTS
${badges.length > 0 ? badges.map(badge => `│ ⭐ [${badge}] - Earned`).join('\n') : '│ No badges earned yet'}
└───────────────────────────────────────────────────────────┘`;
}
