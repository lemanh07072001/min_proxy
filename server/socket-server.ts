import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*' }
})

app.use(express.json())

// Endpoint để Laravel gọi đến
app.post('/update_order', (req, res) => {
  const { event, data } = req.body
  io.emit(event, data)
  console.log('📤 Đã gửi event:', event, data)
  res.send('ok')
})

// Khi client kết nối
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id)
  })
})

server.listen(4000, () => console.log('🚀 Socket server chạy tại port 4000'))
