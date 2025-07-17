<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
//
</style>
