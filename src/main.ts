require('dotenv').config();
import express = require("express");
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { rout } from "./mainRouter/mainRouter";
import initializeSocket from "./socket";
import { notificationService } from "./socket/notificationService";

const app = express();
const port = 3000;
const server = http.createServer(app);

app.use("/", rout);
const io = initializeSocket(server);
notificationService(io);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
