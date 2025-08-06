const { execSync } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

const isWindows = process.platform === 'win32'

if (isWindows) {
  console.log('Windows detected, running install for ffmpeg-static...')
  try {
    // 进入 ffmpeg-static 目录并运行其构建脚本
    execSync('npm explore ffmpeg-static -- pnpm run install ', {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    console.log('ffmpeg-static installed successfully.')
  } catch (error) {
    console.error('Failed to install ffmpeg-static:', error)
    process.exit(1)
  }
} else {
  console.log('Not Windows, skipping install ffmpeg-static.')
}
