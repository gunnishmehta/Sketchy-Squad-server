const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_mesage", data);
  });

  socket.on("canvasData", (data)=>{
    socket.broadcast.emit("sendcanvasData", data);
  });
  
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});