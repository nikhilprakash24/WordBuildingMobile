/**
 * Socket.io event types for type-safe client-server communication
 */
import { GameState, GameConfig, WordSubmission, Player } from './game.types';
export interface ClientToServerEvents {
    'room:create': (roomName: string, callback: (roomId: string) => void) => void;
    'room:join': (roomId: string, playerName: string, callback: (success: boolean, error?: string) => void) => void;
    'room:leave': () => void;
    'room:list': (callback: (rooms: any[]) => void) => void;
    'game:configure': (config: GameConfig) => void;
    'game:ready': () => void;
    'game:start': () => void;
    'game:submitWord': (word: string) => void;
    'game:requestHint': () => void;
    'player:setName': (name: string) => void;
}
export interface ServerToClientEvents {
    'connection:established': (playerId: string) => void;
    'room:joined': (roomId: string, gameState: GameState) => void;
    'room:playerJoined': (player: Player) => void;
    'room:playerLeft': (playerId: string) => void;
    'room:updated': (gameState: GameState) => void;
    'game:stateChanged': (gameState: GameState) => void;
    'game:configUpdated': (config: GameConfig) => void;
    'game:started': (startTime: number) => void;
    'game:ended': (finalState: GameState) => void;
    'word:validated': (submission: WordSubmission) => void;
    'word:rejected': (word: string, reason: string) => void;
    'score:updated': (playerId: string, newScore: number) => void;
    'error': (message: string) => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    playerId: string;
    playerName: string;
    roomId?: string;
}
//# sourceMappingURL=socket.events.d.ts.map