import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type QuestStage = 
  | 'locked-vault'
  | 'truth-teller' 
  | 'hidden-key'
  | 'private-marketplace'
  | 'final-gate'
  | 'completed';

export interface AppState {
  // Hydration state
  _hasHydrated: boolean;
  
  // Learn progress
  learnStep: string;
  completedSteps: string[];
  setLearnStep: (step: string) => void;
  completeStep: (step: string) => void;
  
  // Quiz completion tracking
  quizCompletions: Record<string, boolean>; // stepId -> isQuizCompleted
  setQuizCompleted: (stepId: string, completed: boolean) => void;
  isQuizCompleted: (stepId: string) => boolean;
  
  // Quest progress
  questStage: QuestStage;
  completedQuestStages: QuestStage[];
  questData: {
    commitment?: string;
    secret?: string;
    userAge?: number;
    proofs: string[];
  };
  setQuestStage: (stage: QuestStage) => void;
  setQuestData: (data: Partial<AppState['questData']>) => void;
  addProof: (proof: string) => void;
  completeQuestStage: (stage: QuestStage) => void;
  
  // Quest interaction state
  questInteractions: {
    userSecret?: string;
    selectedProperties?: string[];
    userAge?: number;
    paymentAmount?: number;
    combinedProofs?: string[];
  };
  setQuestInteractions: (interactions: Partial<AppState['questInteractions']>) => void;
  
  // Audio settings
  isAudioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  
  // Badges
  badges: string[];
  addBadge: (badge: string) => void;
  
  // Reset
  reset: () => void;
  resetQuest: () => void;
  resetLearn: () => void;
}

const initialState = {
  _hasHydrated: false,
  learnStep: 'intro',
  completedSteps: [],
  quizCompletions: {},
  questStage: 'locked-vault' as QuestStage,
  completedQuestStages: [],
  questData: { proofs: [] },
  questInteractions: {},
  isAudioMuted: true, // Start muted due to browser autoplay restrictions
  badges: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setLearnStep: (step) => set({ learnStep: step }),
      
      completeStep: (step) => set((state) => ({
        completedSteps: state.completedSteps.includes(step) 
          ? state.completedSteps 
          : [...state.completedSteps, step]
      })),
      
      setQuizCompleted: (stepId, completed) => set((state) => ({
        quizCompletions: { ...state.quizCompletions, [stepId]: completed }
      })),
      
      isQuizCompleted: (stepId) => (state) => state.quizCompletions[stepId] || false,
      
      setQuestStage: (stage) => set({ questStage: stage }),
      
      setQuestData: (data) => set((state) => ({
        questData: { ...state.questData, ...data }
      })),
      
      addProof: (proof) => set((state) => ({
        questData: {
          ...state.questData,
          proofs: [...state.questData.proofs, proof]
        }
      })),
      
      completeQuestStage: (stage) => set((state) => ({
        completedQuestStages: state.completedQuestStages.includes(stage) 
          ? state.completedQuestStages 
          : [...state.completedQuestStages, stage]
      })),
      
      setQuestInteractions: (interactions) => set((state) => ({
        questInteractions: { ...state.questInteractions, ...interactions }
      })),
      
      setAudioMuted: (muted) => set({ isAudioMuted: muted }),
      
      addBadge: (badge) => set((state) => ({
        badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge]
      })),
      
      reset: () => set(initialState),
      
      resetQuest: () => set((state) => ({
        questStage: 'locked-vault' as QuestStage,
        completedQuestStages: [],
        questData: { proofs: [] },
        questInteractions: {},
        badges: [],
      })),
      
      resetLearn: () => set({
        learnStep: 'intro',
        completedSteps: [],
        quizCompletions: {},
      }),
    }),
    {
      name: 'aleo-quest-storage',
      storage: createJSONStorage(() => localStorage),
      // Handle hydration properly
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          console.log('Store rehydrated:', state);
        }
      },
    }
  )
);

