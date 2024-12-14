<template>
  <el-dialog
    :title="dialogConfig.title"
    v-model="moduleValue"
    :before-close="handleClose"
    top="5vh"
    width="50%"
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
      <el-form :model="formData">
        <ul>
          <li class="word-item" v-for="(item, index) in formData.wordsList" :key="index">
            <el-form-item class="word">
              <el-input v-model="item.words" placeholder="请输入单词/句子" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="item.language" size="small">
                <el-radio-button label="ES" value="ES" />
                <el-radio-button label="EN" value="EN" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <SvgIcon name="icon_update" class="text-lg page-icon" @click="uploadAudio"/>
              <SvgIcon name="shanchu" class="text-lg page-icon" @click="delItem(index)"/>
            </el-form-item>
          </li>
          <li>
            <el-button id="addItemRef" type="text" size="small" @click="addItem">添加</el-button>
          </li>
        </ul>
      </el-form>
    </main>
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue';
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
const formData = reactive({
  words: '',
  content: '',
  language: 'EN',
  wordsList: [
    {
      words: '',
      language: 'EN',
    }
  ]
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

const addItem = () => {
  formData.wordsList.push({
    words: '',
    language: 'EN'
  })
  nextTick(() => {
    const addItemRefDom = document.getElementById('addItemRef');
    addItemRefDom?.scrollIntoView({ behavior: 'smooth' });
  })
}

const uploadAudio = () => {
  console.log('uploadAudio');
}

const delItem = (index: number) => {
  formData.wordsList.splice(index, 1);
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
.word-item {
  display: flex;
  gap: 10px;
  .word {
    flex: 1.5;
  }
}
.page-icon {
  cursor: pointer;
  color: #409EFF;
}
.page-icon + .page-icon {
  margin-left: 10px;
}

</style>
