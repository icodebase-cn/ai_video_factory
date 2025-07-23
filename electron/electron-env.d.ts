/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * 已构建的目录结构
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// 在渲染器进程中使用，在 `preload.ts` 中暴露方法
interface Window {
  ipcRenderer: Pick<import('electron').IpcRenderer, 'on' | 'once' | 'off' | 'send' | 'invoke'>
  electron: {
    isWinMaxed: () => Promise<boolean>
    winMin: () => void
    winMax: () => void
    winClose: () => void
    selectFolder: (params: import('./types').SelectFolderParams) => Promise<string>
    listFilesFromFolder: (
      params: import('./types').ListFilesFromFolderParams,
    ) => Promise<import('./types').ListFilesFromFolderRecord[]>
    getEdgeTtsVoiceList: () => Promise<import('@duyquangnvx/edge-tts').EdgeTTSVoice[]>
  }
  sqlite: {
    query: (param: import('./sqlite/types').queryParams) => Promise<any>
    insert: (param: import('./sqlite/types').insertParams) => Promise<any>
    update: (param: import('./sqlite/types').updateParams) => Promise<any>
    delete: (param: import('./sqlite/types').deleteParams) => Promise<any>
    bulkInsertOrUpdate: (param: import('./sqlite/types').bulkInsertOrUpdateParams) => Promise<any>
  }
}
