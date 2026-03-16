#!/bin/bash
set -e

# ================================================
# Build local, deploy lên server qua rsync
# Usage: ./deploy-local.sh user@server-ip /var/www/min_proxy
# ================================================

SERVER="${1:?Usage: ./deploy-local.sh user@server-ip /path/on/server}"
REMOTE_DIR="${2:?Thiếu path trên server}"
PM2_NAME="${3:-}"

echo "🔨 Building locally..."
npm run build

echo "📦 Syncing to server..."
rsync -azP --delete \
  .next/standalone/ \
  .next/static \
  public \
  package.json \
  .env.production \
  "$SERVER:$REMOTE_DIR/"

# Copy static vào đúng chỗ standalone cần
ssh "$SERVER" "cp -r $REMOTE_DIR/static $REMOTE_DIR/.next/ 2>/dev/null; cp -r $REMOTE_DIR/public $REMOTE_DIR/.next/standalone/ 2>/dev/null"

echo "🚀 Restarting PM2..."
ssh "$SERVER" "cd $REMOTE_DIR && pm2 restart $PM2_NAME --update-env 2>/dev/null || pm2 restart all --update-env"

echo "✅ Deploy thành công!"
