<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-[40px] drag relative border-b">
      <div class="window-control-bar-no-drag-mask"></div>
    </div>

    <div class="w-full h-0 flex-1 flex box-border gap-2 py-2 px-3">
      <!-- AI文案生成 -->
      <div class="w-1/3 h-full flex flex-col gap-2">
        <v-sheet class="h-[200px] p-2 flex gap-2" border rounded>
          <v-textarea
            class="h-full"
            v-model="prompt"
            label="提示词"
            counter
            persistent-counter
            no-resize
          ></v-textarea>
          <div class="flex flex-col gap-2">
            <v-btn prepend-icon="mdi-auto-fix" stacked> 生成 </v-btn>
            <v-btn> 配置 </v-btn>
          </div>
        </v-sheet>
        <v-sheet class="h-0 flex-1 p-2" border rounded>
          <v-textarea
            class="h-full"
            v-model="outputText"
            label="输出文案（可编辑）"
            counter
            persistent-counter
            no-resize
          ></v-textarea>
        </v-sheet>
      </div>

      <!-- 分镜视频素材库 -->
      <div class="w-1/3 h-full">
        <v-sheet class="h-full p-2 flex flex-col" border rounded>
          <div class="flex gap-2">
            <v-text-field label="分镜视频素材文件夹" density="compact"></v-text-field>
            <v-btn prepend-icon="mdi-folder-open"> 选择 </v-btn>
          </div>

          <div class="flex-1 h-full w-full border">
            <v-empty-state
              headline="暂无内容"
              text="从上面选择一个包含足够分镜素材的文件夹"
            ></v-empty-state>
          </div>

          <div class="my-2">
            <v-btn prepend-icon="mdi-refresh" block> 刷新素材库 </v-btn>
          </div>
        </v-sheet>
      </div>

      <!-- 音频TTS、字幕、渲染任务 -->
      <div class="w-1/3 h-full flex flex-col gap-3">
        <v-sheet class="h-fit p-2" border rounded>
          <v-select density="comfortable" label="语言" :items="['中文', 'English']"></v-select>
          <v-select density="comfortable" label="性别" :items="['男性', '女性']"></v-select>
          <v-select
            density="comfortable"
            label="声音"
            :items="['普通话 - 中国 - Xiaoxiao', '粤语 - 中国香港 - HiuGaai']"
          ></v-select>
          <v-select density="comfortable" label="语速" :items="['慢', '中', '快']"></v-select>
          <v-text-field density="comfortable" label="试听文本"></v-text-field>
          <v-btn class="mb-2" prepend-icon="mdi-volume-high" block> 试听 </v-btn>
        </v-sheet>
        <v-sheet
          class="h-0 flex-1 p-2 flex flex-col gap-6 items-center justify-center"
          border
          rounded
        >
          <v-progress-circular
            color="primary"
            model-value="0"
            :size="86"
            :width="8"
          ></v-progress-circular>
          <v-btn class="" size="x-large" color="primary" prepend-icon="mdi-rocket-launch">
            开始合成
          </v-btn>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const prompt = ref('')
const outputText = ref('')
</script>

<style lang="scss" scoped>
//
</style>
