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
      <Upload @update-success="updateSuccess" :imageUrl="subjectImg"/>
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
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRoute } from "vue-router"
import { quillEditor as QuillEditor } from 'vue3-quill';
import { updateSubjectApi } from '@/api/menu';
import draggable from 'vuedraggable';
import Upload from '@/components/Upload/index.vue';
import { ElMessage } from 'element-plus';
interface Tree {
  [key: string]: any
}
const moduleValue = ref(false);
const content = ref<string>('');
const label = ref<string>('');
const dragList = ref<Tree[]>([]);
const drag = ref<boolean>(false);
const route = useRoute();
const subjectImg = ref<string>('');
const dialogConfig = reactive({
  title: '主题页配置',
  labelTitle: '主题名称',
  width: '40%',
  themeError: '请输入主题名称',
})
const editorOptions = {
  placeholder: '请输入主题',
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
  dialogConfig.title = '主题页配置';
  dialogConfig.themeError = '请输入主题名称';
  dialogConfig.labelTitle = '主题名称';
  editorOptions.placeholder = '请输入主题';
  if (data.type !== 'theme') {
    dialogConfig.title = '目录配置';
    dialogConfig.themeError = '请输入目录名称';
    dialogConfig.labelTitle = '目录名称';
    editorOptions.placeholder = '请输入目录名称';
  }
  moduleValue.value = true;
  orginData = data;
  console.log(data);
  label.value = data.label;
  subjectImg.value = data.subjectImg;
  content.value = data.labelDesc;
  dragList.value = data.children;
}

const updateSuccess = (url: string) => {
  subjectImg.value = url;
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
  const catalogList: any[] = [];
  const contentList: any[] = [];
  dragList.value.forEach((item, index) => {
    if (item.type === 'folder') {
      item.catalogSort = index + 1;
      catalogList.push(item);
    } else {
      item.contentSort = index + 1;
      contentList.push(item);
    }
  })
  const subjectId = route.params.subjectId as string;
  const data = {
    subjectId,
    subjectName: label.value,
    subjectImg: subjectImg.value,
    subjectDesc: content.value,
    isExpired: 'N',
    catalogList,
    companyId: null, // ??
    contentList
  };
  updateSubjectApi(data).then(() => {
    ElMessage.success('编辑成功');
    handleClose();
    emit('editSuccess');
  });
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
