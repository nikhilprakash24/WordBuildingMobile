/**
 * Socket.IO Client Service
 * Manages real-time connection to game server
 */

import { io, Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../../shared/types/socket.events';
import type { GameState, Player } from '../../../../shared/types/game.types';

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketService {
  private socket: ClientSocket | null = null;
  private serverUrl: string;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
  }

  /**
   * Connect to server
   */
  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket.id!);
        return;
      }

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server:', this.socket?.id);
      });

      this.socket.on('connection:established', (playerId) => {
        console.log('🎮 Player ID received:', playerId);
        resolve(playerId);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected:', reason);
        this.emit('disconnected', reason);
      });

      // Timeout if connection takes too long
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Create a new room
   */
  createRoom(roomName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected'));
        return;
      }

      this.socket.emit('room:create', roomName, (roomId: string) => {
        console.log('📦 Room created:', roomId);
        resolve(roomId);
      });
    });
  }

  /**
   * Join an existing room
   */
  joinRoom(roomId: string, playerName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected'));
        return;
      }

      this.socket.emit(
        'room:join',
        roomId,
        playerName,
        (success: boolean, error?: string) => {
          if (success) {
            console.log('👤 Joined room:', roomId);
            resolve();
          } else {
            console.error('❌ Failed to join room:', error);
            reject(new Error(error || 'Failed to join room'));
          }
        }
      );
    });
  }

  /**
   * Leave current room
   */
  leaveRoom(): void {
    if (this.socket) {
      this.socket.emit('room:leave');
    }
  }

  /**
   * Get list of available rooms
   */
  listRooms(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected'));
        return;
      }

      this.socket.emit('room:list', (rooms: any[]) => {
        resolve(rooms);
      });
    });
  }

  /**
   * Mark player as ready
   */
  setReady(): void {
    if (this.socket) {
      this.socket.emit('game:ready');
    }
  }

  /**
   * Start game (host only)
   */
  startGame(): void {
    if (this.socket) {
      this.socket.emit('game:start');
    }
  }

  /**
   * Submit a word
   */
  submitWord(word: string): void {
    if (this.socket) {
      this.socket.emit('game:submitWord', word);
    }
  }

  /**
   * Subscribe to server events
   */
  on<T = any>(event: string, callback: (...args: T[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Set up socket listener if not already set
    if (this.socket) {
      this.socket.on(event as any, callback as any);
    }
  }

  /**
   * Unsubscribe from server events
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      if (this.socket) {
        this.socket.off(event as any, callback as any);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event as any);
      }
    }
  }

  /**
   * Emit custom event (for internal use)
   */
  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * Subscribe to room joined event
   */
  onRoomJoined(callback: (roomId: string, gameState: GameState) => void): void {
    this.on('room:joined', callback);
  }

  /**
   * Subscribe to player joined event
   */
  onPlayerJoined(callback: (player: Player) => void): void {
    this.on('room:playerJoined', callback);
  }

  /**
   * Subscribe to player left event
   */
  onPlayerLeft(callback: (playerId: string) => void): void {
    this.on('room:playerLeft', callback);
  }

  /**
   * Subscribe to game state changed event
   */
  onGameStateChanged(callback: (gameState: GameState) => void): void {
    this.on('game:stateChanged', callback);
  }

  /**
   * Subscribe to game started event
   */
  onGameStarted(callback: (startTime: number) => void): void {
    this.on('game:started', callback);
  }

  /**
   * Subscribe to word validated event
   */
  onWordValidated(callback: (submission: any) => void): void {
    this.on('word:validated', callback);
  }

  /**
   * Subscribe to errors
   */
  onError(callback: (error: string) => void): void {
    this.on('error', callback);
  }

  /**
   * Subscribe to disconnection
   */
  onDisconnected(callback: (reason: string) => void): void {
    this.on('disconnected', callback);
  }
}

// Singleton instance
export const socketService = new SocketService();

export default SocketService;
