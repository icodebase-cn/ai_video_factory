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
  ipcRenderer: import('electron').IpcRenderer
  sqlite: {
    query: (param: import('./sqlite/types').queryParam) => Promise<any>
    insert: (param: import('./sqlite/types').insertParam) => Promise<any>
    update: (param: import('./sqlite/types').updateParam) => Promise<any>
    delete: (param: import('./sqlite/types').deleteParam) => Promise<any>
    bulkInsertOrUpdate: (param: import('./sqlite/types').bulkInsertOrUpdateParam) => Promise<any>
  }
}
