const express = require("express");
const app = express(); // express server
const http = require("http"); // to build our server together with socket.io cause express can't handle with WebSocket.
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { log } = require("console");
dotenv.config();
const port = process.env.PORT || 8000;

app.use(cors()); // allow connections through any origin

const server = http.createServer(app);

// to connect socket server with express server
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

// socket io depends on events
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log(`User With ID : ${socket.id} Enterd Room : ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => console.log(`Chat app listening on port ${port}!`));
