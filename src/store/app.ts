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

    return {
      prompt,
      llmConfig,
      updateLLMConfig,
    }
  },
  {
    persist: true,
  },
)
