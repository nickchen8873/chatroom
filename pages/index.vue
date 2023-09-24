<template>
    <div>
      <input v-model="name" placeholder="你是誰?" />
      <input v-model="message" placeholder="輸入消息" />
      <button @click="sendMessage">送出</button>
      <ul>
        <li v-for="msg in messages" :key="msg.id">{{ msg.name }}：{{ msg.text }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  
  export default {
    data() {
      return {
        name:'',
        message: '',
        messages: []
      };
    },
    mounted() {
      // 連線到Socket.io Server
      this.socket = io()

      // 進入聊天室時，會收到之前的全部訊息，並更新到 messages
      this.socket.on("allMessage", (obj) => {
        console.log('received all messages')
        this.messages = obj
      })

      // 處理接收到的聊天消息
      this.socket.on('chat message', (message) => {
        this.messages.push(message);
      });
    },
    methods: {
      sendMessage() {
        // 發送聊天消息给Server
        this.socket.emit('chat message', {
          name: this.name,
          text: this.message,
          id: Date.now() // 消息的ID
        });
      }
    },
    beforeDestroy() {
      // 中斷與Socket.io Server的連接
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  };
  </script>