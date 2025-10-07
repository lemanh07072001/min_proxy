import fs from 'fs'
import https from 'https'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

// ✅ Đọc chứng chỉ SSL
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/socket.mktproxy.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/socket.mktproxy.com/fullchain.pem')
}, app)

// ✅ Cấu hình Socket.io
const io = new Server(httpsServer, {
  cors: {
    origin: '*', // hoặc 'https://app.mktproxy.com' nếu bạn muốn chặt chẽ hơn
    methods: ['GET', 'POST']
  }
})

app.use(express.json())

// ✅ Laravel sẽ POST đến đây để gửi sự kiện
app.post('/update_order', (req, res) => {
  const { event, data } = req.body
  io.emit(event, data)
  console.log('📤 Event gửi:', event, data)
  res.send('ok')
})

// ✅ Khi client kết nối
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id)
  })
})

// ✅ Chạy server HTTPS
const PORT = 4000
httpsServer.listen(PORT, () => {
  console.log(`🔒 HTTPS Socket.io server chạy tại port ${PORT}`)
})
