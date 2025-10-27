import { type QuestStage } from './store';
import { getLocationDescription, getObjectDescription, getNPCDescription } from './locations';
import { CharacterSheetTerminal } from '@/components/CharacterSheet';

// MUD-style command handlers
export interface MudCommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string, context: CommandContext) => string | Promise<string>;
}

export interface CommandContext {
  currentStage: QuestStage;
  badges: string[];
  completedStages: QuestStage[];
  questData: any;
  inventory: string[];
}

// Generate inventory based on completed stages and badges
const generateInventory = (context: CommandContext): string[] => {
  const inventory: string[] = [];
  
  if (context.badges.includes('Vault Locked')) {
    inventory.push('Commitment Hash - Seals secrets cryptographically');
  }
  if (context.badges.includes('Truth Teller')) {
    inventory.push('Proof Generator - Creates zero-knowledge proofs');
  }
  if (context.badges.includes('Key Finder')) {
    inventory.push('Privacy Lens - Reveals selective disclosure');
  }
  if (context.badges.includes('Merchant')) {
    inventory.push('Payment Proof - Validates transactions privately');
  }
  if (context.badges.includes('ZK Master')) {
    inventory.push('Proof Combiner - Merges multiple proofs');
  }
  
  return inventory;
};

// Location descriptions are now handled by the locations.ts file

// Object descriptions for examination
const objectDescriptions: Record<string, Record<string, string>> = {
  'locked-vault': {
    vault: `The vault door towers above you, its surface a living canvas of 
cryptographic runes. Each symbol pulses with mathematical energy, 
representing a different aspect of commitment schemes. The door 
demands a secret to be sealed within—a commitment that proves 
knowledge without revealing the knowledge itself.`,
    
    keeper: `The Vault Keeper's eyes glow with ancient wisdom, their form 
shrouded in shadows and starlight. They speak of the art of 
the seal—the fundamental principle that one can prove knowledge 
of something without revealing what that something is.`,
    
    runes: `The runes pulse with mathematical energy. Each symbol represents 
a cryptographic commitment, a way to lock away information 
while still proving that the information exists. They teach 
the first pillar: hiding information while proving it exists.`,
    
    commitment: `A cryptographic commitment is like a magical seal—it proves 
you know something without revealing what it is. Think of it 
as putting a message in a locked box. The box proves something 
exists inside, but no one can peek at the contents.`
  },

  'truth-teller': {
    guardian: `The Guardian of Truth stands before you, their staff pulsing 
with energy. They are the keeper of the second pillar: proving 
facts without revealing values. They test your understanding 
of zero-knowledge proofs.`,
    
    equations: `The floating equations represent different aspects of zero-knowledge 
proofs. Each formula teaches how to verify statements without 
revealing the underlying data. They dance with the energy 
of mathematical truth.`,
    
    formulas: `These mathematical formulas are the building blocks of zero-knowledge 
proofs. They show how to construct arguments that convince 
verifiers of truth without revealing secrets.`,
    
    proof_generator: `The proof generator is a mystical device that takes your 
commitment and creates a zero-knowledge proof. It demonstrates 
how to prove properties about hidden information without 
revealing the information itself.`
  },

  'hidden-key': {
    door_a: `Door A glows with a soft blue light. It asks only for age 
verification—a simple yes or no. This door represents the 
wisdom of minimal disclosure, asking only what is necessary.`,
    
    door_b: `Door B pulses with a harsh red light. It demands full identity 
verification—everything about who you are. This door represents 
excessive disclosure, asking for more than necessary.`,
    
    door_c: `Door C shimmers with a complex purple light. It demands both 
age and identity verification. This door represents the 
greed of over-disclosure, combining multiple requirements.`,
    
    key_master: `The Key Master is a cloaked figure radiating ancient wisdom. 
They teach the third pillar: selective disclosure—the art 
of revealing only what is absolutely necessary.`,
    
    wisdom: `The wisdom of the Key Master flows through the hall, teaching 
that a wise traveler reveals only what is required. In the 
real world, you should never hand over your entire wallet 
when someone just needs to know you're old enough.`
  },

  'private-marketplace': {
    merchant: `The Merchant is a mysterious figure who trades in complete 
privacy. They demonstrate the fourth pillar: private 
transactions where no one can track your balance or 
spending habits.`,
    
    mystery_box: `The Mystery Box costs 100 gold, but the transaction happens 
in complete privacy. You prove you can afford it without 
revealing your actual balance. This is the magic of 
private payments.`,
    
    gold: `Your gold remains hidden during transactions. You can prove 
you have enough without revealing how much you actually 
have. This is the power of zero-knowledge in commerce.`,
    
    privacy_magic: `The privacy magic flows through the marketplace, ensuring 
that all transactions remain private. No one can see 
your balance, track your spending, or monitor your 
financial activities.`
  },

  'final-gate': {
    final_gate: `The Final Gate is the ultimate test of your knowledge. It 
demands mastery of all five pillars: commitment, proof, 
disclosure, privacy, and composition. Only those who 
understand the complete spectrum of zero-knowledge may pass.`,
    
    gate_keeper: `The Gate Keeper is a towering figure with ultimate authority 
over the realm of zero-knowledge. They test your ability 
to combine all your learned knowledge into unified proofs.`,
    
    ancient_symbols: `The ancient symbols on the gate represent the five pillars 
of zero-knowledge cryptography. They pulse with the energy 
of complete understanding, demanding mastery of all aspects.`,
    
    mastery: `The mastery required here is the ability to combine multiple 
proofs into unified statements. This is the final pillar: 
proof composition—weaving together different cryptographic 
elements into coherent wholes.`
  }
};

