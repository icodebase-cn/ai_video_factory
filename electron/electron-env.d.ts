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
    edgeTtsGetVoiceList: () => Promise<import('./lib/edge-tts').EdgeTTSVoice[]>
    edgeTtsSynthesizeToBase64: (
      params: import('./tts/types').edgeTtsSynthesizeToBase64Params,
    ) => Promise<string>
    renderVideo: (
      params: import('./ffmpeg/types').RenderVideoParams,
    ) => Promise<import('./ffmpeg/types').ExecuteFFmpegResult>
  }
  sqlite: {
    query: (param: import('./sqlite/types').QueryParams) => Promise<any>
    insert: (param: import('./sqlite/types').InsertParams) => Promise<number>
    update: (param: import('./sqlite/types').UpdateParams) => Promise<number>
    delete: (param: import('./sqlite/types').DeleteParams) => Promise<void>
    bulkInsertOrUpdate: (param: import('./sqlite/types').BulkInsertOrUpdateParams) => Promise<void>
  }
}
