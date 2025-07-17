<template>
  <div class="h-0 flex-1">
    <v-sheet
      class="h-full px-2 pt-4 flex flex-col gap-6 items-center justify-between"
      border
      rounded
    >
      <div class="w-full h-full flex-1 flex gap-10 items-center justify-center">
        <v-progress-circular
          color="primary"
          model-value="0"
          :size="86"
          :width="8"
        ></v-progress-circular>
        <v-btn
          class=""
          size="x-large"
          color="deep-purple-accent-3"
          prepend-icon="mdi-rocket-launch"
        >
          开始合成
        </v-btn>
      </div>

      <div class="w-full flex gap-2">
        <v-text-field label="输出文件夹" density="compact"></v-text-field>
        <v-btn class="mt-[2px]" prepend-icon="mdi-folder-open"> 选择 </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
//
</style>
