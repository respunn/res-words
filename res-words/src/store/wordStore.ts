import { create } from 'zustand';
import { Word } from '../types';

const getWords = async (difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<Word | null> => {
  try {
    const lengthMap = {
      beginner: { minlength: 3, maxlength: 5 },
      intermediate: { minlength: 6, maxlength: 8 },
      advanced: { minlength: 9, maxlength: 12 },
    };
    const { minlength, maxlength } = lengthMap[difficulty];

    while (true) {
      const response = await fetch(`https://random-word.ryanrk.com/api/en/word/random/?minlength=${minlength}&maxlength=${maxlength}`);
      const wordsArray = await response.json();
      const word = wordsArray[0];
      console.log('Fetched random word:', word);

      const response2 = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response2.ok) {
        console.warn(`No definition found for word: ${word}`);
        continue;
      }

      const wordDetails = await response2.json();
      const firstMeaning = wordDetails[0]?.meanings[0]?.definitions[0];
      if (!firstMeaning) {
        console.warn(`No valid definition structure for word: ${word}`);
        continue;
      }

      return {
        id: word,
        word,
        definition: firstMeaning.definition,
        example: firstMeaning.example || 'No example available.',
        difficulty,
      };
    }
  } catch (error) {
    console.error('Error fetching word details:', error);
    return null;
  }
};


interface WordState {
  currentWord: Word | null;
  previousWords: Word[];
  upcomingWords: Word[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  setDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  fetchWords: () => Promise<void>;
  moveToNextWord: () => Promise<void>;
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
  fetchWords: async () => {
    try {
      const { difficulty } = get();
      const newWord = await getWords(difficulty);
      if (newWord) {
        set({
          currentWord: newWord,
          upcomingWords: [],
          previousWords: [],
        });
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  },
  moveToNextWord: async () => {
    const { currentWord, previousWords, difficulty } = get();
    const newWord = await getWords(difficulty);
    if (newWord) {
      set({
        previousWords: currentWord ? [...previousWords, currentWord] : previousWords,
        currentWord: newWord,
        upcomingWords: [],
      });
    }
  },
}));
