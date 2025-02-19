<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FileTree from './FileTree.vue'
import CodeEditor from './CodeEditor.vue'

const { ipcRenderer } = window.require('electron')

const router = useRouter()
const route = useRoute()
const projectTree = ref([])
const selectedFileContent = ref('')
const currentFilePath = ref('')

const loadFileContent = async (filePath: string) => {
  const content = await ipcRenderer.invoke('read-file', filePath)
  selectedFileContent.value = content
  currentFilePath.value = filePath
}

// 监听selectedFileContent的变化，并实时保存
watch(selectedFileContent, async (newContent) => {
  if (currentFilePath.value) {
    await ipcRenderer.invoke('write-file', currentFilePath.value, newContent)
  }
})

onMounted(async () => {
  const folderPath = route.query.folderPath as string
  if (folderPath) {
    const tree = await ipcRenderer.invoke('read-directory', folderPath)
    projectTree.value = tree
  }
})
</script>

<template>
  <el-container style="height: 100vh; width: 100vw;">
    <el-aside width="20%" class="no-scrollbar">
      <div class="file-list">
        <FileTree v-for="item in projectTree" :key="item.name" :item="item" :base-path="route.query.folderPath" @file-clicked="loadFileContent" />
      </div>
    </el-aside>
    <el-main style="flex: 1; display: flex; flex-direction: column;">
      <CodeEditor v-model:value="selectedFileContent" style="flex: 1;" />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
.el-aside {
  overflow-y: auto;
  border-right: 1px solid #ccc;
}
.file-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
}
.el-main {
  padding: 10px;
  overflow-y: auto;
  display: flex;
  background-color: #282c34; /* 设置黑底背景 */
}
pre {
  white-space: pre-wrap; /* 保留原始格式 */
  word-wrap: break-word; /* 防止长行溢出 */
  font-family: 'Courier New', Courier, monospace; /* 使用等宽字体 */
  text-align: left; /* 确保文本左对齐 */
  margin: 0; /* 去除默认的外边距 */
  flex: 1;
  position: relative;
  padding-left: 40px; /* 为行号留出空间 */
  background-color: #282c34; /* 设置黑底背景 */
  color: #abb2bf; /* 设置文本颜色 */
}
pre::before {
  content: attr(data-line-numbers);
  position: absolute;
  left: 0;
  top: 0;
  padding-right: 10px;
  border-right: 1px solid #ccc;
  color: #888;
  text-align: right;
  white-space: pre-wrap;
  pointer-events: none;
}
.no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace; /* 使用等宽字体 */
  line-height: 1.5; /* 设置行高 */
}
.view-line {
  text-align: left; /* 确保左对齐 */
}
</style> 