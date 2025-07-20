<template>
  <div class="layout-container">
    <div class="logo" v-if="!route.meta.hideAppIcon">
      <img src="/icon.png" alt="" />
      <span>{{ GlobalSetting.appName }}</span>
    </div>
    <div class="window-control-bar">
      <div class="control-btn control-btn-min" @click="handleMin">
        <v-icon icon="mdi-window-minimize" size="small" />
      </div>
      <div class="control-btn control-btn-max" @click="handleMax">
        <v-icon icon="mdi-window-maximize" size="small" v-if="!windowIsMaxed" />
        <v-icon icon="mdi-window-restore" size="small" v-else />
      </div>
      <div class="control-btn control-btn-close" @click="handleClose">
        <v-icon icon="mdi-window-close" size="small" />
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import GlobalSetting from '../../setting.global'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const windowIsMaxed = ref(false)

window.addEventListener('resize', async () => {
  windowIsMaxed.value = await window.electron.isWinMaxed()
})

const handleMin = () => {
  window.electron.winMin()
}
const handleMax = () => {
  window.electron.winMax()
}
const handleClose = () => {
  window.electron.winClose()
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  --title-bar-height: 40px;

  .logo {
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    height: var(--title-bar-height);
    padding-left: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    user-select: none;
    -webkit-app-region: drag;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .window-control-bar {
    position: absolute;
    z-index: 9999;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    user-select: none;

    .control-btn {
      transition: all 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 42px;
      height: var(--title-bar-height);
      box-sizing: border-box;

      &:hover {
        @apply bg-gray-200;
      }

      &-close {
        &:hover {
          @apply text-white bg-red-600;
        }
      }
    }
  }
}
</style>
