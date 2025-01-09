<template>
  <el-dialog
    title="广告图配置"
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
      <Upload :imageUrl="imageUrl" @update-success="updateSuccess"/>
      <el-form :model="formData">
        <el-form-item prop="url">
          <el-input v-model="formData.url" placeholder="请输入链接地址" size="small"></el-input>
        </el-form-item>
      </el-form>
    </main>
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Upload from '@/components/Upload/index.vue';
import { getAdApi, addAdApi } from '@/api/menu';
import { ElMessage } from 'element-plus';
const moduleValue = ref(false);
const imageUrl = ref('');
const formData = reactive({
  picId: '',
  url: ''
})
const handleClose = () => {
  moduleValue.value = false;
}
const handleOpen = (id: string) => {
  getAdApi(id).then((res: any) => {
    formData.picId = res.picId;
    formData.url = res.url;
    moduleValue.value = true;
  })
}

const updateSuccess = (url: string) => {
  imageUrl.value = url;
}

const addAd = () => {
  const data = {
    advertiseImg: imageUrl.value,
    advertiseLink: formData.url,

  }
  addAdApi(formData).then(() => {
    ElMessage.success('添加成功');
    handleClose();
  })
}

const confirm = () => {
  if (!formData.url) {
    ElMessage.error('请输入链接地址');
    return;
  }
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
