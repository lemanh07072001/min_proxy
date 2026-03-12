#!/bin/bash
set -e

# ================================================
# Deploy script cho MKT Proxy FE
# Chỉnh APP_DIR trước khi chạy trên server
# ================================================

# Load config từ .env.deploy (không bị track git)
if [ -f ".env.deploy" ]; then
  source .env.deploy
fi

APP_DIR="${APP_DIR:-/var/www/mktproxy-fe}"
PM2_NAME="${PM2_NAME:-mktproxy-fe}"

cd "$APP_DIR"

echo "📦 Pulling code..."
git pull

echo "📚 Installing deps..."
npm ci --production=false

echo "🔨 Building..."

# Backup .next hiện tại (phòng rollback)
if [ -d ".next" ]; then
  rm -rf .next.backup
  cp -r .next .next.backup
  echo "✅ Backed up .next"
fi

if npm run build; then
  echo "🚀 Restarting PM2..."
  pm2 reload "$PM2_NAME" --update-env
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
