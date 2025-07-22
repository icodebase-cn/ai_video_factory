<template>
  <div class="w-full h-full">
    <video
      ref="Video"
      class="w-full h-full object-cover"
      :src="'file://' + asset.path"
      muted
      loop
      preload="metadata"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ListFilesFromFolderRecord } from 'electron/types'
import { ref } from 'vue'

defineProps<{ asset: ListFilesFromFolderRecord }>()
const Video = ref<HTMLVideoElement | null>(null)

const handleMouseEnter = () => {
  Video.value?.play()
}
const handleMouseLeave = () => {
  Video.value?.pause()
  if (Video.value) {
    Video.value.currentTime = 0
  }
}
</script>

<style lang="scss" scoped>
//
</style>