// Concept explanations for study command
const conceptExplanations: Record<string, string> = {
  commitment: `A cryptographic commitment is a way to "seal" a value without 
revealing it. Think of it like putting a message in a 
locked box and showing someone the box. They can see 
the box exists and that something is inside, but they 
cannot see what's actually in the box.

In cryptography, commitments are used to:
- Prove you know something without revealing what it is
- Create binding promises that can be verified later
- Build more complex cryptographic protocols

The commitment scheme has two phases:
1. Commit: Lock away your secret value
2. Reveal: Open the commitment and show the original value

This is the foundation of zero-knowledge proofs.`,

  'zero-knowledge': `Zero-knowledge proofs allow you to prove you know something 
without revealing what you know. It's like proving you 
can solve a puzzle without showing the solution.

The three properties of zero-knowledge proofs are:
1. Completeness: If the statement is true, the verifier 
   will be convinced
2. Soundness: If the statement is false, the verifier 
   will reject the proof
3. Zero-knowledge: The verifier learns nothing beyond 
   the truth of the statement

This enables private verification of claims without 
compromising the underlying secrets.`,

  'selective-disclosure': `Selective disclosure is the principle of revealing only 
the minimum amount of information necessary to achieve 
a goal. It's about being wise with your privacy.

Examples:
- Proving you're over 18 without revealing your exact age
- Proving you have enough money without showing your balance
- Proving you're qualified without revealing all your credentials

The goal is to share only what is absolutely required,
keeping everything else private. This is essential for
maintaining privacy in digital systems.`,

  'private-payments': `Private payments allow you to make transactions without 
revealing your balance or spending patterns. You can 
prove you have enough funds without showing how much 
you actually have.

Key benefits:
- Privacy: No one can track your spending
- Security: Your balance remains hidden
- Efficiency: Transactions are fast and verifiable
- Trust: Recipients know payment is valid

This technology enables truly private commerce where
your financial information stays yours.`,

  'proof-composition': `Proof composition is the ability to combine multiple 
proofs into unified statements. Instead of proving 
things separately, you can prove complex relationships
all at once.

Benefits:
- Efficiency: One proof instead of many
- Consistency: All proofs are verified together
- Security: No gaps between separate proofs
- Power: Enables complex cryptographic protocols

This is the advanced skill that ties everything together,
allowing you to build sophisticated zero-knowledge systems.`
};

