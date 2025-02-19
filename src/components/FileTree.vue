<template>
  <div>
    <div @click="handleClick" class="file-card">
      <span v-if="item.children" class="folder-icon">{{ isOpen ? '📂' : '📁' }}</span>
      <span v-else class="file-icon">📄</span>
      {{ item.name }}
    </div>
    <div v-if="isOpen" class="children" v-for="child in item.children" :key="child.name">
      <FileTree :item="child" :base-path="fullPath" @file-clicked="$emit('file-clicked', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  item: { name: string; children?: any[] }
  basePath: string
}>()

const emit = defineEmits(['file-clicked'])

const isOpen = ref(false)

const fullPath = `${props.basePath}/${props.item.name}`

const handleClick = () => {
  if (props.item.children) {
    isOpen.value = !isOpen.value
  } else {
    // 如果是文件，触发文件点击事件，传递完整路径
    emit('file-clicked', fullPath)
  }
}
</script>

<style scoped>
.file-card {
  margin-bottom: 1px;
  padding: 0;
  font-size: 11px;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  border-radius: 1px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
}
.file-card:hover {
  background-color: #444;
}
.folder-icon, .file-icon {
  margin-right: 5px;
}
.children {
  margin-left: 15px;
}
</style> 