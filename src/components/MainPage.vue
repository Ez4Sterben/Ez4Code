<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { ipcRenderer } = window.require('electron')

const router = useRouter()
const selectedFolder = ref('')

const openFolderDialog = async () => {
  const folderPath = await ipcRenderer.invoke('select-folder')
  if (folderPath) {
    selectedFolder.value = folderPath
    // 在选择文件夹后跳转到项目页面，并传递文件夹路径
    router.push({ path: '/project', query: { folderPath } })
  }
}
</script>

<template>
  <div>
    <h1>选择项目文件夹</h1>
    <button @click="openFolderDialog">打开文件夹</button>
    <div v-if="selectedFolder">
      <p>已选择文件夹: {{ selectedFolder }}</p>
      <!-- 这里可以展示项目的其他信息 -->
    </div>
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
}
</style> 