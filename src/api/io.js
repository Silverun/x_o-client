import { io } from "socket.io-client";

// const backendServer = "http://localhost:5000";
const backendServer = "https://x-o-game.herokuapp.com";

const socket = io(backendServer, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
