import io from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://vrws-production.up.railway.app");
  }
  return socket;
};