import { ipcRenderer, contextBridge } from 'electron'
import { queryParam, insertParam, updateParam, deleteParam } from './sqlite/types'

// --------- 向界面渲染进程暴露某些API ---------

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  once(...args: Parameters<typeof ipcRenderer.once>) {
    const [channel, listener] = args
    return ipcRenderer.once(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('sqlite', {
  query: async (param: queryParam) => {
    return await ipcRenderer.invoke('sqlite-query', param)
  },
  insert: async (param: insertParam) => {
    return await ipcRenderer.invoke('sqlite-insert', param)
  },
  update: async (param: updateParam) => {
    return await ipcRenderer.invoke('sqlite-update', param)
  },
  delete: async (param: deleteParam) => {
    return await ipcRenderer.invoke('sqlite-delete', param)
  },
  bulkInsertOrUpdate: async (param: any) => {
    return await ipcRenderer.invoke('sqlite-bulk-insert-or-update', param)
  },
})
