const { execSync } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

const isWindows = process.platform === 'win32'
const ffmpegStaticPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static');

if (isWindows && fs.existsSync(ffmpegStaticPath)) {
  console.log('Windows detected, running build for ffmpeg-static...')
  try {
    // 进入 ffmpeg-static 目录并运行其构建脚本
    execSync('npm run install', { cwd: ffmpegStaticPath, stdio: 'inherit' })
    console.log('ffmpeg-static installed successfully.')
  } catch (error) {
    console.error('Failed to install ffmpeg-static:', error)
    process.exit(1)
  }
} else {
  console.log('Not Windows, skipping install ffmpeg-static.')
}
