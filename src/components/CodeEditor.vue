<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits(['update:value'])

const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: props.value,
      language: 'javascript', // 根据需要设置语言
      theme: 'vs-dark', // 使用黑暗主题
      automaticLayout: true,
      minimap: { enabled: false }, // 禁用小地图
      lineNumbers: 'on', // 显示行号
      scrollBeyondLastLine: false, // 禁止滚动超出最后一行
      wordWrap: 'on', // 启用自动换行
      padding: { top: 0, bottom: 0 }, // 确保没有额外的内边距
      fontSize: 14, // 设置字体大小
      fontFamily: 'Courier New, monospace', // 使用等宽字体
    })

    editor.onDidChangeModelContent(() => {
      if (editor) {
        emit('update:value', editor.getValue())
      }
    })
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})

watch(() => props.value, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})
</script>

<style scoped>
.editor-container {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style> 