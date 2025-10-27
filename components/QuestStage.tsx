'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuestStageProps {
  stageId: string;
  title: string;
  description: string;
  storyText: string;
  actionLabel: string;
  onAction: () => void;
  isLoading?: boolean;
  result?: React.ReactNode;
  explainer?: React.ReactNode;
  badges?: string[];
}

export function QuestStage({
  stageId,
  title,
  description,
  storyText,
  actionLabel,
  onAction,
  isLoading = false,
  result,
  explainer,
  badges = [],
}: QuestStageProps) {
  return (
    <motion.div
      key={stageId}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl"
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
            {badges.length > 0 && (
              <div className="flex gap-2">
                {badges.map((badge) => (
                  <Badge key={badge} variant="glow">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Story */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
            <p className="text-sm leading-relaxed text-gray-300">{storyText}</p>
          </div>

          {/* Result Panel */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4"
            >
              {result}
            </motion.div>
          )}

          {/* Explainer */}
          {explainer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-700 bg-gray-800/50 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-gray-300">
                What just happened?
              </p>
              <div className="text-sm leading-relaxed text-gray-400">
                {explainer}
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            variant="glow"
            size="lg"
            onClick={onAction}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : actionLabel}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

