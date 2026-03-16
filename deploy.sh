#!/bin/bash
set -e

# ================================================
# Deploy script cho MKT Proxy FE
# Copy ra /root/deploy.sh rồi chỉnh APP_DIR, PM2_NAME
# Usage: /root/deploy.sh
# ================================================

APP_DIR="/var/www/mktproxy-fe"

# Tự detect PM2 process name từ thư mục hiện tại, fallback lấy từ package.json
PM2_NAME=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
try:
    procs = json.load(sys.stdin)
    for p in procs:
        cwd = p.get('pm2_env', {}).get('pm_cwd', '')
        if cwd.rstrip('/') == '${APP_DIR}'.rstrip('/'):
            print(p['name']); break
except: pass
" 2>/dev/null)

if [ -z "$PM2_NAME" ]; then
  PM2_NAME=$(node -e "console.log(require('${APP_DIR}/package.json').name || '')" 2>/dev/null)
fi

if [ -z "$PM2_NAME" ]; then
  PM2_NAME=$(basename "$APP_DIR")
fi

echo "🔍 PM2 process: $PM2_NAME"

cd "$APP_DIR"

echo "📦 Pulling code..."
git stash --quiet 2>/dev/null || true
git pull
git stash pop --quiet 2>/dev/null || true

echo "📚 Installing deps..."
NODE_OPTIONS="--max-old-space-size=512" npm ci

echo "🔨 Building..."

# Backup .next hiện tại (phòng rollback)
if [ -d ".next" ]; then
  rm -rf .next.backup
  cp -r .next .next.backup
  echo "✅ Backed up .next"
fi

# Xóa build cache cũ để đảm bảo env mới được bake đúng
rm -rf .next

if NODE_OPTIONS="--max-old-space-size=1024" npm run build; then
  echo "🚀 Restarting PM2..."
  if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
    pm2 reload "$PM2_NAME" --update-env
  else
    pm2 start npm --name "$PM2_NAME" -- start
    pm2 save
  fi
  rm -rf .next.backup
  echo "✅ Deploy thành công!"
else
  echo "❌ Build lỗi! Đang rollback..."
  if [ -d ".next.backup" ]; then
    rm -rf .next
    mv .next.backup .next
    pm2 reload "$PM2_NAME" --update-env
    echo "⚠️  Đã rollback về bản cũ."
  fi
  exit 1
fi
