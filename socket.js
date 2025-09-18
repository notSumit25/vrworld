import io from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://vrws-production-ab5a.up.railway.app");
  }
  return socket;
};