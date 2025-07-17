<template>
  <div class="w-full h-full flex flex-col gap-2">
    <v-sheet class="h-[200px] p-2 flex gap-2" border rounded>
      <v-textarea
        class="h-full"
        v-model="appStore.prompt"
        label="提示词"
        counter
        persistent-counter
        no-resize
      ></v-textarea>
      <div class="flex flex-col gap-2">
        <v-btn
          v-if="!isGenerating"
          prepend-icon="mdi-auto-fix"
          color="deep-purple-accent-3"
          stacked
          @click="handleGenerate"
        >
          生成
        </v-btn>
        <v-btn v-else prepend-icon="mdi-stop" color="red" stacked @click="handleStopGenerate">
          停止
        </v-btn>

        <v-dialog v-model="configDialogShow" max-width="600" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps"> 配置 </v-btn>
          </template>

          <v-card prepend-icon="mdi-text-box-edit-outline" title="配置大语言模型接口">
            <v-card-text>
              <v-text-field
                label="模型名称"
                v-model="config.modelName"
                required
                clearable
              ></v-text-field>
              <v-text-field
                label="API 地址"
                v-model="config.apiUrl"
                required
                clearable
              ></v-text-field>
              <v-text-field
                label="API Key"
                v-model="config.apiKey"
                type="password"
                required
                clearable
              ></v-text-field>
              <small class="text-caption text-medium-emphasis">兼容任意 OpenAI 标准接口</small>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="关闭" variant="plain" @click="handleCloseDialog"></v-btn>
              <v-btn
                color="success"
                text="测试"
                variant="tonal"
                :loading="testStatus === TestStatusEnum.LOADING"
                @click="handleTestConfig"
              ></v-btn>
              <v-btn color="primary" text="保存" variant="tonal" @click="handleSaveConfig"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { useAppStore } from '@/store'
import { nextTick, ref, toRaw } from 'vue'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { useToast } from 'vue-toastification'

const toast = useToast()
const appStore = useAppStore()

const outputText = ref('')
const isGenerating = ref(false)
const abortController = ref<AbortController | null>(null)
const handleGenerate = async () => {
  const openai = createOpenAI({
    baseURL: appStore.llmConfig.apiUrl,
    apiKey: appStore.llmConfig.apiKey,
  })
  abortController.value = new AbortController()
  isGenerating.value = true
  outputText.value = ''
  try {
    const result = streamText({
      model: openai(appStore.llmConfig.modelName),
      system: ``,
      prompt: appStore.prompt,
      onError: (error) => {
        throw error
      },
      abortSignal: abortController.value.signal,
    })
    for await (const textPart of result.textStream) {
      outputText.value += textPart
    }
  } catch (error) {
    console.log(`error`, error)
    // @ts-ignore
    if (error?.name !== 'AbortError' && error?.error?.name !== 'AbortError') {
      toast.error('生成失败，请检查大模型配置是否正确')
    }
  } finally {
    abortController.value = null
    isGenerating.value = false
  }
}
const handleStopGenerate = () => {
  if (abortController.value) {
    abortController.value.abort()
  }
}

// 配置大模型接口
const config = ref(structuredClone(toRaw(appStore.llmConfig)))
const configDialogShow = ref(false)
const resetConfigDialog = () => {
  config.value = structuredClone(toRaw(appStore.llmConfig))
}
const handleCloseDialog = () => {
  configDialogShow.value = false
  nextTick(resetConfigDialog)
}
const handleSaveConfig = () => {
  appStore.updateLLMConfig(config.value)
  configDialogShow.value = false
}

// 测试大模型连通性
enum TestStatusEnum {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
const testStatus = ref<TestStatusEnum>()
const handleTestConfig = async () => {
  testStatus.value = TestStatusEnum.LOADING
  const openai = createOpenAI({ baseURL: config.value.apiUrl, apiKey: config.value.apiKey })
  try {
    const result = await generateText({
      model: openai(config.value.modelName),
      prompt: 'Hello world',
    })
    console.log(`result`, result)
    testStatus.value = TestStatusEnum.SUCCESS
    toast.success('大模型连接成功')
  } catch (error) {
    console.log(`error`, error)
    testStatus.value = TestStatusEnum.ERROR
    toast.error('大模型连接失败，请检查配置是否正确')
  }
}
</script>

<style lang="scss" scoped>
//
</style>
