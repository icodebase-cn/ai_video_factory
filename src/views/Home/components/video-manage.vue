<template>
  <div class="w-full h-full">
    <v-sheet class="h-full p-2 flex flex-col" border rounded>
      <div class="flex gap-2 mb-2">
        <v-text-field
          v-model="appStore.videoAssetsFolder"
          label="分镜视频素材文件夹"
          density="compact"
          hide-details
          readonly
        >
        </v-text-field>
        <v-btn class="mt-[2px]" prepend-icon="mdi-folder-open" @click="handleSelectFolder">
          选择
        </v-btn>
      </div>

      <div class="flex-1 h-0 w-full border">
        <div
          v-if="videoAssets.length"
          class="w-full h-full overflow-y-auto grid grid-cols-3 gap-2 p-2"
        >
          <div v-for="(item, index) in videoAssets" :key="index" class="w-full h-full">
            <VideoAutoPreview :asset="item" />
          </div>
        </div>
        <v-empty-state
          v-else
          headline="暂无内容"
          text="从上面选择一个包含足够分镜素材的文件夹"
        ></v-empty-state>
      </div>

      <div class="my-2">
        <v-btn
          block
          prepend-icon="mdi-refresh"
          :disabled="!appStore.videoAssetsFolder"
          :loading="refreshAssetsLoading"
          @click="refreshAssets"
        >
          刷新素材库
        </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ListFilesFromFolderRecord } from '~/electron/types'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/store'
import { ref } from 'vue'
import VideoAutoPreview from '@/components/video-auto-preview.vue'

const toast = useToast()
const appStore = useAppStore()

// 选择文件夹
const handleSelectFolder = async () => {
  const folderPath = await window.electron.selectFolder({
    title: '选择分镜素材文件夹',
    defaultPath: appStore.videoAssetsFolder,
  })
  console.log('用户选择分镜素材文件夹，绝对路径：', folderPath)
  if (folderPath) {
    appStore.videoAssetsFolder = folderPath
    refreshAssets()
  }
}

// 刷新素材库
const videoAssets = ref<ListFilesFromFolderRecord[]>([])
const refreshAssetsLoading = ref(false)
const refreshAssets = async () => {
  if (!appStore.videoAssetsFolder) {
    return
  }
  refreshAssetsLoading.value = true
  try {
    const assets = await window.electron.listFilesFromFolder({
      folderPath: appStore.videoAssetsFolder,
    })
    console.log(`素材库刷新:`, assets)
    videoAssets.value = assets.filter((asset) => asset.name.endsWith('.mp4'))
    if (!videoAssets.value.length) {
      if (assets.length) {
        toast.warning('选择的文件夹中不包含MP4视频文件')
      } else {
        toast.warning('选择的文件夹为空')
      }
    } else {
      toast.success('素材读取成功')
    }
  } catch (error) {
    console.log(error)
    toast.error('素材读取失败，请检查文件夹是否存在')
  } finally {
    refreshAssetsLoading.value = false
  }
}
refreshAssets()

// 获取视频分镜随机素材片段
const getVideoSegments = async (options: { duration: number }) => {
  
}

defineExpose({ getVideoSegments })
</script>

<style lang="scss" scoped>
//
</style>
