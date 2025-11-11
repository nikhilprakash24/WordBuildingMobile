/**
 * Shared constants between client and server
 */

export const DEFAULT_GAME_CONFIG = {
  timeLimit: 120, // 2 minutes per round
  minWordLength: 3,
  maxWordLength: 15,
};

export const GAME_LIMITS = {
  MIN_PLAYERS: 1,
  MAX_PLAYERS: 8,
  MIN_WORD_LENGTH: 2,
  MAX_WORD_LENGTH: 20,
  ROOM_NAME_MAX_LENGTH: 30,
  PLAYER_NAME_MAX_LENGTH: 20,
};

export const SCORING = {
  BASE_POINTS_PER_LETTER: 10,
  BONUS_LONG_WORD: 50, // 7+ letters
  BONUS_RARE_WORD: 100,
  PENALTY_INVALID_WORD: -5,
};

export const CATEGORIES = [
  'general',
  'countries',
  'animals',
  'food',
  'technology',
  'sports',
  'science',
  'arts',
] as const;

export type Category = typeof CATEGORIES[number];
