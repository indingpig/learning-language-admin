<template>
  <el-dialog
    :title="dialogConfig.title"
    v-model="moduleValue"
    :before-close="handleClose"
    top="5vh"
    width="40%"
    append-to-body
    class="theme-config"
    :close-on-click-modal="false"
    center
  >
    <main>
      <h4>{{ dialogConfig.labelTitle }}</h4>
      <el-input v-model="label"></el-input>
      <div>
        <QuillEditor v-model:value="content" :options="editorOptions"/>
      </div>
      <Upload />
    </main>
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { quillEditor as QuillEditor } from 'vue3-quill';
import Upload from '@/components/Upload/index.vue';
import { ElMessage } from 'element-plus';
interface Tree {
  [key: string]: any
}
const moduleValue = ref(false);
const content = ref<string>('');
const label = ref<string>('');
const dialogConfig = reactive({
  title: '页面配置',
  labelTitle: '页面名称',
  width: '40%',
  themeError: '请输入页面名称',
})
const editorOptions = {
  placeholder: '请输入页面名称',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }]
    ]
  }
}
const emit = defineEmits(['editSuccess']);
const handleClose = () => {
  moduleValue.value = false;
}
let orginData: Tree = {
  label: '',
  type: 'theme',
  id: 1,
  children: []
}
const handleOpen = (data: Tree) => {
  moduleValue.value = true;
  orginData = data;
  label.value = data.label;
  content.value = data.theme;
}

const confirm = () => {
  if (!label.value) {
    ElMessage.error(dialogConfig.themeError);
    return;
  }
  if (!content.value) {
    ElMessage.error(dialogConfig.themeError);
    return;
  }
  orginData.label = label.value;
  emit('editSuccess', orginData);
  handleClose();
}


defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
.theme-config :global(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}
.theme-config {
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h4 {
      margin: 0;
    }
  }
}
.drag-item {
  padding: 10px;
  margin: 5px 0;
  // background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: grab;
}

.drag-item:active {
  cursor: grabbing;
  background-color: #e0e0e0;
}
</style>
