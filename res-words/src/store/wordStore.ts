import { create } from 'zustand';
import { Word } from '../types';

const sampleWords: Word[] = [
  {
    id: '1',
    word: 'hello',
    definition: 'Used as a greeting or to begin a conversation',
    example: 'Hello, how are you today?',
    difficulty: 'beginner'
  },
  {
    id: '2',
    word: 'world',
    definition: 'The earth, together with all of its countries and peoples',
    example: 'He wants to travel around the world.',
    difficulty: 'beginner'
  },
  {
    id: '3',
    word: 'learn',
    definition: 'Gain or acquire knowledge of or skill in something by study, experience, or being taught',
    example: 'I am learning English.',
    difficulty: 'beginner'
  },
  {
    id: '4',
    word: 'algorithm',
    definition: 'A process or set of rules to be followed in calculations or other problem-solving operations',
    example: 'The search algorithm helps find information quickly.',
    difficulty: 'advanced'
  },
  {
    id: '5',
    word: 'coffee',
    definition: 'A hot drink made from the roasted and ground seeds of a tropical shrub',
    example: 'Would you like a cup of coffee?',
    difficulty: 'beginner'
  }
];

interface WordState {
  currentWord: Word | null;
  previousWords: Word[];
  upcomingWords: Word[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  setDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  fetchWords: () => void;
  moveToNextWord: () => void;
}

export const useWordStore = create<WordState>((set, get) => ({
  currentWord: null,
  previousWords: [],
  upcomingWords: [],
  difficulty: 'beginner',
  setDifficulty: (difficulty) => {
    set({ difficulty });
    get().fetchWords();
  },
  fetchWords: () => {
    const filteredWords = sampleWords.filter(word => word.difficulty === get().difficulty);
    set({
      currentWord: filteredWords[0] || null,
      upcomingWords: filteredWords.slice(1),
      previousWords: [],
    });
  },
  moveToNextWord: () => {
    const { currentWord, previousWords, upcomingWords } = get();
    if (currentWord && upcomingWords.length > 0) {
      set({
        previousWords: [...previousWords, currentWord],
        currentWord: upcomingWords[0],
        upcomingWords: upcomingWords.slice(1),
      });
    } else {
      // Reset to the beginning when we run out of words
      get().fetchWords();
    }
  },
}));