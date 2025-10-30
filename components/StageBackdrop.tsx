'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { stageBackdrops, npcImages } from '@/lib/quest-images';

interface StageBackdropProps {
  stage: string;
  npcName?: string | null;
  npcOpacity?: number;
  backdropOpacity?: number;
}

export function StageBackdrop({ 
  stage, 
  npcName, 
  npcOpacity = 0.8, 
  backdropOpacity = 0.25 
}: StageBackdropProps) {
  const backdropSrc = stageBackdrops[stage];
  const npcSrc = npcName ? npcImages[npcName] : null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stage backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: backdropOpacity }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img 
          src={backdropSrc} 
          alt="Stage backdrop"
          className="w-full h-full object-cover"
          style={{
            imageRendering: 'crisp-edges'
          }}
        />
      </motion.div>
      
      {/* NPC overlay */}
      <AnimatePresence mode="wait">
        {npcSrc && (
          <motion.div 
            key={npcName}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: npcOpacity, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute right-2 bottom-0 md:right-8 md:bottom-0 -z-10"
          >
            <img 
              src={npcSrc} 
              alt={npcName || "NPC"}
              className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              style={{
                imageRendering: 'crisp-edges'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
