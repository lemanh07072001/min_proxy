# Quy trình Deploy — MKT Proxy (Next.js)

## Kiến trúc hệ thống

```
Client Browser
    │
    ├── Next.js App (port 3001)     → PM2: test_mktproxy
    │       └── API Routes (/api/*)
    │
    ├── Socket Server (port 4000)   → PM2: socket-server
    │       └── HTTPS + SSL (Let's Encrypt)
    │       └── socket.mktproxy.com
    │
    └── Laravel Backend             → api.minhan.online/api
```

---

## Yêu cầu môi trường

- Node.js >= 18
- npm
- PM2 (`npm install -g pm2`)
- `tsx` (`npm install -g tsx`)
- SSL cert tại `/etc/letsencrypt/live/socket.mktproxy.com/`

---

## Lần đầu deploy

### 1. Clone & cài dependencies

```bash
git clone <repo_url> /var/www/mktproxy
cd /var/www/mktproxy
npm install
```

### 2. Tạo file `.env`

```bash
cp .env .env.production
```

Chỉnh nội dung `.env`:

```env
NEXT_PUBLIC_APP_URL=https://mktproxy.com
NEXT_PUBLIC_APP_NAME=MKT Proxy
NEXT_PUBLIC_API_URL=https://api.minhan.online/api
API_URL=https://api.minhan.online/api
NEXTAUTH_SECRET=<random_secret_mạnh>
NEXTAUTH_URL=https://mktproxy.com
NEXT_PUBLIC_SOCKET_URL=https://socket.mktproxy.com
```

> Tạo `NEXTAUTH_SECRET` bằng: `openssl rand -base64 32`

### 3. Build Next.js

```bash
npm run build
```

### 4. Tạo thư mục logs

```bash
mkdir -p logs
```

### 5. Start PM2

```bash
npm run pm2:start
```

### 6. Lưu PM2 auto-start khi reboot server

```bash
pm2 save
pm2 startup
```

---

## Deploy khi có code mới

```bash
cd /var/www/mktproxy

# 1. Pull code mới
git pull origin main

# 2. Cài dependencies mới (nếu có)
npm install

# 3. Build lại
npm run build

# 4. Restart PM2
npm run pm2:restart
```

---

## Quản lý PM2

```bash
# Xem trạng thái các process
pm2 status

# Start
npm run pm2:start

# Stop
npm run pm2:stop

# Restart
npm run pm2:restart

# Xóa khỏi PM2
npm run pm2:delete
```

### Cấu trúc PM2 (`ecosystem.config.js`)

| App | Script | Port | Ghi chú |
|-----|--------|------|---------|
| `test_mktproxy` | `npm start` | 3001 | Next.js app |
| `socket-server` | `tsx server/socket-server.ts` | 4000 | Socket.io HTTPS |

---

## Xem logs

```bash
# Log Next.js
pm2 logs test_mktproxy

# Log Socket server
pm2 logs socket-server

# Log lỗi socket (file)
tail -f logs/socket-error.log

# Log output socket (file)
tail -f logs/socket-out.log
```

---

## Nginx config (reverse proxy)

```nginx
server {
    listen 443 ssl;
    server_name mktproxy.com;

    ssl_certificate /etc/letsencrypt/live/mktproxy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mktproxy.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name mktproxy.com;
    return 301 https://$host$request_uri;
}
```

> Socket server (`socket.mktproxy.com`) chạy HTTPS trực tiếp trên port 4000, **không cần** Nginx proxy.

---

## Gia hạn SSL (Let's Encrypt)

```bash
# Gia hạn cert
certbot renew

# Restart socket server để load cert mới
pm2 restart socket-server
```

---

## Xử lý sự cố thường gặp

| Vấn đề | Kiểm tra |
|--------|----------|
| App không lên | `pm2 logs test_mktproxy` |
| Socket không kết nối | Kiểm tra SSL cert: `certbot renew --dry-run` |
| Build lỗi | Kiểm tra `.env` đủ biến, chạy `npm run lint` |
| PM2 không tự restart sau reboot | Chạy lại `pm2 save && pm2 startup` |
| Port 3001 bị chiếm | `lsof -i :3001` rồi `kill -9 <PID>` |
| Port 4000 bị chiếm | `lsof -i :4000` rồi `kill -9 <PID>` |
