<template>
  <el-dialog
    ref="popoverRef"
    v-model="moduleValue"
    top="5vh"
    width="50%"
    append-to-body
    title="新建目录/页面"
    @before-close="handleClose"
    center
  >
    <el-radio-group v-model="liftType" @change="handleChange">
      <el-radio value="floder" size="large">目录</el-radio>
      <el-radio value="page" size="large">页面</el-radio>
    </el-radio-group>
    <main v-if="liftType === 'floder'">
        <h4>{{ dialogConfig.labelTitle }}</h4>
        <el-input v-model="labelTitle"></el-input>
        <div>
          <QuillEditor v-model:value="content" :options="editorOptions"/>
        </div>
        <Upload :imageUrl="imgUrl" @update-success="updateSuccess" @del-success="delSuccess"/>
        <!-- tag="transition-group" -->
        <draggable
          v-model="dragList"
          item-key="id"
          v-bind="dragOptions"
          :component-data="{
            tag: 'ul',
            type: 'transition',
            name: !drag ? 'flip-list' : null
          }"
          @start="drag = true"
          @end="drag = false">
          <template #item="{element}">
            <li class="drag-item">
              {{ element.label }}
            </li>
          </template>
        </draggable>
    </main>
    <main v-if="liftType === 'page'">
      <h4>{{ dialogConfig.labelTitle }}</h4>
      <el-input v-model="labelTitle"></el-input>
      <div>
        <QuillEditor v-model:value="content" :options="editorOptions"/>
      </div>
      <Upload :imageUrl="imgUrl" @update-success="updateSuccess" @del-success="delSuccess"/>
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
              <SvgIcon name="icon_update" class="text-lg page-icon" @click="uploadAudio(item)"/>
              <SvgIcon name="shanchu" class="text-lg page-icon" @click="delItem(index)"/>
            </el-form-item>
          </li>
          <li>
            <el-button id="addItemRef" type="primary" link size="small" @click="addItem">添加</el-button>
          </li>
        </ul>
      </el-form>
    </main>
    <template #footer>
      <el-button size="small" @click="moduleValue = false">取消</el-button>
      <el-button size="small" type="primary" @click="confirmLiftType(liftType)" :loading="btnLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { quillEditor as QuillEditor } from 'vue3-quill';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';
import Upload from '@/components/Upload/index.vue';
import editorOptionsData from './editorOpionts';
import { addCatalogApi, addContentApi } from '@/api/menu';
const route = useRoute();
interface Tree {
  [key: string]: any
}
interface WordItem {
  words: string;
  language: string;
  voice: string
}
const imgUrl = ref<string>('');
const moduleValue = ref<boolean>(false);
const emits = defineEmits(['addSuccess']);
const liftType = ref('floder');
const btnLoading = ref<boolean>(false);
const editorOptions = ref(editorOptionsData);
const dialogConfig = reactive({
  title: '目录配置',
  labelTitle: '目录名称',
  width: '40%',
  themeError: '请输入目录名称',
})
const formData = reactive({
  words: '',
  content: '',
  language: 'EN',
  wordsList: [
    {
      words: '',
      language: 'EN',
      voice: ''
    }
  ] as WordItem[]
})
const labelTitle = ref<string>('');
const content = ref<string>('');
const dragList = ref<Tree[]>([]);
const drag = ref<boolean>(false);

const open = () => {
  moduleValue.value = true;
}

const handleClose = () => {
  moduleValue.value = false;
  reset();
}

const updateSuccess = (url: string) => {
  imgUrl.value = url;
}

const delSuccess = () => {
  imgUrl.value = '';
}

const confirmLiftType = (liftType: string) => {
  const data: { [key: string]: any } = {};
  const subjectId = route.params.subjectId as string;
  data.subjectId = subjectId;
  if (liftType === 'floder') {
    data.catalogName = labelTitle.value;
    data.catalogDesc = content.value;
    data.contentList = dragList.value;
    addCatalog(data);
  } else {
    data.catalogId = '';
    data.pageName = labelTitle.value;
    formData.wordsList.forEach(item => {
      if (item.language === 'EN') {
        data.contentEnName = item.words;
        data.contentEnVoice = item.voice;
      }
      if (item.language === 'ES') {
        data.contentEsName = item.words;
        data.contentEsVoice = item.voice;
      }
    })
    addContent(data);
  }
};

const addCatalog = (data: any) => {
  btnLoading.value = true;
  addCatalogApi(data).then(() => {
    moduleValue.value = false;
    emits('addSuccess');
    console.log('添加成功');
  }).finally(() => {
    btnLoading.value = false;
  })
}

const addContent = (data: any) => {
  btnLoading.value = true;
  addContentApi(data).then(() => {
    moduleValue.value = false;
    emits('addSuccess');
    console.log('添加成功');
  }).finally(() => {
    btnLoading.value = false;
  })
}

const handleChange = (val: string | number | boolean | undefined) => {
  dialogConfig.title = '目录配置';
  dialogConfig.themeError = '请输入目录名称';
  dialogConfig.labelTitle = '目录名称';
  if (val === 'page') {
    dialogConfig.title = '页面配置';
    dialogConfig.themeError = '请输入页面名称';
    dialogConfig.labelTitle = '页面名称';
  }
}

const reset = () => {
  labelTitle.value = '';
  content.value = '';
  dragList.value = [];
  liftType.value = 'floder';
  handleChange('floder');
}

const uploadAudio = (item: WordItem) => {
  console.log('uploadAudio');
}

const delItem = (index: number) => {
  formData.wordsList.splice(index, 1);
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



const dragOptions = computed(() => {
  return {
    animation: 300,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost'
  }
})

defineExpose({
  open
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
