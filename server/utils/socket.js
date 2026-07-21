import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });
  return io;
};

export const emitQueueUpdate = (payload = {}) => {
  if (io) {
    io.emit('queue:update', payload);
  }
};
