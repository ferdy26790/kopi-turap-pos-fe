import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let socket: Socket | null = null;

// One shared connection per browser tab, reused across every component that
// needs realtime order updates (currently just the kitchen display).
export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, { autoConnect: true });
  }
  return socket;
}
