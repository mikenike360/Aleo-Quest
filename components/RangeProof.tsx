'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export function RangeProof() {
  const [age, setAge] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleProve = async () => {
    setIsVerifying(true);
    // Simulate proof generation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerifying(false);
    setShowResult(true);
  };

  const isOver18 = age >= 18;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Range Proof Demo</CardTitle>
        <CardDescription>
          Prove your age is ≥ 18 without revealing the exact number
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Your Age</label>
            <span className="rounded-lg bg-gray-800 px-3 py-1 text-lg font-bold">
              {age}
            </span>
          </div>
          
          <input
            type="range"
            min="10"
            max="100"
            value={age}
            onChange={(e) => {
              setAge(Number(e.target.value));
              setShowResult(false);
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
            style={{
              background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(147, 51, 234) ${
                ((age - 10) / 90) * 100
              }%, rgb(31, 41, 55) ${((age - 10) / 90) * 100}%)`,
            }}
          />
        </div>

        <Button
          onClick={handleProve}
          disabled={isVerifying}
          variant="glow"
          className="w-full"
        >
          {isVerifying ? 'Generating Proof...' : 'Prove Age ≥ 18'}
        </Button>

        <AnimatePresence mode="wait">
          {showResult && (
            <motion.div
              key={isOver18 ? 'pass' : 'fail'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl border p-4 ${
                isOver18
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {isOver18 ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${isOver18 ? 'text-green-200' : 'text-red-200'}`}>
                    {isOver18 ? 'Access Granted ✓' : 'Access Denied ✗'}
                  </p>
                  <p className={`mt-1 text-sm ${isOver18 ? 'text-green-300' : 'text-red-300'}`}>
                    {isOver18
                      ? 'Proof verified: age ≥ 18 (exact value remains hidden)'
                      : 'Proof shows age < 18'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-sm text-gray-400">
          <p className="mb-2 font-semibold text-gray-300">How it works:</p>
          <ul className="space-y-1 text-xs">
            <li>• Generate a cryptographic proof that age ≥ 18</li>
            <li>• Verifier checks the proof without seeing your exact age</li>
            <li>• Your privacy is preserved while meeting requirements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

