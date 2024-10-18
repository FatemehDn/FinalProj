import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyToken, JwtPayload } from "../User/userAuthentication/login";
import { Server as HTTPServer } from "http";
import socketFunctions from "./functions";

interface ExtendedSocket extends Socket {
  user?: JwtPayload;
}

const initializeSocket = (app: HTTPServer) => {
  const io = new SocketIOServer(app);

  io.use((socket: ExtendedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("Authentication error: Token not provided");
      return;
    }

    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next();
    }
  });

  io.on("connection", (socket: ExtendedSocket) => {
    socketFunctions(socket, io);
  });

  return io;
};

export default initializeSocket;
