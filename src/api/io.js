import { io } from "socket.io-client";

const backendServer = "http://localhost:5000";

const socket = io(backendServer, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
