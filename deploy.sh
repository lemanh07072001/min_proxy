#!/bin/bash
set -e

# ================================================
# Deploy script cho MKT Proxy FE
# Chỉnh APP_DIR trước khi chạy trên server
# ================================================

APP_DIR="/var/www/mktproxy-fe"  # <-- đổi path này khi deploy lên server
PM2_NAME="mktproxy-fe"          # <-- đổi tên PM2 process nếu khác

cd "$APP_DIR"

echo "📦 Pulling code..."
git pull origin develop

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
