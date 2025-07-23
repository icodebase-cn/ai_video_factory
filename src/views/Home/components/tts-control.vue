<template>
  <div>
    <v-sheet class="h-fit p-2" border rounded>
      <v-combobox
        v-model="appStore.language"
        density="comfortable"
        label="语言"
        :items="languageList"
        no-data-text="无数据"
        @update:model-value="handleClearVoice"
      ></v-combobox>
      <v-select
        v-model="appStore.gender"
        density="comfortable"
        label="性别"
        :items="genderList"
        item-title="label"
        item-value="value"
        @update:model-value="handleClearVoice"
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
        :items="speedList"
        item-title="label"
        item-value="value"
      ></v-select>
      <v-text-field density="comfortable" label="试听文本"></v-text-field>
      <v-btn class="mb-2" prepend-icon="mdi-volume-high" block> 试听 </v-btn>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const handleClearVoice = () => {
  appStore.voice = null
}

const filteredVoicesList = computed(() => {
  if (!appStore.language || !appStore.gender) return []
  return appStore.originalVoicesList.filter(
    (voice) => voice.FriendlyName.includes(appStore.language!) && voice.Gender === appStore.gender,
  )
})
const languageList = computed(() => {
  return appStore.originalVoicesList
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
  { label: '慢', value: '0.5' },
  { label: '中', value: '1' },
  { label: '快', value: '1.5' },
])

const fetchVoices = async () => {
  appStore.originalVoicesList = await window.electron.getEdgeTtsVoiceList()
  console.log('voicesList Updated', appStore.originalVoicesList)
}
onMounted(async () => {
  await fetchVoices()
  if (!appStore.originalVoicesList.find((voice) => voice.Name === appStore.voice?.Name)) {
    appStore.voice = null
  }
})
</script>

<style lang="scss" scoped>
//
</style>
