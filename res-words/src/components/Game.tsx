import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { useWordStore } from '../store/wordStore';
import { Loader2 } from 'lucide-react';

export default function Game() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [playCorrect] = useSound('/correct.mp3');
  const [playWrong] = useSound('/wrong.mp3');
  
  const { currentWord, moveToNextWord, difficulty, setDifficulty, fetchWords } = useWordStore();

  useEffect(() => {
    const initializeWords = () => {
      setIsLoading(true);
      fetchWords();
      setIsLoading(false);
    };

    initializeWords();
  }, [fetchWords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase() === currentWord?.word.toLowerCase()) {
      playCorrect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      moveToNextWord();
      setInput('');
    } else {
      playWrong();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 flex justify-center space-x-4">
        {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded-full ${
              difficulty === level
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            } transition-colors duration-200`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {currentWord ? (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <motion.h2
            key={currentWord.word}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-center mb-4"
          >
            {currentWord.word}
          </motion.h2>
          <p className="text-gray-600 mb-4">{currentWord.definition}</p>
          <p className="text-gray-500 italic mb-6">{currentWord.example}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Kelimeyi yazın..."
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kontrol Et
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Kelime bulunamadı. Lütfen tekrar deneyin.</p>
        </div>
      )}
    </motion.div>
  );
}