/**
 * Game Manager Service
 * Manages game sessions for both timer-based and turn-based modes
 */

import type { GameState, Player, WordSubmission, GameConfig } from '../../../../shared/types/game.types';
import { GamePhase, PlayerStatus } from '../../../../shared/types/game.types';
import type { RuleSet, GameMode } from '../../../../shared/types/rules.types';
import { GameMode as GM } from '../../../../shared/types/rules.types';

export interface GameSession {
  id: string;
  state: GameState;
  mode: GameMode;
  currentTurn?: string; // Player ID (for turn-based)
  turnDeadline?: number; // Timestamp (for turn-based)
  roundDeadline?: number; // Timestamp (for timer-based)
  createdAt: number;
  lastActivity: number;
}

export class GameManager {
  private games: Map<string, GameSession> = new Map();

  /**
   * Create a new game session
   */
  createGame(
    roomId: string,
    config: GameConfig,
    ruleSet: RuleSet,
    hostPlayer: Player
  ): GameSession {
    const gameState: GameState = {
      id: roomId,
      phase: GamePhase.LOBBY,
      players: [hostPlayer],
      config,
      submissions: [],
      createdAt: Date.now(),
    };

    const session: GameSession = {
      id: roomId,
      state: gameState,
      mode: ruleSet.config.mode,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    this.games.set(roomId, session);
    return session;
  }

  /**
   * Get game session
   */
  getGame(roomId: string): GameSession | undefined {
    return this.games.get(roomId);
  }

  /**
   * Get all active games
   */
  getAllGames(): GameSession[] {
    return Array.from(this.games.values());
  }

  /**
   * Add player to game
   */
  addPlayer(roomId: string, player: Player): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    // Check if game is full
    const maxPlayers = 8; // TODO: Get from config
    if (session.state.players.length >= maxPlayers) {
      return false;
    }

    // Check if game already started
    if (session.state.phase !== GamePhase.LOBBY) {
      return false;
    }

    session.state.players.push(player);
    session.lastActivity = Date.now();
    return true;
  }

  /**
   * Remove player from game
   */
  removePlayer(roomId: string, playerId: string): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    const playerIndex = session.state.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;

    // Mark as disconnected instead of removing during active game
    if (session.state.phase === GamePhase.PLAYING || session.state.phase === GamePhase.RULE_CONFIG) {
      session.state.players[playerIndex].status = PlayerStatus.DISCONNECTED;
    } else {
      session.state.players.splice(playerIndex, 1);
    }

    session.lastActivity = Date.now();

    // Delete game if no players left
    if (session.state.players.length === 0) {
      this.games.delete(roomId);
      return false;
    }

