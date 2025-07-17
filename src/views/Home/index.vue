<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-[40px] window-drag relative border-b">
      <div class="window-control-bar-no-drag-mask"></div>
    </div>

    <div class="w-full h-0 flex-1 flex box-border gap-2 py-2 px-3">
      <div class="w-1/3 h-full">
        <TextGenerate />
      </div>
      <div class="w-1/3 h-full">
        <VideoManage />
      </div>
      <div class="w-1/3 h-full flex flex-col gap-3">
        <TtsControl />
        <VideoRender />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextGenerate from './components/text-generate.vue'
import VideoManage from './components/video-manage.vue'
import TtsControl from './components/tts-control.vue'
import VideoRender from './components/video-render.vue'
</script>

<style lang="scss" scoped>
//
</style>
