<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { ipcRenderer } = window.require('electron')

const router = useRouter()
const route = useRoute()
const projectTree = ref([])
const selectedFileContent = ref('')

const loadFileContent = (fileName: string) => {
  // 模拟加载文件内容
  selectedFileContent.value = `// Content of ${fileName}`
}

const goBack = () => {
  router.push('/')
}

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
      <el-button @click="goBack" type="primary">返回</el-button>
      <div v-for="item in projectTree" :key="item.name" class="file-card">
        <el-card>
          <div @click="item.children ? null : loadFileContent(item.name)">
            {{ item.name }}
          </div>
        </el-card>
      </div>
    </el-aside>
    <el-main style="flex: 1;">
      <pre>{{ selectedFileContent }}</pre>
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
.el-main {
  padding: 10px;
  overflow-y: auto;
}
.file-card {
  margin-bottom: 10px;
}
.no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style> 