<template>
  <div class="h-0 flex-1 relative">
    <div class="absolute top-1/12 w-full flex justify-center cursor-default select-none">
      <v-chip v-if="appStore.renderStatus === RenderStatus.None"> 空闲，可以开始合成 </v-chip>
      <v-chip v-if="appStore.renderStatus === RenderStatus.GenerateText" variant="elevated">
        正在使用 AI 大模型生成文案
      </v-chip>
      <v-chip v-if="appStore.renderStatus === RenderStatus.SynthesizedSpeech" variant="elevated">
        正在使用 TTS 合成语音
      </v-chip>
      <v-chip v-if="appStore.renderStatus === RenderStatus.SegmentVideo" variant="elevated">
        正在处理分镜素材
      </v-chip>
      <v-chip v-if="appStore.renderStatus === RenderStatus.Rendering" variant="elevated">
        正在渲染视频
      </v-chip>
      <v-chip
        v-if="appStore.renderStatus === RenderStatus.Completed"
        variant="elevated"
        color="success"
      >
        渲染成功，可以开始下一个
      </v-chip>
      <v-chip v-if="appStore.renderStatus === RenderStatus.Failed" variant="elevated" color="error">
        渲染失败，请重新尝试
      </v-chip>
    </div>

    <v-sheet class="h-full p-2 pt-4 flex flex-col gap-6 items-center justify-center" border rounded>
      <div class="w-full h-[120px] flex gap-10 items-center justify-center">
        <div class="flex flex-col gap-4">
          <v-progress-circular
            color="indigo"
            v-model="renderProgress"
            :indeterminate="taskInProgress && appStore.renderStatus !== RenderStatus.Rendering"
            :size="96"
            :width="8"
          >
          </v-progress-circular>
        </div>
        <div class="flex flex-col gap-4">
          <v-btn
            v-if="!taskInProgress"
            size="x-large"
            color="deep-purple-accent-3"
            prepend-icon="mdi-rocket-launch"
            @click="emit('renderVideo')"
          >
            开始合成
          </v-btn>
          <v-btn
            v-else
            size="x-large"
            color="red"
            prepend-icon="mdi-stop"
            @click="emit('cancelRender')"
          >
            停止合成
          </v-btn>
          <v-dialog v-model="configDialogShow" max-width="600" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" :disabled="taskInProgress"> 合成配置 </v-btn>
            </template>

            <v-card prepend-icon="mdi-text-box-edit-outline" title="配置合成选项">
              <v-card-text>
                <div class="w-full flex gap-2 mb-4 items-center">
                  <v-text-field
                    label="导出视频宽度"
                    v-model="config.outputSize.width"
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    v-model="config.outputSize.height"
                    label="导出视频高度"
                    hide-details
                    required
                  ></v-text-field>
                </div>
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
                    v-model="config.outputFileExt"
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
                    clearable
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

      <div class="w-full flex justify-center">
        <v-switch
          v-model="appStore.autoBatch"
          label="自动批量合成"
          color="indigo"
          density="compact"
          hide-details
          :disabled="taskInProgress"
        ></v-switch>
      </div>
    </v-sheet>

    <div class="absolute bottom-2 w-full flex justify-center text-sm">
      <span class="text-indigo cursor-pointer select-none" @click="handleOpenHomePage">
        Powered by YILS（博客地址：https://yils.blog）
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRaw, nextTick, computed } from 'vue'
import { RenderStatus, useAppStore } from '@/store'

const appStore = useAppStore()

const emit = defineEmits<{
  (e: 'renderVideo'): void
  (e: 'cancelRender'): void
}>()

const taskInProgress = computed(() => {
  return (
    appStore.renderStatus !== RenderStatus.None &&
    appStore.renderStatus !== RenderStatus.Completed &&
    appStore.renderStatus !== RenderStatus.Failed
  )
})

const renderProgress = ref(0)
window.ipcRenderer.on('render-video-progress', (_, progress: number) => {
  renderProgress.value = progress
})

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

const handleOpenHomePage = () => {
  window.electron.openExternal({ url: 'https://yils.blog' })
}
</script>

<style lang="scss" scoped>
//
</style>
