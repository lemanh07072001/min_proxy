#!/bin/bash
set -e

# ================================================
# Deploy script cho MKT Proxy FE
# PM2 name lấy từ ecosystem.config.cjs → đồng nhất mọi server
# Chỉ cần chỉnh APP_DIR khi copy ra /root/deploy.sh
# ================================================

APP_DIR="/var/www/mktproxy-fe"

cd "$APP_DIR"

# Lấy PM2 name từ ecosystem.config.cjs (app đầu tiên)
PM2_NAME=$(node -e "console.log(require('./ecosystem.config.cjs').apps[0].name)" 2>/dev/null)

if [ -z "$PM2_NAME" ]; then
  PM2_NAME=$(basename "$APP_DIR")
fi

echo "🔍 PM2: $PM2_NAME"

echo "📦 Pulling code..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd 2>/dev/null || true

echo "📚 Installing deps..."
NODE_OPTIONS="--max-old-space-size=512" npm ci

echo "🔨 Building..."
rm -rf .next/server .next/static .next/BUILD_ID .next/*.json 2>/dev/null

if NODE_OPTIONS="--max-old-space-size=1024" npm run build; then
  echo "🚀 Restarting PM2..."
  if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
    pm2 reload "$PM2_NAME" --update-env
  else
    pm2 start ecosystem.config.cjs --only "$PM2_NAME"
    pm2 save
  fi
  echo "✅ Deploy thành công!"
else
  echo "❌ Build lỗi!"
  exit 1
fi
