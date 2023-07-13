import { io } from "socket.io-client";

const socket = new io("http://localhost:4081");

export default socket;
