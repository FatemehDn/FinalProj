import { Socket, Server as IOServer } from "socket.io";
import { JwtPayload } from "../User/userAuthentication/login";

interface OnlineUser {
  name: string;
  socketId: string;
  socket: Socket;
}

export const onlineUsers: OnlineUser[] = [];

const socketFunctions = (
  socket: Socket & { user?: JwtPayload },
  io: IOServer
) => {
  if (!socket.user) {
    console.error("No user information attached to socket.");
    return;
  }

  const userName = socket.user.name;
  const socketId = socket.id;

  onlineUsers.push({ name: userName, socketId , socket });
  // console.log(socket.handshake);
  console.log(`User ${userName} connected with ID: ${socketId}`);
  // console.log("Online Users:", onlineUsers);
  
  socket.on("teacherChanged", (data) => {
    console.log("im here");
    console.log(data);
    
    const { message } = data;
    console.log({ notification: message });
  });

  socket.on("disconnect", () => {
    console.log(`User ${userName} disconnected`);
    const index = onlineUsers.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
    }
    console.log("Online Users:", onlineUsers);
  });
};

export default socketFunctions;
