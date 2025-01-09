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
      <Upload :image-url="imageUrl" @update-success="updateSuccess"/>
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
              <SvgIcon name="icon_update" class="text-lg page-icon" @click="uploadAudio(index)"/>
              <SvgIcon name="shanchu" class="text-lg page-icon" @click="delItem(index)"/>
            </el-form-item>
          </li>
          <li>
            <el-button id="addItemRef" type="primary" link size="small" @click="addItem">添加</el-button>
          </li>
        </ul>
      </el-form>
    </main>
    <input ref="audioInputRef" type="file" accept=".mp3, .wav, .mp4, .webm, audio/mpeg, audio/wav, video/mp4, video/webm" @change="handleUpload" v-show="false"/>
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue';
import { useRoute } from "vue-router"
import { quillEditor as QuillEditor } from 'vue3-quill';
import { addContentApi, uploadApi, updateContentApi } from '@/api/menu';
import Upload from '@/components/Upload/index.vue';
import editorOptionsData from './editorOpionts';
import { ElMessage } from 'element-plus';
interface Tree {
  [key: string]: any
}
interface WordItem {
  words: string;
  language: string;
  voice: string
}
const moduleValue = ref(false);
const content = ref<string>('');
const label = ref<string>('');
const route = useRoute();
const imageUrl = ref<string>('');
const audioInputRef = ref<HTMLInputElement | null>(null);
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
  wordsList: [] as WordItem[]
})
const editorOptions = ref(editorOptionsData);
const emit = defineEmits(['editSuccess']);
const handleClose = () => {
  moduleValue.value = false;
  label.value = '';
  content.value = '';
  imageUrl.value = '';
  formData.wordsList = [];

}
let orginData: Tree = {
  label: '',
  type: 'theme',
  id: 1,
  children: []
}
let isAdd = true;
let tempCatalogId = '';
const handleOpen = (data: Tree, catalogId: string, addInt: boolean) => {
  moduleValue.value = true;
  isAdd = addInt;
  tempCatalogId = catalogId;
  if (!addInt) {
    orginData = data;
    label.value = data.label;
    content.value = data.contentDesc;
    imageUrl.value = data.contentImg;
    console.log(data);
    setList(data);
  }
}

const setList = (data: Tree) => {
  formData.wordsList = [];
  if (data.contentEnName) {
    formData.wordsList.push({
      words: data.contentEnName,
      voice: data.contentEnVoice,
      language: 'EN'
    });
  }
  if (data.contentEnSentences) {
    formData.wordsList.push({
      words: data.contentEnSentences,
      voice: data.enSentencesVoice,
      language: 'EN'
    });
  }
  if (data.contentEsName) {
    formData.wordsList.push({
      words: data.contentEsName,
      voice: data.contentEsVoice,
      language: 'ES'
    });
  }
  if (data.contentEsSentences) {
    formData.wordsList.push({
      words: data.contentEsSentences,
      voice: data.esSentencesVoice,
      language: 'ES'
    });
  }
}

const updateSuccess = (url: string) => {
  imageUrl.value = url;
}

const handleUpload = () => {
  const file = audioInputRef.value?.files?.[0];
  if (file) {
    const Data = new FormData();
    Data.append('file', file);
    Data.append('name', file.name);
    uploadApi(Data).then((res: any) => {
      console.log('上传成功', res);
      ElMessage.success('上传成功');
      formData.wordsList[currentIndex].voice = res.fileurl;
    });
  }
}

const addItem = () => {
  formData.wordsList.push({
    words: '',
    language: 'EN',
    voice: ''
  })
  nextTick(() => {
    const addItemRefDom = document.getElementById('addItemRef');
    addItemRefDom?.scrollIntoView({ behavior: 'smooth' });
  })
}
let currentIndex = 0;
const uploadAudio = (index: number) => {
  currentIndex = index;
  audioInputRef.value?.click();
}

const delItem = (index: number) => {
  formData.wordsList.splice(index, 1);
}

const addContent = (data: any) => {
  addContentApi(data).then(res => {
    emit('editSuccess', orginData);
    ElMessage.success('添加成功');
    handleClose();
  })
}

const updateContent = (data: any) => {
  updateContentApi(data).then(res => {
    emit('editSuccess', orginData);
    ElMessage.success('修改成功');
    handleClose();
  })
}

const getContent = () => {
  const subjectId = route.params.subjectId as string;
  const data = {
    subjectId,
    catalogId: tempCatalogId,
    contentImg: imageUrl.value,
    contentDesc: content.value,
    contentName: label.value,
    contentEnName: '',
    contentEnVoice: '',
    contentEsName: '',
    contentEsVoice: '',
  } as { [key: string]: any }
  formData.wordsList.forEach((item, index) => {
    if (item.language === 'EN') {
      if (index % 2 === 0) {
        data.contentEnName = item.words;
        data.contentEnVoice = item.voice;
      } else {
        data.contentEnSentences = item.words;
        data.enSentencesVoice = item.voice;
      }
    }
    if (item.language === 'ES') {
      if (index % 2 === 0) {
        data.contentEsName = item.words;
        data.contentEsVoice = item.voice;
      } else {
        data.contentEsSentences = item.words;
        data.esSentencesVoice = item.voice;
      }
    }
  })
  return data;
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
  const data = getContent();
  if (isAdd) {
    addContent(data);
  } else {
    updateContent(data);
  }
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
