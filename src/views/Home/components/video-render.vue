<template>
  <div class="h-0 flex-1">
    <v-sheet
      class="h-full p-2 pt-4 flex flex-col gap-6 items-center justify-between"
      border
      rounded
    >
      <div class="w-full h-0 flex-1 flex gap-10 items-center justify-center">
        <v-progress-circular
          color="primary"
          model-value="0"
          :size="96"
          :width="8"
        ></v-progress-circular>
        <div class="flex flex-col gap-4">
          <v-btn
            class=""
            size="x-large"
            color="deep-purple-accent-3"
            prepend-icon="mdi-rocket-launch"
            @click="onRenderVideo"
          >
            开始合成
          </v-btn>
          <v-dialog v-model="configDialogShow" max-width="600" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps"> 合成配置 </v-btn>
            </template>

            <v-card prepend-icon="mdi-text-box-edit-outline" title="配置合成选项">
              <v-card-text>
                <div class="w-full flex gap-2 mb-4 items-center">
                  <v-text-field
                    label="导出文件名"
                    v-model="config.outputFileName"
                    hide-details
                    required
                    clearable
                  ></v-text-field>
                  <v-text-field
                    class="w-[120px] flex-none"
                    model-value=".mp4"
                    label="导出格式"
                    hide-details
                    readonly
                    required
                  ></v-text-field>
                </div>
                <div class="w-full flex gap-2 mb-4 items-center">
                  <v-text-field
                    label="导出文件夹"
                    v-model="config.outputPath"
                    hide-details
                    readonly
                    required
                  ></v-text-field>
                  <v-btn
                    class="!h-[46px]"
                    prepend-icon="mdi-folder-open"
                    @click="handleSelectOutputFolder"
                  >
                    选择
                  </v-btn>
                </div>
                <div class="w-full flex gap-2 mb-2 items-center">
                  <v-text-field
                    label="背景音乐文件夹（.mp3格式，从中随机选取）"
                    v-model="config.bgmPath"
                    hide-details
                    readonly
                    required
                  ></v-text-field>
                  <v-btn
                    class="!h-[46px]"
                    prepend-icon="mdi-folder-open"
                    @click="handleSelectBgmFolder"
                  >
                    选择
                  </v-btn>
                </div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="关闭" variant="plain" @click="handleCloseDialog"></v-btn>
                <v-btn
                  color="primary"
                  text="保存"
                  variant="tonal"
                  @click="handleSaveConfig"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRaw, nextTick } from 'vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()

defineEmits<{
  renderVideo(): void
}>()

// 配置合成选项
const config = ref(structuredClone(toRaw(appStore.renderConfig)))
const configDialogShow = ref(false)
const resetConfigDialog = () => {
  config.value = structuredClone(toRaw(appStore.renderConfig))
}
const handleCloseDialog = () => {
  configDialogShow.value = false
  nextTick(resetConfigDialog)
}
const handleSaveConfig = () => {
  appStore.updateRenderConfig(config.value)
  configDialogShow.value = false
}

// 选择文件夹
const handleSelectOutputFolder = async () => {
  const folderPath = await window.electron.selectFolder({
    title: '选择视频导出文件夹',
    defaultPath: config.value.outputPath,
  })
  console.log('用户选择视频导出文件夹，绝对路径：', folderPath)
  if (folderPath) {
    config.value.outputPath = folderPath
  }
}
const handleSelectBgmFolder = async () => {
  const folderPath = await window.electron.selectFolder({
    title: '选择背景音乐文件夹',
    defaultPath: config.value.bgmPath,
  })
  console.log('用户选择背景音乐文件夹，绝对路径：', folderPath)
  if (folderPath) {
    config.value.bgmPath = folderPath
  }
}
</script>

<style lang="scss" scoped>
//
</style>
