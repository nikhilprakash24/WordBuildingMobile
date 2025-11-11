/**
 * Enhanced Socket.IO event handlers
 * Supports both timer-based and turn-based game modes
 */

import { Server as SocketIOServer } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
} from '../../../shared/types/socket.events';
import { gameManager } from '../services/game/GameManager';
import { PlayerStatus } from '../../../shared/types/game.types';
import { getDefaultRuleSet } from '../services/rules';
import { GameMode as GM } from '../../../shared/types/rules.types';

type IO = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function setupSocketHandlers(io: IO) {
  io.on('connection', socket => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Generate player ID
    const playerId = socket.id;
    socket.data.playerId = playerId;

    // Send connection confirmation
    socket.emit('connection:established', playerId);

    // Room creation
    socket.on('room:create', (roomName, callback) => {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create host player
      const hostPlayer = {
        id: playerId,
        name: socket.data.playerName || 'Host',
        status: PlayerStatus.CONNECTED,
        score: 0,
        isHost: true,
      };

      // Get default rule set for timer-based mode
      const ruleSet = getDefaultRuleSet(GM.TIMER_BASED);

      // Create game session
      const session = gameManager.createGame(
        roomId,
        {
          theme: 'general',
          category: 'general',
          timeLimit: 120,
          minWordLength: 3,
          maxWordLength: 15,
          rules: ruleSet.rules,
        },
        ruleSet,
        hostPlayer
      );

      socket.join(roomId);
      socket.data.roomId = roomId;

      console.log(`📦 Room created: ${roomId} by ${socket.id}`);
      console.log(`   Mode: ${session.mode}, Rules: ${ruleSet.name}`);

      callback(roomId);

      // Send initial game state
      socket.emit('room:joined', roomId, session.state);
    });

    // Join existing room
    socket.on('room:join', (roomId, playerName, callback) => {
      const session = gameManager.getGame(roomId);

      if (!session) {
        callback(false, 'Room not found');
        return;
      }

      const newPlayer = {
        id: playerId,
        name: playerName,
        status: PlayerStatus.CONNECTED,
        score: 0,
        isHost: false,
      };

      const success = gameManager.addPlayer(roomId, newPlayer);

      if (!success) {
        callback(false, 'Room is full or game already started');
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.playerName = playerName;

      console.log(`👤 Player ${playerName} joined room ${roomId}`);
      callback(true);

      // Notify room of new player
      socket.to(roomId).emit('room:playerJoined', newPlayer);

      // Send current game state to new player
      socket.emit('room:joined', roomId, session.state);
    });

    // Leave room
    socket.on('room:leave', () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      gameManager.removePlayer(roomId, playerId);
      socket.leave(roomId);

      console.log(`👋 Player ${socket.id} left room ${roomId}`);
      socket.to(roomId).emit('room:playerLeft', playerId);

      socket.data.roomId = undefined;
    });

    // List available rooms
    socket.on('room:list', callback => {
      const games = gameManager.getAllGames();
      const rooms = games.map(session => ({
        id: session.state.id,
        name: `Room ${session.state.id.slice(-6)}`,
        playerCount: session.state.players.length,
        maxPlayers: 8,
        phase: session.state.phase,
        isPrivate: false,
      }));

      callback(rooms);
    });

    // Configure game (host only)
    socket.on('game:configure', config => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const session = gameManager.getGame(roomId);
      if (!session) return;

      // Verify host
      const player = session.state.players.find(p => p.id === playerId);
      if (!player || !player.isHost) return;

      // Update config
      session.state.config = { ...session.state.config, ...config };

      // Broadcast update
      io.to(roomId).emit('game:configUpdated', session.state.config);

      console.log(`⚙️  Game config updated in room ${roomId}`);
    });

    // Player ready
    socket.on('game:ready', () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const session = gameManager.getGame(roomId);
      if (!session) return;

      const player = session.state.players.find(p => p.id === playerId);
      if (player) {
        player.status = PlayerStatus.READY;
        io.to(roomId).emit('room:updated', session.state);
      }
    });

    // Start game (host only)
    socket.on('game:start', () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const session = gameManager.getGame(roomId);
      if (!session) return;

      // Verify host
      const player = session.state.players.find(p => p.id === playerId);
      if (!player || !player.isHost) return;

      // Start game
      const success = gameManager.startGame(roomId);
      if (!success) return;

      console.log(`🎮 Game started in room ${roomId}`);
      console.log(`   Mode: ${session.mode}`);

      // Broadcast game started
      io.to(roomId).emit('game:started', Date.now());
      io.to(roomId).emit('game:stateChanged', session.state);
    });

    // Submit word
    socket.on('game:submitWord', word => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const session = gameManager.getGame(roomId);
      if (!session) return;

      // Create submission
      const submission = {
        playerId,
        word,
        timestamp: Date.now(),
      };

      // For turn-based, check if it's player's turn
      if (session.mode === GM.TURN_BASED) {
        if (session.currentTurn !== playerId) {
          socket.emit('error', 'Not your turn');
          return;
        }
      }

      // Submit word
      const success = gameManager.submitWord(roomId, submission);

      if (success) {
        console.log(`📝 Word submitted in room ${roomId}: "${word}" by ${socket.data.playerName}`);

        // Broadcast to room (server will validate)
        io.to(roomId).emit('word:validated', submission);

        // For turn-based, notify turn change
        if (session.mode === GM.TURN_BASED) {
          const nextPlayer = gameManager.getCurrentTurnPlayer(roomId);
          if (nextPlayer) {
            console.log(`   Next turn: ${nextPlayer.name}`);
          }
        }

        // Broadcast updated game state
        io.to(roomId).emit('game:stateChanged', session.state);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      const roomId = socket.data.roomId;

      if (roomId) {
        const stillExists = gameManager.removePlayer(roomId, playerId);

        if (stillExists) {
          socket.to(roomId).emit('room:playerLeft', playerId);

          // Get updated state
          const session = gameManager.getGame(roomId);
          if (session) {
            socket.to(roomId).emit('game:stateChanged', session.state);
          }
        }
      }
    });
  });

  console.log('✅ Socket handlers initialized');
  console.log('   Supported modes: Timer-based, Turn-based');
}
