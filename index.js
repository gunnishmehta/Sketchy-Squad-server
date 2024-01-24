import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import { formatMessage } from "./utils/messages.js";

const app = express();

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
let localTimer = 0;
let word = wordsArray[Math.floor(Math.random() * wordsArray.length)];
const botName = 'Sketchy Squad';

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id);  

  if (hostSocketId === null) {
    time = new Date();
    localTimer = new Date() - time;
    hostSocketId = socket.id;
    io.to(hostSocketId).emit('joinGame', { time: localTimer, word, hostSocketId });
  } else {
    let localTimer = Math.floor((new Date() - time) / 1000) % 60;
    io.to(socket.id).emit('joinGame', { time: localTimer, word, hostSocketId });
  }

  socket.on("joinRoom", ({username, room})=>{
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    
    //welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Sketchy squad'));
  })

  //change word
  socket.on('changeWordReq', () => {
    if(hostSocketId === socket.id){
      word = wordsArray[Math.floor(Math.random() * wordsArray.length)];
      console.log(word);
      
      io.emit('changeWordRes', {word, hostSocketId});
    }
  })

  // recieve chat from someone and send to others
  socket.on("send_message", (data) => {
    io.emit("receive_mesage", formatMessage(botName, data));
  });
  
  // recieve canvas from host and send to others
  socket.on("sendCanvasData", (data) => {
    socket.broadcast.emit("recieveCanvasData", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});