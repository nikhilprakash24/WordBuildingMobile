/**
 * Server-side rules - minimal implementation for game creation
 */

import { RuleSet, GameMode } from '../../../../shared/types/rules.types';
import { GameMode as GM, RuleType } from '../../../../shared/types/rules.types';

// Default quick play rule set for timer-based games
const QUICK_PLAY: RuleSet = {
  id: 'quick-play',
  name: 'Quick Play',
  description: 'Fast-paced 2-minute word building',
  gameMode: GM.TIMER_BASED,
  isDefault: true,
  config: {
    mode: GM.TIMER_BASED,
    roundDuration: 120,
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
};

// Default turn-based rule set
const CLASSIC_TURNS: RuleSet = {
  id: 'classic-turns',
  name: 'Classic Turns',
  description: 'Take turns building words',
  gameMode: GM.TURN_BASED,
  isDefault: true,
  config: {
    mode: GM.TURN_BASED,
    turnDuration: 24,
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
      description: 'Cannot submit the same word twice',
      type: RuleType.VALIDATION,
      enabled: true,
      overridable: false,
    },
  ],
};

export function getDefaultRuleSet(gameMode: GameMode): RuleSet {
  return gameMode === GM.TIMER_BASED ? QUICK_PLAY : CLASSIC_TURNS;
}

export function getAllRuleSets(): RuleSet[] {
  return [QUICK_PLAY, CLASSIC_TURNS];
}
