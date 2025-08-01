import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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
    const languageList = computed(() => {
      return originalVoicesList.value
        .map((voice) => voice.FriendlyName.split(' - ').pop()?.split(' (').shift())
        .filter((language) => !!language)
        .filter((language, index, arr) => arr.indexOf(language) === index)
    })
    const genderList = ref([
      { label: '男性', value: 'Male' },
      { label: '女性', value: 'Female' },
      // { label: '中性', value: 'Neutral' },
    ])
    const speedList = ref([
      { label: '慢', value: -30 },
      { label: '中', value: 0 },
      { label: '快', value: 30 },
    ])
    const language = ref<string>()
    const gender = ref<string>()
    const voice = ref<EdgeTTSVoice | null>(null)
    const speed = ref(0)
    const tryListeningText = ref('Hello，欢迎使用短视频工厂！')

    // 合成配置
    const renderConfig = ref({
      bgmPath: '',
      outputPath: '',
      outputFileName: '',
    })
    const updateRenderConfig = (newConfig: typeof renderConfig.value) => {
      renderConfig.value = newConfig
    }

    return {
      prompt,
      llmConfig,
      updateLLMConfig,

      videoAssetsFolder,
      videoExportFolder,

      originalVoicesList,
      languageList,
      genderList,
      speedList,
      language,
      gender,
      voice,
      speed,
      tryListeningText,

      renderConfig,
      updateRenderConfig,
    }
  },
  {
    persist: {
      omit: ['genderList', 'speedList'],
    },
  },
)
