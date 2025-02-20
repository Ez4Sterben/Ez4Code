## SpecStory

## Fixing Code Color Display Issues (2/21/2025, 12:21:08 AM)

_**User**_

帮我解决代码没有颜色显示的问题

---

_**Assistant**_

根据你提供的代码和问题描述，代码没有颜色显示的问题可能是由于以下几个原因导致的：

1. **主题未正确应用**：确保在`CodeEditor.vue`中正确引入了主题并设置了主题

2. **语法高亮未启用**：需要确保代码编辑器正确配置了语言模式

3. **样式冲突**：检查是否有其他样式覆盖了代码颜色

以下是解决方案：

```vue:src/components/CodeEditor.vue
<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import ace from 'ace-builds'

// 引入主题和语言包
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/ext-language_tools'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits(['update:value'])

const editorContainer = ref<HTMLElement | null>(null)
let editor: ace.Ace.Editor | null = null

onMounted(() => {
  if (editorContainer.value) {
    editor = ace.edit(editorContainer.value, {
      mode: 'ace/mode/javascript', // 设置语言模式
      theme: 'ace/theme/twilight', // 使用twilight主题
      fontSize: 14,
      showPrintMargin: false,
      useWorker: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    })

    editor.setValue(props.value, -1)

    editor.on('change', () => {
      emit('update:value', editor.getValue())
    })
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

watch(() => props.value, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue, -1)
  }
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
```

关键点说明：

1. **确保安装了必要的依赖**：
```bash
npm install ace-builds
```

2. **检查样式优先级**：确保没有其他全局样式覆盖了代码颜色

3. **调试建议**：
- 在浏览器开发者工具中检查`<pre>`和`<code>`元素的样式
- 确认主题是否被正确应用
- 检查是否有其他JavaScript错误导致高亮功能失效

如果按照以上修改后仍然没有颜色显示，请告诉我具体的错误信息或现象，我会进一步帮你排查问题。

---

_**User**_

可以可以，还得是你啊，再帮我解决下文件树左侧有留白的问题

---

_**Assistant**_

要解决文件树左侧留白的问题，可以调整`ProjectPage.vue`中的样式。以下是具体的修改方案：



---



---

