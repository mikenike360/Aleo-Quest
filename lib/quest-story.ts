// Story content for each quest stage
export interface StoryBeat {
  type: 'narration' | 'npc' | 'choice' | 'input' | 'animation' | 'success' 
       | 'property-selector' | 'range-proof-input' | 'coin-payment' | 'proof-combiner' | 'secret-sealer';
  content?: string | string[];
  npcName?: string;
  animation?: string[];
  choices?: { key: string; text: string; correct?: boolean; feedback?: string }[];
  inputPrompt?: string;
  inputMinLength?: number;
  // New properties for interactive beats
  propertyOptions?: { id: string; label: string; correct?: boolean }[];
  rangeProofConfig?: { min: number; max: number; threshold: number };
  coinPaymentConfig?: { totalGold: number; requiredAmount: number };
  proofsTocombine?: string[]; // IDs of proofs to combine
}

export const questStories = {
  'locked-vault': {
    title: 'THE VAULT',
    beats: [
      {
        type: 'narration',
        content: [
          'Initializing ZK Protocol...',
          'Loading Vault Chamber...',
          '',
          'You materialize in a dimly lit chamber.',
          'Before you stands an ancient vault, its surface',
          'etched with glowing cryptographic runes.',
          '',
          'A figure emerges from the shadows...'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'VAULT KEEPER',
        content: [
          '"Welcome, traveler. I am the Vault Keeper.',
          'This vault holds great treasures, but only',
          'those who understand privacy may enter."',
          '',
          '"Your first lesson: the art of the seal.',
          'You must lock away a secret—but here\'s the trick—',
          'the seal itself reveals nothing about what\'s inside."',
          '',
          '"We call this a commitment. Think of it like',
          'putting a message in a locked box.',
          'The box proves something exists inside,',
          'but no one can peek at the contents."'
        ]
      } as StoryBeat,
      {
        type: 'choice',
        content: 'VAULT KEEPER: "Tell me—what makes a good seal?"',
        choices: [
          { key: '1', text: 'It locks the secret and hides it completely', correct: true, feedback: 'VAULT KEEPER: "Precisely! You understand well."' },
          { key: '2', text: 'It encrypts the secret for later', correct: false, feedback: 'VAULT KEEPER: "Not quite. We don\'t encrypt—we seal. Try again."' },
          { key: '3', text: 'It reveals part of the secret', correct: false, feedback: 'VAULT KEEPER: "No! A good seal reveals nothing. Reconsider."' }
        ]
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          '',
          'VAULT KEEPER: "Good. Now, choose your secret.',
          'It can be anything—a word, a phrase, a password.',
          'But make it at least 6 characters long.',
          'Once sealed, it cannot be changed..."'
        ]
      } as StoryBeat,
      {
        type: 'secret-sealer',
        inputPrompt: 'What is your secret?',
        inputMinLength: 6
      } as StoryBeat,
      {
        type: 'animation'
      } as StoryBeat,
      {
        type: 'success',
        content: [
          'The vault accepts your commitment!',
          '',
          'VAULT KEEPER: "Excellent work. Your secret is now',
          'sealed inside. No one—not even me—can see what',
          'you wrote. Yet the seal proves you committed to',
          'something specific."',
          '',
          '"This is the first pillar of zero-knowledge:',
          'hiding information while proving it exists.',
          'You may pass..."'
        ]
      } as StoryBeat,
    ]
  },
  
  'truth-teller': {
    title: 'THE PROOF',
    beats: [
      {
        type: 'narration',
        content: [
          'The vault fades into shadow...',
          'You step forward into a corridor of light.',
          '',
          'You enter a vast chamber where the very air',
          'shimmers with mathematical equations.',
          'Complex formulas float weightlessly around you,',
          'glowing symbols dancing in geometric patterns.',
          '',
          'A hooded guardian materializes before you,',
          'blocking the path. Their staff pulses with energy.'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'GUARDIAN',
        content: [
          '"Halt! I am the Guardian of Truth.',
          'You sealed a secret in the vault—good.',
          'But now I need to verify something about it."',
          '',
          '"I need to know: Is your secret long enough?',
          'Does it have at least 6 characters?"',
          '',
          '"But here\'s the catch—you must prove this to me',
          'WITHOUT telling me what the secret is.',
          'Can you do that?"'
        ]
      } as StoryBeat,
      {
        type: 'choice',
        content: 'How will you prove your secret is long enough?',
        choices: [
          { key: '1', text: 'Just tell the Guardian my secret', correct: false, feedback: 'GUARDIAN: "NO! That defeats the purpose! Keep your secret hidden and try again."' },
          { key: '2', text: 'Create a proof that checks the length', correct: true, feedback: 'GUARDIAN: "Brilliant! Yes—prove the fact without revealing the secret itself!"' },
          { key: '3', text: 'Tell them the exact number of characters', correct: false, feedback: 'GUARDIAN: "That still leaks information! I only need to know if it\'s ≥6, nothing more."' }
        ]
      } as StoryBeat,
      {
        type: 'property-selector',
        content: [
          '',
          'GUARDIAN: "Now, choose which properties you want to prove',
          'about your secret. Remember: share only what\'s necessary!"'
        ],
        propertyOptions: [
          { id: 'length-check', label: 'Length ≥ 6 characters', correct: true },
          { id: 'contains-letters', label: 'Contains letters', correct: false },
          { id: 'first-letter', label: 'First letter', correct: false },
          { id: 'exact-count', label: 'Exact character count', correct: false }
        ]
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          '',
          'GUARDIAN: "Good choice! Now, I will analyze your proof.',
          'This magical process will check your secret\'s length',
          'and give me a YES or NO answer—',
          'without ever showing me the secret itself..."'
        ]
      } as StoryBeat,
      {
        type: 'animation',
        content: ['Analyzing secret proof...']
      } as StoryBeat,
      {
        type: 'success',
        content: [
          'Proof analyzed and verified!',
          '',
          'GUARDIAN: "Remarkable! I now know your secret is',
          'long enough—at least 6 characters—but I still',
          'have no idea what it actually says."',
          '',
          '"This is the heart of zero-knowledge:',
          'proving facts while keeping secrets.',
          'You have mastered the second pillar.',
          'Continue on your journey..."'
        ]
      } as StoryBeat,
    ]
  },

  'hidden-key': {
    title: 'THE CHOICE',
    beats: [
      {
        type: 'narration',
        content: [
          'The guardian steps aside respectfully.',
          'You enter a grand hall.',
          '',
          'Three massive doors stand before you,',
          'each glowing with different colored runes.',
          '',
          'A cloaked figure appears...'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'KEY MASTER',
        content: [
          '"Greetings. I am the Key Master.',
          'You\'ve learned to seal secrets and prove facts.',
          'Now you must learn wisdom."',
          '',
          '"All three doors lead forward, but each asks',
          'for different information to unlock.',
          'Remember: a wise traveler reveals only what',
          'is absolutely necessary—nothing more."'
        ]
      } as StoryBeat,
      {
        type: 'range-proof-input',
        inputPrompt: 'Enter your age (this will remain private)',
        rangeProofConfig: { min: 1, max: 120, threshold: 18 }
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          '',
          'The doors shimmer, revealing their requirements:',
          '',
          '  🚪 DOOR A asks: "Are you over 18?"',
          
          '',
          '  🚪 DOOR B asks: "Prove your identity"',
         
          '',
          '  🚪 DOOR C asks: "Prove age AND identity"',
         
          ''
        ]
      } as StoryBeat,
      {
        type: 'choice',
        content: 'KEY MASTER: "Which door asks for the least information?"',
        choices: [
          { key: '1', text: 'Door A', correct: true, feedback: 'KEY MASTER: "Wise! Door A asks only what it needs—a single yes/no."' },
          { key: '2', text: 'Door B', correct: false, feedback: 'KEY MASTER: "No—that\'s too much! Why share everything when you don\'t need to?"' },
          { key: '3', text: 'Door C', correct: false, feedback: 'KEY MASTER: "Absolutely not! That door is greedy. Never share more than necessary."' }
        ]
      } as StoryBeat,
      {
        type: 'animation',
        content: ['Proving minimal information...', 'Door A responds...']
      } as StoryBeat,
      {
        type: 'success',
        content: [
          'Door A swings open smoothly and then all the doors collapse!'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'KEY MASTER',
        content: [
          '"Excellent judgment. This is called',
          '"minimal disclosure"—sharing only what\'s required',
          'and keeping everything else private."',
          '',
          '"In the real world, you should never hand over',
          'your entire wallet when someone just needs to know',
          'you\'re old enough. You understand now.',
          'The third pillar is yours..."'
        ]
      } as StoryBeat,
    ]
  },

  'private-marketplace': {
    title: 'THE MARKET',
    beats: [
      {
        type: 'narration',
        content: [
          'You step through Door A into a new realm.',
          '',
          'A bustling marketplace materializes around you.',
          'But something is strange...',
          '',
          'People are buying and selling, yet no one speaks',
          'of prices or balances. Everything happens in',
          'mysterious silence.'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'MERCHANT',
        content: [
          '"Welcome to the Private Market!',
          'Here, we trade in complete privacy."',
          '',
          '"See this Mystery Box? It costs 100 gold.',
          'Now, in a normal market, I\'d ask:',
          'How much gold do you have?',
          'Can I see your purse?"',
          '',
          '"But here, things work differently.',
          'You simply PROVE you can afford it—',
          'without showing me your actual balance.',
          'I never see how much gold you carry!"'
        ]
      } as StoryBeat,
      {
        type: 'choice',
        content: 'MERCHANT: "Question—what information do I learn from your payment?"',
        choices: [
          { key: '1', text: 'You learn my total gold amount', correct: false, feedback: 'MERCHANT: "No, no! Your total stays hidden. That\'s the beauty of it!"' },
          { key: '2', text: 'You only learn the payment is valid', correct: true, feedback: 'MERCHANT: "Exactly! I know you CAN pay, but not HOW MUCH you have!"' },
          { key: '3', text: 'You learn how much I have left after', correct: false, feedback: 'MERCHANT: "Nope! Your remaining balance stays your business, not mine."' }
        ]
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          '',
          'MERCHANT: "Perfect! Now, let\'s complete the transaction.',
          'Generate a payment proof that shows you can afford',
          'the 100 gold—without revealing your total wealth..."'
        ]
      } as StoryBeat,
      {
        type: 'coin-payment',
        content: ['Drag coins to create your payment...'],
        coinPaymentConfig: { totalGold: 500, requiredAmount: 100 }
      } as StoryBeat,
      {
        type: 'success',
        content: [
          'Transaction complete!',
          'You receive the Mystery Box.',
          '',
          'MERCHANT: "Wonderful! I confirmed you could pay,',
          'but I have no idea if you have 100 gold or',
          '1 million gold. Your wealth is your secret."',
          '',
          '"This is the fourth pillar:',
          'Private transactions where no one can track',
          'your balance or spending habits.',
          'You\'re almost there..."'
        ]
      } as StoryBeat,
    ]
  },

  'final-gate': {
    title: 'THE FINAL GATE',
    beats: [
      {
        type: 'narration',
        content: [
          'The marketplace fades away.',
          '',
          'Before you stands the Final Gate—',
          'massive, ancient, covered in glowing symbols.',
          '',
          'This is it. The final test.',
          '',
          'A towering figure materializes...'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'GATE KEEPER',
        content: [
          '"Welcome, traveler. I am the Gate Keeper.',
          'You\'ve journeyed far and learned much:"',
          '',
          '"First, you sealed a secret in the Vault.',
          'Then, you proved facts without revealing secrets.',
          'Next, you chose minimal disclosure over excess.',
          'Finally, you made a private payment."',
          '',
          '"But this gate demands something special.',
          'You must combine ALL your knowledge—',
          'weaving multiple proofs together into one.',
          'Only then will it open."'
        ]
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          '',
          'Your journey so far:',
          '',
          '  ✓ Sealed secret in vault',
          '  ✓ Proved length without revealing',
          '  ✓ Chose minimal disclosure',
          '  ✓ Made private payment',
          '',
          'GATE KEEPER: "Now, bring them all together..."'
        ]
      } as StoryBeat,
      {
        type: 'choice',
        content: 'GATE KEEPER: "To combine proofs properly, what do you do?"',
        choices: [
          { key: '1', text: 'Merge them all, then check if valid', correct: false, feedback: 'GATE KEEPER: "Dangerous! You must verify each one FIRST before combining!"' },
          { key: '2', text: 'Verify each proof, then combine them', correct: true, feedback: 'GATE KEEPER: "Perfect! Trust but verify—THEN compose. Proceed!"' },
          { key: '3', text: 'Submit each proof separately', correct: false, feedback: 'GATE KEEPER: "No! The gate needs one UNIFIED proof, not many separate ones."' }
        ]
      } as StoryBeat,
      {
        type: 'proof-combiner',
        content: ['Drag all 4 proofs into the combination circle...'],
        proofsTocombine: ['vault-commitment', 'length-proof', 'age-range-proof', 'payment-proof']
      } as StoryBeat,
      {
        type: 'animation',
        content: [
          'GATE KEEPER seals the proofs with ancient magic.',
          'Combining them into one unified statement...'
        ]
      } as StoryBeat,
      {
        type: 'narration',
        content: [
          'You present the combined proof to the gate.',
          'The gate suddenly begins to spin!',
          'The gate EXPLODES with brilliant light!',
          'Ancient locks click open one by one.'
        ]
      } as StoryBeat,
      {
        type: 'npc',
        npcName: 'GATE KEEPER',
        content: [
          '"You have done it!',
          'You understand the pillars of zero-knowledge:"',
          '',
          '  • Seal secrets while proving they exist',
          '  • Prove facts without revealing values',
          '  • Share only what is necessary',
          '  • Keep transactions private',
          '  • Combine proofs when needed',
          '',
          '"You are now a true ZK Master.',
          'Go forth and use this wisdom well."'
        ]
      } as StoryBeat,
    ]
  },
};

