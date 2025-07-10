import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, ipcMain } from 'electron'
import { queryParam, insertParam, updateParam, deleteParam } from './sqlite/types'
import { sqBulkInsertOrUpdate, sqDelete, sqInsert, sqQuery, sqUpdate } from './sqlite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 使用['ENV_NAME'] 避免 vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

export default function initIPC(win: BrowserWindow) {
  // 是否最大化
  ipcMain.handle('win-maxed', () => {
    return win?.isMaximized()
  })
  //最小化
  ipcMain.on('win-min', () => {
    win?.minimize()
  })
  //最大化
  ipcMain.on('win-max', () => {
    if (win?.isMaximized()) {
      win?.restore()
    } else {
      win?.maximize()
    }
  })
  //关闭程序
  ipcMain.on('win-close', () => {
    win?.close()
  })

  // sqlite 查询
  ipcMain.handle('sqlite-query', (_event, params: queryParam) => {
    return sqQuery(params)
  })
  // sqlite 插入
  ipcMain.handle('sqlite-insert', async (_event, params: insertParam) => {
    return await sqInsert(params)
  })
  // sqlite 更新
  ipcMain.handle('sqlite-update', async (_event, params: updateParam) => {
    return await sqUpdate(params)
  })
  // sqlite 删除
  ipcMain.handle('sqlite-delete', async (_event, params: deleteParam) => {
    return await sqDelete(params)
  })
  // sqlite 批量插入或更新
  ipcMain.handle('sqlite-bulk-insert-or-update', async (_event, params: any) => {
    return await sqBulkInsertOrUpdate(params)
  })
}
