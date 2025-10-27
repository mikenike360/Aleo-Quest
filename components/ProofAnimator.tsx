'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Lock, Send } from 'lucide-react';
import { mockDelay } from '@/lib/hash';

export function ProofAnimator() {
  const [secret, setSecret] = useState('');
  const [stage, setStage] = useState<'idle' | 'proving' | 'verifying' | 'verified'>('idle');
  const [costMs, setCostMs] = useState(0);

  const handleGenerate = async () => {
    if (!secret.trim()) return;

    setStage('proving');
    const delay1 = await mockDelay(400, 600);
    
    setStage('verifying');
    const delay2 = await mockDelay(300, 500);
    
    setCostMs(delay1 + delay2);
    setStage('verified');
    
    setTimeout(() => setStage('idle'), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Proof Animator
        </CardTitle>
        <CardDescription>
          Generate a zero-knowledge proof without revealing your secret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Your Secret
          </label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter something secret..."
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            disabled={stage !== 'idle'}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!secret.trim() || stage !== 'idle'}
          variant="glow"
          className="w-full"
        >
          Generate Proof
        </Button>

        {/* Animation */}
        <div className="relative flex h-32 items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto text-center text-sm text-gray-500"
              >
                Ready to generate proof
              </motion.div>
            )}

            {stage !== 'idle' && (
              <>
                {/* Prover */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <Lock className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium">Prover</span>
                </motion.div>

                {/* Animated Arrow */}
                {(stage === 'proving' || stage === 'verifying' || stage === 'verified') && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 px-4"
                  >
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Send className="h-6 w-6 text-purple-500" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Verifier */}
                {(stage === 'verifying' || stage === 'verified') && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Verifier</span>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Result */}
        <AnimatePresence>
          {stage === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-semibold text-green-200">
                    Verified ✅
                  </p>
                  <p className="text-sm text-green-300">
                    Without revealing your secret • {costMs}ms
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

