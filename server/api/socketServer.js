import { createServer } from 'https';
import { Server } from 'socket.io';

import { readFileSync } from 'fs';

const privateKey = readFileSync('C:\\Users\\coolman\\Documents\\chatroom\\localhost-key.pem');
const certificate = readFileSync('C:\\Users\\coolman\\Documents\\chatroom\\localhost.pem');

const serverOptions = { key: privateKey, cert: certificate };

// 創建HTTP Server
const httpServer = createServer(serverOptions);

// 創建Socket.io Server
const io = new Server(httpServer);

let messages = []

// 處理連接事件
io.on('connection', (socket) => {
  console.log('有新的連線');

  // 發送之前的全部訊息
  io.emit("allMessage", messages)

  // 當此用戶發送訊息的時候，先把新訊息放到 messages 陣列裡面
    // 再 emit 給所有用戶
  socket.on('chat message', (message) => {
    console.log('收到消息：', message);
    messages.push(message)
    io.emit('chat message', message);
  });

  // 處理斷開連線事件
  socket.on('disconnect', () => {
    console.log('連線斷開');
  });
});

// 監聽port
httpServer.listen(4000, () => {
  console.log('Socket.io Server運行在https://localhost:4000');
});