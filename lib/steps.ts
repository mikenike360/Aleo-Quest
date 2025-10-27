export interface LearnStep {
  id: string;
  title: string;
  summary: string;
  order: number;
  hasQuiz?: boolean;
}

export const learnSteps: LearnStep[] = [
  {
    id: 'intro',
    title: 'The Problem',
    summary: 'Why most blockchains can\'t be used for real payments',
    order: 1,
    hasQuiz: true,
  },
  {
    id: 'zk',
    title: 'The Magic Trick',
    summary: 'How to prove something without revealing anything',
    order: 2,
    hasQuiz: true,
  },
  {
    id: 'how-it-works',
    title: 'How It Actually Works',
    summary: 'The tech behind private payments',
    order: 3,
    hasQuiz: true,
  },
  {
    id: 'use-cases',
    title: 'Real Examples',
    summary: 'Privacy-preserving applications in action',
    order: 4,
    hasQuiz: true,
  },
  {
    id: 'whats-next',
    title: 'What\'s Next',
    summary: 'Your journey into privacy is just beginning',
    order: 5,
    hasQuiz: true,
  },
];

export function getStepBySlug(slug: string): LearnStep | undefined {
  return learnSteps.find((s) => s.id === slug);
}

export function getNextStep(currentSlug: string): LearnStep | null {
  const currentIndex = learnSteps.findIndex((s) => s.id === currentSlug);
  if (currentIndex === -1 || currentIndex === learnSteps.length - 1) {
    return null;
  }
  return learnSteps[currentIndex + 1];
}

export function getPrevStep(currentSlug: string): LearnStep | null {
  const currentIndex = learnSteps.findIndex((s) => s.id === currentSlug);
  if (currentIndex <= 0) {
    return null;
  }
  return learnSteps[currentIndex - 1];
}

export function getProgressPercent(completedSteps: string[]): number {
  if (learnSteps.length === 0) return 0;
  return Math.round((completedSteps.length / learnSteps.length) * 100);
}

