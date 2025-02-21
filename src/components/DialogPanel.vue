<template>
  <div class="dialog-panel">
    <p>对话面板内容</p>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加对话面板的逻辑
</script>

<style scoped>
.dialog-panel {
  width: 300px;
  background-color: #282c34; /* 统一底色 */
  border-left: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  color: #fff; /* 文字颜色 */
}
</style> 