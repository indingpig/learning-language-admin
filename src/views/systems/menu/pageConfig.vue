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
      <Upload :image-url="imageUrl" @update-success="updateSuccess" @del-success="delSuccess"/>
      <el-form :model="formData">
        <ul>
          <li class="word-item" v-for="(item, index) in formData.wordsList" :key="index">
            <el-form-item class="word">
              <el-input v-model="item.wordsText" placeholder="请输入单词/句子" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="item.wordsLanguage" size="small">
                <el-radio-button label="ES" value="Spanish" />
                <el-radio-button label="EN" value="English" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="item.isWord" size="small">
                <el-radio-button label="单词" value="1" />
                <el-radio-button label="句子" value="0" />
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <SvgIcon name="icon_update" class="text-lg page-icon icon" @click="uploadAudio(index)"/>
              <SvgIcon name="check-blue" class="text-lg page-icon icon" v-if="item.wordsVoice"/>
              <SvgIcon name="check" class="text-lg icon" v-if="!item.wordsVoice"/>
              <SvgIcon name="bofang" class="text-lg page-icon icon" v-if="item.wordsVoice" @click="playAudio(item.wordsVoice)"/>
              <SvgIcon name="jingyin" class="text-lg icon" v-if="!item.wordsVoice"/>
              <SvgIcon name="shanchu" class="text-lg page-icon icon" @click="delItem(index)"/>
            </el-form-item>
          </li>
          <li>
            <el-button id="addItemRef" type="primary" link size="small" @click="addItem">添加</el-button>
          </li>
        </ul>
      </el-form>
    </main>
    <audio :src="MediaUrl" ref="audioRef"></audio>
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
interface BusinessWordsInfo {
  wordsId?: string;         // 详细内容编号
  contentId: string;       // 内容编号
  wordsText: string;       // 详细内容
  wordsVoice: string;      // 详细内容音频
  wordsVideo: string;      // 详细内容视频
  wordsLanguage: string;   // 详细内容语言
  wordsImg?: string;        // 内容图片
  wordsDesc?: string;       // 内容描述
  isWord: string;          // 是否单词
  wordsSort?: number;       // 内容排序
  isExpired: string;       // 是否过期 (Y=是, N=否)
}
interface BusinessContentInfo {
  contentId: string;       // 内容编号
  catalogId: string;       // 目录编号
  subjectId: string;       // 主题id
  contentName: string;     // 内容名称
  contentImg: string;      // 内容图片
  contentDesc: string;     // 内容描述
  contentSort?: number;     // 内容排序
  isExpired?: string;       // 是否过期 (Y=是, N=否)
  wordsList: BusinessWordsInfo[];  // 名下页面 (关联 BusinessWordsInfo 类型)
}
const OriginUrl = location.origin + '/';
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
  wordsText: '',
  content: '',
  language: 'EN',
  wordsList: [] as BusinessWordsInfo[]
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
const MediaUrl = ref('');
const audioRef = ref<HTMLAudioElement | null>(null);
let orginData: Tree = {
  label: '',
  type: 'theme',
  id: 1,
  children: []
}
let isAdd = true;
let tempCatalogId = '';
let tempContentId = '';
const handleOpen = (data: Tree, catalogId: string, addInt: boolean) => {
  moduleValue.value = true;
  isAdd = addInt;
  tempCatalogId = catalogId;
  tempContentId = data.contentId;
  if (!addInt) {
    orginData = data;
    label.value = data.label;
    content.value = data.contentDesc;
    imageUrl.value = data.contentImg;
    console.log(data);
    formData.wordsList = data.wordsList;
  }
}

const getOrigin = () => {
  return 'https://config.grandlmoon.com';
}

const playAudio = (str: string) => {
  MediaUrl.value = str;
  audioRef.value?.play();
}

const delSuccess = () => {
  imageUrl.value = '';
}

// const setList = (data: Tree) => {
//   formData.wordsList = data.wordsList;
// }

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
      formData.wordsList[currentIndex].wordsVoice = res.fileurl;
    });
  }
}

const addItem = () => {
  formData.wordsList.push({
    wordsText: '',
    wordsLanguage: 'English',
    wordsVoice: '',
    wordsVideo: '',
    contentId: tempContentId,
    isWord: '1',
    isExpired: 'N'
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
  const data: BusinessContentInfo = {
    subjectId,
    catalogId: tempCatalogId,
    contentId: tempContentId,
    contentImg: imageUrl.value,
    contentDesc: content.value,
    contentName: label.value,
    wordsList: formData.wordsList
  };
  return data;
}

const confirm = () => {
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
.icon + .icon {
  margin-left: 10px;
}

</style>
