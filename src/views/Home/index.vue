<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-[40px] window-drag relative border-b">
      <div class="window-control-bar-no-drag-mask"></div>
    </div>

    <div class="w-full h-0 flex-1 flex box-border gap-2 py-2 px-3">
      <div class="w-1/3 h-full">
        <TextGenerate
          ref="TextGenerateInstance"
          :disabled="appStore.renderStatus === RenderStatus.GenerateText"
        />
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
import { RenderStatus, useAppStore } from '@/store'
import { useToast } from 'vue-toastification'
import { ListFilesFromFolderRecord } from '~/electron/types'
import random from 'random'

const toast = useToast()
const appStore = useAppStore()

// 渲染合成视频
const TextGenerateInstance = ref<InstanceType<typeof TextGenerate> | null>()
const VideoManageInstance = ref<InstanceType<typeof VideoManage> | null>()
const TtsControlInstance = ref<InstanceType<typeof TtsControl> | null>()
const handleRenderVideo = async () => {
  if (!appStore.renderConfig.outputFileName) {
    toast.warning('请先配置导出文件名')
    return
  }
  if (!appStore.renderConfig.outputPath) {
    toast.warning('请先配置导出文件夹')
    return
  }
  if (!appStore.renderConfig.outputSize?.width || !appStore.renderConfig.outputSize?.height) {
    toast.warning('请先配置导出分辨率（宽高）')
    return
  }

  let randomBgm: ListFilesFromFolderRecord | undefined = undefined
  try {
    const bgmList = await window.electron.listFilesFromFolder({
      folderPath: appStore.renderConfig.bgmPath.replace(/\\/g, '/'),
    })
    if (bgmList.length > 0) {
      randomBgm = random.choice(bgmList)
    }
  } catch (error) {
    console.log('获取背景音乐列表失败', error)
    toast.error('获取背景音乐列表失败，请检查文件夹是否存在')
  }

  try {
    // 获取文案
    appStore.updateRenderStatus(RenderStatus.GenerateText)
    const text = TextGenerateInstance.value?.getCurrentOutputText()
    if (!text) {
      toast.warning('请先生成文案')
      return
    }

    // TTS合成语音
    appStore.updateRenderStatus(RenderStatus.SynthesizedSpeech)
    const ttsResult = await TtsControlInstance.value?.synthesizedSpeechToFile({
      text,
      withCaption: true,
    })
    if (ttsResult?.duration === undefined) {
      toast.warning('语音合成失败，音频文件损坏')
      return
    }
    if (ttsResult?.duration === 0) {
      toast.warning('语音时长为0秒，可能文案为空')
      return
    }

    // 获取视频片段
    const videoSegments = VideoManageInstance.value?.getVideoSegments({
      duration: ttsResult.duration,
    })!

    // 合成视频
    appStore.updateRenderStatus(RenderStatus.Rendering)
    await window.electron.renderVideo({
      ...videoSegments,
      audioFiles: {
        bgm: randomBgm?.path,
      },
      outputSize: {
        width: appStore.renderConfig.outputSize.width,
        height: appStore.renderConfig.outputSize.height,
      },
      outputDuration: String(ttsResult.duration),
      outputPath:
        appStore.renderConfig.outputPath.replace(/\\/g, '/') +
        '/' +
        appStore.renderConfig.outputFileName +
        appStore.renderConfig.outputFileExt,
    })

    toast.success('视频合成成功')
    appStore.updateRenderStatus(RenderStatus.Completed)
  } catch (error) {
    console.error('视频合成失败:', error)
    // @ts-ignore
    const errorMessage = error?.message || error?.error?.message
    toast.error(
      `视频合成失败，请检查各项配置是否正确\n${errorMessage ? '错误信息：“' + errorMessage + '”' : ''}`,
    )
    appStore.updateRenderStatus(RenderStatus.Failed)
  }
}
</script>

<style lang="scss" scoped>
//
</style>
