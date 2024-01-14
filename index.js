const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const wordsArray = [
  'apple',
  'banana',
  'orange',
  'grape',
  'pineapple',
  'watermelon',
  'strawberry',
  'kiwi',
  'blueberry',
  'mango'
];

let hostSocketId = null;
let time = 0;
let word = wordsArray[Math.floor(Math.random() * wordsArray.length)];;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log(socket.id);
  let localTimer = 0;
  if(hostSocketId === null){
    time = new Date();
    localTimer = new Date() - time;
    hostSocketId = socket.id;
    io.to(hostSocketId).emit('joinGame' , {time: localTimer, word});
  }else{
    let localTimer = Math.floor((new Date() - time)/1000)%60;
    io.to(socket.id).emit('joinGame' , {time: localTimer, word});
  }

  // socket.on("room:join", (data) => {
  //   const { email, room } = data;
  //   emailToSocketIdMap.set(email, socket.id);
  //   socketidToEmailMap.set(socket.id, email);

  //   io.to(room).emit("user:joined", { email, id: socket.id });
  //   socket.join(room);
  //   io.to(socket.id).emit("room:join", data);
  // });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_mesage", data);
  });

  socket.on("sendCanvasData", (data) => {
    socket.broadcast.emit("recieveCanvasData", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});