export const mudCommands: MudCommand[] = [
  {
    name: 'look',
    description: 'Describe the current location or examine an object',
    usage: 'look [object]',
    handler: (args: string, context: CommandContext) => {
      if (!args.trim()) {
        return getLocationDescription(context.currentStage);
      }
      
      // Try to get object or NPC description
      const objectDesc = getObjectDescription(context.currentStage, args);
      if (objectDesc && !objectDesc.includes("You don't see")) {
        return objectDesc;
      }
      
      const npcDesc = getNPCDescription(context.currentStage, args);
      if (npcDesc && !npcDesc.includes("You don't see")) {
        return npcDesc;
      }
      
      return `You don't see a "${args}" here. Try looking around to see what's available.`;
    }
  },

  {
    name: 'examine',
    description: 'Get detailed information about a concept or object',
    usage: 'examine <concept>',
    handler: (args: string, context: CommandContext) => {
      const concept = args.toLowerCase().replace(/\s+/g, '-');
      
      if (conceptExplanations[concept]) {
        return conceptExplanations[concept];
      }
      
      // Try looking in current stage objects
      const stageObjects = objectDescriptions[context.currentStage];
      if (stageObjects && stageObjects[concept]) {
        return stageObjects[concept];
      }
      
      return `You don't recognize "${args}". Available concepts: commitment, zero-knowledge, selective-disclosure, private-payments, proof-composition`;
    }
  },

  {
    name: 'inventory',
    description: 'Show your learned concepts and tools',
    usage: 'inventory',
    handler: (args: string, context: CommandContext) => {
      const inventory = generateInventory(context);
      
      if (inventory.length === 0) {
        return `Your inventory is empty. Complete quest stages to learn new concepts and tools.`;
      }
      
      return `INVENTORY (Learned Concepts):
${inventory.map(item => `• ${item}`).join('\n')}

You have ${inventory.length} concept(s) in your inventory.`;
    }
  },

  {
    name: 'study',
    description: 'Deep dive into a cryptographic concept',
    usage: 'study <concept>',
    handler: (args: string, context: CommandContext) => {
      const concept = args.toLowerCase().replace(/\s+/g, '-');
      
      if (conceptExplanations[concept]) {
        return `STUDYING: ${args.toUpperCase()}\n\n${conceptExplanations[concept]}\n\n[Study complete. Your understanding deepens.]`;
      }
      
      return `You cannot study "${args}". Available concepts: commitment, zero-knowledge, selective-disclosure, private-payments, proof-composition`;
    }
  },

  {
    name: 'where',
    description: 'Show your current location and progress',
    usage: 'where',
    handler: (args: string, context: CommandContext) => {
      const stageNames: Record<QuestStage, string> = {
        'locked-vault': 'The Ancient Vault Chamber',
        'truth-teller': 'The Mathematical Proof Chamber', 
        'hidden-key': 'The Three Doors Hall',
        'private-marketplace': 'The Private Marketplace',
        'final-gate': 'The Final Gate',
        'completed': 'The Hall of Mastery'
      };
      
      return `Current Location: ${stageNames[context.currentStage]}
Progress: ${context.badges.length}/5 stages completed
Badges: ${context.badges.length > 0 ? context.badges.join(', ') : 'None earned yet'}`;
    }
  },

  {
    name: 'status',
    description: 'Show your character sheet and progress',
    usage: 'status',
    handler: (args: string, context: CommandContext) => {
      return CharacterSheetTerminal(context.currentStage, context.badges);
    }
  },

  {
    name: 'badges',
    description: 'List all earned badges with descriptions',
    usage: 'badges',
    handler: (args: string, context: CommandContext) => {
      const badgeDescriptions: Record<string, string> = {
        'Vault Locked': 'Mastered cryptographic commitments - the art of sealing secrets',
        'Truth Teller': 'Generated your first zero-knowledge proof',
        'Key Finder': 'Understood selective disclosure - revealing only what\'s necessary',
        'Merchant': 'Completed private payment transactions',
        'ZK Master': 'Mastered all five pillars of zero-knowledge cryptography'
      };
      
      if (context.badges.length === 0) {
        return `You haven't earned any badges yet. Complete quest stages to earn badges and unlock new knowledge.`;
      }
      
      return `BADGES EARNED:
${context.badges.map(badge => `⭐ [${badge}] - ${badgeDescriptions[badge] || 'Achievement earned'}`).join('\n')}

You have earned ${context.badges.length} out of 5 possible badges.`;
    }
  },

  {
    name: 'say',
    description: 'Your character speaks (adds flavor text)',
    usage: 'say <message>',
    handler: (args: string, context: CommandContext) => {
      if (!args.trim()) {
        return 'Usage: say <message>\nExample: say "I understand commitments now!"';
      }
      
      return `You say: "${args}"\n\nThe words echo through the ${locationDescriptions[context.currentStage].split('\n')[1].replace('LOCATION: ', '')}, carrying your voice into the mystical realm of zero-knowledge cryptography.`;
    }
  },

  {
    name: 'think',
    description: 'Internal monologue about concepts',
    usage: 'think about <topic>',
    handler: (args: string, context: CommandContext) => {
      if (!args.trim()) {
        return 'Usage: think about <topic>\nExample: think about commitments';
      }
      
      return `You think about "${args}"...\n\nYour mind turns over the concepts you've learned, connecting the dots between cryptographic principles and their real-world applications. The understanding deepens as you ponder the mysteries of zero-knowledge.`;
    }
  },

  {
    name: 'ponder',
    description: 'Reflect deeply on a concept',
    usage: 'ponder <concept>',
    handler: (args: string, context: CommandContext) => {
      if (!args.trim()) {
        return 'Usage: ponder <concept>\nExample: ponder privacy';
      }
      
      return `You ponder "${args}" deeply...\n\nAs you reflect on this concept, new connections form in your mind. The implications become clearer, and you gain a deeper appreciation for how this principle applies to the broader world of cryptography and privacy.`;
    }
  }
];

export function getMudCommandHelp(): string {
  return `MUD-STYLE COMMANDS AVAILABLE:

Exploration:
  look [object]    - Describe current location or examine object
  examine <concept> - Get detailed info about cryptographic concepts
  where           - Show current location and progress

Learning:
  study <concept> - Deep dive into a topic with extra lore
  inventory       - Show learned concepts as "items"
  status          - Display RPG-style character sheet
  badges          - List earned badges with descriptions

Immersive:
  say <message>   - Character speaks (adds flavor text)
  think about <topic> - Internal monologue about concepts
  ponder <concept> - Reflect on learning

Available concepts: commitment, zero-knowledge, selective-disclosure, private-payments, proof-composition`;
}
