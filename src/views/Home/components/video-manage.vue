<template>
  <div class="w-full h-full">
    <v-sheet class="h-full p-2 flex flex-col" border rounded>
      <div class="flex gap-2">
        <v-text-field
          :model-value="appStore.videoAssetsFolder"
          label="分镜视频素材文件夹"
          density="compact"
          readonly
        ></v-text-field>
        <v-btn class="mt-[2px]" prepend-icon="mdi-folder-open" @click="handleSelectFolder">
          选择
        </v-btn>
      </div>

      <div class="flex-1 h-full w-full border">
        <v-empty-state
          headline="暂无内容"
          text="从上面选择一个包含足够分镜素材的文件夹"
        ></v-empty-state>
      </div>

      <div class="my-2">
        <v-btn prepend-icon="mdi-refresh" block @click="refreshAssets"> 刷新素材库 </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ref } from 'vue'

const appStore = useAppStore()

const handleSelectFolder = async () => {
  const folderPath = await window.electron.selectFolder({
    title: '选择分镜素材文件夹',
    defaultPath: appStore.videoAssetsFolder,
  })
  if (folderPath) {
    appStore.videoAssetsFolder = folderPath
  }
  console.log('用户选择的文件夹绝对路径：', folderPath)
}

const videoAssets = ref([])
const refreshAssets = async () => {
  console.log('刷新素材库')
  const assets = await window.electron.listFilesFromFolder({
    folderPath: appStore.videoAssetsFolder,
  })
  console.log(`素材:`, assets)
}
</script>

<style lang="scss" scoped>
//
</style>
