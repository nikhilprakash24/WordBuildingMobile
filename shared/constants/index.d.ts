/**
 * Shared constants between client and server
 */
export declare const DEFAULT_GAME_CONFIG: {
    timeLimit: number;
    minWordLength: number;
    maxWordLength: number;
};
export declare const GAME_LIMITS: {
    MIN_PLAYERS: number;
    MAX_PLAYERS: number;
    MIN_WORD_LENGTH: number;
    MAX_WORD_LENGTH: number;
    ROOM_NAME_MAX_LENGTH: number;
    PLAYER_NAME_MAX_LENGTH: number;
};
export declare const SCORING: {
    BASE_POINTS_PER_LETTER: number;
    BONUS_LONG_WORD: number;
    BONUS_RARE_WORD: number;
    PENALTY_INVALID_WORD: number;
};
export declare const CATEGORIES: readonly ["general", "countries", "animals", "food", "technology", "sports", "science", "arts"];
export type Category = typeof CATEGORIES[number];
//# sourceMappingURL=index.d.ts.map