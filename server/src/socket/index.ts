/**
 * Socket.IO event handlers
 */

import { Server as SocketIOServer } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
} from '../../../shared/types/socket.events';

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

    // Room management handlers
    socket.on('room:create', (roomName, callback) => {
      const roomId = `room_${Date.now()}`;
      socket.join(roomId);
      socket.data.roomId = roomId;
      console.log(`📦 Room created: ${roomId} by ${socket.id}`);
      callback(roomId);
    });

    socket.on('room:join', (roomId, playerName, callback) => {
      const room = io.sockets.adapter.rooms.get(roomId);

      if (!room) {
        callback(false, 'Room not found');
        return;
      }

      if (room.size >= 8) {
        callback(false, 'Room is full');
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.playerName = playerName;

      console.log(`👤 Player ${playerName} joined room ${roomId}`);
      callback(true);
    });

    socket.on('room:leave', () => {
      const roomId = socket.data.roomId;
      if (roomId) {
        socket.leave(roomId);
        console.log(`👋 Player ${socket.id} left room ${roomId}`);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      const roomId = socket.data.roomId;
      if (roomId) {
        socket.to(roomId).emit('room:playerLeft', socket.data.playerId);
      }
    });
  });

  console.log('✅ Socket handlers initialized');
}
