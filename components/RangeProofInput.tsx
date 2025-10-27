'use client';

import { useState, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { motion } from 'framer-motion';
import { 
  PRIVACY_LEVELS, 
  SparkleEffect,
  TerminalPanel,
  TerminalButton,
  TerminalText,
  TerminalStatus,
  TerminalProgress,
  ASCII_ART
} from '@/components/zkVisuals';
import { SPRING_CONFIGS, PhysicsUtils } from '@/components/zkVisuals/PhysicsConfig';

interface RangeProofConfig {
  min: number;
  max: number;
  threshold: number;
}

interface RangeProofInputProps {
  prompt: string;
  config: RangeProofConfig;
  onProofGenerated: (age: number) => void;
}

export function RangeProofInput({ prompt, config, onProofGenerated }: RangeProofInputProps) {
  const [age, setAge] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  // Physics-based slider
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: SPRING_CONFIGS.magnetic
  }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], last }) => {
    const sliderWidth = 300; // Approximate slider width
    const maxMovement = sliderWidth - 24; // Account for handle size
    
    if (last) {
      // Apply momentum and snap to nearest valid age
      const momentum = vx * 0.1;
      const targetX = Math.max(0, Math.min(maxMovement, mx + momentum));
      const percentage = targetX / maxMovement;
      const newAge = Math.round(config.min + percentage * (config.max - config.min));
      
      // Snap to valid age
      const clampedAge = Math.max(config.min, Math.min(config.max, newAge));
      const snapX = ((clampedAge - config.min) / (config.max - config.min)) * maxMovement;
      
      api.start({ x: snapX });
      setAge(clampedAge);
    } else {
      // Direct position control during drag
      const clampedX = Math.max(0, Math.min(maxMovement, mx));
      api.start({ x: clampedX, immediate: true });
      
      // Update age in real-time
      const percentage = clampedX / maxMovement;
      const newAge = Math.round(config.min + percentage * (config.max - config.min));
      setAge(Math.max(config.min, Math.min(config.max, newAge)));
    }
  });

  const handleAgeChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= config.min && numValue <= config.max) {
      setAge(numValue);
      // Update slider position
      const sliderWidth = 300;
      const maxMovement = sliderWidth - 24;
      const percentage = (numValue - config.min) / (config.max - config.min);
      const newX = percentage * maxMovement;
      api.start({ x: newX });
    } else {
      setAge(null);
    }
  };

  const getDisclosureLevel = () => {
    if (age === null) return PRIVACY_LEVELS.VAULT_COMMITMENT;
    if (age >= 18) return PRIVACY_LEVELS.AGE_RANGE;
    return PRIVACY_LEVELS.MODERATE_DISCLOSURE;
  };

  const getZoneLabel = (age: number) => {
    if (age < 18) return 'Under 18';
    if (age >= 18 && age < 25) return 'Young Adult';
    return 'Adult';
  };

  const handleGenerateProof = async () => {
    if (age === null) return;
    
    setIsGenerating(true);
    
    // Simulate proof generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    setProofGenerated(true);
    // REMOVED: onProofGenerated(age); - Don't call automatically!
  };

  const isValidAge = age !== null && age >= config.threshold;
  const canGenerate = age !== null && age >= config.threshold;

  return (
    <div className="space-y-3">
       {/* Compact Range Proof Interface */}
       <TerminalPanel colorScheme="purple" title="RANGE_PROOF">
         <div className="space-y-3">
           {/* Interactive Phase */}
           {!proofGenerated && (
             <>
               {/* Age Display and Slider - Inline */}
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <TerminalText colorScheme="purple" variant="accent" className="text-sm">
                     AGE: {age !== null ? age : '?'}
                   </TerminalText>
                   <TerminalText colorScheme="purple" variant="muted" className="text-xs">
                     {age !== null ? getZoneLabel(age) : 'Select age'}
                   </TerminalText>
                 </div>
                 
                 {/* Compact Slider with Terminal Style */}
                 <div className="relative">
                   <div className="relative h-4 overflow-hidden bg-gray-800 border border-purple-500">
                     {/* Animated background zones */}
                     <motion.div 
                       className="absolute left-0 top-0 h-full bg-red-500/20"
                       animate={{ 
                         width: age !== null ? `${(age - config.min) / (config.max - config.min) * 100}%` : '0%'
                       }}
                       transition={{ duration: 0.3 }}
                     />
                     
                     {/* Slider track */}
                     <div 
                       className="absolute inset-0 cursor-pointer"
                       onClick={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const clickX = e.clientX - rect.left;
                         const percentage = clickX / rect.width;
                         const newAge = Math.round(config.min + percentage * (config.max - config.min));
                         const clampedAge = Math.max(config.min, Math.min(config.max, newAge));
                         
                         setAge(clampedAge);
                         
                         // Update slider position
                         const sliderWidth = rect.width;
                         const maxMovement = sliderWidth - 16;
                         const snapX = ((clampedAge - config.min) / (config.max - config.min)) * maxMovement;
                         api.start({ x: snapX });
                       }}
                     />
                     
                     {/* Terminal cursor handle */}
                     <animated.div
                       {...bind()}
                       className="absolute top-1/2 w-6 h-6 sm:w-5 sm:h-5 bg-purple-400 cursor-pointer transform -translate-y-1/2 z-10 border-2 border-purple-300 font-mono flex items-center justify-center touch-manipulation"
                       style={{
                         x: x,
                         transform: 'translateX(-50%) translateY(-50%)'
                       }}
                     >
                       <TerminalText colorScheme="purple" variant="primary" className="text-xs">
                         █
                       </TerminalText>
                     </animated.div>
                   </div>
                   
                   {/* Compact age labels */}
                   <div className="flex justify-between mt-1 text-xs">
                     <TerminalText colorScheme="purple" variant="muted">{config.min}</TerminalText>
                     <TerminalText colorScheme="purple" variant="muted">60</TerminalText>
                     <TerminalText colorScheme="purple" variant="muted">{config.max}</TerminalText>
                   </div>
                   
                   {/* Real-time feedback message */}
                   {age !== null && (
                     <motion.div
                       initial={{ opacity: 0, y: -5 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="mt-1"
                     >
                       <TerminalText 
                         colorScheme="purple" 
                         variant={age >= 18 ? "success" : "error"}
                         className="text-xs font-mono"
                       >
                         {age < 13 ? 'TOO YOUNG - ACCESS DENIED' :
                          age < 18 ? 'ALMOST THERE - KEEP SLIDING' :
                          age < 21 ? 'VALID - THRESHOLD MET ✓' :
                          'ADULT - ACCESS GRANTED ✓'}
                       </TerminalText>
                     </motion.div>
                   )}
                 </div>
               </div>

               {/* Status - Inline */}
               <div className="flex items-center justify-between text-xs">
                 {age !== null && (
                   <TerminalText colorScheme="purple" variant={isValidAge ? "success" : "error"} className="text-xs font-mono">
                     {isValidAge ? `≥${config.threshold} ✓` : `<${config.threshold}`}
                   </TerminalText>
                 )}
                 <TerminalText colorScheme="purple" variant="muted" className="text-xs font-mono">
                   {age !== null ? (isValidAge ? 'VALID' : 'INVALID') : 'SELECT'}
                 </TerminalText>
               </div>

               {/* Action Button */}
               {canGenerate && !proofGenerated && (
                 <TerminalButton
                   onClick={handleGenerateProof}
                   disabled={isGenerating}
                   colorScheme="purple"
                   command="generate_range_proof"
                   className="w-full py-3 text-base"
                 >
                   GENERATE AGE RANGE PROOF
                 </TerminalButton>
               )}

               {/* Loading Animation - Compact */}
               {isGenerating && (
                 <div className="space-y-2">
                   <TerminalText colorScheme="purple" variant="accent" className="text-xs text-center">
                     PROCESSING: Sealing age in cryptographic magic...
                   </TerminalText>
                   <div className="flex justify-center">
                     <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                 </div>
               )}
             </>
           )}

           {/* Proof Result - Replace interactive content */}
           {proofGenerated && age !== null && (
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <TerminalStatus status="ok" className="text-base font-bold">
                   Range proof generated successfully
                 </TerminalStatus>
                 <TerminalText colorScheme="purple" variant="success" className="text-sm">
                   Age ≥ {config.threshold} = TRUE
                 </TerminalText>
               </div>

               <div className="bg-black border border-purple-500 rounded p-3">
                 <TerminalText colorScheme="purple" variant="muted" className="text-xs block mb-1">
                   GUARDIAN_KNOWLEDGE:
                 </TerminalText>
                 <div className="font-mono text-xs space-y-1">
                   <TerminalText colorScheme="purple" variant="success" className="block">
                     ✓ Age meets threshold
                   </TerminalText>
                   <TerminalText colorScheme="purple" variant="muted" className="block">
                     ✗ Exact age (hidden)
                   </TerminalText>
                 </div>
               </div>
               
               <SparkleEffect />
             </div>
           )}
         </div>
       </TerminalPanel>

      {/* Continue Button */}
      {proofGenerated && age !== null && (
        <TerminalButton
          onClick={() => onProofGenerated(age)}
          colorScheme="purple"
          command="continue_quest"
          className="w-full py-3 text-base"
        >
          CONTINUE TO MARKET STAGE →
        </TerminalButton>
      )}
    </div>
  );
}
