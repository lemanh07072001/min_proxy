/**
 * Tạo symlink từ Claude Code local memory → repo .project-memory
 *
 * Chạy tự động khi npm install (postinstall) hoặc thủ công: node scripts/setup-memory.js
 *
 * Flow:
 *   ~/.claude/projects/{encoded-workspace}/memory/  →  symlink  →  FE/.project-memory/
 *
 * Khi Claude Code ghi memory → thực ra ghi vào repo → git push → người khác pull → đồng bộ
 */

const os = require('os')
const path = require('path')
const fs = require('fs')

// FE/ là thư mục chứa script này
const feDir = path.resolve(__dirname, '..')
// Workspace = thư mục cha (mktProxies/)
const workspaceDir = path.resolve(feDir, '..')
// Source: memory trong repo
const repoMemoryDir = path.join(feDir, '.project-memory')

// Encode workspace path theo format Claude Code
// Windows: d:\Projects\mktProxies → d--Projects-mktProxies
// Linux/Mac: /home/user/mktProxies → home-user-mktProxies
let encoded
if (process.platform === 'win32') {
  encoded = workspaceDir.replace(/:/g, '-').replace(/\\/g, '-')
} else {
  encoded = workspaceDir.replace(/\//g, '-').replace(/^-/, '')
}

const claudeDir = path.join(os.homedir(), '.claude', 'projects', encoded)
const claudeMemoryDir = path.join(claudeDir, 'memory')

console.log('[setup-memory] Workspace:', workspaceDir)
console.log('[setup-memory] Repo memory:', repoMemoryDir)
console.log('[setup-memory] Claude memory:', claudeMemoryDir)

// Kiểm tra repo memory tồn tại
if (!fs.existsSync(repoMemoryDir)) {
  console.error('[setup-memory] ❌ Không tìm thấy .project-memory/ trong FE repo')
  process.exit(1)
}

// Tạo thư mục cha nếu chưa có
fs.mkdirSync(claudeDir, { recursive: true })

// Kiểm tra trạng thái hiện tại
if (fs.existsSync(claudeMemoryDir)) {
  const stat = fs.lstatSync(claudeMemoryDir)

  if (stat.isSymbolicLink()) {
    const target = fs.readlinkSync(claudeMemoryDir)
    if (path.resolve(target) === path.resolve(repoMemoryDir)) {
      console.log('[setup-memory] ✅ Symlink đã đúng, không cần làm gì')
      process.exit(0)
    }
    // Symlink sai target → xóa để tạo lại
    console.log('[setup-memory] Symlink cũ trỏ sai, tạo lại...')
    fs.unlinkSync(claudeMemoryDir)
  } else {
    // Thư mục thật (có data cũ) → backup
    const backupDir = claudeMemoryDir + '.bak-' + Date.now()
    console.log('[setup-memory] Backup memory cũ →', backupDir)
    fs.renameSync(claudeMemoryDir, backupDir)
  }
}

// Tạo symlink
// Windows: dùng 'junction' (không cần admin rights, chỉ cho thư mục)
// Linux/Mac: dùng 'dir' symlink
try {
  const symlinkType = process.platform === 'win32' ? 'junction' : 'dir'
  fs.symlinkSync(repoMemoryDir, claudeMemoryDir, symlinkType)
  console.log('[setup-memory] ✅ Đã tạo symlink:', claudeMemoryDir, '→', repoMemoryDir)
} catch (err) {
  console.error('[setup-memory] ❌ Không thể tạo symlink:', err.message)
  console.error('[setup-memory] Thử chạy terminal với quyền admin (Windows) hoặc kiểm tra quyền (Linux/Mac)')
  process.exit(1)
}
