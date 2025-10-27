'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ASCIIAnimatorProps {
  frames: string[];
  frameRate?: number;
  loop?: boolean;
  onComplete?: () => void;
  color?: string;
  pauseOnComplete?: number;
}

export function ASCIIAnimator({ 
  frames, 
  frameRate = 400,
  loop = false,
  onComplete,
  color = 'text-green-400',
  pauseOnComplete = 0
}: ASCIIAnimatorProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentFrame >= frames.length - 1) {
      if (loop) {
        const timeout = setTimeout(() => setCurrentFrame(0), frameRate);
        return () => clearTimeout(timeout);
      } else {
        if (!isComplete) {
          setIsComplete(true);
          if (pauseOnComplete > 0) {
            const timeout = setTimeout(() => {
              if (onComplete) onComplete();
            }, pauseOnComplete);
            return () => clearTimeout(timeout);
          } else {
            if (onComplete) onComplete();
          }
        }
        return;
      }
    }

    const timeout = setTimeout(() => {
      setCurrentFrame(currentFrame + 1);
    }, frameRate);

    return () => clearTimeout(timeout);
  }, [currentFrame, frames.length, frameRate, loop, onComplete, pauseOnComplete, isComplete]);

  return (
    <motion.div
      key={currentFrame}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <pre className={`font-mono text-sm leading-tight ${color}`}>
        {frames[currentFrame]}
      </pre>
    </motion.div>
  );
}

// Pre-built animations
export const vaultLockingFrames = [
  `
    🔓 [        ]
    Locking...
  `,
  `
    🔓 [▓▓      ]
    Locking...
  `,
  `
    🔓 [▓▓▓▓    ]
    Locking...
  `,
  `
    🔓 [▓▓▓▓▓▓  ]
    Locking...
  `,
  `
    🔐 [▓▓▓▓▓▓▓▓]
    LOCKED!
  `
];

export const proofGenerationFrames = [
  `
  Secret → [    ] → ?
  `,
  `
  Secret → [⚡  ] → ?
  `,
  `
  Secret → [⚡⚡ ] → ?
  `,
  `
  Secret → [⚡⚡⚡] → ✓
  `
];

export const loadingBarFrames = [
  '[          ] 0%',
  '[██        ] 20%',
  '[████      ] 40%',
  '[██████    ] 60%',
  '[████████  ] 80%',
  '[██████████] 100%'
];

export const scanningFrames = [
  `
  Scanning...
  [>         ]
  `,
  `
  Scanning...
  [ >        ]
  `,
  `
  Scanning...
  [  >       ]
  `,
  `
  Scanning...
  [   >      ]
  `,
  `
  Scanning...
  [    >     ]
  `,
  `
  Scanning...
  [     >    ]
  `,
  `
  Scanning...
  [      >   ]
  `,
  `
  Scanning...
  [       >  ]
  `,
  `
  Scanning...
  [        > ]
  `,
  `
  Scanning...
  [         >]
  `,
  `
  Complete!
  [==========]
  `
];

