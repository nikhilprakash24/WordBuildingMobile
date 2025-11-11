/**
 * Socket.io event types for type-safe client-server communication
 */

import { GameState, GameConfig, WordSubmission, Player } from './game.types';

// Client -> Server Events
export interface ClientToServerEvents {
  // Room Management
  'room:create': (roomName: string, callback: (roomId: string) => void) => void;
  'room:join': (roomId: string, playerName: string, callback: (success: boolean, error?: string) => void) => void;
  'room:leave': () => void;
  'room:list': (callback: (rooms: any[]) => void) => void;

  // Game Configuration
  'game:configure': (config: GameConfig) => void;
  'game:ready': () => void;
  'game:start': () => void;

  // Gameplay
  'game:submitWord': (word: string) => void;
  'game:requestHint': () => void;

  // Player Actions
  'player:setName': (name: string) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  // Connection
  'connection:established': (playerId: string) => void;

  // Room Events
  'room:joined': (roomId: string, gameState: GameState) => void;
  'room:playerJoined': (player: Player) => void;
  'room:playerLeft': (playerId: string) => void;
  'room:updated': (gameState: GameState) => void;

  // Game State Updates
  'game:stateChanged': (gameState: GameState) => void;
  'game:configUpdated': (config: GameConfig) => void;
  'game:started': (startTime: number) => void;
  'game:ended': (finalState: GameState) => void;

  // Word Validation
  'word:validated': (submission: WordSubmission) => void;
  'word:rejected': (word: string, reason: string) => void;

  // Scoring
  'score:updated': (playerId: string, newScore: number) => void;

  // Errors
  'error': (message: string) => void;
}

// Inter-server Events (for future scaling)
export interface InterServerEvents {
  ping: () => void;
}

// Socket Data (attached to each socket)
export interface SocketData {
  playerId: string;
  playerName: string;
  roomId?: string;
}
