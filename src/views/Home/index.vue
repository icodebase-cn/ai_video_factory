<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-[40px] window-drag relative border-b">
      <div class="window-control-bar-no-drag-mask"></div>
    </div>

    <div class="w-full h-0 flex-1 flex box-border gap-2 py-2 px-3">
      <div class="w-1/3 h-full">
        <TextGenerate ref="TextGenerateInstance" />
      </div>
      <div class="w-1/3 h-full">
        <VideoManage ref="VideoManageInstance" />
      </div>
      <div class="w-1/3 h-full flex flex-col gap-3">
        <TtsControl ref="TtsControlInstance" />
        <VideoRender @render-video="handleRenderVideo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextGenerate from './components/text-generate.vue'
import VideoManage from './components/video-manage.vue'
import TtsControl from './components/tts-control.vue'
import VideoRender from './components/video-render.vue'

import { ref } from 'vue'
import { useAppStore } from '@/store'
import { useToast } from 'vue-toastification'

const toast = useToast()
const appStore = useAppStore()

// 渲染合成视频
const TextGenerateInstance = ref<InstanceType<typeof TextGenerate> | null>()
const VideoManageInstance = ref<InstanceType<typeof VideoManage> | null>()
const TtsControlInstance = ref<InstanceType<typeof TtsControl> | null>()
const handleRenderVideo = async () => {
  if (!appStore.renderConfig.outputFileName || !appStore.renderConfig.outputPath) {
    toast.warning('请先配置合成导出的文件名和文件夹')
  }

  try {
    // 获取文案
    const text = TextGenerateInstance.value?.getCurrentOutputText()
    if (!text) {
      toast.warning('请先生成文案')
      return
    }

    toast.info('即将开发完成，敬请期待')
    return

    // TTS合成语音
    await TtsControlInstance.value?.synthesizedSpeechToFile({ withCaption: true })

    // 获取视频片段
    // const videoSegments = VideoManageInstance.value?.getVideoSegments()

    // await window.electron.renderVideo({})
  } catch (error) {
    console.log('合成视频失败:', error)
    // @ts-ignore
    const errorMessage = error?.message || error?.error?.message
    toast.error(
      `视频合成失败，请检查各项配置是否正确\n${errorMessage ? '错误信息：“' + errorMessage + '”' : ''}`,
    )
  }
}
</script>

<style lang="scss" scoped>
//
</style>
