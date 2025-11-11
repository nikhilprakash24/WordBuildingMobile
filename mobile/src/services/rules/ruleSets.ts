/**
 * Pre-configured Rule Sets
 * Ready-to-use game configurations
 */

import { RuleSet, GameMode, RuleType } from '../../../../shared/types/rules.types';

export const DEFAULT_RULE_SETS: RuleSet[] = [
  // Quick Play - Timer-based, 2 minutes
  {
    id: 'quick-play',
    name: 'Quick Play',
    description: 'Fast-paced 2-minute word building with friends',
    gameMode: GameMode.TIMER_BASED,
    isDefault: true,
    config: {
      mode: GameMode.TIMER_BASED,
      roundDuration: 120, // 2 minutes
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 3 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 3 },
      },
      {
        id: 'maxLength',
        name: 'Maximum Length',
        description: 'Words must be at most 15 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { maxLength: 15 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },

  // Marathon - Timer-based, 5 minutes
  {
    id: 'marathon',
    name: 'Marathon',
    description: '5-minute endurance challenge',
    gameMode: GameMode.TIMER_BASED,
    config: {
      mode: GameMode.TIMER_BASED,
      roundDuration: 300, // 5 minutes
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 3 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 3 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },

  // Classic Turn-Based
  {
    id: 'classic-turns',
    name: 'Classic Turns',
    description: 'Take turns building words (like Words with Friends)',
    gameMode: GameMode.TURN_BASED,
    isDefault: true,
    config: {
      mode: GameMode.TURN_BASED,
      turnDuration: 24, // 24 hours per turn
      maxTurnsPerPlayer: 10,
      simultaneousTurns: false,
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 3 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 3 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice in a game',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },

  // Speed Rounds - Turn-based with short turns
  {
    id: 'speed-rounds',
    name: 'Speed Rounds',
    description: 'Quick turn-based with 1-hour turns',
    gameMode: GameMode.TURN_BASED,
    config: {
      mode: GameMode.TURN_BASED,
      turnDuration: 1, // 1 hour per turn
      maxTurnsPerPlayer: 5,
      simultaneousTurns: false,
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 4 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 4 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },

  // Challenge Mode - Hard rules
  {
    id: 'challenge',
    name: 'Challenge Mode',
    description: 'Advanced rules for experienced players',
    gameMode: GameMode.TIMER_BASED,
    config: {
      mode: GameMode.TIMER_BASED,
      roundDuration: 180, // 3 minutes
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 5 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 5 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
      {
        id: 'difficultyMultiplier',
        name: 'Hard Difficulty',
        description: '1.5x score multiplier',
        type: RuleType.SCORING,
        enabled: true,
        overridable: false,
        config: { multiplier: 1.5 },
      },
    ],
  },

  // Party Mode - Simultaneous turns
  {
    id: 'party-mode',
    name: 'Party Mode',
    description: 'Everyone plays simultaneously in rounds',
    gameMode: GameMode.TURN_BASED,
    config: {
      mode: GameMode.TURN_BASED,
      turnDuration: 0.1, // 6 minutes per round
      maxTurnsPerPlayer: 3,
      simultaneousTurns: true, // All players play each round
    },
    rules: [
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 3 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 3 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice in a round',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },

  // Letter Challenge
  {
    id: 'letter-challenge',
    name: 'Letter Challenge',
    description: 'Words must start with a specific letter',
    gameMode: GameMode.TIMER_BASED,
    config: {
      mode: GameMode.TIMER_BASED,
      roundDuration: 120,
    },
    rules: [
      {
        id: 'mustStartWith',
        name: 'Must Start With',
        description: 'Words must start with the letter "S"',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { letter: 'S', validator: 'mustStartWith' },
      },
      {
        id: 'minLength',
        name: 'Minimum Length',
        description: 'Words must be at least 3 letters',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: true,
        config: { minLength: 3 },
      },
      {
        id: 'noRepeatedWords',
        name: 'No Repeated Words',
        description: 'Cannot submit the same word twice',
        type: RuleType.VALIDATION,
        enabled: true,
        overridable: false,
      },
    ],
  },
];

/**
 * Get rule set by ID
 */
export function getRuleSetById(id: string): RuleSet | undefined {
  return DEFAULT_RULE_SETS.find(ruleSet => ruleSet.id === id);
}

/**
 * Get default rule set for a game mode
 */
export function getDefaultRuleSet(gameMode: GameMode): RuleSet {
  const defaultSet = DEFAULT_RULE_SETS.find(
    rs => rs.gameMode === gameMode && rs.isDefault
  );
  return defaultSet || DEFAULT_RULE_SETS[0];
}

/**
 * Get all rule sets for a game mode
 */
export function getRuleSetsForMode(gameMode: GameMode): RuleSet[] {
  return DEFAULT_RULE_SETS.filter(rs => rs.gameMode === gameMode);
}

/**
 * Get all available rule sets
 */
export function getAllRuleSets(): RuleSet[] {
  return DEFAULT_RULE_SETS;
}
