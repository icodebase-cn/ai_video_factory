import { app, BrowserWindow, screen, Menu } from 'electron'
import type { MenuItemConstructorOptions } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import GlobalSetting from '../setting.global'
import initIPC from './ipc'
import { initSqlite } from './sqlite'
import useCookieAllowCrossSite from './lib/cookie-allow-cross-site'

// 用于引入 CommonJS 模块的方法
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 已构建的目录结构
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 使用['ENV_NAME'] 避免 vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    title: GlobalSetting.appName,
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    minWidth: 800,
    minHeight: 650,
    backgroundColor: '#F3F3F3',
    show: false,
    frame: false,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 优化应用进入体验
  win.once('ready-to-show', () => {
    win?.show()
  })

  //测试向渲染器进程发送的活动推送消息。
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function buildMenu() {
  const template: MenuItemConstructorOptions[] = [
    // macOS standard app menu
    ...(process.platform === 'darwin'
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ] as MenuItemConstructorOptions[],
          },
        ]
      : []),
    {
      label: 'Language',
      submenu: [
        {
          label: 'English',
          type: 'radio',
          checked: true,
          click: () => {
            BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('set-locale', 'en'))
          },
        },
        {
          label: '中文',
          type: 'radio',
          click: () => {
            BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('set-locale', 'zh-CN'))
          },
        },
      ] as MenuItemConstructorOptions[],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ] as MenuItemConstructorOptions[],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ] as MenuItemConstructorOptions[],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }] as MenuItemConstructorOptions[],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = await import('electron')
            await shell.openExternal('https://github.com/YILS-LIN/short-video-factory')
          },
        },
      ] as MenuItemConstructorOptions[],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

//关闭所有窗口后退出，macOS除外。在那里，这很常见
//让应用程序及其菜单栏保持活动状态，直到用户退出
//显式使用Cmd+Q。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  //在OS X上，当出现以下情况时，通常会在应用程序中重新创建一个窗口
  //单击dock图标后，没有其他打开的窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 禁用硬件加速
// app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow()
  initSqlite()
  initIPC(win as BrowserWindow)

  // 允许跨站请求携带cookie
  useCookieAllowCrossSite()
  // 禁用 CORS
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
  // 允许本地网络请求
  app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests')

  // Build application menu
  buildMenu()
})
