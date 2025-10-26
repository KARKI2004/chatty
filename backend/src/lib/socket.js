import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // to store online users {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // socket.handshake.query is already an object, you don't need destructuring like that
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId.toString()] = socket.id;

  io.emit("GetOnlineUsers", Object.keys(userSocketMap)); // send online users to all clients

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("GetOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
