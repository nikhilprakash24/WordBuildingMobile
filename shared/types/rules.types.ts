/**
 * Rule Engine Types
 * Defines the structure for game rules and configurations
 */

export enum GameMode {
  TIMER_BASED = 'TIMER_BASED', // Real-time, everyone playing together
  TURN_BASED = 'TURN_BASED',   // Asynchronous, like Words with Friends
}

export enum RuleType {
  VALIDATION = 'validation',   // Word validation rules
  SCORING = 'scoring',         // Scoring modification rules
  TIMING = 'timing',           // Time-based rules
  GAMEPLAY = 'gameplay',       // General gameplay rules
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  type: RuleType;
  enabled: boolean;
  overridable: boolean;
  config?: Record<string, any>;
}

export interface GameModeConfig {
  mode: GameMode;
  roundDuration?: number;      // For timer-based (seconds)
  turnDuration?: number;       // For turn-based (hours)
  maxTurnsPerPlayer?: number;  // For turn-based
  simultaneousTurns?: boolean; // For turn-based (all players play each round)
}

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  gameMode: GameMode;
  rules: Rule[];
  config: GameModeConfig;
  isDefault?: boolean;
}

export interface RuleValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Built-in rule validators
export type RuleValidator = (word: string, context: any) => boolean;

export interface RuleValidators {
  [key: string]: RuleValidator;
}
