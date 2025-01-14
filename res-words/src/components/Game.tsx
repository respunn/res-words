import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { useWordStore } from '../store/wordStore';
import { Loader2, Settings } from 'lucide-react';

export default function Game() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playCorrect] = useSound('/correct.mp3'); // Will do this later
  const [playWrong] = useSound('/wrong.mp3'); // Will do this later
  
  const { currentWord, moveToNextWord, difficulty, setDifficulty, fetchWords } = useWordStore();

  useEffect(() => {
    const initializeWords = () => {
      setIsLoading(true);
      fetchWords();
      setIsLoading(false);
    };

    initializeWords();
  }, [fetchWords]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.settings-container')) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNextWord = () => {
    moveToNextWord();
    setInput('');
    setIsCorrect(false);
    setIsIncorrect(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCorrect) {
      handleNextWord();
    } else {
      if (input.toLowerCase() === currentWord?.word.toLowerCase()) {
        playCorrect();
        setIsCorrect(true);
        setIsIncorrect(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        playWrong();
        setIsIncorrect(true);
        setTimeout(() => {
          setIsIncorrect(false);
        }, 400);
      }
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -3, 3, -3, 3, 0],
      transition: {
        duration: 0.5,
      },
    },
    normal: {
      x: 0,
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
    <div className="max-w-2xl mx-auto relative">
      <div className="settings-container absolute right-1 top-1">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100 font-semibold">
                Zorluk seviyesi
              </div>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    setIsSettingsOpen(false);
                    setInput('');
                    setIsCorrect(false);
                    setIsIncorrect(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    difficulty === level
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentWord && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.word}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8 mt-12"
          >
              <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                ...(!isCorrect && isIncorrect ? shakeAnimation.shake : shakeAnimation.normal)
              }}
              className={`text-4xl font-bold text-center mb-8 ${
                !isCorrect && isIncorrect ? 'text-red-500' : 'text-gray-900'
              }`}
            >
              {currentWord.word}
            </motion.h2>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Kelimeyi yazın..."
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className={`px-6 w-32 ${
                    isCorrect 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white rounded-lg transition-colors`}
                >
                  {isCorrect ? 'İleri' : 'Kontrol Et'}
                </button>
                <button
                  type="button"
                  className={`px-6 w-18 bg-orange-400 hover:bg-orange-600 text-white rounded-lg transition-colors`}
                >
                  Geç
                </button>
              </div>
            </form>

            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Anlam:</h3>
                    <p className="text-gray-700">{currentWord.definition}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Örnek:</h3>
                    <p className="text-gray-700 italic">{currentWord.example}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}

      {!currentWord && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Kelime bulunamadı, lütfen daha sonra tekrar deneyin.</p>
        </div>
      )}
    </div>
  );
}