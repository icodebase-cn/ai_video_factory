<template>
  <div>
    <v-sheet class="h-fit p-2" border rounded>
      <v-combobox
        v-model="appStore.language"
        density="comfortable"
        label="语言"
        :items="appStore.languageList"
        no-data-text="无数据"
        @update:model-value="clearVoice"
      ></v-combobox>
      <v-select
        v-model="appStore.gender"
        density="comfortable"
        label="性别"
        :items="appStore.genderList"
        item-title="label"
        item-value="value"
        @update:model-value="clearVoice"
      ></v-select>
      <v-select
        v-model="appStore.voice"
        density="comfortable"
        label="声音"
        :items="filteredVoicesList"
        item-title="FriendlyName"
        return-object
        no-data-text="请先选择语言和性别"
      ></v-select>
      <v-select
        v-model="appStore.speed"
        density="comfortable"
        label="语速"
        :items="appStore.speedList"
        item-title="label"
        item-value="value"
      ></v-select>
      <v-text-field
        v-model="appStore.tryListeningText"
        density="comfortable"
        label="试听文本"
      ></v-text-field>
      <v-btn
        class="mb-2"
        prepend-icon="mdi-volume-high"
        block
        :loading="tryListeningLoading"
        @click="handleTryListening"
      >
        试听
      </v-btn>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store'
import { useToast } from 'vue-toastification'

const toast = useToast()
const appStore = useAppStore()

const configValid = () => {
  if (!appStore.voice) {
    toast.warning('请选择一个声音')
    return false
  }

  if (!appStore.tryListeningText) {
    toast.warning('试听文本不能为空')
    return false
  }

  return true
}

const tryListeningLoading = ref(false)
const handleTryListening = async () => {
  if (!configValid()) return

  tryListeningLoading.value = true
  try {
    const speech = await window.electron.edgeTtsSynthesizeToBase64({
      text: appStore.tryListeningText,
      voice: appStore.voice!.ShortName,
      options: {
        rate: appStore.speed,
      },
    })
    const audio = new Audio(`data:audio/mp3;base64,${speech}`)
    audio.play()
    toast.info('播放试听语音')
  } catch (error) {
    console.log('试听语音合成失败', error)
    toast.error('试听语音合成失败，请检查网络')
  } finally {
    tryListeningLoading.value = false
  }
}
const clearVoice = () => {
  appStore.voice = null
}

const filteredVoicesList = computed(() => {
  if (!appStore.language || !appStore.gender) return []
  return appStore.originalVoicesList.filter(
    (voice) => voice.FriendlyName.includes(appStore.language!) && voice.Gender === appStore.gender,
  )
})

const fetchVoices = async () => {
  try {
    appStore.originalVoicesList = await window.electron.edgeTtsGetVoiceList()
    console.log('EdgeTTS语音列表更新：', appStore.originalVoicesList)
  } catch (error) {
    console.log('获取EdgeTTS语音列表失败', error)
    toast.error('获取EdgeTTS语音列表失败，请检查网络')
  }
}
onMounted(async () => {
  await fetchVoices()
  if (!appStore.originalVoicesList.find((voice) => voice.Name === appStore.voice?.Name)) {
    appStore.voice = null
  }
})

const synthesizedSpeechToFile = async (option?: { withCaption?: boolean }) => {
  if (!configValid()) throw new Error('TTS语音合成配置无效')

  try {
    await window.electron.edgeTtsSynthesizeToFile({
      text: appStore.tryListeningText,
      voice: appStore.voice!.ShortName,
      options: {
        rate: appStore.speed,
      },
      withCaption: option?.withCaption,
    })
  } catch (error) {
    console.log('语音合成失败', error)
    toast.error('语音合成失败，请检查网络')
    throw error
  }
}

defineExpose({ synthesizedSpeechToFile })
</script>

<style lang="scss" scoped>
//
</style>
