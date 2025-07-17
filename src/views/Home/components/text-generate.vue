<template>
  <div class="w-full h-full flex flex-col gap-2">
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
        <v-btn prepend-icon="mdi-auto-fix" color="deep-purple-accent-3" stacked> 生成 </v-btn>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const prompt = ref('')
const outputText = ref('')
</script>

<style lang="scss" scoped>
//
</style>
