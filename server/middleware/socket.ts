import WebSocket, { WebSocketServer } from "ws"

type Client = {
  id: string
  send: (message: string) => void
  readyState: number
}

declare global {
  var wss: WebSocketServer
  var clients: Client[]
}

let wss: WebSocketServer
let clients: Client[] = []

export default defineEventHandler((event) => {
  
  if (!global.wss) {
    //wss = new WebSocketServer({ port: 7071 });
    wss = new WebSocketServer({ server: event.node.res.socket?.server })
    
    
    wss.on("connection", function (socket) {
  
      socket.send("connected")

      socket.on("message", function (message) {
        wss.clients.forEach(function (client) {
          if (client == socket && client.readyState === WebSocket.OPEN) {
            clients.push({
              id: message.toString(),
              send: (data: string) => client.send(data),
              readyState: client.readyState,
            })
            global.clients = clients
          }
        })
      })
      global.wss = wss
    })
  }
})
// const io = new Server(3001, {
//   cors: {
//       origin: '*',
//   }
// });

// io.on('connection', (socket) => {
//   console.log('Connection', socket.id)
// })

// io.on('connect', (socket) => {
//   socket.emit('message', `welcome ${socket.id}`)
//   socket.broadcast.emit('message', `${socket.id} joined`)

//   socket.on('message', function message(data: any) {
//     console.log('message received: %s', data)
//     socket.emit('message', { data })
//   })

//   socket.on('disconnecting', () => {
//     console.log('disconnected', socket.id)
//     socket.broadcast.emit('message', `${socket.id} left`)
//   })
// });

// export default function (req:any, res:any, next:any) {
//   res.statusCode = 200
//   res.end()
// }