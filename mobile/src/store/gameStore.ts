/**
 * Game State Management with Zustand
 * Manages offline single-player game state
 */

import { create } from 'zustand';
import { DictionaryService, ValidationResult } from '../services/dictionary';
import { ScoringService, ScoreBreakdown } from '../services/game';

export interface WordEntry {
  word: string;
  isValid: boolean;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
  timestamp: number;
  reason?: string;
}

export interface GameConfig {
  category: string;
  minWordLength: number;
  maxWordLength: number;
  roundDuration: number; // seconds
}

export interface GameStats {
  totalScore: number;
  validWords: number;
  invalidWords: number;
  averageScore: number;
  longestWord: string;
  highestScoringWord: string;
  comboCount: number;
}

interface GameState {
  // Game configuration
  config: GameConfig;

  // Game status
  isPlaying: boolean;
  roundStartTime: number | null;
  roundEndTime: number | null;

  // Game data
  submittedWords: WordEntry[];
  currentInput: string;
  stats: GameStats;

  // Actions
  startGame: (category?: string) => void;
  endGame: () => void;
  submitWord: (word: string) => void;
  setCurrentInput: (input: string) => void;
  resetGame: () => void;
  updateConfig: (config: Partial<GameConfig>) => void;
}

const initialConfig: GameConfig = {
  category: 'general',
  minWordLength: 3,
  maxWordLength: 15,
  roundDuration: 120, // 2 minutes
};

const initialStats: GameStats = {
  totalScore: 0,
  validWords: 0,
  invalidWords: 0,
  averageScore: 0,
  longestWord: '',
  highestScoringWord: '',
  comboCount: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  config: initialConfig,
  isPlaying: false,
  roundStartTime: null,
  roundEndTime: null,
  submittedWords: [],
  currentInput: '',
  stats: initialStats,

  // Start a new game
  startGame: (category = 'general') => {
    set({
      isPlaying: true,
      roundStartTime: Date.now(),
      roundEndTime: null,
      submittedWords: [],
      stats: initialStats,
      config: { ...get().config, category },
      currentInput: '',
    });
  },

  // End the current game
  endGame: () => {
    set({
      isPlaying: false,
      roundEndTime: Date.now(),
    });
  },

  // Submit a word for validation and scoring
  submitWord: (word: string) => {
    const state = get();

    if (!state.isPlaying) return;

    // Check if word already submitted
    const alreadySubmitted = state.submittedWords.some(
      entry => entry.word.toLowerCase() === word.toLowerCase()
    );

    if (alreadySubmitted) {
      // Add as invalid with reason
      const entry: WordEntry = {
        word,
        isValid: false,
        score: 0,
        timestamp: Date.now(),
        reason: 'Word already submitted',
      };

      set({
        submittedWords: [...state.submittedWords, entry],
        currentInput: '',
      });
      return;
    }

    // Validate word
    const validation: ValidationResult = DictionaryService.validateWord(word, {
      category: state.config.category,
      minLength: state.config.minWordLength,
      maxLength: state.config.maxWordLength,
    });

    if (validation.isValid) {
      // Calculate score
      const submissionTime = state.roundStartTime
        ? Date.now() - state.roundStartTime
        : undefined;

      const scoreBreakdown = ScoringService.calculateScore({
        wordLength: word.length,
        submissionTime,
        roundDuration: state.config.roundDuration * 1000,
        isRareWord: ScoringService.isRareWord(word),
      });

      // Apply combo multiplier
      const newCombo = state.stats.comboCount + 1;
      const comboMultiplier = ScoringService.getComboMultiplier(newCombo);
      const finalScore = Math.round(scoreBreakdown.totalScore * comboMultiplier);

      // Create entry
      const entry: WordEntry = {
        word: validation.word,
        isValid: true,
        score: finalScore,
        scoreBreakdown: {
          ...scoreBreakdown,
          totalScore: finalScore,
        },
        timestamp: Date.now(),
      };

      // Update stats
      const newTotalScore = state.stats.totalScore + finalScore;
      const newValidWords = state.stats.validWords + 1;
      const newLongestWord =
        word.length > state.stats.longestWord.length
          ? word
          : state.stats.longestWord;
      const newHighestScoringWord =
        finalScore >
        (state.submittedWords.find(w => w.word === state.stats.highestScoringWord)
          ?.score || 0)
          ? word
          : state.stats.highestScoringWord;

      set({
        submittedWords: [...state.submittedWords, entry],
        currentInput: '',
        stats: {
          ...state.stats,
          totalScore: newTotalScore,
          validWords: newValidWords,
          averageScore: ScoringService.calculateAverage(newTotalScore, newValidWords),
          longestWord: newLongestWord,
          highestScoringWord: newHighestScoringWord,
          comboCount: newCombo,
        },
      });
    } else {
      // Invalid word - add penalty
      const penalty = ScoringService.calculatePenalty();

      const entry: WordEntry = {
        word,
        isValid: false,
        score: penalty,
        timestamp: Date.now(),
        reason: validation.reason,
      };

      set({
        submittedWords: [...state.submittedWords, entry],
        currentInput: '',
        stats: {
          ...state.stats,
          totalScore: Math.max(0, state.stats.totalScore + penalty),
          invalidWords: state.stats.invalidWords + 1,
          comboCount: 0, // Reset combo
        },
      });
    }
  },

  // Update current input
  setCurrentInput: (input: string) => {
    set({ currentInput: input });
  },

  // Reset game to initial state
  resetGame: () => {
    set({
      isPlaying: false,
      roundStartTime: null,
      roundEndTime: null,
      submittedWords: [],
      currentInput: '',
      stats: initialStats,
    });
  },

  // Update game configuration
  updateConfig: (newConfig: Partial<GameConfig>) => {
    set({
      config: { ...get().config, ...newConfig },
    });
  },
}));

export default useGameStore;
