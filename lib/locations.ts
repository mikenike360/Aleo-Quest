import { type QuestStage } from './store';

export interface Location {
  id: string;
  name: string;
  description: string[];
  npcs: { name: string; description: string }[];
  objects: { name: string; description: string }[];
  exits: { direction: string; destination: string; description: string }[];
  ambientSound?: string;
}

export const questLocations: Record<QuestStage, Location> = {
  'locked-vault': {
    id: 'locked-vault',
    name: 'The Ancient Vault Chamber',
    description: [
      'You stand in a dimly lit chamber carved from obsidian stone.',
      'The air is thick with the scent of old parchment and ozone from the glowing cryptographic runes that pulse across every surface in mesmerizing patterns.',
      'Ancient symbols dance in the air, each representing a different aspect of cryptographic commitment.',
      'The chamber hums with the energy of sealed secrets and hidden knowledge.'
    ],
    npcs: [
      {
        name: 'Vault Keeper',
        description: 'A figure shrouded in shadows and starlight, their eyes glowing with ancient wisdom. They are the guardian of the first pillar: the art of the seal.'
      }
    ],
    objects: [
      {
        name: 'vault',
        description: 'A massive vault door sealed with impossible complexity, its surface etched with thousands of mathematical equations flowing like liquid silver.'
      },
      {
        name: 'runes',
        description: 'Glowing cryptographic runes that pulse with mathematical energy, each symbol representing a different aspect of commitment schemes.'
      },
      {
        name: 'commitment',
        description: 'The mystical art of sealing secrets - proving knowledge without revealing the knowledge itself.'
      }
    ],
    exits: [
      {
        direction: 'north',
        destination: 'vault door',
        description: 'The sealed vault door, waiting for a commitment to unlock its mysteries.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/vault-ambient.mp3'
  },

  'truth-teller': {
    id: 'truth-teller',
    name: 'The Mathematical Proof Chamber',
    description: [
      'You enter a vast chamber where the very air shimmers with mathematical equations.',
      'Complex formulas float weightlessly around you, glowing symbols dancing in geometric patterns.',
      'The chamber pulses with the energy of zero-knowledge proofs, each equation representing a different aspect of cryptographic verification.',
      'Mathematical truths hang in the air like ethereal sculptures of pure logic.'
    ],
    npcs: [
      {
        name: 'Guardian of Truth',
        description: 'A hooded figure wielding a staff that pulses with energy. They are the keeper of the second pillar: proving facts without revealing values.'
      }
    ],
    objects: [
      {
        name: 'equations',
        description: 'Floating mathematical equations that represent different aspects of zero-knowledge proofs, dancing with the energy of mathematical truth.'
      },
      {
        name: 'formulas',
        description: 'Mathematical formulas that are the building blocks of zero-knowledge proofs, showing how to construct arguments without revealing secrets.'
      },
      {
        name: 'proof_generator',
        description: 'A mystical device that takes commitments and creates zero-knowledge proofs, demonstrating how to prove properties about hidden information.'
      }
    ],
    exits: [
      {
        direction: 'north',
        destination: 'proof verification',
        description: 'The path to proof verification, where mathematical truths are tested.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/proof-ambient.mp3'
  },

  'hidden-key': {
    id: 'hidden-key',
    name: 'The Three Doors Hall',
    description: [
      'You enter a grand hall where three massive doors stand before you, each glowing with different colored runes.',
      'The air hums with the energy of selective disclosure, each door representing a different level of information revelation.',
      'Ancient wisdom flows through the hall, teaching the art of revealing only what is absolutely necessary.',
      'The doors pulse with the power of choice and the wisdom of minimal disclosure.'
    ],
    npcs: [
      {
        name: 'Key Master',
        description: 'A cloaked figure radiating ancient wisdom. They are the teacher of the third pillar: selective disclosure - the art of revealing only what is absolutely necessary.'
      }
    ],
    objects: [
      {
        name: 'door_a',
        description: 'Door A glows with a soft blue light, asking only for age verification - a simple yes or no. This door represents the wisdom of minimal disclosure.'
      },
      {
        name: 'door_b',
        description: 'Door B pulses with a harsh red light, demanding full identity verification. This door represents excessive disclosure, asking for more than necessary.'
      },
      {
        name: 'door_c',
        description: 'Door C shimmers with a complex purple light, demanding both age and identity verification. This door represents the greed of over-disclosure.'
      },
      {
        name: 'wisdom',
        description: 'The wisdom of the Key Master flows through the hall, teaching that a wise traveler reveals only what is required.'
      }
    ],
    exits: [
      {
        direction: 'north',
        destination: 'door a',
        description: 'The minimal disclosure door - asking only what is necessary.'
      },
      {
        direction: 'east',
        destination: 'door b',
        description: 'The excessive disclosure door - asking for everything.'
      },
      {
        direction: 'west',
        destination: 'door c',
        description: 'The over-disclosure door - asking for multiple requirements.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/choice-ambient.mp3'
  },

  'private-marketplace': {
    id: 'private-marketplace',
    name: 'The Private Marketplace',
    description: [
      'A bustling marketplace materializes around you, but something is strange.',
      'People are buying and selling, yet no one speaks of prices or balances. Everything happens in mysterious silence.',
      'The air shimmers with the energy of cryptographic privacy, where wealth remains hidden while commerce flows freely.',
      'This is the realm of the fourth pillar: private transactions where no one can track your balance or spending habits.'
    ],
    npcs: [
      {
        name: 'Merchant',
        description: 'A mysterious figure who trades in complete privacy. They demonstrate the fourth pillar: private transactions where balances and spending habits remain hidden.'
      }
    ],
    objects: [
      {
        name: 'mystery_box',
        description: 'A Mystery Box that costs 100 gold, but the transaction happens in complete privacy. You prove you can afford it without revealing your actual balance.'
      },
      {
        name: 'gold',
        description: 'Your gold remains hidden during transactions. You can prove you have enough without revealing how much you actually have.'
      },
      {
        name: 'privacy_magic',
        description: 'The privacy magic flows through the marketplace, ensuring that all transactions remain private and untrackable.'
      }
    ],
    exits: [
      {
        direction: 'north',
        destination: 'market center',
        description: 'The center of the private marketplace, where all transactions happen in complete secrecy.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/market-ambient.mp3'
  },

  'final-gate': {
    id: 'final-gate',
    name: 'The Final Gate',
    description: [
      'Before you stands the Final Gate—massive, ancient, covered in glowing symbols.',
      'This is the culmination of your journey through the realms of zero-knowledge cryptography.',
      'The gate demands the mastery of all five pillars: commitment, proof, disclosure, privacy, and composition.',
      'Ancient symbols pulse with the energy of complete understanding, demanding mastery of all aspects of zero-knowledge.'
    ],
    npcs: [
      {
        name: 'Gate Keeper',
        description: 'A towering figure with ultimate authority over the realm of zero-knowledge. They test your ability to combine all your learned knowledge into unified proofs.'
      }
    ],
    objects: [
      {
        name: 'final_gate',
        description: 'The ultimate test of your knowledge, demanding mastery of all five pillars of zero-knowledge cryptography.'
      },
      {
        name: 'ancient_symbols',
        description: 'Ancient symbols on the gate that represent the five pillars of zero-knowledge cryptography, pulsing with the energy of complete understanding.'
      },
      {
        name: 'mastery',
        description: 'The mastery required here is the ability to combine multiple proofs into unified statements - the final pillar of proof composition.'
      }
    ],
    exits: [
      {
        direction: 'north',
        destination: 'final challenge',
        description: 'The final challenge that awaits beyond the gate - the ultimate test of your zero-knowledge mastery.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/final-gate-ambient.mp3'
  },

  'completed': {
    id: 'completed',
    name: 'The Hall of Mastery',
    description: [
      'You have reached the Hall of Mastery, where all who understand the five pillars of zero-knowledge cryptography are welcomed.',
      'The air shimmers with the satisfaction of completed knowledge and the wisdom of cryptographic mastery.',
      'This is your domain now—a place of understanding and wisdom where you have proven your mastery.',
      'The hall glows with the energy of all five pillars working in harmony.'
    ],
    npcs: [],
    objects: [
      {
        name: 'mastery_throne',
        description: 'A throne of cryptographic knowledge, representing your mastery of all five pillars of zero-knowledge cryptography.'
      },
      {
        name: 'knowledge_crystals',
        description: 'Crystals that contain the essence of cryptographic knowledge, glowing with the power of understanding.'
      },
      {
        name: 'wisdom_tomes',
        description: 'Ancient tomes containing the deepest secrets of zero-knowledge cryptography, now accessible to you.'
      }
    ],
    exits: [
      {
        direction: 'anywhere',
        destination: 'everywhere',
        description: 'You have mastered the realm and can travel anywhere with your newfound knowledge.'
      }
    ],
    ambientSound: '/aleo-quest-images/music/vault-ambient.mp3' // Reuse vault ambient for completion
  }
};

export function getLocationDescription(stage: QuestStage): string {
  const location = questLocations[stage];
  if (!location) return 'You are nowhere in particular.';
  
  return `═══════════════════════════════════════════════════════════
LOCATION: ${location.name}
═══════════════════════════════════════════════════════════

${location.description.join('\n\n')}

${location.npcs.length > 0 ? `NPCS: ${location.npcs.map(npc => npc.name).join(', ')}` : ''}
OBJECTS: ${location.objects.map(obj => obj.name).join(', ')}
EXITS: ${location.exits.map(exit => `${exit.direction} (${exit.destination})`).join(', ')}`;
}

export function getObjectDescription(stage: QuestStage, objectName: string): string {
  const location = questLocations[stage];
  if (!location) return `You don't see a "${objectName}" here.`;
  
  const obj = location.objects.find(o => o.name.toLowerCase() === objectName.toLowerCase());
  if (!obj) return `You don't see a "${objectName}" here.`;
  
  return obj.description;
}

export function getNPCDescription(stage: QuestStage, npcName: string): string {
  const location = questLocations[stage];
  if (!location) return `You don't see a "${npcName}" here.`;
  
  const npc = location.npcs.find(n => n.name.toLowerCase() === npcName.toLowerCase());
  if (!npc) return `You don't see a "${npcName}" here.`;
  
  return npc.description;
}