    return true;
  }

  /**
   * Start game (move to RULE_CONFIG or PLAYING phase)
   */
  startGame(roomId: string): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    if (session.state.phase !== GamePhase.LOBBY) return false;

    // Move to playing phase
    session.state.phase = GamePhase.PLAYING;
    session.state.startedAt = Date.now();
    session.lastActivity = Date.now();

    // Set deadlines based on game mode
    if (session.mode === GM.TIMER_BASED) {
      const duration = session.state.config.roundDuration || 120;
      session.roundDeadline = Date.now() + duration * 1000;
    } else if (session.mode === GM.TURN_BASED) {
      // Set first player's turn
      if (session.state.players.length > 0) {
        session.currentTurn = session.state.players[0].id;
        const turnDuration = session.state.config.turnDuration || 24;
        session.turnDeadline = Date.now() + turnDuration * 60 * 60 * 1000; // Hours to ms
      }
    }

    return true;
  }

  /**
   * Submit word
   */
  submitWord(roomId: string, submission: WordSubmission): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    if (session.state.phase !== GamePhase.PLAYING) return false;

    // For turn-based, verify it's the player's turn
    if (session.mode === GM.TURN_BASED) {
      if (session.currentTurn !== submission.playerId) {
        return false; // Not player's turn
      }
    }

    session.state.submissions.push(submission);
    session.lastActivity = Date.now();

    // For turn-based, advance to next player
    if (session.mode === GM.TURN_BASED) {
      this.advanceTurn(roomId);
    }

    return true;
  }

  /**
   * Advance to next player's turn (turn-based mode)
   */
  private advanceTurn(roomId: string): void {
    const session = this.games.get(roomId);
    if (!session || session.mode !== GM.TURN_BASED) return;

    const currentIndex = session.state.players.findIndex(
      p => p.id === session.currentTurn
    );

    if (currentIndex === -1) return;

    // Find next active player
    let nextIndex = (currentIndex + 1) % session.state.players.length;
    let attempts = 0;

    while (attempts < session.state.players.length) {
      const nextPlayer = session.state.players[nextIndex];
      if (nextPlayer.status === PlayerStatus.CONNECTED || nextPlayer.status === PlayerStatus.READY) {
        session.currentTurn = nextPlayer.id;
        const turnDuration = session.state.config.turnDuration || 24;
        session.turnDeadline = Date.now() + turnDuration * 60 * 60 * 1000;
        return;
      }

      nextIndex = (nextIndex + 1) % session.state.players.length;
      attempts++;
    }

    // No active players - end game
    this.endGame(roomId);
  }

  /**
   * Check for expired turns/rounds
   */
  checkDeadlines(): void {
    const now = Date.now();

    for (const [roomId, session] of this.games.entries()) {
      // Check timer-based round deadline
      if (session.mode === GM.TIMER_BASED && session.roundDeadline) {
        if (now >= session.roundDeadline) {
          this.endGame(roomId);
        }
      }

      // Check turn-based turn deadline
      if (session.mode === GM.TURN_BASED && session.turnDeadline) {
        if (now >= session.turnDeadline) {
          // Skip this player's turn
          this.advanceTurn(roomId);
        }
      }

      // Clean up inactive games (1 hour for timer, 7 days for turn-based)
      const inactiveThreshold = session.mode === GM.TIMER_BASED
        ? 60 * 60 * 1000 // 1 hour
        : 7 * 24 * 60 * 60 * 1000; // 7 days

      if (now - session.lastActivity > inactiveThreshold) {
        this.games.delete(roomId);
      }
    }
  }

  /**
   * End game
   */
  endGame(roomId: string): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    session.state.phase = GamePhase.COMPLETE;
    session.state.endedAt = Date.now();
    session.lastActivity = Date.now();

    // Calculate final scores
    // (This would be more sophisticated in production)

    return true;
  }

  /**
   * Update player score
   */
  updatePlayerScore(roomId: string, playerId: string, score: number): boolean {
    const session = this.games.get(roomId);
    if (!session) return false;

    const player = session.state.players.find(p => p.id === playerId);
    if (!player) return false;

    player.score = score;
    session.lastActivity = Date.now();
    return true;
  }

  /**
   * Get current turn player (for turn-based)
   */
  getCurrentTurnPlayer(roomId: string): Player | undefined {
    const session = this.games.get(roomId);
    if (!session || session.mode !== GM.TURN_BASED) return undefined;

    return session.state.players.find(p => p.id === session.currentTurn);
  }

  /**
   * Get time remaining (for timer-based)
   */
  getTimeRemaining(roomId: string): number | undefined {
    const session = this.games.get(roomId);
    if (!session || session.mode !== GM.TIMER_BASED || !session.roundDeadline) {
      return undefined;
    }

    return Math.max(0, session.roundDeadline - Date.now());
  }

  /**
   * Delete game
   */
  deleteGame(roomId: string): boolean {
    return this.games.delete(roomId);
  }
}

// Singleton instance
export const gameManager = new GameManager();

// Start deadline checker (runs every 10 seconds)
setInterval(() => {
  gameManager.checkDeadlines();
}, 10000);
