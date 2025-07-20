import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const prompt = ref('')
    const llmConfig = ref({
      modelName: '',
      apiUrl: '',
      apiKey: '',
    })
    const updateLLMConfig = (newConfig: typeof llmConfig.value) => {
      llmConfig.value = newConfig
    }

    const videoAssetsFolder = ref('')
    const videoExportFolder = ref('')

    return {
      prompt,
      llmConfig,
      updateLLMConfig,
      videoAssetsFolder,
      videoExportFolder,
    }
  },
  {
    persist: true,
  },
)
