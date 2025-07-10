import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'app',
  () => {
    return {}
  },
  {
    persist: true,
  },
)
