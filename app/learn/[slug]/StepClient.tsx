'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StepChrome } from '@/components/StepChrome';
import { useAppStore } from '@/lib/store';
import { getStepBySlug, type LearnStep } from '@/lib/steps';
import { trackEvent } from '@/lib/analytics';
import { useSoundManager } from '@/lib/audio';

interface StepClientProps {
  title: string;
  summary?: string;
  slug: string;
  nextStep: LearnStep | null;
  prevStep: LearnStep | null;
  children: React.ReactNode;
}

export function StepClient({
  title,
  summary,
  slug,
  nextStep,
  prevStep,
  children,
}: StepClientProps) {
  const router = useRouter();
  const setLearnStep = useAppStore((state) => state.setLearnStep);
  const completeStep = useAppStore((state) => state.completeStep);
  const soundManager = useSoundManager();
  
  // Quiz completion checking
  const isQuizCompleted = useAppStore((state) => state.quizCompletions[slug] || false);
  const currentStepData = getStepBySlug(slug);
  const hasQuiz = currentStepData?.hasQuiz || false;
  const canProceed = !hasQuiz || isQuizCompleted;

  // Hydrate store
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  // Set current step
  useEffect(() => {
    setLearnStep(slug);
    trackEvent('learn_step_view', { step: slug });
  }, [slug, setLearnStep]);

  const handleNext = () => {
    if (!canProceed) {
      soundManager.playErrorSound();
      // Scroll to quiz if it exists
      const quizElement = document.querySelector('[data-quiz]');
      if (quizElement) {
        quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (nextStep) {
      completeStep(slug);
      soundManager.playSuccessSound();
      router.push(`/learn/${nextStep.id}`);
      trackEvent('learn_step_complete', { step: slug });
    } else {
      // Last step - mark as complete and redirect back to learn index
      completeStep(slug);
      soundManager.playLevelUpSound();
      trackEvent('learn_complete');
      router.push('/learn');
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      soundManager.playClickSound();
      router.push(`/learn/${prevStep.id}`);
    }
  };

  return (
    <StepChrome
      title={title}
      summary={summary}
      prevStep={prevStep}
      nextStep={nextStep}
      onNext={handleNext}
      onPrev={handlePrev}
      slug={slug}
      canProceed={canProceed}
      hasQuiz={hasQuiz}
    >
      {children}
    </StepChrome>
  );
}

