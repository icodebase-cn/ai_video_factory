<template>
  <div class="w-full h-full">
    <v-sheet class="h-full p-2 flex flex-col" border rounded>
      <div class="flex gap-2">
        <v-text-field label="分镜视频素材文件夹" density="compact"></v-text-field>
        <v-btn class="mt-[2px]" prepend-icon="mdi-folder-open"> 选择 </v-btn>
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
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
//
</style>
