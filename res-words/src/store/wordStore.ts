import { create } from 'zustand';
import { Word } from '../types';

const getWords = async (difficulty: 'beginner'): Promise<Word | null> => {
  try {
    const response = await fetch(`http://localhost:3002/word/english`);
    const wordsArray = await response.json();
    const word = wordsArray[0];
    console.log('Fetched random word:', wordsArray);
    console.log('Fetched random word:', word);

    return {
      id: word,
      word,
      definition: 'No definition available.', // Placeholder definition
      example: 'No example available.', // Placeholder example
      difficulty,
    };
  } catch (error) {
    console.error('Error fetching word details:', error);
    return null;
  }
};

interface WordState {
  currentWord: Word | null;
  previousWords: Word[];
  upcomingWords: Word[];
  difficulty: 'beginner';
  isFetching: boolean;
  fetchWords: () => Promise<void>;
  moveToNextWord: () => Promise<void>;
}

export const useWordStore = create<WordState>((set, get) => ({
  currentWord: null,
  previousWords: [],
  upcomingWords: [],
  difficulty: 'beginner',
  isFetching: false,
  fetchWords: async () => {
    const { isFetching } = get();
    if (isFetching) return; // Prevent fetching if already fetching a word

    set({ isFetching: true });
    try {
      const newWord = await getWords('beginner');
      const nextWord = await getWords('beginner');
      if (newWord) {
        set({
          currentWord: newWord,
          upcomingWords: nextWord ? [nextWord] : [],
          previousWords: [],
        });
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      set({ isFetching: false });
    }
  },
  moveToNextWord: async () => {
    const { currentWord, previousWords, upcomingWords, isFetching } = get();
    if (isFetching) return;

    set({ isFetching: true });
    try {
      const nextWord = await getWords('beginner');
      const newCurrentWord = upcomingWords[0];

      if (newCurrentWord) {
        set({
          previousWords: currentWord ? [...previousWords, currentWord] : previousWords,
          currentWord: newCurrentWord,
          upcomingWords: nextWord ? [nextWord] : [],
        });
      } else {
        console.warn('No upcoming word available, fetching a new word.');
        get().fetchWords();
      }
    } catch (error) {
      console.error('Error moving to next word:', error);
    } finally {
      set({ isFetching: false });
    }
  },
}));
