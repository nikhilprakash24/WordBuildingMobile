"use strict";
/**
 * Shared constants between client and server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORIES = exports.SCORING = exports.GAME_LIMITS = exports.DEFAULT_GAME_CONFIG = void 0;
exports.DEFAULT_GAME_CONFIG = {
    timeLimit: 120, // 2 minutes per round
    minWordLength: 3,
    maxWordLength: 15,
};
exports.GAME_LIMITS = {
    MIN_PLAYERS: 1,
    MAX_PLAYERS: 8,
    MIN_WORD_LENGTH: 2,
    MAX_WORD_LENGTH: 20,
    ROOM_NAME_MAX_LENGTH: 30,
    PLAYER_NAME_MAX_LENGTH: 20,
};
exports.SCORING = {
    BASE_POINTS_PER_LETTER: 10,
    BONUS_LONG_WORD: 50, // 7+ letters
    BONUS_RARE_WORD: 100,
    PENALTY_INVALID_WORD: -5,
};
exports.CATEGORIES = [
    'general',
    'countries',
    'animals',
    'food',
    'technology',
    'sports',
    'science',
    'arts',
];
//# sourceMappingURL=index.js.map