/**
 * Shared types between client and server
 */

export enum GamePhase {
  LOBBY = 'LOBBY',
  RULE_CONFIG = 'RULE_CONFIG',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  SCORING = 'SCORING',
  COMPLETE = 'COMPLETE',
}

export enum PlayerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  READY = 'READY',
}

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
  score: number;
  isHost: boolean;
}

export interface WordSubmission {
  playerId: string;
  word: string;
  timestamp: number;
  isValid?: boolean;
  score?: number;
}

export interface GameRule {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'scoring' | 'timing';
  enabled: boolean;
  overridable: boolean;
  config?: Record<string, any>;
}

export interface GameConfig {
  theme?: string;
  category?: string;
  timeLimit?: number;
  minWordLength?: number;
  maxWordLength?: number;
  rules: GameRule[];
}

export interface GameState {
  id: string;
  phase: GamePhase;
  players: Player[];
  config: GameConfig;
  submissions: WordSubmission[];
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
}

export interface RoomInfo {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  phase: GamePhase;
  isPrivate: boolean;
}
