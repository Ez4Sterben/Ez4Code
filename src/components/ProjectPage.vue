<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FileTree from './FileTree.vue'
import CodeEditor from './CodeEditor.vue'
import DialogPanel from './DialogPanel.vue'

const { ipcRenderer } = window.require('electron')

const router = useRouter()
const route = useRoute()
const projectTree = ref([])
const selectedFileContent = ref('')
const currentFilePath = ref('')
const isDialogVisible = ref(false)

const fileTreeWidth = ref(200)
const editorWidth = ref(600)
const dialogWidth = ref(300)

let resizing = false
let currentResizer = ''

const startResizing = (resizer: string) => {
  resizing = true
  currentResizer = resizer
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResizing)
}

const resize = (event: MouseEvent) => {
  if (!resizing) return
  if (currentResizer === 'fileTree') {
    fileTreeWidth.value = event.clientX
    editorWidth.value = window.innerWidth - fileTreeWidth.value - dialogWidth.value
  } else if (currentResizer === 'editor') {
    editorWidth.value = event.clientX - fileTreeWidth.value
    dialogWidth.value = window.innerWidth - fileTreeWidth.value - editorWidth.value
  }
}

const stopResizing = () => {
  resizing = false
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResizing)
}

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
  ipcRenderer.on('toggle-dialog', () => {
    isDialogVisible.value = !isDialogVisible.value
  })

  const folderPath = route.query.folderPath as string
  if (folderPath) {
    const tree = await ipcRenderer.invoke('read-directory', folderPath)
    projectTree.value = tree
  }
  ipcRenderer.send('page-status', 'project')
})

onBeforeUnmount(() => {
  ipcRenderer.removeAllListeners('toggle-dialog')
  ipcRenderer.send('page-status', 'other')
})
</script>

<template>
  <div class="project-container">
    <div :style="{ width: fileTreeWidth + 'px' }" class="no-scrollbar file-tree">
      <div class="file-list">
        <FileTree v-for="item in projectTree" :key="item.name" :item="item" :base-path="route.query.folderPath" @file-clicked="loadFileContent" />
      </div>
    </div>
    <div class="resizer" @mousedown="startResizing('fileTree')"></div>
    <div :style="{ width: editorWidth + 'px' }" class="editor-main">
      <div class="code-editor-container">
        <CodeEditor v-model:value="selectedFileContent" />
      </div>
      <div class="dialog-container">
        <DialogPanel v-if="isDialogVisible" :style="{ width: dialogWidth + 'px' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
}

.file-tree {
  overflow-y: auto;
  border-right: 1px solid #ccc;
  padding: 0 !important;
  margin: 0 !important;
  background-color: #282c34;
  color: #fff;
}

.editor-main {
  display: flex;
  position: relative;
  background-color: #282c34;
  color: #fff;
}

.code-editor-container {
  flex: 1;
  overflow-y: auto;
  height: 100vh; /* 代码区域一屏高 */
}

.dialog-container {
  width: 300px;
  overflow-y: auto;
  height: 100vh; /* 对话面板一屏高 */
}

.resizer {
  width: 5px;
  cursor: col-resize;
  background-color: #ccc;
  position: relative;
  z-index: 1;
}

.dialog-panel {
  background-color: #282c34;
  border-left: 1px solid #ccc;
  padding: 10px;
  color: #fff;
}

.no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
.view-line {
  text-align: left; /* 确保左对齐 */
}
</style> 