export interface Word {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  id: string;
  email: string;
  streak: number;
  points: number;
  level: number;
  words_learned: string[];
}

export interface UserProgress {
  userId: string;
  wordId: string;
  learned: boolean;
  lastReviewed: Date;
}