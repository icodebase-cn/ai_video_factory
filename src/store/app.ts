import { defineStore } from 'pinia'
import { ref } from 'vue'
import { EdgeTTSVoice } from '~/electron/lib/edge-tts'

export const useAppStore = defineStore(
  'app',
  () => {
    // 大模型文案生成
    const prompt = ref('')
    const llmConfig = ref({
      modelName: '',
      apiUrl: '',
      apiKey: '',
    })
    const updateLLMConfig = (newConfig: typeof llmConfig.value) => {
      llmConfig.value = newConfig
    }

    // 视频素材管理
    const videoAssetsFolder = ref('')
    const videoExportFolder = ref('')

    // 语音合成
    const originalVoicesList = ref<EdgeTTSVoice[]>([])
    const language = ref<string>()
    const gender = ref<string>()
    const voice = ref<EdgeTTSVoice | null>(null)
    const speed = ref<string>()

    return {
      prompt,
      llmConfig,
      updateLLMConfig,
      videoAssetsFolder,
      videoExportFolder,
      originalVoicesList,
      language,
      gender,
      voice,
      speed,
    }
  },
  {
    persist: true,
  },
)
